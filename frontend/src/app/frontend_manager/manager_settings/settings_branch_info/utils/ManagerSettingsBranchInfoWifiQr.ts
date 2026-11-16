/**
 * Wi-Fi Payload formatting and pure SVG QR Code generator for Branch Front Desk Standee.
 * Generates standard ISO/IEC 18004 scannable QR codes with zero external dependencies.
 */

export const QRErrorCorrectLevel = {
  L: 1, // 7% error recovery
  M: 0, // 15% error recovery
  Q: 3, // 25% error recovery
  H: 2, // 30% error recovery
} as const;

export type QRErrorCorrection = keyof typeof QRErrorCorrectLevel;

export interface WifiQrConfig {
  ssid: string;
  password?: string;
  security?: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

/**
 * Escapes special characters for Wi-Fi QR Code string format:
 * \ -> \\
 * ; -> \;
 * , -> \,
 * : -> \:
 * " -> \"
 */
export function escapeWifiString(str: string): string {
  if (!str) return '';
  return str.replace(/([\\;,:"'])/g, '\\$1');
}

/**
 * Formats a standard Wi-Fi connection QR payload string.
 * Example: WIFI:S:SmartLibrary_Student_5G;T:WPA;P:StudyHub@2026;;
 */
export function formatWifiQrPayload(config: WifiQrConfig): string {
  const ssid = escapeWifiString(config.ssid.trim());
  const security = config.security || (config.password ? 'WPA' : 'nopass');
  const hiddenPart = config.hidden ? ';H:true' : '';

  if (security === 'nopass' || !config.password) {
    return `WIFI:S:${ssid};T:nopass${hiddenPart};;`;
  }

  const password = escapeWifiString(config.password);
  return `WIFI:S:${ssid};T:${security};P:${password}${hiddenPart};;`;
}

// ── GALOIS FIELD ARITHMETIC ──
const EXP_TABLE = new Uint8Array(256);
const LOG_TABLE = new Uint8Array(256);

for (let i = 0, x = 1; i < 255; i++) {
  EXP_TABLE[i] = x;
  LOG_TABLE[x] = i;
  x <<= 1;
  if (x & 0x100) {
    x ^= 0x11d;
  }
}
for (let i = 255; i < 256; i++) {
  EXP_TABLE[i] = EXP_TABLE[i - 255];
}

function glog(n: number): number {
  if (n < 1) throw new Error(`glog(${n})`);
  return LOG_TABLE[n];
}

function gexp(n: number): number {
  let val = n;
  while (val < 0) val += 255;
  while (val >= 255) val -= 255;
  return EXP_TABLE[val];
}

class Polynomial {
  num: number[];
  constructor(num: number[], shift = 0) {
    let offset = 0;
    while (offset < num.length && num[offset] === 0) offset++;
    this.num = new Array(num.length - offset + shift).fill(0);
    for (let i = 0; i < num.length - offset; i++) {
      this.num[i] = num[offset + i];
    }
  }
  get(index: number): number {
    return this.num[index];
  }
  getLength(): number {
    return this.num.length;
  }
  multiply(e: Polynomial): Polynomial {
    const num = new Array(this.getLength() + e.getLength() - 1).fill(0);
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= gexp(glog(this.get(i)) + glog(e.get(j)));
      }
    }
    return new Polynomial(num);
  }
  mod(e: Polynomial): Polynomial {
    if (this.getLength() - e.getLength() < 0) return this;
    const ratio = glog(this.get(0)) - glog(e.get(0));
    const num = new Array(this.getLength());
    for (let i = 0; i < this.getLength(); i++) num[i] = this.get(i);
    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= gexp(glog(e.get(i)) + ratio);
    }
    return new Polynomial(num).mod(e);
  }
}

class QRRSBlock {
  totalCount: number;
  dataCount: number;
  constructor(totalCount: number, dataCount: number) {
    this.totalCount = totalCount;
    this.dataCount = dataCount;
  }
}

// RS Block definitions: [count, totalCount, dataCount]
const RS_BLOCK_TABLE: number[][][] = [
  // 1
  [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9]],
  // 2
  [[1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16]],
  // 3
  [[1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13]],
  // 4
  [[1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9]],
  // 5
  [[1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12]],
  // 6
  [[2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15]],
  // 7
  [[2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14]],
  // 8
  [[2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15]],
  // 9
  [[2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13]],
  // 10
  [[2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16]]
];

