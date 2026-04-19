import { useMemo, useRef } from 'react';
import type { NoteRange } from '../../types';
import { getKeyLayout, type KeyLayout, getNoteName } from '../../canvas/PianoKeyRenderer';
import { BLACK_KEY_HEIGHT_RATIO } from '../../canvas/constants';
import { getCanvasTheme, type CanvasTheme } from '../../canvas/theme';

interface Props {
  width: number;
  height: number;
  activeNotes: Set<number>;
  range?: NoteRange;
}

export function PianoKeyboard({ width, height, activeNotes, range }: Props) {
  const layout = useMemo(() => getKeyLayout(width, range), [width, range]);
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
  const fontSize = Math.min(11, k.width * 0.4);
  return (
    <>
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
      {active && (
        <text
          x={k.x + k.width / 2}
          y={height - 8}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="bold"
          fontFamily="Inter, system-ui, sans-serif"
          fill="#1e1b4b"
        >
          {getNoteName(k.midi)}
        </text>
      )}
    </>
  );
}

function BlackKey({ k, height, active, theme }: { k: KeyLayout; height: number; active: boolean; theme: CanvasTheme }) {
  const fontSize = Math.min(9, k.width * 0.4);
  return (
    <>
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
      {active && (
        <text
          x={k.x + k.width / 2}
          y={height - 6}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="bold"
          fontFamily="Inter, system-ui, sans-serif"
          fill="#ffffff"
        >
          {getNoteName(k.midi)}
        </text>
      )}
    </>
  );
}
