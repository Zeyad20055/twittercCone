// ============================================================
// CREATE TWEET PAGE
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import useTweets from '../../hooks/useTweets';
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

const CreateTweet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createTweet } = useTweets();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { content: '' },
  });

  const content = watch('content', '');
  const charCount = content.length;
  const remaining = MAX_LENGTH - charCount;
  const isOverLimit = remaining < 0;
  const isNearLimit = remaining <= 20;

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // BACKEND NOTE: POST /tweets
      await createTweet({ content: data.content });
      navigate('/');
    } catch {
      // Error toast handled inside useTweets.createTweet
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-xl font-bold text-twitter-white">Create Tweet</h1>
      </div>

      {/* Compose Area */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <div className="flex gap-3">
          <Avatar name={user?.name || user?.username} src={user?.profileImage} size="md" />

          <div className="flex-1">
            <textarea
              {...register('content')}
              placeholder="What's happening?"
              rows={5}
              className="w-full bg-transparent text-twitter-white text-xl placeholder-twitter-text resize-none focus:outline-none leading-relaxed"
              autoFocus
            />

            {errors.content && (
              <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>
            )}

            <div className="border-t border-twitter-border my-4" />

            {/* Actions Row */}
            <div className="flex items-center justify-between">
              {/* Character Counter */}
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      stroke="currentColor"
                      className="text-twitter-border"
                      strokeWidth="3"
                      fill="none"
                      cx="18" cy="18" r="15.9"
                    />
                    <circle
                      stroke="currentColor"
                      className={isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-twitter-blue'}
                      strokeWidth="3"
                      fill="none"
                      cx="18" cy="18" r="15.9"
                      strokeDasharray={`${Math.min((charCount / MAX_LENGTH) * 100, 100)} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                {isNearLimit && (
                  <span className={`text-sm font-medium ${isOverLimit ? 'text-red-400' : 'text-yellow-400'}`}>
                    {remaining}
                  </span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || isOverLimit || charCount === 0}
                className="btn-blue px-6"
              >
                {isLoading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTweet;
