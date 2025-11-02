// src/components/DetailedResult.tsx
import React from 'react';
import EmpathyTable from './EmpathyTable';

export type BeforeAfter = { before: number; after: number };
export type EmpathyRow = {
  aiAnalysis: { emotion: string; percentage: number };
  myEmotion: string;
};

export type Detailed = {
  empathy: {
    emotionRows: EmpathyRow[];
    empathyScores: BeforeAfter[];
  };
  // ... (다음 섹션은 추후 확장)
};

type Props = {
  detailed: Detailed;
  currentEmotionKo?: string; // 현재 대표 감정(한글) – App에서 내려줌
};

export default function DetailedResult({
  detailed,
  currentEmotionKo = '행복',
}: Props) {
  return (
    <main className="page">
      <section className="panel no-border">
        <h2 className="sub-title hl">표정 공감하기</h2>
        <EmpathyTable
          emotionRows={detailed.empathy.emotionRows}
          empathyScores={detailed.empathy.empathyScores}
          currentKoreanEmotion={currentEmotionKo}
        />
      </section>

      {/* (다음 섹션: 표정 따라하기 / 인지하기 / 지어보기 – 이후 단계에서 추가) */}

      <button className="primary block" style={{ marginTop: 24 }}>
        종료
      </button>
    </main>
  );
}
