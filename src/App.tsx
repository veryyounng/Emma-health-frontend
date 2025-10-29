import { useEffect, useState } from 'react';
import axios from 'axios';
import RPPGChart from './components/RPPGChart';
import './App.css';

/** 응답 타입(필요한 부분만 최소 정의) */
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
  const [data, setData] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 프록시를 쓰면 '/api/...' 로 호출 (아래 4) 참고)
        const res = await axios.get(
          '/api/pre-assignment/session-result-report'
        );

        setData(res.data);
      } catch (e: any) {
        setError(e?.message ?? 'failed to fetch');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="page">로딩중…</div>;
  if (error || !data) return <div className="page">불러오기 실패: {error}</div>;

  return (
    <div className="page">
      <h1 className="title">심박수</h1>

      {/* 1) 심박수 그래프 (이전 vs 현재) */}
      <RPPGChart
        previous={data.previousRPPG.hrValues}
        current={data.currentRPPG.hrValues}
      />

      {/* 2) 간단 비교 카드 예시 (원하면 이후 상세 카드 추가) */}
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
  );
}

/** 간단 카드 */
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
  const toNum = (s: string) => Number(String(s).replace(/[^0-9.\-]/g, ''));
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
