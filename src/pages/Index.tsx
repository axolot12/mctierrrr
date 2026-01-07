import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { PlayerCard } from '@/components/PlayerCard';
import { useAppStore } from '@/lib/store';
import { Sword, Trophy, Sparkles } from 'lucide-react';

const Index = () => {
  const { players } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<typeof players[0] | null>(null);
  const [searched, setSearched] = useState(false);
  
  const featuredPlayers = useMemo(() => {
    return players
      .filter(p => p.isFeatured && p.featuredRank)
      .sort((a, b) => (a.featuredRank || 0) - (b.featuredRank || 0))
      .slice(0, 3);
  }, [players]);
  
  const handleSearch = (query: string) => {
    setSearched(true);
    const found = players.find(
      p => p.username.toLowerCase() === query.toLowerCase()
    );
    setSearchResult(found || null);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Sword className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Minecraft PvP Tier Rankings</span>
            </div>
            
            <h1 className="font-minecraft text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              <span className="text-gradient-emerald">MC</span>TIERS
            </h1>
            
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Search for any Minecraft player to see their PvP tier ranking and stats.
              Find out if they've been tested by our community.
            </p>
            
            <div className="flex justify-center">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Enter Minecraft username..."
              />
            </div>
          </div>
          
          {/* Search Result */}
          {searched && (
            <div className="max-w-md mx-auto mb-12">
              {searchResult ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <PlayerCard player={searchResult} />
                </div>
              ) : (
                <div className="minecraft-card p-6 text-center">
                  <p className="text-muted-foreground">
                    No player found with that username.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Players */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-6 h-6 text-gold" />
            <h2 className="font-minecraft text-xl text-foreground">
              Top Players
            </h2>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>
          
          {featuredPlayers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPlayers.map((player) => (
                <div 
                  key={player.id}
                  className={`${
                    player.featuredRank === 1 
                      ? 'glow-gold md:scale-105' 
                      : player.featuredRank === 2 
                        ? 'glow-diamond' 
                        : ''
                  }`}
                >
                  <PlayerCard 
                    player={player} 
                    showRank 
                    rank={player.featuredRank} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="minecraft-card p-8 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No featured players yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 MCTiers. Not affiliated with Mojang or Microsoft.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
