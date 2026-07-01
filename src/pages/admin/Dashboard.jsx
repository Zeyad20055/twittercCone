// ============================================================
// ADMIN DASHBOARD PAGE
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useUsers from '../../hooks/useUsers';
import useTweets from '../../hooks/useTweets';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatRelativeTime } from '../../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const { users, fetchUsers } = useUsers();
  const { tweets, fetchAllTweets } = useTweets();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      setHasError(false);
      try {
        // BACKEND NOTE: GET /users/getUsers + GET /tweets/getAll
        await Promise.all([fetchUsers(), fetchAllTweets()]);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, [fetchUsers, fetchAllTweets]);

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const regularCount = users.filter((u) => u.role !== 'admin').length;
  const recentUsers = users.slice(0, 5);
  const recentTweets = tweets.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-400">Failed to load dashboard data.</p>
        <button type="button" onClick={() => window.location.reload()} className="btn-outline text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-twitter-white">Dashboard</h1>
        <p className="text-twitter-text mt-1">Welcome back, {user?.name || user?.username} 👋</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={users.length}
          color="blue"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          title="Total Tweets"
          value={tweets.length}
          color="purple"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
        />
        <StatCard
          title="Admins"
          value={adminCount}
          color="yellow"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
        <StatCard
          title="Regular Users"
          value={regularCount}
          color="green"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-twitter-white">Recent Users</h2>
            <Link to="/admin/users" className="text-twitter-blue text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-twitter-text text-sm">No users yet</p>
            ) : (
              recentUsers.map((u) => (
                <div key={u._id || u.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-twitter-blue/20 flex items-center justify-center text-twitter-blue font-bold text-sm shrink-0">
                    {(u.name || u.username || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-twitter-white text-sm font-medium truncate">{u.name || u.username}</p>
                    <p className="text-twitter-text text-xs truncate">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    u.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {u.role || 'user'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Tweets */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-twitter-white">Recent Tweets</h2>
            <Link to="/admin/tweets" className="text-twitter-blue text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentTweets.length === 0 ? (
              <p className="text-twitter-text text-sm">No tweets yet</p>
            ) : (
              recentTweets.map((tweet) => {
                const author = tweet.author || tweet.user || {};
                return (
                  <div key={tweet._id || tweet.id} className="border-b border-twitter-border pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-twitter-white text-sm font-medium">
                        {author.name || author.username || 'Unknown'}
                      </span>
                      {tweet.createdAt && (
                        <span className="text-twitter-text text-xs">· {formatRelativeTime(tweet.createdAt)}</span>
                      )}
                    </div>
                    <p className="text-twitter-text text-sm line-clamp-2">{tweet.content}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
