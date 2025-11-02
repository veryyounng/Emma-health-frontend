type StressGaugeProps = {
  score: number;
  level?: string;     // ← "Low" / "Medium" / "High" 같이 텍스트 표시용
  min?: number;
  max?: number;
  pointerSrc: string;
};

export default function StressGauge({
  score,
  level = "",
  min = 0,
  max = 100,
  pointerSrc,
}: StressGaugeProps) {
  const clamped = Math.max(min, Math.min(score, max));
  const pct = ((clamped - min) / (max - min)) * 100;
  const SAFE = 2;
  const left = Math.max(SAFE, Math.min(pct, 100 - SAFE));

  return (
    <div className="stressbar" style={{ position: "relative" }}>
      <div className="bar" data-min={min} data-max={max}>
        <img
          className="pointer-img"
          src={pointerSrc}
          alt="pointer"
          style={{ left: `${left}%` }}
          draggable={false}
        />

        {/* ✅ 중앙 텍스트를 “Medium” 같은 스트레스 레벨로 표시 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
            textShadow: "0 1px 3px rgba(0,0,0,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          {level}
        </div>
      </div>

      <p className="caption" style={{ marginTop: 12 }}>
        스트레스 수치가 낮아요. <br />
        가끔 스트레스를 경험하긴 하지만 <br />
        충분히 관리할 수 있는 상태에요!
      </p>
    </div>
  );
}
