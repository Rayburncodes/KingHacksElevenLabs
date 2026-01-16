import { motion } from "framer-motion";
import { Scale, Zap, Shield, Search, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "1. Clause Extraction",
      description: "Our AI scans your contract to find the exact legal clauses relevant to your selected scenario."
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "2. Plain English Translation",
      description: "We rewrite dense legal jargon into clear, everyday language that anyone can understand."
    },
    {
      icon: <Scale className="w-8 h-8 text-primary" />,
      title: "3. Consequence Simulation",
      description: "We simulate what actually happens if you quit, miss a payment, or get terminated."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "4. Multilingual Voice",
      description: "Listen to the explanation in English, French, or Spanish with professional AI voices."
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
            <h1 className="text-4xl md:text-5xl font-serif font-black text-primary uppercase tracking-tight">How It Works</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Understanding your contract shouldn't require a law degree. Here is our process.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-6 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-100">
                  {step.icon}
                </div>
                <h3 className="text-xl font-serif font-bold text-primary mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
