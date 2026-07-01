// ============================================================
// UNAUTHORIZED PAGE (403)
// ============================================================

import { Link, useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Lock Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl font-black text-twitter-white mb-4">403</h1>
        <h2 className="text-2xl font-bold text-twitter-white mb-3">Access denied</h2>
        <p className="text-twitter-text mb-8 leading-relaxed">
          You don't have permission to view this page. This area is restricted to administrators only.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={() => navigate(-1)} className="btn-outline">
            Go back
          </button>
          <Link to="/" className="btn-blue">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
