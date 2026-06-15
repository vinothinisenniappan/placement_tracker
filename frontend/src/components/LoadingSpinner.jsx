const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center gap-3 text-slate-500">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
    <p className="text-sm font-medium">{label}</p>
  </div>
);

export default LoadingSpinner;
