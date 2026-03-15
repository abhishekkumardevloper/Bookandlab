"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { BookOpen, TrendingUp, ChevronRight, PlayCircle, CheckCircle2, Award } from "lucide-react";

export function Hero() {
  // FIX: Explicitly type the variants so TypeScript knows "spring" is a valid animation type
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 50, damping: 20 } 
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center pt-32 pb-20 overflow-hidden bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- Background: Technical Grid & Glow --- */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        {/* Dot Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Soft Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-50/80 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* --- LEFT COLUMN: Content --- */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col text-center lg:text-left"
          >
            {/* Trust Pill */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm transition-transform hover:scale-105 cursor-default">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                </span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  New Curriculum 2026
                </span>
              </div>
            </motion.div>
            
            {/* Headline */}
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-[4.2rem] font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Learn by Doing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Grow Real Skills.
              </span>
            </motion.h1>
            
            {/* Subtext */}
            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
              Stop memorizing and start building. A structured digital school for 
              <strong> Classes 6–10 </strong> where students master concepts through 
              interactive labs and live projects.
            </motion.p>
            
            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                href="/handler/sign-up" 
                className="group relative w-full sm:w-auto px-8 py-4 text-[16px] font-bold text-white bg-indigo-600 rounded-xl overflow-hidden shadow-lg shadow-indigo-600/25 transition-all hover:shadow-indigo-600/40 hover:-translate-y-1"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-blue-600 opacity-100 group-hover:opacity-90 transition-opacity" />
                <div className="relative flex items-center justify-center gap-2">
                  Start Free Trial <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              
              <Link 
                href="#demo" 
                className="group w-full sm:w-auto px-8 py-4 text-[16px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                Watch Demo
              </Link>
            </motion.div>

            {/* Social Proof / Stats */}
            <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-slate-200 flex items-center justify-center lg:justify-start gap-8 opacity-80">
               <div className="flex items-center gap-2">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-indigo-${i * 100 + 200}`}></div>
                    ))}
                 </div>
                 <span className="text-sm font-medium text-slate-600">1k+ Students</span>
               </div>
               <div className="w-px h-8 bg-slate-300"></div>
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">CBSE Aligned</span>
               </div>
            </motion.div>
          </motion.div>
          
          {/* --- RIGHT COLUMN: 3D Layered Mockup --- */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative hidden lg:block h-[600px] w-full perspective-1000"
          >
             {/* 1. Base Layer: The Main Dashboard */}
             <div className="absolute inset-x-4 top-10 bottom-10 bg-white rounded-3xl shadow-2xl shadow-indigo-900/10 border border-slate-200 overflow-hidden z-10">
                {/* Mockup Header */}
                <div className="h-14 border-b border-slate-100 bg-slate-50/50 flex items-center px-6 gap-3">
                   <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                   </div>
                   <div className="ml-4 w-64 h-2 bg-slate-200 rounded-full opacity-50"></div>
                </div>
                {/* Mockup Body Content */}
                <div className="p-8 grid grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="col-span-1 space-y-4">
                        <div className="w-full h-8 bg-indigo-50 rounded-lg"></div>
                        <div className="w-3/4 h-3 bg-slate-100 rounded-full"></div>
                        <div className="w-1/2 h-3 bg-slate-100 rounded-full"></div>
                        <div className="w-full h-32 bg-slate-50 rounded-xl mt-8 border border-dashed border-slate-200"></div>
                    </div>
                    {/* Main Content */}
                    <div className="col-span-2 space-y-5">
                         <div className="w-full h-32 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-inner"></div>
                         <div className="flex gap-4">
                             <div className="w-1/2 h-24 bg-slate-50 rounded-xl border border-slate-100"></div>
                             <div className="w-1/2 h-24 bg-slate-50 rounded-xl border border-slate-100"></div>
                         </div>
                    </div>
                </div>
             </div>

             {/* 2. Floating Card 1: Course Progress (Top Right) */}
             <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-2 top-24 z-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 w-64"
             >
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 font-semibold">Current Lesson</div>
                        <div className="text-sm font-bold text-slate-800">Physics: Force</div>
                    </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: "75%" }} 
                        transition={{ duration: 2, delay: 1 }}
                        className="bg-amber-500 h-full rounded-full"
                    />
                </div>
             </motion.div>

             {/* 3. Floating Card 2: Skill Graph (Bottom Left) */}
             <motion.div 
                animate={{ y: [15, -15, 15] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-6 bottom-32 z-30 bg-[#1e293b] p-5 rounded-2xl shadow-2xl shadow-indigo-900/20 w-56 text-white"
             >
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold tracking-wider text-slate-400">ANALYTICS</span>
                    <TrendingUp size={16} className="text-green-400" />
                </div>
                <div className="flex items-end gap-2 h-24 justify-between">
                    {[30, 50, 40, 70, 60, 90].map((h, i) => (
                        <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: 1.5 + (i * 0.1) }}
                            className="w-1.5 bg-indigo-500 rounded-t-sm"
                        />
                    ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Weekly Growth</span>
                    <span className="text-sm font-bold text-green-400">+24%</span>
                </div>
             </motion.div>

             {/* 4. Floating Badge (Bottom Right) */}
             <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute right-8 bottom-20 z-20"
             >
                 <div className="bg-white p-3 rounded-2xl shadow-lg border border-indigo-50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Award size={20} />
                    </div>
                    <div className="pr-2">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Badge Earned</div>
                        <div className="text-sm font-bold text-indigo-900">Top Solver</div>
                    </div>
                 </div>
             </motion.div>

          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
