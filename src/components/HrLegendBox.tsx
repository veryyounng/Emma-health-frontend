export default function HrLegendBox() {
  return (
    <div
      style={{
        border: "1px solid #5d5656ff",
        borderRadius: 12,
        padding: 16,
        width: 140,
        height: 186,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative", width: 100, height: 126, left: -30 }}>
        {/* 세로 화살표 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 8,
            bottom: 8,
            borderLeft: "2px solid #111",
            transform: "translateX(-50%)",
          }}
        />

        {/* 점 3개 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: "translate(-50%, -50%)",
            fontSize: 10,
          }}
        >
          ●
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 10,
          }}
        >
          ●
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 10,
            transform: "translate(-50%, 50%)",
            fontSize: 10,
          }}
        >
          ●
        </div>

        {/* 라벨 (오른쪽으로 이동) */}
        <div
          style={{
            position: "absolute",
            left: "60%",
            top: 8,
            transform: "translateY(-50%)",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          최대값
        </div>
        <div
          style={{
            position: "absolute",
            left: "60%",
            top: "50%",
            transform: "translateY(-50%)",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          평균
        </div>
        <div
          style={{
            position: "absolute",
            left: "60%",
            bottom: 8,
            transform: "translateY(50%)",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          최소값
        </div>
      </div>
    </div>
  );
}
