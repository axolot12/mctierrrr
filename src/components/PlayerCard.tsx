import { useState } from 'react';
import { Player } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Crown, Sword, Shield, Target, Gem, Flame, Skull, Crosshair, Axe, FlaskConical, Zap, Gamepad2 } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  showRank?: boolean;
  rank?: number;
}

// Gamemode icons mapping
const getGameModeIcon = (gameMode: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'SMP': <Shield className="w-5 h-5" />,
    'Lifesteal': <Skull className="w-5 h-5" />,
    'Practice': <Target className="w-5 h-5" />,
    'Bedwars': <Gem className="w-5 h-5" />,
    'Skywars': <Zap className="w-5 h-5" />,
    'UHC': <Flame className="w-5 h-5" />,
    'Survival Games': <Crosshair className="w-5 h-5" />,
    'Crystal PvP': <Gem className="w-5 h-5" />,
    'Pot PvP': <FlaskConical className="w-5 h-5" />,
    'Sword': <Sword className="w-5 h-5" />,
    'Axe': <Axe className="w-5 h-5" />,
    'Netherite Pot': <FlaskConical className="w-5 h-5" />,
  };
  return iconMap[gameMode] || <Gamepad2 className="w-5 h-5" />;
};

export const PlayerCard = ({ player, showRank, rank }: PlayerCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Safely get game modes with fallback
  const gameModes = player.gameModes || [];
  const primaryGameMode = gameModes[0];
  const isHT = primaryGameMode?.tier?.startsWith('HT') ?? false;
  const isPremium = player.isPremium ?? true;
  
  // Get the skin source based on premium status
  const getSkinSource = (size: number, type: 'avatar' | 'body' = 'avatar') => {
    const skinName = isPremium ? player.username : 'steve';
    return `https://mc-heads.net/${type}/${skinName}/${size}`;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="minecraft-card overflow-hidden hover:glow-emerald transition-all duration-300 group cursor-pointer">
          <div className="flex items-center gap-4 p-4">
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
                src={getSkinSource(64, 'avatar')}
                alt={player.username}
                className="w-16 h-16 pixelated rounded-sm group-hover:scale-110 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://mc-heads.net/avatar/steve/64`;
                }}
              />
              {isPremium && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <h3 className="font-minecraft text-sm text-foreground truncate">
                {player.username}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {gameModes.length} game mode{gameModes.length !== 1 ? 's' : ''} • Click to view
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {primaryGameMode && (
                <Badge 
                  className={`font-minecraft text-xs px-2 py-1 ${
                    isHT ? 'tier-badge-ht' : 'tier-badge-lt'
                  }`}
                >
                  {primaryGameMode.tier}
                </Badge>
              )}
              
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
      </DialogTrigger>
      
      <DialogContent className="bg-card border-border max-w-2xl">
        <div className="flex flex-col md:flex-row gap-6 pt-4">
          {/* Full Body Skin */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
              <img
                src={getSkinSource(150, 'body')}
                alt={`${player.username} full skin`}
                className="pixelated h-[220px] object-contain relative z-10 animate-float"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://mc-heads.net/body/steve/150`;
                }}
              />
            </div>
            <h2 className="font-minecraft text-lg text-foreground mt-4">{player.username}</h2>
            <div className="flex items-center gap-2 mt-2">
              {isPremium ? (
                <Badge variant="default" className="text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Non-Premium
                </Badge>
              )}
              {player.isTested && (
                <Badge variant="outline" className="text-xs border-primary text-primary">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Tested
                </Badge>
              )}
            </div>
          </div>
          
          {/* Game Modes Grid */}
          <div className="flex-1">
            <h4 className="text-sm font-medium text-foreground mb-4 font-minecraft">Game Modes & Tiers</h4>
            {gameModes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gameModes.map((gm, idx) => {
                  const isHTier = gm.tier?.startsWith('HT') ?? false;
                  return (
                    <div 
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-secondary/50 rounded-sm minecraft-border"
                    >
                      <div className={`p-2 rounded-sm ${isHTier ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {getGameModeIcon(gm.gameMode)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground font-medium truncate">{gm.gameMode}</p>
                      </div>
                      <Badge 
                        className={`font-minecraft text-xs px-2 py-1 ${
                          isHTier ? 'tier-badge-ht' : 'tier-badge-lt'
                        }`}
                      >
                        {gm.tier}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No game modes assigned</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
