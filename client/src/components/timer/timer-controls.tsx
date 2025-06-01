import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Plus, Minus, Volume2, VolumeX } from 'lucide-react';

interface TimerControlsProps {
  isActive: boolean;
  isPaused: boolean;
  sessionMinutes: number;
  audioEnabled: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onIncreaseMinutes: () => void;
  onDecreaseMinutes: () => void;
  onToggleAudio: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isActive,
  isPaused,
  sessionMinutes,
  audioEnabled,
  onToggleTimer,
  onResetTimer,
  onIncreaseMinutes,
  onDecreaseMinutes,
  onToggleAudio,
}) => {
  const showSessionControls = !isActive;

  return (
    <div className="space-y-4">
      {/* Session Length Controls */}
      {showSessionControls && (
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Button
            variant="secondary"
            size="icon"
            className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 border-0"
            onClick={onDecreaseMinutes}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <Card className="glassmorphic rounded-xl px-6 py-3 min-w-[120px] text-center border-0">
            <span className="text-sm text-gray-400">Session</span>
            <div className="text-2xl font-bold text-white">{sessionMinutes}</div>
            <span className="text-sm text-gray-400">minutes</span>
          </Card>
          
          <Button
            variant="secondary"
            size="icon"
            className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 border-0"
            onClick={onIncreaseMinutes}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4">
        {/* Reset Button */}
        <Button
          variant="secondary"
          size="icon"
          className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200 hover:scale-110 border-0"
          onClick={onResetTimer}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        {/* Play/Pause Button */}
        <Button
          size="icon"
          className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-110 shadow-lg shadow-blue-500/25 border-0"
          onClick={onToggleTimer}
        >
          {isActive && !isPaused ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>

        {/* Audio Toggle */}
        <Button
          variant="secondary"
          size="icon"
          className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200 hover:scale-110 border-0"
          onClick={onToggleAudio}
        >
          {audioEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};
