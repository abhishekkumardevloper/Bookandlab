import { getDbUser } from "@/lib/auth/user";
import { getStudentDashboardData } from "@/lib/services/student";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SubjectsPage() {
  const user = await getDbUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  // We can re-use the dashboard data service to get the formatted subjects with progress
  const data = await getStudentDashboardData(user.id);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-indigo-600" />
          All Subjects
        </h1>
        <p className="text-lg text-slate-500 mt-2">
          Select a subject to view its full curriculum and your progress.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.subjects.length > 0 ? (
          data.subjects.map((subject: any, idx: number) => (
            <Link href={`/student/subjects/${subject.id}`} key={subject.id} className="block group h-full">
              <div 
                className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col h-full relative overflow-hidden"
              >
                {/* Subtle top border highlight on hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                    {subject.name}
                  </h3>
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">
                    Class {subject.class_level}
                  </span>
                </div>
                
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">
                  {subject.description || "Explore this subject's comprehensive curriculum."}
                </p>

                <div className="space-y-3 mt-auto pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm text-slate-500 font-bold uppercase tracking-wider">
                    <span>Progress</span>
                    <span>{subject.completedChapters} / {subject.totalChapters} Ch</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000"
                      style={{ width: `${subject.progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full bg-slate-50 p-8 rounded-[1.5rem] text-center border border-slate-200">
            <h3 className="text-lg font-bold text-slate-700 mb-2">No subjects available</h3>
            <p className="text-slate-500 font-medium">Please contact your administrator to assign you to a class.</p>
          </div>
        )}
      </div>
    </div>
  );
}
