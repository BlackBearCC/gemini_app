
import React, { useState } from 'react';
import { MBTIStats, RoleId, Character } from '../types';
import CharacterCard from './CharacterCard';

interface Props {
  stats: MBTIStats;
  characters: Record<string, Character>;
  toggleActive: (id: RoleId) => void;
  unlockCharacter: (id: RoleId) => void;
}

const ProfileInterface: React.FC<Props> = ({ stats, characters, toggleActive }) => {
  // 严格过滤：仅显示已解锁的人格
  const unlockedCharacters = (Object.values(characters) as Character[])
    .filter(c => c.id !== RoleId.USER && c.unlocked);
  
  const [selectedId, setSelectedId] = useState<RoleId | null>(unlockedCharacters[0]?.id || null);

  // 计算 MBTI 倾向
  const calculateUserMBTI = () => {
    const e_i = stats.E >= stats.I ? 'E' : 'I';
    const n_s = stats.N >= stats.S ? 'N' : 'S';
    const t_f = stats.T >= stats.F ? 'T' : 'F';
    const j_p = stats.J >= stats.P ? 'J' : 'P';
    
    const total = stats.E + stats.I + stats.N + stats.S + stats.T + stats.F + stats.J + stats.P;
    if (total === 0) return "尚未觉醒";
    
    return `${e_i}${n_s}${t_f}${j_p}`;
  };

  const userMBTI = calculateUserMBTI();
  const activeChar = selectedId ? characters[selectedId] : null;

  return (
    <div className="h-full overflow-y-auto bg-dark p-6 pb-40 no-scrollbar doodle-bg">
        {/* 顶部：宿主镜像核心 */}
        <div className="mb-12 text-center pt-8">
             <div className="inline-block px-8 py-3 sketch-border border-4 border-doodle-highlight bg-black shadow-[10px_10px_0px_rgba(0,0,0,0.5)] rotate-1">
                <span className="text-5xl font-black text-white italic tracking-[0.2em]">{userMBTI}</span>
             </div>
             <p className="text-[10px] font-mono text-doodle-highlight mt-6 uppercase tracking-[0.4em] font-black">宿主脑内镜像 // Cognition_Mirror</p>
        </div>

        {/* 维度分配统计 */}
        <div className="mb-16 p-8 sketch-border-v1 border-2 border-white/10 bg-black/40 relative">
            <div className="absolute -top-3 left-6 bg-dark px-3 text-[9px] font-mono text-gray-500 uppercase tracking-widest">Balance_Index</div>
            <div className="grid grid-cols-1 gap-8">
                <StatBar label="能量动态" left="E" right="I" leftVal={stats.E} rightVal={stats.I} />
                <StatBar label="感知偏好" left="S" right="N" leftVal={stats.S} rightVal={stats.N} />
                <StatBar label="判断基准" left="T" right="F" leftVal={stats.T} rightVal={stats.F} />
                <StatBar label="生活方式" left="J" right="P" leftVal={stats.J} rightVal={stats.P} />
            </div>
            <p className="mt-8 text-[9px] text-gray-600 italic text-center leading-relaxed">
              * 点赞人格的发言会重塑你的认知镜像
            </p>
        </div>

        {/* 已拥有的角色墙 */}
        <div className="mb-8">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 px-2">
               已拥有的脑内碎片
               <div className="h-[1px] flex-1 bg-white/10"></div>
            </h3>
            
            <div className="grid grid-cols-4 gap-4 mb-10">
                {unlockedCharacters.length === 0 ? (
                    <div className="col-span-4 py-8 text-center opacity-20 text-[10px] uppercase font-black tracking-widest">
                       暂无意识碎片
                    </div>
                ) : (
                    unlockedCharacters.map(char => (
                        <button 
                            key={char.id}
                            onClick={() => setSelectedId(char.id)}
                            className={`
                                relative aspect-square sketch-border border-2 transition-all duration-300 flex items-center justify-center text-2xl
                                ${selectedId === char.id ? 'bg-doodle-highlight border-black scale-110 rotate-3 z-10 shadow-lg' : 'bg-black border-white/10 hover:border-white/40 opacity-50'}
                            `}
                        >
                            {char.avatar}
                            {char.isActive && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dark animate-pulse"></div>
                            )}
                        </button>
                    ))
                )}
            </div>
        </div>

        {/* 选中角色详情 */}
        {activeChar && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
                <div className="relative mb-6 flex justify-center">
                   <CharacterCard 
                    character={activeChar} 
                    isActive={true}
                   />
                </div>

                <div className="w-full max-w-[320px] mx-auto flex flex-col gap-4">
                    <button 
                        onClick={() => toggleActive(activeChar.id)}
                        className={`py-4 sketch-border-v3 font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[6px_6px_0px_#000] border-2 border-black active:translate-y-1 active:shadow-none ${activeChar.isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                    >
                        {activeChar.isActive ? '令其进入潜意识休眠' : '唤醒至活跃意识层'}
                    </button>
                    <p className="text-[9px] text-center text-gray-600 font-mono italic">
                       {activeChar.isActive ? '>> 该碎片正在活跃群聊中运行' : '>> 该碎片已在镜像中待命'}
                    </p>
                </div>
            </div>
        )}
    </div>
  );
};

const StatBar = ({ label, left, right, leftVal, rightVal }: any) => {
    const total = leftVal + rightVal || 1;
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter">{label}</span>
                <span className="text-[8px] font-mono text-gray-700">{leftVal} : {rightVal}</span>
            </div>
            <div className="flex items-center gap-4">
                <span className={`text-sm font-black w-4 text-center ${leftVal >= rightVal ? 'text-doodle-highlight' : 'text-white/20'}`}>{left}</span>
                <div className="flex-1 h-2 bg-white/5 sketch-border-v3 relative overflow-hidden">
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 z-10"></div>
                    <div 
                        className="absolute top-0 bottom-0 bg-doodle-highlight transition-all duration-1000"
                        style={{ 
                            left: leftVal >= rightVal ? '50%' : `${50 - (rightVal/total * 50)}%`, 
                            width: `${Math.abs(leftVal - rightVal) / total * 50}%` 
                        }}
                    ></div>
                </div>
                <span className={`text-sm font-black w-4 text-center ${rightVal > leftVal ? 'text-doodle-highlight' : 'text-white/20'}`}>{right}</span>
            </div>
        </div>
    );
};

export default ProfileInterface;
