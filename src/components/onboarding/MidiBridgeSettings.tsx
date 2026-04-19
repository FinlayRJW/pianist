import { useState, useCallback, useRef, useEffect } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';

type Status = 'idle' | 'connecting' | 'connected' | 'error';

function buildWsUrl(address: string): string {
  const trimmed = address.trim();
  if (trimmed.startsWith('ws://') || trimmed.startsWith('wss://')) return trimmed;
  return `ws://${trimmed}:3141`;
}

export function MidiBridgeSettings() {
  const midiBridgeUrl = useOnboardingStore((s) => s.midiBridgeUrl);
  const setMidiBridgeUrl = useOnboardingStore((s) => s.setMidiBridgeUrl);

  const enabled = midiBridgeUrl !== null;
  const [address, setAddress] = useState(() => {
    if (!midiBridgeUrl) return '';
    return midiBridgeUrl.replace(/^wss?:\/\//, '').replace(/:3141$/, '');
  });
  const [testStatus, setTestStatus] = useState<Status>('idle');
  const [testDevice, setTestDevice] = useState<string | null>(null);
  const testWsRef = useRef<WebSocket | null>(null);
  const testTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanupTest = useCallback(() => {
    if (testTimerRef.current) {
      clearTimeout(testTimerRef.current);
      testTimerRef.current = null;
    }
    if (testWsRef.current) {
      testWsRef.current.onopen = null;
      testWsRef.current.onclose = null;
      testWsRef.current.onerror = null;
      testWsRef.current.onmessage = null;
      testWsRef.current.close();
      testWsRef.current = null;
    }
  }, []);

  useEffect(() => cleanupTest, [cleanupTest]);

  const handleToggle = useCallback(() => {
    if (enabled) {
      setMidiBridgeUrl(null);
      setTestStatus('idle');
      setTestDevice(null);
      cleanupTest();
    } else {
      const addr = address.trim() || 'pianobridge.local';
      if (!address.trim()) setAddress('pianobridge.local');
      setMidiBridgeUrl(buildWsUrl(addr));
    }
  }, [enabled, address, setMidiBridgeUrl, cleanupTest]);

  const handleAddressBlur = useCallback(() => {
    if (!enabled || !address.trim()) return;
    setMidiBridgeUrl(buildWsUrl(address));
  }, [enabled, address, setMidiBridgeUrl]);

  const handleAddressKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  }, []);

  const handleTest = useCallback(() => {
    cleanupTest();
    const url = buildWsUrl(address.trim() || 'pianobridge.local');
    setTestStatus('connecting');
    setTestDevice(null);

    try {
      const ws = new WebSocket(url);
      testWsRef.current = ws;

      testTimerRef.current = setTimeout(() => {
        setTestStatus('error');
        cleanupTest();
      }, 5000);

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'hello') {
            setTestStatus('connected');
            setTestDevice(msg.device ?? 'Unknown device');
            if (testTimerRef.current) {
              clearTimeout(testTimerRef.current);
              testTimerRef.current = null;
            }
            setTimeout(() => cleanupTest(), 3000);
          }
        } catch {
          // ignore
        }
      };

      ws.onerror = () => {
        setTestStatus('error');
        cleanupTest();
      };

      ws.onclose = () => {
        if (testStatus === 'connecting') {
          setTestStatus('error');
        }
      };
    } catch {
      setTestStatus('error');
    }
  }, [address, cleanupTest, testStatus]);

  return (
    <div className="space-y-3">
      <p className="text-[11px] t-text-muted leading-relaxed">
        Use a Raspberry Pi to wirelessly connect your MIDI keyboard on devices that don't support Web MIDI (like iPad).
      </p>

      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={handleToggle}
      >
        <div
          className={`w-8 h-[18px] rounded-full transition-colors relative shrink-0 ${
            enabled ? 'bg-accent' : 't-bg-overlay-active'
          }`}
        >
          <span
            className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-[15px]' : 'translate-x-[2px]'
            }`}
          />
        </div>
        <span className="text-xs t-text-secondary">Enable MIDI Bridge</span>
      </div>

      {enabled && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={handleAddressBlur}
              onKeyDown={handleAddressKeyDown}
              placeholder="pianobridge.local"
              className="flex-1 px-3 py-1.5 rounded-lg t-bg-overlay t-text text-xs border t-border-light outline-none focus:border-accent/50 transition-colors placeholder:t-text-muted"
            />
            <button
              onClick={handleTest}
              disabled={testStatus === 'connecting'}
              className="px-3 py-1.5 rounded-lg bg-accent/20 text-accent-light text-xs font-medium hover:bg-accent/30 transition-colors disabled:opacity-50"
            >
              {testStatus === 'connecting' ? 'Testing...' : 'Test'}
            </button>
          </div>

          {testStatus === 'connected' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Connected{testDevice ? ` — ${testDevice}` : ''}
            </div>
          )}
          {testStatus === 'error' && (
            <div className="flex items-center gap-1.5 text-xs text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Could not connect. Check the Pi is running and on the same network.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
