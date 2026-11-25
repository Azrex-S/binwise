import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_FRONTIER_MODEL = process.env.GEMINI_FRONTIER_MODEL || 'gemini-2.5-pro';

app.use(cors());
app.use(express.json());

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error('Unsupported file type. Please upload a JPEG, PNG, WEBP, or GIF image.'));
      return;
    }
    cb(null, true);
  },
});

const VALID_CATEGORIES = new Set(['wet', 'dry', 'hazardous', 'uncertain']);

const DEMO_SAMPLES = [
  {
    item_name: 'Banana Peel',
    category: 'wet',
    confidence: 0.96,
    reason: 'Banana peels are biodegradable organic matter rich in nutrients and moisture.',
    disposal_method: 'Place in the green wet waste bin for composting or municipal organic collection.',
    preparation: 'Ensure no plastic stickers or rubber bands are attached.',
    safety_warning: null,
  },
  {
    item_name: 'PET Plastic Water Bottle',
    category: 'dry',
    confidence: 0.94,
    reason: 'Clear PET plastic bottles are non-biodegradable dry waste.',
    disposal_method: 'Place in the blue dry waste bin. Local municipal rules determine whether it is sent to a Material Recovery Facility (MRF) for recycling.',
    preparation: 'Empty any remaining liquid, rinse lightly, and crush to save space.',
    safety_warning: null,
  },
  {
    item_name: 'Used AA Alkaline Battery',
    category: 'hazardous',
    confidence: 0.95,
    reason: 'Batteries contain heavy metals and corrosive electrolytes that can leach into soil and groundwater.',
    disposal_method: 'Do not place in regular wet or dry bins. Drop off at an authorized e-waste/hazardous waste collection center per local municipal guidelines.',
    preparation: 'Tape the battery terminals with non-conductive tape and store in a dry container until drop-off.',
    safety_warning: 'Contains toxic chemicals. Never burn, crush, or dispose of in regular household trash.',
  },
  {
    item_name: 'Cardboard Delivery Box',
    category: 'dry',
    confidence: 0.93,
    reason: 'Clean corrugated cardboard is dry paper-based waste.',
    disposal_method: 'Place in the dry waste bin or hand over to a local kabadiwala / municipal dry waste collection.',
    preparation: 'Flatten the box and remove plastic packing tape if possible. Keep it dry and free of food grease.',
    safety_warning: null,
  },
];

function pickDemoSample(filename = '') {
  const lower = filename.toLowerCase();
  if (lower.includes('banana') || lower.includes('peel') || lower.includes('veg') || lower.includes('food')) {
    return DEMO_SAMPLES[0];
  }
  if (lower.includes('bottle') || lower.includes('plastic')) {
    return DEMO_SAMPLES[1];
  }
  if (lower.includes('battery') || lower.includes('bulb') || lower.includes('chem')) {
    return DEMO_SAMPLES[2];
  }
  if (lower.includes('box') || lower.includes('cardboard') || lower.includes('paper')) {
    return DEMO_SAMPLES[3];
  }
  return DEMO_SAMPLES[Math.floor(Math.random() * DEMO_SAMPLES.length)];
}

function validateClassification(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid AI response format.');
  }

  const category = typeof raw.category === 'string' ? raw.category.toLowerCase().trim() : 'uncertain';
  const normalizedCategory = VALID_CATEGORIES.has(category) ? category : 'uncertain';

  let confidence = Number(raw.confidence);
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    confidence = 0.5;
  }

  const finalCategory = confidence < 0.55 ? 'uncertain' : normalizedCategory;

  return {
    item_name: typeof raw.item_name === 'string' && raw.item_name.trim()
      ? raw.item_name.trim()
      : 'Unidentified Item',
    category: finalCategory,
    confidence: Number(confidence.toFixed(2)),
    reason: typeof raw.reason === 'string' && raw.reason.trim()
      ? raw.reason.trim()
      : 'Classification based on visual characteristics of the item.',
    disposal_method: typeof raw.disposal_method === 'string' && raw.disposal_method.trim()
      ? raw.disposal_method.trim()
      : 'Check with your local municipal corporation guidelines for proper disposal.',
    preparation: typeof raw.preparation === 'string' && raw.preparation.trim()
      ? raw.preparation.trim()
      : 'Keep separate from other waste streams.',
    safety_warning: typeof raw.safety_warning === 'string' && raw.safety_warning.trim()
      ? raw.safety_warning.trim()
      : null,
  };
}

