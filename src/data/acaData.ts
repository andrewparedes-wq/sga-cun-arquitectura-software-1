/**
 * Base de Conocimiento y Especificación Arquitectónica - SGA CUN
 * Actividad de Construcción Aplicada (ACA) - Arquitectura de Software
 * Corporación Unificada Nacional de Educación Superior (CUN)
 */

import { Actor, FunctionalRequirement, NonFunctionalRequirement, ArchitecturalModule, TraceabilityItem, RiskItem } from '../types/architecture';

export const INSTITUTION_INFO = {
  institution: "Corporación Unificada Nacional de Educación Superior (CUN)",
  faculty: "Escuela de Ingeniería y Ciencias Básicas",
  program: "Ingeniería de Sistemas",
  subject: "Arquitectura de Software",
  activity: "Actividad de Construcción Aplicada (ACA)",
  projectName: "Sistema de Gestión Académica (SGA)",
  version: "1.0.0 - Diseño Arquitectónico Formal",
  date: "2026",
  architectRole: "Arquitecto de Software Senior / Especialista en Arquitecturas Empresariales"
};

export const ACTORS: Actor[] = [
  {
    id: "admin",
    name: "Administrador",
    shortDesc: "Responsable de la gobernanza del sistema, usuarios, roles, seguridad y datos maestros institucionales.",
    color: "#6366f1",
    badge: "Gobernanza & Seguridad",
    responsibilities: [
      "Crear, actualizar y revocar cuentas de usuario institucionales.",
      "Asignar roles y granularidad de permisos RBAC (Role-Based Access Control).",
      "Configurar parámetros globales de la institución y catálogos maestros.",
      "Monitorear pistas de auditoría y eventos de seguridad críticos."
    ],
    permissions: ["AUTH_MANAGE", "USERS_CRUD", "ROLES_PERMISSIONS", "AUDIT_VIEW", "MASTER_DATA_CRUD"]
  },
  {
    id: "coordinador",
    name: "Coordinador Académico",
    shortDesc: "Gestiona la oferta académica: programas, mallas curriculares, periodos, asignaturas, docentes y grupos.",
    color: "#0ea5e9",
    badge: "Gestión Curricular",
    responsibilities: [
      "Definir y aperturar periodos académicos semestrales e intersemestrales.",
      "Administrar programas académicos, planes de estudio y asignaturas.",
      "Crear grupos y asignar cupos máximos, horarios y docentes titulares.",
      "Generar consolidados, actas y reportes estadísticos de matrícula y rendimiento."
    ],
    permissions: ["PROGRAMS_MANAGE", "SUBJECTS_MANAGE", "PERIODS_MANAGE", "GROUPS_MANAGE", "REPORTS_ACADEMIC_GEN"]
  },
  {
    id: "docente",
    name: "Docente",
    shortDesc: "Responsable de la orientación pedagógica de sus grupos asignados y registro formal de calificaciones.",
    color: "#10b981",
    badge: "Evaluación & Cursos",
    responsibilities: [
      "Consultar listas de estudiantes matriculados en sus grupos activos.",
      "Registrar y actualizar calificaciones parciales y definitivas dentro de las fechas límite.",
      "Generar planillas de notas y reportes de aprobación/reprobación de sus cursos.",
      "Verificar el historial evaluativo y retroalimentación académica."
    ],
    permissions: ["TEACHER_GROUPS_VIEW", "GRADES_INPUT", "GRADES_UPDATE", "GRADEBOOK_EXPORT"]
  },
  {
    id: "estudiante",
    name: "Estudiante",
    shortDesc: "Usuario beneficiario del servicio educativo, realiza matrículas y consulta su historial y calificaciones.",
    color: "#f59e0b",
    badge: "Matrícula & Historial",
    responsibilities: [
      "Consultar la oferta de grupos disponibles y validar prerrequisitos.",
      "Efectuar la matrícula académica en grupos con cupo disponible.",
      "Consultar horarios de clase, docentes asignados y aula/modalidad.",
      "Consultar calificaciones parciales, definitivas y promedio ponderado acumulado."
    ],
    permissions: ["STUDENT_ENROLLMENT_DO", "STUDENT_SCHEDULE_VIEW", "STUDENT_GRADES_VIEW", "STUDENT_HISTORY_VIEW"]
  }
];

export const FUNCTIONAL_REQUIREMENTS: FunctionalRequirement[] = [
  {
    id: "RF-01",
    title: "Autenticación de Usuarios",
    description: "El sistema debe autenticar las credenciales de usuarios (email institucional y contraseña cifrada con Argon2/Bcrypt) emitiendo tokens criptográficos JWT con caducidad configurada.",
    primaryActor: "Todos los Actores",
    module: "Autenticación y Autorización",
    criticality: "Alta",
    preconditions: "Usuario activo en el repositorio institucional.",
    postconditions: "Token JWT generado con claims de identidad y roles; sesión iniciada y auditada."
  },
  {
    id: "RF-02",
    title: "Administración de Roles y Permisos",
    description: "El sistema debe permitir al Administrador definir roles institucionales y asignar permisos granulares (RBAC) para controlar el acceso a endpoints y vistas.",
    primaryActor: "Administrador",
    module: "Autenticación y Autorización",
    criticality: "Alta",
    preconditions: "Sesión activa de usuario con rol Administrador.",
    postconditions: "Permisos actualizados inmediatamente en la directiva de autorización."
  },
  {
    id: "RF-03",
    title: "Gestión de Estudiantes",
    description: "Permite registrar, actualizar, consultar y cambiar de estado a los estudiantes, manteniendo su vinculación con el programa académico activo.",
    primaryActor: "Administrador",
    secondaryActors: ["Coordinador Académico"],
    module: "Gestión Académica",
    criticality: "Alta",
    preconditions: "Datos de identidad válidos y programa académico activo.",
    postconditions: "Estudiante registrado con identificador único institucional (código estudiantil)."
  },
  {
    id: "RF-04",
    title: "Gestión de Docentes",
    description: "Permite la creación, actualización y consulta de perfiles docentes, incluyendo especialidad académica y asignación a programas.",
    primaryActor: "Administrador",
    secondaryActors: ["Coordinador Académico"],
    module: "Gestión Académica",
    criticality: "Media",
    preconditions: "Perfil docente validado por talento humano institucional.",
    postconditions: "Docente disponible para asignación horaria y de grupos."
  },
  {
    id: "RF-05",
    title: "Gestión de Programas y Asignaturas",
    description: "Permite al Coordinador estructurar programas académicos, registrar mallas curriculares, créditos, códigos y prerrequisitos de asignaturas.",
    primaryActor: "Coordinador Académico",
    module: "Gestión Académica",
    criticality: "Alta",
    preconditions: "Registro calificado institucional vigente.",
    postconditions: "Catálogo de asignaturas y créditos disponible para apertura de grupos."
  },
  {
    id: "RF-06",
    title: "Gestión de Grupos y Periodos Académicos",
    description: "Permite crear periodos académicos (año-semestre, ej. 2026-1) con fechas de inicio, corte y cierre, y aperturar grupos con cupo máximo, aula y docente.",
    primaryActor: "Coordinador Académico",
    module: "Gestión Académica",
    criticality: "Alta",
    preconditions: "Periodo académico aperturado y asignaturas creadas.",
    postconditions: "Grupos publicados con cupos disponibles para el proceso de matrícula."
  },
  {
    id: "RF-07",
    title: "Matrícula Académica",
    description: "Permite al Estudiante seleccionar grupos abiertos y registrar su matrícula, validando cupos en tiempo real mediante transacciones ACID y evitando duplicidad o choques de horario.",
    primaryActor: "Estudiante",
    module: "Matrículas",
    criticality: "Alta",
    preconditions: "Estudiante activo, periodo en fase de matrícula, sin deudas financieras, cupo disponible en grupo.",
    postconditions: "Registro de matrícula creado, cupo del grupo decrementado en 1 y evento de auditoría emitido."
  },
  {
    id: "RF-08",
    title: "Registro de Calificaciones",
    description: "Permite al Docente ingresar y modificar notas numéricas (escala 0.0 a 5.0) para los estudiantes de sus grupos dentro de las ventanas temporales autorizadas.",
    primaryActor: "Docente",
    module: "Calificaciones",
    criticality: "Alta",
    preconditions: "Docente asignado al grupo, periodo activo en ventana de evaluación.",
    postconditions: "Calificación registrada con fecha, porcentaje evaluativo y registro en auditoría."
  },
  {
    id: "RF-09",
    title: "Consulta de Resultados Académicos",
    description: "Permite al Estudiante visualizar sus notas parciales, definitivas, créditos aprobados y promedio ponderado acumulado en tiempo real.",
    primaryActor: "Estudiante",
    secondaryActors: ["Docente", "Coordinador Académico"],
    module: "Calificaciones",
    criticality: "Media",
    preconditions: "Estudiante matriculado en el periodo académico.",
    postconditions: "Kárdex o boletín de notas desplegado con trazabilidad de cortes evaluativos."
  },
  {
    id: "RF-10",
    title: "Generación de Reportes",
    description: "Permite exportar en formato PDF y Excel consolidados de matrícula por programa, listados de grupos, sábanas de notas e índices de deserción/aprobación.",
    primaryActor: "Coordinador Académico",
    secondaryActors: ["Administrador", "Docente"],
    module: "Reportes",
    criticality: "Media",
    preconditions: "Datos consolidados en el periodo respectivo.",
    postconditions: "Documento binario generado y descargado con firma digital institucional."
  },
  {
    id: "RF-11",
    title: "Búsqueda y Filtros",
    description: "El sistema debe proveer mecanismos de búsqueda rápida indexada y filtrado multicriterio (por código, documento, programa, docente, grupo, periodo y estado).",
    primaryActor: "Todos los Actores",
    module: "Gestión Académica",
    criticality: "Media",
    preconditions: "Acceso autorizado a la vista correspondiente.",
    postconditions: "Conjunto de datos paginado y filtrado en un tiempo inferior a 1 segundo."
  },
  {
    id: "RF-12",
    title: "Auditoría de Operaciones",
    description: "Registro inmutable y no repudiable de toda operación crítica (inserción, actualización, eliminación de matrículas, cambios de notas, login), con IP, timestamp, usuario y payload previo/posterior.",
    primaryActor: "Administrador",
    secondaryActors: ["Sistema (Automático)"],
    module: "Auditoría",
    criticality: "Alta",
    preconditions: "Operación de escritura ejecutada en cualquier módulo del sistema.",
    postconditions: "Registro persistido en tabla inmutable de auditoría (append-only)."
  }
];

