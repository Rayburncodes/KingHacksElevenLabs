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
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 w-full max-w-4xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
          <CheckCircle2 size={14} />
          Analysis Complete
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-primary">
          {getScenarioTitle(scenario)}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        
        {/* Original Clause Column */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8 relative group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-semibold border border-border flex items-center gap-2">
            <FileText size={14} />
            Original Legal Text
          </div>
          
          <div className="mt-4 prose prose-slate">
            <blockquote className="italic text-muted-foreground border-l-4 border-primary/20 pl-4 py-2 bg-slate-50/50">
              "{data.originalClause}"
            </blockquote>
          </div>
        </div>

        {/* Plain English Column (Highlighted) */}
        <div className="bg-slate-900 rounded-xl shadow-xl shadow-slate-900/10 p-6 md:p-8 text-white relative transform md:-translate-y-4 border border-slate-800">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg shadow-blue-900/20 flex items-center gap-2">
            <Sparkles size={14} />
            Plain English
          </div>

          <div className="mt-4 space-y-6">
            <p className="text-xl md:text-2xl font-bold text-white border-b border-white/10 pb-4 leading-tight">
              {data.riskHeadline}
            </p>
            <p className="text-lg md:text-xl leading-relaxed font-medium text-blue-50">
              {data.plainEnglish}
            </p>
            
            {data.clarityLevel && (
              <div className="text-xs font-medium text-white/60 pt-2 border-t border-white/5 italic">
                Clarity: {data.clarityLevel} — {data.clarityReason || (data.clarityLevel === 'High' ? 'explicit clause and clear numbers found' : data.clarityLevel === 'Medium' ? 'clause inferred but not explicit' : 'contract does not clearly specify consequences')}
              </div>
            )}
            
            <div className="pt-4 border-t border-white/10">
              <AudioPlayer textToSpeak={data.plainEnglish} autoPlay={true} />
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="text-muted-foreground hover:text-primary underline decoration-dotted underline-offset-4 text-sm font-medium transition-colors"
        >
          Analyze another contract
        </button>
      </div>
    </div>
  );
}
