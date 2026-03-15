"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Honest, Academic Pricing
          </h2>
          <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Experience the entire digital environment. No hidden fees. No microtransactions. Just pure learning access.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          
          {/* 1. Free Trial */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all flex flex-col h-full relative"
          >
            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">Discovery</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">Free</span>
              <span className="text-slate-500 font-medium ml-2">/ 7 Days</span>
            </div>
            <p className="text-slate-500 mb-8 border-b border-slate-100 pb-8 flex-1 font-medium leading-relaxed">
              Perfect for exploring the platform interface and trying out your first few project modules.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                 <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> Access first 3 Chapters
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                 <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> basic Mentor Feedback
              </li>
              <li className="flex items-center gap-3 text-slate-400 font-medium">
                 <XCircle className="w-5 h-5 text-slate-300 shrink-0" /> No Certification
              </li>
            </ul>
            <Link 
              href="/handler/sign-up" 
              className="w-full py-4 text-center font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Start Free Trial
            </Link>
          </motion.div>

          {/* 2. Monthly Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-[2rem] p-8 border border-indigo-100 shadow-lg shadow-indigo-100/50 flex flex-col h-full relative z-0"
          >
            <h3 className="text-sm font-bold text-indigo-600 mb-4 uppercase tracking-widest">Flexible</h3>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">₹999</span>
              <span className="text-slate-500 font-medium">/ mo</span>
            </div>
            <p className="text-slate-600 mb-8 border-b border-slate-100 pb-8 flex-1 font-medium leading-relaxed">
              Full access on a month-by-month basis. Cancel anytime. Great for focused short-term learning.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                 <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> Full Curriculum Access
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                 <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> Unlimited Projects
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                 <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" /> Priority Support
              </li>
            </ul>
            <Link 
              href="/handler/sign-up?plan=monthly" 
              className="w-full py-4 text-center font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors"
            >
              Subscribe Monthly
            </Link>
          </motion.div>

          {/* 3. Yearly Plan (Hero) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="bg-[#1E2A5A] rounded-[2rem] p-10 border border-[#1E2A5A] shadow-2xl relative transform lg:-translate-y-6 flex flex-col h-full z-10 overflow-hidden"
          >
            {/* Best Value Badge */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-1.5 rounded-b-xl text-xs font-bold tracking-widest shadow-lg">
              BEST VALUE
            </div>
            
            <h3 className="text-sm font-bold text-indigo-300 mb-4 uppercase tracking-widest pt-4">Academic Year</h3>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-white tracking-tight">₹9,999</span>
              <span className="text-indigo-200 font-medium">/ yr</span>
            </div>
            <p className="text-indigo-100/80 mb-8 border-b border-indigo-800/50 pb-8 flex-1 font-medium leading-relaxed">
              The complete experience. Full access for the entire academic cycle with exclusive mentor privileges.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-white font-medium">
                 <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> <span className="text-white">Everything in Monthly</span>
              </li>
              <li className="flex items-center gap-3 text-white font-medium">
                 <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> <span className="text-white">Priority Mentor Reviews</span>
              </li>
              <li className="flex items-center gap-3 text-white font-medium">
                 <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> <span className="text-white">Certificate of Excellence</span>
              </li>
              <li className="flex items-center gap-3 text-white font-medium">
                 <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" /> <span className="text-white">Live Workshop Access</span>
              </li>
            </ul>
            <Link 
              href="/handler/sign-up?plan=yearly" 
              className="w-full py-4 text-center font-bold bg-white text-indigo-900 rounded-xl shadow-lg hover:bg-indigo-50 transition-colors"
            >
              Get Started Now
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
