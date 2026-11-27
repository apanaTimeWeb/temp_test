import { QRCodeModel } from '@/app/frontend_manager/manager_settings/settings_branch_info/utils/ManagerSettingsBranchInfoQrCore';
import {
  getRSBlocks,
  QRErrorCorrectLevel,
  type QRErrorCorrection,
} from '@/app/frontend_manager/manager_settings/settings_branch_info/utils/ManagerSettingsBranchInfoQrTables';

export { QRErrorCorrectLevel, type QRErrorCorrection };

export interface WifiQrConfig {
  ssid: string;
  password?: string;
  security?: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

/** Escapes special characters for Wi-Fi QR Code payloads. */
export function escapeWifiString(str: string): string {
  if (!str) return '';
  return str.replace(/([\\;,:"'])/g, '\\$1');
}

/** Formats a standard Wi-Fi connection QR payload string. */
export function formatWifiQrPayload(config: WifiQrConfig): string {
  const ssid = escapeWifiString(config.ssid.trim());
  const security = config.security || (config.password ? 'WPA' : 'nopass');
  const hiddenPart = config.hidden ? ';H:true' : '';
  if (security === 'nopass' || !config.password) {
    return `WIFI:S:${ssid};T:nopass${hiddenPart};;`;
  }
  return `WIFI:S:${ssid};T:${security};P:${escapeWifiString(config.password)}${hiddenPart};;`;
}

/** Generates a 2D boolean matrix representing the QR code. */
export function generateQrMatrix(text: string, ecLevel: QRErrorCorrection = 'M'): boolean[][] {
  const payload = !text || text.trim() === '' ? 'WIFI:S:Library;T:nopass;;' : text;
  const ec = QRErrorCorrectLevel[ecLevel];
  const bytesCount = new TextEncoder().encode(payload).length;
  let typeNumber = 1;
  for (let t = 1; t <= 10; t++) {
    const cap = getRSBlocks(t, ec).reduce((acc, b) => acc + b.dataCount, 0);
    if (bytesCount + 2 <= cap) {
      typeNumber = t;
      break;
    }
  }
  const qr = new QRCodeModel(typeNumber, ec);
  qr.make(payload);
  return Array.from({ length: qr.moduleCount }, (_, r) =>
    Array.from({ length: qr.moduleCount }, (__, c) => qr.isDark(r, c))
  );
}

/** Converts a QR boolean matrix into a scalable SVG path string. */
export function generateQrSvgPath(matrix: boolean[][], margin = 2): { viewBox: string; path: string; totalSize: number } {
  const size = matrix.length;
  const totalSize = size + margin * 2;
  let path = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) {
        path += `M${c + margin},${r + margin}h1v1h-1z `;
      }
    }
  }
  return { viewBox: `0 0 ${totalSize} ${totalSize}`, path: path.trim(), totalSize };
}
