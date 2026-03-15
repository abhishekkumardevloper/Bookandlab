"use client";

import { motion } from "framer-motion";
import { 
  LogIn, 
  PlayCircle, 
  Code2, 
  Send, 
  TrendingUp, 
  CheckCircle2,
  Clock,
  MoreHorizontal
} from "lucide-react";

const schedule = [
  { 
    time: "09:00 AM", 
    title: "Morning Sync", 
    desc: "Login. Dashboard check. View daily targets.",
    icon: LogIn,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  { 
    time: "09:15 AM", 
    title: "Concept Deep Dive", 
    desc: "Interactive lesson. Not just watching, but answering checkpoints.",
    icon: PlayCircle,
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  { 
    time: "10:00 AM", 
    title: "Builder Mode", 
    desc: "The core work. Writing code or solving complex equations.",
    icon: Code2,
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  { 
    time: "11:30 AM", 
    title: "Submission & Reflect", 
    desc: "Submit project + 100-word reflection on challenges faced.",
    icon: Send,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  { 
    time: "02:00 PM", 
    title: "Mentor Loop", 
    desc: "Receive personalized feedback on your submission.",
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-50"
  }
];

export function StudentJourney() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: The Narrative Timeline */}
          <div className="flex flex-col">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                A Day in the Life.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                  Real Work. Real Growth.
                </span>
              </h2>
              <p className="text-lg text-slate-600 font-medium max-w-lg">
                We replaced passive playlists with a structured daily ritual. Here is exactly what happens when a student logs in.
              </p>
            </motion.div>

            <div className="relative pl-8 border-l-2 border-indigo-100 space-y-10">
              {schedule.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${item.bg.replace("50", "500")}`}></div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 group cursor-default">
                    {/* Time Badge */}
                    <div className="shrink-0 w-24 pt-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.time}
                      </span>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-indigo-100 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${item.bg}`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: The Active UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block h-full min-h-[600px]"
          >
            {/* Abstract Background Blobs */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

            {/* The Main "App" Container */}
            <div className="absolute inset-4 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col">
              
              {/* App Header */}
              <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50/50">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">BookandLab Student Portal</div>
                <MoreHorizontal className="text-slate-300 w-5 h-5" />
              </div>

              {/* App Body */}
              <div className="flex-1 p-6 bg-[#F8F9FB] flex flex-col gap-6">
                
                {/* 1. Task Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Project: Logic Gates</h3>
                    <p className="text-sm text-slate-500">Unit 4 • Computer Science</p>
                  </div>
                  <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                    In Progress
                  </div>
                </div>

                {/* 2. Split Workspace */}
                <div className="flex-1 flex gap-4">
                  {/* Left: Instructions */}
                  <div className="w-1/3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                      <div className="h-2 w-full bg-slate-100 rounded"></div>
                      <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
                      <div className="h-20 w-full bg-slate-50 rounded mt-4 border border-dashed border-slate-200"></div>
                    </div>
                  </div>

                  {/* Right: Code/Builder Area */}
                  <div className="flex-1 bg-[#1e293b] rounded-xl shadow-inner p-4 font-mono text-xs text-slate-300 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-8 bg-[#0f172a] flex items-center px-4 text-slate-500 gap-4 border-b border-slate-700">
                      <span>index.js</span>
                      <span>style.css</span>
                    </div>
                    <div className="mt-8 space-y-2 opacity-80">
                      <p><span className="text-pink-400">function</span> <span className="text-blue-400">logicGate</span>(a, b) {"{"}</p>
                      <p className="pl-4"><span className="text-purple-400">if</span> (a && b) {"{"}</p>
                      <p className="pl-8"><span className="text-amber-400">return</span> true;</p>
                      <p className="pl-4">{"}"}</p>
                      <p className="pl-4"><span className="text-amber-400">return</span> false;</p>
                      <p>{"}"}</p>
                      <div className="animate-pulse w-2 h-4 bg-blue-400 mt-2"></div>
                    </div>
                    
                    {/* Floating Success Toast */}
                    <motion.div 
                      animate={{ y: [10, 0, 10], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute bottom-4 right-4 bg-emerald-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      <span className="font-bold">Test Passed</span>
                    </motion.div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
