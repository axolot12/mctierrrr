import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { PlayerCard } from '@/components/PlayerCard';
import { GameModeFilter } from '@/components/GameModeFilter';
import { useAppStore } from '@/lib/store';
import { TIERS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

const PLAYERS_PER_PAGE = 10;

const List = () => {
  const { players } = useAppStore();
  const [selectedGameMode, setSelectedGameMode] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredAndSortedPlayers = useMemo(() => {
    let filtered = players;
    
    if (selectedGameMode !== 'all') {
      filtered = filtered.filter(p => 
        p.gameModes.some(gm => gm.gameMode === selectedGameMode)
      );
    }
    
    // Sort by best tier (earliest in TIERS array)
    return filtered.sort((a, b) => {
      const aBestTier = Math.min(...a.gameModes.map(gm => TIERS.indexOf(gm.tier)));
      const bBestTier = Math.min(...b.gameModes.map(gm => TIERS.indexOf(gm.tier)));
      return aBestTier - bBestTier;
    });
  }, [players, selectedGameMode]);
  
  const totalPages = Math.ceil(filteredAndSortedPlayers.length / PLAYERS_PER_PAGE);
  
  const paginatedPlayers = useMemo(() => {
    const start = (currentPage - 1) * PLAYERS_PER_PAGE;
    return filteredAndSortedPlayers.slice(start, start + PLAYERS_PER_PAGE);
  }, [filteredAndSortedPlayers, currentPage]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="font-minecraft text-xl text-foreground">Player List</h1>
          </div>
          
          <GameModeFilter 
            value={selectedGameMode} 
            onChange={(v) => {
              setSelectedGameMode(v);
              setCurrentPage(1);
            }} 
          />
        </div>
        
        {/* Tier Legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TIERS.map((tier) => {
            const isHT = tier.startsWith('HT');
            return (
              <span
                key={tier}
                className={`px-2 py-1 text-xs font-bold rounded-sm ${
                  isHT ? 'tier-badge-ht' : 'tier-badge-lt'
                }`}
              >
                {tier}
              </span>
            );
          })}
        </div>
        
        {/* Player List */}
        {paginatedPlayers.length > 0 ? (
          <div className="space-y-4">
            {paginatedPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        ) : (
          <div className="minecraft-card p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-minecraft text-lg text-foreground mb-2">No Players Found</h3>
            <p className="text-muted-foreground">
              {selectedGameMode === 'all' 
                ? 'No players have been added yet.'
                : `No players found in ${selectedGameMode} game mode.`}
            </p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="minecraft-button"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="minecraft-button w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="minecraft-button"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="py-8 border-t border-border mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Made by <span className="text-primary font-medium">Confession Team</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Not affiliated with Mojang or Microsoft.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default List;
