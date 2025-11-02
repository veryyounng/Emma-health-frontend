// src/components/EmpathyTable.tsx
// import React from 'react';

type BeforeAfter = { before: number; after: number };
type EmpathyRow = {
  aiAnalysis: { emotion: string; percentage: number };
  myEmotion: string;
};

type Props = {
  // detailed에서 오던 값 – 일부만 있어도 OK
  emotionRows?: EmpathyRow[];
  empathyScores?: BeforeAfter[];
  // 현재 세션의 대표 감정(한글). 없으면 '행복'으로 처리
  currentKoreanEmotion?: string;
};

const EN2KO: Record<string, string> = {
  Sad: '슬픔 😢',
  Happy: '행복 😊',
  Fearful: '불안 😨',
  Neutral: '중립 😐',
  Angry: '분노 😡',
  Disgusted: '역겨움 😫',
  Surprised: '당황 😮',
};

const ALL_LABELS = [
  '슬픔 😢',
  '행복 😊',
  '불안 😨',
  '중립 😐',
  '분노 😡',
  '역겨움 😫',
  '당황 😮',
] as const;

export default function EmpathyTable({
  emotionRows = [],
  empathyScores = [],
  currentKoreanEmotion = '행복',
}: Props) {
  // 1) AI 분석 퍼센트(없으면 0%로)
  const aiPercentByKo: Record<string, number> = {};
  for (const r of emotionRows) {
    const ko = EN2KO[r.aiAnalysis.emotion] || r.aiAnalysis.emotion;
    aiPercentByKo[ko] = Math.round((r.aiAnalysis.percentage ?? 0) * 100);
  }
  // 없음/빈 값 기본치(디자인 샘플 62%)  → 원하는 기본값으로 바꿔도 됨
  const DEFAULT_PERCENT = 62;

  // 2) 점수(이전 → 현재): detailed 샘플에만 2개가 있으므로
  //    0번(슬픔), 1번(행복)만 매핑, 나머지는 0번을 기본으로 사용
  const scoreFor = (label: string): BeforeAfter => {
    if (label === '행복' && empathyScores[1]) return empathyScores[1];
    if (label === '슬픔' && empathyScores[0]) return empathyScores[0];
    return empathyScores[0] ?? { before: 20, after: 42 };
  };

  return (
    <div className="empathy-wrap">
      <table className="empathy-table">
        <thead>
          <tr>
            <th className="g-left">제시된 감정</th>
            <th className="g-mid">AI 표정 분석</th>
            <th className="g-mid">나의 감정</th>
            <th className="g-mid">일치 여부</th>
            <th className="g-right">공감도(이전→현재)</th>
          </tr>
        </thead>

        <tbody>
          {ALL_LABELS.map((label) => {
            const aiPct = aiPercentByKo[label] ?? DEFAULT_PERCENT;
            const myEmotion = currentKoreanEmotion;
            const isMatch = label === currentKoreanEmotion;
            const { before, after } = scoreFor(label);

            return (
              <tr key={label}>
                <td className="g-left">
                  <span className="emo">{label}</span>
                </td>
                <td className="g-mid">{`${label}(${aiPct}%)`}</td>
                <td className="g-mid">{myEmotion}</td>
                <td className={`g-mid ${isMatch ? 'ok' : 'no'}`}>
                  {isMatch ? '일치' : '불일치'}
                </td>
                <td className="g-right">
                  <b>{before}점</b>&nbsp;→&nbsp;<b>{after}점</b>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 하단 안내문(그림처럼) */}
      <p className="empathy-caption">
        국회의원은 그 지위를 남용하여 국가·공공단체 또는 기업체와의 계약이나 그
        처분에 의하여 재산상의 권리·이익 또는 직위를 취득하거나 타인을 위하여 그
        취득을 알선할 수 없다. 대통령의 임기는 5년으로 하며, 중임할 수 없다.
        공무원은 국민전체에 대한 봉사자이며, 국민에 대하여 책임을 진다. 대통령은
        내우·외환·천재·지변 또는 중대한 재정·경제상의 위기에 있어서
      </p>
    </div>
  );
}
