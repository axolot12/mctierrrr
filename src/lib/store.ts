import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, User, OWNER_DISCORD_ID, DEFAULT_GAME_MODES } from './types';

interface AppState {
  currentUser: User | null;
  users: User[];
  players: Player[];
  gameModes: string[];
  
  // Auth actions
  login: (discordId: string) => void;
  logout: () => void;
  register: (discordId: string) => boolean;
  
  // Player actions
  addPlayer: (player: Omit<Player, 'id' | 'createdAt'>) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  setFeaturedPlayer: (id: string, rank: 1 | 2 | 3) => void;
  removeFeatured: (id: string) => void;
  
  // User actions
  deleteUser: (id: string) => void;
  
  // GameMode actions
  addGameMode: (gameMode: string) => void;
  removeGameMode: (gameMode: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      players: [],
      gameModes: DEFAULT_GAME_MODES,
      
      login: (discordId: string) => {
        const normalizedId = discordId.toLowerCase().trim();
        const isOwner = normalizedId === OWNER_DISCORD_ID.toLowerCase();
        
        const existingUser = get().users.find(
          u => u.discordId.toLowerCase() === normalizedId
        );
        
        if (existingUser) {
          set({ currentUser: { ...existingUser, isOwner } });
        } else if (isOwner) {
          const ownerUser: User = {
            id: crypto.randomUUID(),
            discordId: normalizedId,
            isOwner: true,
            createdAt: new Date()
          };
          set(state => ({
            users: [...state.users, ownerUser],
            currentUser: ownerUser
          }));
        }
      },
      
      logout: () => set({ currentUser: null }),
      
      register: (discordId: string) => {
        const normalizedId = discordId.toLowerCase().trim();
        const exists = get().users.some(
          u => u.discordId.toLowerCase() === normalizedId
        );
        
        if (exists) return false;
        
        const newUser: User = {
          id: crypto.randomUUID(),
          discordId: normalizedId,
          isOwner: normalizedId === OWNER_DISCORD_ID.toLowerCase(),
          createdAt: new Date()
        };
        
        set(state => ({
          users: [...state.users, newUser],
          currentUser: newUser
        }));
        
        return true;
      },
      
      addPlayer: (playerData) => {
        const newPlayer: Player = {
          ...playerData,
          id: crypto.randomUUID(),
          createdAt: new Date()
        };
        set(state => ({ players: [...state.players, newPlayer] }));
      },
      
      updatePlayer: (id, updates) => {
        set(state => ({
          players: state.players.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        }));
      },
      
      deletePlayer: (id) => {
        set(state => ({
          players: state.players.filter(p => p.id !== id)
        }));
      },
      
      setFeaturedPlayer: (id, rank) => {
        set(state => ({
          players: state.players.map(p => {
            if (p.id === id) {
              return { ...p, isFeatured: true, featuredRank: rank };
            }
            if (p.featuredRank === rank) {
              return { ...p, isFeatured: false, featuredRank: undefined };
            }
            return p;
          })
        }));
      },
      
      removeFeatured: (id) => {
        set(state => ({
          players: state.players.map(p => 
            p.id === id ? { ...p, isFeatured: false, featuredRank: undefined } : p
          )
        }));
      },
      
      deleteUser: (id) => {
        set(state => ({
          users: state.users.filter(u => u.id !== id)
        }));
      },
      
      addGameMode: (gameMode: string) => {
        const trimmed = gameMode.trim();
        if (!trimmed) return;
        set(state => {
          if (state.gameModes.includes(trimmed)) return state;
          return { gameModes: [...state.gameModes, trimmed] };
        });
      },
      
      removeGameMode: (gameMode: string) => {
        set(state => ({
          gameModes: state.gameModes.filter(gm => gm !== gameMode)
        }));
      }
    }),
    {
      name: 'mctiers-storage'
    }
  )
);
