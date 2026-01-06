import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAppContext } from '../context/AppContext';

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const { setCurrentView, setJobId, setProcessingMessage, setError, currentView, jobId } = useAppContext();

  useEffect(() => {
    // Connect to WebSocket server with stable configuration
    // Use relative path to leverage Vite proxy (in dev) or same-origin (in prod)
    const newSocket = io('/', {
      transports: ['polling'],  // Use polling instead of websocket for better reliability
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 20000
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('[WEBSOCKET] Connected - Socket ID:', newSocket.id);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[WEBSOCKET] Disconnected - Reason:', reason);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[WEBSOCKET] Connection error:', error);
    });

    // Processing status event
    newSocket.on('processing_status', (data) => {
      console.log('[WEBSOCKET] Processing status received:', data);
      if (data.message) {
        setProcessingMessage(data.message);
      }
    });

    // Processing complete event
    newSocket.on('processing_complete', (data) => {
      console.log('[WEBSOCKET] Processing complete received:', data);
      setJobId(data.job_id);
      setCurrentView('results');
      // Clear polling interval once complete
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    });

    // Processing error event
    newSocket.on('processing_error', (data) => {
      console.log('[WEBSOCKET] Processing error received:', data);
      setError(data.error || 'Processing failed. Please try again.');
      setCurrentView('upload');

      // Clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    });

    // Cleanup on unmount
    return () => {
      console.log('[WEBSOCKET] Cleaning up connection');
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      newSocket.close();
    };
  }, [setCurrentView, setJobId, setProcessingMessage, setError, pollingInterval]);

  // Fallback polling mechanism
  useEffect(() => {
    if (currentView === 'processing' && jobId) {
      console.log('[POLLING] Starting fallback polling for job:', jobId);

      // Start polling every 2 seconds
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/status/${jobId}`);
          if (response.ok) {
            const data = await response.json();
            console.log('[POLLING] Status:', data);

            if (data.status === 'complete') {
              setJobId(data.job_id);
              setCurrentView('results');
              setPollingInterval(null); // Clear interval
            } else if (data.status === 'error') {
              setError(data.error || 'Processing failed. Please try again.');
              setCurrentView('upload');
              setPollingInterval(null); // Clear interval
            }
          }
        } catch (error) {
          console.error('[POLLING] Error checking status:', error);
        }
      }, 2000);

      setPollingInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [currentView, jobId, setJobId, setCurrentView, setError]);

  return socket;
}
