// ============================================================
// TWEET CARD COMPONENT
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import ConfirmDialog from '../ui/ConfirmDialog';
import { formatRelativeTime } from '../../utils/helpers';

const TweetCard = ({ tweet, onDelete, showActions = true }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // BACKEND NOTE: Adjust field names based on your response shape
  // author field may be: tweet.author | tweet.user | tweet.userId (populated)
  const tweetAuthor = tweet.author || tweet.user || {};
  const tweetId = tweet._id || tweet.id;

  const currentUserId = user?._id || user?.id;
  const authorId = tweetAuthor?._id || tweetAuthor?.id;
  const isOwner = !!(currentUserId && authorId && currentUserId === authorId);
  const canModify = isOwner || isAdmin;

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(tweetId);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    if (tweetId) navigate(`/tweets/${tweetId}`);
  };

  return (
    <>
      <div className="tweet-card" onClick={handleCardClick} role="article">
        <div className="flex gap-3">
          <Avatar
            name={tweetAuthor.name || tweetAuthor.username}
            src={tweetAuthor.profileImage}
            size="md"
          />

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-bold text-twitter-white truncate">
                {tweetAuthor.name || tweetAuthor.username || 'Unknown User'}
              </span>
              <span className="text-twitter-text text-sm truncate">
                @{tweetAuthor.username || tweetAuthor.email?.split('@')[0] || 'unknown'}
              </span>
              <span className="text-twitter-text text-sm">·</span>
              <span className="text-twitter-text text-sm shrink-0">
                {tweet.createdAt ? formatRelativeTime(tweet.createdAt) : ''}
              </span>
            </div>

            {/* Content */}
            <p className="text-twitter-white leading-relaxed whitespace-pre-wrap break-words">
              {tweet.content}
            </p>

            {/* Action Buttons */}
            {showActions && canModify && (
              <div className="flex gap-3 mt-3">
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => navigate(`/tweets/edit/${tweetId}`)}
                    className="flex items-center gap-1 text-twitter-text hover:text-twitter-blue text-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center gap-1 text-twitter-text hover:text-red-400 text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete tweet?"
        message="This can't be undone and it will be removed from your profile and the timeline."
        isLoading={isDeleting}
      />
    </>
  );
};

export default TweetCard;
