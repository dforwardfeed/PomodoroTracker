import { Card } from '@/components/ui/card';
import { Music } from 'lucide-react';

interface AudioManagerProps {
  status: string;
}

export const AudioManager: React.FC<AudioManagerProps> = ({ status }) => {
  return (
    <div className="mt-8 text-center">
      <Card className="glassmorphic rounded-xl p-4 border-0">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
          <Music className="h-4 w-4" />
          <span>{status}</span>
        </div>
      </Card>
    </div>
  );
};
