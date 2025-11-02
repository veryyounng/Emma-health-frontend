// src/components/DetailedResult.tsx
import EmpathyTable from './EmpathyTable';
import MimicTable from './MimicTable';
import RecognitionSection from './RecognitionSection';
import ReplicationSection from './ReplicationSection';

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
  mimic?: {
    matchScores: Array<{ emotion: string; before: number; after: number }>;
  };
  recognition?: {
    recognitionRows: Array<{ proposedEmotion: string; myEmotion: string }>;
    accuracyBefore: number;
    accuracyAfter: number;
    responseTime: number;
  };
  replication?: {
    replicationRows: Array<{
      proposedEmotion: string;
      aiAnalysis: { emotion: string; previous: number; current: number };
    }>;
  };
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
      {/* ✅ 표정 따라하기 */}
      <section className="panel no-border">
        <h2 className="sub-title hl">표정 따라하기</h2>
        <MimicTable matchScores={detailed.mimic?.matchScores} />
        <p className="empathy-caption" style={{ marginTop: 12 }}>
          국회의원은 그 지위를 남용하여 국가·공공단체 또는 기업체와의 계약이나
          그 처분에 의하여 재산상의 권리·이익 또는 직위를 취득하거나 타인을
          위하여 그 취득을 알선할 수 없다.
        </p>
      </section>

      {/* ✅ 표정 인지하기 */}
      {detailed.recognition && (
        <RecognitionSection
          rows={detailed.recognition.recognitionRows}
          accuracyBefore={detailed.recognition.accuracyBefore}
          accuracyAfter={detailed.recognition.accuracyAfter}
          responseTime={detailed.recognition.responseTime}
        />
      )}

      {detailed.replication && (
        <ReplicationSection rows={detailed.replication.replicationRows} />
      )}

      <button className="primary block" style={{ marginTop: 24 }}>
        종료
      </button>
    </main>
  );
}