export const NON_FUNCTIONAL_REQUIREMENTS: NonFunctionalRequirement[] = [
  {
    id: "RNF-01",
    title: "Seguridad y Control de Acceso",
    category: "Seguridad",
    metric: "Cifrado en tránsito y reposo, RBAC estricto.",
    target: "HTTPS TLS 1.3 forzado, tokens JWT firmados con RSA-256 o Ed25519, hashing de contraseñas con Argon2id.",
    architecturalStrategy: "Filtro interceptor de seguridad en el reverse proxy y middleware de autorización a nivel de caso de uso.",
    module: "Autenticación y Autorización"
  },
  {
    id: "RNF-02",
    title: "Concurrencia y Tiempo de Respuesta",
    category: "Rendimiento",
    metric: "300 usuarios concurrentes simultáneos.",
    target: "Respuesta <= 3.0 s en el percentil 95 (p95) para consultas y operaciones comunes (meta interna < 800 ms).",
    architecturalStrategy: "Monolito modular con llamadas en memoria (0 ms de overhead de red inter-módulos), pool de conexiones PgBouncer/HikariCP y caché Redis para catálogos.",
    module: "Todos los Módulos"
  },
  {
    id: "RNF-03",
    title: "Disponibilidad del Sistema",
    category: "Disponibilidad",
    metric: "Porcentaje de uptime mensual.",
    target: "Disponibilidad >= 99.5 % (máximo 3.65 horas de inactividad no planificada al mes).",
    architecturalStrategy: "Health checks (/healthz), despliegue con zero-downtime (rolling updates) y réplica pasiva de base de datos PostgreSQL.",
    module: "Infraestructura & Despliegue"
  },
  {
    id: "RNF-04",
    title: "Escalabilidad",
    category: "Escalabilidad",
    metric: "Capacidad de ampliación horizontal del nodo de aplicación.",
    target: "Soporte para duplicar carga (600 usuarios pico de matrícula) añadiendo instancias sin cambios de código.",
    architecturalStrategy: "Estado de sesión sin estado (Stateless JWT) que permite balanceo Round-Robin o Least-Connections en el Reverse Proxy Nginx.",
    module: "Infraestructura & Despliegue"
  },
  {
    id: "RNF-05",
    title: "Mantenibilidad y Acoplamiento",
    category: "Mantenibilidad",
    metric: "Independencia modular y cobertura de pruebas.",
    target: "Clean Architecture con regla de dependencias inward, acoplamiento eferente Ce < 3 entre módulos de negocio.",
    architecturalStrategy: "Organización por módulos autónomos con interfaces (ports) y DTOs públicos; desacoplamiento estricto de la base de datos.",
    module: "Todos los Módulos"
  },
  {
    id: "RNF-06",
    title: "Usabilidad y Accesibilidad",
    category: "Usabilidad",
    metric: "Cumplimiento WCAG 2.1 Nivel AA.",
    target: "Contraste mínimo 4.5:1, navegación completa por teclado, interfaces intuitivas y responsivas.",
    architecturalStrategy: "Componentes UI con semántica accesible, soporte de screen readers y diseño adaptativo desktop/tablet/móvil.",
    module: "Presentación"
  },
  {
    id: "RNF-07",
    title: "Integridad y Consistencia de Datos",
    category: "Integridad",
    metric: "Tasa de inconsistencias en matrículas y cupos = 0.",
    target: "Cumplimiento estricto de propiedades ACID en transacciones de matrícula y notas.",
    architecturalStrategy: "Bloqueos pesimistas 'SELECT FOR UPDATE' en verificación de cupos dentro de una única transacción relacional en PostgreSQL.",
    module: "Matrículas & Calificaciones"
  },
  {
    id: "RNF-08",
    title: "Interoperabilidad mediante API",
    category: "Interoperabilidad",
    metric: "Estándar OpenAPI 3.0 / REST.",
    target: "100 % de los endpoints de negocio documentados con DTOs tipados y códigos HTTP semánticos (RFC 7231).",
    architecturalStrategy: "Exposición de endpoints RESTful controlados con contratos formalizados en JSON Schema / Swagger.",
    module: "Presentación & Módulos"
  },
  {
    id: "RNF-09",
    title: "Respaldos y Recuperación (DRP)",
    category: "Recuperación",
    metric: "RPO (Recovery Point Objective) y RTO (Recovery Time Objective).",
    target: "RPO < 1 hora, RTO < 2 horas en caso de falla catastrófica de infraestructura.",
    architecturalStrategy: "Snapshots diarios automatizados de PostgreSQL y WAL archiving continuo (Write-Ahead Logging) hacia almacenamiento seguro.",
    module: "Infraestructura"
  },
  {
    id: "RNF-10",
    title: "Trazabilidad de Modificaciones",
    category: "Auditoría",
    metric: "100 % de transacciones de escritura auditadas.",
    target: "Pista de auditoría inmutable con actor, timestamp UTC, entidad afectada, valor previo y valor nuevo.",
    architecturalStrategy: "Módulo transversal de auditoría que persiste eventos de dominio de forma síncrona o mediante bus de eventos en memoria.",
    module: "Auditoría"
  },
  {
    id: "RNF-11",
    title: "Privacidad y Protección de Datos",
    category: "Privacidad",
    metric: "Cumplimiento Ley 1581 de 2012 (Habeas Data Colombia).",
    target: "Ofuscación de datos sensibles (contraseñas, salarios docentes) y restricción de consulta según rol activo.",
    architecturalStrategy: "DTOs específicos por vista (Data Projection) evitando exponer columnas sensibles de la entidad de dominio.",
    module: "Autenticación & Presentación"
  },
  {
    id: "RNF-12",
    title: "Compatibilidad con Navegadores",
    category: "Compatibilidad",
    metric: "Soporte en los navegadores principales del mercado.",
    target: "Compatibilidad completa en Chrome (v110+), Firefox (v115+), Edge (v110+) y Safari (v16+).",
    architecturalStrategy: "Compilación frontend con polyfills estándar y pruebas automatizadas de compatibilidad cross-browser.",
    module: "Presentación"
  }
];

