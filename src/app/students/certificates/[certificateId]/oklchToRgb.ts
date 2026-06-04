export const oklchToRgb = (colorStr: string): string => {
  // Regex to match oklch(L C H) or oklch(L C H / alpha), supporting both spaces and commas
  const regex = /oklch\(\s*([0-9.]+)(?:[\s,]+)([0-9.]+)(?:[\s,]+)([0-9.]+)(?:(?:\s*[\/,]\s*|\s+)([0-9.%]+))?\s*\)/iu;

  const match = regex.exec(colorStr); if (!match) { return colorStr; }

  const L = parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);
  const alphaStr = match[4];
  const alpha = alphaStr ? (alphaStr.endsWith('%') ? parseFloat(alphaStr) / 100 : parseFloat(alphaStr)) : 1;

  // Conversion steps: OKLCH -> OKLAB -> LMS -> linear RGB -> sRGB
  const hRad = (H * Math.PI) / 180;
  const ok_a = C * Math.cos(hRad);
  const ok_b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * ok_a + 0.2158037573 * ok_b;
  const m_ = L - 0.1055613458 * ok_a - 0.0638541728 * ok_b;
  const s_ = L - 0.0894841775 * ok_a - 1.2914855414 * ok_b;

  const l = Math.max(0, l_ ** 3);
  const m = Math.max(0, m_ ** 3);
  const s = Math.max(0, s_ ** 3);

  let rLinear = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413190470 * s;
  let bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Clamp values to [0, 1]
  rLinear = Math.max(0, Math.min(1, rLinear));
  gLinear = Math.max(0, Math.min(1, gLinear));
  bLinear = Math.max(0, Math.min(1, bLinear));

  // Perceptual gamma mapping to standard sRGB
  const toSRGB = (c: number) => {
    return c <= 0.0031308 ? 12.92 * c : 1.055 * (c ** (1 / 2.4)) - 0.055;
  };

  const r = Math.round(toSRGB(rLinear) * 255);
  const g = Math.round(toSRGB(gLinear) * 255);
  const b = Math.round(toSRGB(bLinear) * 255);

  if (alpha === 1) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;

};

const handleDownloadPDF = async () => {
  const element = document.getElementById('certificate-print-area');
  if (!element) { return; }

  setIsGeneratingPDF(true);

  try {
    // Ensure all custom loaded fonts (such as Cinzel and Great Vibes) are fully loaded and prepared by browser
    if (document.fonts) {
      await document.fonts.ready;
    }

    // 1. Save original transform and transition
    const originalTransform = element.style.transform;
    const originalTransition = element.style.transition;

    // 2. Temporarily disable transform to get 1:1 crisp render
    element.style.transform = 'none';
    element.style.transition = 'none';

    // Use a brief timeout to let layout updates propagate if nested inside scales
    await new Promise(resolve => setTimeout(resolve, 80));

    // 3. Render canvas via html2canvas
    const canvas = await html2canvas(element, {
      scale: 3.0, // Ultra sharp DPI capture
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 1056,
      height: 816,
      windowWidth: 1056,
      windowHeight: 816,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: clonedDoc => {
        // Force layout boundaries directly on the cloned document's body to ensure exact 1:1 scale
        if (clonedDoc.body) {
          clonedDoc.body.style.margin = '0px';
          clonedDoc.body.style.padding = '0px';
          clonedDoc.body.style.width = '1056px';
          clonedDoc.body.style.height = '816px';
          clonedDoc.body.style.overflow = 'hidden';
        }

        const printArea = clonedDoc.getElementById('certificate-print-area');
        if (printArea) {
          // Force standard absolute alignment on the cloned element to ensure 0,0 offset
          printArea.style.transform = 'none';
          printArea.style.transition = 'none';
          printArea.style.position = 'absolute';
          printArea.style.left = '0px';
          printArea.style.top = '0px';
          printArea.style.width = '1056px';
          printArea.style.height = '816px';
          printArea.style.margin = '0px';
          printArea.style.boxShadow = 'none';

          // Clear parent constraints in the cloned view to prevent cropping or extra scaling
          let parent = printArea.parentElement;
          while (parent) {
            parent.style.transform = 'none';
            parent.style.margin = '0px';
            parent.style.padding = '0px';
            parent.style.overflow = 'visible';
            parent = parent.parentElement;
          }

          const elements = printArea.getElementsByTagName('*');
          const propsToFix = [
            'color',
            'backgroundColor',
            'borderColor',
            'borderTopColor',
            'borderBottomColor',
            'borderLeftColor',
            'borderRightColor',
            'boxShadow',
            'stroke',
            'fill',
          ];

          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const win = clonedDoc.defaultView || window;
            const computed = win.getComputedStyle(el);

            propsToFix.forEach(prop => {
              const val = (computed)[prop];
              if (typeof val === 'string' && val.includes('oklch')) {
                const replacedVal = val.replace(/oklch\([^)]+\)/gi, match => {
                  return oklchToRgb(match);
                });
                el.style[prop as any] = replacedVal;
              }
            });
          }
        }
      },
    });

    // 4. Restore original styles immediately
    element.style.transform = originalTransform;
    element.style.transition = originalTransition;

    // 5. Construct PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: 'letter',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    // Dimensions of Letter Landscape page: 11 x 8.5 inches
    pdf.addImage(imgData, 'JPEG', 0, 0, 11, 8.5);

    // Save file with student name
    const cleanName = studentName ? studentName.trim().replace(/[^a-zA-Z0-9]/g, '_') : 'QC_Certificate';
    pdf.save(`QC_Credential_${cleanName}.pdf`);
  } catch (error) {
    console.error('PDF creation failed, falling back to window.print():', error);
    window.print();
  } finally {
    setIsGeneratingPDF(false);
  }
};
