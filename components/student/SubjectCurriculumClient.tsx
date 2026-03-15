"use client"

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, Lock, PlayCircle, Filter } from 'lucide-react';
import type { ChapterView, UnitView } from '@/lib/services/subject';
import { motion, AnimatePresence } from 'framer-motion';

type SortMode = 'NCERT' | 'PHASE_WISE' | 'SKILL_BASED' | 'CREATIVE';

export default function SubjectCurriculumClient({
  subject,
  isSenior,
  curriculum,
  flatChapters
}: {
  subject: any;
  isSenior: boolean;
  curriculum: UnitView[] | ChapterView[];
  flatChapters: ChapterView[];
}) {
  const [sortMode, setSortMode] = useState<SortMode>('NCERT');

  // Logic to reorder display based on pedagogical filters (doesn't alter true records)
  const getSortedChapters = () => {
    let sortedList = [...flatChapters];

    switch (sortMode) {
      case 'NCERT':
        sortedList.sort((a, b) => a.sequence_order - b.sequence_order);
        break;
      case 'PHASE_WISE':
        // Mock phase sorting: completed first, then in-progress, then locked
        sortedList.sort((a, b) => {
          const rank: Record<string, number> = { 'COMPLETED': 1, 'IN_PROGRESS': 2, 'LOCKED': 3 };
          return rank[a.status] - rank[b.status];
        });
        break;
      case 'SKILL_BASED':
      case 'CREATIVE':
        // Reverse sequence as a placeholder for real intelligent sorting later
        sortedList.sort((a, b) => b.sequence_order - a.sequence_order);
        break;
    }

    return sortedList;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Filters (Animated Toggles) */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm"
      >
        <div className="text-sm font-bold text-slate-500 px-3 flex items-center gap-2 tracking-wider uppercase">
          <Filter className="w-4 h-4" />
          Learning Path:
        </div>
        {(['NCERT', 'PHASE_WISE', 'SKILL_BASED', 'CREATIVE'] as SortMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setSortMode(mode)}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              sortMode === mode 
                ? 'text-white shadow-md' 
                : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            {sortMode === mode && (
              <motion.div 
                layoutId="activeFilter"
                className="absolute inset-0 bg-indigo-600 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            {mode.replace('_', ' ')}
          </button>
        ))}
      </motion.div>

      {/* Curriculum Render */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {sortMode === 'NCERT' && isSenior ? (
            // Render Hierarchical Units for Classic mode
            <motion.div 
              key="ncert-hierarchical"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {(curriculum as UnitView[]).map((unit, unitIdx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: unitIdx * 0.1 }}
                  key={unit.id} 
                  className="space-y-4"
                >
                  <h3 className="text-xl font-extrabold text-slate-800 border-b border-slate-200 pb-3 flex items-center gap-2 tracking-tight">
                    <span className="text-indigo-200 bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shadow-inner shadow-indigo-900/20">{unit.sequence_order}</span>
                    {unit.name}
                  </h3>
                  <div className="grid gap-3 pl-4 border-l-2 border-indigo-50/50">
                    {unit.chapters.map((chapter: ChapterView, idx: number) => {
                      const isLocked = chapter.status === 'LOCKED';
                      return (
                        <motion.div 
                           key={chapter.id}
                           whileHover={isLocked ? {} : { x: 5, scale: 1.01 }}
                           transition={{ type: "spring", stiffness: 300 }}
                        >
                           <Link 
                            href={isLocked ? '#' : `/student/chapters/${chapter.id}`}
                            className={`block bg-white border rounded-[1.5rem] p-6 transition-all relative overflow-hidden ${
                              isLocked 
                                ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed' 
                                : 'border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-lg cursor-pointer group'
                            }`}
                          >
                            {/* Subtle Hover Glow Line for active cards */}
                            {!isLocked && (
                               <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                            
                            <div className="flex justify-between items-center sm:items-start gap-4">
                              <div className="space-y-1.5 flex-1">
                                <h4 className={`font-extrabold text-lg tracking-tight ${isLocked ? 'text-slate-500' : 'text-slate-900 group-hover:text-indigo-600 transition-colors'}`}>
                                  {chapter.name}
                                </h4>
                                <p className="text-sm font-medium text-slate-500 line-clamp-2 md:line-clamp-none leading-relaxed">
                                  {chapter.description}
                                </p>
                              </div>
                              <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-slate-50 shadow-inner">
                                {chapter.status === 'COMPLETED' && <CheckCircle className="text-emerald-500 w-6 h-6 drop-shadow-sm" />}
                                {chapter.status === 'IN_PROGRESS' && <PlayCircle className="text-indigo-500 w-6 h-6 drop-shadow-sm" />}
                                {chapter.status === 'LOCKED' && <Lock className="text-slate-400 w-5 h-5" />}
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Render flat list for filtered modes or junior classes
            <motion.div 
              key="flat-list"
              className="space-y-4"
            >
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 mb-6 flex items-center gap-2">
                <div className="h-px bg-slate-200 flex-1"></div>
                {sortMode} Flow
                <div className="h-px bg-slate-200 w-12"></div>
              </div>
              
              <motion.div layout className="grid gap-4">
                {getSortedChapters().map((chapter: ChapterView, idx: number) => {
                  const isLocked = chapter.status === 'LOCKED';
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      whileHover={isLocked ? {} : { y: -2, scale: 1.01 }}
                      key={chapter.id}
                    >
                       <Link 
                        href={isLocked ? '#' : `/student/chapters/${chapter.id}`}
                        className={`block bg-white border rounded-[1.5rem] p-6 transition-all relative overflow-hidden ${
                          isLocked 
                            ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed' 
                            : 'border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-lg cursor-pointer group'
                        }`}
                      >
                         {!isLocked && (
                               <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                         )}
                        <div className="flex justify-between items-center sm:items-start gap-4">
                          <div className="space-y-1.5 flex-1">
                            <h4 className={`font-extrabold text-lg tracking-tight ${isLocked ? 'text-slate-500' : 'text-slate-900 group-hover:text-indigo-600 transition-colors'}`}>
                              {chapter.name}
                            </h4>
                            <p className="text-sm font-medium text-slate-500 line-clamp-2 md:line-clamp-none leading-relaxed">
                              {chapter.description}
                            </p>
                          </div>
                          <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-slate-50 shadow-inner">
                            {chapter.status === 'COMPLETED' && <CheckCircle className="text-emerald-500 w-6 h-6 drop-shadow-sm" />}
                            {chapter.status === 'IN_PROGRESS' && <PlayCircle className="text-indigo-500 w-6 h-6 drop-shadow-sm" />}
                            {chapter.status === 'LOCKED' && <Lock className="text-slate-400 w-5 h-5" />}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
