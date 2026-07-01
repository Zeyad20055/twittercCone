// ============================================================
// USER CARD COMPONENT
// Used in: Admin UsersManagement (mobile view), Profile pages
// ============================================================

import Avatar from '../ui/Avatar';
import { formatDate } from '../../utils/helpers';

const UserCard = ({ user, onDelete, showActions = false }) => {
  const userId = user._id || user.id;

  return (
    <div className="flex items-center justify-between p-4 border-b border-twitter-border hover:bg-twitter-hover transition-colors">
      <div className="flex items-center gap-3">
        <Avatar name={user.name || user.username} src={user.profileImage} size="md" />
        <div>
          <p className="font-bold text-twitter-white">{user.name || user.username}</p>
          <p className="text-twitter-text text-sm">
            @{user.username || user.email?.split('@')[0]}
          </p>
          {user.email && (
            <p className="text-twitter-text text-xs truncate max-w-[180px]">{user.email}</p>
          )}
          {user.createdAt && (
            <p className="text-twitter-text text-xs">Joined {formatDate(user.createdAt)}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.role === 'admin'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-twitter-blue/20 text-twitter-blue'
        }`}>
          {user.role || 'user'}
        </span>

        {showActions && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(userId)}
            className="p-2 text-twitter-text hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
            title="Delete user"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
