import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { uploadFile } from '../utils/api';

export default function UploadZone() {
  const { setCurrentView, setJobId, setFilename, error, setError } = useAppContext();
  const [uploading, setUploading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      setError('File too large. Maximum 50MB');
      setTimeout(() => setError(null), 5000);
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Upload file
      const response = await uploadFile(file);

      // Store job info and transition to processing view
      setJobId(response.job_id);
      setFilename(file.name);
      setCurrentView('processing');
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac', '.ogg', '.m4a']
    },
    multiple: false,
    disabled: uploading
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        maxWidth: '600px',
        width: '90vw',
        margin: '0 auto',
        padding: '40px',
        background: 'linear-gradient(135deg, #1a0a1a, #0a1a1a)',
        border: '3px solid #ff00ff',
        boxShadow:
          '0 0 40px rgba(255, 0, 255, 0.6), inset 0 0 40px rgba(0, 255, 255, 0.2)'
      }}
    >
      <h1
        className="gradient-text"
        style={{
          fontSize: 'clamp(24px, 5vw, 32px)',
          letterSpacing: '3px',
          textAlign: 'center',
          marginBottom: '30px',
          textTransform: 'uppercase'
        }}
      >
        🎵 VOICE SEPARATOR
      </h1>

      <motion.div
        {...getRootProps()}
        animate={{
          borderColor: isDragActive ? '#ff00ff' : '#00ffff',
          backgroundColor: isDragActive
            ? 'rgba(255, 0, 255, 0.15)'
            : 'rgba(0, 255, 255, 0.05)'
        }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.02 }}
        style={{
          border: '3px dashed',
          padding: '60px 20px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          boxShadow: 'inset 0 0 30px rgba(255, 0, 255, 0.2)',
          opacity: uploading ? 0.6 : 1
        }}
      >
        <input {...getInputProps()} />

        <motion.div
          animate={{
            color: isDragActive ? '#ff00ff' : '#00ffff',
            scale: isDragActive ? 1.05 : 1
          }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
            marginBottom: '10px'
          }}
        >
          {uploading ? '⏳ UPLOADING...' : '⬆️ DROP AUDIO FILE'}
        </motion.div>

        <div style={{ color: '#ff00ff', fontSize: '14px', marginBottom: '10px' }}>
          {uploading ? 'Please wait...' : 'or click to browse'}
        </div>

        <div
          style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '12px',
            marginTop: '10px'
          }}
        >
          MP3 • WAV • FLAC • OGG • M4A
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(255, 0, 0, 0.1)',
              border: '2px solid #ff0000',
              borderRadius: '4px',
              color: '#ff0000',
              textAlign: 'center',
              fontSize: '14px'
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
