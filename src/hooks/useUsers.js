// ============================================================
// USE USERS HOOK - Admin User Management
// ============================================================

import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import userService from '../services/userService';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      const list = data.users || data || [];
      setUsers(list);
      return list;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load users';
      setError(message);
      toast.error(message);
      throw err; // re-throw so callers (e.g. Dashboard) can react
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id) => {
    try {
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id && u.id !== id));
      toast.success('User deleted');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete user';
      toast.error(message);
      throw err;
    }
  }, []);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    deleteUser,
  };
};

export default useUsers;
