"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitMentorReviewAction } from "@/lib/actions/reviews";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

type ProjectReviewProps = {
  submission: any;
  student: any;
};

export function ProjectReviewClient({ submission, student }: ProjectReviewProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("studentId", student.id);
    formData.append("projectSubmissionId", submission.id);
    formData.append("chapterId", submission.projects.chapters.id);

    try {
      const res = await submitMentorReviewAction(formData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/mentor/dashboard");
          router.refresh();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-emerald-50 text-emerald-800 p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 border border-emerald-200">
        <CheckCircle className="w-12 h-12 text-emerald-500" />
        <h2 className="text-xl font-bold">Review Submitted!</h2>
        <p>The student's skill history has been securely updated.</p>
        <p className="text-sm">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* View Submission Panel */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <div className="mb-4">
            <span className="text-sm font-semibold text-emerald-600 tracking-wider">PROJECT SUBMISSION</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">{submission.projects.chapters.name}</h2>
            <p className="text-slate-500 text-sm mt-1">Submitted by {student.email} on {new Date(submission.submitted_at).toLocaleString()}</p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="text-sm text-slate-400 uppercase tracking-widest font-bold">Student's Work</h4>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mt-2 text-slate-700 whitespace-pre-wrap">
              {submission.content_text || "No text content provided."}
            </div>

            {submission.media_urls && submission.media_urls.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm text-slate-400 uppercase tracking-widest font-bold">Attached Media</h4>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {submission.media_urls.map((url: string, idx: number) => (
                    <li key={idx}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Attachment {idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Form Panel */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 border-b pb-2">Evaluate & Score</h3>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 mb-6 text-sm">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">Rubric Scoring (0-10)</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Concept Clarity</label>
                <input type="number" name="conceptScore" min="0" max="10" required className="block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Critical Thinking</label>
                <input type="number" name="thinkingScore" min="0" max="10" required className="block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Application</label>
                <input type="number" name="applicationScore" min="0" max="10" required className="block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expression</label>
                <input type="number" name="expressionScore" min="0" max="10" required className="block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mentor Feedback (Required)</label>
            <textarea 
              name="feedbackText" 
              rows={4} 
              required
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border"
              placeholder="Provide constructive feedback explaining the scores and areas for improvement..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Final Decision</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border p-3 rounded-lg flex-1 hover:bg-slate-100 transition">
                <input type="radio" name="statusDecision" value="APPROVED" required className="text-emerald-600 focus:ring-emerald-500" />
                <span className="font-medium text-emerald-800">Approve & Unlock Next Chapter</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border p-3 rounded-lg flex-1 hover:bg-slate-100 transition">
                <input type="radio" name="statusDecision" value="NEEDS_REVISION" required className="text-amber-600 focus:ring-amber-500" />
                <span className="font-medium text-amber-800">Request Revision</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing Review...</>
            ) : (
              "Submit Official Evaluation"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
