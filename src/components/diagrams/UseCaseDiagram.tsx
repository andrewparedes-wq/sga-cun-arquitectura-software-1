import React, { useState } from 'react';
import { PLANTUML_DIAGRAMS, FUNCTIONAL_REQUIREMENTS, ACTORS } from '../../data/acaData';
import { PlantUmlViewer } from '../common/PlantUmlViewer';
import { Users, Info, Shield, Filter, CheckCircle2 } from 'lucide-react';

export const UseCaseDiagram: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<string | null>('RF-07');
  const [filterActor, setFilterActor] = useState<string>('all');

  const selectedReq = FUNCTIONAL_REQUIREMENTS.find(r => r.id === selectedElement);
  const selectedActor = ACTORS.find(a => a.id === selectedElement);

  const modelingDecisions = [
    "Delimitación estricta de frontera: El rectángulo 'Sistema de Gestión Académica (SGA)' aísla el software de los actores externos humanos y del sistema programado cron.",
    "Uso formal de <<include>>: Se aplica en 'Realizar Matrícula' hacia 'Validar Cupo', 'Verificar Duplicado', 'Autenticación' y 'Auditoría', pues son pasos mandatorios e ineludibles para la validez del caso de uso.",
    "Uso formal de <<extend>>: 'Notificar Cupo Agotado' extiende condicionalmente a 'Realizar Matrícula' únicamente cuando la condición de extensión (cupo == 0) se cumple.",
    "Generalización y reutilización: 'Buscar y Filtrar Información' y 'Autenticar Usuario' son transversales y compartidos por los 4 roles institucionales.",
    "Segregación por rol: Ningún actor tiene acceso a funcionalidades fuera de su perímetro de responsabilidad (principio de menor privilegio)."
  ];

  const assumptions = [
    "Se asume que la autenticación es un prerrequisito obligatorio antes de invocar cualquier caso de uso de negocio (representado mediante relación include a RF-01).",
    "Los estudiantes sólo pueden matricularse en periodos que el Coordinador Académico haya abierto previamente en RF-06.",
    "El registro de calificaciones por parte de los docentes está restringido temporalmente a los cortes evaluativos institucionales.",
    "Las operaciones de auditoría (RF-12) se ejecutan de manera síncrona o reactiva automática sin intervención explícita de los usuarios finales."
  ];

  const componentsExplanation = [
    { name: "Administrador", role: "Actor Primario", description: "Gestiona el ciclo de vida de usuarios, asigna roles RBAC y vigila pistas de auditoría." },
    { name: "Coordinador Académico", role: "Actor Primario", description: "Configura programas, asignaturas, apertura periodos y consolida reportes." },
    { name: "Docente", role: "Actor Primario", description: "Visualiza estudiantes asignados y asienta calificaciones parciales y definitivas." },
    { name: "Estudiante", role: "Actor Primario", description: "Inscribe asignaturas en grupos con cupo disponible y consulta su historial de notas." },
    { name: "Sistema / Cron", role: "Actor Secundario", description: "Disparador de tareas automáticas de auditoría, cierres de periodos y consolidación." },
    { name: "Boundary: SGA", role: "Límite del Sistema", description: "Encapsula los 12 casos de uso funcionales requeridos por la institución educativa CUN." }
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Entregable A
              </span>
              <h3 className="text-xl font-bold text-white">Diagrama de Casos de Uso UML</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Modelado formal con estándar OMG UML de los 4 actores institucionales, los 12 requerimientos funcionales (RF-01 a RF-12),
              las relaciones de inclusión <code className="text-indigo-300 font-mono text-[11px]">&lt;&lt;include&gt;&gt;</code> y extensión <code className="text-indigo-300 font-mono text-[11px]">&lt;&lt;extend&gt;&gt;</code>, y el límite del sistema.
            </p>
          </div>

          {/* Actor filter buttons */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/60">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <button
              onClick={() => setFilterActor('all')}
              className={`px-2.5 py-1 text-xs rounded transition ${filterActor === 'all' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterActor('admin')}
              className={`px-2.5 py-1 text-xs rounded transition ${filterActor === 'admin' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Admin
            </button>
            <button
              onClick={() => setFilterActor('coordinador')}
              className={`px-2.5 py-1 text-xs rounded transition ${filterActor === 'coordinador' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Coordinador
            </button>
            <button
              onClick={() => setFilterActor('docente')}
              className={`px-2.5 py-1 text-xs rounded transition ${filterActor === 'docente' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Docente
            </button>
            <button
              onClick={() => setFilterActor('estudiante')}
              className={`px-2.5 py-1 text-xs rounded transition ${filterActor === 'estudiante' ? 'bg-amber-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Estudiante
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Visual SVG Diagram */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto shadow-2xl">
        <div className="text-xs text-slate-500 font-mono mb-2 flex items-center justify-between">
          <span>Vista Vectorial Interactiva (Haz clic en cualquier actor o caso de uso para inspeccionar)</span>
          <span className="text-[11px] text-indigo-400">Notación Estándar ISO/IEC 19505:2012</span>
        </div>

        <svg id="diagram-svg-use-case" viewBox="0 0 1100 680" className="w-full min-w-[850px] h-auto select-none font-sans">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8" />
            </marker>
            <marker id="arrow-extend" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
            </marker>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* System Boundary */}
          <rect x="230" y="20" width="640" height="640" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="2" strokeDasharray="6 3" />
          <rect x="230" y="20" width="640" height="38" rx="14" fill="#1e293b" />
          <text x="250" y="44" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="0.5">
            LÍMITE DEL SISTEMA: SISTEMA DE GESTIÓN ACADÉMICA (SGA - CUN)
          </text>

          {/* Connectors / Relations from Actors to Use Cases */}
          {/* Admin connections */}
          <path d="M 120 100 L 290 90" stroke="#6366f1" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'admin' ? 1 : 0.15} />
          <path d="M 120 100 L 290 145" stroke="#6366f1" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'admin' ? 1 : 0.15} />
          <path d="M 120 100 L 290 200" stroke="#6366f1" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'admin' ? 1 : 0.15} />
          <path d="M 120 100 L 290 255" stroke="#6366f1" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'admin' ? 1 : 0.15} />
          <path d="M 120 100 L 670 590" stroke="#6366f1" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'admin' ? 1 : 0.15} />
          <path d="M 120 100 L 480 90" stroke="#6366f1" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'admin' ? 1 : 0.15} />

          {/* Coordinador connections */}
          <path d="M 120 280 L 290 90" stroke="#0ea5e9" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'coordinador' ? 1 : 0.15} />
          <path d="M 120 280 L 290 310" stroke="#0ea5e9" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'coordinador' ? 1 : 0.15} />
          <path d="M 120 280 L 290 365" stroke="#0ea5e9" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'coordinador' ? 1 : 0.15} />
          <path d="M 120 280 L 290 530" stroke="#0ea5e9" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'coordinador' ? 1 : 0.15} />
          <path d="M 120 280 L 480 90" stroke="#0ea5e9" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'coordinador' ? 1 : 0.15} />

          {/* Docente connections */}
          <path d="M 980 180 L 370 90" stroke="#10b981" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'docente' ? 1 : 0.15} />
          <path d="M 980 180 L 670 310" stroke="#10b981" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'docente' ? 1 : 0.15} />
          <path d="M 980 180 L 520 90" stroke="#10b981" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'docente' ? 1 : 0.15} />

          {/* Estudiante connections */}
          <path d="M 980 430 L 370 90" stroke="#f59e0b" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'estudiante' ? 1 : 0.15} />
          <path d="M 980 430 L 290 420" stroke="#f59e0b" strokeWidth="2" opacity={filterActor === 'all' || filterActor === 'estudiante' ? 1 : 0.15} />
          <path d="M 980 430 L 670 365" stroke="#f59e0b" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'estudiante' ? 1 : 0.15} />
          <path d="M 980 430 L 520 90" stroke="#f59e0b" strokeWidth="1.5" opacity={filterActor === 'all' || filterActor === 'estudiante' ? 1 : 0.15} />

          {/* <<include>> and <<extend>> dashed connectors */}
          {/* RF-07 includes Validar Cupo */}
          <path d="M 390 420 L 560 420" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arrow)" />
          <text x="445" y="412" fill="#818cf8" fontSize="10" fontWeight="600">&lt;&lt;include&gt;&gt;</text>

          {/* RF-07 includes Validar Duplicado */}
          <path d="M 370 440 L 560 475" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arrow)" />
          <text x="430" y="468" fill="#818cf8" fontSize="10" fontWeight="600">&lt;&lt;include&gt;&gt;</text>

          {/* RF-07 includes Auditoría */}
          <path d="M 340 450 L 620 585" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arrow)" />
          <text x="460" y="525" fill="#818cf8" fontSize="10" fontWeight="600">&lt;&lt;include&gt;&gt;</text>

          {/* Notificar Cupo Agotado extends RF-07 */}
          <path d="M 680 420 L 390 420" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arrow-extend)" />
          <text x="500" y="440" fill="#f59e0b" fontSize="9" fontWeight="600">&lt;&lt;extend&gt;&gt; [cupo == 0]</text>

          {/* RF-08 includes Auditoría */}
          <path d="M 700 335 L 700 565" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arrow)" />
          <text x="705" y="490" fill="#818cf8" fontSize="10" fontWeight="600">&lt;&lt;include&gt;&gt;</text>

          {/* RF-09 includes Calcular Promedio */}
          <path d="M 720 390 L 760 435" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arrow)" />
          <text x="750" y="420" fill="#818cf8" fontSize="10" fontWeight="600">&lt;&lt;include&gt;&gt;</text>

          {/* RF-10 includes Exportar PDF */}
          <path d="M 350 555 L 430 590" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arrow)" />
          <text x="350" y="585" fill="#818cf8" fontSize="10" fontWeight="600">&lt;&lt;include&gt;&gt;</text>

          {/* ======================================================== */}
          {/* ACTORS RENDER (Stick figures + Box) */}
          {/* ======================================================== */}

          {/* Actor 1: Administrador */}
          <g
            onClick={() => setSelectedElement('admin')}
            className="cursor-pointer transition-transform hover:scale-105"
            opacity={filterActor === 'all' || filterActor === 'admin' ? 1 : 0.3}
          >
            <circle cx="80" cy="80" r="16" fill="#6366f1" stroke="#818cf8" strokeWidth="2" />
            <line x1="80" y1="96" x2="80" y2="125" stroke="#818cf8" strokeWidth="2.5" />
            <line x1="60" y1="106" x2="100" y2="106" stroke="#818cf8" strokeWidth="2.5" />
            <line x1="80" y1="125" x2="65" y2="148" stroke="#818cf8" strokeWidth="2.5" />
            <line x1="80" y1="125" x2="95" y2="148" stroke="#818cf8" strokeWidth="2.5" />
            <text x="80" y="166" fill="#e2e8f0" fontSize="11" fontWeight="700" textAnchor="middle">Administrador</text>
            <text x="80" y="179" fill="#818cf8" fontSize="9" textAnchor="middle">Gobernanza / RBAC</text>
          </g>

          {/* Actor 2: Coordinador Académico */}
          <g
            onClick={() => setSelectedElement('coordinador')}
            className="cursor-pointer transition-transform hover:scale-105"
            opacity={filterActor === 'all' || filterActor === 'coordinador' ? 1 : 0.3}
          >
            <circle cx="80" cy="260" r="16" fill="#0ea5e9" stroke="#38bdf8" strokeWidth="2" />
            <line x1="80" y1="276" x2="80" y2="305" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="60" y1="286" x2="100" y2="286" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="80" y1="305" x2="65" y2="328" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="80" y1="305" x2="95" y2="328" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="80" y="346" fill="#e2e8f0" fontSize="11" fontWeight="700" textAnchor="middle">Coordinador</text>
            <text x="80" y="359" fill="#38bdf8" fontSize="9" textAnchor="middle">Académico</text>
          </g>

          {/* Actor 3: Docente */}
          <g
            onClick={() => setSelectedElement('docente')}
            className="cursor-pointer transition-transform hover:scale-105"
            opacity={filterActor === 'all' || filterActor === 'docente' ? 1 : 0.3}
          >
            <circle cx="1020" cy="160" r="16" fill="#10b981" stroke="#34d399" strokeWidth="2" />
            <line x1="1020" y1="176" x2="1020" y2="205" stroke="#34d399" strokeWidth="2.5" />
            <line x1="1000" y1="186" x2="1040" y2="186" stroke="#34d399" strokeWidth="2.5" />
            <line x1="1020" y1="205" x2="1005" y2="228" stroke="#34d399" strokeWidth="2.5" />
            <line x1="1020" y1="205" x2="1035" y2="228" stroke="#34d399" strokeWidth="2.5" />
            <text x="1020" y="246" fill="#e2e8f0" fontSize="11" fontWeight="700" textAnchor="middle">Docente</text>
            <text x="1020" y="259" fill="#34d399" fontSize="9" textAnchor="middle">Calificaciones</text>
          </g>

          {/* Actor 4: Estudiante */}
          <g
            onClick={() => setSelectedElement('estudiante')}
            className="cursor-pointer transition-transform hover:scale-105"
            opacity={filterActor === 'all' || filterActor === 'estudiante' ? 1 : 0.3}
          >
            <circle cx="1020" cy="410" r="16" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />
            <line x1="1020" y1="426" x2="1020" y2="455" stroke="#fbbf24" strokeWidth="2.5" />
            <line x1="1000" y1="436" x2="1040" y2="436" stroke="#fbbf24" strokeWidth="2.5" />
            <line x1="1020" y1="455" x2="1005" y2="478" stroke="#fbbf24" strokeWidth="2.5" />
            <line x1="1020" y1="455" x2="1035" y2="478" stroke="#fbbf24" strokeWidth="2.5" />
            <text x="1020" y="496" fill="#e2e8f0" fontSize="11" fontWeight="700" textAnchor="middle">Estudiante</text>
            <text x="1020" y="509" fill="#fbbf24" fontSize="9" textAnchor="middle">Matrícula y Horarios</text>
          </g>

          {/* ======================================================== */}
          {/* USE CASES ELLIPSES (RF-01 to RF-12 + Inclusions) */}
          {/* ======================================================== */}

          {/* RF-01: Autenticación */}
          <g onClick={() => setSelectedElement('RF-01')} className="cursor-pointer">
            <ellipse cx="330" cy="90" rx="75" ry="22" fill={selectedElement === 'RF-01' ? '#4f46e5' : '#1e1b4b'} stroke="#6366f1" strokeWidth={selectedElement === 'RF-01' ? '2.5' : '1.5'} />
            <text x="330" y="94" fill="#ffffff" fontSize="10.5" fontWeight="600" textAnchor="middle">RF-01: Autenticar Usuario</text>
          </g>

          {/* RF-11: Búsqueda y Filtros */}
          <g onClick={() => setSelectedElement('RF-11')} className="cursor-pointer">
            <ellipse cx="500" cy="90" rx="75" ry="22" fill={selectedElement === 'RF-11' ? '#4f46e5' : '#1e293b'} stroke="#64748b" strokeWidth={selectedElement === 'RF-11' ? '2.5' : '1.5'} />
            <text x="500" y="94" fill="#cbd5e1" fontSize="10" fontWeight="600" textAnchor="middle">RF-11: Búsqueda y Filtros</text>
          </g>

          {/* RF-02: Roles y Permisos */}
          <g onClick={() => setSelectedElement('RF-02')} className="cursor-pointer">
            <ellipse cx="330" cy="145" rx="75" ry="22" fill={selectedElement === 'RF-02' ? '#4f46e5' : '#1e1b4b'} stroke="#6366f1" strokeWidth={selectedElement === 'RF-02' ? '2.5' : '1.5'} />
            <text x="330" y="149" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">RF-02: Roles y Permisos</text>
          </g>

          {/* RF-03: Gestión Estudiantes */}
          <g onClick={() => setSelectedElement('RF-03')} className="cursor-pointer">
            <ellipse cx="330" cy="200" rx="75" ry="22" fill={selectedElement === 'RF-03' ? '#4f46e5' : '#1e1b4b'} stroke="#6366f1" strokeWidth={selectedElement === 'RF-03' ? '2.5' : '1.5'} />
            <text x="330" y="204" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">RF-03: Gestionar Estudiantes</text>
          </g>

          {/* RF-04: Gestión Docentes */}
          <g onClick={() => setSelectedElement('RF-04')} className="cursor-pointer">
            <ellipse cx="330" cy="255" rx="75" ry="22" fill={selectedElement === 'RF-04' ? '#4f46e5' : '#1e1b4b'} stroke="#6366f1" strokeWidth={selectedElement === 'RF-04' ? '2.5' : '1.5'} />
            <text x="330" y="259" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">RF-04: Gestionar Docentes</text>
          </g>

          {/* RF-05: Programas y Asignaturas */}
          <g onClick={() => setSelectedElement('RF-05')} className="cursor-pointer">
            <ellipse cx="330" cy="310" rx="78" ry="22" fill={selectedElement === 'RF-05' ? '#0284c7' : '#082f49'} stroke="#0ea5e9" strokeWidth={selectedElement === 'RF-05' ? '2.5' : '1.5'} />
            <text x="330" y="314" fill="#ffffff" fontSize="9.5" fontWeight="600" textAnchor="middle">RF-05: Programas y Asignaturas</text>
          </g>

          {/* RF-06: Grupos y Periodos */}
          <g onClick={() => setSelectedElement('RF-06')} className="cursor-pointer">
            <ellipse cx="330" cy="365" rx="75" ry="22" fill={selectedElement === 'RF-06' ? '#0284c7' : '#082f49'} stroke="#0ea5e9" strokeWidth={selectedElement === 'RF-06' ? '2.5' : '1.5'} />
            <text x="330" y="369" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">RF-06: Grupos y Periodos</text>
          </g>

          {/* RF-07: Matrícula Académica (Destacado) */}
          <g onClick={() => setSelectedElement('RF-07')} className="cursor-pointer" filter="url(#glow)">
            <ellipse cx="330" cy="420" rx="85" ry="26" fill={selectedElement === 'RF-07' ? '#d97706' : '#451a03'} stroke="#f59e0b" strokeWidth={selectedElement === 'RF-07' ? '3' : '2'} />
            <text x="330" y="424" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">RF-07: Matrícula Académica</text>
          </g>

          {/* Inclusiones de Matrícula */}
          <g className="cursor-default">
            <ellipse cx="610" cy="420" rx="60" ry="18" fill="#14532d" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 2" />
            <text x="610" y="424" fill="#bbf7d0" fontSize="9" textAnchor="middle">Validar Cupo</text>
          </g>

          <g className="cursor-default">
            <ellipse cx="610" cy="475" rx="65" ry="18" fill="#14532d" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 2" />
            <text x="610" y="479" fill="#bbf7d0" fontSize="9" textAnchor="middle">Validar Duplicado</text>
          </g>

          <g className="cursor-default">
            <ellipse cx="760" cy="420" rx="68" ry="18" fill="#713f12" stroke="#eab308" strokeWidth="1" strokeDasharray="3 2" />
            <text x="760" y="424" fill="#fef08a" fontSize="9" textAnchor="middle">Notificar Cupo Agotado</text>
          </g>

          {/* RF-08: Calificaciones */}
          <g onClick={() => setSelectedElement('RF-08')} className="cursor-pointer">
            <ellipse cx="700" cy="310" rx="80" ry="22" fill={selectedElement === 'RF-08' ? '#059669' : '#022c22'} stroke="#10b981" strokeWidth={selectedElement === 'RF-08' ? '2.5' : '1.5'} />
            <text x="700" y="314" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">RF-08: Registrar Calificaciones</text>
          </g>

          {/* RF-09: Consulta de Notas */}
          <g onClick={() => setSelectedElement('RF-09')} className="cursor-pointer">
            <ellipse cx="700" cy="365" rx="80" ry="22" fill={selectedElement === 'RF-09' ? '#059669' : '#022c22'} stroke="#10b981" strokeWidth={selectedElement === 'RF-09' ? '2.5' : '1.5'} />
            <text x="700" y="369" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">RF-09: Consultar Resultados</text>
          </g>

          <g className="cursor-default">
            <ellipse cx="800" cy="460" rx="60" ry="16" fill="#1e293b" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
            <text x="800" y="464" fill="#cbd5e1" fontSize="8.5" textAnchor="middle">Calcular Promedio</text>
          </g>

          {/* RF-10: Reportes */}
          <g onClick={() => setSelectedElement('RF-10')} className="cursor-pointer">
            <ellipse cx="330" cy="530" rx="75" ry="22" fill={selectedElement === 'RF-10' ? '#0284c7' : '#082f49'} stroke="#0ea5e9" strokeWidth={selectedElement === 'RF-10' ? '2.5' : '1.5'} />
            <text x="330" y="534" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">RF-10: Generar Reportes</text>
          </g>

          <g className="cursor-default">
            <ellipse cx="490" cy="600" rx="60" ry="16" fill="#1e293b" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
            <text x="490" y="604" fill="#cbd5e1" fontSize="8.5" textAnchor="middle">Exportar PDF/Excel</text>
          </g>

          {/* RF-12: Auditoría */}
          <g onClick={() => setSelectedElement('RF-12')} className="cursor-pointer">
            <ellipse cx="700" cy="590" rx="80" ry="22" fill={selectedElement === 'RF-12' ? '#6366f1' : '#1e1b4b'} stroke="#818cf8" strokeWidth={selectedElement === 'RF-12' ? '2.5' : '1.5'} />
            <text x="700" y="594" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">RF-12: Auditoría de Operaciones</text>
          </g>
        </svg>
      </div>

      {/* Inspector Card of Selected Node */}
      {selectedReq && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {selectedReq.id}
              </span>
              <h4 className="text-base font-bold text-white">{selectedReq.title}</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Actor Principal:</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                {selectedReq.primaryActor}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Criticidad: {selectedReq.criticality}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-300 mb-4 leading-relaxed">{selectedReq.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block font-semibold mb-1">Módulo Arquitectónico:</span>
              <span className="text-emerald-400 font-medium">{selectedReq.module}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block font-semibold mb-1">Precondiciones:</span>
              <span className="text-slate-300">{selectedReq.preconditions}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block font-semibold mb-1">Postcondiciones:</span>
              <span className="text-slate-300">{selectedReq.postconditions}</span>
            </div>
          </div>
        </div>
      )}

      {selectedActor && (
        <div className="bg-slate-900 border border-sky-500/30 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-base font-bold text-white">Actor: {selectedActor.name}</h4>
                <span className="text-xs text-sky-400 font-mono">{selectedActor.badge}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-300 mb-4">{selectedActor.shortDesc}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <h5 className="font-semibold text-slate-300 mb-2">Responsabilidades Primarias:</h5>
              <ul className="space-y-1.5 text-slate-400">
                {selectedActor.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <h5 className="font-semibold text-slate-300 mb-2">Permisos RBAC Asignados:</h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedActor.permissions.map((p, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[11px] border border-slate-700">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete PlantUML Code Viewer with Analysis */}
      <PlantUmlViewer
        title="Código Fuente PlantUML - Diagrama de Casos de Uso (Entregable A)"
        filename="sga_casos_de_uso"
        code={PLANTUML_DIAGRAMS.useCase}
        description="Representa formalmente la frontera del Sistema de Gestión Académica (SGA), los 4 actores humanos y el actor temporal de sistema, asociando cada uno de los 12 requerimientos funcionales (RF-01 a RF-12). Modela de manera rigurosa las relaciones <<include>> hacia validación de cupo, validación de matrícula duplicada y auditoría obligatoria, así como la relación <<extend>> para la notificación condicional cuando el cupo se agota."
        componentsExplanation={componentsExplanation}
        modelingDecisions={modelingDecisions}
        assumptions={assumptions}
      />
    </div>
  );
};
