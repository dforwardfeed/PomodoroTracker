import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTimer } from '@/hooks/use-timer';
import { useAudio } from '@/hooks/use-audio';
import { CircularTimer } from '@/components/timer/circular-timer';
import { TimerControls } from '@/components/timer/timer-controls';
import { AudioManager } from '@/components/timer/audio-manager';

export default function Timer() {
  const { toast } = useToast();
  const {
    isActive,
    isPaused,
    sessionMinutes,
    remainingTime,
    setSessionMinutes,
    toggleTimer,
    resetTimer,
    getFormattedTime,
    getProgress,
    isCompleted,
  } = useTimer();

  const {
    isEnabled: audioEnabled,
    play: playAudio,
    pause: pauseAudio,
    stop: stopAudio,
    toggleEnabled: toggleAudio,
    getStatus: getAudioStatus,
  } = useAudio();

  // Handle audio based on timer state
  useEffect(() => {
    if (isActive && !isPaused && audioEnabled) {
      playAudio();
    } else {
      pauseAudio();
    }
  }, [isActive, isPaused, audioEnabled, playAudio, pauseAudio]);

  // Handle timer completion
  useEffect(() => {
    if (isCompleted) {
      stopAudio();
      toast({
        title: "Session Complete!",
        description: "Great focus session! Take a break.",
      });
    }
  }, [isCompleted, stopAudio, toast]);

  // Handle reset
  const handleReset = () => {
    resetTimer();
    stopAudio();
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning Focus Time";
    if (hour < 17) return "Afternoon Energy Peak";
    return "Evening Deep Work";
  };

  const getStatusText = () => {
    if (!isActive) return "Ready to Focus";
    if (isPaused) return "Paused";
    return "Stay Focused!";
  };

  const getSessionInfo = () => {
    if (!isActive) return "Set your focus session length";
    if (isPaused) return "Session paused";
    return `${Math.floor(remainingTime / 60)} minutes remaining`;
  };

  const handleIncreaseMinutes = () => {
    setSessionMinutes(sessionMinutes + 1);
  };

  const handleDecreaseMinutes = () => {
    setSessionMinutes(sessionMinutes - 1);
  };

  return (
    <div className="min-h-screen grid-pattern">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Focus</h1>
            <p className="text-gray-400 text-sm">{getTimeOfDay()}</p>
          </div>
        </div>
      </header>

      {/* Main Timer */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          {/* Timer Status Card */}
          <Card className="glassmorphic rounded-2xl p-6 mb-8 text-center border-0">
            <h2 className="text-xl font-semibold mb-2 text-white">
              {getStatusText()}
            </h2>
            <p className="text-gray-400 text-sm">{getSessionInfo()}</p>
          </Card>

          {/* Main Timer Circle */}
          <CircularTimer
            progress={getProgress()}
            timeDisplay={getFormattedTime()}
            sessionLength={`${sessionMinutes} minutes`}
            sessionMinutes={sessionMinutes}
            isActive={isActive}
            onSessionMinutesChange={setSessionMinutes}
          />

          {/* Timer Controls */}
          <TimerControls
            isActive={isActive}
            isPaused={isPaused}
            sessionMinutes={sessionMinutes}
            audioEnabled={audioEnabled}
            onToggleTimer={toggleTimer}
            onResetTimer={handleReset}
            onIncreaseMinutes={handleIncreaseMinutes}
            onDecreaseMinutes={handleDecreaseMinutes}
            onToggleAudio={toggleAudio}
          />

          {/* Audio Status */}
          <AudioManager status={getAudioStatus()} />
        </div>
      </main>
    </div>
  );
}
