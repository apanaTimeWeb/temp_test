'use client';

export function ManagerMembersIdCardGeneratorBarcodeStripes({
  id,
  count = 28,
  palette = ['#38bdf8', '#a78bfa', '#f1f5f9'],
  prefix = 'stripe',
}: {
  id: string;
  count?: number;
  palette?: [string, string, string];
  prefix?: string;
}) {
  const safeId = id && id.length > 0 ? id : 'LIB-DEFAULT';
  const bars: { width: number; gap: number }[] = [];
  const step = count === 36 ? 7 : 3;
  for (let index = 0; index < count; index += 1) {
    const code = safeId.charCodeAt(index % safeId.length) + index * step;
    bars.push({ width: (code % 3) + 1, gap: (code % 2) + 1 });
  }
  const totalWidth = bars.reduce((acc, b) => acc + b.width + b.gap, 0);
  let currentX = 0;

  return (
    <svg viewBox={`0 0 ${totalWidth} 36`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-label={`Barcode for ${safeId}`} className="w-full h-full block">
      {bars.map((bar, index) => {
        const fill = index % 5 === 0 ? palette[0] : index % 3 === 0 ? palette[1] : palette[2];
        const xPos = currentX;
        currentX += bar.width + bar.gap;
        return <rect key={`${safeId}-${prefix}-${index}`} x={xPos} y="0" width={bar.width} height="36" fill={fill} rx="0.5" />;
      })}
    </svg>
  );
}

const QR_BITS: ReadonlyArray<[number, number, number?, number?]> = [
  [10, 10, 2, 2], [13, 10, 2, 1], [16, 10, 1, 2], [18, 10, 2, 2], [21, 10, 2, 1],
  [10, 13, 2, 1], [13, 12, 2, 2], [16, 13, 2, 1], [19, 13, 1, 2], [21, 12, 2, 2],
  [10, 15, 1, 2], [12, 15, 2, 2], [15, 15, 2, 2], [18, 16, 2, 1], [21, 15, 2, 2],
  [10, 18, 2, 2], [13, 18, 2, 1], [16, 17, 2, 2], [10, 21, 1, 2], [12, 21, 2, 1],
  [15, 20, 2, 2], [18, 21, 1, 2],
];

const QR_FINDERS: ReadonlyArray<[number, number]> = [[2, 2], [16, 2], [2, 16]];

export function ManagerMembersIdCardGeneratorQrSvg({ code, darkColor = '#0F172A' }: { code: string; darkColor?: string }) {
  const safeCode = code || 'LIB-0000';
  return (
    <svg width="100%" height="100%" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-label={`QR for ${safeCode}`} className="w-full h-full block">
      <rect width="25" height="25" rx="2" fill="#FFFFFF" />
      {QR_FINDERS.map(([fx, fy]) => (
        <g key={`f-${fx}-${fy}`}>
          <rect x={fx} y={fy} width="7" height="7" fill={darkColor} rx="1.2" />
          <rect x={fx + 1} y={fy + 1} width="5" height="5" fill="#FFFFFF" rx="0.5" />
          <rect x={fx + 2} y={fy + 2} width="3" height="3" fill={darkColor} rx="0.6" />
        </g>
      ))}
      <rect x="10" y="4" width="1" height="1" fill={darkColor} />
      <rect x="12" y="4" width="1" height="1" fill={darkColor} />
      <rect x="14" y="4" width="1" height="1" fill={darkColor} />
      <rect x="4" y="10" width="1" height="1" fill={darkColor} />
      <rect x="4" y="12" width="1" height="1" fill={darkColor} />
      <rect x="4" y="14" width="1" height="1" fill={darkColor} />
      {QR_BITS.map(([bx, by, bw = 1, bh = 1]) => (
        <rect key={`b-${bx}-${by}`} x={bx} y={by} width={bw} height={bh} fill={darkColor} rx="0.3" />
      ))}
      <rect x="19" y="18" width="4" height="4" fill={darkColor} rx="0.8" />
      <rect x="20" y="19" width="2" height="2" fill="#FFFFFF" rx="0.3" />
    </svg>
  );
}
