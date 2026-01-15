import { AudioPlayer } from "./AudioPlayer";
import { type AnalyzeResponse } from "@shared/schema";
import { CheckCircle2, AlertTriangle, FileText, Sparkles } from "lucide-react";

interface ResultCardProps {
  data: AnalyzeResponse;
  scenario: string;
  onReset: () => void;
}

export function ResultCard({ data, scenario, onReset }: ResultCardProps) {
  const getScenarioTitle = (s: string) => {
    switch(s) {
      case 'quit': return "Consequences of Quitting Early";
      case 'payment': return "Consequences of Missing Payment";
      case 'terminate': return "Consequences of Termination";
      default: return "Analysis Result";
    }
  };

  return (
    <div className="fade-in-gentle w-full max-w-4xl mx-auto space-y-12">
      
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          <CheckCircle2 size={12} />
          Analysis Complete
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-primary tracking-tight font-black">
          {getScenarioTitle(scenario)}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-stretch">
        
        {/* Original Clause Column */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10 flex flex-col justify-center relative group hover:shadow-md transition-all duration-500">
          <div className="absolute top-0 left-8 -translate-y-1/2 bg-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100 flex items-center gap-2">
            <FileText size={10} />
            Reference Text
          </div>
          
          <div className="prose prose-slate prose-lg max-w-none">
            <blockquote className="italic text-slate-500 border-l-2 border-slate-100 pl-6 py-1 leading-relaxed">
              "{data.originalClause}"
            </blockquote>
          </div>
        </div>

        {/* Plain English Column (Highlighted) */}
        <div className="bg-primary rounded-2xl shadow-2xl shadow-primary/10 p-8 md:p-10 text-white flex flex-col relative transform md:-translate-y-6 border border-primary/10 transition-all duration-500 hover:-translate-y-7 hover:shadow-primary/20">
           <div className="absolute top-0 left-8 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-blue-900/20 flex items-center gap-2">
            <Sparkles size={10} />
            Plain Interpretation
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight border-b border-white/10 pb-6">
              {data.riskHeadline}
            </h3>
            <p className="text-lg md:text-xl leading-relaxed font-medium text-slate-200/90 italic">
              {data.plainEnglish}
            </p>
            
            {data.clarityLevel && (
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 pt-2 border-t border-white/5 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${data.clarityLevel === 'High' ? 'bg-emerald-400' : data.clarityLevel === 'Medium' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                Clarity: {data.clarityLevel} — <span className="font-normal normal-case opacity-60 italic">{data.clarityReason || (data.clarityLevel === 'High' ? 'explicit clause and clear numbers found' : data.clarityLevel === 'Medium' ? 'clause inferred but not explicit' : 'contract does not clearly specify consequences')}</span>
              </div>
            )}
            
            <div className="pt-6 border-t border-white/10">
              <AudioPlayer 
                textToSpeak={data.plainEnglish} 
                language={data.language} // Assuming language is returned in data or we need to pass it
                autoPlay={true} 
              />
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-center pt-12">
        <button
          onClick={onReset}
          className="group flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <div className="h-px w-8 bg-slate-200 group-hover:bg-primary/20 transition-colors" />
          Analyze another contract
          <div className="h-px w-8 bg-slate-200 group-hover:bg-primary/20 transition-colors" />
        </button>
      </div>
    </div>
  );
}
