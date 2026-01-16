import { useState } from "react";
import { useAnalyzeContract } from "@/hooks/use-analyze";
import { ResultCard } from "@/components/ResultCard";
import { useToast } from "@/hooks/use-toast";
import { HighlightText } from "@/components/HighlightText";
import { Hero } from "@/components/Hero";
import { ChatAssistant } from "@/components/ChatAssistant";
import { Scale, LogOut, CreditCard, UserX, ArrowRight, Loader2, FileText, Eye, Edit2, Upload } from "lucide-react";
import { api } from "@shared/routes";

export default function Home() {
  const [contractText, setContractText] = useState("");
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [language, setLanguage] = useState<"english" | "french" | "spanish">("english");
  const [isViewMode, setIsViewMode] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  
  const { mutate, isPending, data, reset } = useAnalyzeContract();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(api.import.parse.path, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to import');
      
      const result = await response.json();
      setContractText(result.text);
      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Could not extract text from file.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleAnalyze = (scenario: string) => {
    if (!contractText.trim()) {
      toast({
        title: "Contract text required",
        description: "Please paste your contract text before selecting a scenario.",
        variant: "destructive",
      });
      return;
    }
    
    setActiveScenario(scenario);
    setIsViewMode(true);
    mutate({ 
      contractText, 
      scenario, 
      language 
    } as any);
    
    // Smooth scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results-view');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleReset = () => {
    reset();
    setActiveScenario(null);
    setContractText("");
    setIsViewMode(false);
  };

  const isAnalyzing = isPending;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-primary/20">
      {/* Decorative background element */}
      <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>

      <header className="relative pt-6 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-lg shadow-md">
              <Scale size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-black tracking-tight text-primary uppercase">
                ClauseCast
              </h1>
              <div className="h-0.5 w-8 bg-primary/20 rounded-full mt-0.5"></div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
              <a href="#" className="hover:text-primary transition-colors">How it works</a>
              <a href="#" className="hover:text-primary transition-colors">Scenarios</a>
              <a href="#" className="hover:text-primary transition-colors">Security</a>
            </nav>
            <div className="h-4 w-px bg-slate-200"></div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Professional Contract Analysis
            </p>
          </div>
        </div>
      </header>

      <Hero />

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Results View & persistent input area */}
        <div className="space-y-12">
            <div id="contract-input-area" className="bg-white rounded-xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden transition-all duration-500">
              <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                   {isViewMode ? <Eye size={16} /> : <FileText size={16} />}
                   <span>{isViewMode ? "Contract Preview" : "Edit Contract"}</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <select 
                     value={language}
                     onChange={(e) => setLanguage(e.target.value as any)}
                     className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded border-none focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                   >
                     <option value="english">English</option>
                     <option value="french">Français</option>
                     <option value="spanish">Español</option>
                   </select>
                   {!isViewMode ? (
                     <label className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity">
                       {isImporting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                       <span>Import (.txt, .pdf)</span>
                       <input 
                          type="file" 
                          accept=".txt,.pdf" 
                          className="hidden" 
                          onChange={handleFileUpload}
                          disabled={isImporting || isAnalyzing}
                        />
                     </label>
                   ) : (
                    <button 
                      onClick={() => setIsViewMode(false)}
                      className="text-xs text-primary hover:underline font-bold flex items-center gap-1 bg-primary/5 px-2 py-1 rounded"
                    >
                      <Edit2 size={12} />
                      Edit or Replace Contract
                    </button>
                   )}
                   <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Step 1</span>
                 </div>
              </div>
              
              <div className={`transition-all duration-500 ease-in-out ${isViewMode ? 'h-32 opacity-60' : 'h-64'}`}>
                {isViewMode && data ? (
                  <div className="p-6 h-full overflow-y-auto text-base leading-relaxed font-serif whitespace-pre-wrap bg-slate-50/30">
                    <HighlightText text={contractText} snippets={data.highlightSnippets || []} />
                  </div>
                ) : (
                  <textarea
                    value={contractText}
                    onChange={(e) => setContractText(e.target.value)}
                    placeholder="Paste the full text of your contract here (e.g., Employment Agreement, Lease, Service Contract)..."
                    className="w-full h-full p-6 resize-none focus:outline-none focus:bg-slate-50/30 transition-colors text-base md:text-lg leading-relaxed placeholder:text-slate-300 font-serif"
                    disabled={isAnalyzing}
                  />
                )}
              </div>
            </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <span className="h-px bg-slate-200 flex-1"></span>
               <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                 {data ? "Explore Another Risk" : "Step 2: Assess a Scenario"}
               </span>
               <span className="h-px bg-slate-200 flex-1"></span>
            </div>

            {!data && !isAnalyzing && (
              <p className="text-center text-sm text-slate-400 font-medium animate-in fade-in duration-1000">
                Select a scenario below to hear a plain-language explanation of the legal consequences.
              </p>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={() => handleAnalyze('quit')}
                disabled={isAnalyzing}
                className={`btn-scenario ${activeScenario === 'quit' ? 'border-primary/60 bg-slate-50/80 ring-1 ring-primary/10' : 'border-slate-200 shadow-sm'}`}
              >
                <div className="p-4 bg-slate-50 rounded-full text-slate-400 group-hover:text-primary group-hover:bg-white transition-all duration-300 group-hover:shadow-sm">
                  <LogOut size={24} strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-1">
                  <span className="block text-slate-900 font-bold">If I quit early</span>
                  <span className="block text-[11px] font-sans font-medium text-slate-400 group-hover:text-primary/60 transition-colors uppercase tracking-wider">Notice & Penalties</span>
                </div>
              </button>

              <button
                onClick={() => handleAnalyze('payment')}
                disabled={isAnalyzing}
                className={`btn-scenario ${activeScenario === 'payment' ? 'border-primary/60 bg-slate-50/80 ring-1 ring-primary/10' : 'border-slate-200 shadow-sm'}`}
              >
                <div className="p-4 bg-slate-50 rounded-full text-slate-400 group-hover:text-primary group-hover:bg-white transition-all duration-300 group-hover:shadow-sm">
                  <CreditCard size={24} strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-1">
                  <span className="block text-slate-900 font-bold">If I miss payment</span>
                  <span className="block text-[11px] font-sans font-medium text-slate-400 group-hover:text-primary/60 transition-colors uppercase tracking-wider">Default & Late Fees</span>
                </div>
              </button>

              <button
                onClick={() => handleAnalyze('terminate')}
                disabled={isAnalyzing}
                className={`btn-scenario ${activeScenario === 'terminate' ? 'border-primary/60 bg-slate-50/80 ring-1 ring-primary/10' : 'border-slate-200 shadow-sm'}`}
              >
                <div className="p-4 bg-slate-50 rounded-full text-slate-400 group-hover:text-primary group-hover:bg-white transition-all duration-300 group-hover:shadow-sm">
                  <UserX size={24} strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-1">
                  <span className="block text-slate-900 font-bold">If they fire me</span>
                  <span className="block text-[11px] font-sans font-medium text-slate-400 group-hover:text-primary/60 transition-colors uppercase tracking-wider">Termination Rights</span>
                </div>
              </button>
            </div>
          </div>

          {data && activeScenario && (
            <div id="results-view" className="scroll-mt-24">
              <ResultCard 
                key={`${activeScenario}-${data.originalClause}`}
                data={data} 
                scenario={activeScenario} 
                onReset={handleReset} 
              />
            </div>
          )}
        </div>
      </main>

      {data && activeScenario && (
        <ChatAssistant 
          contractText={contractText}
          scenario={activeScenario}
          language={language}
        />
      )}

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full text-center space-y-6">
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <Scale className="absolute inset-0 m-auto text-primary" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-primary mb-2">Analyzing Contract</h3>
              <p className="text-muted-foreground text-sm">
                Our AI is reviewing the clauses for your selected scenario...
              </p>
            </div>
          </div>
        </div>
      )}

      {data && activeScenario && (
        <ChatAssistant 
          contractText={contractText}
          scenario={activeScenario}
          language={language}
        />
      )}
    </div>
  );
}
