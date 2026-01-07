import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Home, List, Shield, LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const { currentUser, logout } = useAppStore();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="minecraft-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center minecraft-button">
              <span className="font-minecraft text-primary-foreground text-xs">MC</span>
            </div>
            <span className="font-minecraft text-sm text-gradient-emerald hidden sm:block">
              MCTIERS
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                size="sm"
                className="minecraft-button gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            
            <Link to="/list">
              <Button
                variant={isActive('/list') ? 'default' : 'ghost'}
                size="sm"
                className="minecraft-button gap-2"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </Button>
            </Link>
            
            {currentUser?.isOwner && (
              <Link to="/admin">
                <Button
                  variant={isActive('/admin') ? 'default' : 'ghost'}
                  size="sm"
                  className="minecraft-button gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}
          </div>
          
          {/* Auth Section */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-sm">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    {currentUser.isOwner ? (
                      <span className="text-gradient-gold font-minecraft text-xs">OWNER</span>
                    ) : (
                      currentUser.discordId
                    )}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="minecraft-button"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="minecraft-button">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
