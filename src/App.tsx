/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType } from './types/architecture';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { ExecutiveContext } from './components/context/ExecutiveContext';
import { ActorsAndRequirements } from './components/requirements/ActorsAndRequirements';
import { DiagramsContainer } from './components/diagrams/DiagramsContainer';
import { EnrollmentSimulator } from './components/simulator/EnrollmentSimulator';
import { TraceabilityMatrix } from './components/matrix/TraceabilityMatrix';
import { QualityAndRiskAnalysis } from './components/analysis/QualityAndRiskAnalysis';
import { FullAcaDocument } from './components/document/FullAcaDocument';
import { INSTITUTION_INFO } from './data/acaData';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('contexto');

  const handlePrintReport = () => {
    setActiveTab('documento');
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <Header onPrintReport={handlePrintReport} />

      {/* Main Tab Navigation */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === 'contexto' && <ExecutiveContext />}
        {activeTab === 'actores-req' && <ActorsAndRequirements />}
        {activeTab === 'diagramas' && <DiagramsContainer />}
        {activeTab === 'simulador' && <EnrollmentSimulator />}
        {activeTab === 'trazabilidad' && <TraceabilityMatrix />}
        {activeTab === 'calidad-riesgos' && <QualityAndRiskAnalysis />}
        {activeTab === 'documento' && <FullAcaDocument />}
      </main>

      {/* Institutional Academic Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-slate-500 text-xs font-mono print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>{INSTITUTION_INFO.institution} • {INSTITUTION_INFO.program}</span>
          </div>
          <div>
            <span>{INSTITUTION_INFO.activity} - {INSTITUTION_INFO.subject} • {INSTITUTION_INFO.date}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
