import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import WaveformAnimation from './WaveformAnimation';

export default function ProcessingView() {
  const { processingMessage } = useAppContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        maxWidth: '600px',
        width: '90vw',
        margin: '0 auto',
        padding: 'clamp(40px, 8vw, 60px) clamp(20px, 5vw, 40px)',
        background: 'linear-gradient(135deg, #1a0a1a, #0a1a1a)',
        border: '3px solid #00ffff',
        boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)',
        textAlign: 'center'
      }}
    >
      <h2
        style={{
          color: '#00ffff',
          fontSize: 'clamp(20px, 4vw, 24px)',
          letterSpacing: '2px',
          textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
          marginBottom: '30px',
          textTransform: 'uppercase'
        }}
      >
        PROCESSING AUDIO
      </h2>

      <div style={{ marginBottom: '30px' }}>
        <WaveformAnimation barCount={10} animate={true} color="gradient" />
      </div>

      <motion.div
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          color: '#ff00ff',
          fontSize: '16px',
          letterSpacing: '2px',
          textShadow: '0 0 10px rgba(255, 0, 255, 0.8)',
          marginBottom: '10px'
        }}
      >
        {processingMessage}
      </motion.div>

      <div
        style={{
          color: '#00ffff',
          fontSize: '14px',
          marginTop: '20px',
          opacity: 0.8
        }}
      >
        Analyzing frequencies...
      </div>
    </motion.div>
  );
}
