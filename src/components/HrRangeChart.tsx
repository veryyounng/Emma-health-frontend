// src/components/HrRangeChart.tsx
import {
  ResponsiveContainer,
  LineChart,
  YAxis,
  XAxis,
  Line,
  Scatter,
  LabelList,
} from "recharts";

// App에서 계산해 내려주는 타입(동일하게 유지)
export type HrStats = { min: number; avg: number; max: number };

type Props = {
  stats: HrStats;
  color: string;
  title: string;
  domain?: [number, number];
  height?: number;
};

// LabelList 타입 충돌 회피를 위한 커스텀 라벨 렌더러
function ValueLabel(props: any) {
  const { x, y, value } = props;
  // x,y가 undefined일 수 있어 기본값 처리
  const xx = (x ?? 0) + 6;
  const yy = (y ?? 0) + 4;
  return (
    <text x={xx} y={yy} fontSize={14} fontWeight={700} fill={props.fill}>
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

  // x=1 위치에 세로선(최소~최대) + 점 3개
  const rangeData = [
    { x: 1, v: min },
    { x: 1, v: max },
  ];
  const points = [
    { x: 1, v: max },
    { x: 1, v: avg },
    { x: 1, v: min },
  ];

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={rangeData}
          margin={{ top: 8, right: 28, bottom: 32, left: 8 }}
        >
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 2]}
            tick={false}
            axisLine={{ stroke: "#d6d6d6" }}
          />
          <YAxis
            type="number"
            domain={[60, 100]}
            ticks={[60, 70, 80, 90, 100]}
            tick={{ fontSize: 12, fill: "#757575" }}
          />

          {/* 세로 범위선 */}
          <Line
            type="linear"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />

          {/* 점 3개 + 값 라벨 (커스텀 렌더러 사용) */}
          <Scatter data={points} fill={color} isAnimationActive={false}>
            <LabelList dataKey="v" position="right" content={<ValueLabel />} />
          </Scatter>
        </LineChart>
      </ResponsiveContainer>

      {/* 하단 타이틀 */}
      <div style={{ textAlign: "center", marginTop: 6, fontWeight: 800 }}>
        {title}
      </div>
    </div>
  );
}
