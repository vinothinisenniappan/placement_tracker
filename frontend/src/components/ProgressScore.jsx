const ProgressScore = ({ readinessScore, codingProgress, sqlProgress, appProgress, goals }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
    <div className="mb-6 flex items-end justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">Placement Readiness Score</p>
        <p className="mt-1 text-4xl font-bold text-slate-900">
          {readinessScore}
          <span className="text-lg font-semibold text-slate-400">/100</span>
        </p>
      </div>
      <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        Weighted formula
      </div>
    </div>

    <div className="space-y-4">
      <ProgressBar
        label={`Coding (${goals?.coding || 100} goal)`}
        value={codingProgress}
        color="bg-primary"
      />
      <ProgressBar
        label={`SQL Completed (${goals?.sql || 50} goal)`}
        value={sqlProgress}
        color="bg-secondary"
      />
      <ProgressBar
        label={`Applications (${goals?.applications || 20} goal)`}
        value={appProgress}
        color="bg-emerald-500"
      />
    </div>

    <p className="mt-4 text-xs leading-relaxed text-slate-500">
      Score = (Coding % × 0.4) + (SQL % × 0.3) + (Applications % × 0.3)
    </p>
  </div>
);

const ProgressBar = ({ label, value, color }) => (
  <div>
    <div className="mb-1 flex justify-between text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <span className="font-semibold text-slate-900">{value}%</span>
    </div>
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default ProgressScore;
