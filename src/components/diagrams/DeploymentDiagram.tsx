import React from 'react';
import { PLANTUML_DIAGRAMS, CAPACITY_SIZING } from '../../data/acaData';
import { PlantUmlViewer } from '../common/PlantUmlViewer';
import { Server, Shield, Network, Cpu, HardDrive, CheckCircle2 } from 'lucide-react';

export const DeploymentDiagram: React.FC = () => {
  const modelingDecisions = [
    "Terminación SSL/TLS 1.3 en el Reverse Proxy: Nginx asume la carga de negociación criptográfica y descompresión gzip/brotli, aliviando de cómputo al servidor de aplicaciones Node.js/JVM.",
    "Aislamiento en Red VPC Privada: El servidor de aplicaciones y los nodos de PostgreSQL y Redis residen en subredes privadas sin IP pública directa, previniendo accesos no autorizados a nivel de firewall de red.",
    "Pool de conexiones optimizado (PgBouncer): En lugar de abrir una conexión PostgreSQL pesada por cada uno de los 300 usuarios concurrentes (lo que consumiría más de 3 GB de RAM en el motor de base de datos), se utiliza un pool transaccional de 30 a 50 conexiones que atiende de forma ultra-rápida las peticiones.",
    "Estrategia de Alta Disponibilidad (HA) con Standby: PostgreSQL Master replica de forma asíncrona mediante Streaming WAL hacia un nodo Standby en zona de disponibilidad secundaria, garantizando RTO < 2h y RPO < 1h.",
    "Dimensionamiento justo para 300 usuarios: 300 usuarios interactuando simultáneamente generan entre 30 y 50 Requests Per Second (RPS) pico, perfectamente absorbibles por una sola instancia de 2 vCPUs con uso promedio menor al 40%."
  ];

  const assumptions = [
    "Los usuarios acceden a través de navegadores modernos compatibles con TLS 1.3 y JavaScript habilitado.",
    "El enlace institucional de internet o la infraestructura en nube dispone de al menos 50 Mbps de ancho de banda garantizado (el sistema requiere apenas ~13.5 Mbps para 300 usuarios concurrentes).",
    "Los certificados SSL se renuevan automáticamente mediante Let's Encrypt o certificado wildcard institucional emitido por autoridad certificadora.",
    "La política de respaldos ejecuta copias completas diarias y archivado de WAL continuo hacia bucket S3 / Cloud Storage inmutable."
  ];

  const componentsExplanation = [
    { name: "Cliente Web (Navegador)", role: "Dispositivo Externo", description: "Ejecuta la SPA React en Chrome, Firefox o Edge, interactuando vía HTTPS/TLS 1.3." },
    { name: "Nginx Reverse Proxy / Edge", role: "Perímetro DMZ", description: "Terminación TLS 1.3, Rate Limiting (50 req/s por IP), compresión y cacheo de estáticos." },
    { name: "SGA App Container", role: "Nodo de Cómputo (VPC)", description: "Contenedor Docker del Monolito Modular (2 vCPU, 4GB RAM) ejecutando la lógica de negocio." },
    { name: "PgBouncer Connection Pool", role: "Gestión de Conexiones", description: "Multiplexa 300 peticiones concurrentes sobre un pool eficiente de 30-40 conexiones PostgreSQL." },
    { name: "Redis In-Memory Node", role: "Caché de Baja Latencia", description: "Almacena catálogos frecuentes y listas de revocación de tokens JWT en memoria RAM." },
    { name: "PostgreSQL 16 Master & Standby", role: "Persistencia Relacional", description: "Base de datos ACID con replicación continua WAL y discos SSD para garantizar p95 < 800ms." }
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Entregable C
              </span>
              <h3 className="text-xl font-bold text-white">Diagrama de Despliegue UML & Topología de Red</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Modelado de la infraestructura física y lógica requerida para soportar 300 usuarios concurrentes con latencia p95 &lt; 3 segundos.
              Incluye Cliente Web, Reverse Proxy Nginx, Contenedor Monolito Modular, PostgreSQL 16 Relacional con réplica Standby y Redis.
            </p>
          </div>
        </div>
      </div>

      {/* Sizing Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium mb-1">
            <Server className="w-4 h-4" />
            <span>Usuarios Concurrentes</span>
          </div>
          <div className="text-2xl font-extrabold text-white">300 <span className="text-xs font-normal text-slate-400">usuarios</span></div>
          <div className="text-[11px] text-slate-500 mt-0.5">Throughput: ~38 - 56 RPS pico</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-1">
            <Cpu className="w-4 h-4" />
            <span>Servidor App (Recomendado)</span>
          </div>
          <div className="text-xl font-bold text-white">2 vCPU / 4 GB</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Uso CPU estimado: 35-45%</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-medium mb-1">
            <HardDrive className="w-4 h-4" />
            <span>Pool Conexiones DB</span>
          </div>
          <div className="text-2xl font-extrabold text-white">35 <span className="text-xs font-normal text-slate-400">conexiones</span></div>
          <div className="text-[11px] text-slate-500 mt-0.5">PgBouncer Transaction Mode</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-1">
            <Network className="w-4 h-4" />
            <span>Ancho de Banda Red</span>
          </div>
          <div className="text-2xl font-extrabold text-white">~13.5 <span className="text-xs font-normal text-slate-400">Mbps</span></div>
          <div className="text-[11px] text-slate-500 mt-0.5">Holgura en enlace 100M: 86.5%</div>
        </div>
      </div>

      {/* Interactive Visual SVG Deployment Diagram */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto shadow-2xl">
        <div className="text-xs text-slate-500 font-mono mb-2 flex items-center justify-between">
          <span>Vista de Nodos Físicos, Zonas de Red y Protocolos de Comunicación</span>
          <span className="text-[11px] text-sky-400">OMG UML Deployment Specification</span>
        </div>

        <svg id="diagram-svg-deployment" viewBox="0 0 1100 660" className="w-full min-w-[850px] h-auto select-none font-sans">
          <defs>
            <marker id="net-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
            <marker id="db-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399" />
            </marker>
          </defs>

          {/* Zone 1: WAN Client Layer */}
          <g>
            <rect x="30" y="40" width="220" height="560" rx="10" fill="#0b1120" stroke="#1e293b" strokeWidth="2" />
            <rect x="30" y="40" width="220" height="32" rx="10" fill="#1e293b" />
            <text x="45" y="61" fill="#94a3b8" fontSize="11" fontWeight="700">EXTERIOR / RED WAN</text>

            {/* Client Browser Box */}
            <rect x="45" y="100" width="190" height="150" rx="8" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" />
            <text x="60" y="125" fill="#93c5fd" fontSize="12" fontWeight="700">&lt;&lt;device&gt;&gt;</text>
            <text x="60" y="145" fill="#ffffff" fontSize="12" fontWeight="600">Dispositivo Cliente</text>
            <text x="60" y="165" fill="#94a3b8" fontSize="10">PC, Laptop, Tablet, Móvil</text>
            <rect x="55" y="180" width="170" height="55" rx="5" fill="#0f172a" stroke="#334155" />
            <text x="65" y="202" fill="#38bdf8" fontSize="11" fontWeight="600">&lt;&lt;execution env&gt;&gt;</text>
            <text x="65" y="222" fill="#e2e8f0" fontSize="11">Navegador Web Moderno</text>
            <text x="65" y="234" fill="#94a3b8" fontSize="9">(React 19 SPA)</text>

            {/* Concurrent load badge */}
            <rect x="45" y="280" width="190" height="75" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
            <text x="55" y="305" fill="#c7d2fe" fontSize="11" fontWeight="700">300 Usuarios Simultáneos</text>
            <text x="55" y="325" fill="#94a3b8" fontSize="10">• Estudiantes matriculando</text>
            <text x="55" y="342" fill="#94a3b8" fontSize="10">• Docentes asentando notas</text>
          </g>

          {/* Connection Arrow WAN -> Reverse Proxy */}
          <path d="M 235 180 L 320 180" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#net-arrow)" />
          <text x="245" y="170" fill="#38bdf8" fontSize="10" fontWeight="700">HTTPS / TLS 1.3</text>
          <text x="255" y="198" fill="#64748b" fontSize="9">Puerto 443</text>

          {/* Zone 2: DMZ / Reverse Proxy */}
          <g>
            <rect x="330" y="40" width="220" height="560" rx="10" fill="#0c1322" stroke="#334155" strokeWidth="2" />
            <rect x="330" y="40" width="220" height="32" rx="10" fill="#1e293b" />
            <text x="345" y="61" fill="#94a3b8" fontSize="11" fontWeight="700">DMZ PERIMETRAL</text>

            <rect x="345" y="100" width="190" height="260" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="360" y="125" fill="#7dd3fc" fontSize="12" fontWeight="700">&lt;&lt;node&gt;&gt;</text>
            <text x="360" y="145" fill="#ffffff" fontSize="13" fontWeight="700">Reverse Proxy Nginx</text>
            <text x="360" y="165" fill="#94a3b8" fontSize="10">Cloudflare / Nginx 1.25</text>

            <rect x="355" y="180" width="170" height="165" rx="5" fill="#0f172a" stroke="#334155" />
            <text x="365" y="202" fill="#38bdf8" fontSize="11" fontWeight="600">Responsabilidades Edge:</text>
            <text x="365" y="224" fill="#cbd5e1" fontSize="10">• Terminación SSL (TLS 1.3)</text>
            <text x="365" y="244" fill="#cbd5e1" fontSize="10">• Rate Limiting (50 r/s)</text>
            <text x="365" y="264" fill="#cbd5e1" fontSize="10">• Cacheo de archivos estáticos</text>
            <text x="365" y="284" fill="#cbd5e1" fontSize="10">• Compresión Gzip/Brotli</text>
            <text x="365" y="304" fill="#cbd5e1" fontSize="10">• Protección DDoS / WAF</text>
            <text x="365" y="324" fill="#cbd5e1" fontSize="10">• Balanceo Round-Robin</text>
          </g>

          {/* Connection Arrow Reverse Proxy -> VPC Application */}
          <path d="M 535 220 L 610 220" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#net-arrow)" />
          <text x="545" y="210" fill="#38bdf8" fontSize="10" fontWeight="700">HTTP/2</text>
          <text x="545" y="238" fill="#64748b" fontSize="9">Puerto 3000</text>

          {/* Zone 3: Virtual Private Cloud (VPC Privada CUN) */}
          <g>
            <rect x="620" y="40" width="450" height="560" rx="10" fill="#050811" stroke="#4f46e5" strokeWidth="2" strokeDasharray="8 4" />
            <rect x="620" y="40" width="450" height="32" rx="10" fill="#1e1b4b" />
            <text x="635" y="61" fill="#c7d2fe" fontSize="11" fontWeight="700">SUBRED PRIVADA (VPC CUN - SIN ACCESO PÚBLICO DIRECTO)</text>

            {/* Application Server Node */}
            <rect x="640" y="95" width="410" height="210" rx="8" fill="#111827" stroke="#6366f1" strokeWidth="1.5" />
            <text x="655" y="120" fill="#a5b4fc" fontSize="12" fontWeight="700">&lt;&lt;execution environment: Docker Container&gt;&gt;</text>
            <text x="655" y="140" fill="#ffffff" fontSize="13" fontWeight="700">Servidor SGA Monolito Modular</text>
            <text x="655" y="158" fill="#94a3b8" fontSize="10">Especificaciones: 2 vCPU | 4 GB RAM | Linux Alpine / Debian</text>

            {/* Internal Components of App Server */}
            <rect x="655" y="170" width="180" height="115" rx="5" fill="#1e1b4b" stroke="#818cf8" />
            <text x="665" y="190" fill="#c7d2fe" fontSize="10" fontWeight="700">Monolito Modular Core</text>
            <text x="665" y="210" fill="#94a3b8" fontSize="9">• Clean Architecture</text>
            <text x="665" y="225" fill="#94a3b8" fontSize="9">• Presentación, Auth, Matrículas</text>
            <text x="665" y="240" fill="#94a3b8" fontSize="9">• Calificaciones, Reportes</text>
            <text x="665" y="255" fill="#94a3b8" fontSize="9">• Auditoría (In-Memory Bus)</text>
            <text x="665" y="272" fill="#34d399" fontSize="9" fontWeight="600">Llamadas internas: 0 ms</text>

            <rect x="850" y="170" width="185" height="115" rx="5" fill="#0f172a" stroke="#38bdf8" />
            <text x="860" y="190" fill="#7dd3fc" fontSize="10" fontWeight="700">PgBouncer / Pool</text>
            <text x="860" y="210" fill="#94a3b8" fontSize="9">• 30 a 50 conexiones activas</text>
            <text x="860" y="225" fill="#94a3b8" fontSize="9">• Reutilización transaccional</text>
            <text x="860" y="240" fill="#94a3b8" fontSize="9">• Timeout conexión: 2s</text>
            <text x="860" y="255" fill="#94a3b8" fontSize="9">• Capacidad: &gt; 2.000 QPS</text>
            <text x="860" y="272" fill="#a5b4fc" fontSize="9">Max client conns: 500</text>

            {/* Redis Cache Box */}
            <rect x="640" y="325" width="410" height="90" rx="8" fill="#111827" stroke="#ef4444" strokeWidth="1.5" />
            <text x="655" y="348" fill="#fca5a5" fontSize="11" fontWeight="700">&lt;&lt;database / in-memory cache&gt;&gt; Redis 7.x</text>
            <text x="655" y="368" fill="#cbd5e1" fontSize="10">Puerto 6379 (TCP / Protocolo RESP) | Uso: Token Blacklist, Catálogos Académicos</text>
            <text x="655" y="388" fill="#94a3b8" fontSize="10">Latencia de lectura: &lt; 2 ms | Reduce carga sobre PostgreSQL en un 40%</text>

            {/* PostgreSQL Master Database Box */}
            <rect x="640" y="435" width="410" height="145" rx="8" fill="#111827" stroke="#10b981" strokeWidth="2" />
            <text x="655" y="458" fill="#6ee7b7" fontSize="12" fontWeight="700">&lt;&lt;database system&gt;&gt; PostgreSQL 16 Relacional (Master)</text>
            <text x="655" y="478" fill="#cbd5e1" fontSize="10">Puerto 5432 (TCP nativo wire protocol) | 2 vCPU, 4-8 GB RAM, SSD NVMe</text>

            <rect x="655" y="490" width="180" height="75" rx="5" fill="#064e3b" stroke="#059669" />
            <text x="665" y="510" fill="#a7f3d0" fontSize="10" fontWeight="700">Master R/W (ACID)</text>
            <text x="665" y="528" fill="#cbd5e1" fontSize="9">• SELECT FOR UPDATE (cupos)</text>
            <text x="665" y="542" fill="#cbd5e1" fontSize="9">• Write-Ahead Logging (WAL)</text>
            <text x="665" y="556" fill="#cbd5e1" fontSize="9">• Bitácora de auditoría</text>

            <rect x="850" y="490" width="185" height="75" rx="5" fill="#0f291e" stroke="#059669" strokeDasharray="3 2" />
            <text x="860" y="510" fill="#a7f3d0" fontSize="10" fontWeight="700">Standby (HA Replica)</text>
            <text x="860" y="528" fill="#94a3b8" fontSize="9">• Streaming Asíncrono WAL</text>
            <text x="860" y="542" fill="#94a3b8" fontSize="9">• RTO &lt; 2h / RPO &lt; 1h</text>
            <text x="860" y="556" fill="#94a3b8" fontSize="9">• Failover automático</text>
          </g>

          {/* Internal Connectors in VPC */}
          <path d="M 740 310 L 740 325" stroke="#ef4444" strokeWidth="2" markerEnd="url(#comp-arrow)" />
          <path d="M 940 310 L 940 435" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#db-arrow)" />
          <text x="948" y="380" fill="#34d399" fontSize="10" fontWeight="700">TCP 5432</text>
        </svg>
      </div>

      {/* Complete PlantUML Code Viewer with Analysis */}
      <PlantUmlViewer
        title="Código Fuente PlantUML - Diagrama de Despliegue (Entregable C)"
        filename="sga_despliegue_infraestructura"
        code={PLANTUML_DIAGRAMS.deployment}
        description="Describe la arquitectura física de despliegue, delimitando la zona DMZ con Nginx (SSL TLS 1.3), la red privada VPC institucional, el contenedor de aplicación Monolito Modular dimensionado para 300 usuarios concurrentes, el pool de conexiones PgBouncer, el motor de caché Redis y la base de datos relacional PostgreSQL 16 con réplica de alta disponibilidad."
        componentsExplanation={componentsExplanation}
        modelingDecisions={modelingDecisions}
        assumptions={assumptions}
      />
    </div>
  );
};
