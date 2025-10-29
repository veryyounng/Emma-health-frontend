import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type Props = {
  previous: number[];
  current: number[];
  title?: string;
};

export default function RPPGChart({
  previous,
  current,
  title = '심박수 (직전 vs 현재)',
}: Props) {
  const len = Math.max(previous.length, current.length);
  const data = Array.from({ length: len }, (_, i) => ({
    idx: i + 1,
    previous: previous[i] ?? null,
    current: current[i] ?? null,
  }));

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
      <div style={{ marginBottom: 8, color: '#6b7280', fontSize: 14 }}>
        {title}
      </div>
      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="idx" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* 현재/이전 두 시리즈 겹쳐보기 */}
            <Line
              type="monotone"
              dataKey="current"
              name="현재"
              stroke="#eb2525ff"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="previous"
              name="직전"
              stroke="#2153e7ff"
              strokeDasharray="4 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
