const MetricCard = ({ title, value, subtitle, accent = 'primary' }) => {
  const accentClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition hover:shadow-card-hover">
      <div className={`mb-3 inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${accentClasses[accent]}`}>
        {title}
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
};

export default MetricCard;
