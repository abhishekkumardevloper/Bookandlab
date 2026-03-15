import { GraduationCap, Library, Users } from "lucide-react";

export function Audience() {
  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1E2A5A] mb-6 tracking-tight">
            Who Is BookandLab For?
          </h2>
          <p className="text-lg text-indigo-800 font-bold bg-indigo-50 inline-block px-5 py-2.5 rounded-xl border border-indigo-100 shadow-sm">
            Designed to support school learning, not replace it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Classes */}
           <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow group hover:border-indigo-100">
             <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
               <GraduationCap className="w-8 h-8 text-indigo-700" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-800 transition-colors">Middle & High School</h3>
             <div className="flex flex-wrap justify-center gap-2">
                {['6', '7', '8', '9', '10'].map(cls => (
                  <span key={cls} className="px-3 py-1 bg-white border border-slate-200 rounded-md text-sm font-bold text-slate-700 shadow-sm">
                    Class {cls}
                  </span>
                ))}
             </div>
           </div>

           {/* Curriculum */}
           <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow group hover:border-teal-100">
             <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 border border-teal-100 group-hover:bg-teal-100 transition-colors">
               <Library className="w-8 h-8 text-teal-700" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-teal-800 transition-colors">Aligned Curriculum</h3>
             <ul className="text-slate-600 space-y-2">
                <li className="font-bold text-lg text-slate-800">CBSE & ICSE</li>
                <li className="font-medium">State Boards</li>
                <li className="text-sm font-medium opacity-80 mt-4">(Aligned with NEP 2020)</li>
             </ul>
           </div>

           {/* Parents */}
           <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow group hover:border-amber-100">
             <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 border border-amber-100 group-hover:bg-amber-100 transition-colors">
               <Users className="w-8 h-8 text-amber-600" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-amber-700 transition-colors">Partnering with Parents</h3>
             <p className="text-slate-600 max-w-[200px] font-medium leading-relaxed">
               Peace of mind knowing your child is developing real skills, not just scrolling through videos.
             </p>
           </div>
        </div>
      </div>
    </section>
  );
}
