// ============================================================
// STAT CARD COMPONENT - للـ Admin Dashboard
// ============================================================

const StatCard = ({ title, value, icon, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'bg-twitter-blue/20 text-twitter-blue',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-4">
        <span className="text-twitter-text text-sm font-medium">{title}</span>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-twitter-white">{value}</span>
        {trend && (
          <span className={`text-sm mb-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
