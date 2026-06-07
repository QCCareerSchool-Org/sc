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
