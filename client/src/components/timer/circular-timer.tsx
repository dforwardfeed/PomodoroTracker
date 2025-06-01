import { useCallback, useRef, useState } from 'react';

interface CircularTimerProps {
  progress: number;
  timeDisplay: string;
  sessionLength: string;
  sessionMinutes: number;
  isActive: boolean;
  onSessionMinutesChange: (minutes: number) => void;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  progress,
  timeDisplay,
  sessionLength,
  sessionMinutes,
  isActive,
  onSessionMinutesChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * circumference);

  const getAngleFromPoint = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return 0;
    
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle = (angle + 90) % 360;
    if (angle < 0) angle += 360;
    
    return angle;
  }, []);

  const getMinutesFromAngle = useCallback((angle: number) => {
    const normalizedAngle = (360 - angle) % 360;
    const minutes = Math.round((normalizedAngle / 360) * 60);
    return Math.max(1, Math.min(60, minutes || 1));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isActive) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const angle = getAngleFromPoint(e.clientX, e.clientY);
    const newMinutes = getMinutesFromAngle(angle);
    onSessionMinutesChange(newMinutes);
  }, [isActive, getAngleFromPoint, getMinutesFromAngle, onSessionMinutesChange]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isActive) return;
    
    const angle = getAngleFromPoint(e.clientX, e.clientY);
    const newMinutes = getMinutesFromAngle(angle);
    onSessionMinutesChange(newMinutes);
  }, [isDragging, isActive, getAngleFromPoint, getMinutesFromAngle, onSessionMinutesChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Calculate handle position
  const handleAngle = ((60 - sessionMinutes) / 60) * 360;
  const handleX = 100 + radius * Math.cos((handleAngle - 90) * (Math.PI / 180));
  const handleY = 100 + radius * Math.sin((handleAngle - 90) * (Math.PI / 180));

  return (
    <div className="relative flex items-center justify-center mb-8">
      <div className="relative w-80 h-80">
        <svg 
          ref={svgRef}
          className="w-full h-full timer-circle" 
          viewBox="0 0 200 200"
        >
          {/* Background ring */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="4"
            fill="none"
          />
          
          {/* Progress ring */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#3B82F6"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="progress-ring"
          />
          
          {/* Draggable Handle */}
          <circle
            cx={handleX}
            cy={handleY}
            r="8"
            fill="#3B82F6"
            className={`draggable-handle ${isActive ? 'cursor-not-allowed opacity-50' : 'hover:scale-125'}`}
            onMouseDown={handleMouseDown}
            style={{
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              cursor: isActive ? 'not-allowed' : 'grab'
            }}
          />
        </svg>
        
        {/* Timer Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold mb-4 text-white">{timeDisplay}</div>
          <div className="text-gray-400 text-sm">{sessionLength}</div>
        </div>
      </div>
    </div>
  );
};
