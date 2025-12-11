import React from 'react';
import { Player, Faction } from '../types';
import { FACTION_INFO } from '../constants';
import { Shield, Coins, Users, Zap, Brain, Scroll, Swords, Tent, Landmark } from 'lucide-react';

interface Props {
  player: Player;
  onAction: (actionType: string) => void;
  logs: { id: string, text: string, type: string }[];
}

const Dashboard: React.FC<Props> = ({ player, onAction, logs }) => {
  const factionTheme = FACTION_INFO[player.faction];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-2rem)]">
      
      {/* Left Column: Character Stats */}
      <div className="lg:col-span-1 bg-[#eaddcf] rounded-lg p-6 shadow-inner border-2 border-[#8c7b6c] flex flex-col gap-6">
        <div className="text-center pb-4 border-b border-[#8c7b6c]">
          <h2 className={`text-3xl font-calligraphy mb-1 ${factionTheme.color}`}>{player.name}</h2>
          <span className={`px-2 py-1 rounded text-sm font-bold border ${factionTheme.borderColor} ${factionTheme.color}`}>
            {player.faction}军 {player.level}级
          </span>
        </div>

        <div className="space-y-4">
          <StatRow icon={<Zap size={18} />} label="体力" value={`${player.hp}/${player.maxHp}`} />
          <StatRow icon={<Swords size={18} />} label="武力" value={player.strength} />
          <StatRow icon={<Brain size={18} />} label="智力" value={player.intellect} />
          <StatRow icon={<Users size={18} />} label="兵力" value={player.troops} />
          <StatRow icon={<Coins size={18} />} label="黄金" value={player.gold} />
          
          <div className="pt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>经验值</span>
              <span>{player.exp} / {player.maxExp}</span>
            </div>
            <div className="w-full bg-[#cbb8a3] rounded-full h-2">
              <div 
                className="bg-[#2c241b] h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(player.exp / player.maxExp) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Column: Main Action Area & Log */}
      <div className="lg:col-span-2 flex flex-col gap-6 h-full">
        {/* Story/Log Panel */}
        <div className="flex-1 bg-white/80 rounded-lg p-6 shadow-md border border-[#8c7b6c] overflow-y-auto relative min-h-[400px]">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#5d5045] sticky top-0 bg-white/90 p-2 border-b z-10">
            <Scroll size={20} /> 乱世风云
          </h3>
          <div className="space-y-4 font-serif">
            {logs.length === 0 && <p className="text-gray-500 italic text-center mt-10">暂无事件，请选择行动...</p>}
            {logs.map((log) => (
              <div key={log.id} className={`p-3 rounded border-l-4 animate-fade-in ${getLogStyle(log.type)}`}>
                 {log.text}
              </div>
            ))}
            {/* Anchor for auto scroll */}
            <div id="log-end" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ActionButton 
            label="讨伐贼寇" 
            sub="战斗 (Exp++)"
            icon={<Swords />} 
            color="bg-red-800 hover:bg-red-900 text-white" 
            onClick={() => onAction('PATROL')} 
          />
          <ActionButton 
            label="招兵买马" 
            sub="招募 (-Gold)"
            icon={<Tent />} 
            color="bg-stone-700 hover:bg-stone-800 text-white" 
            onClick={() => onAction('RECRUIT')} 
          />
          <ActionButton 
            label="治理内政" 
            sub="获得 (+Gold)"
            icon={<Landmark />} 
            color="bg-amber-700 hover:bg-amber-800 text-white" 
            onClick={() => onAction('GOVERN')} 
          />
           <ActionButton 
            label="修养生息" 
            sub="恢复 (+HP)"
            icon={<Shield />} 
            color="bg-emerald-700 hover:bg-emerald-800 text-white" 
            onClick={() => onAction('REST')} 
          />
        </div>
      </div>

      {/* Right Column: Mini Map / Status (Simplified as Context) */}
      <div className="hidden lg:flex lg:col-span-1 bg-[url('https://picsum.photos/400/600?grayscale')] bg-cover bg-center rounded-lg shadow-inner border-2 border-[#8c7b6c] items-end p-4 relative opacity-80 hover:opacity-100 transition-opacity">
        <div className="bg-white/90 p-4 rounded w-full backdrop-blur-sm">
          <h4 className="font-bold mb-2">当前位置: 许昌周边</h4>
          <p className="text-sm text-gray-700">天下大乱，群雄并起。主公此刻正厉兵秣马，以待天时。</p>
        </div>
      </div>

    </div>
  );
};

// Helper Components
const StatRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="flex items-center justify-between p-2 bg-white/50 rounded border border-[#cbb8a3]">
    <div className="flex items-center gap-2 text-[#5d5045]">
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </div>
    <span className="font-mono font-bold text-[#2c241b]">{value}</span>
  </div>
);

const ActionButton = ({ label, sub, icon, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`${color} p-4 rounded shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center gap-1 border-b-4 border-black/20`}
  >
    {icon}
    <span className="font-bold text-lg">{label}</span>
    <span className="text-xs opacity-80">{sub}</span>
  </button>
);

const getLogStyle = (type: string) => {
  switch (type) {
    case 'combat': return 'bg-red-50 border-red-500 text-red-900';
    case 'gain': return 'bg-yellow-50 border-yellow-500 text-yellow-900';
    case 'event': return 'bg-blue-50 border-blue-500 text-blue-900';
    default: return 'bg-white border-gray-300 text-gray-800';
  }
};

export default Dashboard;