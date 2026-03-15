export default function MentorLoading() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-pulse">
      <div className="border-b border-slate-200 pb-6">
        <div className="h-10 w-56 bg-slate-200 rounded-lg" />
        <div className="h-5 w-80 bg-slate-100 rounded-lg mt-3" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="w-11 h-11 bg-slate-100 rounded-full mb-3" />
            <div className="h-7 w-12 bg-slate-200 rounded-lg mb-2" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 h-80" />
    </div>
  );
}
