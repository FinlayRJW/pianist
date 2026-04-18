import { useState, useEffect, useRef } from 'react';

interface Props {
  onMidiFound: (deviceName: string) => void;
  onNoMidi: () => void;
}

export function MidiCheckStep({ onMidiFound, onNoMidi }: Props) {
  const [status, setStatus] = useState<'scanning' | 'found' | 'not-found'>('scanning');
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const resolvedRef = useRef(false);

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setStatus('not-found');
      return;
    }

    navigator.requestMIDIAccess().then((access) => {
      function checkDevices() {
        if (resolvedRef.current) return;
        let firstName: string | null = null;
        access.inputs.forEach((input) => {
          if (!firstName) firstName = input.name ?? 'MIDI Device';
        });
        if (firstName) {
          resolvedRef.current = true;
          setDeviceName(firstName);
          setStatus('found');
          clearTimeout(timerRef.current);
        }
      }

      checkDevices();
      access.onstatechange = () => checkDevices();

      timerRef.current = setTimeout(() => {
        if (!resolvedRef.current) {
          resolvedRef.current = true;
          setStatus('not-found');
        }
      }, 2500);
    }).catch(() => {
      setStatus('not-found');
    });

    return () => {
      clearTimeout(timerRef.current);
      resolvedRef.current = true;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 gap-8">
      {/* Scanning animation */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {status === 'scanning' && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" />
            <div className="absolute inset-4 rounded-full border-2 border-accent/20 animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="absolute inset-8 rounded-full border-2 border-accent/10 animate-ping" style={{ animationDelay: '0.6s' }} />
          </>
        )}

        {status === 'found' && (
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-scaleIn">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        {status === 'not-found' && (
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="8" cy="12" r="1" fill="currentColor" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <circle cx="16" cy="12" r="1" fill="currentColor" />
            </svg>
          </div>
        )}

        {status === 'scanning' && (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-light">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <circle cx="8" cy="12" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="16" cy="12" r="1" fill="currentColor" />
          </svg>
        )}
      </div>

      <div>
        {status === 'scanning' && (
          <>
            <h2 className="text-2xl font-bold text-white">Looking for MIDI...</h2>
            <p className="text-white/40 mt-2">Checking for a connected MIDI keyboard</p>
          </>
        )}

        {status === 'found' && (
          <>
            <h2 className="text-2xl font-bold text-white">MIDI Keyboard Found</h2>
            <p className="text-emerald-400 mt-2 font-medium">{deviceName}</p>
          </>
        )}

        {status === 'not-found' && (
          <>
            <h2 className="text-2xl font-bold text-white">No MIDI Keyboard Found</h2>
            <p className="text-white/40 mt-2">No worries — let's set up your microphone instead</p>
          </>
        )}
      </div>

      {status === 'found' && (
        <button
          onClick={() => onMidiFound(deviceName!)}
          className="px-8 py-3 rounded-full bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-colors"
        >
          Continue
        </button>
      )}

      {status === 'scanning' && (
        <button
          onClick={() => { resolvedRef.current = true; onNoMidi(); }}
          className="px-6 py-2 rounded-full bg-white/10 text-white/50 font-medium hover:bg-white/20 hover:text-white/70 transition-colors"
        >
          I don't have MIDI
        </button>
      )}

      {status === 'not-found' && (
        <button
          onClick={onNoMidi}
          className="px-8 py-3 rounded-full bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-colors"
        >
          Set Up Microphone
        </button>
      )}
    </div>
  );
}
