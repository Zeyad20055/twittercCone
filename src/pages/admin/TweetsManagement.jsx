// ============================================================
// TWEETS MANAGEMENT PAGE (Admin)
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import tweetService from '../../services/tweetService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Pagination from '../../components/ui/Pagination';
import Avatar from '../../components/ui/Avatar';
import { formatRelativeTime, truncateText } from '../../utils/helpers';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

const TweetsManagement = () => {
  const [tweets, setTweets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTweets = useCallback(async () => {
    setIsLoading(true);
    try {
      // BACKEND NOTE: GET /tweets/getAll
      const data = await tweetService.getAllTweets();
      const list = data.tweets || data || [];
      setTweets(list);
      setFiltered(list);
    } catch {
      toast.error('Failed to load tweets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFiltered(tweets);
    } else {
      const q = searchQuery.toLowerCase();
      setFiltered(
        tweets.filter(
          (t) =>
            t.content?.toLowerCase().includes(q) ||
            (t.author || t.user)?.name?.toLowerCase().includes(q) ||
            (t.author || t.user)?.username?.toLowerCase().includes(q)
        )
      );
    }
    setCurrentPage(1);
  }, [searchQuery, tweets]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      // BACKEND NOTE: DELETE /tweets/:id
      await tweetService.deleteTweet(deleteTarget._id || deleteTarget.id);
      setTweets((prev) =>
        prev.filter((t) => t._id !== deleteTarget._id && t.id !== deleteTarget.id)
      );
      toast.success('Tweet deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete tweet');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filtered.length / DEFAULT_PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * DEFAULT_PAGE_SIZE, currentPage * DEFAULT_PAGE_SIZE);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-twitter-white">Tweets Management</h1>
          <p className="text-twitter-text mt-1">{tweets.length} total tweets</p>
        </div>
        <button type="button" onClick={fetchTweets} className="btn-outline text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="admin-card mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-twitter-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by content or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 py-2 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="🐦" title="No tweets found" description="Try adjusting your search." />
      ) : (
        <div className="admin-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-twitter-border">
                  <th className="text-left px-4 py-3 text-twitter-text text-sm font-semibold">Author</th>
                  <th className="text-left px-4 py-3 text-twitter-text text-sm font-semibold">Content</th>
                  <th className="text-left px-4 py-3 text-twitter-text text-sm font-semibold hidden md:table-cell">Posted</th>
                  <th className="px-4 py-3 text-twitter-text text-sm font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((tweet) => {
                  const author = tweet.author || tweet.user || {};
                  const tweetId = tweet._id || tweet.id;
                  return (
                    <tr key={tweetId} className="border-b border-twitter-border hover:bg-twitter-hover transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={author.name || author.username} src={author.profileImage} size="sm" />
                          <span className="text-twitter-white text-sm font-medium whitespace-nowrap">
                            {author.name || author.username || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-twitter-text text-sm max-w-xs">
                          {truncateText(tweet.content, 100)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-twitter-text text-sm hidden md:table-cell whitespace-nowrap">
                        {tweet.createdAt ? formatRelativeTime(tweet.createdAt) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(tweet)}
                          className="p-2 text-twitter-text hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                          title="Delete tweet"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete tweet?"
        message={`Delete this tweet: "${truncateText(deleteTarget?.content, 60)}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TweetsManagement;
