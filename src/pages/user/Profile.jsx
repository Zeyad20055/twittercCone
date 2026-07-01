// ============================================================
// PROFILE PAGE
// ============================================================

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useTweets from '../../hooks/useTweets';
import TweetCard from '../../components/common/TweetCard';
import Avatar from '../../components/ui/Avatar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/helpers';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { tweets, isLoading, fetchMyTweets, deleteTweet } = useTweets();

  useEffect(() => {
    // BACKEND NOTE: GET /tweets — fetches current user tweets
    fetchMyTweets();
  }, [fetchMyTweets]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-twitter-border px-4 py-3 flex items-center gap-4">
        <button type="button" onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-twitter-hover transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-twitter-white">{user?.name || user?.username}</h1>
          <p className="text-xs text-twitter-text">{tweets.length} posts</p>
        </div>
      </div>

      {/* Cover */}
      <div className="h-32 bg-gradient-to-r from-twitter-blue via-blue-600 to-purple-600" />

      {/* Profile Info */}
      <div className="px-4 pb-4 border-b border-twitter-border">
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="border-4 border-black rounded-full">
            <Avatar name={user?.name || user?.username} src={user?.profileImage} size="2xl" />
          </div>
          <div className="flex gap-2 mt-10">
            <Link to="/profile/edit" className="btn-outline text-sm">
              Edit profile
            </Link>
            <button type="button" onClick={handleLogout} className="btn-outline text-sm text-red-400 border-red-500/30 hover:bg-red-500/10">
              Sign out
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-twitter-white">{user?.name || user?.username}</h2>
        <p className="text-twitter-text">@{user?.username || user?.email?.split('@')[0]}</p>

        {user?.bio && (
          <p className="text-twitter-white mt-3 leading-relaxed">{user.bio}</p>
        )}

        <div className="flex gap-4 mt-3 text-sm text-twitter-text">
          {user?.createdAt && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Joined {formatDate(user.createdAt)}
            </span>
          )}
          {user?.role === 'admin' && (
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
              Admin
            </span>
          )}
        </div>

        {/* Quick Links */}
        <div className="flex gap-3 mt-4">
          <Link to="/profile/edit" className="text-twitter-text hover:text-twitter-blue text-sm transition-colors">
            Edit Profile
          </Link>
          <span className="text-twitter-border">·</span>
          <Link to="/change-password" className="text-twitter-text hover:text-twitter-blue text-sm transition-colors">
            Change Password
          </Link>
          {user?.role === 'admin' && (
            <>
              <span className="text-twitter-border">·</span>
              <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
                Admin Panel
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Tweets */}
      <div>
        <div className="px-4 py-3 border-b border-twitter-border">
          <span className="font-bold text-twitter-white">Posts</span>
        </div>

        {isLoading ? (
          <div className="py-12"><LoadingSpinner size="lg" /></div>
        ) : tweets.length === 0 ? (
          <EmptyState
            icon="✍️"
            title="No posts yet"
            description="When you post, it'll show up here."
            action={
              <Link to="/tweets/create" className="btn-blue">
                Post your first tweet
              </Link>
            }
          />
        ) : (
          tweets.map((tweet) => (
            <TweetCard
              key={tweet._id || tweet.id}
              tweet={tweet}
              onDelete={deleteTweet}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
