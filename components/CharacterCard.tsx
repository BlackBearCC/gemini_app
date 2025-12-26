
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
        relative w-full aspect-[3/4.5] max-w-[280px] overflow-visible cursor-pointer
        transition-all duration-[1200ms] cubic-bezier(0.2, 1, 0.3, 1) transform
        ${isActive ? 'scale-100 rotate-0 translate-y-0 opacity-100' : 'scale-90 rotate-1 translate-y-4 opacity-30 grayscale'}
        group
      `}
    >
      {/* 撕纸边缘外框 */}
      <div className={`absolute -inset-1 bg-white/20 sketch-border-v3 opacity-20 blur-sm group-hover:opacity-40 transition-opacity`}></div>
      
      <div className={`relative h-full w-full bg-dark sketch-border-v3 border-4 ${borderColor} overflow-hidden shadow-[20px_20px_0px_#000]`}>
        {/* 立绘主体：应用复印机质感滤镜 */}
        <div className="absolute inset-0 torn-edge">
            <img 
              src={character.imageUrl} 
              alt={character.name} 
              className={`w-full h-full object-cover transition-transform duration-[4000ms] xerox-effect group-hover:scale-110 animate-xerox`}
            />
            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        </div>

        {/* 顶部手写标注 */}
        <div className="absolute top-4 left-4 z-20">
           <div className="flex flex-col">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-black sketch-border-v1 shadow-[4px_4px_0px_#000] ${colorBase}`}>
                 {character.mbti}
              </span>
           </div>
        </div>

        {/* 手绘符号角标 */}
        <div className="absolute top-4 right-4 z-20 w-12 h-12 bg-black/60 backdrop-blur-md flex items-center justify-center sketch-border-v2 border border-white/10 overflow-hidden group-hover:rotate-12 transition-transform">
           {character.generatedAvatar && (
             <img src={character.generatedAvatar} alt="" className="w-full h-full object-cover scale-110 grayscale brightness-150" />
           )}
        </div>

        {/* 信息层 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 space-y-4">
            <div>
                <h3 className="text-4xl font-black italic tracking-tighter text-white drop-shadow-[0_5px_5px_#000] leading-none mb-2">
                    {character.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="h-[2px] w-4 bg-doodle-highlight"></div>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.15em]">
                      {character.heroTitle}
                  </p>
                </div>
            </div>

            {/* 动态名言 */}
            <p className="text-[13px] text-white/90 leading-relaxed italic font-serif opacity-90 line-clamp-2 bg-black/40 p-2 sketch-border-v3 backdrop-blur-sm border border-white/5">
              「{character.quote}」
            </p>

            {/* 经验条 */}
            <div className="space-y-1">
               <div className="flex justify-between items-end">
                  <div className={`text-[8px] font-black uppercase tracking-widest ${colorBase}`}>
                    {character.skillName}
                  </div>
                  <div className="text-[7px] font-mono text-white/30 tracking-tighter">PHASE_{character.level}</div>
               </div>
               <div className="h-1 w-full bg-white/5 sketch-border-v3 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${colorBase.replace('text', 'bg')}`}
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
            </div>
        </div>
      </div>

      {/* 装饰性胶带效果 */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 bg-white/10 backdrop-blur-md rotate-2 sketch-border-v3 z-30 opacity-60"></div>
    </div>
  );
};

export default CharacterCard;
