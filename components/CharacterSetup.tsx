import React, { useState } from 'react';
import { Faction, Player } from '../types';
import { FACTION_INFO } from '../constants';
import { Sword, BookOpen, Crown } from 'lucide-react';

interface Props {
  onComplete: (player: Player) => void;
}

const CharacterSetup: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [selectedFaction, setSelectedFaction] = useState<Faction>(Faction.WEI);
  const [role, setRole] = useState<'WARRIOR' | 'STRATEGIST'>('WARRIOR');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const baseStats = role === 'WARRIOR' 
      ? { strength: 20, intellect: 10 } 
      : { strength: 10, intellect: 20 };

    onComplete({
      name,
      faction: selectedFaction,
      level: 1,
      exp: 0,
      maxExp: 100,
      hp: 100,
      maxHp: 100,
      gold: 100,
      troops: 500,
      ...baseStats
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://picsum.photos/1920/1080?blur=5')] bg-cover bg-center">
      <div className="bg-[#f5f0e6] p-8 max-w-2xl w-full mx-4 rounded-lg shadow-2xl border-4 border-[#2c241b]">
        <h1 className="text-4xl font-calligraphy text-center mb-8 text-[#2c241b]">乱世英豪录</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name Input */}
          <div>
            <label className="block text-lg font-bold mb-2">主公尊姓大名</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#eaddcf] border-b-2 border-[#8c7b6c] p-2 text-xl focus:outline-none focus:border-[#2c241b] text-[#2c241b] placeholder-stone-500"
              placeholder="请输入姓名..."
              required
            />
          </div>

          {/* Faction Selection */}
          <div>
            <label className="block text-lg font-bold mb-4">选择势力</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[Faction.WEI, Faction.SHU, Faction.WU].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedFaction(f)}
                  className={`p-4 border-2 rounded-lg transition-all relative overflow-hidden group
                    ${selectedFaction === f 
                      ? `${FACTION_INFO[f].borderColor} ${FACTION_INFO[f].bgColor} scale-105 shadow-md` 
                      : 'border-[#8c7b6c] hover:bg-[#eaddcf]'
                    }`}
                >
                  <div className="text-2xl font-calligraphy mb-2">{f}</div>
                  <div className="text-sm opacity-80 mb-2 font-bold">{FACTION_INFO[f].leader}</div>
                  <div className="text-xs leading-relaxed">{FACTION_INFO[f].description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-lg font-bold mb-4">出身背景</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('WARRIOR')}
                className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all
                  ${role === 'WARRIOR' 
                    ? 'border-red-800 bg-red-50 text-red-900' 
                    : 'border-[#8c7b6c]'}`}
              >
                <Sword size={24} />
                <span className="text-lg">猛将 (高武力)</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('STRATEGIST')}
                className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all
                  ${role === 'STRATEGIST' 
                    ? 'border-blue-800 bg-blue-50 text-blue-900' 
                    : 'border-[#8c7b6c]'}`}
              >
                <BookOpen size={24} />
                <span className="text-lg">谋士 (高智力)</span>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full mt-8 bg-[#2c241b] text-[#f5f0e6] py-3 text-xl font-bold rounded hover:bg-[#4a3b2a] transition-colors flex items-center justify-center gap-2"
          >
            <Crown /> 举兵起义
          </button>

        </form>
      </div>
    </div>
  );
};

export default CharacterSetup;