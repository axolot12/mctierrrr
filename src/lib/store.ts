import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, User, OWNER_DISCORD_ID, PlayerGameMode } from './types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface AppState {
  currentUser: User | null;
  users: User[];
  players: Player[];
  gameModes: string[];
  isLoading: boolean;
  
  // Init actions
  initializeData: () => Promise<void>;
  subscribeToRealtime: () => () => void;
  
  // Auth actions
  login: (discordId: string) => Promise<boolean>;
  logout: () => void;
  register: (discordId: string) => Promise<boolean>;
  
  // Player actions
  addPlayer: (player: Omit<Player, 'id' | 'createdAt'>) => Promise<void>;
  updatePlayer: (id: string, updates: Partial<Player>) => Promise<void>;
  deletePlayer: (id: string) => Promise<void>;
  setFeaturedPlayer: (id: string, rank: 1 | 2 | 3) => Promise<void>;
  removeFeatured: (id: string) => Promise<void>;
  
  // User actions
  deleteUser: (id: string) => Promise<void>;
  
  // GameMode actions
  addGameMode: (gameMode: string) => Promise<void>;
  removeGameMode: (gameMode: string) => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      players: [],
      gameModes: [],
      isLoading: true,
      
      initializeData: async () => {
        try {
          // Fetch players
          const { data: playersData } = await supabase
            .from('players')
            .select('*')
            .order('created_at', { ascending: false });
          
          // Fetch users
          const { data: usersData } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
          
          // Fetch game modes
          const { data: gameModesData } = await supabase
            .from('game_modes')
            .select('*')
            .order('name');
          
          const players: Player[] = (playersData || []).map(p => ({
            id: p.id,
            username: p.username,
            skinUrl: p.skin_url,
            isPremium: p.is_premium,
            gameModes: (p.game_modes as unknown as PlayerGameMode[]) || [],
            isTested: p.is_tested,
            isFeatured: p.is_featured,
            featuredRank: p.featured_rank as 1 | 2 | 3 | undefined,
            createdAt: new Date(p.created_at)
          }));
          
          const users: User[] = (usersData || []).map(u => ({
            id: u.id,
            discordId: u.discord_id,
            isOwner: u.is_owner,
            createdAt: new Date(u.created_at)
          }));
          
          const gameModes = (gameModesData || []).map(gm => gm.name);
          
          set({ players, users, gameModes, isLoading: false });
        } catch (error) {
          console.error('Error initializing data:', error);
          set({ isLoading: false });
        }
      },
      
      subscribeToRealtime: () => {
        const channel = supabase
          .channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => {
            get().initializeData();
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
            get().initializeData();
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'game_modes' }, () => {
            get().initializeData();
          })
          .subscribe();
        
        return () => {
          supabase.removeChannel(channel);
        };
      },
      
      login: async (discordId: string) => {
        const normalizedId = discordId.toLowerCase().trim();
        const isOwner = normalizedId === OWNER_DISCORD_ID.toLowerCase();
        
        // Check if user exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('discord_id', normalizedId)
          .single();
        
        if (existingUser) {
          set({ 
            currentUser: {
              id: existingUser.id,
              discordId: existingUser.discord_id,
              isOwner: existingUser.is_owner || isOwner,
              createdAt: new Date(existingUser.created_at)
            }
          });
          return true;
        } else if (isOwner) {
          // Auto-create owner account
          const { data: newUser } = await supabase
            .from('users')
            .insert({ discord_id: normalizedId, is_owner: true })
            .select()
            .single();
          
          if (newUser) {
            const user: User = {
              id: newUser.id,
              discordId: newUser.discord_id,
              isOwner: true,
              createdAt: new Date(newUser.created_at)
            };
            set(state => ({
              users: [...state.users, user],
              currentUser: user
            }));
            return true;
          }
        }
        return false;
      },
      
      logout: () => set({ currentUser: null }),
      
      register: async (discordId: string) => {
        const normalizedId = discordId.toLowerCase().trim();
        
        // Check if user exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('discord_id', normalizedId)
          .single();
        
        if (existingUser) return false;
        
        const isOwner = normalizedId === OWNER_DISCORD_ID.toLowerCase();
        
        const { data: newUser, error } = await supabase
          .from('users')
          .insert({ discord_id: normalizedId, is_owner: isOwner })
          .select()
          .single();
        
        if (error || !newUser) return false;
        
        const user: User = {
          id: newUser.id,
          discordId: newUser.discord_id,
          isOwner: newUser.is_owner,
          createdAt: new Date(newUser.created_at)
        };
        
        set(state => ({
          users: [...state.users, user],
          currentUser: user
        }));
        
        return true;
      },
      
      addPlayer: async (playerData) => {
        const { error } = await supabase
          .from('players')
          .insert([{
            username: playerData.username,
            skin_url: playerData.skinUrl,
            is_premium: playerData.isPremium,
            game_modes: playerData.gameModes as unknown as Json,
            is_tested: playerData.isTested,
            is_featured: playerData.isFeatured,
            featured_rank: playerData.featuredRank
          }]);
        
        if (error) console.error('Error adding player:', error);
      },
      
      updatePlayer: async (id, updates) => {
        const dbUpdates: Record<string, unknown> = {};
        if (updates.username !== undefined) dbUpdates.username = updates.username;
        if (updates.skinUrl !== undefined) dbUpdates.skin_url = updates.skinUrl;
        if (updates.isPremium !== undefined) dbUpdates.is_premium = updates.isPremium;
        if (updates.gameModes !== undefined) dbUpdates.game_modes = updates.gameModes as unknown as Json;
        if (updates.isTested !== undefined) dbUpdates.is_tested = updates.isTested;
        if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;
        if (updates.featuredRank !== undefined) dbUpdates.featured_rank = updates.featuredRank;
        
        const { error } = await supabase
          .from('players')
          .update(dbUpdates)
          .eq('id', id);
        
        if (error) console.error('Error updating player:', error);
      },
      
      deletePlayer: async (id) => {
        const { error } = await supabase
          .from('players')
          .delete()
          .eq('id', id);
        
        if (error) console.error('Error deleting player:', error);
      },
      
      setFeaturedPlayer: async (id, rank) => {
        // First, remove the rank from any other player
        await supabase
          .from('players')
          .update({ is_featured: false, featured_rank: null })
          .eq('featured_rank', rank);
        
        // Then set this player as featured
        await supabase
          .from('players')
          .update({ is_featured: true, featured_rank: rank })
          .eq('id', id);
      },
      
      removeFeatured: async (id) => {
        await supabase
          .from('players')
          .update({ is_featured: false, featured_rank: null })
          .eq('id', id);
      },
      
      deleteUser: async (id) => {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', id);
        
        if (error) console.error('Error deleting user:', error);
      },
      
      addGameMode: async (gameMode: string) => {
        const trimmed = gameMode.trim();
        if (!trimmed) return;
        
        const { error } = await supabase
          .from('game_modes')
          .insert({ name: trimmed });
        
        if (error) console.error('Error adding game mode:', error);
      },
      
      removeGameMode: async (gameMode: string) => {
        const { error } = await supabase
          .from('game_modes')
          .delete()
          .eq('name', gameMode);
        
        if (error) console.error('Error removing game mode:', error);
      }
    }),
    {
      name: 'mctiers-auth',
      partialize: (state) => ({ currentUser: state.currentUser })
    }
  )
);
