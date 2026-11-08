import React, { useState } from 'react';
import { PLANTUML_DIAGRAMS } from '../../data/acaData';
import { PlantUmlViewer } from '../common/PlantUmlViewer';
import { PlayCircle, ShieldCheck, Database, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface StepMeta {
  step: number;
  title: string;
  source: string;
  target: string;
  payload: string;
  description: string;
  isDbTransaction?: boolean;
}

export const SequenceDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(7);

  const steps: StepMeta[] = [
    {
      step: 1,
      title: "Selección de grupo",
      source: "Estudiante",
      target: "UI Cliente Web (React)",
      payload: "idGrupo: 'GRP-MAT-01'",
      description: "El estudiante visualiza la oferta de asignaturas y selecciona el grupo deseado. El cliente valida prerrequisitos visuales y disponibilidad antes de enviar."
    },
    {
      step: 2,
      title: "Envío de solicitud",
      source: "UI Cliente Web",
      target: "MatriculaController (REST)",
      payload: "POST /api/v1/matriculas, Header: Bearer <JWT>",
      description: "Petición HTTP cifrada con el token de acceso JWT y el cuerpo JSON con los identificadores del grupo y el estudiante."
    },
    {
      step: 3,
      title: "Validación de autenticación",
      source: "MatriculaController",
      target: "AuthService / JWT Provider",
      payload: "validateToken(jwt)",
      description: "El guard interceptor valida la firma criptográfica RSA-256 del token JWT, vigila que no esté revocado en Redis y extrae los claims del usuario."
    },
    {
      step: 4,
      title: "Verificación de permisos",
      source: "MatriculaController",
      target: "AuthService / RBAC Policy",
      payload: "checkPermission(idUsuario, 'MATRICULA_REALIZAR')",
      description: "Comprueba que el rol activo corresponda a ESTUDIANTE con permiso vigente para realizar inscripciones en el periodo en curso."
    },
    {
      step: 5,
      title: "Validación de cupo (Bloqueo Pesimista)",
      source: "MatriculaService",
      target: "PostgreSQL Database",
      payload: "BEGIN; SELECT cupo_maximo, cupos_ocupados FROM Grupo WHERE id_grupo = ? FOR UPDATE;",
      description: "Inicio de transacción ACID. Se adquiere un bloqueo pesimista de fila (Row-Level Lock) exclusivo para el grupo seleccionado para evitar carreras bajo 300 usuarios concurrentes.",
      isDbTransaction: true
    },
    {
      step: 6,
      title: "Verificación de matrícula duplicada",
      source: "MatriculaService",
      target: "PostgreSQL Database",
      payload: "SELECT COUNT(*) FROM Matricula WHERE id_estudiante = ? AND id_grupo = ? AND estado != 'CANCELADA';",
      description: "Se confirma que el estudiante no tenga una inscripción previa activa en la misma asignatura o grupo, evitando doble cobro o doble registro.",
      isDbTransaction: true
    },
    {
      step: 7,
      title: "Registro transaccional atómico",
      source: "MatriculaService",
      target: "PostgreSQL Database",
      payload: "INSERT INTO Matricula (...); UPDATE Grupo SET cupos_ocupados = cupos_ocupados + 1; COMMIT;",
      description: "Inserción del registro de matrícula con estado 'REGISTRADA', incremento atómico del contador de cupos y consolidación (COMMIT) de la transacción ACID.",
      isDbTransaction: true
    },
    {
      step: 8,
      title: "Registro de auditoría (No Repudio)",
      source: "MatriculaService",
      target: "AuditoriaService",
      payload: "registrarEventoAuditoria({ usuario: idEstudiante, accion: 'MATRICULA_EXITOSA', ip, timestamp })",
      description: "Emisión de evento de dominio hacia el módulo de auditoría. Se almacena un registro inmutable append-only con los datos de la transacción para fines legales y regulatorios."
    },
    {
      step: 9,
      title: "Confirmación al estudiante",
      source: "MatriculaController",
      target: "Estudiante (UI)",
      payload: "HTTP 201 Created { status: 'SUCCESS', comprobante: 'MAT-2026-9812' }",
      description: "Respuesta exitosa al navegador con el número de comprobante institucional, horario consolidado y actualización inmediata del kárdex del estudiante."
    }
  ];

  const modelingDecisions = [
    "Secuencia exacta de 9 pasos según requerimientos del ACA: Cumple rigurosamente el orden prescrito desde la selección hasta la confirmación final.",
    "Uso de Bloqueo Pesimista 'SELECT ... FOR UPDATE' en Paso 5: Evita la condición de carrera ('race condition') donde dos o más estudiantes ven el último cupo disponible y ambos intentan registrarlo simultáneamente.",
    "Límites Transaccionales Explícitos (BEGIN / COMMIT / ROLLBACK): Los pasos 5, 6 y 7 ocurren dentro de la misma frontera transaccional relacional, garantizando atomicidad total.",
    "Flujo Alternativo (alt / else) en PlantUML: Modela qué ocurre cuando el cupo está agotado o existe duplicado: se ejecuta ROLLBACK inmediato, se audita el rechazo y se retorna HTTP 409 Conflict.",
    "Auditoría no bloqueante o desacoplada: El paso 8 se ejecuta inmediatamente tras el commit transaccional para garantizar que la matrícula ya fue persistida antes de registrar el evento exitoso."
  ];

  const assumptions = [
    "El estudiante ya ha iniciado sesión en el sistema y dispone de un token JWT válido en su navegador.",
    "El periodo académico se encuentra en estado 'MATRICULA_ABIERTA' según el calendario institucional.",
    "La base de datos PostgreSQL opera con nivel de aislamiento por defecto 'READ COMMITTED', el cual combinado con 'FOR UPDATE' previene lecturas sucias y anomalías de serialización en el decremento de cupos."
  ];

  const componentsExplanation = [
    { name: "Estudiante (Actor)", role: "Iniciador del Flujo", description: "Usuario final que selecciona la asignatura e interactúa con el cliente web." },
    { name: "UI Cliente Web", role: "Boundary", description: "Componente React que gestiona el estado visual y realiza llamadas asíncronas fetch/axios." },
    { name: "MatriculaController", role: "Controller / Port", description: "Punto de entrada de la API REST que intercepta la solicitud y valida JWT/RBAC." },
    { name: "AuthService", role: "Security Service", description: "Verifica firma de tokens, claims del usuario y permisos granulares." },
    { name: "MatriculaService", role: "Application Service", description: "Orquesta la lógica del caso de uso de matrícula e invoca las interfaces necesarias." },
    { name: "CupoValidator", role: "Domain Service", description: "Verifica que el cupo ocupado no supere el cupo máximo configurado para el grupo." },
    { name: "PostgreSQL Database", role: "Entity Store (ACID)", description: "Ejecuta las sentencias SQL con soporte transaccional y bloqueos a nivel de fila." },
    { name: "AuditoriaService", role: "Cross-Cutting Service", description: "Persiste el evento inmutable de matrícula exitosa o rechazada para trazabilidad." }
  ];

  const activeStepData = steps.find(s => s.step === activeStep) || steps[6];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Entregable E
              </span>
              <h3 className="text-xl font-bold text-white">Diagrama de Secuencia UML: Proceso de Matrícula</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Flujo detallado y transaccional del proceso de matrícula de un estudiante a través de los 9 pasos exactos requeridos,
              incluyendo validación de autenticación, verificación de permisos, bloqueo de cupos pesimista, transacción ACID y auditoría.
            </p>
          </div>
        </div>
      </div>

      {/* 9-Step Interactive Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Pasos del Proceso de Matrícula (Haz clic en un paso para inspeccionar)</span>
          <span className="text-amber-400 font-mono">Paso activo: [{activeStep}/9]</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {steps.map(s => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-2.5 rounded-lg text-center transition flex flex-col items-center justify-between border ${
                activeStep === s.step
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span className="text-xs font-mono font-bold">Paso {s.step}</span>
              <span className="text-[10px] truncate max-w-full mt-1 font-medium">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Vector SVG Sequence Diagram */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto shadow-2xl">
        <div className="text-xs text-slate-500 font-mono mb-2 flex items-center justify-between">
          <span>Vista Vectorial de Líneas de Vida y Mensajes (Haz clic en los números para inspeccionar el paso)</span>
          <span className="text-[11px] text-amber-400">OMG UML 2.5 Sequence Specification</span>
        </div>

        <svg id="diagram-svg-sequence" viewBox="0 0 1150 700" className="w-full min-w-[950px] h-auto select-none font-sans">
          <defs>
            <marker id="seq-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
            <marker id="seq-ret" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
            </marker>
            <marker id="seq-acid" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Participant Lifelines (Vertical dashed lines) */}
          <line x1="70" y1="50" x2="70" y2="670" stroke="#475569" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1="200" y1="50" x2="200" y2="670" stroke="#475569" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1="350" y1="50" x2="350" y2="670" stroke="#475569" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1="490" y1="50" x2="490" y2="670" stroke="#475569" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1="640" y1="50" x2="640" y2="670" stroke="#475569" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1="780" y1="50" x2="780" y2="670" stroke="#475569" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1="930" y1="50" x2="930" y2="670" stroke="#475569" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1="1070" y1="50" x2="1070" y2="670" stroke="#475569" strokeWidth="1.5" strokeDasharray="5 4" />

          {/* Participants Top Headers */}
          <g>
            <rect x="20" y="15" width="100" height="34" rx="6" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="70" y="36" fill="#fde047" fontSize="11" fontWeight="700" textAnchor="middle">Estudiante</text>
          </g>
          <g>
            <rect x="150" y="15" width="100" height="34" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="200" y="36" fill="#7dd3fc" fontSize="11" fontWeight="700" textAnchor="middle">UI Web (SPA)</text>
          </g>
          <g>
            <rect x="295" y="15" width="110" height="34" rx="6" fill="#0f172a" stroke="#818cf8" strokeWidth="1.5" />
            <text x="350" y="36" fill="#c7d2fe" fontSize="10.5" fontWeight="700" textAnchor="middle">MatriculaCtrl</text>
          </g>
          <g>
            <rect x="440" y="15" width="100" height="34" rx="6" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="490" y="36" fill="#fda4af" fontSize="11" fontWeight="700" textAnchor="middle">AuthService</text>
          </g>
          <g>
            <rect x="585" y="15" width="110" height="34" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
            <text x="640" y="36" fill="#6ee7b7" fontSize="11" fontWeight="700" textAnchor="middle">MatriculaServ</text>
          </g>
          <g>
            <rect x="730" y="15" width="100" height="34" rx="6" fill="#0f172a" stroke="#a3e635" strokeWidth="1.5" />
            <text x="780" y="36" fill="#bef264" fontSize="10.5" fontWeight="700" textAnchor="middle">CupoValidator</text>
          </g>
          <g>
            <rect x="875" y="15" width="110" height="34" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="930" y="36" fill="#6ee7b7" fontSize="11" fontWeight="700" textAnchor="middle">PostgreSQL 16</text>
          </g>
          <g>
            <rect x="1015" y="15" width="110" height="34" rx="6" fill="#0f172a" stroke="#c084fc" strokeWidth="1.5" />
            <text x="1070" y="36" fill="#e9d5ff" fontSize="11" fontWeight="700" textAnchor="middle">AuditoriaServ</text>
          </g>

          {/* Activation Boxes */}
          <rect x="66" y="80" width="8" height="520" fill="#f59e0b" rx="2" />
          <rect x="196" y="85" width="8" height="505" fill="#38bdf8" rx="2" />
          <rect x="346" y="130" width="8" height="450" fill="#818cf8" rx="2" />
          <rect x="486" y="170" width="8" height="85" fill="#f43f5e" rx="2" />
          <rect x="636" y="270" width="8" height="295" fill="#10b981" rx="2" />
          <rect x="776" y="315" width="8" height="40" fill="#a3e635" rx="2" />
          <rect x="926" y="330" width="8" height="170" fill="#10b981" rx="2" />
          <rect x="1066" y="515" width="8" height="35" fill="#c084fc" rx="2" />

          {/* MESSAGE 1: Selecciona Grupo */}
          <g className="cursor-pointer" onClick={() => setActiveStep(1)}>
            <path d="M 74 95 L 194 95" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#seq-arrow)" />
            <rect x="85" y="82" width="100" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
            <text x="135" y="95" fill="#38bdf8" fontSize="10" fontWeight="700" textAnchor="middle">[01] Selecciona Grupo</text>
          </g>

          {/* MESSAGE 2: POST /api/v1/matriculas */}
          <g className="cursor-pointer" onClick={() => setActiveStep(2)}>
            <path d="M 204 140 L 344 140" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#seq-arrow)" />
            <rect x="215" y="127" width="120" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
            <text x="275" y="140" fill="#38bdf8" fontSize="10" fontWeight="700" textAnchor="middle">[02] POST /matriculas (JWT)</text>
          </g>

          {/* MESSAGE 3: validateToken */}
          <g className="cursor-pointer" onClick={() => setActiveStep(3)}>
            <path d="M 354 185 L 484 185" stroke="#f43f5e" strokeWidth="1.8" markerEnd="url(#seq-arrow)" />
            <text x="420" y="178" fill="#fda4af" fontSize="9.5" textAnchor="middle">[03] validateToken(RSA-256)</text>
            <path d="M 484 210 L 354 210" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 2" markerEnd="url(#seq-ret)" />
            <text x="420" y="205" fill="#94a3b8" fontSize="8.5" textAnchor="middle">3.1 Token Válido (Claims)</text>
          </g>

          {/* MESSAGE 4: checkPermission */}
          <g className="cursor-pointer" onClick={() => setActiveStep(4)}>
            <path d="M 354 235 L 484 235" stroke="#f43f5e" strokeWidth="1.8" markerEnd="url(#seq-arrow)" />
            <text x="420" y="228" fill="#fda4af" fontSize="9.5" textAnchor="middle">[04] checkPermission(RBAC)</text>
            <path d="M 484 250 L 354 250" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 2" markerEnd="url(#seq-ret)" />
            <text x="420" y="246" fill="#94a3b8" fontSize="8.5" textAnchor="middle">4.1 Permiso Otorgado</text>
          </g>

          {/* Dispatch to MatriculaService */}
          <path d="M 354 280 L 634 280" stroke="#818cf8" strokeWidth="2" markerEnd="url(#seq-arrow)" />
          <text x="495" y="274" fill="#c7d2fe" fontSize="10" textAnchor="middle">procesarMatricula(idEstudiante, idGrupo)</text>

          {/* MESSAGE 5: Validar Cupo + SELECT FOR UPDATE */}
          <g className="cursor-pointer" onClick={() => setActiveStep(5)}>
            <path d="M 644 325 L 774 325" stroke="#a3e635" strokeWidth="1.8" markerEnd="url(#seq-arrow)" />
            <text x="710" y="318" fill="#bef264" fontSize="9.5" textAnchor="middle">[05] verificarCupo()</text>

            <path d="M 784 340 L 924 340" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#seq-acid)" />
            <text x="855" y="334" fill="#fde047" fontSize="9.5" fontWeight="700" textAnchor="middle">BEGIN; SELECT ... FOR UPDATE</text>

            <path d="M 924 358 L 644 358" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 2" markerEnd="url(#seq-ret)" />
            <text x="785" y="354" fill="#94a3b8" fontSize="8.5" textAnchor="middle">5.1 Cupo Disponible (28/30 ocupados)</text>
          </g>

          {/* MESSAGE 6: Verificación de Duplicado */}
          <g className="cursor-pointer" onClick={() => setActiveStep(6)}>
            <path d="M 644 395 L 924 395" stroke="#10b981" strokeWidth="1.8" markerEnd="url(#seq-arrow)" />
            <text x="785" y="388" fill="#6ee7b7" fontSize="9.5" textAnchor="middle">[06] SELECT COUNT(*) duplicado</text>
            <path d="M 924 412 L 644 412" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 2" markerEnd="url(#seq-ret)" />
            <text x="785" y="408" fill="#94a3b8" fontSize="8.5" textAnchor="middle">count = 0 (Sin duplicado previo)</text>
          </g>

          {/* ALT FRAGMENT BOX: Cupo disponible y sin duplicidad */}
          <rect x="50" y="430" width="1070" height="215" rx="8" fill="#064e3b" fillOpacity="0.08" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" />
          <rect x="50" y="430" width="220" height="22" rx="4" fill="#064e3b" />
          <text x="60" y="445" fill="#a7f3d0" fontSize="10" fontWeight="700">alt [Cupo disponible y sin duplicidad]</text>

          {/* MESSAGE 7: Registro Transaccional ACID */}
          <g className="cursor-pointer" onClick={() => setActiveStep(7)}>
            <path d="M 644 470 L 924 470" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#seq-acid)" />
            <text x="785" y="463" fill="#fde047" fontSize="10" fontWeight="700" textAnchor="middle">
              [07] INSERT Matricula; UPDATE Grupo cupos+1; COMMIT;
            </text>
            <path d="M 924 490 L 644 490" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 2" markerEnd="url(#seq-ret)" />
            <text x="785" y="486" fill="#94a3b8" fontSize="8.5" textAnchor="middle">Transacción Confirmada con Éxito (ACID)</text>
          </g>

          {/* MESSAGE 8: Auditoría */}
          <g className="cursor-pointer" onClick={() => setActiveStep(8)}>
            <path d="M 644 525 L 1064 525" stroke="#c084fc" strokeWidth="2" markerEnd="url(#seq-arrow)" />
            <text x="850" y="518" fill="#e9d5ff" fontSize="9.5" fontWeight="600" textAnchor="middle">
              [08] registrarEventoAuditoria(usuario, 'MATRICULA_EXITOSA', IP, timestamp)
            </text>
            <path d="M 1064 542 L 644 542" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 2" markerEnd="url(#seq-ret)" />
            <text x="850" y="538" fill="#94a3b8" fontSize="8.5" textAnchor="middle">Auditoría Asentada (Append-Only)</text>
          </g>

          {/* MESSAGE 9: Confirmación al Estudiante */}
          <g className="cursor-pointer" onClick={() => setActiveStep(9)}>
            <path d="M 634 570 L 354 570" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 2" markerEnd="url(#seq-ret)" />
            <text x="495" y="563" fill="#7dd3fc" fontSize="9.5" textAnchor="middle">Matrícula DTO Confirmada</text>

            <path d="M 344 585 L 204 585" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" markerEnd="url(#seq-ret)" />
            <text x="275" y="580" fill="#38bdf8" fontSize="9.5" fontWeight="700" textAnchor="middle">[09] HTTP 201 Created</text>

            <path d="M 194 605 L 74 605" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#seq-arrow)" />
            <text x="135" y="600" fill="#fde047" fontSize="10" fontWeight="700" textAnchor="middle">Muestra Comprobante</text>
          </g>

          {/* ELSE Branch delimiter */}
          <line x1="50" y1="620" x2="1120" y2="620" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 3" />
          <text x="60" y="635" fill="#fca5a5" fontSize="9.5" fontWeight="700">[else: Cupo Agotado o Duplicado] ROLLBACK; HTTP 409 Conflict</text>
        </svg>
      </div>

      {/* Step Inspector Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-base font-mono">
              0{activeStepData.step}
            </span>
            <div>
              <h4 className="text-base font-bold text-white">{activeStepData.title}</h4>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                <span className="text-indigo-400">{activeStepData.source}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-emerald-400">{activeStepData.target}</span>
              </div>
            </div>
          </div>

          {activeStepData.isDbTransaction && (
            <span className="text-xs font-mono px-3 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Transacción ACID PostgreSQL</span>
            </span>
          )}
        </div>

        <p className="text-sm text-slate-300 mb-4 leading-relaxed">{activeStepData.description}</p>

        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-slate-500 block mb-1">Payload / Llamada Técnica:</span>
          <code className="text-emerald-400">{activeStepData.payload}</code>
        </div>
      </div>

      {/* Complete PlantUML Code Viewer with Analysis */}
      <PlantUmlViewer
        title="Código Fuente PlantUML - Diagrama de Secuencia (Entregable E)"
        filename="sga_secuencia_matricula"
        code={PLANTUML_DIAGRAMS.sequence}
        description="Modelado formal del ciclo de vida de la transacción de matrícula académica en 9 pasos rigurosos. Incluye validación de token JWT, comprobación de permisos RBAC, inicio de transacción con SELECT FOR UPDATE en PostgreSQL, verificación de duplicados, commit atómico, emisión de evento a auditoría y notificación al estudiante, contemplando ramas alternativas para cupo agotado o conflicto."
        componentsExplanation={componentsExplanation}
        modelingDecisions={modelingDecisions}
        assumptions={assumptions}
      />
    </div>
  );
};
