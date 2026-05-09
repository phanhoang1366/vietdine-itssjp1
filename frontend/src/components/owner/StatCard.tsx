interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ icon, value, label, trend, trendUp }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-icon-wrapper">
          <span className="material-symbols-outlined stat-icon">{icon}</span>
        </div>
        {trend && (
          <span className={`stat-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
            {trendUp ? '↑' : '↓'}{trend}
          </span>
        )}
      </div>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}
