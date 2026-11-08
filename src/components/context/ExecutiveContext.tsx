import React from 'react';
import { INSTITUTION_INFO, ARCHITECTURAL_MODULES, COMPARATIVE_ANALYSIS, CAPACITY_SIZING } from '../../data/acaData';
import { AlertCircle, CheckCircle, ShieldCheck, Scale, Server, ArrowRight, Layers, FileCheck2, Cpu } from 'lucide-react';

export const ExecutiveContext: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Executive Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
              {INSTITUTION_INFO.subject} • ACA
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
              {INSTITUTION_INFO.institution}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Diseño Arquitectónico del Sistema de Gestión Académica (SGA)
          </h2>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Propuesta de arquitectura empresarial formal para resolver la fragmentación operativa, duplicidad de datos y riesgos de seguridad causados por el uso histórico de archivos y hojas de cálculo en la institución. Se implementa un <strong>Monolito Modular fundamentado en principios de Clean Architecture</strong>, optimizado para garantizar consistencia transaccional ACID, trazabilidad absoluta y soporte para <strong>300 usuarios concurrentes</strong> con respuesta inferior a 3 segundos (meta p95 &lt; 800 ms).
          </p>
        </div>
      </div>

      {/* Problem vs Solution Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Current Problematic State */}
        <div className="bg-slate-900/90 border border-rose-500/30 rounded-xl p-5 shadow-xl">
          <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Situación Problemática Actual</h4>
              <span className="text-xs text-rose-400 font-mono">Hojas de cálculo y aplicaciones aisladas</span>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
              <span><strong>Duplicidad e inconsistencias:</strong> Información de estudiantes y calificaciones dispersa en múltiples archivos Excel sin sincronización.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
              <span><strong>Demoras operativas:</strong> Tiempos prolongados de consolidación de periodos y generación manual de actas de calificaciones.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
              <span><strong>Falta de información centralizada:</strong> Imposibilidad de consultar el kárdex académico en tiempo real.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
              <span><strong>Ausencia de trazabilidad:</strong> Carencia de registros forenses o auditoría sobre quién modificó una nota o canceló una matrícula.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
              <span><strong>Riesgos de seguridad y privacidad:</strong> Vulnerabilidad ante manipulación no autorizada e incumplimiento de la Ley 1581 de Habeas Data.</span>
            </li>
          </ul>
        </div>

        {/* Proposed Architectural Solution */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-5 shadow-xl">
          <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Solución Arquitectónica Propuesta</h4>
              <span className="text-xs text-emerald-400 font-mono">Monolito Modular + Clean Architecture</span>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
              <span><strong>Repositorio Único Centralizado:</strong> Base de datos relacional PostgreSQL 16 con esquemas segregados e integridad referencial forzada.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
              <span><strong>Consistencia Transaccional ACID:</strong> Control estricto de cupos en matrículas con bloqueos pesimistas contra el sobrecupo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
              <span><strong>Auditoría Inmutable (Append-Only):</strong> Pista de auditoría automática con IP, timestamp UTC, usuario y cambio de estado previo/posterior.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
              <span><strong>Rendimiento In-Memory:</strong> Comunicación inter-modular a 0 ms de overhead de red, alcanzando p95 &lt; 450 ms para 300 concurrentes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
              <span><strong>Fronteras Modulares Fuertes:</strong> Módulos desacoplados mediante interfaces públicas tipadas, facilitando mantenimiento y testing unitario.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Deep Architectural Justification Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Justificación de la Arquitectura de Monolito Modular</h3>
            <p className="text-xs text-slate-400">Por qué supera a los microservicios en el contexto de 300 usuarios concurrentes</p>
          </div>
        </div>

        <div className="text-xs md:text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            Uno de los errores más comunes en la ingeniería de software actual es adoptar una arquitectura de microservicios sin una necesidad de escala de tráfico hipermasiva (&gt; 100.000 req/s) ni equipos de desarrollo distribuidos de cientos de ingenieros. Para el Sistema de Gestión Académica de la CUN con un requerimiento de <strong>300 usuarios concurrentes simultáneos</strong>, la elección del <strong>Monolito Modular</strong> es la decisión técnicamente correcta por las siguientes razones:
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-indigo-300 text-sm mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>1. Latencia de Llamada In-Memory vs Red</span>
            </h5>
            <p className="text-slate-400 leading-relaxed">
              En el monolito modular, cuando el módulo de Matrículas valida los prerrequisitos en Gestión Académica y notifica a Auditoría, la invocación ocurre en el stack de memoria del proceso (menos de <strong>0.05 ms</strong>). En microservicios, esta misma interacción requeriría 3 llamadas HTTP/REST o gRPC a través de la red local, agregando entre <strong>15 ms y 60 ms</strong> de latencia de transporte por cada clic del usuario.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-emerald-300 text-sm mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>2. Consistencia ACID vs Complejidad de Sagas</span>
            </h5>
            <p className="text-slate-400 leading-relaxed">
              La matrícula universitaria requiere atomicidad absoluta: o se inscribe al estudiante y se decrementa el cupo, o la operación se rechaza por completo. En el monolito modular, esto se resuelve con una transacción ACID estándar en PostgreSQL con <code className="text-emerald-400 font-mono">SELECT FOR UPDATE</code>. En microservicios, se requeriría coordinar transacciones distribuidas (Two-Phase Commit o Sagas con eventos de compensación), introduciendo riesgo de cupos fantasmas y consistencia eventual inaceptable para procesos de grado y notas.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-sky-300 text-sm mb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400" />
              <span>3. Dimensionamiento y Throughput Real</span>
            </h5>
            <p className="text-slate-400 leading-relaxed">
              Con 300 usuarios concurrentes y un tiempo de pensamiento humano promedio de 8 segundos por pantalla, el sistema recibe en su hora pico un flujo de <strong>~37.5 a 56 Requests Per Second (RPS)</strong>. Un único contenedor Node.js/JVM con 2 vCPUs procesa con holgura más de 1.500 RPS en llamadas in-memory. Por tanto, el monolito modular opera a menos del 10% de su capacidad nominal, garantizando que el percentil 95 (p95) responda en menos de <strong>450 ms</strong> (muy por debajo de la meta de 3 segundos).
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-amber-300 text-sm mb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>4. Costo Operacional y Deuda Técnica (TCO)</span>
            </h5>
            <p className="text-slate-400 leading-relaxed">
              Microservicios exige infraestructura sobredimensionada (Kubernetes, múltiples balanceadores, Service Mesh, brokers Kafka y trazabilidad distribuida con Jaeger), multiplicando los costos en la nube por 10x y demandando un equipo DevOps dedicado. El monolito modular con Clean Architecture se compila en una sola imagen de contenedor, se despliega en minutos con Docker y permite evolucionar ordenadamente sin fricción.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
