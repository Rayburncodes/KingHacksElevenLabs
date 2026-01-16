import { motion } from "framer-motion";
import { ShieldCheck, EyeOff, Lock, Server, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Security() {
  const features = [
    {
      icon: <EyeOff className="w-8 h-8 text-primary" />,
      title: "Zero Persistence",
      description: "We do not store your full contract text permanently. Once your session ends, the raw data is cleared."
    },
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: "AES-256 Encryption",
      description: "All data transmitted to our AI analysis engine is encrypted using industry-standard protocols."
    },
    {
      icon: <Server className="w-8 h-8 text-primary" />,
      title: "Private Processing",
      description: "We use private API endpoints to ensure your data is never used to train public AI models."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "No User Accounts",
      description: "ClauseAI is an anonymous tool. We don't ask for your name, email, or any identifying details."
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
            <h1 className="text-4xl md:text-5xl font-serif font-black text-primary uppercase tracking-tight">Security & Privacy</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Legal data is sensitive. We treat it with the highest level of confidentiality.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="mb-4 bg-primary/5 w-12 h-12 rounded-xl flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="text-lg font-serif font-bold text-primary mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 text-center">
            <h3 className="text-lg font-serif font-bold text-primary mb-2">Our Commitment</h3>
            <p className="text-slate-600 text-sm max-w-xl mx-auto italic">
              "ClauseAI was built on the principle that legal clarity should never come at the cost of personal privacy."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
