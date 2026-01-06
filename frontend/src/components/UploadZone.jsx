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
      className="ios-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <h1 className="ios-title">
        Voice Separator
      </h1>

      <motion.div
        {...getRootProps()}
        className={isDragActive ? 'dropzone-active' : ''}
        animate={{
          backgroundColor: isDragActive ? 'rgba(0, 122, 255, 0.08)' : 'rgba(0,0,0,0.02)',
          scale: isDragActive ? 1.02 : 1
        }}
        transition={{ duration: 0.2 }}
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
        style={{
          border: '2px dashed #D1D1D6',
          borderRadius: '16px',
          padding: '60px 20px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.2s ease',
          marginBottom: '20px'
        }}
      >
        <input {...getInputProps()} />

        <div
          style={{
            fontSize: '48px',
            marginBottom: '16px',
            opacity: 0.8
          }}
        >
          {uploading ? '⏳' : '☁️'}
        </div>

        <motion.div
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--ios-text)',
            marginBottom: '8px'
          }}
        >
          {uploading ? 'Uploading...' : 'Drop audio file here'}
        </motion.div>

        <div style={{ color: 'var(--ios-text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
          {uploading ? 'Please wait a moment' : 'or click to browse'}
        </div>

        <div
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: 'rgba(0,0,0,0.05)',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '500',
            color: 'var(--ios-text-secondary)'
          }}
        >
          MP3 • WAV • FLAC • OGG • M4A
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginTop: '20px',
              padding: '12px',
              background: 'rgba(255, 59, 48, 0.1)',
              borderRadius: '8px',
              color: 'var(--ios-danger)',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
