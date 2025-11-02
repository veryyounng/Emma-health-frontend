import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import RPPGChart from './components/RPPGChart';
import HrRangeChart from './components/HrRangeChart';
import HrLegendBox from './components/HrLegendBox';
import { HrvSingleGauge } from './components/HrvGauge';
import './App.css';
import HeartPng from './img/hrv 2.png';
import StressGauge from './components/StressGauge';
import PointerPng from './img/Polygon 5.png';
import EmotionDonut from './components/EmotionDonut';

/** 응답 타입 */
type RppgBlock = {
  hr: string;
  hrValues: number[];
  hrv: string;
  emotion: string;
  stress: string;
  emotionResult: Record<string, number>; // {우울:9, 행복:45, ...}
};
type Report = {
  previousRPPG: RppgBlock;
  currentRPPG: RppgBlock;
  depressionScore: { previous: number; current: number };
};

type HrStats = { min: number; avg: number; max: number };

function calcHrStats(series: number[] = []): HrStats {
  const arr = (series ?? []).filter((n) => Number.isFinite(n));
  if (arr.length === 0) return { min: 0, avg: 0, max: 0 };
  let min = Infinity,
    max = -Infinity,
    sum = 0;
  for (const v of arr) {
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }
  const avg = Math.round(sum / arr.length);
  return { min: Math.round(min), avg, max: Math.round(max) };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'basic' | 'detail'>('basic');

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

  const toNum = (s: string | number) =>
    Number(String(s).replace(/[^0-9.-]/g, '') || 0);

  const STRESS_MAP: Record<string, number> = {
    Low: 20,
    Medium: 50,
    High: 80,
  };

  const stressScore = useMemo(() => {
    if (!data) return 0;
    const raw = data.currentRPPG.stress;
    const num = Number(String(raw).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(num) && num > 0 ? num : STRESS_MAP[raw] ?? 0;
  }, [data]);

  const hrvNow = useMemo(
    () => (data ? toNum(data.currentRPPG.hrv) : 0),
    [data]
  );

  if (isLoading || isFetching) {
    return (
      <div className="wrap">
        <div className="container">
          <div className="page">
            {failureCount > 0
              ? `재시도 중 (${Math.min(failureCount, 3)}/3)… 로 딩 중..🫧`
              : '로 딩 중..🫧'}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    const msg = (error as any)?.message ?? '불러오기 실패';
    return (
      <div className="wrap">
        <div className="container">
          <div className="page">
            <div>불러오기 실패: {msg}</div>
            <button className="primary block" onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  const prevStats: HrStats = calcHrStats(data.previousRPPG.hrValues);
  const currStats: HrStats = calcHrStats(data.currentRPPG.hrValues);
  const yDomain: [number, number] = [0, 160];

  return (
    <div className="wrap">
      <div className="container">
        {/* 상단 탭 */}
        <nav className="tabs">
          <button
            className={`tab ${activeTab === 'basic' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            기본 결과
          </button>
          <button
            className={`tab ${activeTab === 'detail' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('detail')}
          >
            세부 결과
          </button>
        </nav>

        <main className="page">
          {/* 섹션: 심박수(차트 + 캡션) */}
          <section className="panel">
            <h2 className="sub-title">심박수</h2>
            <div className="panel-body">
              <div className="chart">
                <RPPGChart
                  previous={data.previousRPPG.hrValues}
                  current={data.currentRPPG.hrValues}
                />
              </div>
            </div>

            <div className="panel-inset">
              <h3 className="sub-title">심박수 변화</h3>
              심박수는 어쩌구어쩌구어쩌구
              <div
                className="mini-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(160px, 1fr) 1fr 1fr',
                  gap: 16,
                  alignItems: 'start',
                }}
              >
                <div
                  className="mini panel-lite2"
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    minHeight: 240,
                  }}
                >
                  <HrLegendBox />
                </div>

                <div className="mini panel-lite">
                  <HrRangeChart
                    stats={prevStats}
                    color="#4285F4"
                    title="직전"
                    domain={yDomain}
                    height={240}
                  />
                </div>
                <div className="mini panel-lite">
                  <HrRangeChart
                    stats={currStats}
                    color="#EA4335"
                    title="현재"
                    domain={yDomain}
                    height={240}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 섹션: 심박 변이도 */}

          <section className="panel">
            <h3 className="sub-title">심박 변이도</h3>
            <div className="hrv">
              {/* 🔹 왼쪽: 전 */}
              <div className="gauge">
                <HrvSingleGauge
                  value={toNum(data.previousRPPG.hrv)}
                  min={0}
                  max={200}
                  label="전"
                />
              </div>

              {/* 🔹 중앙: 하트 + 수치 + 설명 */}
              <div className="hrv-center">
                <div className="big-kv">
                  <span className="heart">
                    <img src={HeartPng} alt="heart" />
                  </span>
                  {hrvNow} <small>ms</small>
                </div>

                <p className="hrv-desc">
                  심박 변이도는 심장이 얼마나 유연하게 <br />
                  조절되는 지를 알려주는 지표에요. <br />
                  해당 값이 높을수록 건강한 상태를 의미해요.
                </p>
                <p className="hrv-desc2">
                  제공된 HRV 위험도는 참고용으로서, 정확한 진단은 반드시
                  의료기관에서 받으시기 바랍니다.
                </p>
              </div>

              {/* 🔹 오른쪽: 후 */}
              <div className="gauge">
                <HrvSingleGauge
                  value={toNum(data.currentRPPG.hrv)}
                  min={0}
                  max={200}
                  label="후"
                />
              </div>
            </div>
          </section>

          {/* 섹션: 스트레스 & 감정 */}
          <section className="grid-2">
            {/* 스트레스 */}
            <div className="panel">
              <h3 className="sub-title">스트레스</h3>
              <StressGauge
                score={stressScore}
                level={data.currentRPPG.stress}
                min={0}
                max={100}
                pointerSrc={PointerPng}
              />
            </div>

            {/* 감정 */}
            <div className="panel">
              <h3 className="sub-title">감정</h3>
              <EmotionDonut dist={data.currentRPPG.emotionResult} />
            </div>
          </section>

          {/* 섹션: 우울증 설문 결과 */}
          <section className="panel">
            <h3 className="sub-title">우울증 설문 결과</h3>
            <div className="grid-2">
              <div className="gauge placeholder">
                도넛({data.depressionScore.current}/27)
              </div>
              <div className="panel-body">
                <div className="result-row">
                  <span className="result-label">결과</span>
                  <span className="badge">주의</span>
                </div>
                <p className="caption2">
                  가벼운 수준의 우울감이 나타나고 있습니다. <br />
                  일시적인 감정 기복일 수 있으나, 증상이 악화되지 않도록
                  적극적인 관심과 관리가 필요합니다.
                  <br />
                  <br />
                  가족, 친구, 이웃 등 주변 사람과의 교류를 늘리고, 필요하다면
                  지역사회 상담기관이나 심리상담센터 등 전문 자원을 활용해
                  보세요.
                </p>
              </div>
            </div>
          </section>

          <button className="primary block">종료</button>
        </main>
      </div>
    </div>
  );
}
