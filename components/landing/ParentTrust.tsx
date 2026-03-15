"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Target, HeartHandshake, Quote, Star, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    border: "border-indigo-400/20",
    title: "Safe Digital Environment",
    desc: "A walled garden. No ads, no external links, and no social media feeds. Just pure learning."
  },
  {
    icon: Target,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/20",
    title: "Focus-First Interface",
    desc: "Designed to reduce cognitive load. The UI fades away so students focus entirely on the concept."
  },
  {
    icon: HeartHandshake,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
    title: "Human Mentorship",
    desc: "We don't rely solely on AI. Real teachers review projects to ensure emotional and academic growth."
  }
];

export function ParentTrust() {
  return (
    <section className="py-24 bg-[#0F172A] relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* LEFT: Content & Features */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Parent Peace of Mind</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Designed for Students. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Trusted by Parents.
              </span>
            </h2>
            
            <p className="text-lg text-slate-400 leading-relaxed font-medium mb-10 max-w-xl">
              We know the internet is noisy. BookandLab is engineered to be a calm sanctuary where deep, distraction-free academic growth happens.
            </p>

            <div className="space-y-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <div className={`
                    w-12 h-12 rounded-2xl flex shrink-0 items-center justify-center 
                    ${feature.bg} ${feature.border} border shadow-lg shadow-indigo-900/20
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>


          {/* RIGHT: Testimonial Card */}
          <div className="relative">
            {/* Decorative blob behind card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-[2.5rem] rotate-3 opacity-20 blur-xl transform scale-95"></div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-black/20 overflow-hidden"
            >
              {/* Giant Quote Mark */}
              <Quote className="absolute top-8 right-8 w-24 h-24 text-indigo-50 opacity-20 rotate-12" />

              <div className="relative z-10">
                {/* Star Rating */}
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <blockquote className="text-2xl font-bold text-slate-900 leading-relaxed mb-8">
                  "The structure is incredible. Instead of just passively watching videos, my child is <span className="text-indigo-600 bg-indigo-50 px-1 rounded">building projects</span> and defending their reasoning. It feels like a real private school, purely digital."
                </blockquote>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    S
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      Sarah Jenkins
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Parent
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 font-medium">Mother of 8th Grader</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
