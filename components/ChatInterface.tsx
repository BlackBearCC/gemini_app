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
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      roleId: RoleId.USER,
      text: textToSend.trim(),
      timestamp: Date.now(),
      likes: 0,
      likedByUser: false
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // API Call
    const responses = await generateChatResponse(messages, userMsg.text);
    
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
            }, 600 * (index + 1));
        });
    }
  };

  const suggestions = [
    "Anyone there?",
    "Analyze my vibe today.",
    "I'm feeling overwhelmed.",
    "What's the meaning of this?"
  ];

  return (
    <div className="flex flex-col h-full bg-dark relative">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-24">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-3/4 space-y-6">
                <div className="text-center text-gray-600 animate-pulse">
                    <p className="font-mono tracking-widest mb-2">NEURAL LINK ESTABLISHED</p>
                    <p className="text-sm">Initiate conversation protocol.</p>
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

            // Safety check: if not user and char not found, skip to prevent crash
            if (!isUser && !char) return null;
            
            const charColorClass = !isUser && char ? (char.color.split(' ')[0] || 'text-gray-400') : '';
            const charBorderClass = !isUser && char ? (char.color.split(' ')[1] || 'border-gray-700') : '';

            return (
                <div key={msg.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <RoleAvatar roleId={msg.roleId} size="sm" className="mt-1 shrink-0" />
                    
                    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
                        {!isUser && <span className={`text-xs mb-1 ml-1 opacity-70 ${charColorClass}`}>{char?.name}</span>}
                        
                        <div className={`
                            p-3 rounded-2xl text-sm leading-relaxed relative group
                            ${isUser 
                                ? 'bg-gray-800 text-white rounded-tr-sm border border-gray-700' 
                                : 'bg-black/40 backdrop-blur-md border border-gray-800 text-gray-200 rounded-tl-sm shadow-[0_0_15px_-5px_rgba(0,0,0,0.5)]'}
                        `}>
                             {/* Neon border glow for bots */}
                            {!isUser && (
                                <div className={`absolute inset-0 rounded-2xl border opacity-30 pointer-events-none ${charBorderClass}`}></div>
                            )}
                            
                            {msg.text}

                            {/* Like Button for bots */}
                            {!isUser && (
                                <button 
                                    onClick={() => onLike(msg.id, msg.roleId)}
                                    className={`absolute -bottom-3 -right-2 p-1 rounded-full bg-gray-900 border border-gray-800 shadow-sm transition-all ${msg.likedByUser ? 'text-red-500 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
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
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center animate-pulse">...</div>
                <div className="text-gray-500 text-xs self-center">Thinking...</div>
             </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent z-20">
        <div className="relative flex items-center gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Broadcast thought..."
                className="w-full bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-full py-3 px-5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors placeholder-gray-600 shadow-lg"
            />
            <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="p-3 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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