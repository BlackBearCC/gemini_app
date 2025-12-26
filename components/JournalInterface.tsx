
import React, { useState } from 'react';
import { JournalEntry, RoleId, Character } from '../types';
import { analyzeJournalEntry } from '../services/geminiService';
import RoleAvatar from './RoleAvatar';
import { CHARACTERS, UI_ICONS } from '../constants';

interface Props {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  characters: Record<string, Character>;
}

const JournalInterface: React.FC<Props> = ({ entries, addEntry, characters }) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'write'>('list');

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
        const analysis = await analyzeJournalEntry(text, characters);
        
        if (!analysis) throw new Error("Analysis failed");

        const newEntry: JournalEntry = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            content: text,
            summary: analysis.summary,
            mood: analysis.mood,
            responses: analysis.reactions.map((r: any, i: number) => ({
                id: `res-${Date.now()}-${i}`,
                roleId: r.roleId as RoleId,
                text: r.text,
                timestamp: Date.now(),
                likes: 0,
                likedByUser: false,
                isCheck: r.isCheck
            }))
        };
        
        addEntry(newEntry);
        setText('');
        setViewMode('list');
    } catch (e) {
        alert("记忆同步中断，请检查神经连接。");
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full bg-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

      <div className="h-full overflow-y-auto p-6 pb-32 no-scrollbar">
          <header className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Memory_Core</h2>
              <div className="flex items-center gap-2">
                <div className="w-8 h-[1px] bg-neon-green"></div>
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Total Fragments: {entries.length}</span>
              </div>
            </div>
            <button 
                onClick={() => setViewMode(viewMode === 'list' ? 'write' : 'list')}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-black shadow-lg scale-100' : 'bg-red-500/20 text-red-500 border border-red-500/30 rotate-45'}`}
            >
                <img src={UI_ICONS.ADD} className={`w-6 h-6 ${viewMode === 'list' ? 'invert' : ''}`} alt="Toggle" />
            </button>
          </header>

          {viewMode === 'write' ? (
            <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
                <div className="relative">
                    <div className="absolute top-4 left-4 text-[9px] font-mono text-gray-700 uppercase tracking-[0.3em]">Synapse_Input_Active</div>
                    <textarea
                        className="w-full h-80 bg-white/5 border border-white/10 rounded-3xl p-6 pt-12 text-gray-200 text-base focus:outline-none focus:border-neon-green/50 transition-all resize-none placeholder-gray-800 leading-relaxed shadow-inner"
                        placeholder="在此输入你的碎片化意识..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isAnalyzing || !text.trim()}
                    className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all relative overflow-hidden ${isAnalyzing ? 'bg-gray-800 text-gray-500' : 'bg-white text-black active:scale-95'}`}
                >
                    <span className="relative z-10">{isAnalyzing ? '正在同步神经反馈...' : '上传至记忆核心'}</span>
                </button>
            </div>
          ) : (
            <div className="space-y-12">
                {entries.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                        <div className="w-24 h-24 mb-6">
                           <img src={UI_ICONS.NAV_JOURNAL} alt="Empty" className="w-full h-full object-contain grayscale" />
                        </div>
                        <p className="text-xs font-mono tracking-widest">MEMORY BANK EMPTY</p>
                    </div>
                )}
                {entries.sort((a,b) => b.timestamp - a.timestamp).map(entry => (
                    <div key={entry.id} className="relative group animate-[fadeIn_0.5s_ease-out]">
                        <div className="flex flex-col space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                   <div className="px-2 py-0.5 rounded bg-neon-green/10 text-neon-green border border-neon-green/20 text-[9px] font-mono uppercase tracking-tighter">#{entry.mood}</div>
                                   <span className="text-[10px] font-mono text-gray-700">{new Date(entry.timestamp).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="text-gray-200 text-sm leading-relaxed bg-white/5 p-5 rounded-3xl border border-white/5 group-hover:border-white/10 transition-all">
                                {entry.content}
                            </div>
                            <div className="relative p-4 rounded-2xl bg-black/40 border-l-4 border-neon-purple italic">
                               <div className="text-[8px] font-mono text-neon-purple uppercase mb-1 opacity-50 tracking-widest">Neural Summary</div>
                               <p className="text-xs text-gray-400">"{entry.summary}"</p>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {entry.responses.map(res => {
                                    const char = CHARACTERS[res.roleId];
                                    if (!char) return null;
                                    return (
                                        <div key={res.id} className={`flex flex-col gap-2 p-3 rounded-2xl border ${res.isCheck ? 'bg-white/[0.03] border-white/10' : 'bg-white/5 border-white/5'} transition-all`}>
                                            <div className="flex items-center gap-2">
                                                <RoleAvatar roleId={res.roleId} size="sm" className="w-5 h-5" />
                                                <span className={`text-[8px] font-black uppercase tracking-tighter ${char.color.split(' ')[0]}`}>{char.name}</span>
                                                {res.isCheck && <span className="text-[7px] font-mono text-gray-600">CHECK</span>}
                                            </div>
                                            <p className={`text-[11px] leading-tight ${res.isCheck ? 'italic text-gray-400' : 'text-gray-200'}`}>{res.text}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default JournalInterface;
