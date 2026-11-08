import React, { useState } from 'react';
import { RISKS_AND_QUALITY, COMPARATIVE_ANALYSIS, CAPACITY_SIZING } from '../../data/acaData';
import { ShieldAlert, Activity, CheckCircle, Scale, Calculator, ArrowUpRight, Cpu, Server, Database } from 'lucide-react';

export const QualityAndRiskAnalysis: React.FC = () => {
  const [userCount, setUserCount] = useState<number>(300);
  const [thinkTime, setThinkTime] = useState<number>(8); // segundos de lectura entre clicks

  // Little's Law & Sizing calculations
  // Throughput (X) = Concurrent Users (N) / (Think Time (Z) + Response Time (R))
  // Assuming R = 0.5s
  const avgResponseTime = 0.5;
  const calculatedRps = (userCount / (thinkTime + avgResponseTime)).toFixed(1);
  const dbQueriesPerReq = 2.4;
  const calculatedQps = (parseFloat(calculatedRps) * dbQueriesPerReq).toFixed(1);
  const neededPoolSize = Math.min(50, Math.max(15, Math.ceil(parseFloat(calculatedRps) * 0.75)));
  const estimatedBandwidthMbps = ((userCount * 45 * 8) / 1024).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Entregable G
              </span>
              <h3 className="text-xl font-bold text-white">Análisis de Calidad, Mitigación de Riesgos & Sizing</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Evaluación exhaustiva de los atributos de calidad (Rendimiento, Seguridad, Mantenibilidad, Disponibilidad y Escalabilidad),
              estrategia de mitigación de Puntos Únicos de Falla (SPOF) y justificación matemática para 300 usuarios concurrentes.
            </p>
          </div>
        </div>
      </div>

      {/* Sizing & Capacity Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Calculadora Dinámica de Concurrencia (Ley de Little)</h4>
              <p className="text-xs text-slate-400">Verifica la carga del servidor de aplicaciones y base de datos variando los parámetros</p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-indigo-300 border border-slate-700">
            Fórmula: X = N / (Z + R)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Usuarios Concurrentes Simulados: <span className="text-indigo-400 font-mono font-bold text-sm">{userCount} usuarios</span>
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="25"
              value={userCount}
              onChange={e => setUserCount(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>50</span>
              <span className="text-emerald-400 font-bold">300 (Carga Objetivo ACA)</span>
              <span>600</span>
              <span>1000</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Tiempo Promedio de Lectura / Think Time (Z): <span className="text-sky-400 font-mono font-bold text-sm">{thinkTime} segundos</span>
            </label>
            <input
              type="range"
              min="2"
              max="15"
              step="1"
              value={thinkTime}
              onChange={e => setThinkTime(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>2s (Rápido)</span>
              <span>8s (Estándar Universitario)</span>
              <span>15s (Lectura detenida)</span>
            </div>
          </div>
        </div>

        {/* Calculated Results */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">RPS al Servidor Web:</span>
            <div className="text-xl font-bold font-mono text-emerald-400">{calculatedRps} <span className="text-xs font-normal">req/s</span></div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Throughput promedio</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Consultas DB (QPS):</span>
            <div className="text-xl font-bold font-mono text-sky-400">{calculatedQps} <span className="text-xs font-normal">qps</span></div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Factor 2.4 queries/req</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Pool de Conexiones DB:</span>
            <div className="text-xl font-bold font-mono text-amber-400">{neededPoolSize} <span className="text-xs font-normal">conexiones</span></div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">PgBouncer Transactional</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Ancho de Banda Red:</span>
            <div className="text-xl font-bold font-mono text-indigo-400">{estimatedBandwidthMbps} <span className="text-xs font-normal">Mbps</span></div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Tráfico de red simultáneo</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-300 leading-relaxed">
          <strong className="text-indigo-400">Conclusión técnica:</strong> Para los 300 usuarios concurrentes requeridos por la CUN, el throughput real oscila entre <span className="text-emerald-400 font-mono font-bold">35 y 56 RPS</span>. Un servidor de aplicaciones moderno con 2 vCPUs procesa holgadamente hasta 1.500 RPS en llamadas in-memory. Por tanto, el Monolito Modular opera con un margen de seguridad de más del <span className="text-emerald-400 font-bold">90%</span> de capacidad disponible sin requerir la complejidad de microservicios.
        </div>
      </div>

      {/* Monolith Modular vs Microservices Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <Scale className="w-5 h-5 text-indigo-400" />
          <h4 className="text-base font-bold text-white">
            Comparativa Técnica Formal: Monolito Modular vs Arquitectura de Microservicios
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3 w-1/4">Criterio Arquitectónico</th>
                <th className="px-4 py-3 w-1/3 text-emerald-400">Monolito Modular (Seleccionado)</th>
                <th className="px-4 py-3 w-1/3 text-rose-400">Microservicios Distribuidos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {COMPARATIVE_ANALYSIS.criteria.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-semibold text-white">
                    <div>{item.criterion}</div>
                    <div className="text-[10px] text-indigo-400 mt-1 font-normal font-sans">{item.verdict}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-200 bg-emerald-950/10 leading-relaxed">
                    {item.modularMonolith}
                  </td>
                  <td className="px-4 py-3 text-slate-300 bg-rose-950/10 leading-relaxed">
                    {item.microservices}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Analysis and SPOF Mitigations */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h4 className="text-base font-bold text-white">
            Matriz de Riesgos Arquitectónicos y Mitigación de SPOF (Puntos Únicos de Falla)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RISKS_AND_QUALITY.map(risk => (
            <div key={risk.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-indigo-400">{risk.id}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      Prob: {risk.probability}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                      risk.impact === 'Crítico'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      Impacto: {risk.impact}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-bold text-white mb-2">{risk.category}: {risk.riskDescription}</div>
              </div>

              <div className="space-y-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-emerald-400 font-semibold block mb-0.5">Estrategia de Mitigación:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{risk.mitigationStrategy}</p>
                </div>
                <div>
                  <span className="text-sky-400 font-semibold block mb-0.5">Mecanismo de Monitoreo:</span>
                  <p className="text-slate-400 text-[11px] font-mono">{risk.monitoringMechanism}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
