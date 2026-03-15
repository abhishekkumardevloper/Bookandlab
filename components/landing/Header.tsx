"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header({ user, role }: { user: any | null, role?: string | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return "/handler/sign-up";
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "MENTOR") return "/mentor/dashboard";
    return "/student/dashboard";
  };

  const navLinks = [
    { name: "Programs", href: "#programs" },
    { name: "Mentors", href: "#mentors" },
    { name: "Learning Model", href: "#learning-model" },
    { name: "Community", href: "#community" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm" 
            : "bg-white/0 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* --- 1. Professional Typographic Logo --- */}
          <Link href="/" className="group relative z-50">
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tighter leading-none group-hover:text-indigo-600 transition-colors">
                BookandLab<span className="text-indigo-600">.</span>
              </span>
            </div>
          </Link>

          {/* --- 2. Center Navigation (Desktop) --- */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="text-[15px] font-medium text-slate-600 hover:text-indigo-600 transition-colors relative group"
              >
                {link.name}
                {/* Hover underline animation */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* --- 3. Right Side: Auth Actions --- */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <Link 
                  href="/account"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
                    <User size={16} />
                  </div>
                  <span className="hidden lg:inline-block">My Account</span>
                </Link>

                <Link 
                  href={getDashboardLink()} 
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/handler/sign-in" 
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/handler/sign-up" 
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-slate-800 shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  Start Free Trial
                </Link>
              </div>
            )}
          </div>

          {/* --- 4. Mobile Menu Toggle --- */}
          <button 
            className="md:hidden relative z-50 p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.header>

      {/* --- Mobile Navigation Overlay --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-semibold text-slate-800 hover:text-indigo-600"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-4" />
              {user ? (
                <div className="flex flex-col gap-4">
                  <Link href="/account" className="text-lg font-medium text-slate-600">Account Settings</Link>
                  <Link href={getDashboardLink()} className="text-lg font-bold text-indigo-600">Go to Dashboard</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link href="/handler/sign-in" className="text-lg font-medium text-slate-600">Sign In</Link>
                  <Link href="/handler/sign-up" className="px-5 py-3 text-center text-white bg-indigo-600 rounded-lg font-semibold">Start Free Trial</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
