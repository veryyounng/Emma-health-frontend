// import { useEffect, useState } from "react";
import axios from 'axios';
import RPPGChart from './components/RPPGChart';
import './App.css';
import { useQuery } from '@tanstack/react-query';

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
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    failureCount, // 재시도 진행 상황
  } = useQuery({
    queryKey: ['report'],
    queryFn: async () => {
      const res = await axios.get<Report>(
        '/api/pre-assignment/session-result-report',
        { timeout: 8000 }
      );
      return res.data;
    },
  });

  // 로딩 & 자동 재시도 중 메시지
  if (isLoading || isFetching) {
    return (
      <div className="page">
        {failureCount > 0
          ? `재시도 중 (${Math.min(failureCount, 3)}/3)… 잠시만요`
          : '로딩중…'}
      </div>
    );
  }

  // 최종 실패 시 (4xx 등) — Boundary가 처리하지 않은 에러 + 데이터 없음
  if (isError || !data) {
    const msg = (error as any)?.message ?? '불러오기 실패';
    return (
      <div className="page">
        <div>불러오기 실패: {msg}</div>
        <button className="btn" onClick={() => refetch()}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="title">심박수</h1>

      <RPPGChart
        previous={data.previousRPPG.hrValues}
        current={data.currentRPPG.hrValues}
      />

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
