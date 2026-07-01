// ============================================================
// USER SERVICE
// BACKEND NOTE: Endpoints configured per spec
// PATCH  /users              →  userService.updateProfile(data)
// POST   /users/updatePassword →  userService.updatePassword(data)
// GET    /users/getUsers     →  userService.getAllUsers()      [Admin]
// DELETE /users/:id          →  userService.deleteUser(id)    [Admin]
// ============================================================

import axiosInstance from '../utils/axiosInstance';

const userService = {
  /**
   * Update current user profile
   * PATCH /users
   * @param {{ name?: string, username?: string, bio?: string }} data
   * BACKEND NOTE: If profile image upload is added, send as FormData
   */
  updateProfile: async (data) => {
    const response = await axiosInstance.patch('/users', data);
    return response.data;
  },

  /**
   * Update password
   * POST /users/updatePassword
   * @param {{ currentPassword: string, newPassword: string, confirmNewPassword: string }} data
   */
  updatePassword: async (data) => {
    const response = await axiosInstance.post('/users/updatePassword', data);
    return response.data;
  },

  /**
   * Get all users — Admin only
   * GET /users/getUsers
   * @returns {{ users: Array } | Array}
   */
  getAllUsers: async () => {
    const response = await axiosInstance.get('/users/getUsers');
    return response.data;
  },

  /**
   * Delete a user — Admin only
   * DELETE /users/:id
   * @param {string} id
   */
  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
