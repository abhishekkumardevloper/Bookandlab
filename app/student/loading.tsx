export default function StudentLoading() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="border-b border-slate-200 pb-6">
        <div className="h-10 w-64 bg-slate-200 rounded-lg" />
        <div className="h-5 w-96 bg-slate-100 rounded-lg mt-3" />
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="w-10 h-10 bg-slate-100 rounded-full mb-3" />
            <div className="h-7 w-16 bg-slate-200 rounded-lg mb-2" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
      {/* Content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-64" />
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-64" />
      </div>
    </div>
  );
}
