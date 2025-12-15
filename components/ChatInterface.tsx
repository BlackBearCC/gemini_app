import React, { useState, useRef, useEffect } from 'react';
import { Message, RoleId } from '../types';
import RoleAvatar from './RoleAvatar';
import { CHARACTERS } from '../constants';
import { generateChatResponse } from '../services/geminiService';

interface Props {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onLike: (msgId: string, roleId: RoleId) => void;
}

const ChatInterface: React.FC<Props> = ({ messages, setMessages, onLike }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textOverride?: string) => {
    // textOverride can be:
    // 1. undefined: User typed in input box and pressed enter.
    // 2. string (non-empty): User clicked a suggestion.
    // 3. "" (empty string): User clicked "Continue" button.

    const isManualInput = textOverride === undefined;
    const effectiveText = isManualInput ? input : textOverride;

    // If it's manual input, block if empty. 
    // If it's a programmatic override (even empty string for 'continue'), allow it.
    if (isManualInput && !effectiveText.trim()) return;

    // Only add a User message bubble if there is actual text content
    if (effectiveText.trim()) {
        const userMsg: Message = {
            id: Date.now().toString(),
            roleId: RoleId.USER,
            text: effectiveText.trim(),
            timestamp: Date.now(),
            likes: 0,
            likedByUser: false
        };
        setMessages(prev => [...prev, userMsg]);
    }

    // Clear manual input after sending
    if (isManualInput) {
        setInput('');
    }

    setIsTyping(true);

    // Pass undefined to API if text is empty (triggers "continue" prompt in service)
    const apiInput = effectiveText.trim() ? effectiveText : undefined;
    const responses = await generateChatResponse(messages, apiInput);
    
    setIsTyping(false);

    // Add responses one by one with a slight delay for realism
    if (responses.length > 0) {
        responses.forEach((resp, index) => {
            setTimeout(() => {
                const botMsg: Message = {
                    id: Date.now().toString() + index,
                    roleId: resp.roleId,
                    text: resp.text,
                    timestamp: Date.now(),
                    likes: 0,
                    likedByUser: false
                };
                setMessages(prev => [...prev, botMsg]);
            }, 1500 * (index + 1)); // Progressive delay
        });
    }
  };

  const handleContinue = () => {
      // Trigger generation with empty string to signal "continue flow"
      handleSend(""); 
  };

  const suggestions = [
    "有人在吗？",
    "分析一下我今天的状态",
    "我感觉好累啊",
    "人生的意义是啥"
  ];

  return (
    <div className="flex flex-col h-full bg-dark relative">
      {/* Chat Area - increased padding bottom to clear the floating input and nav */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-48 no-scrollbar">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-3/4 space-y-6 mt-10">
                <div className="text-center text-gray-600 animate-pulse">
                    <p className="font-mono tracking-widest mb-2">NEURAL LINK ESTABLISHED</p>
                    <p className="text-sm">神经元连接已建立...等待指令</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    {suggestions.map((s, i) => (
                        <button 
                            key={i}
                            onClick={() => handleSend(s)}
                            className="p-3 text-xs text-gray-400 border border-gray-800 rounded bg-gray-900/50 hover:bg-gray-800 hover:text-white hover:border-neon-purple/50 transition-all"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        )}
        
        {messages.map((msg) => {
            const isUser = msg.roleId === RoleId.USER;
            const char = CHARACTERS[msg.roleId];

            if (!isUser && !char) return null;
            
            const charColorClass = !isUser && char ? (char.color.split(' ')[0] || 'text-gray-400') : '';
            const charBorderClass = !isUser && char ? (char.color.split(' ')[1] || 'border-gray-700') : '';

            return (
                <div key={msg.id} className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <RoleAvatar roleId={msg.roleId} size="sm" className="mt-1 shrink-0" />
                    
                    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
                        {!isUser && <span className={`text-[10px] font-bold mb-1 ml-1 opacity-70 ${charColorClass}`}>{char?.name}</span>}
                        
                        <div className={`
                            p-3 rounded-2xl text-sm leading-relaxed relative group transition-all duration-300
                            ${isUser 
                                ? 'bg-gray-800 text-white rounded-tr-sm border border-gray-700' 
                                : 'bg-black/60 backdrop-blur-md border border-gray-800 text-gray-200 rounded-tl-sm shadow-[0_0_15px_-5px_rgba(0,0,0,0.5)] hover:border-gray-600'}
                        `}>
                             {/* Neon border glow for bots */}
                            {!isUser && (
                                <div className={`absolute inset-0 rounded-2xl border opacity-20 pointer-events-none ${charBorderClass}`}></div>
                            )}
                            
                            {msg.text}

                            {/* Like Button for bots */}
                            {!isUser && (
                                <button 
                                    onClick={() => onLike(msg.id, msg.roleId)}
                                    className={`absolute -bottom-3 -right-2 p-1.5 rounded-full bg-gray-900 border border-gray-800 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10 active:scale-75 ${msg.likedByUser ? 'text-red-500 scale-125 shadow-[0_0_10px_rgba(239,68,68,0.4)] bg-red-500/10 border-red-500/20' : 'text-gray-600 hover:text-gray-300 hover:scale-110 hover:bg-gray-800'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        })}
        
        {isTyping && (
             <div className="flex gap-3 mb-4 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
                <div className="text-gray-600 text-xs self-center font-mono">... 人格正在输入中</div>
             </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed position above the Nav Bar */}
      <div className="absolute bottom-24 left-0 right-0 p-4 z-40">
        
        {/* Continue Button - Floating above/centered */}
        <div className="flex justify-center mb-3 pointer-events-none">
            <button 
                onClick={handleContinue}
                disabled={isTyping}
                className="pointer-events-auto flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/50 text-neon-purple text-xs font-bold backdrop-blur-md shadow-[0_0_15px_rgba(176,38,255,0.3)] hover:bg-neon-purple/20 active:scale-95 transition-all disabled:opacity-0 disabled:translate-y-4"
            >
                <span className="animate-pulse">✨</span> 让大家继续聊
            </button>
        </div>

        <div className="relative flex items-center gap-2 max-w-lg mx-auto">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xl rounded-full -z-10 border border-white/5"></div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="加入群聊..."
                className="w-full bg-transparent py-3 px-5 text-sm text-white focus:outline-none placeholder-gray-500"
            />
            <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="mr-1 p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-neon-blue">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;