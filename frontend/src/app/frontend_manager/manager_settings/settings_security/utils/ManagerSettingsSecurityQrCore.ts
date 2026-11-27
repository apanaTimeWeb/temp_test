import {
  setupAdjustPattern,
  setupProbePattern,
  setupTimingPatterns,
  setupTypeInfoBits,
} from '@/app/frontend_manager/manager_settings/settings_security/utils/ManagerSettingsSecurityQrPatterns';
import {
  gexp,
  QRBitBuffer,
  QRPolynomial,
} from '@/app/frontend_manager/manager_settings/settings_security/utils/ManagerSettingsSecurityQrPoly';
import {
  getRSBlocks,
  type QRRSBlock,
} from '@/app/frontend_manager/manager_settings/settings_security/utils/ManagerSettingsSecurityQrTables';

function getErrorCorrectPoly(len: number): QRPolynomial {
  let poly = new QRPolynomial([1], 0);
  for (let i = 0; i < len; i++) poly = poly.multiply(new QRPolynomial([1, gexp(i)], 0));
  return poly;
}

function encodeBytes(buffer: QRBitBuffer, rsBlocks: QRRSBlock[]): number[] {
  let offset = 0;
  let maxDc = 0;
  let maxEc = 0;
  const dcdata: number[][] = [];
  const ecdata: number[][] = [];

  for (let r = 0; r < rsBlocks.length; r++) {
    const dcCount = rsBlocks[r].dataCount;
    const ecCount = rsBlocks[r].totalCount - dcCount;
    maxDc = Math.max(maxDc, dcCount);
    maxEc = Math.max(maxEc, ecCount);
    dcdata[r] = Array.from({ length: dcCount }, (_, i) => 0xff & buffer.buffer[i + offset]);
    offset += dcCount;
    const rsPoly = getErrorCorrectPoly(ecCount);
    const modPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1).mod(rsPoly);
    const ecLen = rsPoly.getLength() - 1;
    ecdata[r] = Array.from({ length: ecLen }, (_, i) => {
      const idx = i + modPoly.getLength() - ecLen;
      return idx >= 0 ? modPoly.get(idx) : 0;
    });
  }

  const out: number[] = [];
  for (let i = 0; i < maxDc; i++) for (let r = 0; r < rsBlocks.length; r++) if (i < dcdata[r].length) out.push(dcdata[r][i]);
  for (let i = 0; i < maxEc; i++) for (let r = 0; r < rsBlocks.length; r++) if (i < ecdata[r].length) out.push(ecdata[r][i]);
  return out;
}

export class SecurityQRCodeModel {
  typeNumber: number;
  errorCorrectLevel: number;
  modules: (boolean | null)[][] = [];
  moduleCount = 0;

  constructor(typeNumber: number, errorCorrectLevel: number) {
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
  }

  isDark(row: number, col: number): boolean {
    if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) return false;
    return !!this.modules[row][col];
  }

  make(data: string): void {
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = Array.from({ length: this.moduleCount }, () => Array(this.moduleCount).fill(null));
    setupProbePattern(this.modules, this.moduleCount, 0, 0);
    setupProbePattern(this.modules, this.moduleCount, this.moduleCount - 7, 0);
    setupProbePattern(this.modules, this.moduleCount, 0, this.moduleCount - 7);
    setupAdjustPattern(this.modules, this.typeNumber);
    setupTimingPatterns(this.modules, this.moduleCount);
    setupTypeInfoBits(this.modules, this.moduleCount, this.errorCorrectLevel, true, 0);

    const buffer = new QRBitBuffer();
    buffer.put(4, 4);
    const utf8 = new TextEncoder().encode(data);
    buffer.put(utf8.length, 8);
    for (const byte of utf8) buffer.put(byte, 8);

    const rsBlocks = getRSBlocks(this.typeNumber, this.errorCorrectLevel);
    const totalBits = rsBlocks.reduce((acc, b) => acc + b.dataCount, 0) * 8;
    if (buffer.length + 4 <= totalBits) buffer.put(0, 4);
    while (buffer.length % 8 !== 0) buffer.putBit(false);
    while (buffer.length < totalBits) {
      buffer.put(0xec, 8);
      if (buffer.length >= totalBits) break;
      buffer.put(0x11, 8);
    }
    this.mapData(encodeBytes(buffer, rsBlocks));
    setupTypeInfoBits(this.modules, this.moduleCount, this.errorCorrectLevel, false, 0);
  }

  private mapData(data: number[]): void {
    let inc = -1;
    let row = this.moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] === null) {
            let dark = byteIndex < data.length && ((data[byteIndex] >>> bitIndex) & 1) === 1;
            if ((row + (col - c)) % 2 === 0) dark = !dark;
            this.modules[row][col - c] = dark;
            bitIndex--;
            if (bitIndex === -1) { byteIndex++; bitIndex = 7; }
          }
        }
        row += inc;
        if (row < 0 || this.moduleCount <= row) { row -= inc; inc = -inc; break; }
      }
    }
  }
}
