// import React from 'react';

type Row = {
  proposedEmotion: string;
  aiAnalysis: { emotion: string; previous: number; current: number };
};

export default function ReplicationSection({ rows }: { rows: Row[] }) {
  const EN2KO: Record<string, string> = {
    Sad: "슬픔 😥",
    Happy: "행복 😄",
    Fearful: "불안 😰",
    Neutral: "중립 😐",
    Angry: "분노 😡",
    Disgusted: "역겨움 😫",
    Surprised: "당황 😦",
  };

  const ORDER = [
    "슬픔 😥",
    "행복 😄",
    "불안 😰",
    "중립 😐",
    "분노 😡",
    "역겨움 😫",
    "당황 😦",
  ] as const;

  // 행을 7가지 감정 순서에 맞게 정리
  const byLabel: Record<string, Row | undefined> = {};
  rows.forEach((r) => {
    const key = EN2KO[r.proposedEmotion] ?? r.proposedEmotion;
    byLabel[key] = r;
  });

  const judge = (prev: number, curr: number) => {
    const ok = curr >= 0.6 && curr >= prev;
    return ok ? "자연스러움" : "개선 필요";
  };

  const fmt = (v: number) => `${Math.round(v * 100)}%`;

  return (
    <section className="panel no-border">
      <h2 className="sub-title hl">표정 지어보기</h2>

      <table className="rep-table">
        <thead>
          <tr>
            <th className="left-col">제시된 감정</th>
            <th>AI 표정 분석(이전 → 현재)</th>
            <th className="right-col">결과</th>
          </tr>
        </thead>
        <tbody>
          {ORDER.map((label) => {
            const r = byLabel[label];
            const aiKo = r
              ? EN2KO[r.aiAnalysis.emotion] ?? r.aiAnalysis.emotion
              : "-";
            const prev = r?.aiAnalysis.previous ?? 0;
            const curr = r?.aiAnalysis.current ?? 0;
            const result = judge(prev, curr);

            return (
              <tr key={label}>
                <td className="left-col">{label}</td>
                <td>
                  {aiKo} ({fmt(prev)} <span className="arrow">→</span>{" "}
                  <b className="blue">{fmt(curr)}</b>)
                </td>
                <td className="right-col">
                  <span className={result === "자연스러움" ? "ok" : "ng"}>
                    {result}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="empathy-caption" style={{ marginTop: 12 }}>
        국회의원은 그 지위를 남용하여 국가·공공단체 또는 기업체와의 계약이나 그
        처분에 의하여 재산상의 권리·이익 또는 직위를 취득하거나 타인을 위하여 그
        취득을 알선할 수 없다.
      </p>
    </section>
  );
}
