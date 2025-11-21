import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const OnboardingOverlay: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "SYSTEM ONLINE",
      icon: "👁️",
      desc: "Welcome to MIND_0. You are entering a simulation of your own cognitive functions."
    },
    {
      title: "THE VOICES",
      icon: "🗣️",
      desc: "8 distinct personalities live here. From Logic to Heart, they will react to your texts and debate each other."
    },
    {
      title: "MEMORY CORE",
      icon: "📓",
      desc: "Record your day in the Log. The system will analyze your mood and store it as linear memory."
    },
    {
      title: "PSYCHE MAP",
      icon: "🧬",
      desc: "Your interactions shape your profile. Like responses to train the algorithm on your true MBTI type."
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(176,38,255,0.2)]">
        {/* Background Grid/Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:14px_24px] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-4xl mb-6 shadow-lg animate-pulse">
                {steps[step].icon}
            </div>
            
            <h2 className="text-2xl font-bold text-white tracking-widest mb-4">{steps[step].title}</h2>
            
            <p className="text-gray-400 text-sm leading-relaxed h-20">
                {steps[step].desc}
            </p>

            <div className="flex gap-2 mt-8 mb-8">
                {steps.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-neon-purple' : 'w-2 bg-gray-700'}`} />
                ))}
            </div>

            <button 
                onClick={handleNext}
                className="w-full py-4 bg-white text-black font-bold text-sm tracking-widest hover:bg-gray-200 transition-colors rounded-sm"
            >
                {step === steps.length - 1 ? "INITIALIZE" : "NEXT >>"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay;