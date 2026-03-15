import { requireRole } from "@/lib/rbac/roles";
import { getChapterOverview } from "@/lib/services/chapter";
import { ChapterEngineClient } from "@/components/student/ChapterEngineClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ chapterId: string }>;
};

export default async function ChapterEnginePage({ params }: PageProps) {
  const { chapterId } = await params;
  const user = await requireRole(["STUDENT"]);
  
  // This automatically calculates locks by reading previous step status rules safely.
  const data = await getChapterOverview(chapterId, user.id);
  
  if (!data || !data.chapter) {
    redirect("/student/dashboard");
  }

  const { chapter, steps, project, projectSubmission, reflection, reflectionSubmission } = data;
  const subjectRecord = Array.isArray(chapter.subjects) ? chapter.subjects[0] : chapter.subjects;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-indigo-200 pb-4">
        <Link href={`/student/subjects/${subjectRecord?.id}`} className="p-2 hover:bg-indigo-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-indigo-700" />
        </Link>
        <div>
          <h1 className="text-xl font-medium text-slate-500">{subjectRecord?.name}</h1>
          <p className="text-3xl font-bold text-slate-900 mt-1">{chapter.name}</p>
        </div>
      </div>

      <ChapterEngineClient 
        chapter={chapter}
        initialSteps={steps}
        studentId={user.id}
        project={project}
        projectSubmission={projectSubmission}
        reflection={reflection}
        reflectionSubmission={reflectionSubmission}
      />
    </div>
  );
}