function getRSBlocks(typeNumber: number, errorCorrectLevel: number): QRRSBlock[] {
  const rsBlock = RS_BLOCK_TABLE[typeNumber - 1][errorCorrectLevel];
  if (!rsBlock) throw new Error(`bad rs block @ typeNumber:${typeNumber}/errorCorrectLevel:${errorCorrectLevel}`);
  const list: QRRSBlock[] = [];
  for (let i = 0; i < rsBlock.length; i += 3) {
    const count = rsBlock[i];
    const totalCount = rsBlock[i + 1];
    const dataCount = rsBlock[i + 2];
    for (let j = 0; j < count; j++) {
      list.push(new QRRSBlock(totalCount, dataCount));
    }
  }
  return list;
}

class QRBitBuffer {
  buffer: number[] = [];
  length = 0;
  get(index: number): boolean {
    const bufIndex = Math.floor(index / 8);
    return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1;
  }
  put(num: number, len: number): void {
    for (let i = 0; i < len; i++) {
      this.putBit(((num >>> (len - i - 1)) & 1) === 1);
    }
  }
  putBit(bit: boolean): void {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
    }
    this.length++;
  }
}

const PATTERN_POSITION_TABLE: number[][] = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

function getBCHTypeInfo(data: number): number {
  let d = data << 10;
  while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
    d ^= G15 << (getBCHDigit(d) - getBCHDigit(G15));
  }
  return ((data << 10) | d) ^ G15_MASK;
}

function getBCHDigit(data: number): number {
  let digit = 0;
  while (data !== 0) {
    digit++;
    data >>>= 1;
  }
  return digit;
}

class QRCodeModel {
  typeNumber: number;
  errorCorrectLevel: number;
  modules: (boolean | null)[][] = [];
  moduleCount = 0;

  constructor(typeNumber: number, errorCorrectLevel: number) {
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
  }

