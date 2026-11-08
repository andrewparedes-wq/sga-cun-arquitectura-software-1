import React, { useState } from 'react';
import { Copy, Check, Download, ExternalLink, Code2, FileImage, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getPlantUmlServerUrl, downloadFromUrl, exportSvgElement } from '../../utils/diagramExport';

interface PlantUmlViewerProps {
  title: string;
  code: string;
  filename: string;
  description: string;
  componentsExplanation: { name: string; description: string; role: string }[];
  modelingDecisions: string[];
  assumptions: string[];
}

export const PlantUmlViewer: React.FC<PlantUmlViewerProps> = ({
  title,
  code,
  filename,
  description,
  componentsExplanation,
  modelingDecisions,
  assumptions
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<'svg' | 'png' | null>(null);
  const [activeTab, setActiveTab] = useState<'explanation' | 'code' | 'decisions'>('explanation');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPuml = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.puml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportSvg = async () => {
    setDownloadingFormat('svg');
    try {
      // Intentar exportar desde el elemento SVG del DOM si está presente
      const domSvg = document.querySelector('svg[id^="diagram-svg"]') as SVGSVGElement | null;
      if (domSvg) {
        await exportSvgElement(domSvg, filename, 'svg', 'dark');
      } else {
        const url = getPlantUmlServerUrl(code, 'svg');
        await downloadFromUrl(url, `${filename}.svg`);
      }
    } catch (e) {
      console.error('Error exportando SVG:', e);
      const url = getPlantUmlServerUrl(code, 'svg');
      window.open(url, '_blank');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleExportPng = async () => {
    setDownloadingFormat('png');
    try {
      // Intentar exportar desde el elemento SVG del DOM a alta resolución
      const domSvg = document.querySelector('svg[id^="diagram-svg"]') as SVGSVGElement | null;
      if (domSvg) {
        await exportSvgElement(domSvg, filename, 'png', 'dark');
      } else {
        const url = getPlantUmlServerUrl(code, 'png');
        await downloadFromUrl(url, `${filename}.png`);
      }
    } catch (e) {
      console.error('Error exportando PNG:', e);
      const url = getPlantUmlServerUrl(code, 'png');
      window.open(url, '_blank');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const openInPlantUmlServer = () => {
    const encoded = encodeURIComponent(code);
    window.open(`https://www.planttext.com/?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl my-6">
      {/* Header bar */}
      <div className="bg-slate-800/80 px-5 py-3.5 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
            <span className="text-xs text-slate-400 font-mono">{filename}.puml</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs for viewer */}
          <div className="bg-slate-900/90 p-1 rounded-lg border border-slate-700/60 flex text-xs font-medium">
            <button
              onClick={() => setActiveTab('explanation')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'explanation'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Explicación Técnica
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'code'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Código PlantUML
            </button>
            <button
              onClick={() => setActiveTab('decisions')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'decisions'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Decisiones & Supuestos
            </button>
          </div>

          <button
            onClick={handleCopy}
            title="Copiar código PlantUML al portapapeles"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={handleExportSvg}
            disabled={downloadingFormat !== null}
            title="Descargar diagrama en formato vectorial SVG"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-500/30 transition disabled:opacity-50"
          >
            {downloadingFormat === 'svg' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileImage className="w-3.5 h-3.5" />
            )}
            <span>SVG</span>
          </button>

          <button
            onClick={handleExportPng}
            disabled={downloadingFormat !== null}
            title="Descargar imagen PNG en alta resolución (300 DPI)"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-xs font-semibold rounded-lg border border-sky-500/30 transition disabled:opacity-50"
          >
            {downloadingFormat === 'png' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5" />
            )}
            <span>PNG</span>
          </button>

          <button
            onClick={handleDownloadPuml}
            title="Descargar código fuente PlantUML (.puml)"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span>.puml</span>
          </button>

          <button
            onClick={openInPlantUmlServer}
            title="Abrir y renderizar en PlantText online"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium rounded-lg border border-indigo-500/30 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PlantText</span>
          </button>
        </div>
      </div>

      {/* Body content based on activeTab */}
      <div className="p-6">
        {activeTab === 'explanation' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Descripción General del Diagrama</h5>
              <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Componentes y Relaciones Modeladas</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {componentsExplanation.map((comp, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-white">{comp.name}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-700 text-indigo-300 border border-slate-600">{comp.role}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{comp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>PlantUML v1.2024+ (Sintaxis Estándar OMG UML)</span>
              <span>Líneas: {code.split('\n').length}</span>
            </div>
            <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed border border-slate-800 max-h-[500px]">
              <code>{code}</code>
            </pre>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                <span>✓</span> Justificación de Decisiones de Modelado
              </h5>
              <ul className="space-y-2.5">
                {modelingDecisions.map((dec, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span className="leading-relaxed">{dec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                <span>⚠</span> Supuestos Arquitectónicos y Restricciones
              </h5>
              <ul className="space-y-2.5">
                {assumptions.map((ass, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span className="leading-relaxed">{ass}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
