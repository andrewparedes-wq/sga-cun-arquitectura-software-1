import React from 'react';
import { TabType } from '../../types/architecture';
import { 
  BookOpen, 
  Users, 
  GitBranch, 
  PlayCircle, 
  Table2, 
  ShieldAlert, 
  FileText 
} from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'contexto',
      label: 'Contexto & Monolito',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 'actores-req',
      label: 'Actores & Requerimientos',
      icon: <Users className="w-4 h-4" />,
      badge: 'RF/RNF'
    },
    {
      id: 'diagramas',
      label: 'Diagramas UML (A-E)',
      icon: <GitBranch className="w-4 h-4" />,
      badge: 'PlantUML'
    },
    {
      id: 'simulador',
      label: 'Simulador de Matrícula',
      icon: <PlayCircle className="w-4 h-4" />,
      badge: '9 Pasos'
    },
    {
      id: 'trazabilidad',
      label: 'Matriz de Trazabilidad',
      icon: <Table2 className="w-4 h-4" />,
      badge: 'F'
    },
    {
      id: 'calidad-riesgos',
      label: 'Calidad & Sizing 300',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: 'G'
    },
    {
      id: 'documento',
      label: 'Documento ACA CUN',
      icon: <FileText className="w-4 h-4" />
    }
  ];

  return (
    <nav className="bg-slate-950/70 border-b border-slate-800/80 sticky top-[61px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-2 no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 border shrink-0 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-white' : 'text-slate-500'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                  activeTab === tab.id
                    ? 'bg-indigo-700 text-indigo-100'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
