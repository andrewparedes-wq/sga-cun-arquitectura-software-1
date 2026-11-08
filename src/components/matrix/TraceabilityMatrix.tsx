import React, { useState } from 'react';
import { TRACEABILITY_MATRIX } from '../../data/acaData';
import { Search, Filter, CheckCircle2, ShieldAlert, FileSpreadsheet, Layers } from 'lucide-react';

export const TraceabilityMatrix: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'RF' | 'RNF'>('ALL');
  const [filterModule, setFilterModule] = useState<string>('ALL');

  const modules = Array.from(new Set(TRACEABILITY_MATRIX.map(item => item.module)));

  const filteredItems = TRACEABILITY_MATRIX.filter(item => {
    const matchesSearch = 
      item.reqId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reqTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.verificationCriteria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.components.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesModule = filterModule === 'ALL' || item.module === filterModule;

    return matchesSearch && matchesType && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Entregable F
              </span>
              <h3 className="text-xl font-bold text-white">Matriz de Trazabilidad de Requerimientos vs Arquitectura</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Mapeo formal y bidireccional entre los Requerimientos Funcionales (RF) y No Funcionales (RNF), los módulos del Monolito Modular,
              los componentes técnicos responsables y los métodos rigurosos de verificación empírica.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por ID, módulo, componente o criterio..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded transition ${filterType === 'ALL' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Todos ({TRACEABILITY_MATRIX.length})
            </button>
            <button
              onClick={() => setFilterType('RF')}
              className={`px-3 py-1 rounded transition ${filterType === 'RF' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Solo RF (12)
            </button>
            <button
              onClick={() => setFilterType('RNF')}
              className={`px-3 py-1 rounded transition ${filterType === 'RNF' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Solo RNF (6 clave)
            </button>
          </div>

          {/* Module Filter Select */}
          <select
            value={filterModule}
            onChange={e => setFilterModule(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Todos los Módulos</option>
            {modules.map(mod => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table of Traceability */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">ID Requerimiento</th>
                <th className="px-4 py-3">Nombre del Requerimiento</th>
                <th className="px-4 py-3">Módulo Arquitectónico</th>
                <th className="px-4 py-3">Componentes Responsables</th>
                <th className="px-4 py-3">Método de Verificación</th>
                <th className="px-4 py-3">Criterio de Aceptación / Verificación</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 whitespace-nowrap font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      item.type === 'RF'
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {item.reqId}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{item.reqTitle}</td>
                  <td className="px-4 py-3 text-slate-300">{item.module}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.components.map((c, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700/60">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-sky-300 border border-slate-700">
                      {item.verificationMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px] leading-relaxed max-w-sm">
                    {item.verificationCriteria}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{item.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
