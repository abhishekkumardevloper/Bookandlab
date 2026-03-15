"use client";

import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram, Linkedin, Send, ArrowRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b1120] pt-24 pb-12 border-t border-slate-900 relative overflow-hidden">
      
      {/* Background Decor (Subtle Glows) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-900/10 rounded-full blur-[128px]"></div>
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px] opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
           
           {/* 1. Brand Section (Col Span 4) */}
           <div className="lg:col-span-4 space-y-6">
             <Link href="/" className="flex items-center gap-3 group w-fit">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/50 group-hover:bg-indigo-500 transition-colors">
                 <BookOpen className="w-6 h-6 text-white" />
               </div>
               <span className="text-2xl font-extrabold text-white tracking-tight">BookandLab<span className="text-indigo-500">.</span></span>
             </Link>
             <p className="text-slate-400 text-base leading-relaxed font-medium max-w-sm">
               The anti-cramming digital school. We engineer genuine cognitive development through project-based learning and human mentorship.
             </p>
             
             {/* Socials */}
             <div className="flex items-center gap-4 pt-2">
                {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-900/20 transition-all">
                    <Icon size={18} />
                  </a>
                ))}
             </div>
           </div>
           
           {/* 2. Navigation Links (Col Span 2) */}
           <div className="lg:col-span-2 lg:pl-8">
             <h4 className="text-white font-bold tracking-wider uppercase mb-6 text-xs">Platform</h4>
             <ul className="space-y-4">
               {['How it Works', 'Learning Model', 'Pricing & Plans', 'For Schools'].map((item) => (
                 <li key={item}>
                   <Link href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium flex items-center gap-2 group">
                     <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300"><ArrowRight size={10} /></span>
                     {item}
                   </Link>
                 </li>
               ))}
             </ul>
           </div>

           {/* 3. Legal Links (Col Span 2) */}
           <div className="lg:col-span-2">
             <h4 className="text-white font-bold tracking-wider uppercase mb-6 text-xs">Support</h4>
             <ul className="space-y-4">
               {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact Support'].map((item) => (
                 <li key={item}>
                   <Link href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium flex items-center gap-2 group">
                      <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300"><ArrowRight size={10} /></span>
                      {item}
                   </Link>
                 </li>
               ))}
             </ul>
           </div>

           {/* 4. Newsletter / Updates (Col Span 4) */}
           <div className="lg:col-span-4">
             <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-white font-bold mb-2">Stay in the loop</h4>
                  <p className="text-slate-400 text-sm mb-4">Get the latest curriculum updates and study tips.</p>
                  
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="bg-slate-950 border border-slate-800 text-white text-sm rounded-lg px-4 py-2.5 w-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                    />
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2.5 transition-colors">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
             </div>
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-medium">
            &copy; {currentYear} BookandLab Systems Pvt Ltd. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/20 border border-emerald-800/50">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">Aligned with NEP 2020</span>
             </div>
             <div className="w-px h-4 bg-slate-800 hidden md:block"></div>
             <div className="text-slate-500 text-sm font-bold flex items-center gap-1">
                Made in <span className="text-orange-500">India</span> 🇮🇳
             </div>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
