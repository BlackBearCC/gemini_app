import React, { useState, useEffect } from 'react';
import { AppView, Message, JournalEntry, MBTIStats, RoleId } from './types';
import { INITIAL_STATS, CHARACTERS } from './constants';
import ChatInterface from './components/ChatInterface';
import JournalInterface from './components/JournalInterface';
import ProfileInterface from './components/ProfileInterface';
import OnboardingOverlay from './components/OnboardingOverlay';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.CHAT);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Persist state logic could go here, using dummy initial state for now
  const [messages, setMessages] = useState<Message[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState<MBTIStats>(INITIAL_STATS);

  // Load from local storage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('mind0_stats');
    const savedMsgs = localStorage.getItem('mind0_msgs');
    const savedEntries = localStorage.getItem('mind0_entries');
    const onboardingDone = localStorage.getItem('mind0_onboarding_done');

    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedMsgs) setMessages(JSON.parse(savedMsgs));
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    
    if (!onboardingDone) {
      setShowOnboarding(true);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('mind0_stats', JSON.stringify(stats));
    localStorage.setItem('mind0_msgs', JSON.stringify(messages));
    localStorage.setItem('mind0_entries', JSON.stringify(entries));
  }, [stats, messages, entries]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('mind0_onboarding_done', 'true');
  };

  const handleLike = (msgId: string, roleId: RoleId) => {
    setMessages(prev => prev.map(m => {
        if (m.id === msgId && !m.likedByUser) {
            // Update stats logic
            const char = CHARACTERS[roleId];
            if (char) {
                const dim = char.dimension.match(/\(([A-Z])\)/)?.[1]; // Extract E, I, etc.
                if (dim) {
                     setStats(curr => ({
                        ...curr,
                        [dim]: (curr[dim as keyof MBTIStats] || 0) + 1
                    }));
                }
            }
            return { ...m, likedByUser: true, likes: m.likes + 1 };
        }
        return m;
    }));
  };

  return (
    <div className="h-screen w-screen bg-dark text-gray-200 flex flex-col overflow-hidden font-sans selection:bg-neon-purple selection:text-white">
      
      {showOnboarding && <OnboardingOverlay onComplete={handleOnboardingComplete} />}

      {/* Dynamic Header - Subtle */}
      <div className="h-12 border-b border-gray-900 flex items-center justify-between px-4 shrink-0 bg-black/50 backdrop-blur-sm z-30">
        <div className="font-bold tracking-widest text-lg text-white">
           MIND_0 <span className="text-xs text-neon-green font-mono font-normal opacity-70">v.1.0</span>
        </div>
        <div className="text-[10px] font-mono text-gray-500 uppercase">
            {view}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {view === AppView.CHAT && (
            <ChatInterface 
                messages={messages} 
                setMessages={setMessages} 
                onLike={handleLike} 
            />
        )}
        {view === AppView.JOURNAL && (
            <JournalInterface 
                entries={entries} 
                addEntry={(e) => setEntries(prev => [...prev, e])} 
            />
        )}
        {view === AppView.PROFILE && (
            <ProfileInterface stats={stats} />
        )}
      </main>

      {/* Floating Glass Tab Bar */}
      <nav className="absolute bottom-6 left-4 right-4 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-50 flex justify-around items-center px-2">
        <NavButton 
            active={view === AppView.CHAT} 
            onClick={() => setView(AppView.CHAT)} 
            icon="💬" 
            label="Chat" 
        />
        <NavButton 
            active={view === AppView.JOURNAL} 
            onClick={() => setView(AppView.JOURNAL)} 
            icon="📓" 
            label="Log" 
        />
        <NavButton 
            active={view === AppView.PROFILE} 
            onClick={() => setView(AppView.PROFILE)} 
            icon="🧬" 
            label="Core" 
        />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 ${active ? '-translate-y-2' : 'opacity-50 hover:opacity-80'}`}
    >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${active ? 'bg-neon-purple text-white shadow-[0_0_15px_#b026ff]' : 'bg-transparent text-gray-400'}`}>
            {icon}
        </div>
        {active && <span className="text-[10px] font-bold mt-1 text-white animate-pulse">{label}</span>}
    </button>
);

export default App;