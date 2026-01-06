import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useAppContext } from './context/AppContext';
import { useSocket } from './hooks/useSocket';
import UploadZone from './components/UploadZone';
import ProcessingView from './components/ProcessingView';
import ResultsView from './components/ResultsView';

function AppContent() {
  const { currentView } = useAppContext();
  useSocket();

  return (
    <div className="ios-container">
      <AnimatePresence mode="wait">
        {currentView === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <UploadZone />
          </motion.div>
        )}

        {currentView === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <ProcessingView />
          </motion.div>
        )}

        {currentView === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <ResultsView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
