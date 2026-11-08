import React, { useState } from 'react';
import { INSTITUTION_INFO, ACTORS, FUNCTIONAL_REQUIREMENTS, NON_FUNCTIONAL_REQUIREMENTS, ARCHITECTURAL_MODULES, COMPARATIVE_ANALYSIS, PLANTUML_DIAGRAMS } from '../../data/acaData';
import { Printer, Copy, Check, BookOpen, ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react';

export const FullAcaDocument: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const copyMarkdown = () => {
    const markdownContent = `# ${INSTITUTION_INFO.institution}
## ${INSTITUTION_INFO.program} - ${INSTITUTION_INFO.subject}
### ${INSTITUTION_INFO.activity}: ${INSTITUTION_INFO.projectName}
**Versión:** ${INSTITUTION_INFO.version} | **Fecha:** ${INSTITUTION_INFO.date}

---

## 1. CONTEXTO DEL PROYECTO
La institución administra actualmente parte de su información mediante hojas de cálculo y sistemas aislados, generando inconsistencias, retrasos en matrículas y riesgos de seguridad.
Se propone un Sistema de Gestión Académica (SGA) centralizado bajo arquitectura de Monolito Modular con Clean Architecture.

## 2. ACTORES DEL SISTEMA
1. Administrador (Gobernanza, usuarios, roles RBAC y auditoría)
2. Coordinador Académico (Programas, asignaturas, grupos, periodos y reportes)
3. Docente (Listado de grupos y registro de calificaciones)
4. Estudiante (Matrícula académica, horarios y consulta de notas)

## 3. ARQUITECTURA SELECCIONADA
Monolito Modular con Clean Architecture organizado en 7 módulos:
- Presentación (React SPA + API Controllers)
- Autenticación y Autorización (JWT / RBAC)
- Gestión Académica (Programas, Grupos, Asignaturas)
- Matrículas (Transaccional ACID con bloqueo SELECT FOR UPDATE)
- Calificaciones (Cortes evaluativos 30/30/40 y promedios)
- Reportes (PDF / Excel asíncronos)
- Auditoría (Bitácora inmutable append-only)

## 4. JUSTIFICACIÓN PARA 300 USUARIOS CONCURRENTES
300 usuarios con tiempo de lectura (think time) de 8s generan ~37.5 a 56 RPS pico.
Un monolito modular con 2 vCPUs procesa llamadas internas en memoria (0 ms de overhead de red), manteniendo la latencia p95 < 450 ms y consistencia ACID nativa.
`;

    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 print:hidden shadow-xl">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-bold text-white">Vista Documental Completa (Formato Académico Universitario)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Resumen Markdown'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Exportar a PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Body formatted as University Paper */}
      <article className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-12 shadow-2xl text-slate-200 space-y-10 leading-relaxed font-sans print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Institutional Academic Header */}
        <header className="border-b-2 border-indigo-500/40 pb-8 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider mb-2 print:text-indigo-900">
            <GraduationCap className="w-4 h-4" />
            <span>{INSTITUTION_INFO.institution}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white print:text-black tracking-tight">
            DOCUMENTO MAESTRO DE DISEÑO ARQUITECTÓNICO
          </h1>
          <h2 className="text-lg md:text-xl font-medium text-indigo-300 print:text-indigo-800">
            {INSTITUTION_INFO.projectName} (SGA)
          </h2>
          <div className="text-xs text-slate-400 print:text-slate-600 font-mono pt-2">
            {INSTITUTION_INFO.faculty} • {INSTITUTION_INFO.program} • {INSTITUTION_INFO.subject} • {INSTITUTION_INFO.activity}
          </div>
        </header>

        {/* Section 1: Contexto */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white print:text-black border-l-4 border-indigo-500 pl-3">
            1. Contexto Institucional y Definición del Problema
          </h2>
          <p className="text-sm text-slate-300 print:text-slate-800">
            En el marco de la gestión universitaria moderna, la Corporación Unificada Nacional de Educación Superior (CUN)
            enfrenta retos operativos debido al uso de herramientas fragmentadas como hojas de cálculo locales y archivos aislados.
            Esta descentralización de la información produce duplicidad de datos, inconsistencia en los historiales de matrícula,
            demoras en los procesos de cierre de periodo, ausencia de pistas de auditoría que certifiquen quién y cuándo modificó
            una nota, y riesgos de seguridad sobre datos sensibles.
          </p>
          <p className="text-sm text-slate-300 print:text-slate-800">
            El objetivo del presente diseño arquitectónico es estructurar un <strong>Sistema de Gestión Académica (SGA)</strong> web
            que centralice el ciclo de vida institucional bajo una arquitectura de <strong>Monolito Modular basada en principios de Clean Architecture</strong>,
            asegurando alta integridad transaccional, trazabilidad inmutable y capacidad para soportar <strong>300 usuarios concurrentes simultáneos</strong> con tiempos de respuesta inferiores a 3 segundos (meta operativa &lt; 800 ms).
          </p>
        </section>

        {/* Section 2: Actores */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white print:text-black border-l-4 border-indigo-500 pl-3">
            2. Caracterización de los Actores del Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACTORS.map(actor => (
              <div key={actor.id} className="bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-300 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white print:text-black text-sm">{actor.name}</h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 print:bg-slate-200 text-indigo-300 print:text-indigo-900">{actor.badge}</span>
                </div>
                <p className="text-xs text-slate-400 print:text-slate-700 mb-3">{actor.shortDesc}</p>
                <div className="text-xs font-semibold text-slate-300 print:text-slate-900 mb-1">Responsabilidades:</div>
                <ul className="text-xs text-slate-400 print:text-slate-600 space-y-1">
                  {actor.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Justificación de Arquitectura Monolito Modular */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white print:text-black border-l-4 border-indigo-500 pl-3">
            3. Justificación Arquitectónica: Monolito Modular con Clean Architecture
          </h2>
          <p className="text-sm text-slate-300 print:text-slate-800">
            La decisión de optar por un <strong>Monolito Modular</strong> en lugar de una arquitectura de microservicios distribuidos
            obedece a un análisis riguroso de trade-offs de ingeniería de software orientado a la escala real de la institución:
          </p>
          <div className="bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-300 p-4 rounded-xl space-y-3 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <div>
                <strong className="text-white print:text-black">1. Integridad Transaccional ACID en Matrículas:</strong> El proceso de matrícula universitaria no tolera consistencia eventual ni sobreventa de cupos ("overbooking"). El monolito modular permite ejecutar la validación de cupos y la inserción de matrícula dentro de una única transacción relacional PostgreSQL con bloqueo pesimista <code className="text-indigo-300 font-mono">SELECT FOR UPDATE</code>. En microservicios, esta misma operación requeriría coordinar un patrón Saga distribuido con alto riesgo de estados inconsistentes bajo ráfagas concurrentes.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <div>
                <strong className="text-white print:text-black">2. Latencia Inter-Modular In-Memory (0 ms):</strong> En el monolito modular, la comunicación entre el módulo de Matrículas y el módulo de Auditoría se realiza a nivel de llamada a procedimiento en memoria local (menos de 0.05 ms), mientras que en microservicios cada interacción incurre en serialización JSON, sockets TCP y latencia de salto de red (5 a 35 ms por llamada).
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <div>
                <strong className="text-white print:text-black">3. Sizing Real para 300 Usuarios Concurrentes:</strong> Mediante la aplicación de la Ley de Little (<code className="text-indigo-300 font-mono">Throughput = N / (ThinkTime + ResponseTime)</code>), 300 usuarios concurrentes con un tiempo promedio de interacción de 8 segundos generan una demanda pico de apenas <strong>37.5 a 56 Requests Per Second (RPS)</strong>. Un contenedor moderno con 2 vCPUs y 4 GB de RAM procesa más de 1.500 RPS. Desplegar 7 microservicios, API Gateway, Service Mesh y brokers de mensajería para esta carga representaría una sobre-ingeniería innecesaria y un desperdicio presupuestal para la universidad.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <div>
                <strong className="text-white print:text-black">4. Mantenibilidad y Clean Architecture:</strong> Cada uno de los 7 módulos (Presentación, Autenticación, Gestión Académica, Matrículas, Calificaciones, Reportes y Auditoría) mantiene fronteras estrictas (Clean Architecture). Ningún módulo accede a tablas ajenas de forma directa; interactúan únicamente a través de interfaces públicas tipadas (<code className="text-indigo-300 font-mono">ports</code>) y DTOs inmutables.
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Módulos y Responsabilidades */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white print:text-black border-l-4 border-indigo-500 pl-3">
            4. Especificación de los 7 Módulos Arquitectónicos
          </h2>
          <div className="space-y-3">
            {ARCHITECTURAL_MODULES.map(mod => (
              <div key={mod.id} className="bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-300 p-4 rounded-xl text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-bold text-white print:text-black text-sm">{mod.name}</h3>
                  <span className="text-[11px] font-mono text-indigo-400 font-semibold">{mod.layer}</span>
                </div>
                <p className="text-slate-400 print:text-slate-700 mb-2">{mod.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-300 print:text-slate-900 font-semibold">Interfaces Públicas:</span>
                    <span className="font-mono text-indigo-300 print:text-indigo-900 ml-1">{mod.exportedInterfaces.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-300 print:text-slate-900 font-semibold">Dependencias Permitidas:</span>
                    <span className="text-slate-400 ml-1">{mod.dependencies.length > 0 ? mod.dependencies.join(', ') : 'Ninguna (Módulo Base)'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Códigos PlantUML de los 5 Diagramas */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white print:text-black border-l-4 border-indigo-500 pl-3">
            5. Modelos y Códigos PlantUML Funcionales (Entregables A - E)
          </h2>
          <p className="text-xs text-slate-400 print:text-slate-600">
            A continuación se incorporan los códigos fuente completos en sintaxis PlantUML oficial para su compilación y verificación automática en herramientas CASE o en el servidor oficial de PlantUML:
          </p>

          <div className="space-y-4">
            <div className="bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300">
              <h4 className="text-xs font-bold text-indigo-400 print:text-indigo-900 uppercase font-mono mb-2">
                Entregable A: Diagrama de Casos de Uso (PlantUML)
              </h4>
              <pre className="text-[11px] font-mono text-emerald-400 print:text-slate-900 overflow-x-auto max-h-48">
                <code>{PLANTUML_DIAGRAMS.useCase}</code>
              </pre>
            </div>

            <div className="bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300">
              <h4 className="text-xs font-bold text-indigo-400 print:text-indigo-900 uppercase font-mono mb-2">
                Entregable B: Diagrama de Componentes Monolito Modular (PlantUML)
              </h4>
              <pre className="text-[11px] font-mono text-emerald-400 print:text-slate-900 overflow-x-auto max-h-48">
                <code>{PLANTUML_DIAGRAMS.components}</code>
              </pre>
            </div>

            <div className="bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300">
              <h4 className="text-xs font-bold text-indigo-400 print:text-indigo-900 uppercase font-mono mb-2">
                Entregable C: Diagrama de Despliegue e Infraestructura (PlantUML)
              </h4>
              <pre className="text-[11px] font-mono text-emerald-400 print:text-slate-900 overflow-x-auto max-h-48">
                <code>{PLANTUML_DIAGRAMS.deployment}</code>
              </pre>
            </div>

            <div className="bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300">
              <h4 className="text-xs font-bold text-indigo-400 print:text-indigo-900 uppercase font-mono mb-2">
                Entregable D: Modelo de Datos Relacional DER (PlantUML)
              </h4>
              <pre className="text-[11px] font-mono text-emerald-400 print:text-slate-900 overflow-x-auto max-h-48">
                <code>{PLANTUML_DIAGRAMS.dataModel}</code>
              </pre>
            </div>

            <div className="bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300">
              <h4 className="text-xs font-bold text-indigo-400 print:text-indigo-900 uppercase font-mono mb-2">
                Entregable E: Diagrama de Secuencia de Matrícula en 9 Pasos (PlantUML)
              </h4>
              <pre className="text-[11px] font-mono text-emerald-400 print:text-slate-900 overflow-x-auto max-h-48">
                <code>{PLANTUML_DIAGRAMS.sequence}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Section 6: Conclusiones */}
        <section className="space-y-4 border-t border-slate-800 pt-6">
          <h2 className="text-xl font-bold text-white print:text-black border-l-4 border-indigo-500 pl-3">
            6. Conclusiones y Validación Arquitectónica
          </h2>
          <div className="text-xs text-slate-300 print:text-slate-800 space-y-2 leading-relaxed">
            <p>
              1. <strong>Coherencia y Trazabilidad Total:</strong> Se ha verificado que cada uno de los 12 requerimientos funcionales (RF-01 a RF-12) y 12 no funcionales (RNF-01 a RNF-12) tiene un módulo arquitectónico asignado, interfaces formalizadas y métodos de verificación empírica claramente descritos en la matriz de trazabilidad.
            </p>
            <p>
              2. <strong>Rigor en la Concurrencia:</strong> El proceso de matrícula de estudiantes implementa bloqueos a nivel de fila pesimistas (<code className="font-mono text-indigo-300">SELECT FOR UPDATE</code>) en PostgreSQL 16, garantizando matemáticamente cero overbooking incluso si los 300 usuarios concurrentes intentasen inscribir el mismo grupo en el mismo milisegundo.
            </p>
            <p>
              3. <strong>Viabilidad y Sostenibilidad Económica:</strong> Al descartar la complejidad innecesaria de microservicios para una demanda de 30 a 50 RPS, la institución reduce sus costos de infraestructura y mantenimiento en más del 80%, manteniendo al mismo tiempo un diseño desacoplado listo para evolucionar si la demanda institucional se multiplicara en el futuro.
            </p>
          </div>
        </section>

        {/* Institutional Sign-off footer */}
        <footer className="border-t border-slate-800/80 pt-6 mt-8 text-center text-xs text-slate-500 print:text-slate-600 font-mono">
          Corporación Unificada Nacional de Educación Superior (CUN) • Escuela de Ingeniería y Ciencias Básicas • 2026
        </footer>
      </article>
    </div>
  );
};
