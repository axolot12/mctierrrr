import { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Logo } from '@/components/Logo';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { TIERS, Tier, PlayerGameMode, Player } from '@/lib/types';
import { 
  Plus, Users, Search, Edit, Trash2, Save, X, 
  Star, ChevronLeft, ChevronRight, Download, Gamepad2, Settings
} from 'lucide-react';

const USERS_PER_PAGE = 10;
const PLAYERS_PER_PAGE = 10;

const Admin = () => {
  const { 
    currentUser, players, users, gameModes,
    addPlayer, updatePlayer, deletePlayer, setFeaturedPlayer, removeFeatured, deleteUser,
    addGameMode, removeGameMode
  } = useAppStore();
  
  // Player form state
  const [username, setUsername] = useState('');
  const [skinUrl, setSkinUrl] = useState('');
  const [selectedGameModes, setSelectedGameModes] = useState<PlayerGameMode[]>([]);
  const [currentGameMode, setCurrentGameMode] = useState('');
  const [currentTier, setCurrentTier] = useState<Tier>('HT1');
  const [isTested, setIsTested] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  
  // GameMode form state
  const [newGameMode, setNewGameMode] = useState('');
  
  // Search/filter state
  const [playerSearch, setPlayerSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [playerPage, setPlayerPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  
  // Edit state
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  
  if (!currentUser?.isOwner) {
    return <Navigate to="/" replace />;
  }
  
  const fetchSkin = async () => {
    if (!username.trim()) return;
    setIsFetching(true);
    const url = `https://mc-heads.net/avatar/${username}/128`;
    setSkinUrl(url);
    setIsFetching(false);
  };
  
  const addGameModeToPlayer = () => {
    if (!currentGameMode) return;
    if (selectedGameModes.some(gm => gm.gameMode === currentGameMode)) return;
    
    setSelectedGameModes([...selectedGameModes, { gameMode: currentGameMode, tier: currentTier }]);
    setCurrentGameMode('');
    setCurrentTier('HT1');
  };
  
  const removeGameModeFromPlayer = (gameMode: string) => {
    setSelectedGameModes(selectedGameModes.filter(gm => gm.gameMode !== gameMode));
  };
  
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !skinUrl || selectedGameModes.length === 0) return;
    
    addPlayer({
      username: username.trim(),
      skinUrl,
      gameModes: selectedGameModes,
      isTested,
      isFeatured: false
    });
    
    setUsername('');
    setSkinUrl('');
    setSelectedGameModes([]);
    setIsTested(true);
  };
  
  const handleUpdatePlayer = () => {
    if (!editingPlayer) return;
    updatePlayer(editingPlayer.id, {
      username: editingPlayer.username,
      gameModes: editingPlayer.gameModes,
      isTested: editingPlayer.isTested
    });
    setEditingPlayer(null);
  };
  
  const handleAddNewGameMode = () => {
    if (!newGameMode.trim()) return;
    addGameMode(newGameMode);
    setNewGameMode('');
  };
  
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
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-sm blur-lg" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-primary to-emerald rounded-sm flex items-center justify-center minecraft-button">
              <Settings className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="font-minecraft text-2xl text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage players, users and game modes</p>
          </div>
        </div>
        
        <Tabs defaultValue="add-player" className="space-y-6">
          <TabsList className="bg-secondary p-1 flex-wrap h-auto gap-1">
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
            <TabsTrigger value="gamemodes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Game Modes
            </TabsTrigger>
          </TabsList>
          
          {/* Add Player Tab */}
          <TabsContent value="add-player">
            <div className="minecraft-card p-6 max-w-3xl">
              <h2 className="font-minecraft text-lg text-foreground mb-6">Add New Player</h2>
              
              <form onSubmit={handleAddPlayer} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    
                    {/* Game Mode Selection */}
                    <div className="space-y-3">
                      <Label>Add Game Modes</Label>
                      <div className="flex gap-2">
                        <Select value={currentGameMode} onValueChange={setCurrentGameMode}>
                          <SelectTrigger className="minecraft-border bg-secondary/50 flex-1">
                            <SelectValue placeholder="Select game mode" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {gameModes.map((gm) => (
                              <SelectItem key={gm} value={gm}>{gm}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={currentTier} onValueChange={(v) => setCurrentTier(v as Tier)}>
                          <SelectTrigger className="minecraft-border bg-secondary/50 w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {TIERS.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          onClick={addGameModeToPlayer}
                          disabled={!currentGameMode}
                          className="minecraft-button"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Selected Game Modes */}
                      {selectedGameModes.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 bg-secondary/30 rounded-sm">
                          {selectedGameModes.map((gm) => {
                            const isHT = gm.tier.startsWith('HT');
                            return (
                              <Badge 
                                key={gm.gameMode}
                                variant="secondary"
                                className="flex items-center gap-2 pr-1"
                              >
                                <span>{gm.gameMode}</span>
                                <span className={`px-1 rounded text-[10px] ${isHT ? 'bg-red-500' : 'bg-blue-500'}`}>
                                  {gm.tier}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeGameModeFromPlayer(gm.gameMode)}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            );
                          })}
                        </div>
                      )}
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
                  
                  {/* Preview */}
                  <div className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-sm">
                    {skinUrl ? (
                      <div className="text-center">
                        <img
                          src={`https://mc-heads.net/body/${username}/150`}
                          alt={username}
                          className="pixelated mx-auto mb-4 h-[180px]"
                        />
                        <p className="font-minecraft text-sm text-foreground">{username}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedGameModes.length} game mode(s)
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <div className="w-32 h-40 bg-secondary rounded-sm mx-auto mb-4 flex items-center justify-center">
                          <Users className="w-12 h-12" />
                        </div>
                        <p className="text-sm">Enter username and fetch skin</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={!username.trim() || !skinUrl || selectedGameModes.length === 0}
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
                        src={`https://mc-heads.net/avatar/${player.username}/48`}
                        alt={player.username}
                        className="w-12 h-12 pixelated"
                      />
                      
                      {editingPlayer?.id === player.id ? (
                        <>
                          <div className="flex-1">
                            <Input
                              value={editingPlayer.username}
                              onChange={(e) => setEditingPlayer({...editingPlayer, username: e.target.value})}
                              className="minecraft-border bg-secondary/50 mb-2"
                            />
                            <div className="flex flex-wrap gap-1">
                              {editingPlayer.gameModes.map((gm, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {gm.gameMode}: {gm.tier}
                                </Badge>
                              ))}
                            </div>
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
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">{player.username}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {player.gameModes.slice(0, 3).map((gm, idx) => (
                                <Badge key={idx} variant="secondary" className="text-[10px]">
                                  {gm.gameMode}: {gm.tier}
                                </Badge>
                              ))}
                              {player.gameModes.length > 3 && (
                                <Badge variant="outline" className="text-[10px]">
                                  +{player.gameModes.length - 3} more
                                </Badge>
                              )}
                            </div>
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
          
          {/* Game Modes Tab */}
          <TabsContent value="gamemodes">
            <div className="minecraft-card p-6 max-w-2xl">
              <h2 className="font-minecraft text-lg text-foreground mb-6">Manage Game Modes</h2>
              
              {/* Add new game mode */}
              <div className="flex gap-2 mb-6">
                <Input
                  value={newGameMode}
                  onChange={(e) => setNewGameMode(e.target.value)}
                  placeholder="Enter new game mode name..."
                  className="minecraft-border bg-secondary/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNewGameMode()}
                />
                <Button onClick={handleAddNewGameMode} className="minecraft-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              
              {/* Game modes list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {gameModes.map((gm) => (
                  <div 
                    key={gm}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{gm}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeGameMode(gm)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {gameModes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No game modes added yet
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
