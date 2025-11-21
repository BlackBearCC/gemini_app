import React from 'react';
import { RoleId } from '../types';
import { CHARACTERS } from '../constants';

interface Props {
  roleId: RoleId;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RoleAvatar: React.FC<Props> = ({ roleId, size = 'md', className = '' }) => {
  const char = CHARACTERS[roleId];
  
  // Sizes
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-16 h-16 text-3xl'
  };

  // If it's the user
  if (roleId === RoleId.USER) {
    return (
      <div className={`flex items-center justify-center rounded-full bg-gray-700 text-white border border-gray-600 ${sizeClasses[size]} ${className}`}>
        👤
      </div>
    );
  }

  if (!char) return null;

  return (
    <div className={`flex items-center justify-center rounded-full bg-gray-900 border-2 ${char.color.split(' ')[1]} ${sizeClasses[size]} ${className} relative overflow-hidden`}>
        {/* Glow effect behind */}
        <div className={`absolute inset-0 opacity-20 ${char.color.split(' ')[0].replace('text', 'bg')}`}></div>
        <span className="relative z-10">{char.avatar}</span>
    </div>
  );
};

export default RoleAvatar;