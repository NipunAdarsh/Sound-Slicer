import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import WaveformAnimation from './WaveformAnimation';
import { downloadTrack } from '../utils/api';

export default function AudioPlayer({ trackType, jobId, filename }) {
  const [playing, setPlaying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const audioRef = useRef(null);

  const trackTitle = trackType === 'vocals' ? '🎤 VOCALS' : '🎸 ACCOMPANIMENT';

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        border: '2px solid #00ffff',
        padding: 'clamp(20px, 3vw, 25px)',
        background: 'rgba(0, 255, 255, 0.05)',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)'
      }}
    >
      <h3
        style={{
          color: '#00ffff',
          fontSize: 'clamp(18px, 3vw, 20px)',
          letterSpacing: '2px',
          textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}
      >
        {trackTitle}
      </h3>

      <div
        style={{
          height: '80px',
          marginBottom: '15px',
          background: 'rgba(255, 0, 255, 0.1)',
          border: '1px solid #ff00ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <WaveformAnimation barCount={10} animate={playing} color="gradient" />
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
          gap: '10px',
          flexWrap: 'wrap'
        }}
      >
        <motion.button
          onClick={handlePlayPause}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={playing ? { scale: [1, 1.05, 1] } : {}}
          transition={playing ? { duration: 1, repeat: Infinity } : {}}
          style={{
            flex: '1',
            minWidth: '150px',
            background: 'linear-gradient(135deg, #ff00ff, #ff0080)',
            border: '2px solid #ff00ff',
            padding: '15px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            boxShadow: '0 0 15px rgba(255, 0, 255, 0.6)',
            cursor: 'pointer'
          }}
        >
          {playing ? '⏸ PAUSE' : '▶ PLAY'}
        </motion.button>

        <motion.button
          onClick={handleDownload}
          disabled={downloading}
          whileHover={!downloading ? { scale: 1.02 } : {}}
          whileTap={!downloading ? { scale: 0.98 } : {}}
          animate={
            downloading
              ? { scale: [1, 1.05, 1] }
              : downloaded
              ? { scale: [1, 1.1, 1] }
              : {}
          }
          transition={
            downloading
              ? { duration: 0.6, repeat: Infinity }
              : downloaded
              ? { duration: 0.3 }
              : {}
          }
          style={{
            background: '#000',
            border: '2px solid #00ffff',
            padding: '15px 30px',
            color: '#00ffff',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.6)',
            cursor: downloading ? 'not-allowed' : 'pointer',
            opacity: downloading ? 0.7 : 1
          }}
        >
          {downloading
            ? 'DOWNLOADING...'
            : downloaded
            ? '✓ DOWNLOADED'
            : '⬇ DOWNLOAD'}
        </motion.button>
      </div>
    </motion.div>
  );
}
