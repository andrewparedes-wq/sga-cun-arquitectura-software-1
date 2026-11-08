import React, { useState } from 'react';
import { ACTORS, FUNCTIONAL_REQUIREMENTS, NON_FUNCTIONAL_REQUIREMENTS } from '../../data/acaData';
import { Users, CheckSquare, ShieldCheck, Search, Filter, AlertCircle, Sparkles } from 'lucide-react';

export const ActorsAndRequirements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'actors' | 'rf' | 'rnf'>('actors');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriticality, setFilterCriticality] = useState<string>('ALL');

  const filteredRf = FUNCTIONAL_REQUIREMENTS.filter(rf => {
    const matchesSearch = 
      rf.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rf.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rf.module.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCrit = filterCriticality === 'ALL' || rf.criticality === filterCriticality;
    return matchesSearch && matchesCrit;
  });

  const filteredRnf = NON_FUNCTIONAL_REQUIREMENTS.filter(rnf => {
    return (
      rnf.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rnf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rnf.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rnf.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rnf.architecturalStrategy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Sección 2 & 3 & 4
              </span>
              <h3 className="text-xl font-bold text-white">Actores y Requerimientos de Software (SGA CUN)</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Catálogo formal de los 4 actores institucionales, los 12 requerimientos funcionales (RF-01 a RF-12)
              y los 12 requerimientos no funcionales (RNF-01 a RNF-12) con sus métricas y estrategias arquitectónicas.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex text-xs font-medium">
            <button
              onClick={() => setActiveTab('actors')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
                activeTab === 'actors' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>4 Actores</span>
            </button>
            <button
              onClick={() => setActiveTab('rf')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
                activeTab === 'rf' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>12 Funcionales (RF)</span>
            </button>
            <button
              onClick={() => setActiveTab('rnf')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
                activeTab === 'rnf' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>12 No Funcionales (RNF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content for ACTORS */}
      {activeTab === 'actors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ACTORS.map(actor => (
            <div key={actor.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow"
                      style={{ backgroundColor: actor.color }}
                    >
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{actor.name}</h4>
                      <span className="text-xs font-mono text-indigo-400">{actor.badge}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">{actor.shortDesc}</p>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Responsabilidades Principales:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {actor.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Permisos RBAC Granulares:
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {actor.permissions.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-indigo-300 font-mono text-[10px] border border-slate-800">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content for RF */}
      {activeTab === 'rf' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar requerimiento funcional..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Criticidad:</span>
              <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex text-xs">
                <button
                  onClick={() => setFilterCriticality('ALL')}
                  className={`px-2.5 py-1 rounded transition ${filterCriticality === 'ALL' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilterCriticality('Alta')}
                  className={`px-2.5 py-1 rounded transition ${filterCriticality === 'Alta' ? 'bg-rose-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Alta
                </button>
                <button
                  onClick={() => setFilterCriticality('Media')}
                  className={`px-2.5 py-1 rounded transition ${filterCriticality === 'Media' ? 'bg-amber-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Media
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRf.map(rf => (
              <div key={rf.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        {rf.id}
                      </span>
                      <h4 className="font-bold text-white text-sm">{rf.title}</h4>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      rf.criticality === 'Alta'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {rf.criticality}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">{rf.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Actor Primario:</span>
                      <span className="font-semibold text-slate-200">{rf.primaryActor}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block">Módulo:</span>
                      <span className="font-semibold text-indigo-400">{rf.module}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div><strong className="text-slate-300">Precondición:</strong> {rf.preconditions}</div>
                  <div><strong className="text-slate-300">Postcondición:</strong> {rf.postconditions}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content for RNF */}
      {activeTab === 'rnf' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRnf.map(rnf => (
              <div key={rnf.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {rnf.id}
                      </span>
                      <h4 className="font-bold text-white text-sm">{rnf.title}</h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-sky-300 border border-slate-700">
                      {rnf.category}
                    </span>
                  </div>

                  <div className="space-y-2 mt-3 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-emerald-400 font-semibold block mb-0.5">Métrica y Objetivo Formal:</span>
                      <div className="text-white font-medium">{rnf.target}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{rnf.metric}</div>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-sky-400 font-semibold block mb-0.5">Estrategia Arquitectónica de Soporte:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{rnf.architecturalStrategy}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                  Módulo asignado: <span className="text-indigo-400">{rnf.module}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
