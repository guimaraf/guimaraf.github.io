import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface ProcessingStateProps {
  status: 'PARSING' | 'PROCESSING';
}

const ProcessingState: React.FC<ProcessingStateProps> = ({ status }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-brand-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <div className="relative w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6">
          {status === 'PARSING' ? (
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
          ) : (
            <Sparkles className="w-10 h-10 text-purple-500 animate-pulse" />
          )}
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-slate-800 mb-2">
        {status === 'PARSING' ? 'Lendo arquivo...' : 'A Inteligência Artificial está trabalhando'}
      </h3>
      
      <p className="text-slate-500 text-center max-w-md">
        {status === 'PARSING' 
          ? 'Estamos extraindo o texto do seu documento para processamento.' 
          : 'Reorganizando parágrafos, melhorando a clareza e aplicando a formatação otimizada...'}
      </p>

      {status === 'PROCESSING' && (
        <div className="mt-8 w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-400 via-purple-500 to-brand-400 w-full animate-indeterminate"></div>
        </div>
      )}
      
      <style>{`
        @keyframes indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-indeterminate {
          animation: indeterminate 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default ProcessingState;