export const svgToPngBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const svgText = await response.text();
  return new Promise(resolve => {
    const img = new window.Image();
    const blob = new Blob([ svgText ], { type: 'image/svg+xml' });
    const objectUrl = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 300;
      canvas.height = img.naturalHeight || 100;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        resolve(url);
        return;
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = objectUrl;
  });
};
