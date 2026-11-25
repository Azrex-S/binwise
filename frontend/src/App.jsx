import React, { useState } from 'react';
import { BinWiseProvider, useBinWise } from './context/BinWiseContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ScannerPage from './pages/ScannerPage';
import ResultPage from './pages/ResultPage';
import LibraryPage from './pages/LibraryPage';
import HistoryPage from './pages/HistoryPage';
import EcoPointsPage from './pages/EcoPointsPage';

function BinWiseApp() {
  const [currentPage, setCurrentPage] = useState('landing');
  const { latestResult, setLatestResult } = useBinWise();

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewScan = (scan) => {
    setLatestResult(scan);
    navigate('result');
  };

  const handleResultReady = (result) => {
    setLatestResult(result);
    navigate('result');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-[#1F2937]">
      <Navbar currentPage={currentPage} onNavigate={navigate} />

      <main className="flex-1">
        {currentPage === 'landing' && <LandingPage onNavigate={navigate} />}
        {currentPage === 'dashboard' && (
          <DashboardPage onNavigate={navigate} onViewScan={handleViewScan} />
        )}
        {currentPage === 'scanner' && (
          <ScannerPage onResultReady={handleResultReady} />
        )}
        {currentPage === 'result' && (
          <ResultPage result={latestResult} onNavigate={navigate} />
        )}
        {currentPage === 'library' && <LibraryPage />}
        {currentPage === 'history' && (
          <HistoryPage onNavigate={navigate} onViewScan={handleViewScan} />
        )}
        {currentPage === 'points' && <EcoPointsPage />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <BinWiseProvider>
      <BinWiseApp />
    </BinWiseProvider>
  );
}
