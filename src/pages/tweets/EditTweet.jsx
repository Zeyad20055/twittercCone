// ============================================================
// EDIT TWEET PAGE
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import tweetService from '../../services/tweetService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Avatar from '../../components/ui/Avatar';
import { TWEET_MAX_LENGTH } from '../../utils/constants';

const MAX_LENGTH = TWEET_MAX_LENGTH;

const schema = yup.object({
  content: yup
    .string()
    .min(1, 'Tweet cannot be empty')
    .max(MAX_LENGTH, `Tweet cannot exceed ${MAX_LENGTH} characters`)
    .required('Tweet content is required'),
});

const EditTweet = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tweet, setTweet] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const content = watch('content', '');
  const charCount = content.length;
  const remaining = MAX_LENGTH - charCount;
  const isOverLimit = remaining < 0;

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        // BACKEND NOTE: Replace with GET /tweets/:id when available.
        // Currently fetches current user's tweets and finds by id.
        const data = await tweetService.getMyTweets();
        const tweets = data.tweets || data || [];
        const found = tweets.find((t) => t._id === id || t.id === id);

        if (!found) {
          toast.error('Tweet not found or you do not have permission to edit it');
          navigate('/profile');
          return;
        }

        setTweet(found);
        reset({ content: found.content });
      } catch {
        toast.error('Failed to load tweet');
        navigate('/profile');
      } finally {
        setIsFetching(false);
      }
    };

    fetchTweet();
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // BACKEND NOTE: PATCH /tweets/:id
      await tweetService.updateTweet(id, { content: data.content });
      toast.success('Tweet updated!');
      navigate('/profile');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update tweet';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!tweet) return null;

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
        <h1 className="text-xl font-bold text-twitter-white">Edit Tweet</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <div className="flex gap-3">
          <Avatar name={user?.name || user?.username} src={user?.profileImage} size="md" />
          <div className="flex-1">
            <textarea
              {...register('content')}
              rows={5}
              className="w-full bg-transparent text-twitter-white text-xl placeholder-twitter-text resize-none focus:outline-none leading-relaxed"
              autoFocus
            />

            {errors.content && (
              <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>
            )}

            <div className="border-t border-twitter-border my-4" />

            <div className="flex items-center justify-between">
              <span className={`text-sm ${isOverLimit ? 'text-red-400' : 'text-twitter-text'}`}>
                {remaining} characters remaining
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={() => navigate(-1)} className="btn-outline">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isOverLimit || charCount === 0}
                  className="btn-blue"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTweet;
