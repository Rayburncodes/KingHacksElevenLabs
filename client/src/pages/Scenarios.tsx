import { motion } from "framer-motion";
import { LogOut, CreditCard, UserX, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Scenarios() {
  const scenarios = [
    {
      icon: <LogOut className="w-8 h-8 text-primary" />,
      title: "If I Quit Early",
      focus: "Resignation & Notice Periods",
      description: "We analyze clauses related to voluntary termination, notice requirements, non-competes, and potential repayment of bonuses or training costs."
    },
    {
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      title: "If I Miss Payment",
      focus: "Defaults & Late Fees",
      description: "We look for late fee structures, interest rates on unpaid balances, grace periods, and when a missed payment triggers a 'default' event."
    },
    {
      icon: <UserX className="w-8 h-8 text-primary" />,
      title: "If They Fire Me",
      focus: "Termination Rights",
      description: "We identify 'for cause' vs 'without cause' termination rights, severance pay eligibility, and how much notice they owe you."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-primary/20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/">
          <Button variant="ghost" className="mb-8 hover:bg-slate-100">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to App
          </Button>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-primary uppercase tracking-tight">Risk Scenarios</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">We focus on the three most common 'worst-case' events in modern contracts.</p>
          </div>

          <div className="space-y-8">
            {scenarios.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start"
              >
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shrink-0">
                  {s.icon}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-2xl font-serif font-bold text-primary">{s.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/5 text-primary/60 px-2 py-1 rounded">Focus: {s.focus}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg">{s.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
