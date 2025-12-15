import React, { useCallback, useState } from 'react';
import { Upload, FileText, File as FileIcon, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndPassFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    // Some browsers have different mime types for txt, so we also check extension
    const validExtensions = ['pdf', 'docx', 'txt'];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (validTypes.includes(file.type) || (extension && validExtensions.includes(extension))) {
      setError(null);
      onFileSelect(file);
    } else {
      setError("Por favor, envie apenas arquivos PDF, DOCX ou TXT.");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative group flex flex-col items-center justify-center w-full h-80 rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out
          ${dragActive ? 'border-brand-500 bg-brand-50 scale-[1.02]' : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className={`p-4 rounded-full mb-4 transition-colors ${dragActive ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-500'}`}>
            <Upload className="w-10 h-10" />
          </div>
          <p className="mb-2 text-xl font-semibold text-slate-700">
            Arraste seu documento aqui
          </p>
          <p className="mb-6 text-sm text-slate-500">
            Suporta PDF, DOCX ou TXT
          </p>
          
          <label className="cursor-pointer relative group-hover:-translate-y-0.5 transition-transform">
            <span className="bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-6 rounded-xl shadow-lg shadow-brand-500/30 transition-all">
              Escolher Arquivo
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.docx,.txt" 
              onChange={handleChange}
              disabled={isLoading}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white shadow-sm border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                <FileIcon size={16} />
            </div>
            <span className="text-xs font-semibold text-slate-600">PDF</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white shadow-sm border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                <FileText size={16} />
            </div>
            <span className="text-xs font-semibold text-slate-600">DOCX</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white shadow-sm border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                <FileText size={16} />
            </div>
            <span className="text-xs font-semibold text-slate-600">TXT</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;