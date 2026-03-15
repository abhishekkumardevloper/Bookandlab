"use client";

import { useState, useEffect } from "react";
import { 
  Lock, Loader2, ChevronRight, PartyPopper, 
  Globe, Book, Triangle, Microscope, FileText, Zap, CheckCircle2, AlertCircle
} from "lucide-react";
import { completeInteractiveStep, startChapterStep, submitProject, submitReflection } from "@/app/actions/student/learning";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export function ChapterEngineClient({ 
  chapter, initialSteps, studentId, project, projectSubmission, reflection, reflectionSubmission 
}: { 
  chapter: any; initialSteps: any[]; studentId: string;
  project?: any; projectSubmission?: any; reflection?: any; reflectionSubmission?: any;
}) {
  const firstActive = initialSteps.findIndex(s => s.isUnlocked && s.derivedStatus !== 'COMPLETED');
  const [activeStepIdx, setActiveStepIdx] = useState(firstActive >= 0 ? firstActive : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
  const steps = initialSteps;
  const activeStep = steps[activeStepIdx];

  const isChapterCompleted = reflectionSubmission?.status === 'APPROVED';
  
  useEffect(() => {
    if (isChapterCompleted) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [isChapterCompleted]);

  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", project?.id);
    const contentText = formData.get("contentText") as string;
    const mediaUrl = formData.get("mediaUrl") as string;
    
    try {
      const res = await submitProject(chapter.id, project?.id, contentText, mediaUrl ? [mediaUrl] : []);
      if (res.success) {
        if (activeStepIdx < steps.length - 1) {
          setActiveStepIdx(activeStepIdx + 1);
        }
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#10b981'] // Blue & Emerald
        });
        router.refresh(); 
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReflectionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("reflectionId", reflection?.id);
    const contentText = formData.get("contentText") as string;
    
    try {
      const res = await submitReflection(chapter.id, reflection?.id, contentText);
      if (res.success) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit reflection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteInteractive = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      const res = await completeInteractiveStep(chapter.id, activeStep.step_number);
      if (res.success) {
        if (activeStepIdx < steps.length - 1) {
          setActiveStepIdx(activeStepIdx + 1);
        }
        router.refresh(); 
      }
    } catch (err: any) {
      setError(err.message || "Failed to complete step");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to map step numbers to your specific dashboard icons
  const getStepIcon = (stepNumber: number, isLocked: boolean, isCompleted: boolean) => {
    if (isLocked) return <Lock className="w-5 h-5 text-slate-300" />;
    if (isCompleted) return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    
    switch (stepNumber) {
      case 1: return <Globe className="w-5 h-5" />;
      case 2: return <Book className="w-5 h-5" />;
      case 3: return <Triangle className="w-5 h-5" />;
      case 4: return <Microscope className="w-5 h-5" />;
      case 5: return <FileText className="w-5 h-5" />;
      case 6: return <Zap className="w-5 h-5" />;
      default: return <Book className="w-5 h-5" />;
    }
  };

  const progressPercentage = Math.round((steps.filter((s: any) => s.derivedStatus === 'COMPLETED').length / steps.length) * 100) || 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] p-4 md:p-8 bg-[#fafafa]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 shrink-0 space-y-4">
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center gap-4 mb-2">
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Chapter Progress</h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-black text-slate-800">{progressPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {steps.map((step, idx) => {
            const isActive = idx === activeStepIdx;
            const isLocked = !step.isUnlocked;
            const isCompleted = step.derivedStatus === 'COMPLETED';
            
            return (
              <button
                key={step.id}
                onClick={() => !isLocked && setActiveStepIdx(idx)}
                disabled={isLocked}
                className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl transition-all relative overflow-hidden group border ${
                  isActive ? 'bg-blue-600 text-white shadow-md border-blue-600' : 
                  isLocked ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-transparent' : 
                  'bg-white text-slate-700 hover:bg-blue-50 hover:border-blue-100 border-slate-100 shadow-sm'
                }`}
              >
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? 'bg-white/20 text-white' :
                  isLocked ? 'bg-slate-100' :
                  isCompleted ? 'bg-emerald-50' :
                  'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                }`}>
                  {getStepIcon(step.step_number, isLocked, isCompleted)}
                </div>
                <div className="flex-1 truncate">
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    Step {step.step_number}
                  </div>
                  <div className="font-bold text-sm leading-tight mt-0.5">{step.type}</div>
                </div>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeStepIndicator" 
                    className="absolute inset-0 border-2 border-blue-400 rounded-2xl pointer-events-none" 
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {isChapterCompleted && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl mt-6 text-center shadow-sm">
            <PartyPopper className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Chapter Mastery Reached!</p>
          </motion.div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col relative">
        <header className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div>
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
              {activeStep.step_number < 5 ? 'Interactive Session' : activeStep.step_number === 5 ? 'Project Submission' : 'Reflection'}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-1 text-slate-900 tracking-tight">{chapter.name}</h2>
          </div>
        </header>
        
        <div className="flex-1 relative bg-slate-50/30 overflow-y-auto">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeStep.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2, ease: "easeOut" }}
               className="h-full p-6 md:p-8"
             >
                {/* Steps 1-4: Interactive Placeholder */}
                {activeStep.step_number < 5 && (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8 py-12">
                    <div className="relative">
                      <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center">
                        {getStepIcon(activeStep.step_number, false, false) !== null ? (
                           <div className="text-blue-500 w-12 h-12 [&>svg]:w-full [&>svg]:h-full">{getStepIcon(activeStep.step_number, false, false)}</div>
                        ) : null}
                      </div>
                      {activeStep.derivedStatus === 'COMPLETED' && (
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{activeStep.type}</h3>
                      <p className="text-slate-500 font-medium">
                        Concept focus: <span className="font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-sm">{activeStep.content_reference}</span>
                      </p>
                      <p className="text-sm text-slate-400 mt-6 max-w-md mx-auto bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        In the full version, this module loads rich interactive videos, MDX sheets, and simulated lab environments.
                      </p>
                    </div>
                    
                    {error && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-xl flex gap-3 items-center text-sm font-bold border border-red-100 w-full max-w-md">
                        <AlertCircle className="w-5 h-5 shrink-0"/>{error}
                      </div>
                    )}

                    <div className="w-full pt-8 flex justify-center">
                      {activeStep.derivedStatus === 'COMPLETED' ? (
                        <button 
                          onClick={() => activeStepIdx < steps.length - 1 && setActiveStepIdx(activeStepIdx + 1)}
                          className="flex items-center gap-2 px-8 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                        >
                          Continue to Next Step <ChevronRight className="w-5 h-5" />
                        </button>
                      ) : (
                        <button 
                          onClick={handleCompleteInteractive}
                          disabled={isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center gap-2 justify-center min-w-[240px]"
                        >
                          {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin"/> Processing...</> : 'Complete Step'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5: Master Project Submission */}
                {activeStep.step_number === 5 && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white border border-slate-100 p-8 rounded-[1.5rem] shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100px] -z-10 opacity-50" />
                      
                      <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                           <FileText className="w-5 h-5" />
                        </div>
                        Capstone: {project?.type || 'Application Activity'}
                      </h3>
                      <p className="text-slate-500 font-medium">{project?.instructions || 'Apply your knowledge to solve the final challenge.'}</p>
                      
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-sm text-blue-800 font-medium items-center">
                        <AlertCircle className="w-5 h-5 shrink-0 text-blue-500" />
                        Submission requires Mentor Approval to unlock subsequent chapters.
                      </div>
                    </div>
                    
                    {error && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-xl flex gap-3 items-center text-sm font-bold border border-red-100">
                        <AlertCircle className="w-5 h-5 shrink-0"/>{error}
                      </div>
                    )}

                    <div className={`bg-white border ${projectSubmission?.status === 'APPROVED' ? 'border-emerald-200 shadow-sm' : 'border-slate-100 shadow-sm'} p-8 rounded-[1.5rem]`}>
                      <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                           Your Submission
                           {projectSubmission?.status === 'PENDING' && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Awaiting Review</span>}
                           {projectSubmission?.status === 'NEEDS_REVISION' && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Revision Requested</span>}
                           {projectSubmission?.status === 'APPROVED' && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Mastered</span>}
                        </h3>
                      </div>
                      
                      <form onSubmit={handleProjectSubmit} className="space-y-5">
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-600">Documentation</label>
                           <textarea 
                             name="contentText"
                             className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white disabled:opacity-60 text-sm font-medium transition-colors outline-none" 
                             rows={6} 
                             disabled={projectSubmission?.status === 'PENDING' || projectSubmission?.status === 'APPROVED'}
                             defaultValue={projectSubmission?.content_text || ""}
                             placeholder="Document your findings, results, or process here..."
                             required
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-600">External Artifacts (Optional)</label>
                           <input 
                             type="url" 
                             name="mediaUrl"
                             disabled={projectSubmission?.status === 'PENDING' || projectSubmission?.status === 'APPROVED'}
                             defaultValue={projectSubmission?.media_urls?.[0] || ""}
                             className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white disabled:opacity-60 text-sm font-medium transition-colors outline-none"
                             placeholder="Link to artifacts (Google Drive, Figma, Portfolio, etc.)"
                           />
                        </div>

                        {projectSubmission?.status !== 'PENDING' && projectSubmission?.status !== 'APPROVED' && (
                          <div className="pt-4 flex justify-end">
                            <button 
                              type="submit" 
                              disabled={isSubmitting}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin"/> Submitting...</> : 'Submit for Review'}
                            </button>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                )}

                {/* Step 6: Reflection Submission */}
                {activeStep.step_number === 6 && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white border border-slate-100 p-8 rounded-[1.5rem] shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100px] -z-10 opacity-50" />
                      
                      <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                           <Zap className="w-5 h-5" />
                        </div>
                        Chapter Reflection
                      </h3>
                      <p className="text-slate-600 font-medium text-lg italic border-l-4 border-purple-200 pl-4 py-1 mt-6">
                        "{reflection?.prompt || 'What was your biggest breakthrough in this chapter?'}"
                      </p>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-xl flex gap-3 items-center text-sm font-bold border border-red-100">
                        <AlertCircle className="w-5 h-5 shrink-0"/>{error}
                      </div>
                    )}

                    <div className="bg-white border border-slate-100 p-8 rounded-[1.5rem] shadow-sm">
                      <form onSubmit={handleReflectionSubmit} className="space-y-5">
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-600">Your Thoughts</label>
                           <textarea 
                             name="contentText"
                             className="w-full p-5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-slate-50 focus:bg-white disabled:opacity-60 text-base font-medium transition-colors outline-none" 
                             rows={6} 
                             disabled={reflectionSubmission?.status === 'PENDING' || reflectionSubmission?.status === 'APPROVED'}
                             defaultValue={reflectionSubmission?.content_text || ""}
                             placeholder="Write your thoughtful reflection here..."
                             required
                           />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                          <p className="text-xs text-slate-400 font-medium">
                            Finalizing this will lock the chapter as completed.
                          </p>
                          
                          {reflectionSubmission?.status !== 'PENDING' && reflectionSubmission?.status !== 'APPROVED' && (
                            <button 
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Finish Journey'}
                            </button>
                          )}
                        </div>
                        
                        {/* Status Indicators */}
                        {reflectionSubmission?.status === 'PENDING' && (
                          <div className="flex items-center gap-2 mt-4 text-orange-600 bg-orange-50 px-4 py-3 rounded-xl border border-orange-100 text-sm font-bold">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Awaiting Mentor Validation
                          </div>
                        )}
                        {reflectionSubmission?.status === 'APPROVED' && (
                          <div className="flex items-center gap-2 mt-4 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 text-sm font-bold">
                            <CheckCircle2 className="w-5 h-5" />
                            Chapter Fully Mastered
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                )}
             </motion.div>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
