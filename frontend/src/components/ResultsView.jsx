import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import AudioPlayer from './AudioPlayer';

export default function ResultsView() {
  const { jobId, filename, resetState } = useAppContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        maxWidth: '700px',
        width: '90vw',
        margin: '0 auto',
        padding: 'clamp(20px, 5vw, 40px)',
        background: 'linear-gradient(135deg, #1a0a1a, #0a1a1a)',
        border: '3px solid #ff00ff',
        boxShadow: '0 0 40px rgba(255, 0, 255, 0.6)'
      }}
    >
      <h2
        className="gradient-text"
        style={{
          fontSize: 'clamp(22px, 4vw, 28px)',
          letterSpacing: '3px',
          textAlign: 'center',
          marginBottom: '30px',
          textTransform: 'uppercase'
        }}
      >
        ✨ SEPARATION COMPLETE ✨
      </h2>

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
        onClick={resetState}
        whileHover={{
          scale: 1.05,
          boxShadow: '0 0 25px rgba(0, 255, 255, 0.8)'
        }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'block',
          margin: '30px auto 0',
          padding: '12px 30px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid #00ffff',
          color: '#00ffff',
          fontSize: '16px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          cursor: 'pointer',
          letterSpacing: '1px'
        }}
      >
        ⬆️ UPLOAD ANOTHER
      </motion.button>
    </motion.div>
  );
}
