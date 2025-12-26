
import React from 'react';
import { CHARACTERS } from '../constants';
import { Character, RoleId } from '../types';

interface Props {
  onSelect: (roleId: RoleId) => void;
}

const CharacterSelection: React.FC<Props> = ({ onSelect }) => {
  const characters = Object.values(CHARACTERS).filter(c => c.id !== RoleId.USER);

  return (
    <div className="fixed inset-0 z-[100] bg-dark overflow-y-auto no-scrollbar animate-[fadeIn_0.5s_ease-out] doodle-bg">
      {/* 装饰线 */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
         <div className="absolute top-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.1)_0%,transparent_70%)]"></div>
         <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-white"></div>
      </div>

      <div className="pt-24 pb-12 px-10 text-center relative z-10">
        <div className="inline-block px-4 py-1 sketch-border border-2 border-doodle-highlight/30 mb-6 bg-black">
           <span className="text-[10px] font-black text-doodle-highlight uppercase tracking-[0.4em]">INIT_CONTRACT</span>
        </div>
        <h2 className="text-5xl font-black text-white italic tracking-tighter mb-4 uppercase">
          灵魂契约
        </h2>
        <p className="text-[11px] font-mono text-gray-500 uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto">
          选择一个意识碎片作为你的核心人格<br/>开启脑内涂鸦剧场
        </p>
      </div>

      <div className="px-6 pb-32 grid grid-cols-2 gap-6 max-w-2xl mx-auto relative z-10">
        {characters.map((char, index) => {
          const rotation = index % 2 === 0 ? '-rotate-1' : 'rotate-1';
          return (
            <div 
              key={char.id}
              onClick={() => onSelect(char.id)}
              className={`
                group relative aspect-[3/4.2] overflow-hidden cursor-pointer bg-black/40 border-2 border-white/10 transition-all duration-500
                hover:scale-105 hover:border-doodle-highlight active:scale-95 sketch-border ${rotation}
              `}
            >
              {/* 背景立绘 */}
              <img 
                src={char.imageUrl} 
                alt={char.name}
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-700"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="mb-2">
                   <div className="text-[9px] font-black px-2 py-0.5 inline-block bg-doodle-highlight text-black sketch-border-v3 mb-1">
                      {char.mbti}
                   </div>
                   <h3 className="text-2xl font-black text-white tracking-tighter">{char.name}</h3>
                </div>
                <p className="text-[8px] text-white/30 uppercase tracking-widest font-mono leading-tight">{char.heroTitle}</p>
              </div>

              <div className="absolute top-4 right-4 w-12 h-12 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all">
                 {char.generatedAvatar ? (
                   <img src={char.generatedAvatar} alt="" className="w-full h-full object-cover grayscale brightness-200 contrast-150" />
                 ) : (
                   <span className="text-3xl">{char.avatar}</span>
                 )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20"></div>
    </div>
  );
};

export default CharacterSelection;
