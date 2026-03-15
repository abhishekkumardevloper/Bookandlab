"use client";

import { motion } from "framer-motion";
import { BookOpen, Brain, Combine, PenTool, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Understand",
    description: "Grasp core concepts through interactive video labs.",
    icon: BookOpen,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100"
  },
  {
    id: 2,
    title: "Think",
    description: "Solve guided scenarios that challenge your logic.",
    icon: Brain,
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100"
  },
  {
    id: 3,
    title: "Build",
    description: "Apply what you learned in real-world mini projects.",
    icon: Combine,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100"
  },
  {
    id: 4,
    title: "Reflect",
    description: "Articulate your process and identify gaps.",
    icon: PenTool,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100"
  },
  {
    id: 5,
    title: "Grow",
    description: "Get mentor feedback and level up your skills.",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100"
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      
      {/* Background Decor (Subtle) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] bg-slate-50 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] -left-[5%] w-[300px] h-[300px] bg-indigo-50/50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-3 block">The Methodology</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              A Scientific Approach to <br className="hidden md:block" />
              <span className="text-indigo-600">Deep Learning</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We moved beyond "watching videos." Our 5-step active learning cycle ensures every concept is understood, applied, and retained.
            </p>
          </motion.div>
        </div>

        {/* Steps Container */}
        <div className="relative">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 z-0">
             {/* Dashed Line Base */}
             <div className="w-full h-full border-t-2 border-dashed border-slate-200"></div>
             {/* Gradient Overlay for style */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-100 to-transparent opacity-50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex flex-col items-center text-center relative"
              >
                
                {/* Step Icon Wrapper */}
                <div className={`
                    w-24 h-24 rounded-full flex items-center justify-center mb-6 
                    bg-white border-2 shadow-lg shadow-slate-100 z-10 relative
                    transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl
                    ${step.border}
                `}>
                  {/* Inner Colored Circle */}
                  <div className={`w-20 h-20 rounded-full ${step.bg} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <step.icon className={`w-9 h-9 ${step.color}`} strokeWidth={1.5} />
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-slate-900 rounded-full border-4 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                    {step.id}
                  </div>
                </div>
                
                {/* Content */}
                <div className="px-2">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Mobile Arrow (Hidden on Desktop, Visible on mobile between items) */}
                {idx !== steps.length - 1 && (
                  <div className="lg:hidden mt-8 text-slate-300">
                    <ArrowRight className="w-6 h-6 rotate-90" />
                  </div>
                )}

              </motion.div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
