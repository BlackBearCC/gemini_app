import React from 'react';
import { MBTIStats, RoleId } from '../types';
import { CHARACTERS } from '../constants';
import RoleAvatar from './RoleAvatar';

interface Props {
  stats: MBTIStats;
}

const ProfileInterface: React.FC<Props> = ({ stats }) => {
  const totalLikes = (Object.values(stats) as number[]).reduce((a, b) => a + b, 0);

  // Helper to calculate percentage width
  const getPct = (val: number) => {
    if (totalLikes === 0) return 50; // Default middle
    // Normalize somewhat
    const max = Math.max(...(Object.values(stats) as number[]));
    if (max === 0) return 0;
    return (val / max) * 100;
  };

  const pairs = [
    { left: 'E', right: 'I', leftId: RoleId.SPARK, rightId: RoleId.ECHO, label: '能量' },
    { left: 'N', right: 'S', leftId: RoleId.VISION, rightId: RoleId.ROOT, label: '信息' },
    { left: 'T', right: 'F', leftId: RoleId.LOGIC, rightId: RoleId.HEART, label: '决策' },
    { left: 'J', right: 'P', leftId: RoleId.JUDGE, rightId: RoleId.FLOW, label: '结构' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-dark p-6 pb-24 no-scrollbar">
        <div className="text-center mb-8">
             <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-gray-700 flex items-center justify-center text-4xl mb-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                🧬
             </div>
             <h2 className="text-2xl font-bold text-white tracking-widest">PSYCHE_MAP</h2>
             <p className="text-xs text-gray-500 mt-1">基于 {totalLikes} 次共鸣点数分析</p>
        </div>

        <div className="space-y-10">
            {pairs.map((pair) => {
                const leftVal = stats[pair.left as keyof MBTIStats];
                const rightVal = stats[pair.right as keyof MBTIStats];
                const totalPair = leftVal + rightVal || 1;
                const leftPct = (leftVal / totalPair) * 100;
                
                const leftChar = CHARACTERS[pair.leftId];
                const rightChar = CHARACTERS[pair.rightId];

                // Safe check
                if (!leftChar || !rightChar) return null;
                
                const leftColorBg = (leftChar.color || '').split(' ')[0].replace('text', 'bg');
                const rightColorBg = (rightChar.color || '').split(' ')[0].replace('text', 'bg');
                const leftColorText = (leftChar.color || '').split(' ')[0];
                const rightColorText = (rightChar.color || '').split(' ')[0];

                return (
                    <div key={pair.label} className="relative">
                        <div className="flex justify-between items-end mb-2 px-1">
                             <div className="flex flex-col items-center">
                                <RoleAvatar roleId={pair.leftId} size="sm" className="mb-1" />
                                <span className={`text-xs font-bold ${leftColorText}`}>{leftVal}</span>
                             </div>
                             <span className="text-[10px] text-gray-600 uppercase tracking-widest font-mono">{pair.label}</span>
                             <div className="flex flex-col items-center">
                                <RoleAvatar roleId={pair.rightId} size="sm" className="mb-1" />
                                <span className={`text-xs font-bold ${rightColorText}`}>{rightVal}</span>
                             </div>
                        </div>
                        
                        {/* Bar Container */}
                        <div className="h-4 bg-gray-900 rounded-full overflow-hidden relative border border-gray-800 shadow-inner">
                            {/* Left Bar */}
                            <div 
                                className={`absolute left-0 top-0 bottom-0 transition-all duration-1000 ease-out ${leftColorBg}`}
                                style={{ width: `${leftPct}%`, opacity: 0.8 }}
                            ></div>
                            {/* Right Bar is basically the remaining space, but let's make it explicit for visual dual-color */}
                             <div 
                                className={`absolute right-0 top-0 bottom-0 transition-all duration-1000 ease-out ${rightColorBg}`}
                                style={{ width: `${100 - leftPct}%`, opacity: 0.8 }}
                            ></div>
                            
                            {/* Divider */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black z-10 -translate-x-1/2 opacity-50"></div>
                        </div>
                    </div>
                );
            })}
        </div>
        
        <div className="mt-12 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <h3 className="text-sm font-bold text-gray-300 mb-2">系统提示</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
                你的互动正在重塑内部模型。点赞某个人格的发言会增强该维度的权重。请继续输入数据以提高精准度。
            </p>
        </div>
    </div>
  );
};

export default ProfileInterface;