export const ARCHITECTURAL_MODULES: ArchitecturalModule[] = [
  {
    id: "mod-pres",
    name: "Módulo de Presentación",
    layer: "UI / API Controller Layer",
    cleanArchBoundary: "Presentation",
    description: "Capa externa que atiende las solicitudes de los usuarios a través de la interfaz web responsiva (React SPA) y expone los controladores REST que deserializan y validan payloads.",
    responsibilities: [
      "Renderizar vistas de usuario adaptadas a los roles: Administrador, Coordinador, Docente, Estudiante.",
      "Validar esquemas de entrada en el cliente y en los controladores REST (Boundary Input Validation).",
      "Transformar DTOs de salida a modelos de visualización (View Models).",
      "Manejar errores HTTP semánticos (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Error)."
    ],
    exportedInterfaces: ["IWebController", "IApiResponseFormatter"],
    dependencies: ["Autenticación y Autorización", "Gestión Académica", "Matrículas", "Calificaciones", "Reportes"]
  },
  {
    id: "mod-auth",
    name: "Módulo de Autenticación y Autorización",
    layer: "Security & Identity Layer",
    cleanArchBoundary: "Cross-Cutting",
    description: "Gestiona la identidad de los usuarios, emisión y verificación criptográfica de tokens JWT, y la evaluación de políticas de control de acceso basadas en roles (RBAC).",
    responsibilities: [
      "Autenticar credenciales contra repositorio de usuarios con hashing Argon2/Bcrypt.",
      "Generar tokens de acceso (JWT con claims: userId, email, roles, permissions) y Refresh Tokens.",
      "Interpretar cabecera Authorization: Bearer <token> en cada solicitud.",
      "Imponer guardas de autorización granular antes de ejecutar casos de uso de negocio."
    ],
    exportedInterfaces: ["IAuthService", "ITokenVerifier", "IPermissionChecker"],
    dependencies: ["Auditoría (para log de inicios de sesión)"]
  },
  {
    id: "mod-gestion",
    name: "Módulo de Gestión Académica",
    layer: "Core Academic Domain Layer",
    cleanArchBoundary: "Domain",
    description: "Núcleo de información académica que administra entidades maestras: programas curriculares, asignaturas, docentes, estudiantes, periodos lectivos y grupos ofertados.",
    responsibilities: [
      "Mantener la integridad de los planes de estudio y sus créditos académicos.",
      "Aperturar y cerrar periodos académicos con sus calendarios operativos.",
      "Crear grupos con horarios, salones asignados y control de cupo base.",
      "Proveer servicios de consulta y catálogo a los módulos de Matrículas y Reportes."
    ],
    exportedInterfaces: ["IGrupoCatalogService", "IEstudianteCatalogService", "IAsignaturaService"],
    dependencies: ["Auditoría"]
  },
  {
    id: "mod-matricula",
    name: "Módulo de Matrículas",
    layer: "Business Transaction Core",
    cleanArchBoundary: "Application",
    description: "Gobierna el proceso más crítico y concurrente de la institución: la inscripción de asignaturas y grupos por parte de los estudiantes con control estricto de cupo y consistencia ACID.",
    responsibilities: [
      "Validar prerrequisitos académicos del estudiante y estado financiero.",
      "Verificar disponibilidad de cupo mediante concurrencia pesimista controlada.",
      "Prevenir inscripción duplicada o cruce de horarios entre grupos del mismo estudiante.",
      "Ejecutar la reserva transaccional atómica (reserva de cupo + creación de matrícula).",
      "Publicar eventos de dominio 'MatriculaExitosaEvent' para que Auditoría y Notificaciones reaccionen."
    ],
    exportedInterfaces: ["IMatriculaService", "ICupoValidator"],
    dependencies: ["Gestión Académica (Catálogo de Grupos)", "Autenticación (Contexto de Usuario)", "Auditoría"]
  },
  {
    id: "mod-calif",
    name: "Módulo de Calificaciones",
    layer: "Evaluation Domain Layer",
    cleanArchBoundary: "Domain",
    description: "Administra el libro de calificaciones institucional, cálculo ponderado de notas, cortes evaluativos y consolidación de actas académicas.",
    responsibilities: [
      "Registrar notas parciales por corte (ej. 30%, 30%, 40%) en escala de 0.0 a 5.0.",
      "Validar fechas límite de digitación configuradas para el periodo.",
      "Calcular promedio ponderado y estado final (Aprobado / Reprobado).",
      "Permitir consulta de resultados a estudiantes y consolidado a coordinadores."
    ],
    exportedInterfaces: ["ICalificacionesService", "IPromedioCalculator"],
    dependencies: ["Gestión Académica", "Matrículas", "Auditoría"]
  },
  {
    id: "mod-reportes",
    name: "Módulo de Reportes",
    layer: "Analytics & Export Layer",
    cleanArchBoundary: "Application",
    description: "Consolida y proyecta datos en formatos imprimibles y descargables (PDF, Excel, CSV) para auditoría académica y toma de decisiones rectorales.",
    responsibilities: [
      "Generar consolidados de matrícula por programa y grupo.",
      "Construir boletines de notas y kárdex con firma institucional.",
      "Exportar sábanas de notas para archivo central institucional.",
      "Optimizar consultas analíticas mediante vistas de lectura (Read Models) sin bloquear tablas transaccionales."
    ],
    exportedInterfaces: ["IReportGeneratorService", "IExportEngine"],
    dependencies: ["Gestión Académica", "Matrículas", "Calificaciones"]
  },
  {
    id: "mod-audit",
    name: "Módulo de Auditoría",
    layer: "Cross-Cutting Governance Layer",
    cleanArchBoundary: "Cross-Cutting",
    description: "Registra de forma inmutable y con sello de tiempo todas las acciones críticas ejecutadas sobre el sistema para garantizar la no repudiabilidad y el cumplimiento regulatorio.",
    responsibilities: [
      "Capturar eventos de inserción, actualización y borrado lógico con datos anteriores y nuevos.",
      "Almacenar dirección IP, ID de usuario, endpoint y timestamp en tabla inmutable append-only.",
      "Permitir al Administrador consultar y filtrar bitácoras de auditoría ante investigaciones.",
      "Proveer interfaz asíncrona para no penalizar el tiempo de respuesta del usuario final."
    ],
    exportedInterfaces: ["IAuditoriaService", "IAuditLogRepository"],
    dependencies: []
  }
];

