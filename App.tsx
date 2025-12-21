
import React, { useState, useEffect } from 'react';
import { AppView, Message, JournalEntry, MBTIStats, RoleId, Character } from './types';
import { INITIAL_STATS, CHARACTERS as INITIAL_CHARACTERS } from './constants';
import ChatInterface from './components/ChatInterface';
import JournalInterface from './components/JournalInterface';
import ProfileInterface from './components/ProfileInterface';
import BazaarInterface from './components/BazaarInterface';
import OnboardingOverlay from './components/OnboardingOverlay';
import CharacterSelection from './components/CharacterSelection';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.CHAT);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState<MBTIStats>(INITIAL_STATS);
  const [characters, setCharacters] = useState<Record<string, Character>>(INITIAL_CHARACTERS);

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
        if (savedChars) setCharacters(JSON.parse(savedChars));
        
        if (!selectionDone) {
            setShowSelection(true);
        }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('doodle_stats_v3', JSON.stringify(stats));
        localStorage.setItem('doodle_msgs_v3', JSON.stringify(messages));
        localStorage.setItem('doodle_entries_v3', JSON.stringify(entries));
        localStorage.setItem('doodle_chars_v3', JSON.stringify(characters));
    } catch (e) { console.error(e); }
  }, [stats, messages, entries, characters]);

  const handleInitialSelect = (roleId: RoleId) => {
    setCharacters(prev => ({
        ...prev,
        [roleId]: { ...prev[roleId], unlocked: true, isActive: true }
    }));
    setStats(prev => ({ ...prev, energy: prev.energy + 500 })); // 契约奖励
    setShowSelection(false);
    localStorage.setItem('doodle_selection_v3', 'true');
    setShowOnboarding(true); // 选择完角色后再看介绍
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

  const handleLike = (msgId: string, roleId: RoleId) => {
    setMessages(prev => prev.map(m => {
        if (m.id === msgId && !m.likedByUser) {
            const char = characters[roleId];
            if (char) {
                const dim = char.dimension as keyof MBTIStats;
                setStats(curr => ({
                    ...curr,
                    [dim]: (curr[dim] || 0) + 1,
                    energy: curr.energy + 10
                }));
            }
            return { ...m, likedByUser: true, likes: m.likes + 1 };
        }
        return m;
    }));
  };

  return (
    <div className="h-screen w-screen bg-dark text-gray-200 flex flex-col overflow-hidden font-sans doodle-bg">
      {showSelection && <CharacterSelection onSelect={handleInitialSelect} />}
      {showOnboarding && <OnboardingOverlay onComplete={() => setShowOnboarding(false)} />}

      <div className="h-16 flex items-center justify-between px-6 shrink-0 z-30 relative border-b border-white/5 bg-black/50 backdrop-blur-md">
        <h1 className="font-black italic text-2xl tracking-tighter text-white">涂鸦 <span className="text-[10px] font-mono opacity-20 ml-1">MIND_0</span></h1>
        <div className="flex items-center gap-3">
            <div className="text-[10px] font-black text-doodle-highlight flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl sketch-border border border-white/10">
                <span className="opacity-40 font-mono text-[8px]">E:</span> {stats.energy}
            </div>
        </div>
      </div>

      <main className="flex-1 relative overflow-hidden">
        <div className={`absolute inset-0 transition-all duration-500 ${view === AppView.CHAT ? 'opacity-100 translate-y-0 z-20' : 'opacity-0 translate-y-4 z-10 pointer-events-none'}`}>
            <ChatInterface messages={messages} setMessages={setMessages} onLike={handleLike} characters={characters} />
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
        <NavButton active={view === AppView.CHAT} onClick={() => setView(AppView.CHAT)} icon="💬" label="群聊" />
        <NavButton active={view === AppView.BAZAAR} onClick={() => setView(AppView.BAZAAR)} icon="🛒" label="集市" />
        <NavButton active={view === AppView.JOURNAL} onClick={() => setView(AppView.JOURNAL)} icon="📓" label="核心" />
        <NavButton active={view === AppView.PROFILE} onClick={() => setView(AppView.PROFILE)} icon="👤" label="镜像" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${active ? 'opacity-100 scale-110 text-doodle-highlight' : 'opacity-30 scale-90'}`}>
        <div className="text-xl mb-0.5">{icon}</div>
        <span className="text-[8px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
);

export default App;
