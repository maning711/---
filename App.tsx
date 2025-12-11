import React, { useState, useEffect, useRef } from 'react';
import CharacterSetup from './components/CharacterSetup';
import Dashboard from './components/Dashboard';
import BattleInterface from './components/BattleInterface';
import { Player, GameState, LogEntry, BattleState, Faction, Enemy } from './types';
import { INITIAL_PLAYER } from './constants';
import * as GeminiService from './services/geminiService';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Battle State
  const [battle, setBattle] = useState<BattleState>({
    active: false,
    round: 0,
    enemy: null,
    playerTurn: true,
    logs: []
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Helper to add log
  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    const newLog = {
      id: Date.now().toString() + Math.random(),
      text,
      type,
      timestamp: Date.now()
    };
    setLogs(prev => [...prev, newLog]);
    
    // Auto scroll dashboard log
    setTimeout(() => {
      const el = document.getElementById('log-end');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Character creation handler
  const handleCharacterComplete = (newPlayer: Player) => {
    setPlayer(newPlayer);
    setGameState(GameState.PLAYING);
    addLog(`乱世之中，${newPlayer.name}在${newPlayer.faction}举起了义旗！`, 'event');
    GeminiService.generateEventNarrative(newPlayer, "初入乱世").then(text => addLog(text, 'event'));
  };

  // Main Dashboard Actions
  const handleAction = async (action: string) => {
    if (gameState !== GameState.PLAYING) return;

    switch (action) {
      case 'PATROL':
        await handlePatrol();
        break;
      case 'RECRUIT':
        handleRecruit();
        break;
      case 'GOVERN':
        handleGovern();
        break;
      case 'REST':
        handleRest();
        break;
    }
  };

  // 1. Patrol -> Combat or Event
  const handlePatrol = async () => {
    // 70% chance of battle
    if (Math.random() > 0.3) {
      addLog("巡逻途中遭遇敌军！准备战斗！", 'combat');
      const enemy = await GeminiService.generateEnemy(player.level);
      startBattle(enemy);
    } else {
      // Event
      const gain = Math.floor(Math.random() * 20) + 10;
      updatePlayer({ exp: player.exp + 5, gold: player.gold + gain });
      addLog(`巡逻平安无事，获得少量补给 (黄金 +${gain})。`, 'gain');
      // Flavor
      const flavor = await GeminiService.generateEventNarrative(player, "巡视边境");
      addLog(flavor, 'event');
    }
  };

  // 2. Recruit
  const handleRecruit = async () => {
    if (player.gold < 50) {
      addLog("军费不足，无法招募士兵！(需50黄金)", 'info');
      return;
    }
    const amount = Math.floor(Math.random() * 50) + 20;
    updatePlayer({ gold: player.gold - 50, troops: player.troops + amount });
    addLog(`花费50黄金，招募了 ${amount} 名乡勇。`, 'gain');
  };

  // 3. Govern
  const handleGovern = () => {
    const revenue = Math.floor(player.intellect * 1.5) + 20;
    updatePlayer({ gold: player.gold + revenue });
    addLog(`治理领地，获得税收 ${revenue} 黄金。`, 'gain');
  };

  // 4. Rest
  const handleRest = () => {
    const heal = Math.floor(player.maxHp * 0.3);
    const newHp = Math.min(player.maxHp, player.hp + heal);
    updatePlayer({ hp: newHp });
    addLog(`休养生息，恢复了 ${newHp - player.hp} 点体力。`, 'info');
  };

  // State Updater Wrapper
  const updatePlayer = (updates: Partial<Player>) => {
    setPlayer(prev => {
      const next = { ...prev, ...updates };
      // Check Level Up
      if (next.exp >= next.maxExp) {
        next.level += 1;
        next.exp -= next.maxExp;
        next.maxExp = Math.floor(next.maxExp * 1.2);
        next.maxHp += 20;
        next.hp = next.maxHp;
        next.strength += 2;
        next.intellect += 2;
        addLog(`恭喜！等级提升至 ${next.level}！各项属性大幅提升！`, 'gain');
      }
      return next;
    });
  };

  // --- Battle System ---

  const startBattle = (enemy: Enemy) => {
    setBattle({
      active: true,
      round: 1,
      enemy,
      playerTurn: true,
      logs: [`遭遇到 ${enemy.title} ${enemy.name}！`]
    });
    setGameState(GameState.BATTLE);
  };

  const handleBattleAction = async (action: 'ATTACK' | 'SKILL' | 'DEFEND') => {
    if (!battle.enemy) return;
    
    let damage = 0;
    let logText = "";
    const enemy = battle.enemy;
    const isCrit = Math.random() > 0.8;

    // Player Turn
    if (action === 'ATTACK') {
      damage = Math.floor(player.strength * (Math.random() * 0.4 + 0.8));
      if (isCrit) damage = Math.floor(damage * 1.5);
    } else if (action === 'SKILL') {
      if (player.intellect > player.strength) {
         // Strategist skill
         damage = Math.floor(player.intellect * 1.5);
         logText = "施展计谋火攻！";
      } else {
         // Warrior skill
         damage = Math.floor(player.strength * 1.2 + 10);
         logText = "施展无双乱舞！";
      }
    } else {
      // Defend
      logText = "采取防御姿态，减少受到的伤害。";
    }

    // Apply Damage to Enemy
    let newEnemyHp = enemy.hp;
    if (action !== 'DEFEND') {
      newEnemyHp = Math.max(0, enemy.hp - damage);
      // Generate flavor text via AI for immersion (async, update logs when ready)
      GeminiService.generateBattleCommentary(player.name, enemy.name, damage, isCrit, true)
        .then(text => setBattle(b => ({ ...b, logs: [...b.logs, text] })));
    } else {
       setBattle(b => ({ ...b, logs: [...b.logs, logText] }));
    }

    // Update State immediate for mechanics
    const nextEnemy = { ...enemy, hp: newEnemyHp };
    setBattle(prev => ({
       ...prev, 
       enemy: nextEnemy,
       playerTurn: false // End player turn
    }));

    // Check Win
    if (newEnemyHp <= 0) {
      setTimeout(() => endBattle(true, nextEnemy), 1000);
      return;
    }

    // Enemy Turn (Delayed)
    setTimeout(() => enemyTurn(nextEnemy, action === 'DEFEND'), 1500);
  };

  const enemyTurn = (currentEnemy: Enemy, playerDefending: boolean) => {
    let damage = Math.floor(currentEnemy.strength * (Math.random() * 0.4 + 0.8));
    if (playerDefending) damage = Math.floor(damage * 0.5);

    const newPlayerHp = Math.max(0, player.hp - damage);
    updatePlayer({ hp: newPlayerHp });

    // AI Flavor
    GeminiService.generateBattleCommentary(currentEnemy.name, player.name, damage, false, false)
        .then(text => setBattle(b => ({ ...b, logs: [...b.logs, text] })));

    setBattle(prev => ({
      ...prev,
      round: prev.round + 1,
      playerTurn: true
    }));

    if (newPlayerHp <= 0) {
      setTimeout(() => endBattle(false, currentEnemy), 1000);
    }
  };

  const endBattle = (win: boolean, enemy: Enemy) => {
    setGameState(GameState.PLAYING);
    if (win) {
      const goldReward = enemy.maxHp; // Simple formula
      const expReward = Math.floor(enemy.maxHp / 2);
      addLog(`战斗胜利！击败了 ${enemy.name}。`, 'gain');
      addLog(`获得 ${expReward} 经验值，缴获 ${goldReward} 黄金。`, 'gain');
      updatePlayer({ gold: player.gold + goldReward, exp: player.exp + expReward });
    } else {
      addLog(`战斗失败！被 ${enemy.name} 击溃，仓皇逃窜...`, 'loss');
      addLog(`损失了部分兵力和黄金。`, 'loss');
      updatePlayer({ 
        gold: Math.floor(player.gold * 0.8), 
        troops: Math.floor(player.troops * 0.8),
        hp: 10 // Revive with 10hp
      });
    }
  };

  // Render Logic
  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#2c241b]">
      {gameState === GameState.MENU && (
        <CharacterSetup onComplete={handleCharacterComplete} />
      )}

      {(gameState === GameState.PLAYING || gameState === GameState.BATTLE) && (
        <>
          <Dashboard 
            player={player} 
            onAction={handleAction} 
            logs={logs} 
          />
          {gameState === GameState.BATTLE && battle.enemy && (
            <BattleInterface 
              player={player}
              enemy={battle.enemy}
              battleState={battle}
              onPlayerAction={handleBattleAction}
            />
          )}
        </>
      )}
    </div>
  );
}