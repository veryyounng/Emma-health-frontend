// src/components/HrRangeChart.tsx
import {
  ResponsiveContainer,
  LineChart,
  YAxis,
  XAxis,
  Scatter,
  LabelList,
  ReferenceLine,
} from "recharts";

export type HrStats = { min: number; avg: number; max: number };

type Props = {
  stats: HrStats;
  color: string;
  title: string;
  domain?: [number, number];
  height?: number;
};

// ✅ 검은 점(●) 없애고, 숫자만 그래프 컬러로 렌더
function ValueLabel(props: any & { color: string }) {
  const { x, y, value, color } = props;
  const xx = x ?? 0;
  const yy = y ?? 0;
  return (
    <text
      x={xx + 10}              // 점 오른쪽 간격
      y={yy}
      fontSize={14}
      fontWeight={700}
      fill={color}             // 숫자 색 = 그래프 색
      textAnchor="start"
      dominantBaseline="middle"
    >
      {value}
    </text>
  );
}

export default function HrRangeChart({
  stats,
  color,
  title,
  domain = [0, 160],
  height = 220,
}: Props) {
  const { min, avg, max } = stats;

  const points = [
    { x: 1, v: max },
    { x: 1, v: avg },
    { x: 1, v: min },
  ];


  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 28, bottom: 32, left: 8 }}>
          <XAxis type="number" dataKey="x" domain={[0, 2]} tick={false} axisLine={{ stroke: "#d6d6d6" }} />
          <YAxis
            type="number"
            dataKey="v"               // ← 중요: Scatter y값 키
            domain={domain}
            ticks={[0, 40, 80, 120, 160]}
            tick={{ fontSize: 12, fill: "#757575" }}
          />

          {/* 세로 레인지 라인 */}
          <ReferenceLine
            segment={[
              { x: 1, y: min },
              { x: 1, y: max },
            ]}
            stroke={color}
            strokeWidth={2}
          />

          {/* 점: 그래프 색으로 통일 (윤곽선도 동일 색으로) */}
          <Scatter data={points} fill={color} stroke={color} isAnimationActive={false}>
            {/* 숫자 라벨: 그래프 색 적용, 검은 점 제거 */}
            <LabelList dataKey="v" content={(p) => <ValueLabel {...p} color={color} />} />
          </Scatter>
        </LineChart>
      </ResponsiveContainer>

      <div style={{ textAlign: "center", marginTop: 6, fontWeight: 800 }}>
        {title}
      </div>
    </div>
  );
}
