import { useAppStore } from '@/lib/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GameModeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const GameModeFilter = ({ value, onChange }: GameModeFilterProps) => {
  const { gameModes } = useAppStore();
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px] minecraft-border bg-secondary/50">
        <SelectValue placeholder="Select game mode" />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        <SelectItem value="all">All Game Modes</SelectItem>
        {gameModes.map((mode) => (
          <SelectItem key={mode} value={mode}>
            {mode}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
