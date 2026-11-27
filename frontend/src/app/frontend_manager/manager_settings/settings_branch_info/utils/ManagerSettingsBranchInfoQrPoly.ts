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
EXP_TABLE[255] = EXP_TABLE[0];

export function glog(n: number): number {
  if (n < 1) throw new Error(`glog(${n})`);
  return LOG_TABLE[n];
}

export function gexp(n: number): number {
  let val = n;
  while (val < 0) val += 255;
  while (val >= 255) val -= 255;
  return EXP_TABLE[val];
}

export class QRPolynomial {
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
  multiply(e: QRPolynomial): QRPolynomial {
    const num = new Array(this.getLength() + e.getLength() - 1).fill(0);
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= gexp(glog(this.get(i)) + glog(e.get(j)));
      }
    }
    return new QRPolynomial(num);
  }
  mod(e: QRPolynomial): QRPolynomial {
    if (this.getLength() - e.getLength() < 0) return this;
    const ratio = glog(this.get(0)) - glog(e.get(0));
    const num = [...this.num];
    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= gexp(glog(e.get(i)) + ratio);
    }
    return new QRPolynomial(num).mod(e);
  }
}

export class QRBitBuffer {
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

export function encodeQrBytes(buffer: QRBitBuffer, rsBlocks: Array<{ totalCount: number; dataCount: number }>): number[] {
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
    let rsPoly = new QRPolynomial([1], 0);
    for (let i = 0; i < ecCount; i++) rsPoly = rsPoly.multiply(new QRPolynomial([1, gexp(i)], 0));
    const modPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1).mod(rsPoly);
    const ecLen = rsPoly.getLength() - 1;
    ecdata[r] = Array.from({ length: ecLen }, (_, i) => (i + modPoly.getLength() - ecLen >= 0 ? modPoly.get(i + modPoly.getLength() - ecLen) : 0));
  }
  const out: number[] = [];
  for (let i = 0; i < maxDc; i++) for (let r = 0; r < rsBlocks.length; r++) if (i < dcdata[r].length) out.push(dcdata[r][i]);
  for (let i = 0; i < maxEc; i++) for (let r = 0; r < rsBlocks.length; r++) if (i < ecdata[r].length) out.push(ecdata[r][i]);
  return out;
}
