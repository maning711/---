import React, { useEffect, useRef } from 'react';
import { Player, Enemy, BattleState } from '../types';
import { Swords, Shield, Skull, Activity, Zap } from 'lucide-react';

interface Props {
  player: Player;
  enemy: Enemy;
  battleState: BattleState;
  onPlayerAction: (action: 'ATTACK' | 'SKILL' | 'DEFEND') => void;
}

const BattleInterface: React.FC<Props> = ({ player, enemy, battleState, onPlayerAction }) => {
  const logRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleState.logs]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#f5f0e6] w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden border-4 border-[#5d5045] flex flex-col max-h-[90vh]">
        
        {/* Battle Header */}
        <div className="bg-[#2c241b] text-[#f5f0e6] p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <Swords size={24} className="text-red-500" />
            <span className="text-xl font-bold tracking-widest">遭遇战</span>
          </div>
          <div className="text-sm opacity-70">Round {battleState.round}</div>
        </div>

        {/* Battle Arena Visuals */}
        <div className="flex-1 p-6 bg-[url('https://picsum.photos/1000/600?grayscale&blur=2')] bg-cover relative">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]"></div>
          
          <div className="relative z-10 grid grid-cols-2 gap-8 h-full items-center">
            
            {/* Player Side */}
            <div className="flex flex-col items-center transform transition-all duration-500 hover:scale-105">
              <div className="w-32 h-32 bg-blue-100 rounded-full border-4 border-blue-800 flex items-center justify-center shadow-lg mb-4">
                <span className="text-4xl">🧑‍ General</span>
              </div>
              <div className="bg-white/90 p-3 rounded shadow-md border border-blue-800 min-w-[200px]">
                <h3 className="text-xl font-bold text-blue-900 mb-2">{player.name}</h3>
                <div className="space-y-1">
                  <HealthBar current={player.hp} max={player.maxHp} color="bg-green-600" />
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>HP: {player.hp}</span>
                    <span>ATK: {player.strength}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enemy Side */}
            <div className="flex flex-col items-center transform transition-all duration-500 hover:scale-105">
              <div className="w-32 h-32 bg-red-100 rounded-full border-4 border-red-800 flex items-center justify-center shadow-lg mb-4 animate-pulse">
                <span className="text-4xl">👹 Enemy</span>
              </div>
               <div className="bg-white/90 p-3 rounded shadow-md border border-red-800 min-w-[200px]">
                <h3 className="text-xl font-bold text-red-900 mb-1">{enemy.name}</h3>
                <p className="text-xs text-red-700 mb-2 italic">{enemy.title}</p>
                <div className="space-y-1">
                  <HealthBar current={enemy.hp} max={enemy.maxHp} color="bg-red-600" />
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>HP: {enemy.hp}</span>
                    <span>ATK: {enemy.strength}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Battle Logs */}
        <div 
          ref={logRef}
          className="h-48 bg-[#eaddcf] p-4 overflow-y-auto border-t-2 border-[#8c7b6c] font-serif shadow-inner"
        >
          {battleState.logs.length === 0 && <p className="text-center text-gray-500 italic">战斗即将开始...</p>}
          {battleState.logs.map((log, idx) => (
            <p key={idx} className={`mb-1 ${idx === battleState.logs.length - 1 ? 'font-bold text-black' : 'text-gray-700'}`}>
              • {log}
            </p>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-[#2c241b] p-4 grid grid-cols-3 gap-4">
          <BattleButton 
            label="普通攻击" 
            icon={<Swords size={20} />} 
            onClick={() => onPlayerAction('ATTACK')} 
            disabled={!battleState.playerTurn}
          />
          <BattleButton 
            label="无双绝技" 
            icon={<Zap size={20} />} 
            color="bg-yellow-600 hover:bg-yellow-700"
            onClick={() => onPlayerAction('SKILL')} 
            disabled={!battleState.playerTurn}
          />
          <BattleButton 
            label="防御姿态" 
            icon={<Shield size={20} />} 
            color="bg-blue-600 hover:bg-blue-700"
            onClick={() => onPlayerAction('DEFEND')} 
            disabled={!battleState.playerTurn}
          />
        </div>
      </div>
    </div>
  );
};

const HealthBar = ({ current, max, color }: { current: number, max: number, color: string }) => {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden border border-gray-400">
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }}></div>
    </div>
  );
};

const BattleButton = ({ label, icon, onClick, disabled, color = "bg-red-700 hover:bg-red-800" }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      ${color} text-white py-3 rounded text-lg font-bold flex items-center justify-center gap-2
      transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
    `}
  >
    {icon} {label}
  </button>
);

export default BattleInterface;