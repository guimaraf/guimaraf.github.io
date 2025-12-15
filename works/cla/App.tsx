import React, { useState } from 'react';
import { AppStatus, DocumentData, ProcessingError } from './types';
import { parseFile } from './services/documentParser';
import { reorganizeTextWithGemini } from './services/geminiService';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';
import ProcessingState from './components/ProcessingState';
import { BrainCircuit, Github } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<DocumentData | null>(null);
  const [error, setError] = useState<ProcessingError | null>(null);

  const processFile = async (file: File) => {
    try {
      setStatus(AppStatus.PARSING);
      setError(null);

      // 1. Extract Text
      const originalText = await parseFile(file);
      
      if (!originalText || originalText.trim().length === 0) {
        throw new Error("Não foi possível extrair texto legível deste arquivo.");
      }

      setStatus(AppStatus.PROCESSING);

      // 2. Process with AI
      const organizedText = await reorganizeTextWithGemini(originalText);

      setData({
        fileName: file.name,
        originalText,
        organizedText
      });

      setStatus(AppStatus.COMPLETED);

    } catch (err: any) {
      console.error(err);
      setStatus(AppStatus.ERROR);
      setError({
        message: err.message || "Ocorreu um erro desconhecido.",
        details: "Por favor tente outro arquivo ou verifique sua conexão."
      });
    }
  };

  const resetApp = () => {
    setStatus(AppStatus.IDLE);
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-50 to-transparent -z-10"></div>
      
      {/* Header */}
      <header className="w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">ClarityFlow</span>
        </div>
        <a href="#" className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
           {/* Placeholder for social/github link */}
           <Github className="w-5 h-5" />
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        
        {status === AppStatus.IDLE && (
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Transforme documentos complexos em <span className="text-brand-600">leitura fluida</span>.
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Carregue PDFs, DOCX ou arquivos de texto. Nossa IA reorganiza o conteúdo, melhora a clareza e formata perfeitamente com espaçamento ideal.
            </p>
            
            <div className="bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
              <FileUpload 
                onFileSelect={processFile} 
                isLoading={status !== AppStatus.IDLE} 
              />
            </div>
          </div>
        )}

        {(status === AppStatus.PARSING || status === AppStatus.PROCESSING) && (
          <ProcessingState status={status === AppStatus.PARSING ? 'PARSING' : 'PROCESSING'} />
        )}

        {status === AppStatus.COMPLETED && data && (
          <ResultDisplay data={data} onReset={resetApp} />
        )}

        {status === AppStatus.ERROR && (
           <div className="text-center py-20 animate-fade-in">
             <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-3xl">!</span>
             </div>
             <h3 className="text-2xl font-bold text-slate-800 mb-2">Oops! Algo deu errado.</h3>
             <p className="text-red-600 mb-6">{error?.message}</p>
             <button 
               onClick={resetApp}
               className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 font-medium"
             >
               Tentar novamente
             </button>
           </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-slate-400 text-sm border-t border-slate-100 bg-white/50 backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} ClarityFlow AI. Desenvolvido para máxima produtividade.</p>
      </footer>

      {/* CSS Animation helper */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;