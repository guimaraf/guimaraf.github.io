import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, ArrowLeft, FileText, File as FileIcon, CheckCircle2 } from 'lucide-react';
import { DocumentData } from '../types';
import jsPDF from 'jspdf';

interface ResultDisplayProps {
  data: DocumentData;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, onReset }) => {
  
  const handleDownloadTxt = () => {
    const blob = new Blob([data.organizedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `organized_${data.fileName.split('.')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadDoc = () => {
    // Basic HTML to Doc export
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' " +
      "xmlns='http://www.w3.org/TR/REC-html40'> " +
      "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
    
    // Convert markdown newlines to HTML breaks for simple DOC export
    const formattedBody = data.organizedText
      .replace(/\n\n/g, "<br/><br/>") // Double spacing
      .replace(/\n/g, "<br/>");       // Single spacing

    const footer = "</body></html>";
    const sourceHTML = header + formattedBody + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `organized_${data.fileName.split('.')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxLineWidth = pageWidth - (margin * 2);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    const lines = doc.splitTextToSize(data.organizedText, maxLineWidth);
    
    // Add simple title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Documento Organizado", margin, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    // Start printing text below title
    let cursorY = 30;
    
    lines.forEach((line: string) => {
        if (cursorY > 280) { // New page if bottom reached
            doc.addPage();
            cursorY = 20;
        }
        doc.text(line, margin, cursorY);
        cursorY += 6; // Line height
    });
    
    doc.save(`organized_${data.fileName.split('.')[0]}.pdf`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <button 
            onClick={onReset}
            className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Organizar outro arquivo
          </button>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Conteúdo Organizado
          </h2>
          <p className="text-slate-500 text-sm mt-1">Baseado em: {data.fileName}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
            <button onClick={handleDownloadTxt} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm text-sm font-medium">
                <FileText className="w-4 h-4" /> TXT
            </button>
            <button onClick={handleDownloadDoc} className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg hover:bg-blue-100 hover:border-blue-200 transition-all shadow-sm text-sm font-medium">
                <FileIcon className="w-4 h-4" /> DOC
            </button>
            <button onClick={handleDownloadPdf} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/20 transition-all shadow-md text-sm font-medium">
                <Download className="w-4 h-4" /> PDF
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            </div>
            <span className="text-xs text-slate-400 font-mono ml-4">leitura_otimizada.md</span>
        </div>
        <div className="p-8 md:p-12 overflow-y-auto max-h-[70vh]">
          <div className="prose prose-slate prose-headings:font-bold prose-h2:text-brand-800 prose-a:text-brand-600 max-w-none">
            <ReactMarkdown>
                {data.organizedText}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;