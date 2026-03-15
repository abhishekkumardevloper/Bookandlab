"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BarChart3, CheckSquare, FileText, Zap, 
  Microscope, Triangle, Book, Globe, 
  ChevronRight, Calendar as CalendarIcon, 
  CheckCircle2, Clock, AlertCircle, TrendingUp
} from "lucide-react";

export function DashboardClient({ user, data }: { user?: any, data?: any }) {
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

  // Fallback data if none provided
  const studentName = user?.name || "Aryan";

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 md:space-y-8 bg-[#fafafa] min-h-screen"
    >
      {/* 1. Dashboard Header */}
      <motion.header variants={itemVariants} className="flex flex-col gap-1.5 md:gap-2">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Good morning, <span className="text-blue-600">{studentName}</span> 👋
        </h1>
        <p className="text-sm md:text-base text-slate-500 font-medium">
          Here's your learning overview for this week — you're on a great streak!
        </p>
      </motion.header>
      
      {/* 2. Overview Stats */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Learning Progress */}
        <div className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all border border-slate-200/60 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-[100px] -z-10 opacity-60 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Learning Progress</h3>
          <div className="text-3xl md:text-4xl font-black text-slate-800 mb-2 tracking-tight">68<span className="text-xl text-slate-400">%</span></div>
          <div className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg w-fit mt-auto">
            <TrendingUp className="w-3 h-3 mr-1" /> +12% this week
          </div>
        </div>

        {/* Chapters Completed */}
        <div className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all border border-slate-200/60 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-[100px] -z-10 opacity-60 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h3 className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Chapters Completed</h3>
          <div className="text-3xl md:text-4xl font-black text-slate-800 mb-2 tracking-tight">34<span className="text-xl text-slate-300 font-medium">/50</span></div>
          <div className="text-xs font-semibold text-slate-400 mt-auto flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> 16 remaining
          </div>
        </div>

        {/* Projects Submitted */}
        <div className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all border border-slate-200/60 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-[100px] -z-10 opacity-60 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-4 shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Projects Submitted</h3>
          <div className="text-3xl md:text-4xl font-black text-slate-800 mb-2 tracking-tight">7<span className="text-xl text-slate-300 font-medium">/10</span></div>
          <div className="inline-flex items-center text-xs font-bold text-orange-700 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg w-fit mt-auto">
            <AlertCircle className="w-3 h-3 mr-1" /> 2 pending review
          </div>
        </div>

        {/* Skill Growth Score */}
        <div className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all border border-slate-200/60 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-50 to-transparent rounded-bl-[100px] -z-10 opacity-60 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-4 shadow-sm">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Skill Growth Score</h3>
          <div className="text-3xl md:text-4xl font-black text-slate-800 mb-2 tracking-tight">82<span className="text-xl text-slate-300 font-medium">/100</span></div>
          <div className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg w-fit mt-auto">
            <TrendingUp className="w-3 h-3 mr-1" /> +6 pts this week
          </div>
        </div>
      </motion.section>

      {/* 3. Activity & Calendar */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Learning Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm border border-slate-200/60 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <h2 className="text-lg md:text-xl font-bold text-slate-800">Learning Activity</h2>
            <span className="text-sm text-slate-500 font-semibold bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">March 2025</span>
          </div>
          <div className="flex items-center gap-4 mb-6 md:mb-8 text-xs md:text-sm font-semibold text-slate-500">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-600 shadow-sm shadow-blue-200"></div> Study hours</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div> Target</div>
          </div>
          {/* Chart Graphic */}
          <div className="h-40 md:h-48 w-full flex items-end justify-between px-1 md:px-8 border-b border-slate-200 pb-2 relative mt-auto">
             <div className="w-6 md:w-12 bg-blue-50/80 border border-blue-100 h-[60%] rounded-t-md relative hover:bg-blue-100 transition-colors group"><div className="absolute bottom-0 w-full bg-blue-600 h-[40%] rounded-t-md shadow-sm group-hover:bg-blue-500 transition-colors"></div></div>
             <div className="w-6 md:w-12 bg-blue-50/80 border border-blue-100 h-[80%] rounded-t-md relative hover:bg-blue-100 transition-colors group"><div className="absolute bottom-0 w-full bg-blue-600 h-[70%] rounded-t-md shadow-sm group-hover:bg-blue-500 transition-colors"></div></div>
             <div className="w-6 md:w-12 bg-blue-50/80 border border-blue-100 h-[50%] rounded-t-md relative hover:bg-blue-100 transition-colors group"><div className="absolute bottom-0 w-full bg-blue-600 h-[80%] rounded-t-md shadow-sm group-hover:bg-blue-500 transition-colors"></div></div>
             <div className="w-6 md:w-12 bg-blue-50/80 border border-blue-100 h-[90%] rounded-t-md relative hover:bg-blue-100 transition-colors group"><div className="absolute bottom-0 w-full bg-blue-600 h-[60%] rounded-t-md shadow-sm group-hover:bg-blue-500 transition-colors"></div></div>
             <div className="w-6 md:w-12 bg-blue-50/80 border border-blue-100 h-[40%] rounded-t-md relative hover:bg-blue-100 transition-colors group"><div className="absolute bottom-0 w-full bg-blue-600 h-[30%] rounded-t-md shadow-sm group-hover:bg-blue-500 transition-colors"></div></div>
             <div className="w-6 md:w-12 bg-blue-50/80 border border-blue-100 h-[70%] rounded-t-md relative hover:bg-blue-100 transition-colors group"><div className="absolute bottom-0 w-full bg-blue-600 h-[90%] rounded-t-md shadow-sm group-hover:bg-blue-500 transition-colors"></div></div>
             <div className="w-6 md:w-12 bg-slate-50 h-[60%] rounded-t-md relative border border-slate-200 border-dashed"></div>
          </div>
          <div className="flex justify-between px-1 md:px-8 mt-3 md:mt-4 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm border border-slate-200/60">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-800">March 2025</h2>
            <div className="flex gap-1.5 text-slate-400">
              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><ChevronRight className="w-4 h-4 rotate-180" /></button>
              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-4 uppercase">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-1.5 md:gap-2 text-center text-sm font-semibold text-slate-700">
            <div className="text-slate-300 py-1.5">25</div><div className="text-slate-300 py-1.5">26</div><div className="text-slate-300 py-1.5">27</div><div className="text-slate-300 py-1.5">28</div><div className="text-slate-300 py-1.5">1</div><div className="py-1.5 bg-blue-50 text-blue-700 rounded-lg">2</div><div className="py-1.5 bg-blue-50 text-blue-700 rounded-lg">3</div>
            <div className="py-1.5 bg-blue-50 text-blue-700 rounded-lg">4</div><div className="py-1.5 bg-blue-50 text-blue-700 rounded-lg">5</div><div className="py-1.5 bg-blue-50 text-blue-700 rounded-lg">6</div><div className="py-1.5 bg-orange-50 border border-orange-100 text-orange-700 rounded-lg">7</div><div className="py-1.5 bg-blue-50 text-blue-700 rounded-lg">8</div><div className="py-1.5 bg-blue-50 text-blue-700 rounded-lg">9</div><div className="py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">10</div>
            <div className="py-1.5 bg-blue-50 text-blue-700 rounded-lg">11</div><div className="py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg">12</div><div className="py-1.5 bg-blue-50 text-blue-700 rounded-lg">13</div><div className="py-1.5 bg-blue-50 text-blue-700 rounded-lg">14</div><div className="py-1.5 bg-orange-50 border border-orange-100 text-orange-700 rounded-lg">15</div><div className="py-1.5 bg-blue-50 text-blue-700 rounded-lg">16</div><div className="py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">17</div>
            <div className="py-1.5 bg-blue-50 text-blue-700 rounded-lg">18</div><div className="py-1.5 bg-blue-50 text-blue-700 rounded-lg">19</div><div className="py-1.5 bg-blue-600 text-white rounded-lg shadow-md shadow-blue-200 ring-2 ring-blue-600 ring-offset-2">20</div><div className="py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">21</div><div className="py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">22</div><div className="py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">23</div><div className="py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">24</div>
            <div className="py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">25</div><div className="py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">26</div><div className="py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">27</div><div className="py-1.5 bg-orange-50 border border-orange-100 text-orange-700 rounded-lg">28</div><div className="py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">29</div><div className="py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">30</div><div className="py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">31</div>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-6 text-[11px] font-bold text-slate-500 justify-center">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Today</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-100 border border-blue-300"></div> Study</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-100 border border-orange-300"></div> Project</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-100 border border-emerald-300"></div> Review</span>
          </div>
        </div>
      </motion.section>

      {/* 4. Continue Learning */}
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Continue Learning</h2>
          <Link href="/subjects" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
            View all <span className="hidden sm:inline">subjects</span> <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Subject Cards */}
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-200/60 flex flex-col group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <Microscope className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg">Science</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Ch. 7 — Motion & Forces</p>
            <div className="mt-auto space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Progress</span><span className="text-blue-600">72%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-blue-600 rounded-full w-[72%] shadow-sm"></div>
              </div>
              <button className="w-full py-2.5 rounded-xl border border-blue-100 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors flex justify-center items-center gap-1.5">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-200/60 flex flex-col group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
              <Triangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg">Mathematics</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Ch. 5 — Quadratic Equations</p>
            <div className="mt-auto space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Progress</span><span className="text-orange-600">58%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-orange-500 rounded-full w-[58%] shadow-sm"></div>
              </div>
              <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-1.5">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-200/60 flex flex-col group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
              <Book className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg">English</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Ch. 4 — Poetry Analysis</p>
            <div className="mt-auto space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Progress</span><span className="text-emerald-600">89%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-emerald-500 rounded-full w-[89%] shadow-sm"></div>
              </div>
              <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-1.5">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-200/60 flex flex-col group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-4 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg">Social Science</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Ch. 6 — Democracy & Rights</p>
            <div className="mt-auto space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Progress</span><span className="text-purple-600">45%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-purple-500 rounded-full w-[45%] shadow-sm"></div>
              </div>
              <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-1.5">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </motion.section>

      {/* 5. Lower Dashboard Grid */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Mentor Feedback */}
        <div className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm border border-slate-200/60 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Mentor Feedback</h2>
            <Link href="/feedback" className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">View all</Link>
          </div>
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-slate-800 text-sm">Forces & Motion Project</h4>
                <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">⭐ 9/10</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed italic mb-3">
                "Excellent application of Newton's laws. Your diagrams were clear and your analysis was thorough."
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700 shadow-sm">SR</div>
                  <span className="text-xs font-semibold text-slate-500">Dr. S. Rajan</span>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:underline">View full &rarr;</button>
              </div>
            </div>
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-slate-800 text-sm">Algebra Reflection</h4>
                <span className="inline-flex items-center text-xs font-bold text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md">⭐ 7/10</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed italic mb-3">
                "Good effort, but work on showing intermediate steps in solutions for clarity."
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shadow-sm">PK</div>
                  <span className="text-xs font-semibold text-slate-500">Prof. P. Kumar</span>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:underline">View full &rarr;</button>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Development */}
        <div className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm border border-slate-200/60 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Skill Development</h2>
            <Link href="/skills" className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Details</Link>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-orange-500"/> Concept Clarity</span>
                <span className="text-slate-800">88%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-[88%] shadow-sm"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                <span className="flex items-center gap-2"><Triangle className="w-4 h-4 text-purple-500"/> Critical Thinking</span>
                <span className="text-slate-800">75%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[75%] shadow-sm"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                <span className="flex items-center gap-2"><Microscope className="w-4 h-4 text-emerald-500"/> Application Skill</span>
                <span className="text-slate-800">82%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full w-[82%] shadow-sm"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500"/> Communication</span>
                <span className="text-slate-800">91%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[91%] shadow-sm"></div>
              </div>
            </div>
          </div>
          <div className="mt-auto pt-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-blue-900 text-sm shadow-sm">
              <div className="font-extrabold mb-1 flex items-center justify-between">
                Overall Score: 84/100
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-blue-700 flex items-center gap-1.5 text-xs font-semibold mt-1">
                Top 15% of your cohort this week <Zap className="w-3.5 h-3.5 text-orange-400 fill-orange-400"/>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm border border-slate-200/60 flex flex-col md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Today's Tasks</h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">3/5 done</span>
          </div>
          <div className="space-y-4">
            
            <div className="flex items-start gap-3 group">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-400 text-sm line-through decoration-slate-300">Read Ch. 7 - Section A</h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">Done</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">Science • 9:30 AM</p>
              </div>
            </div>

            <div className="flex items-start gap-3 group">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-400 text-sm line-through decoration-slate-300">Complete Algebra Set</h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">Done</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">Mathematics • 11:00 AM</p>
              </div>
            </div>

            <div className="flex items-start gap-3 group">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-400 text-sm line-through decoration-slate-300">Poetry Reflection Entry</h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">Done</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">English • 1:15 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3 group cursor-pointer">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-orange-500 mt-0.5 shrink-0 transition-colors bg-slate-50"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-orange-600 transition-colors">Submit Democracy Project</h4>
                  <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded uppercase tracking-wider">Pending</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">Social Science • Due 6:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3 group cursor-pointer">
              <div className="w-5 h-5 rounded-full border-2 border-red-300 group-hover:border-red-500 mt-0.5 shrink-0 transition-colors bg-red-50"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-red-600 transition-colors">Review Mentor Feedback</h4>
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Urgent</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">Forces & Motion • Action needed</p>
              </div>
            </div>

          </div>
        </div>

      </motion.section>

      {/* 6. Learning Path Tracker - Built for secure horizontal scrolling */}
      <motion.section variants={itemVariants} className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm border border-slate-200/60">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
            <h2 className="text-lg font-bold text-slate-800 flex flex-wrap items-center gap-2">
              Learning Path Tracker <span className="text-slate-500 text-sm font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-100">Science Ch. 7</span>
            </h2>
            <Link href="/path" className="text-xs font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap bg-blue-50 px-3 py-1.5 rounded-lg transition-colors w-fit">View full map</Link>
         </div>

         {/* Scrollable Container Wrapper */}
         <div className="w-full overflow-x-auto pb-4 -mx-2 px-2 md:mx-0 md:px-0 custom-scrollbar">
           {/* Inner container enforcing minimum width so layout doesn't break on small screens */}
           <div className="relative flex items-center justify-between min-w-[800px] px-8 py-4">
              
              {/* Background Track Line */}
              <div className="absolute top-1/2 left-12 right-12 h-1.5 bg-slate-100 rounded-full -translate-y-1/2 z-0"></div>
              {/* Active Track Line */}
              <div className="absolute top-1/2 left-12 w-[45%] h-1.5 bg-emerald-500 rounded-full -translate-y-1/2 z-0 shadow-sm shadow-emerald-200"></div>
              
              {/* Nodes */}
              <div className="relative z-10 flex flex-col items-center gap-3 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white shadow-md group-hover:scale-110 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-extrabold text-slate-800">Context</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 mt-1">Done</div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-3 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white shadow-md group-hover:scale-110 transition-transform">
                  <Book className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-extrabold text-slate-800">Concept</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 mt-1">Done</div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-3 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white shadow-md group-hover:scale-110 transition-transform">
                  <Triangle className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-extrabold text-slate-800">Thinking</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 mt-1">Done</div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-3 group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white shadow-lg ring-4 ring-blue-50 group-hover:scale-105 transition-transform">
                  <Microscope className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-black text-blue-700">Deep Learning</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-blue-600 mt-1">In Progress</div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-3 opacity-60">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center border-4 border-white shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-slate-500">Project</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">Locked</div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-3 opacity-60">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center border-4 border-white shadow-sm">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-slate-500">Reflection</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">Locked</div>
                </div>
              </div>

           </div>
         </div>
      </motion.section>

    </motion.div>
  );
}
