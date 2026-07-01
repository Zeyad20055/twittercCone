// ============================================================
// USE TWEETS HOOK - Tweet State Management
// ============================================================

import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import tweetService from '../services/tweetService';

const useTweets = () => {
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Normalise response: backend may return { tweets: [...] } or [...] directly
  const normalizeTweets = (data) => data.tweets || data || [];

  const fetchMyTweets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tweetService.getMyTweets();
      setTweets(normalizeTweets(data));
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load tweets';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllTweets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tweetService.getAllTweets();
      setTweets(normalizeTweets(data));
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load tweets';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTweet = useCallback(async (tweetData) => {
    try {
      const data = await tweetService.createTweet(tweetData);
      const newTweet = data.tweet || data;
      setTweets((prev) => [newTweet, ...prev]);
      toast.success('Tweet posted!');
      return newTweet;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to post tweet';
      toast.error(message);
      throw err;
    }
  }, []);

  const updateTweet = useCallback(async (id, tweetData) => {
    try {
      const data = await tweetService.updateTweet(id, tweetData);
      const updated = data.tweet || data;
      setTweets((prev) =>
        prev.map((t) => (t._id === id || t.id === id ? { ...t, ...updated } : t))
      );
      toast.success('Tweet updated!');
      return updated;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update tweet';
      toast.error(message);
      throw err;
    }
  }, []);

  const deleteTweet = useCallback(async (id) => {
    try {
      await tweetService.deleteTweet(id);
      setTweets((prev) => prev.filter((t) => t._id !== id && t.id !== id));
      toast.success('Tweet deleted');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete tweet';
      toast.error(message);
      throw err;
    }
  }, []);

  return {
    tweets,
    isLoading,
    error,
    fetchMyTweets,
    fetchAllTweets,
    createTweet,
    updateTweet,
    deleteTweet,
  };
};

export default useTweets;
