import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle, ShieldCheck, Database, FileText, ArrowRight, Clock, AlertCircle } from 'lucide-react';

interface GroupOption {
  id: string;
  code: string;
  subject: string;
  teacher: string;
  schedule: string;
  maxQuota: number;
  occupiedQuota: number;
}

export const EnrollmentSimulator: React.FC = () => {
  const initialGroups: GroupOption[] = [
    {
      id: "GRP-ARQ-01",
      code: "AS-301",
      subject: "Arquitectura de Software",
      teacher: "Ing. Carlos Mendoza (Especialista)",
      schedule: "Mar y Jue 18:00 - 20:00 (Aula 402)",
      maxQuota: 30,
      occupiedQuota: 28 // 2 cupos libres
    },
    {
      id: "GRP-BD-02",
      code: "BD-201",
      subject: "Bases de Datos Avanzadas",
      teacher: "Dra. Martha Gutiérrez",
      schedule: "Lun y Mie 18:00 - 20:00 (Lab 103)",
      maxQuota: 25,
      occupiedQuota: 25 // Cupo Agotado
    },
    {
      id: "GRP-ING-03",
      code: "IS-401",
      subject: "Ingeniería de Requisitos",
      teacher: "Ing. Roberto Peña",
      schedule: "Sábados 08:00 - 12:00 (Aula 205)",
      maxQuota: 35,
      occupiedQuota: 12 // 23 cupos libres
    }
  ];

  const [groups, setGroups] = useState<GroupOption[]>(initialGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("GRP-ARQ-01");
  const [simState, setSimState] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [logs, setLogs] = useState<{ step: number; title: string; detail: string; status: 'pending' | 'success' | 'failed' }[]>([]);
  const [enrolledGroups, setEnrolledGroups] = useState<string[]>([]);
  const [receiptNumber, setReceiptNumber] = useState<string | null>(null);

  const selectedGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  const resetSimulation = () => {
    setGroups(initialGroups);
    setSimState('idle');
    setCurrentStepIndex(0);
    setLogs([]);
    setEnrolledGroups([]);
    setReceiptNumber(null);
  };

  const runEnrollmentFlow = async () => {
    if (simState === 'running') return;
    setSimState('running');
    setLogs([]);
    setCurrentStepIndex(1);

    const isDuplicate = enrolledGroups.includes(selectedGroup.id);
    const hasQuota = selectedGroup.occupiedQuota < selectedGroup.maxQuota;

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    // Step 1: Selección de Grupo
    setLogs(prev => [...prev, {
      step: 1,
      title: "1. Selección de grupo",
      detail: `Estudiante selecciona grupo ${selectedGroup.code} (${selectedGroup.subject}) en interfaz SPA.`,
      status: 'success'
    }]);
    await delay(350);

    // Step 2: Envío de Solicitud
    setCurrentStepIndex(2);
    setLogs(prev => [...prev, {
      step: 2,
      title: "2. Envío de solicitud HTTP POST",
      detail: `POST /api/v1/matriculas con Header: Bearer eyJhbGciOiJSUzI1Ni... Payload: { idGrupo: '${selectedGroup.id}' }`,
      status: 'success'
    }]);
    await delay(400);

    // Step 3: Validación de Autenticación
    setCurrentStepIndex(3);
    setLogs(prev => [...prev, {
      step: 3,
      title: "3. Validación criptográfica de autenticación",
      detail: `Token JWT validado contra clave pública RSA-256. Claims: sub='usr-est-4921', rol='ESTUDIANTE', exp=Válido.`,
      status: 'success'
    }]);
    await delay(350);

    // Step 4: Verificación de Permisos RBAC
    setCurrentStepIndex(4);
    setLogs(prev => [...prev, {
      step: 4,
      title: "4. Verificación de permisos de usuario",
      detail: `RBAC Engine confirma permiso 'MATRICULA_REALIZAR' para periodo activo 2026-1.`,
      status: 'success'
    }]);
    await delay(350);

    // Step 5: Validación de Cupo
    setCurrentStepIndex(5);
    setLogs(prev => [...prev, {
      step: 5,
      title: "5. Validación de cupo con bloqueo pesimista",
      detail: `BEGIN TRANSACTION; SELECT cupo_maximo, cupos_ocupados FROM Grupo WHERE id_grupo = '${selectedGroup.id}' FOR UPDATE; Ocupados: ${selectedGroup.occupiedQuota}/${selectedGroup.maxQuota}.`,
      status: hasQuota ? 'success' : 'failed'
    }]);
    await delay(450);

    if (!hasQuota) {
      // Branch failure: cupo agotado
      setLogs(prev => [...prev, {
        step: 5,
        title: "ROLLBACK: Cupo agotado",
        detail: `Excepción CupoAgotadoException. La transacción PostgreSQL se revierte inmediatamente para liberar bloqueos.`,
        status: 'failed'
      }]);
      await delay(300);

      // Audit rejection
      setLogs(prev => [...prev, {
        step: 8,
        title: "8. Registro de auditoría (Rechazo)",
        detail: `INSERT INTO AuditoriaLog (accion='MATRICULA_RECHAZADA_SIN_CUPO', usuario='usr-est-4921', ip='190.84.12.5');`,
        status: 'failed'
      }]);
      await delay(250);

      setSimState('failed');
      return;
    }

    // Step 6: Verificación de duplicado
    setCurrentStepIndex(6);
    setLogs(prev => [...prev, {
      step: 6,
      title: "6. Verificación de matrícula duplicada",
      detail: `SELECT COUNT(*) FROM Matricula WHERE id_estudiante = 'usr-est-4921' AND id_grupo = '${selectedGroup.id}'; Registros previos: ${isDuplicate ? '1 (CONFLICTO)' : '0 (OK)'}.`,
      status: isDuplicate ? 'failed' : 'success'
    }]);
    await delay(400);

    if (isDuplicate) {
      setLogs(prev => [...prev, {
        step: 6,
        title: "ROLLBACK: Matrícula Duplicada",
        detail: `Conflicto detectado: El estudiante ya se encuentra matriculado en este grupo. Transacción abortada.`,
        status: 'failed'
      }]);
      setSimState('failed');
      return;
    }

    // Step 7: Registro Transaccional
    setCurrentStepIndex(7);
    const newReceipt = `CUN-MAT-${Math.floor(100000 + Math.random() * 900000)}`;
    setReceiptNumber(newReceipt);

    // Update group occupied quota
    setGroups(prev => prev.map(g => g.id === selectedGroup.id ? { ...g, occupiedQuota: g.occupiedQuota + 1 } : g));
    setEnrolledGroups(prev => [...prev, selectedGroup.id]);

    setLogs(prev => [...prev, {
      step: 7,
      title: "7. Registro transaccional atómico (ACID)",
      detail: `INSERT INTO Matricula (id_matricula=UUID, estado='REGISTRADA'); UPDATE Grupo SET cupos_ocupados = cupos_ocupados + 1; COMMIT;`,
      status: 'success'
    }]);
    await delay(450);

    // Step 8: Registro de Auditoría
    setCurrentStepIndex(8);
    setLogs(prev => [...prev, {
      step: 8,
      title: "8. Registro de pista de auditoría inmutable",
      detail: `INSERT INTO AuditoriaLog (usuario='usr-est-4921', accion='MATRICULA_EXITOSA', tabla='matricula', comprobante='${newReceipt}');`,
      status: 'success'
    }]);
    await delay(400);

    // Step 9: Confirmación al Estudiante
    setCurrentStepIndex(9);
    setLogs(prev => [...prev, {
      step: 9,
      title: "9. Confirmación exitosa al estudiante",
      detail: `HTTP 201 Created retornado al cliente web. Comprobante formal: ${newReceipt}. Horario consolidado.`,
      status: 'success'
    }]);

    setSimState('success');
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Laboratorio Interactivo
              </span>
              <h3 className="text-xl font-bold text-white">Simulador de Transacción de Matrícula (Diagrama E)</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Experimenta en tiempo real la ejecución paso a paso de los 9 pasos de la secuencia de matrícula.
              Prueba escenarios de éxito, sobrecupo (concurrencia) y detección de matrícula duplicada con transacciones ACID PostgreSQL.
            </p>
          </div>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Simulador</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Group Selection */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Seleccionar Asignatura y Grupo Ofertado
            </h4>

            <div className="space-y-2.5">
              {groups.map(grp => {
                const isSelected = selectedGroupId === grp.id;
                const isEnrolled = enrolledGroups.includes(grp.id);
                const isFull = grp.occupiedQuota >= grp.maxQuota;

                return (
                  <div
                    key={grp.id}
                    onClick={() => {
                      if (simState !== 'running') {
                        setSelectedGroupId(grp.id);
                      }
                    }}
                    className={`p-3.5 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white text-xs">{grp.subject}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {grp.code}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mb-2">{grp.teacher}</div>
                    <div className="text-[11px] text-slate-500 mb-2 font-mono">{grp.schedule}</div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                      <span className="text-slate-400 text-[11px]">Cupos Ocupados:</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold text-xs ${isFull ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {grp.occupiedQuota} / {grp.maxQuota}
                        </span>
                        {isFull && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold">
                            AGOTADO
                          </span>
                        )}
                        {isEnrolled && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                            MATRICULADO
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={runEnrollmentFlow}
              disabled={simState === 'running'}
              className={`w-full mt-4 py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                simState === 'running'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {simState === 'running' ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Ejecutando Transacción...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Ejecutar Matrícula (Paso a Paso)</span>
                </>
              )}
            </button>
          </div>

          {/* Comprobante Result Card */}
          {receiptNumber && simState === 'success' && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h5 className="text-xs font-bold uppercase text-emerald-300">Comprobante Oficial Emitido</h5>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                La matrícula se consolidó con éxito en PostgreSQL bajo propiedades ACID.
              </p>
              <div className="bg-slate-950 p-2.5 rounded font-mono text-xs text-emerald-400 font-bold border border-emerald-800">
                Radicado: {receiptNumber}
              </div>
            </div>
          )}

          {simState === 'failed' && (
            <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                <h5 className="text-xs font-bold uppercase text-rose-300">Transacción Revertida (Rollback)</h5>
              </div>
              <p className="text-xs text-slate-300">
                La matrícula no pudo completarse debido a cupo agotado o duplicidad. La integridad de la base de datos se mantuvo intacta y se auditó el evento.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Execution Log & Stepper Visualizer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Bitácora de Ejecución de la Secuencia (9 Pasos)</span>
              </h4>

              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold ${
                simState === 'running'
                  ? 'bg-amber-500/20 text-amber-300'
                  : simState === 'success'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : simState === 'failed'
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                Estado: {simState.toUpperCase()}
              </span>
            </div>

            {/* Steps Log Feed */}
            {logs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Haz clic en <strong className="text-slate-300">"Ejecutar Matrícula"</strong> para observar la interacción entre el cliente web, los módulos del monolito modular y PostgreSQL.
              </div>
            ) : (
              <div className="space-y-2.5">
                {logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs transition ${
                      log.status === 'success'
                        ? 'bg-slate-950 border-emerald-500/30'
                        : log.status === 'failed'
                        ? 'bg-rose-950/30 border-rose-500/40'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        {log.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {log.status === 'failed' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                        <span>{log.title}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Paso {log.step}/9</span>
                    </div>
                    <p className="font-mono text-slate-300 text-[11px] leading-relaxed bg-slate-900/60 p-2 rounded mt-1 border border-slate-800">
                      {log.detail}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