  isDark(row: number, col: number): boolean {
    if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
      return false;
    }
    return !!this.modules[row][col];
  }

  make(data: string): void {
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = Array.from({ length: this.moduleCount }, () => Array(this.moduleCount).fill(null));

    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(true, 0);

    const buffer = new QRBitBuffer();
    buffer.put(4, 4); // Byte mode 0100
    const utf8Bytes = new TextEncoder().encode(data);
    buffer.put(utf8Bytes.length, 8);
    for (let i = 0; i < utf8Bytes.length; i++) {
      buffer.put(utf8Bytes[i], 8);
    }

    const rsBlocks = getRSBlocks(this.typeNumber, this.errorCorrectLevel);
    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i++) {
      totalDataCount += rsBlocks[i].dataCount;
    }

    if (buffer.length + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }
    while (buffer.length % 8 !== 0) {
      buffer.putBit(false);
    }
    while (buffer.length < totalDataCount * 8) {
      buffer.put(0xec, 8);
      if (buffer.length >= totalDataCount * 8) break;
      buffer.put(0x11, 8);
    }

    const finalData = this.createBytes(buffer, rsBlocks);
    this.mapData(finalData, 0);
  }

  private setupPositionProbePattern(row: number, col: number): void {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue;
        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          this.modules[row + r][col + c] = true;
        } else {
          this.modules[row + r][col + c] = false;
        }
      }
    }
  }

  private setupTimingPattern(): void {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules[r][6] !== null) continue;
      this.modules[r][6] = r % 2 === 0;
    }
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules[6][c] !== null) continue;
      this.modules[6][c] = c % 2 === 0;
    }
  }

  private setupPositionAdjustPattern(): void {
    const pos = PATTERN_POSITION_TABLE[this.typeNumber - 1];
    if (!pos) return;
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i];
        const col = pos[j];
        if (this.modules[row][col] !== null) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  }

  private setupTypeInfo(test: boolean, maskPattern: number): void {
    const data = (this.errorCorrectLevel << 3) | maskPattern;
    const bits = getBCHTypeInfo(data);
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      if (i < 6) {
        this.modules[i][8] = mod;
      } else if (i < 8) {
        this.modules[i + 1][8] = mod;
      } else {
        this.modules[this.moduleCount - 15 + i][8] = mod;
      }
      if (i < 8) {
        this.modules[8][this.moduleCount - i - 1] = mod;
      } else if (i < 9) {
        this.modules[8][15 - i - 1 + 1] = mod;
      } else {
        this.modules[8][15 - i - 1] = mod;
      }
    }
    this.modules[this.moduleCount - 8][8] = !test;
  }

  private createBytes(buffer: QRBitBuffer, rsBlocks: QRRSBlock[]): number[] {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;
    const dcdata: number[][] = Array.from({ length: rsBlocks.length }, () => []);
    const ecdata: number[][] = Array.from({ length: rsBlocks.length }, () => []);

    for (let r = 0; r < rsBlocks.length; r++) {
      const dcCount = rsBlocks[r].dataCount;
      const ecCount = rsBlocks[r].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);

      dcdata[r] = new Array(dcCount);
      for (let i = 0; i < dcCount; i++) {
        dcdata[r][i] = 0xff & buffer.buffer[i + offset];
      }
      offset += dcCount;

      const rsPoly = this.getErrorCorrectPolynomial(ecCount);
      const rawPoly = new Polynomial(dcdata[r], rsPoly.getLength() - 1);
      const modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (let i = 0; i < ecdata[r].length; i++) {
        const modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
      }
    }

    const data: number[] = [];
    for (let i = 0; i < maxDcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) data.push(dcdata[r][i]);
      }
    }
    for (let i = 0; i < maxEcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) data.push(ecdata[r][i]);
      }
    }
    return data;
  }

  private getErrorCorrectPolynomial(errorCorrectLength: number): Polynomial {
    let a = new Polynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i++) {
      a = a.multiply(new Polynomial([1, gexp(i)], 0));
    }
    return a;
  }

  private mapData(data: number[], maskPattern: number): void {
    let inc = -1;
    let row = this.moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;

    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] === null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;
            }
            // Mask pattern 0: (row + col) % 2 === 0
            const mask = (row + (col - c)) % 2 === 0;
            if (mask) dark = !dark;
            this.modules[row][col - c] = dark;
            bitIndex--;
            if (bitIndex === -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || this.moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
    this.setupTypeInfo(false, maskPattern);
  }
}

/**
 * Generates a 2D boolean array representing the QR Code.
 */
export function generateQrMatrix(text: string, ecLevel: QRErrorCorrection = 'M'): boolean[][] {
  if (!text || text.trim() === '') {
    text = 'WIFI:S:Library;T:nopass;;';
  }
  const ec = QRErrorCorrectLevel[ecLevel];
  const bytesCount = new TextEncoder().encode(text).length;
  let typeNumber = 1;
  for (let t = 1; t <= 10; t++) {
    const rs = getRSBlocks(t, ec);
    let cap = 0;
    for (const b of rs) cap += b.dataCount;
    // 4 bits mode + 8 bits count + terminator
    if (bytesCount + 2 <= cap) {
      typeNumber = t;
      break;
    }
  }

  const qr = new QRCodeModel(typeNumber, ec);
  qr.make(text);
  const matrix: boolean[][] = [];
  for (let r = 0; r < qr.moduleCount; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < qr.moduleCount; c++) {
      row.push(qr.isDark(r, c));
    }
    matrix.push(row);
  }
  return matrix;
}

/**
 * Converts a QR matrix into a single scalable SVG path data string.
 */
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
  return {
    viewBox: `0 0 ${totalSize} ${totalSize}`,
    path: path.trim(),
    totalSize,
  };
}
