// ============================================================
// AUTH SERVICE
// BACKEND NOTE: Endpoints configured per spec
// POST /signup  →  authService.signup(data)
// POST /login   →  authService.login(data)
// ============================================================

import axiosInstance from '../utils/axiosInstance';

const authService = {
  /**
   * Register a new user
   * POST /signup
   * @param {{ name: string, username: string, email: string, password: string }} data
   * @returns {{ token?: string, user?: object, message?: string }}
   */
  signup: async (data) => {
    const response = await axiosInstance.post('/signup', data);
    return response.data;
  },

  /**
   * Login with email and password
   * POST /login
   * @param {{ email: string, password: string }} data
   * @returns {{ token: string, user: object }}
   */
  login: async (data) => {
    const response = await axiosInstance.post('/login', data);
    return response.data;
  },
};

export default authService;
