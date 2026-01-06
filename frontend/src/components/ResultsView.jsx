import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import AudioPlayer from './AudioPlayer';

export default function ResultsView() {
  const { jobId, filename, resetState } = useAppContext();

  return (
    <motion.div
      className="ios-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        maxWidth: '600px',
        width: '90vw',
        margin: '0 auto',
      }}
    >
      <h2 className="ios-title">
        Separation Complete
      </h2>

      <p className="ios-subtitle" style={{ marginTop: '-20px', marginBottom: '32px' }}>
        {filename}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <AudioPlayer trackType="vocals" jobId={jobId} filename={filename} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AudioPlayer
            trackType="accompaniment"
            jobId={jobId}
            filename={filename}
          />
        </motion.div>
      </div>

      <motion.button
        className="ios-button secondary"
        onClick={resetState}
        whileHover={{
          scale: 1.01
        }}
        whileTap={{ scale: 0.98 }}
        style={{
          margin: '32px auto 0',
          width: 'auto',
          minWidth: '200px'
        }}
      >
        Process Another File
      </motion.button>
    </motion.div>
  );
}
