export function buildWsUrl(address: string): string {
  const trimmed = address.trim();
  if (trimmed.startsWith('ws://') || trimmed.startsWith('wss://')) return trimmed;
  if (trimmed.includes(':')) return `ws://${trimmed}`;
  const port = sameHostPort() ?? 8080;
  return `ws://${trimmed}:${port}`;
}

function sameHostPort(): number | null {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname;
  const addr = defaultBridgeAddress();
  if (host === addr || host === addr.replace('.local', '')) {
    const p = parseInt(window.location.port, 10);
    return isNaN(p) ? null : p;
  }
  return null;
}

export function defaultBridgeAddress(): string {
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'http:' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return window.location.hostname;
  }
  return 'pianobridge.local';
}

export function stripWsUrl(url: string): string {
  return url.replace(/^wss?:\/\//, '').replace(/:\d+$/, '');
}

export type BridgeTestStatus = 'idle' | 'connecting' | 'connected' | 'error';

export interface BridgeTestResult {
  status: BridgeTestStatus;
  device: string | null;
}

export function testBridgeConnection(
  address: string,
  onUpdate: (result: BridgeTestResult) => void,
): () => void {
  const url = buildWsUrl(address || defaultBridgeAddress());
  let ws: WebSocket | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;

  const cleanup = () => {
    disposed = true;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (ws) {
      ws.onopen = null;
      ws.onclose = null;
      ws.onerror = null;
      ws.onmessage = null;
      ws.close();
      ws = null;
    }
  };

  onUpdate({ status: 'connecting', device: null });

  try {
    ws = new WebSocket(url);

    timer = setTimeout(() => {
      if (!disposed) onUpdate({ status: 'error', device: null });
      cleanup();
    }, 5000);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'hello') {
          if (!disposed) {
            onUpdate({ status: 'connected', device: msg.device ?? 'Unknown device' });
          }
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          setTimeout(() => cleanup(), 3000);
        }
      } catch {
        // ignore
      }
    };

    ws.onerror = () => {
      if (!disposed) onUpdate({ status: 'error', device: null });
      cleanup();
    };

    ws.onclose = () => {
      if (!disposed) onUpdate({ status: 'error', device: null });
    };
  } catch {
    onUpdate({ status: 'error', device: null });
  }

  return cleanup;
}
