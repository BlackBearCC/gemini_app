
import React from 'react';
import { RoleId } from '../types';
import { CHARACTERS, UI_ICONS } from '../constants';

interface Props {
  roleId: RoleId;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RoleAvatar: React.FC<Props> = ({ roleId, size = 'md', className = '' }) => {
  const char = CHARACTERS[roleId];
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  if (roleId === RoleId.USER) {
    return (
      <div className={`flex items-center justify-center rounded-full bg-black border-2 border-white/20 sketch-border overflow-hidden ${sizeClasses[size]} ${className}`}>
        <img src={UI_ICONS.USER_AVATAR} alt="User" className="w-full h-full object-cover" />
      </div>
    );
  }

  if (!char) return null;

  return (
    <div className={`flex items-center justify-center rounded-full bg-black border-2 ${char.color.split(' ')[1]} ${sizeClasses[size]} ${className} relative overflow-hidden`}>
        {char.generatedAvatar ? (
          <img 
            src={char.generatedAvatar} 
            alt={char.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="text-white opacity-50 font-bold uppercase text-[10px]">
            {char.mbti.slice(0, 2)}
          </div>
        )}
    </div>
  );
};

export default RoleAvatar;
