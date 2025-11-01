import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import RedLine from "../img/redline.png";
import BlueLine from "../img/blueline.png";

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

  const nums = [...previous, ...current];
  const avg =
    nums.length > 0
      ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
      : 64;

  const chartMargin = { top: 12, right: 24, bottom: 8, left: 8 };

  function LegendTop() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={BlueLine}
            alt="직전"
            style={{ width: 50, height: 6, borderRadius: 999 }}
          />
          <span style={{ fontSize: 14, color: "#111", fontWeight: 700 }}>
            직전
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={RedLine}
            alt="현재"
            style={{ width: 50, height: 6, borderRadius: 999 }}
          />
          <span style={{ fontSize: 14, color: "#111", fontWeight: 700 }}>
            현재
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        fontWeight: 700,
      }}
    >
      {/* 범례 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 8,
          alignItems: "center",
        }}
      >
        <LegendTop />
      </div>

      {/* 차트 + 중앙 오버레이 */}
      <div style={{ position: "relative", width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={chartMargin}>
            <XAxis
              dataKey="idx"
              type="number"
              domain={[0, len]}
              ticks={xTicks}
              tick={{ fontSize: 12, fill: "#252323ff" }}
              tickMargin={12}
              allowDecimals={false}
            />
            <YAxis
              domain={[0, 160]}
              ticks={[0, 40, 80, 120, 160]}
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#252323ff" }}
              axisLine={{ stroke: "#252323ff" }}
              tickLine={{ stroke: "#252323ff" }}
            />
            <Tooltip />
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
              stroke="#EA4335"
              dot={false}
              strokeWidth={2}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>

        {/* 그래프 안 중앙 평균 */}
        <div
          style={{
            position: "absolute",
            top: chartMargin.top,
            right: chartMargin.right,
            bottom: chartMargin.bottom,
            left: chartMargin.left,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "58%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700 }}>평균</div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 55 }}>💖</span>
              <span style={{ fontSize: 64, fontWeight: 800 }}>{avg}</span>
              <span style={{ fontSize: 28, fontWeight: 700 }}>bpm</span>
            </div>
          </div>
        </div>
      </div>

      {/* 설명 캡션 */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <p className="caption">
          심박수는 1분 동안 심장이 뛰는 횟수를 의미해요. <br />
          일반적으로 성인은 60-100 BPM이 정상 범위에요. <br />
          심박수가 너무 높거나 낮으면 <br />
          건강 문제의 신호일 수 있어 주의가 필요해요.
        </p>
      </div>
    </div>
  );
}
