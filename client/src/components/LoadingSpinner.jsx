export default function LoadingSpinner({ size = 'md', color = 'blue' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  const colors = {
    blue: 'border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400',
    white: 'border-white/20 border-t-white',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} ${colors[color] || colors.blue} rounded-full animate-spin`}
      />
    </div>
  );
}
