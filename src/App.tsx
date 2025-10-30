import { useEffect } from 'react';
import axios from 'axios';
import RPPGChart from './components/RPPGChart';
import './App.css';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

/** 응답 타입 */
type RppgBlock = {
  hr: string;
  hrValues: number[];
  hrv: string;
  emotion: string;
  stress: string;
  emotionResult: Record<string, number>;
};
type Report = {
  previousRPPG: RppgBlock;
  currentRPPG: RppgBlock;
  depressionScore: { previous: number; current: number };
};

export default function App() {
  const { data, isLoading, isFetching, isError, error, refetch, failureCount } =
    useQuery<Report, Error>({
      queryKey: ['report'],
      queryFn: async () => {
        const res = await axios.get<Report>(
          '/api/pre-assignment/session-result-report',
          { timeout: 8000 }
        );
        return res.data;
      },
      retry: 3,
    });

  useEffect(() => {
    if (isError) toast.error('데이터를 불러오지 못했습니다.');
  }, [isError]);

  // 로딩 & 자동 재시도 중
  if (isLoading || isFetching) {
    return (
      <div className="viewport">
        <div className="phone">
          <div className="page">
            {failureCount > 0
              ? `재시도 중 (${Math.min(failureCount, 3)}/3)… 로 딩 중..🫧`
              : '로 딩 중..🫧'}
          </div>
        </div>
      </div>
    );
  }

  // 에러 or 데이터 없음
  if (isError || !data) {
    const msg = (error as any)?.message ?? '불러오기 실패';
    return (
      <div className="viewport">
        <div className="phone">
          <div className="page">
            <div>불러오기 실패: {msg}</div>
            <button className="btn" onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 정상 렌더링
  return (
    <div className="viewport">
      <div className="phone">
        {/* 상단 탭(디자인만) */}
        <div className="tabs">
          <button className="tab tab-active">기본 결과</button>
          <button className="tab">세부 결과</button>
        </div>

        <div className="page">
          <h1 className="title">심박수</h1>

          <div className="panel">
            <RPPGChart
              previous={data.previousRPPG.hrValues}
              current={data.currentRPPG.hrValues}
            />
          </div>

          <div className="cards">
            <Card
              label="심박수(HR)"
              now={data.currentRPPG.hr}
              prev={data.previousRPPG.hr}
              unit="bpm"
            />
            <Card
              label="심박 변이도(HRV)"
              now={data.currentRPPG.hrv}
              prev={data.previousRPPG.hrv}
              unit="ms"
            />
          </div>
        </div>

        {/* 하단 고정 버튼 */}
        <div className="footer">
          <button className="primary">종료</button>
        </div>
      </div>
    </div>
  );
}

function Card({
  label,
  now,
  prev,
  unit,
}: {
  label: string;
  now: string;
  prev: string;
  unit: string;
}) {
  const toNum = (s: string) => Number(String(s).replace(/[^0-9.-]/g, ''));
  const delta = toNum(now) - toNum(prev);
  const sign = delta > 0 ? '+' : '';
  return (
    <div className="card">
      <div className="card-label">{label}</div>
      <div className="card-now">{now}</div>
      <div className="card-sub">
        직전 {prev} / Δ {sign}
        {Math.round(delta)} {unit}
      </div>
    </div>
  );
}
