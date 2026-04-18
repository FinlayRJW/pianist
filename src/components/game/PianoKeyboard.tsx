import { useMemo, useRef } from 'react';
import { getKeyLayout, type KeyLayout } from '../../canvas/PianoKeyRenderer';
import { BLACK_KEY_HEIGHT_RATIO } from '../../canvas/constants';
import { getCanvasTheme, type CanvasTheme } from '../../canvas/theme';

interface Props {
  width: number;
  height: number;
  activeNotes: Set<number>;
}

export function PianoKeyboard({ width, height, activeNotes }: Props) {
  const layout = useMemo(() => getKeyLayout(width), [width]);
  const themeRef = useRef<CanvasTheme>(getCanvasTheme());
  themeRef.current = getCanvasTheme();

  const whiteKeys = layout.filter((k) => !k.isBlack);
  const blackKeys = layout.filter((k) => k.isBlack);
  const blackHeight = height * BLACK_KEY_HEIGHT_RATIO;
  const theme = themeRef.current;

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      {whiteKeys.map((key) => (
        <WhiteKey key={key.midi} k={key} height={height} active={activeNotes.has(key.midi)} theme={theme} />
      ))}
      {blackKeys.map((key) => (
        <BlackKey key={key.midi} k={key} height={blackHeight} active={activeNotes.has(key.midi)} theme={theme} />
      ))}
    </svg>
  );
}

function WhiteKey({ k, height, active, theme }: { k: KeyLayout; height: number; active: boolean; theme: CanvasTheme }) {
  return (
    <rect
      x={k.x}
      y={0}
      width={k.width}
      height={height}
      fill={active ? theme.keyWhiteActive : theme.keyWhite}
      stroke={theme.keyBorder}
      strokeWidth={1}
      rx={0}
      ry={0}
    />
  );
}

function BlackKey({ k, height, active, theme }: { k: KeyLayout; height: number; active: boolean; theme: CanvasTheme }) {
  return (
    <rect
      x={k.x}
      y={0}
      width={k.width}
      height={height}
      fill={active ? theme.keyBlackActive : theme.keyBlack}
      stroke={theme.keyBlackBorder}
      strokeWidth={0.5}
      rx={0}
      ry={0}
    />
  );
}
