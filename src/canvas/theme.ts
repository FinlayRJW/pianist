export interface CanvasTheme {
  bgTop: string;
  bgBottom: string;
  grid: string;
  playBandRgb: string;
  playLine: string;
  playGlow: string;
  text: string;
  noteRight: string;
  noteLeft: string;
  noteActive: string;
  noteMiss: string;
  keyWhite: string;
  keyWhiteActive: string;
  keyBlack: string;
  keyBlackActive: string;
  keyBorder: string;
  keyBlackBorder: string;
}

let cachedTheme: CanvasTheme | null = null;
let lastThemeAttr: string | null = null;

export function getCanvasTheme(): CanvasTheme {
  const currentAttr = document.documentElement.getAttribute('data-theme') ?? 'dark';
  if (cachedTheme && lastThemeAttr === currentAttr) return cachedTheme;

  const style = getComputedStyle(document.documentElement);
  const get = (name: string) => style.getPropertyValue(name).trim();

  cachedTheme = {
    bgTop: get('--canvas-bg-top'),
    bgBottom: get('--canvas-bg-bottom'),
    grid: get('--canvas-grid'),
    playBandRgb: get('--canvas-play-band-rgb'),
    playLine: get('--canvas-play-line'),
    playGlow: get('--canvas-play-glow'),
    text: get('--canvas-text'),
    noteRight: get('--color-note-right') || '#6366f1',
    noteLeft: get('--color-note-left') || '#f59e0b',
    noteActive: get('--color-hit-perfect') || '#22d3ee',
    noteMiss: get('--color-hit-miss') || '#f87171',
    keyWhite: get('--key-white'),
    keyWhiteActive: get('--key-white-active'),
    keyBlack: get('--key-black'),
    keyBlackActive: get('--key-black-active'),
    keyBorder: get('--key-border'),
    keyBlackBorder: get('--key-black-border'),
  };
  lastThemeAttr = currentAttr;
  return cachedTheme;
}

export function invalidateCanvasThemeCache() {
  cachedTheme = null;
  lastThemeAttr = null;
}
