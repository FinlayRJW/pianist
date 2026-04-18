import { useState, useRef } from 'react';
import { useImportedSongsStore } from '../../stores/importedSongsStore';
import { analyzeMidi } from '../../utils/midi-analyzer';
import type { SongMeta } from '../../types';

interface Props {
  onClose: () => void;
  onImported: (songId: string) => void;
}

export function MidiImport({ onClose, onImported }: Props) {
  const addSong = useImportedSongsStore((s) => s.addSong);
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<'pick' | 'preview' | 'saving'>('pick');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [meta, setMeta] = useState<Partial<SongMeta>>({});

  function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.mid') && !file.name.toLowerCase().endsWith('.midi')) {
      setError('Please select a .mid or .midi file');
      return;
    }

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const buf = reader.result as ArrayBuffer;
        const analysis = analyzeMidi(buf);
        const baseName = file.name.replace(/\.(mid|midi)$/i, '');
        const id = 'imported-' + baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        setArrayBuffer(buf);
        setMeta({
          id,
          title: baseName,
          composer: 'Unknown',
          genre: 'classical',
          difficulty: analysis.difficulty,
          bpm: analysis.bpm,
          durationSec: analysis.durationSec,
          keySignature: analysis.keySignature,
          timeSignature: analysis.timeSignature,
          tags: ['imported'],
          source: 'imported',
          midiFile: '',
          skillTreeNodeId: '',
        });
        setStep('preview');
      } catch {
        setError('Failed to parse MIDI file. Make sure it is a valid .mid file.');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  async function handleSave() {
    if (!arrayBuffer || !meta.id) return;
    setStep('saving');
    try {
      await addSong(meta as SongMeta, arrayBuffer);
      onImported(meta.id);
    } catch {
      setError('Failed to save song');
      setStep('preview');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className="bg-surface-light rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold t-text">Import MIDI</h2>
          <button onClick={onClose} className="t-text-tertiary hover:t-text transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {step === 'pick' && (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept=".mid,.midi"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed t-border hover:border-accent/50 rounded-xl py-12 flex flex-col items-center gap-3 transition-colors"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="t-text-tertiary">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="t-text-secondary text-sm">Choose a .mid file</span>
            </button>
            <p className="text-xs t-text-muted mt-3 text-center">
              Import any MIDI file to play it in Pianist. Files are stored locally on your device.
            </p>
          </div>
        )}

        {step === 'preview' && meta.id && (
          <div className="space-y-4">
            <p className="text-xs t-text-muted">{fileName}</p>

            <div>
              <label className="text-xs t-text-tertiary block mb-1">Title</label>
              <input
                type="text"
                value={meta.title}
                onChange={(e) => setMeta({ ...meta, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg t-bg-overlay t-text text-sm outline-none focus:ring-1 focus:ring-accent/50"
              />
            </div>

            <div>
              <label className="text-xs t-text-tertiary block mb-1">Composer</label>
              <input
                type="text"
                value={meta.composer}
                onChange={(e) => setMeta({ ...meta, composer: e.target.value })}
                className="w-full px-3 py-2 rounded-lg t-bg-overlay t-text text-sm outline-none focus:ring-1 focus:ring-accent/50"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs t-text-tertiary block mb-1">BPM</label>
                <div className="px-3 py-2 rounded-lg t-bg-overlay t-text-secondary text-sm">{meta.bpm}</div>
              </div>
              <div>
                <label className="text-xs t-text-tertiary block mb-1">Duration</label>
                <div className="px-3 py-2 rounded-lg t-bg-overlay t-text-secondary text-sm">{meta.durationSec}s</div>
              </div>
              <div>
                <label className="text-xs t-text-tertiary block mb-1">Difficulty</label>
                <div className="px-3 py-2 rounded-lg t-bg-overlay t-text-secondary text-sm">{meta.difficulty}/5</div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setStep('pick'); setMeta({}); setArrayBuffer(null); }}
                className="flex-1 px-4 py-2 rounded-lg t-bg-overlay t-text-secondary text-sm hover:t-text transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Import Song
              </button>
            </div>
          </div>
        )}

        {step === 'saving' && (
          <div className="py-8 text-center t-text-secondary text-sm">Saving...</div>
        )}
      </div>
    </div>
  );
}
