import React from 'react';
import { motion } from 'framer-motion';

export default function WaveformAnimation({
  barCount = 10,
  animate = true,
  color = 'gradient'
}) {
  const bars = Array.from({ length: barCount });

  const getBarStyle = () => {
    switch (color) {
      case 'cyan':
        return {
          background: '#00ffff',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
        };
      case 'magenta':
        return {
          background: '#ff00ff',
          boxShadow: '0 0 10px rgba(255, 0, 255, 0.8)'
        };
      case 'gradient':
      default:
        return {
          background: 'linear-gradient(180deg, #ff00ff, #00ffff)',
          boxShadow: '0 0 10px rgba(255, 0, 255, 0.8)'
        };
    }
  };

  const barStyle = getBarStyle();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        height: '80px'
      }}
    >
      {bars.map((_, index) => (
        <motion.div
          key={index}
          style={{
            width: '8px',
            borderRadius: '4px',
            ...barStyle
          }}
          animate={
            animate
              ? {
                  height: [30, 60, 45, 75, 40, 65, 35, 70, 50, 30]
                }
              : { height: 40 }
          }
          transition={{
            duration: 0.8,
            repeat: animate ? Infinity : 0,
            ease: 'easeInOut',
            delay: index * 0.1
          }}
        />
      ))}
    </div>
  );
}
