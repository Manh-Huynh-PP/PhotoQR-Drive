import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = '/api';
const POLL_INTERVAL = 10000; // 10 seconds
const IDLE_TIMEOUT = 10000;  // resume polling after 10s of no interaction

export function useDriveFolder() {
  const [images, setImages] = useState([]);
  const [latestImage, setLatestImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const lastImageIdRef = useRef(null);
  const idleTimerRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/images`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch images');
      }

      const data = await response.json();
      const files = data.files || [];

      setImages(files);

      if (files.length > 0) {
        const newest = files[0];
        if (newest.id !== lastImageIdRef.current) {
          setLatestImage(newest);
          lastImageIdRef.current = newest.id;
        }
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle user interaction: pause polling, resume after idle
  const handleInteraction = useCallback(() => {
    setIsPaused(true);

    // Clear any existing idle timer
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    // Set a new idle timer to resume after IDLE_TIMEOUT
    idleTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, IDLE_TIMEOUT);
  }, []);

  // Attach interaction listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'touchstart', 'touchmove', 'keydown', 'wheel', 'scroll'];
    events.forEach(evt => window.addEventListener(evt, handleInteraction, { passive: true }));
    return () => {
      events.forEach(evt => window.removeEventListener(evt, handleInteraction));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [handleInteraction]);

  // Polling cycle: runs when not paused
  useEffect(() => {
    fetchImages(); // always fetch on mount

    if (!isPaused) {
      intervalRef.current = setInterval(fetchImages, POLL_INTERVAL);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchImages, isPaused]);

  return {
    images,
    latestImage,
    isLoading,
    error,
    isPaused,
  };
}
