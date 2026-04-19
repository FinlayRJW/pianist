import { useState, useCallback, useRef, useEffect } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';
import {
  buildWsUrl,
  defaultBridgeAddress,
  stripWsUrl,
  testBridgeConnection,
  type BridgeTestStatus,
} from '../../utils/midi-bridge';

export function MidiBridgeSettings() {
  const midiBridgeUrl = useOnboardingStore((s) => s.midiBridgeUrl);
  const setMidiBridgeUrl = useOnboardingStore((s) => s.setMidiBridgeUrl);

  const enabled = midiBridgeUrl !== null;
  const [address, setAddress] = useState(() => {
    if (!midiBridgeUrl) return '';
    return stripWsUrl(midiBridgeUrl);
  });
  const [testStatus, setTestStatus] = useState<BridgeTestStatus>('idle');
  const [testDevice, setTestDevice] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => cleanupRef.current?.();
  }, []);

  const handleToggle = useCallback(() => {
    if (enabled) {
      setMidiBridgeUrl(null);
      setTestStatus('idle');
      setTestDevice(null);
      cleanupRef.current?.();
    } else {
      const addr = address.trim() || defaultBridgeAddress();
      if (!address.trim()) setAddress(addr);
      setMidiBridgeUrl(buildWsUrl(addr));
    }
  }, [enabled, address, setMidiBridgeUrl]);

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
    cleanupRef.current?.();
    cleanupRef.current = testBridgeConnection(
      address.trim(),
      ({ status, device }) => {
        setTestStatus(status);
        if (device) setTestDevice(device);
      },
    );
  }, [address]);

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
              placeholder={defaultBridgeAddress()}
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
