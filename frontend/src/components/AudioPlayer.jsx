import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import WaveformAnimation from './WaveformAnimation';
import { downloadTrack } from '../utils/api';

export default function AudioPlayer({ trackType, jobId, filename }) {
  const [playing, setPlaying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const audioRef = useRef(null);

  const trackTitle = trackType === 'vocals' ? 'Vocals' : 'Accompaniment';
  const trackIcon = trackType === 'vocals' ? '🎤' : '🎸';

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);

      // Download file
      const blob = await downloadTrack(trackType, jobId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${trackType}_${filename.split('.')[0]}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Show downloaded state
      setDownloaded(true);
      setTimeout(() => {
        setDownloaded(false);
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        borderRadius: '16px',
        padding: '20px',
        background: 'rgba(0,0,0,0.03)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3
          style={{
            color: 'var(--ios-text)',
            fontSize: '18px',
            fontWeight: '600',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>{trackIcon}</span> {trackTitle}
        </h3>
      </div>

      <div
        style={{
          height: '60px',
          marginBottom: '20px',
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <WaveformAnimation barCount={15} animate={playing} color="ios" />
      </div>

      <audio
        ref={audioRef}
        src={`/api/download/${trackType}/${jobId}`}
        onEnded={() => setPlaying(false)}
        preload="none"
      />

      <div
        style={{
          display: 'flex',
          gap: '12px',
        }}
      >
        <motion.button
          className="ios-button"
          onClick={handlePlayPause}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ flex: 1 }}
        >
          {playing ? 'Pause' : 'Play'}
        </motion.button>

        <motion.button
          className="ios-button secondary"
          onClick={handleDownload}
          disabled={downloading}
          whileHover={!downloading ? { scale: 1.02 } : {}}
          whileTap={!downloading ? { scale: 0.98 } : {}}
          style={{
            flex: 1,
            opacity: downloading ? 0.7 : 1
          }}
        >
          {downloading
            ? 'Downloading...'
            : downloaded
              ? 'Downloaded'
              : 'Download'}
        </motion.button>
      </div>
    </motion.div>
  );
}
