import { GameMode, GAME_MODES } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GameModeFilterProps {
  value: GameMode | 'all';
  onChange: (value: GameMode | 'all') => void;
}

export const GameModeFilter = ({ value, onChange }: GameModeFilterProps) => {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as GameMode | 'all')}>
      <SelectTrigger className="w-[200px] minecraft-border bg-secondary/50">
        <SelectValue placeholder="Select game mode" />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        <SelectItem value="all">All Game Modes</SelectItem>
        {GAME_MODES.map((mode) => (
          <SelectItem key={mode} value={mode}>
            {mode}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
