import { useState } from 'react';
import { Player } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Crown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PlayerCardProps {
  player: Player;
  showRank?: boolean;
  rank?: number;
}

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="minecraft-card overflow-hidden hover:glow-emerald transition-all duration-300 group">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-4 p-4 cursor-pointer">
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
                {gameModes.length} game mode{gameModes.length !== 1 ? 's' : ''}
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
            
            <div className="ml-2">
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Full Body Skin */}
              <div className="flex flex-col items-center">
                <img
                  src={getSkinSource(150, 'body')}
                  alt={`${player.username} full skin`}
                  className="pixelated h-[200px] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://mc-heads.net/body/steve/150`;
                  }}
                />
                <div className="flex items-center gap-1 mt-2">
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
                </div>
              </div>
              
              {/* Game Modes Grid */}
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground mb-3">Game Modes & Tiers</h4>
                {gameModes.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {gameModes.map((gm, idx) => {
                      const isHTier = gm.tier?.startsWith('HT') ?? false;
                      return (
                        <div 
                          key={idx}
                          className="flex items-center justify-between p-2 bg-secondary/50 rounded-sm"
                        >
                          <span className="text-xs text-foreground truncate">{gm.gameMode}</span>
                          <Badge 
                            className={`font-minecraft text-[10px] px-1.5 py-0.5 ${
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
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
