import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { oklchToRgb } from './oklchToRgb';

export const handleDownloadPDF = async (studentName: string, setIsGenerating: (v: boolean) => void) => {
  const element = document.getElementById('certificate-print-area');
  if (!element) { return; }

  setIsGenerating(true);

  try {
    // Ensure all custom loaded fonts (such as Cinzel and Great Vibes) are fully loaded and prepared by browser
    await document.fonts.ready;

    // 1. Save original transform and transition
    const originalTransform = element.style.transform;
    const originalTransition = element.style.transition;

    // 2. Temporarily disable transform to get 1:1 crisp render
    element.style.transform = 'none';
    element.style.transition = 'none';

    // Use a brief timeout to let layout updates propagate if nested inside scales
    await new Promise(resolve => setTimeout(resolve, 80));

    // 3. Render canvas via html2canvas
    const canvas: HTMLCanvasElement = await html2canvas(element, {
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
          ]; name;

          for (const el of elements as unknown as HTMLElement[]) {
            const win = clonedDoc.defaultView ?? window;
            const computed = win.getComputedStyle(el);

            propsToFix.forEach(prop => {
              const val = computed[prop as any];
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
    setIsGenerating(false);
  }
};