export const TRACEABILITY_MATRIX: TraceabilityItem[] = [
  {
    id: "TR-01",
    reqId: "RF-01",
    reqTitle: "Autenticación de usuarios",
    type: "RF",
    module: "Autenticación y Autorización",
    components: ["AuthController", "AuthService", "JwtProvider", "UserRepository"],
    verificationMethod: "Pruebas Unitarias",
    verificationCriteria: "Credenciales válidas retornan token JWT 200 OK; credenciales erróneas retornan 401 Unauthorized sin revelar si falla email o password.",
    status: "Diseñado"
  },
  {
    id: "TR-02",
    reqId: "RF-02",
    reqTitle: "Administración de roles y permisos",
    type: "RF",
    module: "Autenticación y Autorización",
    components: ["RoleController", "PermissionGuard", "RoleRepository"],
    verificationMethod: "Pruebas de Integración",
    verificationCriteria: "Un usuario sin permiso correspondiente recibe HTTP 403 Forbidden al intentar acceder a endpoints administrativos.",
    status: "Diseñado"
  },
  {
    id: "TR-03",
    reqId: "RF-03",
    reqTitle: "Gestión de estudiantes",
    type: "RF",
    module: "Gestión Académica",
    components: ["EstudianteController", "EstudianteService", "EstudianteRepository"],
    verificationMethod: "Pruebas Unitarias",
    verificationCriteria: "Validación de documento de identidad único y código institucional irrepetible; rechazo de correos duplicados.",
    status: "Diseñado"
  },
  {
    id: "TR-04",
    reqId: "RF-04",
    reqTitle: "Gestión de docentes",
    type: "RF",
    module: "Gestión Académica",
    components: ["DocenteController", "DocenteService", "DocenteRepository"],
    verificationMethod: "Pruebas Unitarias",
    verificationCriteria: "Creación exitosa con datos de escalafón y titulación; asociación correcta con las facultades de la CUN.",
    status: "Diseñado"
  },
  {
    id: "TR-05",
    reqId: "RF-05",
    reqTitle: "Gestión de programas y asignaturas",
    type: "RF",
    module: "Gestión Académica",
    components: ["ProgramaController", "AsignaturaService", "MallaCurricularEntity"],
    verificationMethod: "Pruebas de Integración",
    verificationCriteria: "Integridad referencial que impide borrar asignaturas si están vinculadas a mallas curriculares vigentes.",
    status: "Diseñado"
  },
  {
    id: "TR-06",
    reqId: "RF-06",
    reqTitle: "Gestión de grupos y periodos",
    type: "RF",
    module: "Gestión Académica",
    components: ["PeriodoController", "GrupoService", "GrupoRepository"],
    verificationMethod: "Pruebas Unitarias",
    verificationCriteria: "Un grupo no puede tener cupo máximo inferior a 1; fechas de cierre de periodo deben ser posteriores a inicio.",
    status: "Diseñado"
  },
  {
    id: "TR-07",
    reqId: "RF-07",
    reqTitle: "Matrícula académica",
    type: "RF",
    module: "Matrículas",
    components: ["MatriculaController", "MatriculaService", "CupoValidator", "MatriculaRepository"],
    verificationMethod: "Pruebas de Carga",
    verificationCriteria: "En una prueba de concurrencia con 50 peticiones simultáneas sobre un grupo con 5 cupos, exactamente 5 matrículas se aprueban y 45 son rechazadas.",
    status: "Diseñado"
  },
  {
    id: "TR-08",
    reqId: "RF-08",
    reqTitle: "Registro de calificaciones",
    type: "RF",
    module: "Calificaciones",
    components: ["CalificacionController", "CalificacionService", "CalificacionRepository"],
    verificationMethod: "Pruebas Unitarias",
    verificationCriteria: "Solo el docente asignado al grupo puede asentar notas; valores numéricos estrictamente entre 0.0 y 5.0.",
    status: "Diseñado"
  },
  {
    id: "TR-09",
    reqId: "RF-09",
    reqTitle: "Consulta de resultados académicos",
    type: "RF",
    module: "Calificaciones",
    components: ["ConsultaNotasController", "BoletinService", "NotaReadModel"],
    verificationMethod: "Pruebas de Integración",
    verificationCriteria: "El estudiante autenticado solo puede visualizar sus propias notas, imposibilitando IDOR (Insecure Direct Object Reference).",
    status: "Diseñado"
  },
  {
    id: "TR-10",
    reqId: "RF-10",
    reqTitle: "Generación de reportes",
    type: "RF",
    module: "Reportes",
    components: ["ReporteController", "PdfReportEngine", "ExcelExportEngine"],
    verificationMethod: "Pruebas de Integración",
    verificationCriteria: "Generación asíncrona de reportes mayores a 1000 registros sin bloquear el hilo principal de peticiones web.",
    status: "Diseñado"
  },
  {
    id: "TR-11",
    reqId: "RF-11",
    reqTitle: "Búsqueda y filtros",
    type: "RF",
    module: "Gestión Académica",
    components: ["SearchService", "QueryBuilderSpecification", "DbIndexStrategy"],
    verificationMethod: "Pruebas de Carga",
    verificationCriteria: "Búsquedas sobre 50.000 registros de estudiantes devuelven respuesta paginada en menos de 250 ms aprovechando índices B-tree.",
    status: "Diseñado"
  },
  {
    id: "TR-12",
    reqId: "RF-12",
    reqTitle: "Auditoría de operaciones",
    type: "RF",
    module: "Auditoría",
    components: ["AuditEventListener", "AuditoriaService", "AuditLogRepository"],
    verificationMethod: "Inspección Arquitectónica",
    verificationCriteria: "Toda mutación de estado en Matrículas o Calificaciones genera un registro inmutable en tabla 'auditoria_log' con IP y usuario.",
    status: "Diseñado"
  },
  {
    id: "TR-13",
    reqId: "RNF-01",
    reqTitle: "Seguridad mediante HTTPS y RBAC",
    type: "RNF",
    module: "Autenticación y Autorización",
    components: ["Nginx SSL Terminator", "JwtAuthMiddleware", "SecurityContext"],
    verificationMethod: "Auditoría de Seguridad",
    verificationCriteria: "Escaneo OWASP ZAP sin vulnerabilidades críticas; calificación A+ en SSL Labs; rechazo estricto de HTTP plano.",
    status: "Diseñado"
  },
  {
    id: "TR-14",
    reqId: "RNF-02",
    reqTitle: "300 concurrentes y p95 < 3s",
    type: "RNF",
    module: "Todos los Módulos",
    components: ["Node.js/Express App Instance", "HikariCP/PgBouncer Pool", "PostgreSQL 16"],
    verificationMethod: "Pruebas de Carga",
    verificationCriteria: "Script k6 ejecutando 300 Virtual Users (VU) durante 15 minutos en escenario mixto: latencia p95 <= 1.2s (por debajo de la meta de 3s).",
    status: "Diseñado"
  },
  {
    id: "TR-15",
    reqId: "RNF-03",
    reqTitle: "Disponibilidad 99.5%",
    type: "RNF",
    module: "Infraestructura & Despliegue",
    components: ["HealthCheckEndpoint", "Docker Compose / Kube Replica", "PostgreSQL Standby"],
    verificationMethod: "Inspección Arquitectónica",
    verificationCriteria: "Monitoreo continuo mediante sonda externa con alertas por caída; reinicio automático de contenedores saludables.",
    status: "Diseñado"
  },
  {
    id: "TR-16",
    reqId: "RNF-05",
    reqTitle: "Mantenibilidad Monolito Modular",
    type: "RNF",
    module: "Todos los Módulos",
    components: ["ArchUnit / ESLint Boundary Rules", "Clean Architecture Layers"],
    verificationMethod: "Análisis Estático (SAST)",
    verificationCriteria: "Regla estricta de compilación: ningún módulo accede a tablas de otro módulo directamente sino a través de sus contratos de servicio.",
    status: "Diseñado"
  },
  {
    id: "TR-17",
    reqId: "RNF-07",
    reqTitle: "Integridad y Consistencia ACID",
    type: "RNF",
    module: "Matrículas & Calificaciones",
    components: ["PostgreSQL Transaction Manager", "Row-Level Locking"],
    verificationMethod: "Pruebas de Integración",
    verificationCriteria: "Verificación de nivel de aislamiento READ COMMITTED con SELECT FOR UPDATE; ante fallo en mitad del flujo se ejecuta ROLLBACK automático.",
    status: "Diseñado"
  },
  {
    id: "TR-18",
    reqId: "RNF-10",
    reqTitle: "Trazabilidad no repudiable",
    type: "RNF",
    module: "Auditoría",
    components: ["AuditLogEntity", "AppendOnlyDatabasePolicy"],
    verificationMethod: "Inspección Arquitectónica",
    verificationCriteria: "La tabla de auditoría carece de permisos de UPDATE o DELETE para el usuario de la aplicación en PostgreSQL (solo INSERT y SELECT).",
    status: "Diseñado"
  }
];

