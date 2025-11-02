// EmpathyTable.tsx
type BeforeAfter = { before: number; after: number };
type EmpathyRow = {
  aiAnalysis: { emotion: string; percentage: number };
  myEmotion: string;
};

type Props = {
  emotionRows?: EmpathyRow[];
  empathyScores?: BeforeAfter[];
  currentKoreanEmotion?: string;
};

const EN2KO: Record<string, string> = {
  Sad: "슬픔 😢",
  Happy: "행복 😊",
  Fearful: "불안 😨",
  Neutral: "중립 😐",
  Angry: "분노 😡",
  Disgusted: "역겨움 😫",
  Surprised: "당황 😮",
};

const ALL_LABELS = [
  "슬픔 😢",
  "행복 😊",
  "불안 😨",
  "중립 😐",
  "분노 😡",
  "역겨움 😫",
  "당황 😮",
] as const;

export default function EmpathyTable({
  emotionRows = [],
  empathyScores = [],
  currentKoreanEmotion = "행복",
}: Props) {
  // 1) AI 분석 퍼센트
  const aiPercentByKo: Record<string, number> = {};
  for (const r of emotionRows) {
    const ko = EN2KO[r.aiAnalysis.emotion] || r.aiAnalysis.emotion;
    aiPercentByKo[ko] = Math.round((r.aiAnalysis.percentage ?? 0) * 100);
  }
  const DEFAULT_PERCENT = 62;

  // 2) 점수 매핑
  const scoreFor = (label: string): BeforeAfter => {
    if (label.startsWith("행복") && empathyScores[1]) return empathyScores[1];
    if (label.startsWith("슬픔") && empathyScores[0]) return empathyScores[0];
    return empathyScores[0] ?? { before: 20, after: 42 };
  };

  return (
    <div className="empathy-wrap">
      <table className="empathy-table">
        <thead>
          <tr>
            <th className="g-left">제시된 감정</th>

            {/* 가운데 3개는 한 그룹 */}
            <th className="g-mid g-mid-head g-mid-head--left">AI 표정 분석</th>
            <th className="g-mid g-mid-head">나의 감정</th>
            <th className="g-mid g-mid-head g-mid-head--right">일치 여부</th>

            <th className="g-right">공감도(이전→현재)</th>
          </tr>
        </thead>

        <tbody>
          {ALL_LABELS.map((label, idx, arr) => {
            const aiPct = aiPercentByKo[label] ?? DEFAULT_PERCENT;
            const myEmotion = currentKoreanEmotion;
            const isMatch = label.startsWith(currentKoreanEmotion);
            const { before, after } = scoreFor(label);

            // 첫 행/마지막 행 플래그 (칼럼 박스 라운드용)
            const first = idx === 0;
            const last = idx === arr.length - 1;

            return (
              <tr key={label}>
                {/* 좌측 그룹(배경 + 라운드) */}
                <td
                  className={["g-left", first && "is-top", last && "is-bottom"]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="emo">{label}</span>
                </td>

                {/* 가운데 3칸 */}
                <td className="g-mid">{`${label}(${aiPct}%)`}</td>
                <td className="g-mid">{myEmotion}</td>
                <td className={`g-mid ${isMatch ? "ok" : "no"}`}>
                  {isMatch ? "일치" : "불일치"}
                </td>

                {/* 우측 그룹(배경 + 라운드) & 점수 색상 */}
                <td
                  className={[
                    "g-right",
                    isMatch ? "match" : "mismatch",
                    first && "is-top",
                    last && "is-bottom",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <b className="score-num">{before}점</b>
                  <span className="arrow">&nbsp;→&nbsp;</span>
                  <b className="score-num">{after}점</b>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="empathy-caption">
        국회의원은 그 지위를 남용하여 국가·공공단체 또는 기업체와의 계약이나 그
        처분에 의하여 재산상의 권리·이익 또는 직위를 취득하거나 타인을 위하여 그
        취득을 알선할 수 없다. 대통령의 임기는 5년으로 하며, 중임할 수 없다.
      </p>
    </div>
  );
}
