import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import RedLine from '../img/redline.png';
import BlueLine from '../img/blueline.png';

type Props = {
  previous: number[];
  current: number[];
  title?: string;
};

export default function RPPGChart({ previous, current }: Props) {
  const len = Math.max(previous.length, current.length) || 1;
  const tickCount = 6;
  const xTicks = Array.from({ length: tickCount }, (_, i) =>
    Math.round(1 + (i * (len - 1)) / (tickCount - 1))
  ).filter((v, i, a) => a.indexOf(v) === i);

  const data = Array.from({ length: len + 1 }, (_, i) => ({
    idx: i + 1,
    previous: previous[i] ?? null,
    current: current[i] ?? null,
  }));

  // RPPGChart.tsx (발췌)
  const LegendTop = () => (
    <div
      style={{
        display: 'flex',
        gap: 24,
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translateY(-8px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src={BlueLine} alt="직전" style={{ height: 10 }} />
        <span style={{ fontSize: 14, color: '#111' }}>직전</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src={RedLine} alt="현재" style={{ height: 10 }} />
        <span style={{ fontSize: 14, color: '#111' }}>현재</span>
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 600, // ✅ 숫자(px) 또는 '1200px'
        margin: '0 auto',
      }}
    >
      <ResponsiveContainer width="100%" height={360}>
        <LineChart
          data={data}
          margin={{ top: 12, right: 24, bottom: 8, left: 8 }}
        >
          <XAxis
            dataKey="idx"
            type="number"
            domain={[0, len]}
            ticks={xTicks}
            tick={{ fontSize: 12, fill: '#555' }}
            tickMargin={12}
            allowDecimals={false}
          />
          <YAxis
            domain={[0, 160]}
            ticks={[0, 40, 80, 120, 160]}
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#555' }}
            axisLine={{ stroke: '#999' }}
            tickLine={{ stroke: '#999' }}
          />
          <Tooltip />
          <Legend verticalAlign="top" align="center" content={<LegendTop />} />

          <Line
            type="linear"
            dataKey="previous"
            name="직전"
            stroke="#4285F4"
            dot={false}
            strokeWidth={2}
            connectNulls
          />
          <Line
            type="linear"
            dataKey="current"
            // name="현재"
            stroke="#EA4335"
            dot={false}
            strokeWidth={2}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>

      {/* 평균 */}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <div style={{ fontSize: 16, color: '#444' }}>평균</div>
        <div style={{ fontSize: 64, fontWeight: 700 }}>
          <span style={{ color: '#ff4b5c' }}>💖</span> 64{' '}
          <span style={{ fontSize: 28 }}>bpm</span>
        </div>
      </div>
    </div>
  );
}
