import { useState, useEffect, useCallback, useRef } from 'react';

export interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  sessionMinutes: number;
  remainingTime: number;
  totalTime: number;
}

export const useTimer = () => {
  const [state, setState] = useState<TimerState>({
    isActive: false,
    isPaused: false,
    sessionMinutes: 25,
    remainingTime: 25 * 60, // 25 minutes in seconds
    totalTime: 25 * 60,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateRemainingTime = useCallback(() => {
    setState(prev => {
      if (prev.remainingTime <= 1) {
        // Timer completed
        return {
          ...prev,
          remainingTime: 0,
          isActive: false,
          isPaused: false,
        };
      }
      return {
        ...prev,
        remainingTime: prev.remainingTime - 1,
      };
    });
  }, []);

  useEffect(() => {
    if (state.isActive && !state.isPaused) {
      intervalRef.current = setInterval(updateRemainingTime, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isActive, state.isPaused, updateRemainingTime]);

  const setSessionMinutes = useCallback((minutes: number) => {
    if (state.isActive) return;
    
    const clampedMinutes = Math.max(1, Math.min(60, minutes));
    const newTotalTime = clampedMinutes * 60;
    
    setState(prev => ({
      ...prev,
      sessionMinutes: clampedMinutes,
      remainingTime: newTotalTime,
      totalTime: newTotalTime,
    }));
  }, [state.isActive]);

  const startTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false,
    }));
  }, []);

  const pauseTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPaused: true,
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      remainingTime: prev.totalTime,
    }));
  }, []);

  const toggleTimer = useCallback(() => {
    if (!state.isActive || state.isPaused) {
      startTimer();
    } else {
      pauseTimer();
    }
  }, [state.isActive, state.isPaused, startTimer, pauseTimer]);

  const getFormattedTime = useCallback(() => {
    const minutes = Math.floor(state.remainingTime / 60);
    const seconds = state.remainingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [state.remainingTime]);

  const getProgress = useCallback(() => {
    if (state.totalTime === 0) return 0;
    return (state.totalTime - state.remainingTime) / state.totalTime;
  }, [state.remainingTime, state.totalTime]);

  const isCompleted = state.remainingTime === 0 && state.totalTime > 0;

  return {
    ...state,
    setSessionMinutes,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleTimer,
    getFormattedTime,
    getProgress,
    isCompleted,
  };
};