const SYSTEM_PROMPT = `You are BinWise, an AI waste segregation assistant for Indian households.
Analyze the uploaded image and classify the primary waste item into one of:
- "wet": biodegradable organic waste (vegetable peels, leftover food, fruit waste, tea leaves, garden waste).
- "dry": non-biodegradable dry waste (paper, cardboard, plastic bottles, glass containers, metal cans, clean packaging).
- "hazardous": batteries, e-waste, chemical containers, expired medicines, used CFL/LED bulbs, sharp medical waste, paint/pesticide cans.
- "uncertain": if the image is blurry, ambiguous, contains multiple mixed waste types that cannot be separated, or you are not confident (< 0.55 confidence).

Important rules:
1. Do NOT force uncertain items into a category. Use "uncertain" when unsure.
2. Handle composite/multi-material objects carefully (explain how to separate if possible, or mark uncertain).
3. Do NOT claim an item is recyclable merely because it is dry waste; state that recycling depends on local municipal rules.
4. Provide clear safety warnings for hazardous items (and null when not applicable).
5. Keep instructions practical, concise, and easy to understand for everyday households in India.`;

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    model: GEMINI_MODEL,
  });
});

app.post('/api/classify-waste', (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Image is too large. Maximum allowed size is 10 MB.' });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided. Please upload an image.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Demo mode fallback when GEMINI_API_KEY is not configured
    if (!apiKey) {
      const sample = pickDemoSample(req.file.originalname);
      return res.json({
        ...sample,
        mode: 'demo',
        demo_notice: 'Simulated demo response (GEMINI_API_KEY not configured on server).',
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const base64Image = req.file.buffer.toString('base64');

      const classifyWithModel = async (modelName) => {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [
                { text: SYSTEM_PROMPT },
                {
                  inlineData: {
                    mimeType: req.file.mimetype,
                    data: base64Image,
                  },
                },
                { text: 'Classify this waste item and return structured JSON.' },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                item_name: { type: Type.STRING },
                category: { type: Type.STRING, enum: ['wet', 'dry', 'hazardous', 'uncertain'] },
                confidence: { type: Type.NUMBER },
                reason: { type: Type.STRING },
                disposal_method: { type: Type.STRING },
                preparation: { type: Type.STRING },
                safety_warning: { type: Type.STRING, nullable: true },
              },
              required: ['item_name', 'category', 'confidence', 'reason', 'disposal_method', 'preparation'],
            },
          },
        });

        const text = response.text;
        if (!text) {
          throw new Error('Empty response received from Gemini API.');
        }
        return validateClassification(JSON.parse(text));
      };

      // "Cheap by default, frontier on exception" routing & guardrail
      let validated = await classifyWithModel(GEMINI_MODEL);
      let routedModel = GEMINI_MODEL;
      let escalated = false;

      if (validated.confidence < 0.75 || validated.category === 'uncertain') {
        try {
          const frontierResult = await classifyWithModel(GEMINI_FRONTIER_MODEL);
          if (frontierResult.confidence >= validated.confidence) {
            validated = frontierResult;
            routedModel = GEMINI_FRONTIER_MODEL;
            escalated = true;
          }
        } catch (escalationErr) {
          console.warn('Frontier escalation failed, using fast model result:', escalationErr.message);
        }
      }

      return res.json({
        ...validated,
        mode: 'ai',
        routed_model: routedModel,
        escalated,
      });
    } catch (apiError) {
      console.error('Gemini API classification error:', apiError);
      return res.status(502).json({
        error: 'Failed to analyze image with AI service. Please try again.',
        details: process.env.NODE_ENV === 'development' ? apiError.message : undefined,
      });
    }
  });
});

// Serve built frontend in production
const frontendDist = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BinWise backend running on http://localhost:${PORT}`);
  console.log(`AI Mode: ${process.env.GEMINI_API_KEY ? `Gemini (${GEMINI_MODEL})` : 'Demo Mode (no GEMINI_API_KEY)'}`);
});
