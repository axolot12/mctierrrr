import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { OWNER_DISCORD_ID } from '@/lib/types';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, users } = useAppStore();
  const [loginId, setLoginId] = useState('');
  const [registerId, setRegisterId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const normalizedId = loginId.toLowerCase().trim();
    
    if (!normalizedId) {
      setError('Please enter your Discord ID');
      return;
    }
    
    const userExists = users.some(u => u.discordId.toLowerCase() === normalizedId);
    const isOwner = normalizedId === OWNER_DISCORD_ID.toLowerCase();
    
    if (!userExists && !isOwner) {
      setError('No account found with this Discord ID. Please register first.');
      return;
    }
    
    login(loginId);
    navigate('/');
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!registerId.trim()) {
      setError('Please enter your Discord ID');
      return;
    }
    
    const success = register(registerId);
    
    if (success) {
      setSuccess('Registration successful! You are now logged in.');
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError('This Discord ID is already registered. Please login instead.');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="minecraft-card p-8">
            <div className="text-center mb-8">
              <h1 className="font-minecraft text-2xl text-foreground mb-2">
                Welcome to <span className="text-gradient-emerald">MCTiers</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Login or register using your Discord ID
              </p>
            </div>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-discord">Discord ID</Label>
                    <Input
                      id="login-discord"
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="Enter your Discord ID"
                      className="minecraft-border bg-secondary/50 mt-2"
                    />
                  </div>
                  
                  {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full minecraft-button">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-discord">Discord ID</Label>
                    <Input
                      id="register-discord"
                      type="text"
                      value={registerId}
                      onChange={(e) => setRegisterId(e.target.value)}
                      placeholder="Enter your Discord ID"
                      className="minecraft-border bg-secondary/50 mt-2"
                    />
                  </div>
                  
                  {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="flex items-center gap-2 text-primary text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {success}
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full minecraft-button">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 p-4 bg-secondary/30 rounded-sm border border-border">
              <p className="text-xs text-muted-foreground text-center">
                🎮 Use your Discord ID to login. The owner can login with their special ID to access admin features.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
