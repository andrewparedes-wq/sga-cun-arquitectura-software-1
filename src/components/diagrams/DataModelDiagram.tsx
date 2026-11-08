import React, { useState } from 'react';
import { PLANTUML_DIAGRAMS } from '../../data/acaData';
import { PlantUmlViewer } from '../common/PlantUmlViewer';
import { Database, Key, Table2, ShieldCheck, CheckCircle } from 'lucide-react';

interface EntityMeta {
  name: string;
  table: string;
  description: string;
  primaryKey: string;
  foreignKeys: string[];
  attributes: { name: string; type: string; constraints: string }[];
  cardinalities: string[];
}

export const DataModelDiagram: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<string>('Matricula');

  const entities: EntityMeta[] = [
    {
      name: "Usuario",
      table: "usuario",
      description: "Entidad central de identidad. Almacena las credenciales hash y datos básicos de toda persona vinculada a la institución.",
      primaryKey: "id_usuario (UUID)",
      foreignKeys: [],
      attributes: [
        { name: "id_usuario", type: "UUID", constraints: "PRIMARY KEY" },
        { name: "email_institucional", type: "VARCHAR(120)", constraints: "NOT NULL, UNIQUE" },
        { name: "password_hash", type: "VARCHAR(255)", constraints: "NOT NULL (Argon2id)" },
        { name: "nombres", type: "VARCHAR(100)", constraints: "NOT NULL" },
        { name: "apellidos", type: "VARCHAR(100)", constraints: "NOT NULL" },
        { name: "tipo_documento", type: "VARCHAR(20)", constraints: "NOT NULL (CC, TI, CE)" },
        { name: "numero_documento", type: "VARCHAR(30)", constraints: "NOT NULL, UNIQUE" },
        { name: "estado", type: "ENUM", constraints: "('ACTIVO', 'INACTIVO', 'BLOQUEADO')" },
        { name: "fecha_creacion", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" }
      ],
      cardinalities: [
        "1:N con Usuario_Rol (un usuario tiene uno o más roles)",
        "1:1 (opcional) con Estudiante (un usuario puede ser perfil de estudiante)",
        "1:1 (opcional) con Docente (un usuario puede ser perfil de docente)"
      ]
    },
    {
      name: "Rol",
      table: "rol",
      description: "Catálogo de roles institucionales (Administrador, Coordinador, Docente, Estudiante) con permisos en formato JSONB.",
      primaryKey: "id_rol (INTEGER)",
      foreignKeys: [],
      attributes: [
        { name: "id_rol", type: "INTEGER", constraints: "PRIMARY KEY GENERATED ALWAYS" },
        { name: "nombre_rol", type: "VARCHAR(50)", constraints: "NOT NULL, UNIQUE" },
        { name: "descripcion", type: "TEXT", constraints: "NULLABLE" },
        { name: "permisos_json", type: "JSONB", constraints: "NOT NULL (Array de strings de permisos)" }
      ],
      cardinalities: [
        "1:N con Usuario_Rol (un rol está asignado a múltiples usuarios)"
      ]
    },
    {
      name: "Estudiante",
      table: "estudiante",
      description: "Especialización de Usuario que cursa un programa académico y acumula historial y matrícula.",
      primaryKey: "id_estudiante (UUID)",
      foreignKeys: ["id_usuario -> usuario.id_usuario", "id_programa -> programa.id_programa"],
      attributes: [
        { name: "id_estudiante", type: "UUID", constraints: "PRIMARY KEY" },
        { name: "id_usuario", type: "UUID", constraints: "NOT NULL, UNIQUE, FK -> usuario" },
        { name: "codigo_estudiantil", type: "VARCHAR(20)", constraints: "NOT NULL, UNIQUE" },
        { name: "id_programa", type: "UUID", constraints: "NOT NULL, FK -> programa" },
        { name: "semestre_actual", type: "INTEGER", constraints: "CHECK (semestre_actual BETWEEN 1 AND 12)" },
        { name: "estado_academico", type: "ENUM", constraints: "('MATRICULADO', 'INACTIVO', 'GRADUADO')" },
        { name: "promedio_acumulado", type: "DECIMAL(3,2)", constraints: "DEFAULT 0.00" }
      ],
      cardinalities: [
        "N:1 con Programa (muchos estudiantes pertenecen a un programa)",
        "1:N con Matricula (un estudiante realiza muchas matrículas a lo largo de su carrera)"
      ]
    },
    {
      name: "Docente",
      table: "docente",
      description: "Especialización de Usuario responsable de la orientación pedagógica y asentamiento de calificaciones.",
      primaryKey: "id_docente (UUID)",
      foreignKeys: ["id_usuario -> usuario.id_usuario"],
      attributes: [
        { name: "id_docente", type: "UUID", constraints: "PRIMARY KEY" },
        { name: "id_usuario", type: "UUID", constraints: "NOT NULL, UNIQUE, FK -> usuario" },
        { name: "codigo_docente", type: "VARCHAR(20)", constraints: "NOT NULL, UNIQUE" },
        { name: "especialidad", type: "VARCHAR(100)", constraints: "NOT NULL" },
        { name: "titulo_academico", type: "VARCHAR(100)", constraints: "NOT NULL" },
        { name: "tipo_contrato", type: "VARCHAR(50)", constraints: "NOT NULL" }
      ],
      cardinalities: [
        "1:N con Grupo (un docente puede tener a cargo múltiples grupos académicos por periodo)"
      ]
    },
    {
      name: "Programa",
      table: "programa",
      description: "Oferta académica formal de la CUN (ej. Ingeniería de Sistemas, Administración).",
      primaryKey: "id_programa (UUID)",
      foreignKeys: [],
      attributes: [
        { name: "id_programa", type: "UUID", constraints: "PRIMARY KEY" },
        { name: "codigo_snies", type: "VARCHAR(20)", constraints: "NOT NULL, UNIQUE (Registro Ministerial)" },
        { name: "nombre_programa", type: "VARCHAR(150)", constraints: "NOT NULL" },
        { name: "nivel_formacion", type: "ENUM", constraints: "('TECNICO', 'TECNOLOGICO', 'PROFESIONAL')" },
        { name: "total_creditos", type: "INTEGER", constraints: "NOT NULL, CHECK (total_creditos > 0)" },
        { name: "estado", type: "BOOLEAN", constraints: "DEFAULT TRUE" }
      ],
      cardinalities: [
        "1:N con Estudiante (un programa matricula muchos estudiantes)",
        "1:N con Asignatura (un programa contiene un plan de estudios compuesto por asignaturas)"
      ]
    },
    {
      name: "Asignatura",
      table: "asignatura",
      description: "Materia curricular perteneciente a un plan de estudios con asignación de créditos académicos.",
      primaryKey: "id_asignatura (UUID)",
      foreignKeys: ["id_programa -> programa.id_programa"],
      attributes: [
        { name: "id_asignatura", type: "UUID", constraints: "PRIMARY KEY" },
        { name: "codigo_asignatura", type: "VARCHAR(20)", constraints: "NOT NULL, UNIQUE" },
        { name: "id_programa", type: "UUID", constraints: "NOT NULL, FK -> programa" },
        { name: "nombre_asignatura", type: "VARCHAR(150)", constraints: "NOT NULL" },
        { name: "creditos", type: "INTEGER", constraints: "CHECK (creditos BETWEEN 1 AND 10)" },
        { name: "semestre_sugerido", type: "INTEGER", constraints: "NOT NULL" },
        { name: "es_electiva", type: "BOOLEAN", constraints: "DEFAULT FALSE" }
      ],
      cardinalities: [
        "N:1 con Programa (una asignatura pertenece a un programa)",
        "1:N con Grupo (una asignatura se oferta en uno o varios grupos por periodo)"
      ]
    },
    {
      name: "PeriodoAcademico",
      table: "periodo_academico",
      description: "Ciclo lectivo institucional (ej. 2026-1) con calendario de matrículas, inicio y cierre de clases.",
      primaryKey: "id_periodo (UUID)",
      foreignKeys: [],
      attributes: [
        { name: "id_periodo", type: "UUID", constraints: "PRIMARY KEY" },
        { name: "codigo_periodo", type: "VARCHAR(10)", constraints: "NOT NULL, UNIQUE (ej. '2026-1')" },
        { name: "fecha_inicio", type: "DATE", constraints: "NOT NULL" },
        { name: "fecha_fin", type: "DATE", constraints: "NOT NULL, CHECK (fecha_fin > fecha_inicio)" },
        { name: "fecha_inicio_matricula", type: "TIMESTAMP", constraints: "NOT NULL" },
        { name: "fecha_fin_matricula", type: "TIMESTAMP", constraints: "NOT NULL" },
        { name: "estado", type: "ENUM", constraints: "('PLANIFICACION', 'MATRICULA_ABIERTA', 'EN_CURSO', 'CERRADO')" }
      ],
      cardinalities: [
        "1:N con Grupo (en un periodo académico se abren múltiples grupos de diferentes asignaturas)"
      ]
    },
    {
      name: "Grupo",
      table: "grupo",
      description: "Unidad operativa donde se oferta una asignatura en un horario, aula y con un docente asignado.",
      primaryKey: "id_grupo (UUID)",
      foreignKeys: [
        "id_asignatura -> asignatura.id_asignatura",
        "id_periodo -> periodo_academico.id_periodo",
        "id_docente -> docente.id_docente"
      ],
      attributes: [
        { name: "id_grupo", type: "UUID", constraints: "PRIMARY KEY" },
        { name: "codigo_grupo", type: "VARCHAR(20)", constraints: "NOT NULL" },
        { name: "id_asignatura", type: "UUID", constraints: "NOT NULL, FK -> asignatura" },
        { name: "id_periodo", type: "UUID", constraints: "NOT NULL, FK -> periodo_academico" },
        { name: "id_docente", type: "UUID", constraints: "NOT NULL, FK -> docente" },
        { name: "cupo_maximo", type: "INTEGER", constraints: "NOT NULL, CHECK (cupo_maximo > 0)" },
        { name: "cupos_ocupados", type: "INTEGER", constraints: "DEFAULT 0, CHECK (cupos_ocupados <= cupo_maximo)" },
        { name: "horario_json", type: "JSONB", constraints: "NOT NULL (Días, hora_inicio, hora_fin)" },
        { name: "aula", type: "VARCHAR(50)", constraints: "NOT NULL" },
        { name: "estado", type: "ENUM", constraints: "('ABIERTO', 'CERRADO', 'CANCELADO')" }
      ],
      cardinalities: [
        "N:1 con Asignatura, Periodo y Docente",
        "1:N con Matricula (un grupo tiene matriculados hasta su cupo máximo de estudiantes)"
      ]
    },
    {
      name: "Matricula",
      table: "matricula",
      description: "Entidad asociativa central que vincula a un Estudiante con un Grupo ofertado en un periodo académico.",
      primaryKey: "id_matricula (UUID)",
      foreignKeys: [
        "id_estudiante -> estudiante.id_estudiante",
        "id_grupo -> grupo.id_grupo"
      ],
      attributes: [
        { name: "id_matricula", type: "UUID", constraints: "PRIMARY KEY" },
        { name: "id_estudiante", type: "UUID", constraints: "NOT NULL, FK -> estudiante" },
        { name: "id_grupo", type: "UUID", constraints: "NOT NULL, FK -> grupo" },
        { name: "fecha_matricula", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" },
        { name: "estado_matricula", type: "ENUM", constraints: "('REGISTRADA', 'CANCELADA', 'APROBADA', 'REPROBADA')" },
        { name: "nota_definitiva", type: "DECIMAL(3,2)", constraints: "NULLABLE, CHECK (nota_definitiva BETWEEN 0.0 AND 5.0)" },
        { name: "observacion", type: "TEXT", constraints: "NULLABLE" }
      ],
      cardinalities: [
        "UNIQUE CONSTRAINT (id_estudiante, id_grupo) para evitar inscripción doble",
        "1:N con Calificacion (una matrícula contiene las notas de los 3 cortes del semestre)"
      ]
    },
    {
      name: "Calificacion",
      table: "calificacion",
      description: "Registro de nota individual correspondiente a un corte evaluativo específico para una matrícula.",
      primaryKey: "id_calificacion (UUID)",
      foreignKeys: [
        "id_matricula -> matricula.id_matricula",
        "modificado_por -> usuario.id_usuario"
      ],
      attributes: [
        { name: "id_calificacion", type: "UUID", constraints: "PRIMARY KEY" },
        { name: "id_matricula", type: "UUID", constraints: "NOT NULL, FK -> matricula" },
        { name: "corte", type: "INTEGER", constraints: "CHECK (corte IN (1, 2, 3))" },
        { name: "porcentaje_corte", type: "DECIMAL(4,2)", constraints: "NOT NULL (ej. 30.00, 30.00, 40.00)" },
        { name: "valor_nota", type: "DECIMAL(3,2)", constraints: "NOT NULL, CHECK (valor_nota BETWEEN 0.00 AND 5.00)" },
        { name: "retroalimentacion", type: "TEXT", constraints: "NULLABLE" },
        { name: "fecha_registro", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" },
        { name: "modificado_por", type: "UUID", constraints: "NOT NULL, FK -> usuario" }
      ],
      cardinalities: [
        "UNIQUE CONSTRAINT (id_matricula, corte) para evitar notas duplicadas en el mismo corte",
        "N:1 con Matricula (cada corte suma a la nota definitiva ponderada)"
      ]
    }
  ];

  const modelingDecisions = [
    "Uso de UUID v4 como Primary Keys: Permite generar identificadores en la capa de aplicación sin depender de un bloqueo secuencial en la base de datos (evita contención bajo ráfagas concurrentes de 300 usuarios).",
    "Restricciones de Integridad Check y Unique a nivel de motor: 'CHECK (cupos_ocupados <= cupo_maximo)' actúa como salvaguarda inexpugnable a nivel de base de datos contra el sobrecupo, independientemente de cualquier bug en la aplicación.",
    "Resolución formal de relación Muchos a Muchos (N:M): La relación entre Estudiante y Grupo se materializa en la entidad 'Matricula', la cual almacena además el estado y la nota definitiva consolidada.",
    "Estructura de Calificaciones por Cortes: La entidad Calificacion almacena el corte (1, 2 o 3), el porcentaje ponderado y la nota de 0.0 a 5.0, garantizando trazabilidad y auditoría de quién asentó la calificación (modificado_por).",
    "Tabla inmutable de AuditoriaLog: Append-only sin permisos de modificación ni borrado, garantizando el cumplimiento del principio de no repudio legal y normativo."
  ];

  const assumptions = [
    "Cada estudiante pertenece a un único programa académico primario por matrícula activa.",
    "La escala de calificación institucional se rige formalmente entre 0.00 y 5.00, aprobándose con nota mínima de 3.00.",
    "Los cortes evaluativos típicos corresponden a Corte 1 (30%), Corte 2 (30%) y Corte 3 (40%), sumando exactamente el 100%.",
    "Los horarios de los grupos se modelan en formato JSONB para permitir flexibilidad de múltiples sesiones por semana sin sobrecargar tablas relacionales intermedias."
  ];

  const componentsExplanation = entities.map(e => ({
    name: e.name,
    role: `Tabla: ${e.table}`,
    description: `${e.description} Clave primaria: ${e.primaryKey}.`
  }));

  const activeEntityData = entities.find(e => e.name === selectedEntity) || entities[8];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Entregable D
              </span>
              <h3 className="text-xl font-bold text-white">Modelo de Datos Conceptual y Relacional (DER)</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Definición formal de las 10 entidades principales del SGA: Usuario, Rol, Estudiante, Docente, Programa, Asignatura,
              PeriodoAcademico, Grupo, Matricula y Calificacion (más tabla inmutable de AuditoriaLog), con atributos, restricciones y cardinalidades.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Visual SVG Entity-Relationship Diagram */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto shadow-2xl">
        <div className="text-xs text-slate-500 font-mono mb-2 flex items-center justify-between">
          <span>Vista Vectorial DER (Entidades, Claves Primarias/Foráneas y Cardinalidades)</span>
          <span className="text-[11px] text-indigo-400">Modelo Conceptual & Relacional PostgreSQL</span>
        </div>

        <svg id="diagram-svg-data-model" viewBox="0 0 1150 720" className="w-full min-w-[900px] h-auto select-none font-sans">
          <defs>
            <marker id="crow-one" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 1 6 L 10 6 M 6 1 L 6 11 M 10 1 L 10 11" stroke="#818cf8" strokeWidth="1.5" fill="none" />
            </marker>
            <marker id="crow-many" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 1 6 L 10 6 M 10 1 L 1 6 L 10 11" stroke="#818cf8" strokeWidth="1.5" fill="none" />
            </marker>
          </defs>

          {/* Relationship connecting lines */}
          {/* Usuario to UsuarioRol */}
          <path d="M 180 180 L 180 230" stroke="#818cf8" strokeWidth="1.5" markerStart="url(#crow-one)" markerEnd="url(#crow-many)" />
          {/* Rol to UsuarioRol */}
          <path d="M 330 270 L 250 270" stroke="#818cf8" strokeWidth="1.5" markerStart="url(#crow-one)" markerEnd="url(#crow-many)" />
          {/* Usuario to Estudiante */}
          <path d="M 230 110 L 330 110" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#crow-one)" />
          {/* Usuario to Docente */}
          <path d="M 180 60 L 180 20 L 610 20 L 610 60" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#crow-one)" />
          {/* Programa to Estudiante */}
          <path d="M 430 420 L 430 220" stroke="#38bdf8" strokeWidth="1.5" markerStart="url(#crow-one)" markerEnd="url(#crow-many)" />
          {/* Programa to Asignatura */}
          <path d="M 530 470 L 600 470" stroke="#38bdf8" strokeWidth="1.5" markerStart="url(#crow-one)" markerEnd="url(#crow-many)" />
          {/* Asignatura to Grupo */}
          <path d="M 780 470 L 850 470" stroke="#38bdf8" strokeWidth="1.5" markerStart="url(#crow-one)" markerEnd="url(#crow-many)" />
          {/* Periodo to Grupo */}
          <path d="M 940 370 L 940 420" stroke="#38bdf8" strokeWidth="1.5" markerStart="url(#crow-one)" markerEnd="url(#crow-many)" />
          {/* Docente to Grupo */}
          <path d="M 710 140 L 910 140 L 910 420" stroke="#34d399" strokeWidth="1.5" markerStart="url(#crow-one)" markerEnd="url(#crow-many)" />
          {/* Estudiante to Matricula */}
          <path d="M 520 160 L 600 160 L 600 240" stroke="#f59e0b" strokeWidth="2" markerStart="url(#crow-one)" markerEnd="url(#crow-many)" />
          {/* Grupo to Matricula */}
          <path d="M 850 510 L 730 510 L 730 380" stroke="#f59e0b" strokeWidth="2" markerStart="url(#crow-one)" markerEnd="url(#crow-many)" />
          {/* Matricula to Calificacion */}
          <path d="M 680 380 L 680 570" stroke="#10b981" strokeWidth="2" markerStart="url(#crow-one)" markerEnd="url(#crow-many)" />

          {/* TABLE: Usuario */}
          <g className="cursor-pointer" onClick={() => setSelectedEntity('Usuario')}>
            <rect x="50" y="60" width="180" height="120" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth={selectedEntity === 'Usuario' ? '2.5' : '1.5'} />
            <rect x="50" y="60" width="180" height="26" rx="6" fill="#312e81" />
            <text x="60" y="77" fill="#ffffff" fontSize="11" fontWeight="700">Usuario (usuario)</text>
            <text x="60" y="102" fill="#fbbf24" fontSize="10" className="font-mono">[PK] id_usuario : UUID</text>
            <text x="60" y="118" fill="#e2e8f0" fontSize="10">[UQ] email_institucional</text>
            <text x="60" y="134" fill="#94a3b8" fontSize="9">password_hash (Argon2id)</text>
            <text x="60" y="148" fill="#94a3b8" fontSize="9">nombres, apellidos, doc</text>
            <text x="60" y="162" fill="#94a3b8" fontSize="9">estado (ACTIVO/BLOQ)</text>
          </g>

          {/* TABLE: Rol */}
          <g className="cursor-pointer" onClick={() => setSelectedEntity('Rol')}>
            <rect x="330" y="235" width="170" height="95" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth={selectedEntity === 'Rol' ? '2.5' : '1.5'} />
            <rect x="330" y="235" width="170" height="26" rx="6" fill="#312e81" />
            <text x="340" y="252" fill="#ffffff" fontSize="11" fontWeight="700">Rol (rol)</text>
            <text x="340" y="277" fill="#fbbf24" fontSize="10">[PK] id_rol : INT</text>
            <text x="340" y="293" fill="#e2e8f0" fontSize="10">[UQ] nombre_rol : VARCHAR</text>
            <text x="340" y="309" fill="#94a3b8" fontSize="9">permisos_json : JSONB</text>
          </g>

          {/* TABLE: Usuario_Rol (Junction) */}
          <g>
            <rect x="110" y="230" width="140" height="75" rx="5" fill="#0f172a" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
            <rect x="110" y="230" width="140" height="22" rx="5" fill="#1e293b" />
            <text x="120" y="245" fill="#cbd5e1" fontSize="10" fontWeight="700">Usuario_Rol</text>
            <text x="120" y="268" fill="#818cf8" fontSize="9">[PFK] id_usuario</text>
            <text x="120" y="284" fill="#818cf8" fontSize="9">[PFK] id_rol</text>
          </g>

          {/* TABLE: Estudiante */}
          <g className="cursor-pointer" onClick={() => setSelectedEntity('Estudiante')}>
            <rect x="330" y="60" width="190" height="150" rx="6" fill="#0c2340" stroke="#0ea5e9" strokeWidth={selectedEntity === 'Estudiante' ? '2.5' : '1.5'} />
            <rect x="330" y="60" width="190" height="26" rx="6" fill="#0369a1" />
            <text x="340" y="77" fill="#ffffff" fontSize="11" fontWeight="700">Estudiante (estudiante)</text>
            <text x="340" y="102" fill="#fbbf24" fontSize="10">[PK] id_estudiante : UUID</text>
            <text x="340" y="118" fill="#818cf8" fontSize="10">[FK, UQ] id_usuario</text>
            <text x="340" y="134" fill="#e2e8f0" fontSize="10">[UQ] codigo_estudiantil</text>
            <text x="340" y="150" fill="#38bdf8" fontSize="10">[FK] id_programa</text>
            <text x="340" y="166" fill="#94a3b8" fontSize="9">semestre_actual : INT</text>
            <text x="340" y="182" fill="#94a3b8" fontSize="9">promedio_acumulado</text>
          </g>

          {/* TABLE: Docente */}
          <g className="cursor-pointer" onClick={() => setSelectedEntity('Docente')}>
            <rect x="570" y="60" width="180" height="135" rx="6" fill="#022c22" stroke="#10b981" strokeWidth={selectedEntity === 'Docente' ? '2.5' : '1.5'} />
            <rect x="570" y="60" width="180" height="26" rx="6" fill="#047857" />
            <text x="580" y="77" fill="#ffffff" fontSize="11" fontWeight="700">Docente (docente)</text>
            <text x="580" y="102" fill="#fbbf24" fontSize="10">[PK] id_docente : UUID</text>
            <text x="580" y="118" fill="#818cf8" fontSize="10">[FK, UQ] id_usuario</text>
            <text x="580" y="134" fill="#e2e8f0" fontSize="10">[UQ] codigo_docente</text>
            <text x="580" y="150" fill="#94a3b8" fontSize="9">especialidad, titulo</text>
            <text x="580" y="166" fill="#94a3b8" fontSize="9">tipo_contrato</text>
          </g>

          {/* TABLE: Programa */}
          <g className="cursor-pointer" onClick={() => setSelectedEntity('Programa')}>
            <rect x="330" y="420" width="200" height="120" rx="6" fill="#082f49" stroke="#0ea5e9" strokeWidth={selectedEntity === 'Programa' ? '2.5' : '1.5'} />
            <rect x="330" y="420" width="200" height="26" rx="6" fill="#0369a1" />
            <text x="340" y="437" fill="#ffffff" fontSize="11" fontWeight="700">Programa (programa)</text>
            <text x="340" y="462" fill="#fbbf24" fontSize="10">[PK] id_programa : UUID</text>
            <text x="340" y="478" fill="#e2e8f0" fontSize="10">[UQ] codigo_snies</text>
            <text x="340" y="494" fill="#94a3b8" fontSize="9">nombre_programa</text>
            <text x="340" y="508" fill="#94a3b8" fontSize="9">nivel_formacion, creditos</text>
          </g>

          {/* TABLE: Asignatura */}
          <g className="cursor-pointer" onClick={() => setSelectedEntity('Asignatura')}>
            <rect x="600" y="420" width="180" height="125" rx="6" fill="#082f49" stroke="#0ea5e9" strokeWidth={selectedEntity === 'Asignatura' ? '2.5' : '1.5'} />
            <rect x="600" y="420" width="180" height="26" rx="6" fill="#0369a1" />
            <text x="610" y="437" fill="#ffffff" fontSize="11" fontWeight="700">Asignatura (asignatura)</text>
            <text x="610" y="462" fill="#fbbf24" fontSize="10">[PK] id_asignatura : UUID</text>
            <text x="610" y="478" fill="#38bdf8" fontSize="10">[FK] id_programa</text>
            <text x="610" y="494" fill="#e2e8f0" fontSize="10">[UQ] codigo_asignatura</text>
            <text x="610" y="508" fill="#94a3b8" fontSize="9">creditos, semestre_sug</text>
          </g>

          {/* TABLE: PeriodoAcademico */}
          <g className="cursor-pointer" onClick={() => setSelectedEntity('PeriodoAcademico')}>
            <rect x="850" y="240" width="190" height="130" rx="6" fill="#0f172a" stroke="#64748b" strokeWidth={selectedEntity === 'PeriodoAcademico' ? '2.5' : '1.5'} />
            <rect x="850" y="240" width="190" height="26" rx="6" fill="#334155" />
            <text x="860" y="257" fill="#ffffff" fontSize="11" fontWeight="700">Periodo (periodo_academico)</text>
            <text x="860" y="282" fill="#fbbf24" fontSize="10">[PK] id_periodo : UUID</text>
            <text x="860" y="298" fill="#e2e8f0" fontSize="10">[UQ] codigo_periodo (2026-1)</text>
            <text x="860" y="314" fill="#94a3b8" fontSize="9">fecha_inicio, fecha_fin</text>
            <text x="860" y="328" fill="#94a3b8" fontSize="9">fechas_matricula (TIMESTAMP)</text>
            <text x="860" y="342" fill="#94a3b8" fontSize="9">estado (MATRICULA_ABIERTA)</text>
          </g>

          {/* TABLE: Grupo */}
          <g className="cursor-pointer" onClick={() => setSelectedEntity('Grupo')}>
            <rect x="850" y="420" width="200" height="160" rx="6" fill="#18181b" stroke="#f59e0b" strokeWidth={selectedEntity === 'Grupo' ? '2.5' : '1.5'} />
            <rect x="850" y="420" width="200" height="26" rx="6" fill="#b45309" />
            <text x="860" y="437" fill="#ffffff" fontSize="11" fontWeight="700">Grupo (grupo)</text>
            <text x="860" y="462" fill="#fbbf24" fontSize="10">[PK] id_grupo : UUID</text>
            <text x="860" y="478" fill="#38bdf8" fontSize="10">[FK] id_asignatura</text>
            <text x="860" y="494" fill="#94a3b8" fontSize="10">[FK] id_periodo, id_docente</text>
            <text x="860" y="510" fill="#fde047" fontSize="10">cupo_maximo, cupos_ocupados</text>
            <text x="860" y="526" fill="#fca5a5" fontSize="9">CHECK (cupos_ocupados &lt;= max)</text>
            <text x="860" y="542" fill="#94a3b8" fontSize="9">horario_json, aula, estado</text>
          </g>

          {/* TABLE: Matricula (CORE Junction) */}
          <g className="cursor-pointer" onClick={() => setSelectedEntity('Matricula')}>
            <rect x="570" y="240" width="230" height="145" rx="6" fill="#451a03" stroke="#f59e0b" strokeWidth={selectedEntity === 'Matricula' ? '3' : '2'} />
            <rect x="570" y="240" width="230" height="26" rx="6" fill="#78350f" />
            <text x="580" y="257" fill="#ffffff" fontSize="12" fontWeight="700">Matricula (matricula)</text>
            <text x="580" y="282" fill="#fbbf24" fontSize="10">[PK] id_matricula : UUID</text>
            <text x="580" y="298" fill="#38bdf8" fontSize="10">[FK] id_estudiante : UUID</text>
            <text x="580" y="314" fill="#fde047" fontSize="10">[FK] id_grupo : UUID</text>
            <text x="580" y="330" fill="#bef264" fontSize="9">[UQ] UNIQUE(id_estudiante, id_grupo)</text>
            <text x="580" y="346" fill="#94a3b8" fontSize="9">fecha_matricula, estado</text>
            <text x="580" y="362" fill="#94a3b8" fontSize="9">nota_definitiva (DECIMAL 0-5)</text>
          </g>

          {/* TABLE: Calificacion */}
          <g className="cursor-pointer" onClick={() => setSelectedEntity('Calificacion')}>
            <rect x="570" y="570" width="230" height="130" rx="6" fill="#022c22" stroke="#10b981" strokeWidth={selectedEntity === 'Calificacion' ? '2.5' : '1.5'} />
            <rect x="570" y="570" width="230" height="26" rx="6" fill="#047857" />
            <text x="580" y="587" fill="#ffffff" fontSize="11" fontWeight="700">Calificacion (calificacion)</text>
            <text x="580" y="612" fill="#fbbf24" fontSize="10">[PK] id_calificacion : UUID</text>
            <text x="580" y="628" fill="#fde047" fontSize="10">[FK] id_matricula : UUID</text>
            <text x="580" y="644" fill="#bef264" fontSize="9">[UQ] UNIQUE(id_matricula, corte)</text>
            <text x="580" y="660" fill="#94a3b8" fontSize="9">corte (1,2,3), porcentaje (30/30/40)</text>
            <text x="580" y="674" fill="#6ee7b7" fontSize="9">valor_nota (CHECK 0.00 - 5.00)</text>
          </g>

          {/* TABLE: AuditoriaLog */}
          <g>
            <rect x="50" y="420" width="240" height="135" rx="6" fill="#1e1b4b" stroke="#c084fc" strokeWidth="1.5" />
            <rect x="50" y="420" width="240" height="26" rx="6" fill="#581c87" />
            <text x="60" y="437" fill="#ffffff" fontSize="11" fontWeight="700">AuditoriaLog (audit_log)</text>
            <text x="60" y="462" fill="#fbbf24" fontSize="10">[PK] id_auditoria : BIGSERIAL</text>
            <text x="60" y="478" fill="#e9d5ff" fontSize="10">id_usuario, accion (INSERT/UPDATE)</text>
            <text x="60" y="494" fill="#94a3b8" fontSize="9">tabla_afectada, registro_id</text>
            <text x="60" y="508" fill="#94a3b8" fontSize="9">payload_anterior, payload_nuevo (JSONB)</text>
            <text x="60" y="522" fill="#94a3b8" fontSize="9">direccion_ip, timestamp_evento (UTC)</text>
            <text x="60" y="538" fill="#a855f7" fontSize="9" fontWeight="600">POLÍTICA: APPEND-ONLY INMUTABLE</text>
          </g>
        </svg>
      </div>

      {/* Entity Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-2 bg-slate-900/80 rounded-xl border border-slate-800">
        {entities.map(ent => (
          <button
            key={ent.name}
            onClick={() => setSelectedEntity(ent.name)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition flex items-center gap-1.5 ${
              selectedEntity === ent.name
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            <span>{ent.name}</span>
          </button>
        ))}
      </div>

      {/* Active Entity Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white">{activeEntityData.name}</h4>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  table: {activeEntityData.table}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{activeEntityData.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded bg-slate-800 text-amber-300 border border-slate-700 flex items-center gap-1">
              <Key className="w-3.5 h-3.5" />
              <span>PK: {activeEntityData.primaryKey}</span>
            </span>
          </div>
        </div>

        {/* Attribute Table */}
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="px-4 py-2.5">Columna / Atributo</th>
                <th className="px-4 py-2.5">Tipo de Dato SQL</th>
                <th className="px-4 py-2.5">Restricciones de Integridad & Llaves</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
              {activeEntityData.attributes.map((attr, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-2.5 font-mono text-white font-semibold flex items-center gap-1.5">
                    {attr.constraints.includes('PRIMARY') && <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    {attr.constraints.includes('FK') && <Key className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    <span>{attr.name}</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-indigo-300">{attr.type}</td>
                  <td className="px-4 py-2.5 text-slate-300">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      attr.constraints.includes('PRIMARY')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : attr.constraints.includes('FK')
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {attr.constraints}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cardinalities and Relationships */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Relaciones y Cardinalidades de la Entidad</span>
          </h5>
          <ul className="space-y-1.5">
            {activeEntityData.cardinalities.map((card, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{card}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Complete PlantUML Code Viewer with Analysis */}
      <PlantUmlViewer
        title="Código Fuente PlantUML - Modelo de Datos Entidad-Relación (Entregable D)"
        filename="sga_modelo_datos_conceptual"
        code={PLANTUML_DIAGRAMS.dataModel}
        description="Modelo de datos conceptual y relacional completo con las 10 entidades académicas obligatorias, más la entidad inmutable de auditoría. Especifica claves primarias (UUID), foráneas, tipos de datos PostgreSQL, restricciones de integridad CHECK y relaciones de cardinalidad (1:1, 1:N, N:M)."
        componentsExplanation={componentsExplanation}
        modelingDecisions={modelingDecisions}
        assumptions={assumptions}
      />
    </div>
  );
};
