
import React, { useState, useEffect, useRef } from 'react';
import { AppView, Message, JournalEntry, MBTIStats, RoleId, Character } from './types';
import { INITIAL_STATS, CHARACTERS as INITIAL_CHARACTERS, UI_ICONS } from './constants';
import ChatInterface from './components/ChatInterface';
import JournalInterface from './components/JournalInterface';
import ProfileInterface from './components/ProfileInterface';
import BazaarInterface from './components/BazaarInterface';
import OnboardingOverlay from './components/OnboardingOverlay';
import CharacterSelection from './components/CharacterSelection';
import { generateChatResponse } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.CHAT);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState<MBTIStats>(INITIAL_STATS);
  const [characters, setCharacters] = useState<Record<string, Character>>(INITIAL_CHARACTERS);
  const [isTyping, setIsTyping] = useState(false);

  // 本地存储加载
  useEffect(() => {
    try {
        const savedStats = localStorage.getItem('doodle_stats_v3');
        const savedMsgs = localStorage.getItem('doodle_msgs_v3');
        const savedEntries = localStorage.getItem('doodle_entries_v3');
        const savedChars = localStorage.getItem('doodle_chars_v3');
        const selectionDone = localStorage.getItem('doodle_selection_v3');

        if (savedStats) setStats(JSON.parse(savedStats));
        if (savedMsgs) setMessages(JSON.parse(savedMsgs));
        if (savedEntries) setEntries(JSON.parse(savedEntries));
        
        if (savedChars) {
            const parsedChars = JSON.parse(savedChars);
            const mergedChars = { ...parsedChars };
            let needUpdate = false;
            
            Object.keys(INITIAL_CHARACTERS).forEach(key => {
                if (mergedChars[key]) {
                    if (!mergedChars[key].generatedAvatar) {
                        mergedChars[key].generatedAvatar = INITIAL_CHARACTERS[key].generatedAvatar;
                        needUpdate = true;
                    }
                } else {
                    mergedChars[key] = INITIAL_CHARACTERS[key];
                    needUpdate = true;
                }
            });
            
            setCharacters(mergedChars);
        } else {
            setCharacters(INITIAL_CHARACTERS);
        }
        
        if (!selectionDone) {
            setShowSelection(true);
        }
    } catch (e) { console.error(e); }
  }, []);

  // 本地存储保存
  useEffect(() => {
    try {
        localStorage.setItem('doodle_stats_v3', JSON.stringify(stats));
        localStorage.setItem('doodle_msgs_v3', JSON.stringify(messages));
        localStorage.setItem('doodle_entries_v3', JSON.stringify(entries));
        localStorage.setItem('doodle_chars_v3', JSON.stringify(characters));
    } catch (e) { console.error(e); }
  }, [stats, messages, entries, characters]);

  const handleInitialSelect = (roleId: RoleId) => {
    const newChars = { ...characters };
    newChars[roleId] = { ...newChars[roleId], unlocked: true, isActive: true };
    const allIds = Object.keys(newChars) as RoleId[];
    const candidates = allIds.filter(id => id !== roleId && id !== RoleId.USER);
    const selection: RoleId[] = [];
    candidates.sort(() => Math.random() - 0.5).forEach(id => {
        if (selection.length < 3) selection.push(id);
    });
    selection.forEach(id => {
        newChars[id] = { ...newChars[id], unlocked: true, isActive: true };
    });
    setCharacters(newChars);
    setStats(prev => ({ ...prev, energy: prev.energy + 300 })); 
    setShowSelection(false);
    localStorage.setItem('doodle_selection_v3', 'true');
    setShowOnboarding(true);
  };

  const handleUnlock = (id: RoleId) => {
    const char = characters[id];
    if (char && stats.energy >= char.cost) {
        setStats(prev => ({ ...prev, energy: prev.energy - char.cost }));
        setCharacters(prev => ({
            ...prev,
            [id]: { ...prev[id], unlocked: true, isActive: true }
        }));
    }
  };

  const toggleActive = (id: RoleId) => {
    setCharacters(prev => ({
        ...prev,
        [id]: { ...prev[id], isActive: !prev[id].isActive }
    }));
  };

  const processAIResponse = (responses: Partial<Message>[]) => {
      let cumulativeDelay = 0;
      
      if (responses.length === 0) {
          setIsTyping(false);
          return;
      }

      responses.forEach((res, index) => {
          const delay = 1000 + Math.random() * 2000; 
          cumulativeDelay += delay;
          
          setTimeout(() => {
              const rollSkill = Math.random() < 0.15;
              const msg: Message = {
                  id: `ai-${Date.now()}-${index}`,
                  roleId: res.roleId as RoleId,
                  text: res.text || '...',
                  timestamp: Date.now(),
                  likes: 0,
                  likedByUser: false,
                  skillActivated: rollSkill ? res.skillActivated : undefined,
                  skillText: rollSkill ? res.skillText : undefined
              };
              setMessages(prev => [...prev, msg]);
          }, cumulativeDelay);
      });
      
      setTimeout(() => setIsTyping(false), cumulativeDelay);
  };

  const handleLike = async (msgId: string, roleId: RoleId) => {
    const targetMsg = messages.find(m => m.id === msgId);
    if (!targetMsg || targetMsg.likedByUser) return;

    const char = characters[roleId];
    if (!char) return;

    setMessages(prev => prev.map(m => 
        m.id === msgId ? { ...m, likedByUser: true, likes: m.likes + 1 } : m
    ));

    const mbti = char.mbti;
    const update: any = {};
    mbti.split('').forEach(letter => {
        update[letter] = (stats[letter as keyof MBTIStats] || 0) + 1;
    });
    setStats(curr => ({ ...curr, ...update, energy: curr.energy + 20 }));

    const eventMsg: Message = {
        id: `event-${Date.now()}`,
        roleId: RoleId.USER,
        text: `（宿主对 ${char.name} 的话表示强烈共鸣）`,
        timestamp: Date.now(),
        likes: 0,
        likedByUser: false
    };
    const updatedMessages = [...messages, eventMsg];
    setMessages(updatedMessages);

    setIsTyping(true);
    setTimeout(async () => {
        const responses = await generateChatResponse(
            updatedMessages, 
            characters, 
            `系统事件：宿主对 ${char.name} 的发言表示强烈共鸣（点赞）。该角色受到激励，应当立即第一个回应，语气要更强烈或得意。其他角色可以对此反应。`
        );
        processAIResponse(responses);
    }, 500);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
        id: Date.now().toString(),
        roleId: RoleId.USER,
        text: text,
        timestamp: Date.now(),
        likes: 0,
        likedByUser: false
    };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setIsTyping(true);
    
    const responses = await generateChatResponse(newMsgs, characters);
    processAIResponse(responses);
  };

  return (
    <div className="h-screen w-screen bg-dark text-gray-200 flex flex-col overflow-hidden font-sans doodle-bg">
      {showSelection && <CharacterSelection onSelect={handleInitialSelect} />}
      {showOnboarding && <OnboardingOverlay onComplete={() => setShowOnboarding(false)} />}

      <div className="h-16 flex items-center justify-between px-6 shrink-0 z-30 relative border-b border-white/5 bg-black/50 backdrop-blur-md">
        <h1 className="font-black italic text-2xl tracking-tighter text-white">涂鸦 <span className="text-[10px] font-mono opacity-20 ml-1">MIND_0</span></h1>
        <div className="flex items-center gap-3">
            <div className="text-[10px] font-black text-doodle-highlight flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl sketch-border border border-white/10">
                <span className="opacity-40 font-mono text-[8px]">⚡:</span> {stats.energy}
            </div>
        </div>
      </div>

      <main className="flex-1 relative overflow-hidden">
        <div className={`absolute inset-0 transition-all duration-500 ${view === AppView.CHAT ? 'opacity-100 translate-y-0 z-20' : 'opacity-0 translate-y-4 z-10 pointer-events-none'}`}>
            <ChatInterface messages={messages} onSendMessage={handleSendMessage} onLike={handleLike} characters={characters} isTyping={isTyping} />
        </div>
        <div className={`absolute inset-0 transition-all duration-500 ${view === AppView.BAZAAR ? 'opacity-100 translate-y-0 z-20' : 'opacity-0 translate-y-4 z-10 pointer-events-none'}`}>
            <BazaarInterface characters={characters} stats={stats} onUnlock={handleUnlock} onToggleActive={toggleActive} />
        </div>
        <div className={`absolute inset-0 transition-all duration-500 ${view === AppView.JOURNAL ? 'opacity-100 translate-y-0 z-20' : 'opacity-0 translate-y-4 z-10 pointer-events-none'}`}>
            <JournalInterface entries={entries} addEntry={(e) => setEntries(prev => [...prev, e])} characters={characters} />
        </div>
        <div className={`absolute inset-0 transition-all duration-500 ${view === AppView.PROFILE ? 'opacity-100 translate-y-0 z-20' : 'opacity-0 translate-y-4 z-10 pointer-events-none'}`}>
            <ProfileInterface stats={stats} characters={characters} toggleActive={toggleActive} unlockCharacter={handleUnlock} />
        </div>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm h-16 bg-black/90 backdrop-blur-3xl sketch-border-v3 z-50 flex justify-around items-center px-4 border-2 border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        <NavButton active={view === AppView.CHAT} onClick={() => setView(AppView.CHAT)} iconSrc={UI_ICONS.NAV_CHAT} label="群聊" />
        <NavButton active={view === AppView.BAZAAR} onClick={() => setView(AppView.BAZAAR)} iconSrc={UI_ICONS.NAV_BAZAAR} label="集市" />
        <NavButton active={view === AppView.JOURNAL} onClick={() => setView(AppView.JOURNAL)} iconSrc={UI_ICONS.NAV_JOURNAL} label="核心" />
        <NavButton active={view === AppView.PROFILE} onClick={() => setView(AppView.PROFILE)} iconSrc={UI_ICONS.NAV_PROFILE} label="镜像" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; iconSrc: string; label: string }> = ({ active, onClick, iconSrc, label }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${active ? 'opacity-100 scale-110' : 'opacity-40 scale-90 grayscale'}`}>
        <div className="w-8 h-8 mb-1">
            <img src={iconSrc} alt={label} className="w-full h-full object-contain" />
        </div>
        <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${active ? 'text-doodle-highlight' : 'text-gray-400'}`}>{label}</span>
    </button>
);

export default App;
