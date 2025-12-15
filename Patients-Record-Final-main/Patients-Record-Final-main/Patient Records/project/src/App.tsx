import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Loader from './components/Loader';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>('landing');
  const [isLoading, setIsLoading] = useState(false);

  const handlePageTransition = (page: 'landing' | 'dashboard') => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {isLoading ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center">
            <Loader />
          </div>
        </div>
      ) : currentPage === 'landing' ? (
        <LandingPage onAccessRecords={() => handlePageTransition('dashboard')} />
      ) : (
        <Dashboard onBackToHome={() => handlePageTransition('landing')} />
      )}
    </div>
  );
}

export default App;