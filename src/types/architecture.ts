/**
 * Tipos de datos para el diseño arquitectónico del SGA - ACA CUN
 */

export type TabType = 
  | 'contexto' 
  | 'actores-req' 
  | 'diagramas' 
  | 'simulador' 
  | 'trazabilidad' 
  | 'calidad-riesgos' 
  | 'documento';

export type DiagramId = 'use-case' | 'components' | 'deployment' | 'data-model' | 'sequence';

export interface Actor {
  id: string;
  name: string;
  shortDesc: string;
  responsibilities: string[];
  permissions: string[];
  color: string;
  badge: string;
}

export interface FunctionalRequirement {
  id: string; // e.g., 'RF-01'
  title: string;
  description: string;
  primaryActor: string;
  secondaryActors?: string[];
  module: string;
  criticality: 'Alta' | 'Media' | 'Baja';
  preconditions: string;
  postconditions: string;
}

export interface NonFunctionalRequirement {
  id: string; // e.g., 'RNF-01'
  title: string;
  category: string;
  metric: string;
  target: string;
  architecturalStrategy: string;
  module: string;
}

export interface ArchitecturalModule {
  id: string;
  name: string;
  layer: string;
  description: string;
  responsibilities: string[];
  exportedInterfaces: string[];
  dependencies: string[];
  cleanArchBoundary: 'Presentation' | 'Application' | 'Domain' | 'Infrastructure' | 'Cross-Cutting';
}

export interface TraceabilityItem {
  id: string;
  reqId: string;
  reqTitle: string;
  type: 'RF' | 'RNF';
  module: string;
  components: string[];
  verificationMethod: 'Pruebas Unitarias' | 'Pruebas de Integración' | 'Pruebas de Carga' | 'Inspección Arquitectónica' | 'Análisis Estático (SAST)' | 'Auditoría de Seguridad';
  verificationCriteria: string;
  status: 'Diseñado' | 'Verificado por Modelo' | 'Requiere Implementación';
}

export interface RiskItem {
  id: string;
  category: 'Rendimiento' | 'Seguridad' | 'Mantenibilidad' | 'Disponibilidad' | 'Escalabilidad' | 'Punto Único de Falla (SPOF)';
  riskDescription: string;
  probability: 'Alta' | 'Media' | 'Baja';
  impact: 'Crítico' | 'Alto' | 'Medio' | 'Bajo';
  mitigationStrategy: string;
  monitoringMechanism: string;
}
