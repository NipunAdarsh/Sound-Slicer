import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import WaveformAnimation from './WaveformAnimation';

export default function ProcessingView() {
  const { processingMessage } = useAppContext();

  return (
    <motion.div
      className="ios-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        maxWidth: '500px',
        width: '90vw',
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      <h2 className="ios-title" style={{ marginBottom: '16px' }}>
        Processing Audio
      </h2>

      <div style={{ marginBottom: '32px', opacity: 0.7 }}>
        <WaveformAnimation barCount={12} animate={true} color="ios" />
      </div>

      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          color: 'var(--ios-text)',
          fontSize: '17px',
          fontWeight: '500',
          marginBottom: '8px'
        }}
      >
        {processingMessage}
      </motion.div>

      <div
        style={{
          color: 'var(--ios-text-secondary)',
          fontSize: '14px',
          marginTop: '8px'
        }}
      >
        Deep learning model is separating stems...
      </div>
    </motion.div>
  );
}
