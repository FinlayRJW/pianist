import { useRef, useEffect, useCallback, useState } from 'react';

interface WebSocketMidiState {
  activeNotes: Set<number>;
  isConnected: boolean;
  deviceName: string | null;
  error: string | null;
}

const RECONNECT_DELAYS = [1000, 2000, 4000, 8000];

export function useWebSocketMidi(url: string | null) {
  const [state, setState] = useState<WebSocketMidiState>({
    activeNotes: new Set(),
    isConnected: false,
    deviceName: null,
    error: null,
  });

  const activeNotesRef = useRef<Set<number>>(new Set());
  const onNoteOnRef = useRef<((midi: number) => void) | null>(null);
  const onNoteOffRef = useRef<((midi: number) => void) | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountedRef = useRef(false);

  const cleanup = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    activeNotesRef.current.clear();
    setState({
      activeNotes: new Set(),
      isConnected: false,
      deviceName: null,
      error: null,
    });
  }, []);

  const connect = useCallback((wsUrl: string) => {
    if (unmountedRef.current) return;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttemptRef.current = 0;
        setState((prev) => ({ ...prev, error: null }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'hello') {
            setState((prev) => ({
              ...prev,
              isConnected: true,
              deviceName: msg.device ?? 'MIDI Bridge',
              error: null,
            }));
            return;
          }

          if (msg.type === 'noteOn') {
            activeNotesRef.current.add(msg.note);
            onNoteOnRef.current?.(msg.note);
            setState((prev) => ({
              ...prev,
              activeNotes: new Set(activeNotesRef.current),
            }));
          } else if (msg.type === 'noteOff') {
            activeNotesRef.current.delete(msg.note);
            onNoteOffRef.current?.(msg.note);
            setState((prev) => ({
              ...prev,
              activeNotes: new Set(activeNotesRef.current),
            }));
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        if (unmountedRef.current) return;
        activeNotesRef.current.clear();
        setState((prev) => ({
          ...prev,
          activeNotes: new Set(),
          isConnected: false,
        }));

        const attempt = reconnectAttemptRef.current;
        const delay = RECONNECT_DELAYS[Math.min(attempt, RECONNECT_DELAYS.length - 1)];
        reconnectAttemptRef.current = attempt + 1;
        reconnectTimerRef.current = setTimeout(() => connect(wsUrl), delay);
      };

      ws.onerror = () => {
        setState((prev) => ({
          ...prev,
          error: 'Connection failed',
          isConnected: false,
        }));
      };
    } catch {
      setState((prev) => ({
        ...prev,
        error: 'Invalid WebSocket URL',
        isConnected: false,
      }));
    }
  }, []);

  useEffect(() => {
    unmountedRef.current = false;

    if (!url) {
      cleanup();
      return;
    }

    cleanup();
    connect(url);

    return () => {
      unmountedRef.current = true;
      cleanup();
    };
  }, [url, connect, cleanup]);

  return {
    activeNotes: activeNotesRef,
    activeNotesState: state.activeNotes,
    isConnected: state.isConnected,
    deviceName: state.deviceName,
    error: state.error,
    onNoteOn: onNoteOnRef,
    onNoteOff: onNoteOffRef,
  };
}
