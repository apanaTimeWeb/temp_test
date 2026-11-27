import { SecurityQRCodeModel } from '@/app/frontend_manager/manager_settings/settings_security/utils/ManagerSettingsSecurityQrCore';
import {
  getRSBlocks,
  QRErrorCorrectLevel,
  type QRErrorCorrection,
} from '@/app/frontend_manager/manager_settings/settings_security/utils/ManagerSettingsSecurityQrTables';

/** Generates a 2D boolean matrix representing a TOTP QR code. */
export function generateSecurityQrMatrix(text: string, ecLevel: QRErrorCorrection = 'M'): boolean[][] {
  const payload = !text || text.trim() === '' ? 'otpauth://totp/LibraryOS' : text;
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
  const qr = new SecurityQRCodeModel(typeNumber, ec);
  qr.make(payload);
  return Array.from({ length: qr.moduleCount }, (_, r) =>
    Array.from({ length: qr.moduleCount }, (__, c) => qr.isDark(r, c))
  );
}

/** Converts a QR boolean matrix into a scalable SVG path string. */
export function generateSecurityQrSvgPath(matrix: boolean[][], margin = 2): { viewBox: string; path: string; totalSize: number } {
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
