import { useState, useEffect, useRef, useCallback } from 'react';

export const useAudio = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    try {
      const audio = new Audio('/audio/focus-music.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      audio.preload = 'auto';
      
      audio.addEventListener('canplaythrough', () => {
        setIsLoaded(true);
      });
      
      audio.addEventListener('error', (e) => {
        console.warn('Audio file not found - music functionality disabled');
        setIsLoaded(false);
      });

      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('ended', () => setIsPlaying(false));
      
      audioRef.current = audio;
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      setIsLoaded(false);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current || !isEnabled || !isLoaded) return;
    
    try {
      await audioRef.current.play();
    } catch (error) {
      console.warn('Audio play failed:', error);
    }
  }, [isEnabled, isLoaded]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => {
      const newEnabled = !prev;
      if (!newEnabled && audioRef.current) {
        audioRef.current.pause();
      }
      return newEnabled;
    });
  }, []);

  const getStatus = useCallback(() => {
    if (!isLoaded) return 'Audio unavailable';
    if (!isEnabled) return 'Audio disabled';
    if (isPlaying) return 'Playing focus music';
    return 'Background music ready';
  }, [isLoaded, isEnabled, isPlaying]);

  return {
    isEnabled,
    isLoaded,
    isPlaying,
    play,
    pause,
    stop,
    toggleEnabled,
    getStatus,
  };
};
