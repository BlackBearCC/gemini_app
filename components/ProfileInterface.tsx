
import React, { useState } from 'react';
import { MBTIStats, RoleId, Character } from '../types';
import CharacterCard from './CharacterCard';

interface Props {
  stats: MBTIStats;
  characters: Record<string, Character>;
  toggleActive: (id: RoleId) => void;
  unlockCharacter: (id: RoleId) => void;
}

const ProfileInterface: React.FC<Props> = ({ stats, characters, toggleActive, unlockCharacter }) => {
  // Fixed: Added type assertion to resolve 'unknown' type errors on Object.values
  const characterList = (Object.values(characters) as Character[]).filter(c => c.id !== RoleId.USER);
  const [selectedId, setSelectedId] = useState<RoleId>(RoleId.LOGIC);
  const activeChar = characters[selectedId];

  return (
    <div className="h-full overflow-y-auto bg-dark p-6 pb-40 no-scrollbar">
        <div className="mb-10 text-center">
             <h2 className="text-3xl font-black text-white tracking-[0.2em] uppercase italic">涂鸦收藏馆</h2>
             <p className="text-[10px] font-mono text-gray-600 mt-2 uppercase tracking-widest">Doodle_Cabinet // Fragments of Soul</p>
        </div>

        <div className="flex flex-col items-center">
            {/* 选中的角色详情 */}
            <div className="w-full flex flex-col items-center mb-10">
                <div className="relative mb-6">
                   <CharacterCard 
                    character={activeChar} 
                    isActive={true}
                   />
                   {!activeChar.unlocked && (
                     <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center hand-drawn-border">
                        <span className="text-4xl mb-4">🔒</span>
                        <p className="text-sm font-bold text-white mb-4">该人格碎片尚未觉醒</p>
                        <button 
                          onClick={() => unlockCharacter(activeChar.id)}
                          className="px-6 py-2 bg-doodle-highlight text-black rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_#000]"
                        >
                          消耗意识能量觉醒
                        </button>
                     </div>
                   )}
                </div>

                {activeChar.unlocked && (
                   <div className="w-full max-w-[320px] flex gap-2">
                      <button 
                        onClick={() => toggleActive(activeChar.id)}
                        className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase transition-all shadow-[3px_3px_0px_#000] border border-black ${activeChar.isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                      >
                        {activeChar.isActive ? '休眠此人格' : '激活此人格'}
                      </button>
                   </div>
                )}
            </div>

            {/* 网格选择器 */}
            <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
                {/* Fixed: TypeScript now knows char is a Character due to characterList's type assertion */}
                {characterList.map(char => (
                    <button 
                        key={char.id}
                        onClick={() => setSelectedId(char.id)}
                        className={`
                            relative aspect-square rounded-xl flex items-center justify-center text-xl transition-all duration-300 border shadow-[2px_2px_0px_rgba(0,0,0,0.5)]
                            ${selectedId === char.id ? `bg-white/10 ${char.color.split(' ')[1]} scale-110 z-10` : 'bg-black border-white/5 opacity-50 hover:opacity-100'}
                            ${!char.unlocked ? 'grayscale saturate-0' : ''}
                        `}
                    >
                        {char.avatar}
                        <div className="absolute top-1 right-1 text-[7px] font-mono text-white/40">{char.mbti}</div>
                        {char.isActive && char.unlocked && (
                            <div className="absolute -bottom-1 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* 宿主当前心理属性 */}
        <div className="mt-12 p-6 bg-white/[0.03] hand-drawn-border border border-white/10">
            <h3 className="text-[10px] font-black text-white/40 tracking-widest uppercase mb-6 flex items-center gap-2">
               <span className="w-2 h-2 bg-doodle-highlight rounded-full"></span>
               宿主当前心理基调
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <StatBar label="E/I (外向/内向)" value={stats.E / (stats.E + stats.I || 1) * 100} left="E" right="I" />
                <StatBar label="N/S (直觉/实感)" value={stats.N / (stats.N + stats.S || 1) * 100} left="N" right="S" />
                <StatBar label="T/F (思考/情感)" value={stats.T / (stats.T + stats.F || 1) * 100} left="T" right="F" />
                <StatBar label="J/P (判断/感知)" value={stats.J / (stats.J + stats.P || 1) * 100} left="J" right="P" />
            </div>
        </div>
    </div>
  );
};

const StatBar = ({ label, value, left, right }: { label: string, value: number, left: string, right: string }) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[8px] font-mono uppercase text-white/30">
            <span>{label}</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden flex">
            <div className="h-full bg-doodle-highlight/40" style={{ width: `${value}%` }}></div>
        </div>
        <div className="flex justify-between text-[7px] font-bold text-white/10">
            <span>{left}</span>
            <span>{right}</span>
        </div>
    </div>
);

export default ProfileInterface;