export const RISKS_AND_QUALITY: RiskItem[] = [
  {
    id: "RSK-01",
    category: "Punto Único de Falla (SPOF)",
    riskDescription: "Caída del único nodo de base de datos relacional PostgreSQL deteniendo todo el sistema académico institucional.",
    probability: "Baja",
    impact: "Crítico",
    mitigationStrategy: "Configuración de replicación Streaming Asíncrona con un nodo Standby en zona de disponibilidad secundaria y failover automático gestionado por Patroni o servicio administrado Cloud SQL.",
    monitoringMechanism: "Sonda de monitoreo con pg_isready cada 10 segundos y alerta P1 inmediata a guardia de infraestructura."
  },
  {
    id: "RSK-02",
    category: "Rendimiento",
    riskDescription: "Contención de bloqueos (Lock contention) durante el día de matrícula masiva al intentar varios estudiantes inscribir los mismos grupos populares.",
    probability: "Media",
    impact: "Alto",
    mitigationStrategy: "Transacciones ultra-cortas que solo bloquean la fila del grupo durante el decremento del contador de cupos; validaciones previas en memoria; cola de espera virtual opcional.",
    monitoringMechanism: "Monitoreo de vistas pg_stat_activity en PostgreSQL filtrando por 'wait_event_type = Lock'."
  },
  {
    id: "RSK-03",
    category: "Seguridad",
    riskDescription: "Fuga o compromiso de tokens JWT que permita a un atacante suplantar la identidad de un docente o administrador.",
    probability: "Baja",
    impact: "Crítico",
    mitigationStrategy: "Tokens de acceso con tiempo de vida corto (15 a 30 minutos), rotación de Refresh Tokens almacenados en cookies HttpOnly con banderas Secure y SameSite=Strict, y lista de revocación en Redis.",
    monitoringMechanism: "Detección de accesos concurrentes desde IPs geográficamente incompatibles y registro en bitácora de auditoría."
  },
  {
    id: "RSK-04",
    category: "Mantenibilidad",
    riskDescription: "Degeneración arquitectónica donde los desarrolladores comiencen a acoplar módulos importando modelos internos entre sí, convirtiendo el monolito en una 'Big Ball of Mud'.",
    probability: "Media",
    impact: "Alto",
    mitigationStrategy: "Implementación de linter arquitectónico (ArchUnit en JVM o dependency-cruiser en TypeScript/Node) en el pipeline de CI/CD que rompa el build si un módulo viola los límites de su frontera pública.",
    monitoringMechanism: "Análisis estático automático en cada Pull Request antes de fusionar código a la rama principal."
  },
  {
    id: "RSK-05",
    category: "Disponibilidad",
    riskDescription: "Agotamiento del pool de conexiones a la base de datos bajo ráfagas de 300 usuarios concurrentes, provocando errores 504 Gateway Timeout.",
    probability: "Media",
    impact: "Alto",
    mitigationStrategy: "Implementación de PgBouncer en modo 'transaction pooling', dimensionamiento adecuado del pool (30-50 conexiones activas bastan para atender miles de peticiones rápidas) y timeout estricto de conexión de 2 segundos.",
    monitoringMechanism: "Métrica de saturación de conexiones en PgBouncer (cl_waiting vs cl_active)."
  },
  {
    id: "RSK-06",
    category: "Escalabilidad",
    riskDescription: "Incremento imprevisto en la matrícula estudiantil superando los 1.000 usuarios concurrentes en semestres futuros.",
    probability: "Media",
    impact: "Medio",
    mitigationStrategy: "La arquitectura sin estado del monolito modular permite clonar el contenedor de backend horizontalmente tras el balanceador Nginx en minutos, manteniendo la misma base de datos con réplicas de solo lectura.",
    monitoringMechanism: "Auto-escalado basado en consumo de CPU (> 75%) y porcentaje de peticiones concurrentes."
  }
];

