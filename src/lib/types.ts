export type Tier = 'HT1' | 'LT1' | 'HT2' | 'LT2' | 'HT3' | 'LT3' | 'HT4' | 'LT4' | 'HT5' | 'LT5';

export type GameMode = 
  | 'SMP'
  | 'Lifesteal'
  | 'Practice'
  | 'Bedwars'
  | 'Skywars'
  | 'UHC'
  | 'Survival Games'
  | 'Crystal PvP'
  | 'Pot PvP'
  | 'Sword'
  | 'Axe'
  | 'Netherite Pot';

export interface Player {
  id: string;
  username: string;
  skinUrl: string;
  tier: Tier;
  gameMode: GameMode;
  isTested: boolean;
  isFeatured: boolean;
  featuredRank?: 1 | 2 | 3;
  createdAt: Date;
}

export interface User {
  id: string;
  discordId: string;
  isOwner: boolean;
  createdAt: Date;
}

export const TIERS: Tier[] = ['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 'HT4', 'LT4', 'HT5', 'LT5'];

export const GAME_MODES: GameMode[] = [
  'SMP',
  'Lifesteal',
  'Practice',
  'Bedwars',
  'Skywars',
  'UHC',
  'Survival Games',
  'Crystal PvP',
  'Pot PvP',
  'Sword',
  'Axe',
  'Netherite Pot'
];

export const OWNER_DISCORD_ID = 'axolotal1212';
