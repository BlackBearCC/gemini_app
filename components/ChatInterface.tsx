
import React, { useState, useRef, useEffect } from 'react';
import { Message, RoleId, Character } from '../types';
import { UI_ICONS } from '../constants';

interface Props {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onLike: (msgId: string, roleId: RoleId) => void;
  characters: Record<string, Character>;
  isTyping: boolean;
}

const ChatInterface: React.FC<Props> = ({ messages, onSendMessage, onLike, characters, isTyping }) => {
  const [input, setInput] = useState('');
  const [lastLikedId, setLastLikedId] = useState<string | null>(null); // 用于触发动画
  
  // 移除自动滚动，避免新消息打断用户阅读历史
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);

  const activeChars = (Object.values(characters) as Character[]).filter(c => c.isActive && c.unlocked);

  useEffect(() => {
    if (isFirstLoad.current && messages.length > 0) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        isFirstLoad.current = false;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput('');
    // 发送消息时才强制滚动到底部
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleLikeWithEffect = (msgId: string, roleId: RoleId) => {
    setLastLikedId(msgId);
    onLike(msgId, roleId);
    setTimeout(() => setLastLikedId(null), 500);
  };

  const getDoodleStyles = (seed: string, isMe: boolean) => {
    const num = parseInt(seed.replace(/\D/g, '').slice(-3)) || 0;
    const rotates = isMe 
      ? ['rotate-1', 'rotate-[0.5deg]', 'rotate-[1.2deg]', 'rotate-0']
      : ['-rotate-1', '-rotate-[1.5deg]', '-rotate-[0.8deg]', 'rotate-[1deg]'];
    const borders = ['sketch-border', 'sketch-border-v1', 'sketch-border-v2', 'sketch-border-v3'];
    return {
      rotation: rotates[num % rotates.length],
      borderVariant: borders[num % borders.length]
    };
  };

  return (
    <div className="flex flex-col h-full relative z-10">
      <div className="flex-1 overflow-y-auto px-4 pt-10 pb-48 no-scrollbar scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-20 text-center px-10">
            <div className="w-24 h-24 mb-6">
                <img src={UI_ICONS.NAV_CHAT} alt="Empty" className="w-full h-full object-contain grayscale" />
            </div>
            <p className="text-xs font-mono uppercase tracking-[0.3em] leading-relaxed">
              脑内剧场已就绪<br/>输入任何念头，或者在这里涂鸦
            </p>
          </div>
        )}

        {messages.map((msg) => {
            const isMe = msg.roleId === RoleId.USER;
            const isEvent = msg.id.startsWith('event-');
            const char = characters[msg.roleId];
            const { rotation, borderVariant } = getDoodleStyles(msg.id, isMe);
            const isJustLiked = lastLikedId === msg.id;
            
            const name = isMe ? (isEvent ? "系统" : "宿主") : char?.name;
            const colorClass = isMe ? (isEvent ? "text-gray-500" : "text-doodle-pencil") : char?.color.split(' ')[0];

            if (isEvent) {
                return (
                    <div key={msg.id} className="flex justify-center my-6 animate-[fadeIn_0.5s_ease-out]">
                        <div className="px-4 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-gray-500 italic">
                            {msg.text}
                        </div>
                    </div>
                );
            }

            return (
                <div key={msg.id} className={`flex flex-col mb-12 ${isMe ? 'items-end' : 'items-start'} w-full animate-[fadeIn_0.3s_ease-out]`}>
                    <div className={`flex gap-3 max-w-[92%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* 头像显示逻辑更新：统一使用 SVG 资源 */}
                        <div className={`w-10 h-10 shrink-0 flex items-center justify-center text-xl bg-black border-2 border-white/20 sketch-border shadow-[2px_2px_0px_rgba(255,255,255,0.1)] overflow-hidden`}>
                           {isMe ? (
                             <img src={isEvent ? UI_ICONS.SYSTEM_AVATAR : UI_ICONS.USER_AVATAR} alt="User" className="w-full h-full object-cover scale-110" />
                           ) : (
                             char?.generatedAvatar ? (
                               <img src={char.generatedAvatar} alt={char.name} className="w-full h-full object-cover scale-110" />
                             ) : char?.avatar
                           )}
                        </div>
                        
                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-2 mb-2 px-1">
                                <span className={`text-[11px] font-black uppercase tracking-tighter ${colorClass}`}>
                                    {name}
                                </span>
                                {!isMe && char && (
                                  <span className="text-[9px] font-mono bg-doodle-highlight text-black px-2 py-0.5 -rotate-2 shadow-[2px_2px_0px_#000] font-black uppercase">
                                    {char.mbti}
                                  </span>
                                )}
                            </div>
                            
                            <div className={`
                                px-5 py-3 text-[15px] leading-relaxed relative transition-all duration-300 overflow-visible
                                ${isMe 
                                    ? `host-bubble ${rotation} ${borderVariant} shadow-[6px_6px_0px_#1a1a1a]` 
                                    : `persona-bubble ${rotation} ${borderVariant} shadow-[4px_4px_0px_rgba(255,255,255,0.05)]`}
                                ${isJustLiked ? 'animate-resonance ring-4 ring-doodle-highlight/50' : ''}
                            `}>
                                {msg.text}
                                
                                {!isMe && (
                                    <div className="absolute -bottom-2 -right-2 z-50">
                                        {isJustLiked && <div className="absolute inset-0 bg-doodle-highlight rounded-full animate-ping-fast"></div>}
                                        <button 
                                          onClick={() => handleLikeWithEffect(msg.id, msg.roleId)} 
                                          className={`relative z-10 p-2 rounded-full bg-black border-2 border-white/20 transition-all active:scale-90 shadow-lg ${msg.likedByUser ? 'text-red-500 border-red-500/40 scale-110 rotate-12' : 'text-gray-700 hover:text-white/40'}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!isMe && char && (
                                <div className="mt-3 flex items-center gap-2 opacity-30">
                                    <span className="text-[14px] font-serif italic text-doodle-highlight">→</span>
                                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold">{char.dimensionFull}</span>
                                </div>
                            )}

                            {msg.skillActivated && (
                                <div className="mt-3 px-3 py-1 bg-red-900/10 border-l-2 border-red-500/30 text-[10px] font-mono text-red-400/80 italic flex items-center gap-2 animate-bounce">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                    {msg.skillActivated}: {msg.skillText}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        })}
        
        {isTyping && (
             <div className="flex gap-3 mb-8 animate-pulse">
                <div className="w-10 h-10 sketch-border border-2 border-white/10 bg-white/5"></div>
                <div className="h-10 w-32 bg-white/5 sketch-border-v1 border border-white/5 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-white/20 tracking-widest">意识写入中...</span>
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-28 left-0 right-0 px-6 z-40">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
            <div className="flex gap-3 justify-center">
              {activeChars.slice(0, 5).map(c => (
                 <div key={c.id} className="text-[9px] font-mono text-white/30 uppercase font-black tracking-tighter bg-white/5 px-2 py-0.5 sketch-border-v3 border border-white/10">
                   #{c.mbti}
                 </div>
              ))}
            </div>
            <div className="flex items-center gap-3 bg-black/90 backdrop-blur-2xl sketch-border-v3 border-2 border-white/20 p-2 pr-4 shadow-[10px_10px_0px_rgba(0,0,0,0.5)]">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="在此输入念头..."
                    className="flex-1 bg-transparent py-4 px-4 text-[16px] text-white focus:outline-none placeholder-gray-800 font-serif font-bold"
                />
                <button 
                  onClick={() => handleSend()} 
                  disabled={!input.trim() || isTyping} 
                  className="w-12 h-12 sketch-border-v1 bg-doodle-highlight text-black flex items-center justify-center active:scale-90 disabled:opacity-10 transition-all shadow-[4px_4px_0px_#000] border-2 border-black"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
