import React, { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentView, setCurrentView] = useState('upload');
  const [jobId, setJobId] = useState(null);
  const [filename, setFilename] = useState(null);
  const [error, setError] = useState(null);
  const [processingMessage, setProcessingMessage] = useState('Separating audio tracks...');

  const resetState = () => {
    setCurrentView('upload');
    setJobId(null);
    setFilename(null);
    setError(null);
    setProcessingMessage('Separating audio tracks...');
  };

  const value = useMemo(
    () => ({
      currentView,
      setCurrentView,
      jobId,
      setJobId,
      filename,
      setFilename,
      error,
      setError,
      processingMessage,
      setProcessingMessage,
      resetState
    }),
    [currentView, jobId, filename, error, processingMessage]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
