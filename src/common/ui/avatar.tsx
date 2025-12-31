import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Helper function to get initials from name
const getInitials = (name: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-lg',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-2xl',
};

export const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  size = 'md', 
  className = '' 
}) => {
  const initials = getInitials(name);
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={`flex items-center justify-center rounded-full border-cyan-300 border-[0.5px] bg-cyan-100 text-cyan-500 font-semibold ${sizeClass} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
