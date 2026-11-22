import {
escapeWifiString,
formatWifiQrPayload,
generateQrMatrix,
generateQrSvgPath,
} from '@/app/frontend_manager/manager_settings/settings_branch_info/utils/ManagerSettingsBranchInfoWifiQr';
import { describe,expect,it } from 'vitest';

describe('ManagerSettingsBranchInfoWifiQr', () => {
  describe('escapeWifiString', () => {
    it('escapes reserved wifi characters', () => {
      expect(escapeWifiString('My:Net;Work"\\')).toBe('My\\:Net\\;Work\\"\\\\');
    });

    it('returns empty string on empty input', () => {
      expect(escapeWifiString('')).toBe('');
    });
  });

  describe('formatWifiQrPayload', () => {
    it('formats WPA protected network correctly', () => {
      const payload = formatWifiQrPayload({
        ssid: 'SmartLibrary_Student_5G',
        password: 'StudyHub@2026',
        security: 'WPA',
      });
      expect(payload).toBe('WIFI:S:SmartLibrary_Student_5G;T:WPA;P:StudyHub@2026;;');
    });

    it('formats open / nopass network without password field', () => {
      const payload = formatWifiQrPayload({
        ssid: 'SmartLibrary_Free_Open',
        security: 'nopass',
      });
      expect(payload).toBe('WIFI:S:SmartLibrary_Free_Open;T:nopass;;');
    });

    it('supports hidden SSID option', () => {
      const payload = formatWifiQrPayload({
        ssid: 'HiddenStudyNet',
        password: 'SecretPass123',
        security: 'WPA',
        hidden: true,
      });
      expect(payload).toBe('WIFI:S:HiddenStudyNet;T:WPA;P:SecretPass123;H:true;;');
    });

    it('escapes special characters within SSID and password', () => {
      const payload = formatWifiQrPayload({
        ssid: 'Library;Zone:1',
        password: 'pass;word:123',
      });
      expect(payload).toBe('WIFI:S:Library\\;Zone\\:1;T:WPA;P:pass\\;word\\:123;;');
    });
  });

  describe('generateQrMatrix', () => {
    it('generates a valid square matrix for wifi string', () => {
      const payload = formatWifiQrPayload({
        ssid: 'SmartLibrary_Student_5G',
        password: 'StudyHub@2026',
      });
      const matrix = generateQrMatrix(payload, 'M');

      expect(Array.isArray(matrix)).toBe(true);
      expect(matrix.length).toBeGreaterThanOrEqual(21);
      expect(matrix[0].length).toBe(matrix.length);

      // Verify Top-Left 7x7 Finder Pattern structure
      // Row 0 and Row 6 must be all dark in 0..6
      for (let c = 0; c < 7; c++) {
        expect(matrix[0][c]).toBe(true);
        expect(matrix[6][c]).toBe(true);
      }
      // Col 0 and Col 6 must be all dark in 0..6
      for (let r = 0; r < 7; r++) {
        expect(matrix[r][0]).toBe(true);
        expect(matrix[r][6]).toBe(true);
      }
      // Center 3x3 (rows 2..4, cols 2..4) must be dark
      for (let r = 2; r <= 4; r++) {
        for (let c = 2; c <= 4; c++) {
          expect(matrix[r][c]).toBe(true);
        }
      }
      // Inner ring (row 1, col 1..5) should be light except col 0 and 6
      expect(matrix[1][1]).toBe(false);
      expect(matrix[1][2]).toBe(false);
      expect(matrix[1][3]).toBe(false);
      expect(matrix[1][4]).toBe(false);
      expect(matrix[1][5]).toBe(false);
    });

    it('handles fallback gracefully when empty string is passed', () => {
      const matrix = generateQrMatrix('');
      expect(matrix.length).toBeGreaterThanOrEqual(21);
    });
  });

  describe('generateQrSvgPath', () => {
    it('produces valid SVG path data and viewBox', () => {
      const matrix = generateQrMatrix('WIFI:S:TestNet;T:WPA;P:12345678;;');
      const svg = generateQrSvgPath(matrix, 2);

      expect(svg.viewBox).toBe(`0 0 ${matrix.length + 4} ${matrix.length + 4}`);
      expect(svg.totalSize).toBe(matrix.length + 4);
      expect(svg.path).toContain('M');
      expect(svg.path).toContain('h1v1h-1z');
    });
  });
});
