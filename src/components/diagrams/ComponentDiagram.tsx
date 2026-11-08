import React, { useState } from 'react';
import { PLANTUML_DIAGRAMS, ARCHITECTURAL_MODULES } from '../../data/acaData';
import { PlantUmlViewer } from '../common/PlantUmlViewer';
import { Layers, ArrowRight, ShieldCheck, Database, Box } from 'lucide-react';

export const ComponentDiagram: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-matricula');

  const selectedModule = ARCHITECTURAL_MODULES.find(m => m.id === selectedModuleId);

  const modelingDecisions = [
    "Patrón Monolito Modular con Clean Architecture: Cada módulo de negocio (Matrículas, Calificaciones, etc.) está compuesto internamente por capas concéntricas: Dominio, Aplicación (casos de uso), e Infraestructura (repositorios y adaptadores).",
    "Principio de Inversión de Dependencias (DIP): Los módulos no se acoplan directamente a las clases concretas de otros módulos ni a la base de datos; la comunicación inter-modular se realiza exclusivamente a través de interfaces públicas (ports) como IMatriculaService, IGrupoCatalogService e IAuditoriaService.",
    "Capa de Presentación desacoplada: El cliente web React SPA se comunica con los controladores REST mediante HTTP/JSON. Los controladores actúan como adaptadores primarios (Driving Adapters) que transforman las solicitudes HTTP en DTOs de comando para los casos de uso.",
    "Módulo transversal de Auditoría: Implementa el patrón Observador / Bus de eventos en memoria, permitiendo que las acciones críticas de Matrículas o Calificaciones se auditen sin acoplar el núcleo de negocio con la persistencia del log.",
    "Segregación de esquemas en PostgreSQL: Aunque reside en una única base de datos física, la información se organiza en esquemas lógicos separados (seguridad, academia, transaccional, auditoría), previniendo consultas cruzadas 'JOIN' descontroladas y facilitando una futura extracción a microservicios si la institución lo requiriese en el futuro."
  ];

  const assumptions = [
    "Todas las llamadas entre módulos se ejecutan dentro del mismo proceso del sistema operativo en el servidor de aplicaciones, con latencia virtual de 0 ms.",
    "Las transacciones que involucran actualización de cupos y registro de matrícula se ejecutan bajo el mismo gestor transaccional relacional (consistencia ACID inmediata).",
    "La autenticación genera tokens JWT que viajan en la cabecera Authorization y son validados por el interceptor de seguridad antes de alcanzar los controladores.",
    "El caché Redis se utiliza como memoria de lectura rápida para catálogos que no cambian con alta frecuencia (asignaturas, mallas curriculares, roles)."
  ];

  const componentsExplanation = [
    { name: "Capa de Presentación", role: "Driver Adapter", description: "React SPA + Controladores REST que validan payloads JSON y retornan respuestas semánticas." },
    { name: "Módulo Autenticación", role: "Seguridad & Identidad", description: "Emite y valida JWT, comprueba políticas RBAC y resguarda credenciales con Argon2." },
    { name: "Módulo Gestión Académica", role: "Núcleo Curricular", description: "Mantiene catálogos maestros de asignaturas, programas, periodos, cupos y grupos." },
    { name: "Módulo Matrículas", role: "Transaccional Core", description: "Orquesta el registro atómico de asignaturas con bloqueo de cupos pesimista y cero overbooking." },
    { name: "Módulo Calificaciones", role: "Evaluación Académica", description: "Registra notas por cortes evaluativos, calcula promedios y emite estados de aprobación." },
    { name: "Módulo Reportes", role: "Lectura & Proyección", description: "Construye consolidados y sábanas de notas asíncronas exportables a PDF y Excel." },
    { name: "Módulo Auditoría", role: "Transversal (Append-Only)", description: "Bitácora inmutable de eventos con timestamp, IP, actor y cambios previos/posteriores." }
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Entregable B
              </span>
              <h3 className="text-xl font-bold text-white">Diagrama de Componentes UML - Monolito Modular</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Organización interna del Sistema de Gestión Académica según principios de Clean Architecture.
              Muestra los 7 módulos (Presentación, Autenticación, Gestión Académica, Matrículas, Calificaciones, Reportes y Auditoría),
              sus interfaces públicas (lollipop notation), dependencias y acceso a persistencia.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Visual SVG Component Diagram */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto shadow-2xl">
        <div className="text-xs text-slate-500 font-mono mb-2 flex items-center justify-between">
          <span>Vista de Arquitectura Modular y Puertos/Adaptadores (Haz clic en un módulo para inspeccionar contratos)</span>
          <span className="text-[11px] text-emerald-400">Clean Architecture + Ports & Adapters</span>
        </div>

        <svg id="diagram-svg-components" viewBox="0 0 1100 680" className="w-full min-w-[850px] h-auto select-none font-sans">
          <defs>
            <marker id="comp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker id="dep-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Presentation Layer Top Bar */}
          <rect x="50" y="25" width="1000" height="90" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <text x="70" y="48" fill="#94a3b8" fontSize="11" fontWeight="700">CAPA DE PRESENTACIÓN / CONTROLADORES HTTP (DRIVING ADAPTERS)</text>

          {/* Component: React SPA */}
          <g className="cursor-pointer" onClick={() => setSelectedModuleId('mod-pres')}>
            <rect x="70" y="55" width="380" height="46" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <rect x="62" y="62" width="16" height="8" fill="#38bdf8" />
            <rect x="62" y="78" width="16" height="8" fill="#38bdf8" />
            <text x="90" y="82" fill="#ffffff" fontSize="12" fontWeight="600">React 19 SPA Frontend (Tailwind + TypeScript)</text>
          </g>

          {/* Connector SPA to Controllers */}
          <path d="M 450 78 L 560 78" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#comp-arrow)" />
          <text x="465" y="72" fill="#38bdf8" fontSize="10" fontWeight="600">REST / JSON</text>

          {/* Component: API Controllers */}
          <g className="cursor-pointer" onClick={() => setSelectedModuleId('mod-pres')}>
            <rect x="570" y="55" width="460" height="46" rx="6" fill="#1e293b" stroke="#818cf8" strokeWidth="1.5" />
            <rect x="562" y="62" width="16" height="8" fill="#818cf8" />
            <rect x="562" y="78" width="16" height="8" fill="#818cf8" />
            <text x="590" y="82" fill="#ffffff" fontSize="12" fontWeight="600">API Controllers & Filters (Auth Guard, DTO Validation, Errors)</text>
          </g>

          {/* Application Monolith Boundary */}
          <rect x="50" y="145" width="1000" height="420" rx="12" fill="#090d16" stroke="#4f46e5" strokeWidth="2" strokeDasharray="8 4" />
          <rect x="50" y="145" width="1000" height="32" rx="12" fill="#1e1b4b" />
          <text x="70" y="166" fill="#c7d2fe" fontSize="12" fontWeight="700">
            PROCESO MONOLITO MODULAR (EN-MEMORIA, CLEAN ARCHITECTURE IN-PROCESS BOUNDARIES)
          </text>

          {/* Module 1: Autenticación */}
          <g className="cursor-pointer" onClick={() => setSelectedModuleId('mod-auth')}>
            <rect x="70" y="195" width="280" height="150" rx="8" fill={selectedModuleId === 'mod-auth' ? '#1e1b4b' : '#0f172a'} stroke="#6366f1" strokeWidth={selectedModuleId === 'mod-auth' ? '2.5' : '1.5'} />
            <text x="85" y="220" fill="#a5b4fc" fontSize="12" fontWeight="700">Módulo: Autenticación & RBAC</text>
            <circle cx="85" cy="245" r="5" fill="#6366f1" />
            <text x="96" y="249" fill="#e2e8f0" fontSize="10" fontStyle="italic">IAuthService (Port)</text>
            <circle cx="85" cy="270" r="5" fill="#6366f1" />
            <text x="96" y="274" fill="#e2e8f0" fontSize="10" fontStyle="italic">IPermissionChecker</text>
            <text x="85" y="305" fill="#94a3b8" fontSize="10">Core: JwtProvider, Bcrypt/Argon2</text>
            <text x="85" y="325" fill="#94a3b8" fontSize="10">RBAC Engine (Claims Policy)</text>
          </g>

          {/* Module 2: Gestión Académica */}
          <g className="cursor-pointer" onClick={() => setSelectedModuleId('mod-gestion')}>
            <rect x="380" y="195" width="320" height="150" rx="8" fill={selectedModuleId === 'mod-gestion' ? '#082f49' : '#0f172a'} stroke="#0ea5e9" strokeWidth={selectedModuleId === 'mod-gestion' ? '2.5' : '1.5'} />
            <text x="395" y="220" fill="#7dd3fc" fontSize="12" fontWeight="700">Módulo: Gestión Académica</text>
            <circle cx="395" cy="245" r="5" fill="#0ea5e9" />
            <text x="406" y="249" fill="#e2e8f0" fontSize="10" fontStyle="italic">IGrupoCatalogService</text>
            <circle cx="395" cy="270" r="5" fill="#0ea5e9" />
            <text x="406" y="274" fill="#e2e8f0" fontSize="10" fontStyle="italic">IEstudianteCatalog</text>
            <text x="395" y="305" fill="#94a3b8" fontSize="10">Programas, Mallas, Asignaturas</text>
            <text x="395" y="325" fill="#94a3b8" fontSize="10">Grupos, Cupos base y Periodos</text>
          </g>

          {/* Module 3: Matrículas (Core) */}
          <g className="cursor-pointer" onClick={() => setSelectedModuleId('mod-matricula')}>
            <rect x="730" y="195" width="300" height="150" rx="8" fill={selectedModuleId === 'mod-matricula' ? '#451a03' : '#0f172a'} stroke="#f59e0b" strokeWidth={selectedModuleId === 'mod-matricula' ? '2.5' : '1.5'} />
            <text x="745" y="220" fill="#fcd34d" fontSize="12" fontWeight="700">Módulo: Matrículas (ACID Core)</text>
            <circle cx="745" cy="245" r="5" fill="#f59e0b" />
            <text x="756" y="249" fill="#e2e8f0" fontSize="10" fontStyle="italic">IMatriculaService</text>
            <circle cx="745" cy="270" r="5" fill="#f59e0b" />
            <text x="756" y="274" fill="#e2e8f0" fontSize="10" fontStyle="italic">ICupoValidator</text>
            <text x="745" y="305" fill="#94a3b8" fontSize="10">Transaccionalidad pesimista</text>
            <text x="745" y="325" fill="#94a3b8" fontSize="10">Prevención de cruces y sobrecupo</text>
          </g>

          {/* Module 4: Calificaciones */}
          <g className="cursor-pointer" onClick={() => setSelectedModuleId('mod-calif')}>
            <rect x="70" y="375" width="280" height="150" rx="8" fill={selectedModuleId === 'mod-calif' ? '#022c22' : '#0f172a'} stroke="#10b981" strokeWidth={selectedModuleId === 'mod-calif' ? '2.5' : '1.5'} />
            <text x="85" y="400" fill="#6ee7b7" fontSize="12" fontWeight="700">Módulo: Calificaciones</text>
            <circle cx="85" cy="425" r="5" fill="#10b981" />
            <text x="96" y="429" fill="#e2e8f0" fontSize="10" fontStyle="italic">ICalificacionesService</text>
            <circle cx="85" cy="450" r="5" fill="#10b981" />
            <text x="96" y="454" fill="#e2e8f0" fontSize="10" fontStyle="italic">IPromedioCalculator</text>
            <text x="85" y="485" fill="#94a3b8" fontSize="10">Registro de notas por cortes</text>
            <text x="85" y="505" fill="#94a3b8" fontSize="10">Actas y cálculo de definitivas</text>
          </g>

          {/* Module 5: Reportes */}
          <g className="cursor-pointer" onClick={() => setSelectedModuleId('mod-reportes')}>
            <rect x="380" y="375" width="320" height="150" rx="8" fill={selectedModuleId === 'mod-reportes' ? '#1e293b' : '#0f172a'} stroke="#64748b" strokeWidth={selectedModuleId === 'mod-reportes' ? '2.5' : '1.5'} />
            <text x="395" y="400" fill="#cbd5e1" fontSize="12" fontWeight="700">Módulo: Reportes & Estadísticas</text>
            <circle cx="395" cy="425" r="5" fill="#94a3b8" />
            <text x="406" y="429" fill="#e2e8f0" fontSize="10" fontStyle="italic">IReportService</text>
            <text x="395" y="465" fill="#94a3b8" fontSize="10">Exportador PDF (Boletines, actas)</text>
            <text x="395" y="485" fill="#94a3b8" fontSize="10">Exportador Excel (Sábanas de notas)</text>
            <text x="395" y="505" fill="#94a3b8" fontSize="10">Vistas de solo lectura desacopladas</text>
          </g>

          {/* Module 6: Auditoría (Cross-Cutting) */}
          <g className="cursor-pointer" onClick={() => setSelectedModuleId('mod-audit')}>
            <rect x="730" y="375" width="300" height="150" rx="8" fill={selectedModuleId === 'mod-audit' ? '#311042' : '#0f172a'} stroke="#c084fc" strokeWidth={selectedModuleId === 'mod-audit' ? '2.5' : '1.5'} />
            <text x="745" y="400" fill="#e9d5ff" fontSize="12" fontWeight="700">Módulo Transversal: Auditoría</text>
            <circle cx="745" cy="425" r="5" fill="#c084fc" />
            <text x="756" y="429" fill="#e2e8f0" fontSize="10" fontStyle="italic">IAuditoriaService</text>
            <text x="745" y="465" fill="#94a3b8" fontSize="10">Log de eventos inmutables</text>
            <text x="745" y="485" fill="#94a3b8" fontSize="10">Registro de IP, usuario y payload</text>
            <text x="745" y="505" fill="#94a3b8" fontSize="10">Append-Only Policy sin mutaciones</text>
          </g>

          {/* Internal In-Memory Inter-Module Connectors */}
          {/* Matrícula uses Gestión Académica */}
          <path d="M 730 270 L 700 270" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#dep-arrow)" />
          {/* Matrícula uses Auditoría */}
          <path d="M 880 345 L 880 375" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#dep-arrow)" />
          {/* Calificaciones uses Auditoría */}
          <path d="M 350 450 L 730 450" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#dep-arrow)" />

          {/* Bottom Persistence Tier */}
          <rect x="50" y="590" width="1000" height="75" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <text x="70" y="612" fill="#94a3b8" fontSize="11" fontWeight="700">PERSISTENCIA & CACHÉ: POSTGRESQL 16 (ESQUEMAS SEGREGADOS) + REDIS</text>

          <g>
            <rect x="70" y="622" width="180" height="32" rx="4" fill="#1e293b" stroke="#6366f1" strokeWidth="1" />
            <text x="80" y="642" fill="#c7d2fe" fontSize="10" fontWeight="600">Esquema: Seguridad</text>
          </g>
          <g>
            <rect x="270" y="622" width="200" height="32" rx="4" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />
            <text x="280" y="642" fill="#bae6fd" fontSize="10" fontWeight="600">Esquema: Gestión Académica</text>
          </g>
          <g>
            <rect x="490" y="622" width="220" height="32" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
            <text x="500" y="642" fill="#fef08a" fontSize="10" fontWeight="600">Esquema: Matrícula & Notas</text>
          </g>
          <g>
            <rect x="730" y="622" width="160" height="32" rx="4" fill="#1e293b" stroke="#c084fc" strokeWidth="1" />
            <text x="740" y="642" fill="#f3e8ff" fontSize="10" fontWeight="600">Esquema: Auditoría (Append)</text>
          </g>
          <g>
            <rect x="910" y="622" width="120" height="32" rx="4" fill="#1e293b" stroke="#ef4444" strokeWidth="1" />
            <text x="920" y="642" fill="#fca5a5" fontSize="10" fontWeight="600">Redis (Caché)</text>
          </g>
        </svg>
      </div>

      {/* Selected Module Detail */}
      {selectedModule && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{selectedModule.name}</h4>
                <span className="text-xs text-indigo-400 font-mono">Capa: {selectedModule.layer}</span>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              Frontera: {selectedModule.cleanArchBoundary}
            </span>
          </div>

          <p className="text-sm text-slate-300 mb-4 leading-relaxed">{selectedModule.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <h5 className="font-semibold text-slate-300 mb-2">Responsabilidades del Módulo:</h5>
              <ul className="space-y-1.5 text-slate-400">
                {selectedModule.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <h5 className="font-semibold text-slate-300 mb-2">Interfaces Públicas Exportadas (Ports):</h5>
              <div className="space-y-1.5">
                {selectedModule.exportedInterfaces.map((iface, i) => (
                  <div key={i} className="px-2.5 py-1 rounded bg-slate-800 text-indigo-300 font-mono text-[11px] border border-slate-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{iface}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <h5 className="font-semibold text-slate-300 mb-2">Dependencias Permitidas:</h5>
              <div className="space-y-1.5">
                {selectedModule.dependencies.length > 0 ? (
                  selectedModule.dependencies.map((dep, i) => (
                    <div key={i} className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dep}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-500 italic">Módulo autónomo base (sin dependencias salientes)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete PlantUML Code Viewer with Analysis */}
      <PlantUmlViewer
        title="Código Fuente PlantUML - Diagrama de Componentes (Entregable B)"
        filename="sga_componentes_monolito"
        code={PLANTUML_DIAGRAMS.components}
        description="Ilustra la arquitectura de Monolito Modular con Clean Architecture, modelando los 7 módulos funcionales, sus interfaces (puertos), dependencias acotadas en memoria y el esquema segregado de base de datos relacional PostgreSQL con caché Redis."
        componentsExplanation={componentsExplanation}
        modelingDecisions={modelingDecisions}
        assumptions={assumptions}
      />
    </div>
  );
};
