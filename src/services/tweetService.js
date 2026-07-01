// ============================================================
// TWEET SERVICE
// BACKEND NOTE: Endpoints configured per spec
// POST   /tweets          →  tweetService.createTweet(data)
// GET    /tweets          →  tweetService.getMyTweets()
// GET    /tweets/getAll   →  tweetService.getAllTweets()
// PATCH  /tweets/:id      →  tweetService.updateTweet(id, data)
// DELETE /tweets/:id      →  tweetService.deleteTweet(id)
// ============================================================

import axiosInstance from '../utils/axiosInstance';

const tweetService = {
  /**
   * Create a new tweet
   * POST /tweets
   * @param {{ content: string }} data
   * @returns {{ tweet?: object } | object}
   */
  createTweet: async (data) => {
    const response = await axiosInstance.post('/tweets', data);
    return response.data;
  },

  /**
   * Get tweets for the authenticated user
   * GET /tweets
   * @returns {{ tweets?: Array } | Array}
   */
  getMyTweets: async () => {
    const response = await axiosInstance.get('/tweets');
    return response.data;
  },

  /**
   * Get all tweets (home feed / admin view)
   * GET /tweets/getAll
   * @returns {{ tweets?: Array } | Array}
   */
  getAllTweets: async () => {
    const response = await axiosInstance.get('/tweets/getAll');
    return response.data;
  },

  /**
   * Update a tweet
   * PATCH /tweets/:id
   * @param {string} id
   * @param {{ content: string }} data
   * @returns {{ tweet?: object } | object}
   */
  updateTweet: async (id, data) => {
    const response = await axiosInstance.patch(`/tweets/${id}`, data);
    return response.data;
  },

  /**
   * Delete a tweet
   * DELETE /tweets/:id
   * @param {string} id
   */
  deleteTweet: async (id) => {
    const response = await axiosInstance.delete(`/tweets/${id}`);
    return response.data;
  },
};

export default tweetService;
