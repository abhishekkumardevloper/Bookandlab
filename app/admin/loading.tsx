export default function AdminLoading() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="border-b border-slate-200 pb-6">
        <div className="h-10 w-52 bg-slate-200 rounded-lg" />
        <div className="h-5 w-72 bg-slate-100 rounded-lg mt-3" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-center">
            <div className="w-10 h-10 bg-slate-100 rounded-full mx-auto mb-2" />
            <div className="h-7 w-10 bg-slate-200 rounded mx-auto mb-1" />
            <div className="h-3 w-16 bg-slate-100 rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-72" />
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-72" />
      </div>
    </div>
  );
}
