type SingleGaugeProps = {
  value: number; // HRV 값 (예: 74)
  min?: number; // 기본 0
  max?: number; // 기본 200
  label: string; // "전" | "후"
};

type HrvGaugeProps = {
  previous: number;
  current: number;
  min?: number;
  max?: number;
};

/** 화면 규격(스샷 비율 맞춤) */
const W = 180;
const H = 180; // 정원형
const cx = W / 2;
const cy = H / 2;

/** 개별 게이지 (정원형 + 상단 초록 아크 + 삼각 바늘) */
function SingleGauge({ value, min = 0, max = 200, label }: SingleGaugeProps) {
  const R = 64; // 반지름
  const STROKE = 16; // 링 두께
  const ARC_TOP = 'rgba(105,211,70,1)';
  const RING_BG = '#F6EEE6';
  const NEEDLE = '#EF4444';

  const ARC_START = 210;
  const ARC_END = -30;

  const clamp = (n: number, a: number, b: number) =>
    Math.max(a, Math.min(n, b));
  const t = (clamp(value, min, max) - min) / (max - min);
  const angleCW = ARC_START + t * (ARC_END - ARC_START);

  const toRad = (degCW: number) => (-degCW * Math.PI) / 180;
  const pt = (r: number, angCW: number) => {
    const rad = toRad(angCW);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  function arcPath(r: number, startCW: number, endCW: number) {
    const p0 = pt(r, startCW);
    const p1 = pt(r, endCW);
    let delta = Math.abs(endCW - startCW);
    if (delta > 360) delta = 360;
    const largeArcFlag = delta > 180 ? 1 : 0;
    const sweepFlag = 1;
    return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${p1.x} ${p1.y}`;
  }

  // ─── 바늘: 중앙(cx,cy)에서 바로 뻗는 삼각형 ───
  const tip = pt(R - STROKE * 0.5 - 2, angleCW); // 바깥쪽 끝
  const baseCenter = { x: cx, y: cy }; // 밑변 중심 = 화면 정중앙
  const halfWidth = 7; // 밑변 반폭(굵기 조절)

  // 밑변의 좌·우 점(각도에 수직인 방향으로 오프셋)
  const rad = toRad(angleCW);
  const nx = -Math.sin(rad);
  const ny = Math.cos(rad);
  const b1 = {
    x: baseCenter.x + nx * halfWidth,
    y: baseCenter.y + ny * halfWidth,
  };
  const b2 = {
    x: baseCenter.x - nx * halfWidth,
    y: baseCenter.y - ny * halfWidth,
  };

  return (
    <div style={{ width: W, height: H, position: 'relative' }}>
      <svg width={W} height={H} style={{ display: 'block' }}>
        {/* 얇고 둥근 전체 링 */}
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke={RING_BG}
          strokeWidth={STROKE}
          strokeLinecap="round"
        />

        {/* 윗부분 초록 아크(끝 둥글게) */}
        <path
          d={arcPath(R, ARC_START, ARC_END)}
          fill="none"
          stroke={ARC_TOP}
          strokeWidth={STROKE}
          strokeLinecap="round"
        />

        {/* 바늘(센터에서 바로 뻗는 삼각형) */}
        <polygon
          points={`${b1.x},${b1.y} ${b2.x},${b2.y} ${tip.x},${tip.y}`}
          fill={NEEDLE}
          opacity={0.98}
        />

        {/* ⛔ 중앙 허브 원 삭제! (이 줄 없애는 게 포인트) */}
        {/* <circle cx={cx} cy={cy} r={6} fill="#fff" stroke={NEEDLE} strokeWidth={3} /> */}
      </svg>

      {/* 중앙 라벨(전/후) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: cy + 20,
          textAlign: 'center',
          fontWeight: 800,
          fontSize: 16,
        }}
      >
        {label}
      </div>

      {/* 눈금 텍스트(그대로 유지) */}
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 18,
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        33
      </div>
      <div
        style={{
          position: 'absolute',
          right: 18,
          top: 18,
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        150
      </div>
      <div
        style={{
          position: 'absolute',
          left: 12,
          bottom: 50,
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        19
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 22,
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;200
      </div>
    </div>
  );
}

/** 좌/우 쌍 게이지 (필요 시 사용) */
export default function HrvGauge({
  previous,
  current,
  min = 0,
  max = 200,
}: HrvGaugeProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
      <SingleGauge value={previous} min={min} max={max} label="전" />
      <SingleGauge value={current} min={min} max={max} label="후" />
    </div>
  );
}

/** 단일 게이지를 외부에서 직접 쓰는 버전(App.tsx에서 사용 중) */
export function HrvSingleGauge({
  value,
  min = 0,
  max = 200,
  label,
}: SingleGaugeProps) {
  return <SingleGauge value={value} min={min} max={max} label={label} />;
}
