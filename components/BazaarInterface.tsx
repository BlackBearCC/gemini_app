
import React from 'react';
import { RoleId, Character, MBTIStats } from '../types';

interface Props {
  characters: Record<string, Character>;
  stats: MBTIStats;
  onUnlock: (id: RoleId) => void;
  onToggleActive: (id: RoleId) => void;
}

const BazaarInterface: React.FC<Props> = ({ characters, stats, onUnlock, onToggleActive }) => {
  const allChars = (Object.values(characters) as Character[]).filter(c => c.id !== RoleId.USER);
  
  const groups = {
    '分析家 (NT)': allChars.filter(c => ['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(c.mbti)),
    '外交官 (NF)': allChars.filter(c => ['INFJ', 'INFP', 'ENFJ', 'ENFP'].includes(c.mbti)),
    '守护者 (SJ)': allChars.filter(c => ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(c.mbti)),
    '探险家 (SP)': allChars.filter(c => ['ISTP', 'ISFP', 'ESTP', 'ESFP'].includes(c.mbti)),
  };

  // 获取随机装饰属性
  const getCardDeco = (index: number) => {
    const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0'];
    const borders = ['sketch-border', 'sketch-border-v1', 'sketch-border-v2', 'sketch-border-v3'];
    return {
      rotation: rotations[index % rotations.length],
      border: borders[index % borders.length]
    };
  };

  return (
    <div className="h-full overflow-y-auto bg-dark p-6 pb-44 no-scrollbar">
      <div className="mb-14 flex justify-between items-start">
        <div className="relative">
          <h2 className="text-5xl font-black italic text-white tracking-tighter uppercase relative z-10">集市</h2>
          <span className="absolute -bottom-2 -left-1 text-[10px] font-mono text-doodle-highlight bg-black px-2 sketch-border-v2 border border-doodle-highlight uppercase tracking-[0.3em]">Bazaar.v1.2</span>
        </div>
        <div className="sketch-border-v3 border-2 border-white/20 px-5 py-3 bg-black shadow-[6px_6px_0px_rgba(255,255,255,0.05)] flex items-center gap-3">
            <span className="text-sm font-black text-doodle-highlight">ENERGY: {stats.energy}</span>
        </div>
      </div>

      {Object.entries(groups).map(([groupName, chars], gIdx) => (
        chars.length > 0 && (
          <section key={groupName} className="mb-16 relative">
            <div className="flex items-center gap-6 mb-8">
               <div className="h-6 w-1 bg-doodle-highlight animate-pulse"></div>
               <h3 className="text-sm font-black text-white/50 uppercase tracking-[0.2em] whitespace-nowrap">{groupName}</h3>
               <div className="h-[2px] w-full bg-white/5 sketch-border-v1"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-5 gap-y-12">
              {chars.map((char, cIdx) => {
                const deco = getCardDeco(cIdx + gIdx);
                return (
                  <div 
                    key={char.id} 
                    className={`
                      relative p-5 border-2 transition-all duration-500 flex flex-col group
                      ${char.unlocked 
                        ? `bg-white/[0.04] border-white/20 shadow-[8px_8px_0px_rgba(255,255,255,0.03)] ${deco.border}` 
                        : `bg-black border-white/10 opacity-70 grayscale contrast-125 ${deco.border}`}
                      ${deco.rotation} hover:rotate-0 hover:scale-105 active:scale-95
                    `}
                  >
                    {/* 背景乱涂效果 */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none text-white text-4xl">⌇</div>

                    <div className="flex justify-between items-center mb-5">
                      <div className="w-10 h-10 flex items-center justify-center text-3xl bg-black/40 sketch-border-v1 border border-white/10">
                        {char.avatar}
                      </div>
                      <div className="text-[10px] font-mono font-black px-2 py-1 bg-white/20 text-white/60 sketch-border-v2 uppercase">
                        {char.mbti}
                      </div>
                    </div>

                    <div className="mb-6 flex-1">
                        <h4 className="text-xl font-black text-white mb-1 tracking-tighter">{char.name}</h4>
                        <p className="text-[10px] text-gray-600 font-bold uppercase leading-tight line-clamp-2 italic">{char.heroTitle}</p>
                    </div>

                    {char.unlocked ? (
                      <button 
                        onClick={() => onToggleActive(char.id)}
                        className={`w-full py-2.5 sketch-border-v3 text-[10px] font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_#000] border-2 active:translate-y-1 active:shadow-none ${char.isActive ? 'bg-red-500/20 text-red-500 border-red-500/40' : 'bg-green-500/20 text-green-500 border-green-500/40'}`}
                      >
                        {char.isActive ? '休眠' : '激活'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => onUnlock(char.id)}
                        disabled={stats.energy < char.cost}
                        className="w-full py-3 bg-doodle-highlight text-black sketch-border-v2 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 transition-all shadow-[6px_6px_0px_#000] border-2 border-black active:translate-y-1 active:shadow-none"
                      >
                        觉醒 ⚡ {char.cost}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )
      ))}
    </div>
  );
};

export default BazaarInterface;
