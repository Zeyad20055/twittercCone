// ============================================================
// TWEET DETAILS PAGE
// ============================================================

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tweetService from '../../services/tweetService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Avatar from '../../components/ui/Avatar';
import { formatDate } from '../../utils/helpers';

const TweetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [tweet, setTweet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        // BACKEND NOTE: Replace with GET /tweets/:id when that endpoint is available.
        // Currently fetches all tweets and finds by id.
        const data = await tweetService.getAllTweets();
        const tweets = data.tweets || data || [];
        const found = tweets.find((t) => t._id === id || t.id === id);
        if (!found) {
          toast.error('Tweet not found');
          navigate('/');
          return;
        }
        setTweet(found);
      } catch {
        toast.error('Failed to load tweet');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTweet();
  }, [id, navigate]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await tweetService.deleteTweet(id);
      toast.success('Tweet deleted');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete tweet');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!tweet) return null;

  const tweetAuthor = tweet.author || tweet.user || {};
  const tweetId = tweet._id || tweet.id;
  const currentUserId = user?._id || user?.id;
  const authorId = tweetAuthor?._id || tweetAuthor?.id;
  const isOwner = !!(currentUserId && authorId && currentUserId === authorId);
  const canModify = isOwner || isAdmin;

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-twitter-border px-4 py-3 flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-twitter-hover transition-colors"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-twitter-white">Post</h1>
      </div>

      {/* Tweet Content */}
      <div className="p-4 border-b border-twitter-border">
        {/* Author */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            name={tweetAuthor.name || tweetAuthor.username}
            src={tweetAuthor.profileImage}
            size="lg"
          />
          <div>
            <p className="font-bold text-twitter-white">
              {tweetAuthor.name || tweetAuthor.username || 'Unknown User'}
            </p>
            <p className="text-twitter-text text-sm">
              @{tweetAuthor.username || tweetAuthor.email?.split('@')[0] || 'unknown'}
            </p>
          </div>
        </div>

        {/* Content */}
        <p className="text-twitter-white text-xl leading-relaxed whitespace-pre-wrap mb-4">
          {tweet.content}
        </p>

        {/* Date */}
        <p className="text-twitter-text text-sm border-t border-twitter-border pt-4">
          {tweet.createdAt ? formatDate(tweet.createdAt) : '—'}
        </p>

        {/* Actions */}
        {canModify && (
          <div className="flex gap-3 pt-4 border-t border-twitter-border mt-4">
            {isOwner && (
              <button
                type="button"
                onClick={() => navigate(`/tweets/edit/${tweetId}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-twitter-border hover:bg-twitter-hover text-twitter-white text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 hover:bg-red-500/10 text-red-400 text-sm transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TweetDetails;
