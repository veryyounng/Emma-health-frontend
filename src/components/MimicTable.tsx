// import React from 'react';

type MatchScore = { emotion: string; before: number; after: number };

type Props = {
  matchScores?: MatchScore[]; // detailed.mimic?.matchScores
};

const EN2KO: Record<string, string> = {
  Sad: "슬픔 😥",
  Happy: "행복 😄",
  Fearful: "불안 😰",
  Neutral: "중립 😐",
  Angry: "분노 😡",
  Disgusted: "역겨움 😫",
  Surprised: "당황 😦",
};
const ALL_LABELS = [
  "슬픔 😥",
  "행복 😄",
  "불안 😰",
  "중립 😐",
  "분노 😡",
  "역겨움 😫",
  "당황 😦",
] as const;

export default function MimicTable({ matchScores = [] }: Props) {
  // matchScores → 한글 키로 맵핑
  const scoreByKo: Record<string, { before: number; after: number }> = {};
  for (const m of matchScores) {
    const ko = EN2KO[m.emotion] ?? m.emotion;
    scoreByKo[ko] = { before: m.before, after: m.after };
  }
  // 기본치(데이터 없을 때)
  const fallback = { before: 50, after: 50 };

  const trendClass = (b: number, a: number) =>
    a > b ? "up" : a < b ? "down" : "flat";

  return (
    <div className="mimic-grid">
      {/* 좌측 감정 리스트 카드 */}
      <div className="mimic-card left">
        <div className="mimic-card-head">제시된 감정</div>
        <ul className="mimic-emolist">
          {ALL_LABELS.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </div>

      {/* 우측 일치율 표 */}
      <div className="mimic-card right">
        <div className="mimic-card-head">표정 일치율(이전→현재)</div>
        <table className="mimic-table">
          <tbody>
            {ALL_LABELS.map((label) => {
              const s = scoreByKo[label] ?? fallback;
              return (
                <tr key={label}>
                  <td className="old">{s.before}%</td>
                  <td className={`arrow ${trendClass(s.before, s.after)}`}>
                    →
                  </td>
                  <td className={`new ${trendClass(s.before, s.after)}`}>
                    {s.after}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
