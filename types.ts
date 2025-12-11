export enum Faction {
  WEI = '魏',
  SHU = '蜀',
  WU = '吴',
  NEUTRAL = '在野'
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  BATTLE = 'BATTLE',
  GAME_OVER = 'GAME_OVER'
}

export interface Player {
  name: string;
  faction: Faction;
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  strength: number; // For physical attacks
  intellect: number; // For strategy/skills
  gold: number;
  troops: number;
}

export interface Enemy {
  name: string;
  title: string;
  hp: number;
  maxHp: number;
  strength: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Boss';
}

export interface LogEntry {
  id: string;
  text: string;
  type: 'info' | 'combat' | 'event' | 'gain' | 'loss';
  timestamp: number;
}

export interface BattleState {
  active: boolean;
  round: number;
  enemy: Enemy | null;
  playerTurn: boolean;
  logs: string[];
}