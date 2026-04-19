import { useState, useCallback, useRef, useEffect } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';
import {
  buildWsUrl,
  defaultBridgeAddress,
  testBridgeConnection,
  type BridgeTestStatus,
} from '../../utils/midi-bridge';

interface Props {
  onConnected: () => void;
  onSkip: () => void;
}

export function BridgeSetupStep({ onConnected, onSkip }: Props) {
  const setMidiBridgeUrl = useOnboardingStore((s) => s.setMidiBridgeUrl);
  const defaultAddr = defaultBridgeAddress();
  const [address, setAddress] = useState(defaultAddr);
  const [status, setStatus] = useState<BridgeTestStatus>('idle');
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const autoTestedRef = useRef(false);

  useEffect(() => {
    return () => cleanupRef.current?.();
  }, []);

  const runTest = useCallback((addr: string) => {
    cleanupRef.current?.();
    cleanupRef.current = testBridgeConnection(
      addr,
      ({ status: s, device }) => {
        setStatus(s);
        if (device) setDeviceName(device);
      },
    );
  }, []);

  useEffect(() => {
    if (!autoTestedRef.current) {
      autoTestedRef.current = true;
      runTest(defaultAddr);
    }
  }, [defaultAddr, runTest]);

  const handleConnect = useCallback(() => {
    setMidiBridgeUrl(buildWsUrl(address.trim() || defaultAddr));
    onConnected();
  }, [address, defaultAddr, setMidiBridgeUrl, onConnected]);

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 gap-6">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {status === 'connecting' && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" />
            <div className="absolute inset-4 rounded-full border-2 border-accent/20 animate-ping" style={{ animationDelay: '0.3s' }} />
          </>
        )}
        {status === 'connected' && (
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-scaleIn">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
        {status === 'error' && (
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        )}
        {(status === 'idle' || status === 'connecting') && (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-light">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        )}
      </div>

      <div>
        {status === 'connecting' && (
          <>
            <h2 className="text-2xl font-bold t-text">Connecting to MIDI Bridge...</h2>
            <p className="t-text-tertiary mt-2">Looking for your Raspberry Pi</p>
          </>
        )}
        {status === 'connected' && (
          <>
            <h2 className="text-2xl font-bold t-text">MIDI Bridge Found</h2>
            <p className="text-emerald-400 mt-2 font-medium">{deviceName ?? 'Connected'}</p>
          </>
        )}
        {(status === 'idle' || status === 'error') && (
          <>
            <h2 className="text-2xl font-bold t-text">Connect MIDI Bridge</h2>
            <p className="t-text-tertiary mt-2 text-sm">
              Enter your Raspberry Pi's address
            </p>
          </>
        )}
      </div>

      {(status === 'idle' || status === 'error') && (
        <div className="w-full max-w-xs space-y-3">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runTest(address.trim()); }}
            placeholder={defaultAddr}
            className="w-full px-4 py-2.5 rounded-xl t-bg-overlay t-text text-sm border t-border-light outline-none focus:border-accent/50 transition-colors text-center placeholder:t-text-muted"
          />
          {status === 'error' && (
            <p className="text-xs text-red-400">
              Could not connect. Check the Pi is running and on the same network.
            </p>
          )}
          <button
            onClick={() => runTest(address.trim())}
            className="w-full px-6 py-3 rounded-full bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {status === 'connected' && (
        <button
          onClick={handleConnect}
          className="px-8 py-3 rounded-full bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-colors"
        >
          Continue
        </button>
      )}

      <button
        onClick={onSkip}
        className="px-6 py-2 rounded-full t-bg-overlay t-text-secondary font-medium t-bg-overlay-hover transition-colors"
      >
        Skip — Use Microphone Instead
      </button>
    </div>
  );
}
