import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type EmotionDonutProps = {
  dist: Record<string, number>;
};

const EMO_META: Record<
  string,
  { label: string; color: string; emoji: string }
> = {
  Neutral: { label: '중립', color: '#D9D9D9', emoji: '😐' },
  Happy: { label: '행복', color: '#22C55E', emoji: '😊' },
  Surprised: { label: '놀람', color: '#FACC15', emoji: '😮' },
  Sad: { label: '슬픔', color: '#60A5FA', emoji: '😟' },
  Angry: { label: '분노', color: '#EF4444', emoji: '😠' },
  Fearful: { label: '두려움', color: '#A78BFA', emoji: '😨' },
  Disgusted: { label: '혐오', color: '#10B981', emoji: '🤢' },
};

function toPercent(v: number) {
  if (!Number.isFinite(v)) return 0;
  return v <= 1 ? Math.round(v * 100) : Math.round(v);
}

export default function EmotionDonut({ dist }: EmotionDonutProps) {
  const entries = Object.entries(dist)
    .map(([k, v]) => [k, toPercent(v)] as const)
    .sort((a, b) => b[1] - a[1]);

  const top3 = entries.slice(0, 3);
  const [mainKey, mainPct] = top3[0] ?? ['Neutral', 0];
  const main = EMO_META[mainKey] ?? EMO_META.Neutral;

  const data = top3.map(([k, v]) => ({
    key: k,
    name: EMO_META[k]?.label ?? k,
    value: v,
    color: EMO_META[k]?.color ?? '#E5E7EB',
  }));

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        height: '100%',
      }}
    >
      {/* 도넛 그래프 */}
      <div style={{ flex: 2, position: 'relative', minWidth: 0, height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
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

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          <div style={{ fontSize: 40 }}>{main.emoji}</div>
          <div style={{ fontWeight: 800, fontSize: 16, marginTop: 4 }}>
            {main.label} {mainPct}%
          </div>
        </div>
      </div>

      {/* 오른쪽 레전드 */}
      <div style={{ flex: 1, minWidth: 80 }}>
        <div
          style={{
            fontWeight: 900,
            fontSize: 12,
            marginBottom: 8,
            color: '#0f172a',
          }}
        >
          주요 감정: {main.label}
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {top3.map(([k, v]) => {
            const meta = EMO_META[k];
            return (
              <li
                key={k}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  margin: '5px 0',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: meta.color,
                    display: 'inline-block',
                  }}
                />
                <span>{meta.label}</span>
                <span style={{ marginLeft: 'auto' }}>{v}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
