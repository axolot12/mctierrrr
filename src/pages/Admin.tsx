import { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { TIERS, GAME_MODES, Tier, GameMode, Player } from '@/lib/types';
import { 
  Plus, Users, Search, Edit, Trash2, Save, X, 
  Star, ChevronLeft, ChevronRight, Download 
} from 'lucide-react';

const USERS_PER_PAGE = 10;
const PLAYERS_PER_PAGE = 10;

const Admin = () => {
  const { currentUser, players, users, addPlayer, updatePlayer, deletePlayer, setFeaturedPlayer, removeFeatured, deleteUser } = useAppStore();
  
  // Player form state
  const [username, setUsername] = useState('');
  const [skinUrl, setSkinUrl] = useState('');
  const [tier, setTier] = useState<Tier>('HT1');
  const [gameMode, setGameMode] = useState<GameMode>('SMP');
  const [isTested, setIsTested] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  
  // Search/filter state
  const [playerSearch, setPlayerSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [playerPage, setPlayerPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  
  // Edit state
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  
  // Redirect if not owner
  if (!currentUser?.isOwner) {
    return <Navigate to="/" replace />;
  }
  
  const fetchSkin = async () => {
    if (!username.trim()) return;
    
    setIsFetching(true);
    // Using MC-Heads API for avatar
    const url = `https://mc-heads.net/avatar/${username}/128`;
    setSkinUrl(url);
    setIsFetching(false);
  };
  
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !skinUrl) return;
    
    addPlayer({
      username: username.trim(),
      skinUrl,
      tier,
      gameMode,
      isTested,
      isFeatured: false
    });
    
    // Reset form
    setUsername('');
    setSkinUrl('');
    setTier('HT1');
    setGameMode('SMP');
    setIsTested(true);
  };
  
  const handleUpdatePlayer = () => {
    if (!editingPlayer) return;
    
    updatePlayer(editingPlayer.id, {
      username: editingPlayer.username,
      tier: editingPlayer.tier,
      gameMode: editingPlayer.gameMode,
      isTested: editingPlayer.isTested
    });
    
    setEditingPlayer(null);
  };
  
  // Filtered players
  const filteredPlayers = useMemo(() => {
    return players.filter(p => 
      p.username.toLowerCase().includes(playerSearch.toLowerCase())
    );
  }, [players, playerSearch]);
  
  const totalPlayerPages = Math.ceil(filteredPlayers.length / PLAYERS_PER_PAGE);
  const paginatedPlayers = filteredPlayers.slice(
    (playerPage - 1) * PLAYERS_PER_PAGE,
    playerPage * PLAYERS_PER_PAGE
  );
  
  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.discordId.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);
  
  const totalUserPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * USERS_PER_PAGE,
    userPage * USERS_PER_PAGE
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
            <span className="font-minecraft text-xs text-primary-foreground">⚙</span>
          </div>
          <h1 className="font-minecraft text-2xl text-foreground">Admin Panel</h1>
        </div>
        
        <Tabs defaultValue="add-player" className="space-y-6">
          <TabsList className="bg-secondary p-1">
            <TabsTrigger value="add-player" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Players
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>
          
          {/* Add Player Tab */}
          <TabsContent value="add-player">
            <div className="minecraft-card p-6 max-w-2xl">
              <h2 className="font-minecraft text-lg text-foreground mb-6">Add New Player</h2>
              
              <form onSubmit={handleAddPlayer} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Form */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Minecraft Username</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username"
                          className="minecraft-border bg-secondary/50"
                        />
                        <Button 
                          type="button" 
                          onClick={fetchSkin}
                          disabled={isFetching || !username.trim()}
                          className="minecraft-button"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="tier">Tier</Label>
                      <Select value={tier} onValueChange={(v) => setTier(v as Tier)}>
                        <SelectTrigger className="minecraft-border bg-secondary/50 mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {TIERS.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="gameMode">Game Mode</Label>
                      <Select value={gameMode} onValueChange={(v) => setGameMode(v as GameMode)}>
                        <SelectTrigger className="minecraft-border bg-secondary/50 mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {GAME_MODES.map((gm) => (
                            <SelectItem key={gm} value={gm}>{gm}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Switch
                        id="tested"
                        checked={isTested}
                        onCheckedChange={setIsTested}
                      />
                      <Label htmlFor="tested">Tested Player</Label>
                    </div>
                  </div>
                  
                  {/* Right Column - Preview */}
                  <div className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-sm">
                    {skinUrl ? (
                      <div className="text-center">
                        <img
                          src={skinUrl}
                          alt={username}
                          className="w-32 h-32 pixelated mx-auto mb-4"
                        />
                        <p className="font-minecraft text-sm text-foreground">{username}</p>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <div className="w-32 h-32 bg-secondary rounded-sm mx-auto mb-4 flex items-center justify-center">
                          <Users className="w-12 h-12" />
                        </div>
                        <p className="text-sm">Enter username and fetch skin</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={!username.trim() || !skinUrl}
                  className="w-full minecraft-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Player
                </Button>
              </form>
            </div>
          </TabsContent>
          
          {/* Players Tab */}
          <TabsContent value="players">
            <div className="minecraft-card p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <h2 className="font-minecraft text-lg text-foreground">Manage Players</h2>
                <div className="flex-1" />
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={playerSearch}
                    onChange={(e) => {
                      setPlayerSearch(e.target.value);
                      setPlayerPage(1);
                    }}
                    placeholder="Search players..."
                    className="pl-10 minecraft-border bg-secondary/50"
                  />
                </div>
              </div>
              
              {paginatedPlayers.length > 0 ? (
                <div className="space-y-3">
                  {paginatedPlayers.map((player) => (
                    <div key={player.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-sm">
                      <img
                        src={player.skinUrl}
                        alt={player.username}
                        className="w-12 h-12 pixelated"
                      />
                      
                      {editingPlayer?.id === player.id ? (
                        <>
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <Input
                              value={editingPlayer.username}
                              onChange={(e) => setEditingPlayer({...editingPlayer, username: e.target.value})}
                              className="minecraft-border bg-secondary/50"
                            />
                            <Select 
                              value={editingPlayer.tier} 
                              onValueChange={(v) => setEditingPlayer({...editingPlayer, tier: v as Tier})}
                            >
                              <SelectTrigger className="minecraft-border bg-secondary/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                {TIERS.map((t) => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select 
                              value={editingPlayer.gameMode} 
                              onValueChange={(v) => setEditingPlayer({...editingPlayer, gameMode: v as GameMode})}
                            >
                              <SelectTrigger className="minecraft-border bg-secondary/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                {GAME_MODES.map((gm) => (
                                  <SelectItem key={gm} value={gm}>{gm}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleUpdatePlayer} className="minecraft-button">
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingPlayer(null)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{player.username}</p>
                            <p className="text-sm text-muted-foreground">{player.gameMode} • {player.tier}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant={player.isFeatured ? 'default' : 'ghost'}
                              onClick={() => {
                                if (player.isFeatured) {
                                  removeFeatured(player.id);
                                } else {
                                  const nextRank = ([1, 2, 3] as const).find(
                                    r => !players.some(p => p.featuredRank === r)
                                  );
                                  if (nextRank) setFeaturedPlayer(player.id, nextRank);
                                }
                              }}
                              className="minecraft-button"
                            >
                              <Star className={`w-4 h-4 ${player.isFeatured ? 'fill-current' : ''}`} />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingPlayer(player)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => deletePlayer(player.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No players found
                </div>
              )}
              
              {/* Pagination */}
              {totalPlayerPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPlayerPage(p => Math.max(1, p - 1))}
                    disabled={playerPage === 1}
                    className="minecraft-button"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {playerPage} of {totalPlayerPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPlayerPage(p => Math.min(totalPlayerPages, p + 1))}
                    disabled={playerPage === totalPlayerPages}
                    className="minecraft-button"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <div className="minecraft-card p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <h2 className="font-minecraft text-lg text-foreground">Manage Users</h2>
                <div className="flex-1" />
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setUserPage(1);
                    }}
                    placeholder="Search users..."
                    className="pl-10 minecraft-border bg-secondary/50"
                  />
                </div>
              </div>
              
              {paginatedUsers.length > 0 ? (
                <div className="space-y-3">
                  {paginatedUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-sm">
                      <div className="w-10 h-10 bg-primary/20 rounded-sm flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {user.isOwner ? (
                            <span className="text-gradient-gold font-minecraft text-sm">OWNER</span>
                          ) : (
                            user.discordId
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {!user.isOwner && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => deleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No users found
                </div>
              )}
              
              {/* Pagination */}
              {totalUserPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserPage(p => Math.max(1, p - 1))}
                    disabled={userPage === 1}
                    className="minecraft-button"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {userPage} of {totalUserPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                    disabled={userPage === totalUserPages}
                    className="minecraft-button"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
