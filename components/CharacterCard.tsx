
import React from 'react';
import { Character } from '../types';

interface Props {
  character: Character;
  isActive: boolean;
  onClick?: () => void;
}

const CharacterCard: React.FC<Props> = ({ character, isActive, onClick }) => {
  const colorBase = character.color.split(' ')[0];
  const borderColor = character.color.split(' ')[1];

  const expToNext = character.level * 100;
  const progress = (character.exp / expToNext) * 100;

  return (
    <div 
      onClick={onClick}
      className={`
        relative w-full aspect-[3/4.5] max-w-[280px] overflow-hidden cursor-pointer
        transition-all duration-[1200ms] cubic-bezier(0.2, 1, 0.3, 1) transform
        ${isActive ? 'scale-100 rotate-0 translate-y-0 opacity-100' : 'scale-90 rotate-1 translate-y-4 opacity-30 grayscale'}
        sketch-border border-4 ${borderColor} bg-dark
      `}
    >
      {/* 角色立绘主体 */}
      <div className="absolute inset-0">
          <img 
            src={character.imageUrl} 
            alt={character.name} 
            className="w-full h-full object-cover transition-transform duration-[4000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </div>

      {/* 信息展示层 */}
      <div className="absolute inset-0 flex flex-col p-6 justify-between z-10">
        <div className="flex justify-between items-start">
           <div className="flex flex-col">
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] opacity-80 ${colorBase}`}>
                 {character.mbti}
              </span>
              <span className="text-white/40 text-[7px] font-mono mt-0.5 tracking-[0.3em] uppercase">Fragment_0x{character.id.slice(-2)}</span>
           </div>
           <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-2xl shadow-2xl border border-white/10">
             {character.avatar}
           </div>
        </div>

        <div className="space-y-3">
            <div>
                <h3 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-2xl leading-none">
                    {character.name}
                </h3>
                <p className="text-[9px] font-medium text-white/50 uppercase tracking-[0.15em] mt-1 border-l-2 border-white/20 pl-2">
                    {character.heroTitle}
                </p>
            </div>

            {/* 极简技能指示 */}
            <div className="space-y-1">
               <div className="flex justify-between items-end">
                  <div className={`text-[8px] font-bold uppercase tracking-widest ${colorBase}`}>
                    {character.skillName}
                  </div>
                  <div className="text-[6px] font-mono text-white/20 tracking-tighter">LV.{character.level}</div>
               </div>
               <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${colorBase.replace('text', 'bg')}`}
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
            </div>

            {/* 名言 */}
            <p className="text-[12px] text-white/80 leading-relaxed italic font-serif opacity-90 line-clamp-2">
              「{character.quote}」
            </p>

            {/* 标签 */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {character.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[7px] font-bold px-1.5 py-0.5 bg-black/80 text-white/40 border border-white/5 uppercase">
                  #{tag}
                </span>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
