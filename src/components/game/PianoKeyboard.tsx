import { useMemo } from 'react';
import { getKeyLayout, type KeyLayout } from '../../canvas/PianoKeyRenderer';
import { BLACK_KEY_HEIGHT_RATIO } from '../../canvas/constants';

interface Props {
  width: number;
  height: number;
  activeNotes: Set<number>;
}

export function PianoKeyboard({ width, height, activeNotes }: Props) {
  const layout = useMemo(() => getKeyLayout(width), [width]);

  const whiteKeys = layout.filter((k) => !k.isBlack);
  const blackKeys = layout.filter((k) => k.isBlack);
  const blackHeight = height * BLACK_KEY_HEIGHT_RATIO;

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      {whiteKeys.map((key) => (
        <WhiteKey key={key.midi} k={key} height={height} active={activeNotes.has(key.midi)} />
      ))}
      {blackKeys.map((key) => (
        <BlackKey key={key.midi} k={key} height={blackHeight} active={activeNotes.has(key.midi)} />
      ))}
    </svg>
  );
}

function WhiteKey({ k, height, active }: { k: KeyLayout; height: number; active: boolean }) {
  return (
    <rect
      x={k.x}
      y={0}
      width={k.width}
      height={height}
      fill={active ? '#6366f1' : '#e8e8e8'}
      stroke="#1a1a3e"
      strokeWidth={1}
      rx={0}
      ry={0}
    />
  );
}

function BlackKey({ k, height, active }: { k: KeyLayout; height: number; active: boolean }) {
  return (
    <rect
      x={k.x}
      y={0}
      width={k.width}
      height={height}
      fill={active ? '#818cf8' : '#1a1a2e'}
      stroke="#0a0a1a"
      strokeWidth={0.5}
      rx={0}
      ry={0}
    />
  );
}
