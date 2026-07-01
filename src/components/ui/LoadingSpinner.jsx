// ============================================================
// LOADING SPINNER COMPONENT
// ============================================================

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-2 border-twitter-border border-t-twitter-blue rounded-full animate-spin`}
      />
    </div>
  );
};

export default LoadingSpinner;
