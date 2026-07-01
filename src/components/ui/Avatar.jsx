// ============================================================
// AVATAR COMPONENT
// ============================================================

import { getInitials, getAvatarColor } from '../../utils/helpers';

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const Avatar = ({ name, src, size = 'md', className = '' }) => {
  const sizeClass = sizes[size];
  const colorClass = getAvatarColor(name);
  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'User'}
        className={`${sizeClass} rounded-full object-cover border-2 border-twitter-border ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-bold text-white shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