export const PLANTUML_DIAGRAMS = {
  useCase: `@startuml SGA_Diagrama_Casos_de_Uso
!theme vibrant
skinparam packageStyle rectangle
skinparam actorStyle awesome
skinparam defaultFontName "Inter", "Arial"
skinparam roundCorner 10

title Sistema de Gestión Académica (SGA) - CUN\\nDiagrama de Casos de Uso del Sistema (RF-01 al RF-12)

left to right direction

' ==========================================
' ACTORES DEL SISTEMA
' ==========================================
actor "Administrador" as Admin #LightBlue
actor "Coordinador Académico" as Coord #LightSkyBlue
actor "Docente" as Docente #LightGreen
actor "Estudiante" as Estudiante #SandyBrown
actor "Sistema / Cron" as Sys #LightGray

' ==========================================
' LÍMITE DEL SISTEMA (SGA)
' ==========================================
rectangle "Sistema de Gestión Académica (SGA - CUN)" {

    ' Seguridad y transversal
    usecase "RF-01: Autenticar Usuario" as UC_Auth
    usecase "RF-02: Administrar Roles y Permisos" as UC_Roles
    usecase "RF-12: Registrar Pista de Auditoría" as UC_Audit
    usecase "RF-11: Buscar y Filtrar Información" as UC_Search

    ' Gestión Académica
    usecase "RF-03: Gestionar Estudiantes" as UC_Estudiantes
    usecase "RF-04: Gestionar Docentes" as UC_Docentes
    usecase "RF-05: Gestionar Programas y Asignaturas" as UC_Programas
    usecase "RF-06: Gestionar Grupos y Periodos" as UC_Grupos

    ' Matrículas
    usecase "RF-07: Realizar Matrícula Académica" as UC_Matricula
    usecase "Validar Cupo Disponible" as UC_ValCupo
    usecase "Verificar Matrícula Duplicada" as UC_ValDup
    usecase "Notificar Cupo Agotado" as UC_NotifAgotado

    ' Calificaciones
    usecase "RF-08: Registrar Calificaciones" as UC_RegNotas
    usecase "RF-09: Consultar Resultados Académicos" as UC_ConsNotas
    usecase "Calcular Promedio Ponderado" as UC_Promedio

    ' Reportes
    usecase "RF-10: Generar Reportes Académicos" as UC_Reportes
    usecase "Exportar a PDF / Excel" as UC_Export
}

' ==========================================
' RELACIONES DE ADMINISTRADOR
' ==========================================
Admin --> UC_Auth
Admin --> UC_Roles
Admin --> UC_Estudiantes
Admin --> UC_Docentes
Admin --> UC_Audit
Admin --> UC_Search

' ==========================================
' RELACIONES DE COORDINADOR ACADÉMICO
' ==========================================
Coord --> UC_Auth
Coord --> UC_Programas
Coord --> UC_Grupos
Coord --> UC_Reportes
Coord --> UC_Search
Coord --> UC_ConsNotas

' ==========================================
' RELACIONES DE DOCENTE
' ==========================================
Docente --> UC_Auth
Docente --> UC_RegNotas
Docente --> UC_Search

' ==========================================
' RELACIONES DE ESTUDIANTE
' ==========================================
Estudiante --> UC_Auth
Estudiante --> UC_Matricula
Estudiante --> UC_ConsNotas
Estudiante --> UC_Search

' ==========================================
' RELACIONES UML: <<include>> y <<extend>>
' ==========================================
UC_Matricula ..> UC_Auth : <<include>>
UC_Matricula ..> UC_ValCupo : <<include>>
UC_Matricula ..> UC_ValDup : <<include>>
UC_Matricula ..> UC_Audit : <<include>>
UC_NotifAgotado .> UC_Matricula : <<extend>>\\n(Si cupo == 0)

UC_RegNotas ..> UC_Auth : <<include>>
UC_RegNotas ..> UC_Audit : <<include>>

UC_ConsNotas ..> UC_Promedio : <<include>>
UC_Reportes ..> UC_Export : <<include>>
UC_Roles ..> UC_Audit : <<include>>
UC_Grupos ..> UC_Audit : <<include>>

Sys --> UC_Audit
@enduml`,

  components: `@startuml SGA_Diagrama_Componentes
!theme vibrant
skinparam defaultFontName "Inter", "Arial"
skinparam componentStyle uml2
skinparam packageStyle frame
skinparam roundCorner 8

title Sistema de Gestión Académica (SGA - CUN)\\nDiagrama de Componentes - Arquitectura Monolito Modular con Clean Architecture

' ==========================================
' CAPA DE PRESENTACIÓN / CONTROLADORES
' ==========================================
package "Capa de Presentación (Web & API)" as P_UI {
    component [React SPA Frontend\\n(Vite + Tailwind + TypeScript)] as Comp_SPA
    component [API Controllers / REST Gateway\\n(Validation, DTO Mapping, HTTP Errors)] as Comp_Controllers
}

' ==========================================
' MONOLITO MODULAR - MÓDULOS DE NEGOCIO
' ==========================================
node "Servidor Monolito Modular (Clean Architecture)" as AppServer {

    package "Módulo: Autenticación y Autorización" as Mod_Auth {
        interface "IAuthService" as IAuth
        interface "IPermissionChecker" as IPerm
        component [Auth Core & JWT Provider] as Comp_AuthCore
        component [RBAC Policy Engine] as Comp_RBAC
    }

    package "Módulo: Gestión Académica" as Mod_Gestion {
        interface "IGrupoCatalogService" as IGrupoCat
        interface "IEstudianteCatalog" as IEstCat
        interface "IAsignaturaService" as IAsigServ
        component [Programas & Asignaturas Manager] as Comp_Prog
        component [Grupos & Periodos Manager] as Comp_Grupos
        component [Estudiantes & Docentes Directory] as Comp_Direct
    }

    package "Módulo: Matrículas" as Mod_Matricula {
        interface "IMatriculaService" as IMatricula
        component [Procesador Transaccional de Matrícula] as Comp_MatriculaCore
        component [Validador de Cupos & Prerrequisitos] as Comp_CupoVal
    }

    package "Módulo: Calificaciones" as Mod_Calif {
        interface "ICalificacionesService" as ICalif
        component [Libro de Calificaciones & Cortes] as Comp_CalifCore
        component [Motor de Promedio Ponderado] as Comp_Promedio
    }

    package "Módulo: Reportes" as Mod_Reportes {
        interface "IReportService" as IReport
        component [Generador de Reportes & Estadísticas] as Comp_ReportEngine
        component [Exportador PDF / Excel (Worker)] as Comp_ExportWorker
    }

    package "Módulo Transversal: Auditoría" as Mod_Audit {
        interface "IAuditoriaService" as IAudit
        component [Auditor de Eventos Inmutables] as Comp_AuditCore
    }
}

' ==========================================
' CAPA DE PERSISTENCIA Y DATOS
' ==========================================
database "PostgreSQL 16 (Relational Database)" as DB {
    folder "Esquema: Seguridad (users, roles, permissions)" as DB_Sec
    folder "Esquema: Academia (programas, asignaturas, grupos)" as DB_Acad
    folder "Esquema: Transaccional (matriculas, calificaciones)" as DB_Trans
    folder "Esquema: Auditoria (audit_log append-only)" as DB_Audit
}

database "Redis 7 (In-Memory Cache)" as Cache {
    [Cache de Catálogos & Token Blacklist] as Cache_Store
}

' ==========================================
' CONEXIONES E INTERFACES ENTRE COMPONENTES
' ==========================================
Comp_SPA ..> Comp_Controllers : HTTPS / JSON REST API
Comp_Controllers ..> IAuth : Invoca
Comp_Controllers ..> IMatricula : Invoca
Comp_Controllers ..> ICalif : Invoca
Comp_Controllers ..> IReport : Invoca
Comp_Controllers ..> IGrupoCat : Invoca

Comp_AuthCore -up- IAuth
Comp_RBAC -up- IPerm

Comp_MatriculaCore -up- IMatricula
Comp_MatriculaCore ..> IGrupoCat : Consulta cupo y estado
Comp_MatriculaCore ..> IEstCat : Valida ficha estudiante
Comp_MatriculaCore ..> IPerm : Valida rol estudiante
Comp_MatriculaCore ..> IAudit : Registra matrícula exitosa/fallida

Comp_CalifCore -up- ICalif
Comp_CalifCore ..> IMatricula : Verifica matrícula activa
Comp_CalifCore ..> IAudit : Registra asentamiento de notas

Comp_ReportEngine -up- IReport
Comp_ReportEngine ..> IGrupoCat : Consulta oferta
Comp_ReportEngine ..> ICalif : Consulta consolidados

Comp_AuditCore -up- IAudit

' Persistencia
Mod_Auth --> DB_Sec : JPA / Drizzle ORM
Mod_Gestion --> DB_Acad : JPA / Drizzle ORM
Mod_Matricula --> DB_Trans : ACID Transaction
Mod_Calif --> DB_Trans : ACID Transaction
Mod_Audit --> DB_Audit : Append-Only Insert

Mod_Gestion ..> Cache_Store : Hit / Miss
Mod_Auth ..> Cache_Store : Blacklist Check
@enduml`,

  deployment: `@startuml SGA_Diagrama_Despliegue
!theme vibrant
skinparam defaultFontName "Inter", "Arial"
skinparam nodeStyle rectangle
skinparam roundCorner 8

title Sistema de Gestión Académica (SGA - CUN)\\nDiagrama de Despliegue Físico y de Infraestructura para 300 Usuarios Concurrentes

' ==========================================
' DISPOSITIVOS CLIENTES
' ==========================================
node "Cliente Web (Estudiantes, Docentes, Coordinadores, Admin)" as ClientNode {
    artifact "Navegador Web Moderno\\n(Chrome, Firefox, Safari, Edge)" as WebBrowser {
        component [React 19 SPA\\nSingle Page Application] as ClientApp
    }
}

' ==========================================
' PERÍMETRO DE RED INSTITUCIONAL (DMZ)
' ==========================================
cloud "Internet / Red CUN" as WAN

node "Servidor Proxy Inverso & Edge" as ProxyServer {
    component [Nginx / Cloudflare Proxy\\n(SSL/TLS 1.3 Termination,\\nRate Limiting 50 req/s,\\nStatic Content Cache)] as Nginx
}

' ==========================================
' ZONA DE APLICACIONES (VPC PRIVADA)
' ==========================================
package "Virtual Private Cloud (VPC CUN - Subred Privada)" {

    node "Servidor de Aplicaciones (Contenedor Docker)" as AppNode {
        component [Monolito Modular SGA\\nRuntime: Node.js LTS / JVM\\n(2 vCPU, 4 GB RAM, 4 Workers)] as SGAApp
        component [Connection Pool HikariCP / PgBouncer\\n(Pool Size: 30 - 50 conexiones activas)] as ConnPool
    }

    node "Servidor de Caché Rápida" as CacheNode {
        component [Redis In-Memory 7.x\\n(Caché Catálogos & Sesiones JWT)] as RedisInst
    }

    ' ==========================================
    ' ZONA DE DATOS (ALTA INTEGRIDAD)
    ' ==========================================
    node "Servidor Principal de Base de Datos" as DBNodeMaster {
        database "PostgreSQL 16 Relacional (Master)\\n(ACID Compliant, WAL Archiving,\\nShared Buffers: 2GB, Work Mem: 16MB)" as PGMaster
    }

    node "Servidor Réplica de Base de Datos (Opcional HA)" as DBNodeStandby {
        database "PostgreSQL 16 Standby\\n(Read-Only Replica / Disaster Recovery)" as PGStandby
    }
}

' ==========================================
' PROTOCOLOS Y CANALES DE COMUNICACIÓN
' ==========================================
ClientApp -- WAN : HTTPS / TLS 1.3 (Puerto 443)
WAN -- Nginx : Peticiones Cifradas
Nginx -- SGAApp : Reverse Proxy HTTP/2 (Puerto 3000 interno)
SGAApp -- RedisInst : Protocolo RESP (TCP Puerto 6379)
SGAApp -- ConnPool : In-Memory Bridge
ConnPool -- PGMaster : PostgreSQL Native Wire Protocol (TCP Puerto 5432)
PGMaster ..> PGStandby : WAL Streaming Replication (Asíncrona)

note right of SGAApp
  **Sizing para 300 usuarios concurrentes:**
  - Throughput esperado: 30 a 50 RPS pico
  - Consumo CPU por instancia: ~35% con 2 vCPU
  - Tiempo de respuesta p95: < 450 ms
  - Llamadas entre módulos: 0 ms (in-process memory)
end note

note bottom of PGMaster
  **Integridad Transaccional:**
  - Bloqueos SELECT FOR UPDATE en cupos
  - Pistas de auditoría en tabla inmutable
  - Respaldos continuos RPO < 1h
end note
@enduml`,

  dataModel: `@startuml SGA_Modelo_Datos_Conceptual
!theme vibrant
skinparam defaultFontName "Inter", "Arial"
skinparam classAttributeIconSize 0
skinparam roundCorner 8

title Sistema de Gestión Académica (SGA - CUN)\\nModelo de Datos Conceptual y Relacional (DER - 10 Entidades)

entity "Usuario" as Usuario {
    * id_usuario : UUID [PK]
    --
    * email_institucional : VARCHAR(120) [UNIQUE]
    * password_hash : VARCHAR(255)
    * nombres : VARCHAR(100)
    * apellidos : VARCHAR(100)
    * tipo_documento : VARCHAR(20)
    * numero_documento : VARCHAR(30) [UNIQUE]
    * telefono : VARCHAR(20)
    * estado : ENUM('ACTIVO', 'INACTIVO', 'BLOQUEADO')
    * fecha_creacion : TIMESTAMP
    * fecha_actualizacion : TIMESTAMP
}

entity "Rol" as Rol {
    * id_rol : INTEGER [PK]
    --
    * nombre_rol : VARCHAR(50) [UNIQUE]
    * descripcion : TEXT
    * permisos_json : JSONB
}

entity "Usuario_Rol" as UsuarioRol {
    * id_usuario : UUID [PK, FK]
    * id_rol : INTEGER [PK, FK]
    --
    * fecha_asignacion : TIMESTAMP
}

entity "Estudiante" as Estudiante {
    * id_estudiante : UUID [PK]
    --
    * id_usuario : UUID [FK, UNIQUE]
    * codigo_estudiantil : VARCHAR(20) [UNIQUE]
    * id_programa : UUID [FK]
    * semestre_actual : INTEGER
    * estado_academico : ENUM('MATRICULADO', 'INACTIVO', 'GRADUADO', 'SANCIONADO')
    * promedio_acumulado : DECIMAL(3,2)
}

entity "Docente" as Docente {
    * id_docente : UUID [PK]
    --
    * id_usuario : UUID [FK, UNIQUE]
    * codigo_docente : VARCHAR(20) [UNIQUE]
    * especialidad : VARCHAR(100)
    * titulo_academico : VARCHAR(100)
    * tipo_contrato : VARCHAR(50)
}

entity "Programa" as Programa {
    * id_programa : UUID [PK]
    --
    * codigo_snies : VARCHAR(20) [UNIQUE]
    * nombre_programa : VARCHAR(150)
    * nivel_formacion : ENUM('TECNICO', 'TECNOLOGICO', 'PROFESIONAL', 'POSGRADO')
    * total_creditos : INTEGER
    * estado : BOOLEAN
}

entity "Asignatura" as Asignatura {
    * id_asignatura : UUID [PK]
    --
    * codigo_asignatura : VARCHAR(20) [UNIQUE]
    * id_programa : UUID [FK]
    * nombre_asignatura : VARCHAR(150)
    * creditos : INTEGER
    * semestre_sugerido : INTEGER
    * es_electiva : BOOLEAN
}

entity "PeriodoAcademico" as PeriodoAcademico {
    * id_periodo : UUID [PK]
    --
    * codigo_periodo : VARCHAR(10) [UNIQUE] ' Ej: 2026-1
    * fecha_inicio : DATE
    * fecha_fin : DATE
    * fecha_inicio_matricula : TIMESTAMP
    * fecha_fin_matricula : TIMESTAMP
    * estado : ENUM('PLANIFICACION', 'MATRICULA_ABIERTA', 'EN_CURSO', 'CERRADO')
}

entity "Grupo" as Grupo {
    * id_grupo : UUID [PK]
    --
    * codigo_grupo : VARCHAR(20)
    * id_asignatura : UUID [FK]
    * id_periodo : UUID [FK]
    * id_docente : UUID [FK]
    * cupo_maximo : INTEGER
    * cupos_ocupados : INTEGER
    * horario_json : JSONB
    * aula : VARCHAR(50)
    * estado : ENUM('ABIERTO', 'CERRADO', 'CANCELADO')
}

entity "Matricula" as Matricula {
    * id_matricula : UUID [PK]
    --
    * id_estudiante : UUID [FK]
    * id_grupo : UUID [FK]
    * fecha_matricula : TIMESTAMP
    * estado_matricula : ENUM('REGISTRADA', 'CANCELADA', 'APROBADA', 'REPROBADA')
    * nota_definitiva : DECIMAL(3,2)
    * observacion : TEXT
}

entity "Calificacion" as Calificacion {
    * id_calificacion : UUID [PK]
    --
    * id_matricula : UUID [FK]
    * corte : INTEGER ' 1, 2 o 3
    * porcentaje_corte : DECIMAL(4,2) ' 30%, 30%, 40%
    * valor_nota : DECIMAL(3,2) ' Escala 0.0 a 5.0
    * retroalimentacion : TEXT
    * fecha_registro : TIMESTAMP
    * modificado_por : UUID [FK]
}

entity "AuditoriaLog" as AuditoriaLog {
    * id_auditoria : BIGSERIAL [PK]
    --
    * id_usuario : UUID
    * accion : VARCHAR(50) ' INSERT, UPDATE, DELETE, LOGIN
    * modulo : VARCHAR(50)
    * tabla_afectada : VARCHAR(50)
    * registro_id : VARCHAR(50)
    * payload_anterior : JSONB
    * payload_nuevo : JSONB
    * direccion_ip : VARCHAR(45)
    * timestamp_evento : TIMESTAMP
}

' ==========================================
' CARDINALIDADES Y RELACIONES
' ==========================================
Usuario ||--o{ UsuarioRol : "tiene (1:N)"
Rol ||--o{ UsuarioRol : "asignado a (1:N)"

Usuario ||--o| Estudiante : "perfil de (1:1 opc)"
Usuario ||--o| Docente : "perfil de (1:1 opc)"

Programa ||--o{ Estudiante : "cursa (1:N)"
Programa ||--o{ Asignatura : "contiene (1:N)"

Asignatura ||--o{ Grupo : "se oferta en (1:N)"
PeriodoAcademico ||--o{ Grupo : "pertenece a (1:N)"
Docente ||--o{ Grupo : "orienta (1:N)"

Estudiante ||--o{ Matricula : "inscribe (1:N)"
Grupo ||--o{ Matricula : "matriculados en (1:N)"

Matricula ||--o{ Calificacion : "posee (1:N cortes)"
@enduml`,

  sequence: `@startuml SGA_Diagrama_Secuencia_Matricula
!theme vibrant
skinparam defaultFontName "Inter", "Arial"
skinparam roundCorner 8
skinparam BoxPadding 10
skinparam ParticipantPadding 10
autonumber "<b>[00]</b>"

title Sistema de Gestión Académica (SGA - CUN)\\nDiagrama de Secuencia: Proceso Completo de Matrícula Académica (9 Pasos Exactos)

actor "Estudiante" as Estudiante #SandyBrown
boundary "UI Cliente Web\\n(React SPA)" as UI #LightCyan
control "Controlador REST\\n(MatriculaController)" as Ctrl #LightBlue
participant "Servicio de Seguridad\\n(AuthService / Guard)" as Auth #Pink
participant "Servicio de Matrícula\\n(MatriculaService)" as MatService #LightGreen
participant "Validador de Cupos\\n(CupoValidator)" as CupoVal #YellowGreen
database "Base de Datos\\n(PostgreSQL 16)" as DB #LightSalmon
participant "Servicio de Auditoría\\n(AuditoriaService)" as Audit #LightSteelBlue

== PASO 1: Selección de Grupo ==
Estudiante -> UI : 1. Selecciona Grupo (idGrupo: "GRP-MAT-01") en la oferta académica
activate UI
UI -> UI : Prevalida requisitos en cliente (sesión y horarios)

== PASO 2: Envío de Solicitud ==
UI -> Ctrl : 2. POST /api/v1/matriculas\\nHeaders: Authorization: Bearer <JWT>\\nBody: { idGrupo: "GRP-MAT-01" }
activate Ctrl

== PASO 3: Validación de Autenticación ==
Ctrl -> Auth : 3. validateToken(jwt)
activate Auth
Auth -> Auth : Verifica firma criptográfica (RSA-256) y expiración
Auth --> Ctrl : 3.1 Token Válido (Claims: idUsuario, rol: "ESTUDIANTE")
deactivate Auth

== PASO 4: Verificación de Permisos ==
Ctrl -> Auth : 4. checkPermission(idUsuario, "MATRICULA_REALIZAR")
activate Auth
Auth --> Ctrl : 4.1 Permiso Otorgado
deactivate Auth

Ctrl -> MatService : procesarMatricula(idEstudiante, idGrupo)
activate MatService

== PASO 5: Validación de Cupo Disponible ==
MatService -> CupoVal : 5. verificarDisponibilidadCupo(idGrupo)
activate CupoVal
CupoVal -> DB : BEGIN TRANSACTION\\nSELECT cupo_maximo, cupos_ocupados FROM Grupo\\nWHERE id_grupo = 'GRP-MAT-01' FOR UPDATE
activate DB
DB --> CupoVal : { cupo_maximo: 30, cupos_ocupados: 28 }
CupoVal --> MatService : Cupo Disponible (28/30 cupos ocupados)
deactivate CupoVal

== PASO 6: Verificación de Matrícula Duplicada ==
MatService -> DB : 6. SELECT COUNT(*) FROM Matricula\\nWHERE id_estudiante = ? AND id_grupo = ? AND estado != 'CANCELADA'
DB --> MatService : count = 0 (No existe duplicado previo)

alt [Cupo disponible y sin duplicidad]

    == PASO 7: Registro Transaccional ==
    MatService -> DB : 7.1 INSERT INTO Matricula (id_matricula, id_estudiante, id_grupo, estado, fecha)\\nVALUES (UUID, ?, ?, 'REGISTRADA', NOW())
    MatService -> DB : 7.2 UPDATE Grupo SET cupos_ocupados = cupos_ocupados + 1\\nWHERE id_grupo = 'GRP-MAT-01'
    MatService -> DB : 7.3 COMMIT TRANSACTION
    DB --> MatService : Transacción Confirmada con Éxito (ACID)
    deactivate DB

    == PASO 8: Registro de Auditoría ==
    MatService -> Audit : 8. registrarEventoAuditoria({\\n  usuario: idEstudiante,\\n  accion: 'MATRICULA_EXITOSA',\\n  grupo: 'GRP-MAT-01',\\n  ip: request.ip,\\n  timestamp: UTC\\n})
    activate Audit
    Audit -> DB : INSERT INTO AuditoriaLog VALUES (...)
    Audit --> MatService : Auditoría Asentada
    deactivate Audit

    == PASO 9: Confirmación al Estudiante ==
    MatService --> Ctrl : Matrícula Registrada DTO (idMatricula, comprobante)
    deactivate MatService
    Ctrl --> UI : HTTP 201 Created\\n{ status: "SUCCESS", comprobante: "MAT-2026-9812", grupo: "GRP-MAT-01" }
    deactivate Ctrl
    UI --> Estudiante : 9. Muestra Comprobante de Matrícula exitoso y horario asignado
    deactivate UI

else [Cupo Agotado o Conflicto Duplicado]
    MatService -> DB : ROLLBACK TRANSACTION
    activate DB
    deactivate DB
    MatService -> Audit : registrarEventoAuditoria({ accion: 'MATRICULA_RECHAZADA_SIN_CUPO' })
    activate Audit
    deactivate Audit
    MatService --> Ctrl : Excepción: CupoAgotadoException / DuplicadoException
    activate Ctrl
    Ctrl --> UI : HTTP 409 Conflict / 422 Unprocessable\\n{ error: "El grupo seleccionado ya no posee cupos disponibles" }
    deactivate Ctrl
    activate UI
    UI --> Estudiante : Muestra alerta: "Cupo no disponible, seleccione otro horario"
    deactivate UI
end
@enduml`
};

