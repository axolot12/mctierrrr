import { Player } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  showRank?: boolean;
  rank?: number;
}

export const PlayerCard = ({ player, showRank, rank }: PlayerCardProps) => {
  const isHT = player.tier.startsWith('HT');
  
  return (
    <div className="minecraft-card p-4 hover:glow-emerald transition-all duration-300 group">
      <div className="flex items-center gap-4">
        {showRank && rank && (
          <div className={`
            font-minecraft text-2xl font-bold
            ${rank === 1 ? 'text-gradient-gold' : ''}
            ${rank === 2 ? 'text-gray-300' : ''}
            ${rank === 3 ? 'text-orange-600' : ''}
          `}>
            #{rank}
          </div>
        )}
        
        <div className="relative">
          <img
            src={player.skinUrl}
            alt={player.username}
            className="w-16 h-16 pixelated rounded-sm group-hover:animate-float transition-transform"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://mc-heads.net/avatar/${player.username}/64`;
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-minecraft text-sm text-foreground truncate">
            {player.username}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {player.gameMode}
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Badge 
            className={`font-minecraft text-xs px-2 py-1 ${
              isHT ? 'tier-badge-ht' : 'tier-badge-lt'
            }`}
          >
            {player.tier}
          </Badge>
          
          <div className="flex items-center gap-1">
            {player.isTested ? (
              <>
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary">Tested</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Not Tested</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
