import React from 'react';
import { GrammarRule } from '../types';
import { X, Sparkles, AlertTriangle, CheckCircle2, Scroll } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GrammarModalProps {
  rule: GrammarRule | null;
  onClose: () => void;
}

export const GrammarModal: React.FC<GrammarModalProps> = ({ rule, onClose }) => {
  if (!rule) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#0c0c0c] ninja-border rounded-2xl p-6 shadow-[0_0_30px_rgba(0,255,65,0.3)] text-white overflow-hidden"
        >
          {/* Subtle Dojo background watermark */}
          <div className="absolute -top-10 -left-10 text-[#00FF41]/10 text-9xl font-black select-none pointer-events-none">
            🥷
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-[#00FF41] hover:bg-[#001a05] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#001a05] border border-[#00FF41]/40 rounded-xl text-[#00FF41]">
              <Scroll className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#00FF41] tracking-wide uppercase">قاعدة نينجا نحوية 📜</span>
              <h3 className="text-xl font-bold text-white font-serif">{rule.title}</h3>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-sm leading-relaxed text-gray-300">
            {/* Explanation Arabic */}
            <div className="p-3.5 bg-[#111111] border border-[#222222] rounded-xl">
              <p className="text-gray-200 font-medium">{rule.explanationArabic}</p>
            </div>

            {/* Formula if present */}
            {rule.formula && (
              <div className="p-3 bg-[#001a05] border border-[#00FF41]/40 rounded-xl font-mono text-xs text-[#00FF41] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00FF41] shrink-0" />
                <span className="font-semibold">{rule.formula}</span>
              </div>
            )}

            {/* Correct Example */}
            <div className="p-3 bg-[#001a05] border border-[#00FF41]/60 rounded-xl">
              <div className="flex items-center gap-2 text-[#00FF41] font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>الصياغة الصحيحة الموصى بها:</span>
              </div>
              <p className="font-mono text-[#00FF41] text-sm ltr font-semibold">{rule.correctExample}</p>
            </div>

            {/* Wrong Example if present */}
            {rule.wrongExample && (
              <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl">
                <div className="flex items-center gap-2 text-rose-400 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>تجنب هذا الخطأ الشائع:</span>
                </div>
                <p className="font-mono text-rose-200 text-sm ltr line-through opacity-80">{rule.wrongExample}</p>
              </div>
            )}

            {/* Ninja Tip */}
            <div className="p-3.5 bg-[#111111] border border-[#00FF41]/40 rounded-xl flex items-start gap-3">
              <span className="text-xl shrink-0">🥷</span>
              <div>
                <span className="text-xs font-bold text-[#00FF41] block mb-0.5">سر النينجا السريع:</span>
                <p className="text-xs text-gray-200 font-medium">{rule.ninjaTip}</p>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6 pt-4 border-t border-[#1a1a1a] text-left">
            <button
              onClick={onClose}
              className="px-6 py-2.5 ninja-btn-neon text-black font-black rounded-xl transition-all text-sm"
            >
              فهمت القاعدة 👍
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
