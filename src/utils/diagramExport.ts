/**
 * Utilidades para exportación de diagramas UML en formatos SVG y PNG
 * SGA CUN - Arquitectura de Software
 */

/**
 * Convierte un string UTF-8 a formato hexadecimal para URLs de PlantUML (~h)
 */
export function stringToHex(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Obtiene la URL de renderizado oficial en PlantUML (SVG o PNG)
 */
export function getPlantUmlServerUrl(code: string, format: 'svg' | 'png'): string {
  const hex = stringToHex(code);
  return `https://www.plantuml.com/plantuml/${format}/~h${hex}`;
}

/**
 * Descarga una imagen directamente desde una URL como archivo local
 */
export async function downloadFromUrl(url: string, filename: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al consultar servidor PlantUML');
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    return true;
  } catch (err) {
    console.warn('Fallback a apertura directa por política de CORS:', err);
    window.open(url, '_blank');
    return false;
  }
}

/**
 * Exporta un elemento SVGSVGElement directamente desde el DOM a archivo SVG o PNG
 * Soporta escala de alta resolución (2.5x retina para informes académicos)
 */
export async function exportSvgElement(
  svgElement: SVGSVGElement,
  filename: string,
  format: 'svg' | 'png',
  theme: 'dark' | 'white' | 'transparent' = 'dark'
): Promise<void> {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;

  // Asegurar atributos de namespace XML
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  // Obtener dimensiones reales del viewBox o del cliente
  const viewBoxAttr = clone.getAttribute('viewBox');
  let vbWidth = 1100;
  let vbHeight = 680;
  if (viewBoxAttr) {
    const parts = viewBoxAttr.split(/[\s,]+/).map(Number);
    if (parts.length === 4) {
      vbWidth = parts[2];
      vbHeight = parts[3];
    }
  } else {
    vbWidth = svgElement.clientWidth || 1100;
    vbHeight = svgElement.clientHeight || 680;
    clone.setAttribute('viewBox', `0 0 ${vbWidth} ${vbHeight}`);
  }

  clone.setAttribute('width', String(vbWidth));
  clone.setAttribute('height', String(vbHeight));

  // Aplicar fondo si no es transparente
  if (theme !== 'transparent') {
    const bgFill = theme === 'white' ? '#ffffff' : '#0b1120';
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('x', '0');
    bgRect.setAttribute('y', '0');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', bgFill);
    clone.insertBefore(bgRect, clone.firstChild);

    // Si el fondo es blanco, ajustar texto blanco a oscuro para máxima legibilidad
    if (theme === 'white') {
      const texts = clone.querySelectorAll('text');
      texts.forEach(t => {
        const fill = t.getAttribute('fill');
        if (fill === '#ffffff' || fill === '#cbd5e1' || fill === '#e2e8f0' || fill === '#94a3b8') {
          t.setAttribute('fill', '#0f172a');
        }
      });
    }
  }

  // Serializar el SVG
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(clone);

  // Asegurar header XML estándar
  if (!svgString.startsWith('<?xml')) {
    svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
  }

  if (format === 'svg') {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  // Exportar como PNG en alta resolución (2x DPI para impresión universitaria)
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = vbWidth * scale;
  canvas.height = vbHeight * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      ctx.fillStyle = theme === 'white' ? '#ffffff' : theme === 'dark' ? '#0b1120' : 'transparent';
      if (theme !== 'transparent') {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, vbWidth, vbHeight);

      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('No se pudo generar el Blob PNG'));
          return;
        }
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    };

    img.onerror = e => {
      URL.revokeObjectURL(url);
      reject(e);
    };

    img.src = url;
  });
}
