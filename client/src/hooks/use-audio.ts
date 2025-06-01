import { useState, useEffect, useRef, useCallback } from 'react';

export const useAudio = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    // Initialize Web Audio API for generated ambient sound
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.08; // Low volume
      gainNode.connect(audioContext.destination);
      
      audioContextRef.current = audioContext;
      gainNodeRef.current = gainNode;
      setIsLoaded(true);
    } catch (error) {
      console.warn('Web Audio API not supported');
      setIsLoaded(false);
    }

    return () => {
      if (audioContextRef.current) {
        stopOscillators();
        audioContextRef.current.close();
      }
    };
  }, []);

  const stopOscillators = useCallback(() => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    oscillatorsRef.current = [];
  }, []);

  const createAmbientSound = useCallback(() => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    // Create multiple oscillators for ambient sound
    const frequencies = [55, 73, 110, 147]; // Low frequencies for calming ambient effect
    const oscillators: OscillatorNode[] = [];

    frequencies.forEach((freq, index) => {
      const oscillator = audioContextRef.current!.createOscillator();
      const oscGain = audioContextRef.current!.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioContextRef.current!.currentTime);
      
      // Vary the volume for each oscillator to create a rich ambient sound
      oscGain.gain.value = 0.12 - (index * 0.02);
      
      oscillator.connect(oscGain);
      oscGain.connect(gainNodeRef.current!);
      
      oscillator.start();
      oscillators.push(oscillator);
    });

    oscillatorsRef.current = oscillators;
  }, []);

  const play = useCallback(async () => {
    if (!isEnabled || !isLoaded || !audioContextRef.current) return;
    
    try {
      // Resume audio context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      // Stop any existing oscillators and create new ones
      stopOscillators();
      createAmbientSound();
      setIsPlaying(true);
    } catch (error) {
      console.warn('Audio play failed:', error);
    }
  }, [isEnabled, isLoaded, stopOscillators, createAmbientSound]);

  const pause = useCallback(() => {
    stopOscillators();
    setIsPlaying(false);
  }, [stopOscillators]);

  const stop = useCallback(() => {
    stopOscillators();
    setIsPlaying(false);
  }, [stopOscillators]);

  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => {
      const newEnabled = !prev;
      if (!newEnabled) {
        stopOscillators();
        setIsPlaying(false);
      }
      return newEnabled;
    });
  }, [stopOscillators]);

  const getStatus = useCallback(() => {
    if (!isLoaded) return 'Audio unavailable';
    if (!isEnabled) return 'Audio disabled';
    if (isPlaying) return 'Playing ambient focus sound';
    return 'Ambient sound ready';
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