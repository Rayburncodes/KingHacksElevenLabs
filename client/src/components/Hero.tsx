import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, ShieldAlert, Scale } from "lucide-react";

export function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      <motion.div 
        style={{ y: y1, opacity, scale }}
        className="max-w-4xl mx-auto px-4 text-center space-y-8"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-black text-primary tracking-tighter leading-tight">
              Know the <span className="text-slate-400">Cost</span> of <br />
              Breaking Your Contract.
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto"
          >
            ClauseCast deciphers legal jargon to reveal the real-world consequences of your worst-case scenarios.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="flex justify-center gap-12 pt-8"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
              <FileText size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Analysis</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
              <ShieldAlert size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Risk</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
              <Scale size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Clarity</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Abstract Background Visuals */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full max-w-6xl pointer-events-none opacity-20">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 1, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="grid grid-cols-4 gap-8"
        >
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="h-64 bg-slate-100 border border-slate-200 rounded-2xl transform"
              style={{ 
                rotate: `${(i % 2 === 0 ? 1 : -1) * (i + 1)}deg`,
                transform: `translateY(${i * 10}px)`
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
