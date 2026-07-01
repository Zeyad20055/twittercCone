// ============================================================
// HOME FEED PAGE
// ============================================================

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useTweets from '../../hooks/useTweets';
import TweetCard from '../../components/common/TweetCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Avatar from '../../components/ui/Avatar';

const Home = () => {
  const { user } = useAuth();
  const { tweets, isLoading, error, fetchAllTweets, deleteTweet } = useTweets();

  useEffect(() => {
    // BACKEND NOTE: GET /tweets/getAll — fetches all tweets for feed
    fetchAllTweets();
  }, [fetchAllTweets]);

  return (
    <div>
      {/* Page Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-twitter-border px-4 py-3">
        <h1 className="text-xl font-bold text-twitter-white">Home</h1>
      </div>

      {/* Quick Compose */}
      <div className="border-b border-twitter-border p-4 flex gap-3">
        <Avatar name={user?.name || user?.username} src={user?.profileImage} size="md" />
        <Link
          to="/tweets/create"
          className="flex-1 text-twitter-text text-xl py-2 cursor-pointer hover:text-twitter-white transition-colors"
        >
          What's happening?
        </Link>
        <Link to="/tweets/create" className="btn-blue self-end">
          Post
        </Link>
      </div>

      {/* Feed */}
      {isLoading ? (
        <div className="py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button type="button" onClick={fetchAllTweets} className="btn-outline">
            Try again
          </button>
        </div>
      ) : tweets.length === 0 ? (
        <EmptyState
          icon="🐦"
          title="No tweets yet"
          description="Be the first to post something. Follow people to see their tweets here."
          action={
            <Link to="/tweets/create" className="btn-blue">
              Post your first tweet
            </Link>
          }
        />
      ) : (
        <div>
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet._id || tweet.id}
              tweet={tweet}
              onDelete={deleteTweet}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
