import { requireRole } from "@/lib/rbac/roles";
import { getSubjectCurriculum } from "@/lib/services/subject";
import SubjectCurriculumClient from "@/components/student/SubjectCurriculumClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ subjectId: string }>;
};

export default async function SubjectCurriculumPage({ params }: PageProps) {
  // 1. Await the params object before destructuring its properties
  const { subjectId } = await params;

  // 2. Proceed with your existing server-side logic
  const user = await requireRole(["STUDENT"]);
  
  const curriculumData = await getSubjectCurriculum(subjectId, user.id);
  
  if (!curriculumData) {
    redirect("/student/dashboard");
  }

  // Determine if this is a senior class (assuming Class 11 and 12 are senior).
  // Note: Adjust the `>= 11` logic if your application defines "senior" differently!
  const classLevel = parseInt(String(curriculumData.subject.class_level), 10);
  const isSeniorSubject = !isNaN(classLevel) && classLevel >= 11;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-indigo-200 pb-4">
        <Link href="/student/dashboard" className="p-2 hover:bg-indigo-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-indigo-700" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{curriculumData.subject.name}</h1>
          <p className="text-slate-600 mt-1">Class {curriculumData.subject.class_level}</p>
        </div>
      </div>

      <SubjectCurriculumClient 
        subject={curriculumData.subject}
        curriculum={curriculumData.curriculum}
        flatChapters={curriculumData.flatChapters}
        isSenior={isSeniorSubject}
      />
    </div>
  );
}
