import { Swords } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo = ({ size = 'md', showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };
  
  const textClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };
  
  return (
    <div className="flex items-center gap-2 group">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer glow */}
        <div className="absolute inset-0 bg-primary/30 rounded-sm blur-md group-hover:blur-lg transition-all" />
        
        {/* Main logo container */}
        <div className={`${sizeClasses[size]} relative bg-gradient-to-br from-primary via-emerald to-primary rounded-sm flex items-center justify-center minecraft-button overflow-hidden`}>
          {/* Pixel grid overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--bedrock)) 1px, transparent 1px),
                              linear-gradient(to bottom, hsl(var(--bedrock)) 1px, transparent 1px)`,
            backgroundSize: '4px 4px'
          }} />
          
          {/* Icon */}
          <Swords className="w-1/2 h-1/2 text-primary-foreground relative z-10" />
        </div>
      </div>
      
      {showText && (
        <div className={`font-minecraft ${textClasses[size]}`}>
          <span className="text-gradient-emerald">MC</span>
          <span className="text-foreground">TIERS</span>
        </div>
      )}
    </div>
  );
};
