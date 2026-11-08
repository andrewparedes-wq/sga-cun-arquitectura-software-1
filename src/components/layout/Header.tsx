import React from 'react';
import { INSTITUTION_INFO } from '../../data/acaData';
import { GraduationCap, ShieldCheck, Download, ExternalLink, Printer } from 'lucide-react';

interface HeaderProps {
  onPrintReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPrintReport }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-extrabold text-white tracking-tight">
                SGA CUN <span className="text-indigo-400 font-mono font-medium text-xs">| Arquitectura de Software</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACA Aprobado
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate max-w-md">
              {INSTITUTION_INFO.institution} • {INSTITUTION_INFO.program}
            </p>
          </div>
        </div>

        {/* Right Info & Quick Action */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex flex-col text-right font-mono text-[10px] text-slate-400 pr-2 border-r border-slate-800">
            <span className="text-slate-300 font-semibold">Monolito Modular • Clean Architecture</span>
            <span className="text-indigo-400">Meta: 300 Concurrent Users (p95 &lt; 3s)</span>
          </div>

          <button
            onClick={onPrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition"
            title="Imprimir o guardar como PDF oficial"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar Informe</span>
          </button>
        </div>
      </div>
    </header>
  );
};
