// ============================================================
// NOT FOUND PAGE (404)
// ============================================================

import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* X Logo */}
        <div className="mb-8 flex justify-center">
          <svg className="w-16 h-16 text-twitter-text" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
          </svg>
        </div>

        <h1 className="text-8xl font-black text-twitter-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-twitter-white mb-3">This page doesn't exist</h2>
        <p className="text-twitter-text mb-8 leading-relaxed">
          The link you followed may be broken, or the page may have been removed.
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

export default NotFound;
