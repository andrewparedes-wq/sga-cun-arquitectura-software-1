import React, { useState } from 'react';
import { DiagramId } from '../../types/architecture';
import { PLANTUML_DIAGRAMS } from '../../data/acaData';
import { UseCaseDiagram } from './UseCaseDiagram';
import { ComponentDiagram } from './ComponentDiagram';
import { DeploymentDiagram } from './DeploymentDiagram';
import { DataModelDiagram } from './DataModelDiagram';
import { SequenceDiagram } from './SequenceDiagram';
import { exportSvgElement, getPlantUmlServerUrl, downloadFromUrl } from '../../utils/diagramExport';
import { 
  GitBranch, 
  Layers, 
  Network, 
  Database, 
  PlayCircle, 
  Download, 
  FileImage, 
  Image as ImageIcon, 
  Loader2, 
  Check, 
  Palette, 
  FileCode2, 
  Sparkles,
  Info
} from 'lucide-react';

export const DiagramsContainer: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<DiagramId>('use-case');
  const [isExporting, setIsExporting] = useState<'svg' | 'png' | null>(null);
  const [exportTheme, setExportTheme] = useState<'dark' | 'white'>('dark');
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  const diagramTabs: { id: DiagramId; label: string; sub: string; icon: React.ReactNode; letter: string }[] = [
    {
      id: 'use-case',
      label: 'Casos de Uso UML',
      sub: '4 Actores, RF-01 al RF-12, include/extend',
      icon: <GitBranch className="w-4 h-4" />,
      letter: 'A'
    },
    {
      id: 'components',
      label: 'Componentes Monolito',
      sub: '7 Módulos, Clean Arch, Interfaces',
      icon: <Layers className="w-4 h-4" />,
      letter: 'B'
    },
    {
      id: 'deployment',
      label: 'Despliegue & Red',
      sub: 'Proxy, App Node, PostgreSQL HA, 300 Users',
      icon: <Network className="w-4 h-4" />,
      letter: 'C'
    },
    {
      id: 'data-model',
      label: 'Modelo Relacional (DER)',
      sub: '10 Entidades, Claves, Cardinalidades',
      icon: <Database className="w-4 h-4" />,
      letter: 'D'
    },
    {
      id: 'sequence',
      label: 'Secuencia de Matrícula',
      sub: '9 Pasos, Bloqueo de Cupo, Transacción ACID',
      icon: <PlayCircle className="w-4 h-4" />,
      letter: 'E'
    }
  ];

  // Metadatos por diagrama para exportación
  const diagramMetaMap: Record<DiagramId, { filename: string; title: string; code: string; letter: string }> = {
    'use-case': {
      filename: 'sga_diagrama_casos_de_uso_cun',
      title: 'Diagrama de Casos de Uso UML (Entregable A)',
      code: PLANTUML_DIAGRAMS.useCase,
      letter: 'A'
    },
    'components': {
      filename: 'sga_diagrama_componentes_monolito_cun',
      title: 'Diagrama de Componentes Monolito Modular (Entregable B)',
      code: PLANTUML_DIAGRAMS.components,
      letter: 'B'
    },
    'deployment': {
      filename: 'sga_diagrama_despliegue_infraestructura_cun',
      title: 'Diagrama de Despliegue e Infraestructura (Entregable C)',
      code: PLANTUML_DIAGRAMS.deployment,
      letter: 'C'
    },
    'data-model': {
      filename: 'sga_modelo_datos_relacional_der_cun',
      title: 'Modelo de Datos Conceptual y Relacional DER (Entregable D)',
      code: PLANTUML_DIAGRAMS.dataModel,
      letter: 'D'
    },
    'sequence': {
      filename: 'sga_secuencia_matricula_estudiante_cun',
      title: 'Diagrama de Secuencia de Matrícula (Entregable E)',
      code: PLANTUML_DIAGRAMS.sequence,
      letter: 'E'
    }
  };

  const currentMeta = diagramMetaMap[activeDiagram];

  /**
   * Exporta el diagrama activo en formato SVG
   */
  const handleDownloadSvg = async () => {
    setIsExporting('svg');
    const svgId = `diagram-svg-${activeDiagram}`;
    const svgElement = document.getElementById(svgId) as SVGSVGElement | null;

    try {
      if (svgElement) {
        // Exportación directa desde el SVG en el DOM (100% offline y fiel a la UI)
        await exportSvgElement(svgElement, currentMeta.filename, 'svg', exportTheme);
      } else {
        // Fallback al compilador de PlantUML server
        const url = getPlantUmlServerUrl(currentMeta.code, 'svg');
        await downloadFromUrl(url, `${currentMeta.filename}.svg`);
      }
      showFeedback(`¡Diagrama "${currentMeta.title}" exportado como SVG!`);
    } catch (err) {
      console.warn('Fallback a servidor PlantUML:', err);
      const url = getPlantUmlServerUrl(currentMeta.code, 'svg');
      window.open(url, '_blank');
      showFeedback('Abriendo render SVG en nueva pestaña');
    } finally {
      setIsExporting(null);
    }
  };

  /**
   * Exporta el diagrama activo en formato PNG en alta resolución (2x DPI para informes impresos)
   */
  const handleDownloadPng = async () => {
    setIsExporting('png');
    const svgId = `diagram-svg-${activeDiagram}`;
    const svgElement = document.getElementById(svgId) as SVGSVGElement | null;

    try {
      if (svgElement) {
        await exportSvgElement(svgElement, currentMeta.filename, 'png', exportTheme);
      } else {
        const url = getPlantUmlServerUrl(currentMeta.code, 'png');
        await downloadFromUrl(url, `${currentMeta.filename}.png`);
      }
      showFeedback(`¡Diagrama "${currentMeta.title}" exportado como PNG de alta resolución!`);
    } catch (err) {
      console.warn('Fallback a servidor PlantUML:', err);
      const url = getPlantUmlServerUrl(currentMeta.code, 'png');
      window.open(url, '_blank');
      showFeedback('Abriendo render PNG en nueva pestaña');
    } finally {
      setIsExporting(null);
    }
  };

  /**
   * Descarga el archivo fuente .puml de PlantUML
   */
  const handleDownloadPuml = () => {
    const blob = new Blob([currentMeta.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentMeta.filename}.puml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showFeedback(`Código fuente .puml descargado`);
  };

  const showFeedback = (msg: string) => {
    setExportSuccessMessage(msg);
    setTimeout(() => setExportSuccessMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Selector Navigation for the 5 Diagrams */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 shadow-xl">
        <div className="text-xs text-slate-400 font-semibold uppercase px-3 py-1 mb-2 tracking-wider flex items-center justify-between">
          <span>Seleccionar Entregable Arquitectónico UML</span>
          <span className="text-indigo-400 font-mono text-[11px]">PlantUML + Diagrama Vectorial Oficial CUN</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5">
          {diagramTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDiagram(tab.id)}
              className={`p-3 rounded-lg text-left transition flex flex-col justify-between border ${
                activeDiagram === tab.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  activeDiagram === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  Entregable {tab.letter}
                </span>
                <div className={activeDiagram === tab.id ? 'text-indigo-400' : 'text-slate-500'}>
                  {tab.icon}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold leading-tight text-slate-100">{tab.label}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{tab.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dedicated Academic Export Toolbar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-xl p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-mono font-bold border border-indigo-500/30">
                {currentMeta.letter}
              </span>
              <h4 className="text-sm font-bold text-white">
                Exportar {currentMeta.title}
              </h4>
            </div>
            <p className="text-xs text-slate-400">
              Genera archivos vectoriales <strong className="text-emerald-400">SVG</strong> o imágenes en alta resolución <strong className="text-sky-400">PNG (300 DPI)</strong> listas para insertar en tu documento o informe universitario de la CUN.
            </p>
          </div>

          {/* Action Export Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Theme Toggle for Export */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs text-slate-300">
              <Palette className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <button
                onClick={() => setExportTheme('dark')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                  exportTheme === 'dark' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                title="Fondo oscuro para presentaciones de diapositivas"
              >
                Fondo Oscuro
              </button>
              <button
                onClick={() => setExportTheme('white')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                  exportTheme === 'white' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                title="Fondo blanco académico para tesis o informes impresos"
              >
                Fondo Blanco (Tesis)
              </button>
            </div>

            {/* BUTTON 1: Download as SVG */}
            <button
              onClick={handleDownloadSvg}
              disabled={isExporting !== null}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-emerald-600/20 transition disabled:opacity-50 cursor-pointer"
              title="Descargar diagrama vectorial escalable (.svg)"
            >
              {isExporting === 'svg' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileImage className="w-4 h-4" />
              )}
              <span>Descargar como SVG</span>
            </button>

            {/* BUTTON 2: Download as PNG */}
            <button
              onClick={handleDownloadPng}
              disabled={isExporting !== null}
              className="flex items-center gap-2 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-sky-600/20 transition disabled:opacity-50 cursor-pointer"
              title="Descargar imagen rasterizada de alta definición (.png)"
            >
              {isExporting === 'png' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
              <span>Descargar como PNG</span>
            </button>

            {/* BUTTON 3: Download PlantUML (.puml) */}
            <button
              onClick={handleDownloadPuml}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition cursor-pointer"
              title="Descargar código fuente PlantUML (.puml)"
            >
              <FileCode2 className="w-4 h-4 text-slate-400" />
              <span>.puml</span>
            </button>
          </div>
        </div>

        {/* Feedback Banner upon export */}
        {exportSuccessMessage && (
          <div className="mt-3 py-2 px-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg flex items-center gap-2 text-xs text-emerald-300 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{exportSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Render Active Diagram View */}
      {activeDiagram === 'use-case' && <UseCaseDiagram />}
      {activeDiagram === 'components' && <ComponentDiagram />}
      {activeDiagram === 'deployment' && <DeploymentDiagram />}
      {activeDiagram === 'data-model' && <DataModelDiagram />}
      {activeDiagram === 'sequence' && <SequenceDiagram />}
    </div>
  );
};