export const COMPARATIVE_ANALYSIS = {
  selectedArchitecture: "Monolito Modular con Clean Architecture",
  targetLoad: "300 usuarios concurrentes simultáneos",
  summary: "Para una institución de educación superior con un perfil de 300 usuarios concurrentes, el Monolito Modular basado en principios de Clean Architecture representa la solución arquitectónica óptima: ofrece la modularidad y separación de responsabilidades de los microservicios, pero eliminando la sobrecarga de red, transacciones distribuidas complejas (patrón Saga) y costos operacionales desproporcionados.",
  criteria: [
    {
      criterion: "Latencia en Llamadas entre Módulos",
      modularMonolith: "0.001 ms a 0.05 ms (In-memory procedure call en el stack del proceso)",
      microservices: "5 ms a 35 ms por llamada HTTP/gRPC a través de la red (hop latency)",
      verdict: "Victoria contundente Monolito Modular: no hay serialización JSON masiva ni multiplexación de sockets para coordinar matrícula y auditoría."
    },
    {
      criterion: "Consistencia Transaccional (Matrícula y Cupos)",
      modularMonolith: "ACID Nativo en una única transacción relacional (BEGIN ... COMMIT con SELECT FOR UPDATE)",
      microservices: "Consistencia Eventual / Sagas distribuidas (riesgo de 'overbooking' de cupos bajo ráfagas concurrentes)",
      verdict: "Victoria Monolito Modular: la matrícula universitaria exige integridad atómica absoluta para evitar que dos estudiantes tomen el último cupo."
    },
    {
      criterion: "Soporte para 300 Usuarios Concurrentes",
      modularMonolith: "Excelente: 300 usuarios generan ~30 a 50 RPS pico, fácilmente atendidos por 1 o 2 contenedores de 2 vCPU",
      microservices: "Sobredimensionado: requiere al menos 7 a 10 pods independientes, API Gateway, Service Mesh y RabbitMQ/Kafka",
      verdict: "Monolito Modular: menor consumo de memoria RAM y CPU para la misma escala de usuarios."
    },
    {
      criterion: "Complejidad Operacional y DevOps",
      modularMonolith: "Baja/Media: Un solo pipeline CI/CD, una sola imagen Docker, base de datos centralizada con respaldos sencillos",
      microservices: "Muy Alta: Múltiples repositorios, orquestación Kubernetes, observabilidad distribuida (OpenTelemetry, Jaeger, Prometheus)",
      verdict: "Monolito Modular reduce drásticamente el costo total de propiedad (TCO) para la institución educativa."
    },
    {
      criterion: "Aislamiento y Deuda Técnica",
      modularMonolith: "Alto si se aplican reglas de fronteras (ArchUnit / interfaces estrictas entre módulos)",
      microservices: "Alto por frontera de proceso físico",
      verdict: "Empate técnico: con Clean Architecture, los módulos del monolito se compilan con contratos estrictos y DTOs independientes."
    },
    {
      criterion: "Costo de Infraestructura en la Nube",
      modularMonolith: "$35 - $80 USD / mes (1 VPS o contenedor Cloud Run + Cloud SQL PostgreSQL)",
      microservices: "$350 - $900 USD / mes (Clúster EKS/GKE, balanceadores por servicio, colas de mensajería, logs distribuidos)",
      verdict: "Ahorro institucional de hasta 85% en costos de nube para la CUN."
    }
  ]
};

export const CAPACITY_SIZING = {
  concurrentUsers: 300,
  averageThinkTimeSeconds: 8, // Tiempo promedio de lectura o interacción humana por pantalla
  calculatedRpsPeak: 37.5, // 300 / 8 = 37.5 Requests Per Second pico promedio
  safetyFactor: 1.5,
  designRps: 56.25, // RPS con factor de seguridad
  averageDbQueriesPerReq: 2.4,
  calculatedDbQps: 135, // Queries Per Second en PostgreSQL
  networkBandwidthKbpsPerUser: 45, // KB/s promedio de transferencia
  totalBandwidthMbps: 13.5, // 300 * 45 KB/s * 8 / 1024 = 13.5 Mbps (cualquier enlace institucional de 100 Mbps opera con holgura del 86%)
  recommendedSpecs: {
    appServer: "2 vCPU, 4 GB RAM (Node.js o JVM Container)",
    dbServer: "2 vCPU, 4 GB a 8 GB RAM (PostgreSQL 16 en SSD)",
    dbPoolSize: "30 a 40 conexiones activas con PgBouncer",
    storageIoPs: "300 a 1000 IOPS (Disco SSD estándar)"
  }
};
