"use client";

import { motion, type Variants } from "framer-motion";
import { BrainCircuit, Hammer, MessageSquareDashed, TrendingUp, Compass, MonitorOff, ArrowRight } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
    title: "Zero Rote Learning",
    desc: "We banned memorization. If you can Google it, we don't test it. We focus entirely on deep cognitive processing and first-principles thinking."
  },
  {
    icon: Hammer,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
    title: "Tangible Output",
    desc: "Theory is useless without application. Every module ends with a builder project—be it a logic script, a structural model, or a case analysis."
  },
  {
    icon: MessageSquareDashed,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
    title: "Human-in-the-Loop",
    desc: "AI can't judge nuance. Our human mentors review your subjective answers and project code, providing feedback that machines cannot provide."
  },
  {
    icon: TrendingUp,
    color: "from-emerald-400 to-green-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    title: "Competency Over Grades",
    desc: "We replaced the 'Topper' system with skill trees. Track your growth in specific traits like Critical Thinking, Logic, and Communication."
  },
  {
    icon: Compass,
    color: "from-indigo-500 to-blue-600",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    title: "Linear Progression",
    desc: "You cannot drift. The interface enforces a strict sequential path, ensuring you master step A before the system unlocks step B."
  },
  {
    icon: MonitorOff,
    color: "from-slate-500 to-gray-600",
    bg: "bg-slate-50",
    text: "text-slate-600",
    title: "Deep Work Interface",
    desc: "No gamification loops. No confetti. Just a calm, distraction-free academic environment designed to foster long attention spans."
  }
];

export function WhyBookandLab() {
  // FIX: Explicitly typed as Variants to satisfy TypeScript
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // FIX: Explicitly typed as Variants
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <section id="learning-model" className="py-24 bg-slate-50 relative overflow-hidden">
      
      {/* Background radial gradient for depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white rounded-full blur-[120px] opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            Why We Are <span className="text-rose-600">Not</span> EdTech.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed"
          >
            We don't sell recorded videos or mock tests. We provide a rigorous, mentor-backed ecosystem for <span className="text-slate-900 font-bold">genuine skill architecture.</span>
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Hover Gradient Border Effect */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>

              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.text}`} strokeWidth={1.5} />
                </div>
                {/* Subtle arrow that appears on hover */}
                <ArrowRight className="w-5 h-5 text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-900 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed text-[15px] font-medium">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
