import {
  setupAdjustPattern,
  setupProbePattern,
  setupTimingPatterns,
  setupTypeInfoBits,
} from '@/app/frontend_manager/manager_settings/settings_branch_info/utils/ManagerSettingsBranchInfoQrPatterns';
import {
  encodeQrBytes,
  QRBitBuffer,
} from '@/app/frontend_manager/manager_settings/settings_branch_info/utils/ManagerSettingsBranchInfoQrPoly';
import { getRSBlocks } from '@/app/frontend_manager/manager_settings/settings_branch_info/utils/ManagerSettingsBranchInfoQrTables';

export class QRCodeModel {
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
    this.mapData(encodeQrBytes(buffer, rsBlocks));
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
