import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type DepressionDonutProps = {
  score: number;
  max: number;
};

export default function DepressionDonut({ score, max }: DepressionDonutProps) {
  const pct = Math.min(score / max, 1);
  const data = [
    { name: 'score', value: score, color: '#FACC15' }, // 노란색
    { name: 'rest', value: max - score, color: '#E5E7EB' }, // 회색
  ];

  return (
    <div style={{ position: 'relative', width: 220, height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius="65%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* 중앙 이모지 + 점수 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        <div style={{ fontSize: 48 }}>😢</div>
        <div style={{ fontWeight: 800, fontSize: 20 }}>
          {score}/{max}
        </div>
      </div>
    </div>
  );
}
