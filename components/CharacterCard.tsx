
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
        relative w-full aspect-[3/4.5] max-w-[320px] overflow-hidden cursor-pointer
        transition-all duration-[1200ms] cubic-bezier(0.2, 1, 0.3, 1) transform
        ${isActive ? 'scale-100 rotate-0 translate-y-0 opacity-100' : 'scale-90 rotate-1 translate-y-4 opacity-30 grayscale'}
        hand-drawn-border bg-dark border-4 ${borderColor}
      `}
    >
      {/* 角色立绘主体 */}
      <div className="absolute inset-0">
          <img 
            src={character.imageUrl} 
            alt={character.name} 
            className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110"
          />
          {/* 水彩渲染层 */}
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
      </div>

      {/* 装饰边框 - 模拟老旧画框 */}
      <div className="absolute inset-4 border border-white/10 hand-drawn-border pointer-events-none"></div>

      {/* 信息展示层 */}
      <div className="absolute inset-0 flex flex-col p-8 justify-between z-10">
        <div className="flex justify-between items-start">
           <div className="flex flex-col">
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-80 ${colorBase}`}>
                 {character.skillType.split(' / ')[0]}
              </span>
              <span className="text-white/40 text-[8px] font-mono mt-0.5 tracking-[0.4em] uppercase">Fragment.v01</span>
           </div>
           <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-3xl shadow-2xl border border-white/5 animate-sway">
             {character.avatar}
           </div>
        </div>

        <div className="space-y-4">
            <div>
                <h3 className="text-5xl font-black italic tracking-tighter text-white drop-shadow-2xl">
                    {character.name}
                </h3>
                <p className="text-[12px] font-medium text-white/50 uppercase tracking-[0.2em] mt-1 border-l-2 border-white/20 pl-2">
                    {character.heroTitle}
                </p>
            </div>

            {/* 极简技能指示 */}
            <div className="space-y-1.5">
               <div className="flex justify-between items-end">
                  <div className={`text-[9px] font-bold uppercase tracking-widest ${colorBase}`}>
                    {character.skillName}
                  </div>
                  <div className="text-[7px] font-mono text-white/20 tracking-tighter">NODE_LV.{character.level}</div>
               </div>
               <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${colorBase.replace('text', 'bg')}`}
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
            </div>

            {/* 名言 - 吉卜力对白感 */}
            <p className="text-[14px] text-white/80 leading-relaxed italic font-serif opacity-90">
              「{character.quote}」
            </p>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 pt-2">
              {character.tags.map(tag => (
                <span key={tag} className="text-[8px] font-bold px-2 py-0.5 rounded-sm bg-black/60 text-white/40 border border-white/5 uppercase">
                  #{tag}
                </span>
              ))}
            </div>
        </div>
      </div>
      
      {/* 底部纹理微光 */}
      <div className="absolute bottom-4 right-6 opacity-10 text-[6px] font-mono tracking-widest text-white">
        GHIBLI_RESONANCE_SYSTEM_2025
      </div>
    </div>
  );
};

export default CharacterCard;
