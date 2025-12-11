import { Faction, Player } from './types';

export const INITIAL_PLAYER: Player = {
  name: '',
  faction: Faction.NEUTRAL,
  level: 1,
  exp: 0,
  maxExp: 100,
  hp: 100,
  maxHp: 100,
  strength: 10,
  intellect: 10,
  gold: 100,
  troops: 500
};

export const FACTION_INFO = {
  [Faction.WEI]: {
    color: 'text-blue-800',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-800',
    leader: '曹操',
    description: '挟天子以令诸侯，雄踞北方，兵多将广。'
  },
  [Faction.SHU]: {
    color: 'text-emerald-800',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-800',
    leader: '刘备',
    description: '仁义为本，据守西川，不仅有五虎上将，更有卧龙凤雏。'
  },
  [Faction.WU]: {
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-800',
    leader: '孙权',
    description: '据长江天险，江东才俊辈出，水军天下无双。'
  }
};