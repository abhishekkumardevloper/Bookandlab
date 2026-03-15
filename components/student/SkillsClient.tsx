"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Award, TrendingUp, Zap, Star, LayoutDashboard } from "lucide-react";

export function SkillsClient({ data }: { data: any }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60, damping: 15 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Navigation */}
      <motion.div variants={itemVariants}>
        <Link 
          href="/student/dashboard" 
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </motion.div>

      {/* Header section focusing on identity & tags, not just numbers */}
      <motion.header 
        variants={itemVariants}
        className="bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl flex flex-col md:flex-row gap-8 justify-between items-center relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"
        />
        
        <div className="z-10 text-center md:text-left space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Your Learner Profile</h1>
          <p className="text-xl text-slate-300 font-medium">See how your mind is growing with every challenge.</p>
        </div>

        <div className="z-10 flex flex-wrap justify-center gap-4">
          {(data.userTags?.length ?? 0) > 0 ? (data.userTags || []).map((ut: any, idx: number) => (
            <motion.div 
              whileHover={{ y: -5, scale: 1.05 }}
              key={idx} 
              className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/20 shadow-xl"
            >
              <Star className="w-8 h-8 text-yellow-400 mb-2 fill-yellow-400 drop-shadow-md" />
              <span className="text-white font-black tracking-widest uppercase text-sm">{ut.tags.name}</span>
              <span className="text-indigo-200 font-bold text-xs mt-1 bg-indigo-500/20 px-2 py-0.5 rounded">Tier {ut.tags.tier}</span>
            </motion.div>
          )) : (
            <div className="flex flex-col items-center bg-white/5 border border-dashed border-white/20 rounded-[1.5rem] p-6">
              <span className="text-slate-400 font-medium text-sm">Tags unlock as you grow</span>
            </div>
          )}
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Visual Graphs */}
        <motion.section variants={itemVariants} className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-indigo-500 w-6 h-6" />
            Skill Spectrum
          </h2>
          
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-lg shadow-slate-200/50 border border-slate-100">
            <div className="space-y-8">
              {data.skillProfiles.map((skill: any, idx: number) => (
                <div key={skill.id} className="space-y-3 group">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-extrabold text-slate-800 tracking-wider uppercase text-sm group-hover:text-indigo-600 transition-colors">{skill.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{skill.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-indigo-600 drop-shadow-sm">{skill.cumulative}</span>
                      <span className="text-[10px] font-bold text-slate-400 ml-1 block uppercase tracking-widest">Total Points</span>
                    </div>
                  </div>
                  
                  <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((skill.cumulative / 1000) * 100, 100)}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 + (idx * 0.1) }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
                    />
                  </div>
                  {/* Growth trend indicator */}
                  {skill.trend > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + (idx * 0.1) }}
                      className="text-xs font-bold text-emerald-500 flex items-center justify-end gap-1 uppercase tracking-wider"
                    >
                      <TrendingUp className="w-3 h-3" />
                      Gaining momentum
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Right Column: Strengths & Intelligence Suggestions */}
        <motion.div variants={itemVariants} className="space-y-8">
          
          {/* Superpowers */}
          <motion.section 
            whileHover={{ y: -4 }}
            className="bg-amber-50 rounded-[2rem] p-8 border border-amber-200 shadow-lg shadow-amber-100/50 relative overflow-hidden"
          >
            <motion.div 
               animate={{ rotate: [-5, 5, -5] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-4 -right-4"
            >
              <Zap className="w-32 h-32 text-amber-200 opacity-40 drop-shadow-xl" />
            </motion.div>
            
            <h2 className="text-2xl font-extrabold text-amber-900 mb-6 relative z-10 flex items-center gap-2">
               Your Superpowers
            </h2>
            
            <div className="space-y-4 relative z-10">
              {data.strengths.length > 0 ? data.strengths.map((s: any) => (
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  key={s.id} 
                  className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100 hover:shadow-md hover:border-amber-300 transition-all"
                >
                  <span className="block font-black text-amber-500 uppercase tracking-widest text-[10px] mb-1">Focus Area</span>
                  <span className="font-extrabold text-slate-800 text-lg tracking-tight">{s.name}</span>
                </motion.div>
              )) : (
                <p className="text-amber-800/70 text-sm font-medium">Keep analyzing challenges to discover your strengths.</p>
              )}
            </div>
          </motion.section>

          {/* AI Suggestions (Rule based phase 3) */}
          <motion.section 
             whileHover={{ y: -4 }}
             className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-lg shadow-slate-200/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-[40px] opacity-60"></div>
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
              <LayoutDashboard className="text-indigo-500 w-6 h-6" />
              Recommended Focus
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-5 border border-indigo-100 mb-6 relative z-10 shadow-sm">
              <p className="text-indigo-950 text-sm font-medium leading-relaxed">
                {data.potentialAreas.length > 0 
                  ? `Your foundation is strong in ${data.strengths[0]?.name || 'some areas'}, but diving into more projects could boost your ${data.potentialAreas[0]?.name} skills. Want to try a new creative project?`
                  : "Complete a few chapter steps to see personalized growth suggestions here!"}
              </p>
            </div>
            <Link href="/student/dashboard" className="w-full block text-center py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-1 relative z-10">
              Back to Chapters
            </Link>
          </motion.section>
        </motion.div>

      </div>
    </motion.div>
  );
}
