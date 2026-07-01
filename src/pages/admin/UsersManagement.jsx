// ============================================================
// USERS MANAGEMENT PAGE (Admin)
// ============================================================

import { useEffect, useState } from 'react';
import useUsers from '../../hooks/useUsers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Pagination from '../../components/ui/Pagination';
import Avatar from '../../components/ui/Avatar';
import UserCard from '../../components/common/UserCard';
import { formatDate } from '../../utils/helpers';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

const UsersManagement = () => {
  const { users, isLoading, fetchUsers, deleteUser } = useUsers();
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    let result = [...users];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }
    if (roleFilter !== 'all') {
      result = result.filter((u) => (u.role || 'user') === roleFilter);
    }
    setFiltered(result);
    setCurrentPage(1);
  }, [searchQuery, roleFilter, users]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const userId = deleteTarget._id || deleteTarget.id;
      await deleteUser(userId);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filtered.length / DEFAULT_PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * DEFAULT_PAGE_SIZE,
    currentPage * DEFAULT_PAGE_SIZE
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-twitter-white">Users Management</h1>
          <p className="text-twitter-text mt-1">{users.length} total users</p>
        </div>
        <button type="button" onClick={fetchUsers} className="btn-outline text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="admin-card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-twitter-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, username, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 py-2 text-sm"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field py-2 text-sm w-full sm:w-40 bg-black"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="👥" title="No users found" description="Try adjusting your search or filters." />
      ) : (
        <div className="admin-card overflow-hidden p-0">
          {/* Mobile Card View */}
          <div className="md:hidden">
            {paginated.map((u) => (
              <UserCard
                key={u._id || u.id}
                user={u}
                showActions
                onDelete={() => setDeleteTarget(u)}
              />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-twitter-border">
                  <th className="text-left px-4 py-3 text-twitter-text text-sm font-semibold">User</th>
                  <th className="text-left px-4 py-3 text-twitter-text text-sm font-semibold">Email</th>
                  <th className="text-left px-4 py-3 text-twitter-text text-sm font-semibold">Role</th>
                  <th className="text-left px-4 py-3 text-twitter-text text-sm font-semibold hidden lg:table-cell">Joined</th>
                  <th className="px-4 py-3 text-twitter-text text-sm font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((u) => (
                  <tr key={u._id || u.id} className="border-b border-twitter-border hover:bg-twitter-hover transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name || u.username} src={u.profileImage} size="sm" />
                        <div>
                          <p className="font-medium text-twitter-white text-sm">{u.name || u.username}</p>
                          <p className="text-twitter-text text-xs">@{u.username || u.email?.split('@')[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-twitter-text text-sm">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.role === 'admin'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-twitter-text text-sm hidden lg:table-cell">
                      {u.createdAt ? formatDate(u.createdAt) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(u)}
                        className="p-2 text-twitter-text hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                        title="Delete user"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
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
        onConfirm={handleDeleteConfirm}
        title="Delete user?"
        message={`Are you sure you want to delete "${deleteTarget?.name || deleteTarget?.username}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UsersManagement;
