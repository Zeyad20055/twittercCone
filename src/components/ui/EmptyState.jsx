// ============================================================
// EMPTY STATE COMPONENT
// ============================================================

const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {icon && (
        <div className="text-twitter-text mb-4 text-6xl">{icon}</div>
      )}
      <h3 className="text-xl font-bold text-twitter-white mb-2">{title}</h3>
      {description && (
        <p className="text-twitter-text mb-6 max-w-sm">{description}</p>
      )}
      {action && action}
    </div>
  );
};

export default EmptyState;
