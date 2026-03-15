import { getDbUser } from "@/lib/auth/user";
import { MessageSquareText, FileCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentReviewsPage() {
  const user = await getDbUser();
  if (!user) redirect("/handler/sign-in");

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <MessageSquareText className="w-10 h-10 text-indigo-600" />
            Mentor Reviews
          </h1>
          <p className="text-lg text-slate-500 mt-2">
            Feedback and grading on your project and reflection submissions.
          </p>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="p-16 text-center flex flex-col items-center justify-center">
           <FileCheck className="w-16 h-16 text-slate-300 mb-4" />
           <h3 className="text-xl font-bold text-slate-700 mb-2">No reviews yet</h3>
           <p className="text-slate-500 max-w-md mx-auto mb-6">
             When your mentor reviews your projects and reflections, their detailed feedback will appear here.
           </p>
           <Link 
             href="/student/projects" 
             className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-6 py-2 rounded-full font-bold transition-colors"
           >
             View My Valid Submissions
           </Link>
        </div>
      </div>
    </div>
  );
}
