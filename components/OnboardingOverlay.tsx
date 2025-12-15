import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const OnboardingOverlay: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "系统上线",
      icon: "👁️",
      desc: "欢迎来到 MIND_0。你正在进入一个模拟你认知功能的赛博空间。"
    },
    {
      title: "脑内群聊",
      icon: "🗣️",
      desc: "8个不同的人格居住于此。从'杠精'到'Emo怪'，他们会针对你的话题在群里即时互动、互怼。"
    },
    {
      title: "记忆核心",
      icon: "📓",
      desc: "在日志中记录你的碎片。系统会自动整理成线性记忆，人格们也会在评论区留言。"
    },
    {
      title: "灵魂画像",
      icon: "🧬",
      desc: "你的每一次互动都会重塑画像。点赞你认同的发言，训练算法以精准识别你的MBTI倾向。"
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
                {step === steps.length - 1 ? "启动系统" : "下一步 >>"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay;