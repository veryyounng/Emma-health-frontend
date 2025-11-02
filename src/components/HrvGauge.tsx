import { PieChart, Pie, Cell } from "recharts";

type SingleGaugeProps = {
  value: number;            // HRV 값 (예: 74)
  min?: number;             // 기본 0
  max?: number;             // 기본 200
  label: string;            // "전" | "후"
};

type HrvGaugeProps = {
  previous: number;
  current: number;
  min?: number;
  max?: number;
};

/** 화면 규격(스샷 비율 맞춤) */
const W = 180;
const H = 180;              // 정원형
const cx = W / 2;
const cy = H / 2;
const innerR = 54;
const outerR = 74;

/** 색상 (스샷 톤) */
const RING_BG = "#F6EEE6";  // 전체 베이지
const ARC_TOP = "#22C55E";  // 초록 아크
const NEEDLE = "#EF4444";

/** 초록 아크가 놓일 각도 범위(시계방향 도 기준) — '윗부분만' */
const ARC_START = 210;      // 210°(좌상단 근처)
const ARC_END = -30;        // -30°(우상단 근처) => 윗부분을 가로지르는 아크

/** 값 → 아크 각도(시계방향 도) 매핑 */
function valueToArcAngleCW(value: number, min: number, max: number) {
  const v = Math.max(min, Math.min(value, max));
  const t = (v - min) / (max - min); // 0~1
  return ARC_START + t * (ARC_END - ARC_START); // 시계방향 도
}

/** 극좌표 → 화면 좌표 (우리 각도는 '시계방향' 도. SVG는 y가 아래로 증가) */
function xyOnCircle(cx: number, cy: number, r: number, angleCW: number) {
  // 시계방향 도 -> 수학적 CCW 라디안으로 뒤집어서 계산
  const rad = (-angleCW * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** 개별 게이지 (정원형 + 상단 초록 아크 + 바늘) */
function SingleGauge({ value, min = 0, max = 200, label }: SingleGaugeProps) {
  // 바늘 좌표
  const angleCW = valueToArcAngleCW(value, min, max);
  const tip = xyOnCircle(cx, cy, outerR - 8, angleCW);

  // 원형 전체 배경 도넛 / 상단 초록 아크는 각을 지정해 그리기
  const ONE = [{ name: "one", value: 100 }];

  return (
    <div style={{ width: W, height: H, position: "relative" }}>
      <PieChart width={W} height={H}>
        {/* 1) 전체 베이지 링(360°) */}
        <Pie
          data={ONE}
          startAngle={360}
          endAngle={0}
          innerRadius={innerR}
          outerRadius={outerR}
          dataKey="value"
          isAnimationActive={false}
          stroke="none"
          cx={cx}
          cy={cy}
        >
          <Cell fill={RING_BG} />
        </Pie>

        {/* 2) 윗부분 초록 아크 */}
        <Pie
          data={ONE}
          startAngle={ARC_START}
          endAngle={ARC_END}
          innerRadius={innerR}
          outerRadius={outerR}
          dataKey="value"
          isAnimationActive={false}
          stroke="none"
          cx={cx}
          cy={cy}
        >
          <Cell fill={ARC_TOP} />
        </Pie>
      </PieChart>

      {/* 3) 바늘 */}
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* 바늘줄 */}
        <line
          x1={cx}
          y1={cy}
          x2={tip.x}
          y2={tip.y}
          stroke={NEEDLE}
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* 바늘 허브 */}
        <circle cx={cx} cy={cy} r={6} fill="#fff" stroke={NEEDLE} strokeWidth={3} />
      </svg>

      {/* 중앙 라벨(전/후) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: cy + 20,
          textAlign: "center",
          fontWeight: 800,
          fontSize: 16,
        }}
      >
        {label}
      </div>

      {/* ─ Numbers (배치는 스샷 위치로 근사) ─ */}
      {/* 상단 좌 33 */}
      <div style={{ position: "absolute", left: 18, top: 18, fontSize: 13, fontWeight: 800 }}>
        33
      </div>
      {/* 상단 우 150 */}
      <div style={{ position: "absolute", right: 18, top: 18, fontSize: 13, fontWeight: 800 }}>
        150
      </div>
      {/* 좌측 하 19 */}
      <div style={{ position: "absolute", left: 12, bottom: 50, fontSize: 13, fontWeight: 800 }}>
        19
      </div>
      {/* 하단 중앙 0   200 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 22,
          textAlign: "center",
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
export default function HrvGauge({ previous, current, min = 0, max = 200 }: HrvGaugeProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
      <SingleGauge value={previous} min={min} max={max} label="전" />
      <SingleGauge value={current} min={min} max={max} label="후" />
    </div>
  );
}

/** 단일 게이지를 외부에서 직접 쓰는 버전(App.tsx에서 사용 중) */
export function HrvSingleGauge({ value, min = 0, max = 200, label }: SingleGaugeProps) {
  return <SingleGauge value={value} min={min} max={max} label={label} />;
}
