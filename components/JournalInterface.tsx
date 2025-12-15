import React, { useState } from 'react';
import { JournalEntry, RoleId } from '../types';
import { analyzeJournalEntry } from '../services/geminiService';
import RoleAvatar from './RoleAvatar';
import { CHARACTERS } from '../constants';

interface Props {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
}

const JournalInterface: React.FC<Props> = ({ entries, addEntry }) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'write'>('list');

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
        const analysis = await analyzeJournalEntry(text);
        
        const newEntry: JournalEntry = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            content: text,
            summary: analysis.summary,
            mood: analysis.mood,
            responses: analysis.reactions.map((r, i) => ({
                id: `res-${Date.now()}-${i}`,
                roleId: r.roleId as RoleId,
                text: r.text,
                timestamp: Date.now(),
                likes: 0,
                likedByUser: false
            }))
        };
        
        addEntry(newEntry);
        setText('');
        setViewMode('list');
    } catch (e) {
        alert("保存失败，请重试。");
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-dark p-4 pb-24 no-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 tracking-tighter">
            MEMORY_CORE
        </h2>
        <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'write' : 'list')}
            className="px-4 py-1.5 text-xs font-mono border border-neon-green text-neon-green rounded hover:bg-neon-green/10 transition-colors"
        >
            {viewMode === 'list' ? '+ 记录' : '取消'}
        </button>
      </div>

      {viewMode === 'write' ? (
        <div className="space-y-4 animate-pulse-fast-once">
            <textarea
                className="w-full h-60 bg-card border border-gray-800 rounded-lg p-4 text-gray-300 focus:outline-none focus:border-gray-600 resize-none placeholder-gray-700"
                placeholder="记录今天的碎片..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button
                onClick={handleSubmit}
                disabled={isAnalyzing || !text.trim()}
                className="w-full py-3 bg-gray-100 text-black font-bold rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
                {isAnalyzing ? '正在处理数据...' : '保存记忆'}
            </button>
        </div>
      ) : (
        <div className="relative border-l border-gray-800 ml-4 space-y-8">
            {entries.length === 0 && (
                <div className="ml-6 text-gray-600 italic text-sm">暂无记忆日志。</div>
            )}
            
            {entries.sort((a,b) => b.timestamp - a.timestamp).map(entry => (
                <div key={entry.id} className="ml-6 relative group">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-gray-800 border border-gray-600 group-hover:bg-neon-purple group-hover:border-neon-purple transition-colors"></div>
                    
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs font-mono text-gray-500">
                                {new Date(entry.timestamp).toLocaleDateString('zh-CN')} • {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-900 text-gray-400 border border-gray-800">
                                {entry.mood}
                            </span>
                        </div>

                        <div className="text-gray-300 text-sm leading-relaxed bg-card p-3 rounded border border-gray-800/50">
                            {entry.content}
                        </div>

                        <div className="text-xs text-gray-500 italic border-l-2 border-neon-purple pl-2 py-1">
                            "{entry.summary}"
                        </div>

                        {/* Reactions */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {entry.responses.map(res => {
                                const char = CHARACTERS[res.roleId];
                                // Safely handle cases where roleId might be invalid or 'user'
                                if (!char) return null;
                                
                                const charColorClass = (char.color || '').split(' ')[0] || 'text-gray-400';

                                return (
                                    <div key={res.id} className="flex items-center gap-2 bg-black/30 rounded-full pr-3 border border-gray-800">
                                        <RoleAvatar roleId={res.roleId} size="sm" className="w-6 h-6 text-xs" />
                                        <span className={`text-xs ${charColorClass}`}>
                                            {res.text}
                                        </span>
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
  );
};

export default JournalInterface;