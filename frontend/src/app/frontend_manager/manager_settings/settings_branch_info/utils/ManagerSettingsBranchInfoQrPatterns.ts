import {
  getBCHTypeInfo,
  PATTERN_POSITION_TABLE,
} from '@/app/frontend_manager/manager_settings/settings_branch_info/utils/ManagerSettingsBranchInfoQrTables';

export function setupProbePattern(modules: (boolean | null)[][], moduleCount: number, row: number, col: number): void {
  for (let r = -1; r <= 7; r++) {
    if (row + r <= -1 || moduleCount <= row + r) continue;
    for (let c = -1; c <= 7; c++) {
      if (col + c <= -1 || moduleCount <= col + c) continue;
      modules[row + r][col + c] =
        (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
        (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
        (2 <= r && r <= 4 && 2 <= c && c <= 4);
    }
  }
}

export function setupTimingPatterns(modules: (boolean | null)[][], moduleCount: number): void {
  for (let r = 8; r < moduleCount - 8; r++) {
    if (modules[r][6] === null) modules[r][6] = r % 2 === 0;
  }
  for (let c = 8; c < moduleCount - 8; c++) {
    if (modules[6][c] === null) modules[6][c] = c % 2 === 0;
  }
}

export function setupAdjustPattern(modules: (boolean | null)[][], typeNumber: number): void {
  const pos = PATTERN_POSITION_TABLE[typeNumber - 1];
  if (!pos) return;
  for (const row of pos) {
    for (const col of pos) {
      if (modules[row][col] !== null) continue;
      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          modules[row + r][col + c] = r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0);
        }
      }
    }
  }
}

export function setupTypeInfoBits(
  modules: (boolean | null)[][],
  moduleCount: number,
  errorCorrectLevel: number,
  test: boolean,
  maskPattern: number
): void {
  const bits = getBCHTypeInfo((errorCorrectLevel << 3) | maskPattern);
  for (let i = 0; i < 15; i++) {
    const mod = !test && ((bits >> i) & 1) === 1;
    if (i < 6) modules[i][8] = mod;
    else if (i < 8) modules[i + 1][8] = mod;
    else modules[moduleCount - 15 + i][8] = mod;

    if (i < 8) modules[8][moduleCount - i - 1] = mod;
    else if (i < 9) modules[8][15 - i] = mod;
    else modules[8][15 - i - 1] = mod;
  }
  modules[moduleCount - 8][8] = !test;
}
