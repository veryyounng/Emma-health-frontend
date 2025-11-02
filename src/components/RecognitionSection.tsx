// import React from 'react';

type Row = { proposedEmotion: string; myEmotion: string };

export type RecognitionProps = {
  rows: Row[];
  accuracyBefore: number; // 0~100
  accuracyAfter: number; // 0~100
  responseTime: number; // ms
};

/** 영→한 매핑 */
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

/** 반응 속도 등급 */
function speedLabel(ms: number) {
  if (ms < 200) return "매우 빠름";
  if (ms < 300) return "약간 빠름";
  if (ms < 500) return "보통";
  if (ms < 700) return "약간 느림";
  return "느림";
}

/** 100~1000ms -> 0~180deg 매핑 */
function msToDeg(ms: number) {
  const min = 100,
    max = 1000;
  const clamped = Math.min(max, Math.max(min, ms));
  const t = (clamped - min) / (max - min); // 0~1
  return 180 * t;
}

export default function RecognitionSection({
  rows,
  accuracyBefore,
  accuracyAfter,
  responseTime,
}: RecognitionProps) {
  // 행을 7가지 감정 순으로 정렬해서 보여주기
  const byLabel: Record<string, string | undefined> = {};
  rows.forEach((r) => {
    const koLeft = EN2KO[r.proposedEmotion] ?? r.proposedEmotion;
    const koRight = EN2KO[r.myEmotion] ?? r.myEmotion;
    byLabel[koLeft] = koRight;
  });

  const deg = msToDeg(responseTime);
  const label = speedLabel(responseTime);

  return (
    <section className="panel no-border">
      <h2 className="sub-title hl">표정 인지하기</h2>

      <div className="recog-grid">
        {/* 제시된 감정 */}
        <div className="recog-card left">
          <div className="recog-head">제시된 감정</div>
          <ul className="recog-list">
            {ALL_LABELS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>

        {/* 내가 선택한 감정 */}
        <div className="recog-card center">
          <div className="recog-head">내가 선택한 감정</div>
          <ul className="recog-list">
            {ALL_LABELS.map((l) => (
              <li key={l}>{byLabel[l] ?? "-"}</li>
            ))}
          </ul>
        </div>

        {/* 정확도 */}
        <div className="recog-card accuracy">
          <div className="recog-head">정확도</div>
          <div className="recog-acc-box">
            <p className="recog-acc-desc">
              7가지 감정 중<br />
              2개를 맞추셨습니다.
            </p>
            <div className="recog-acc-row">
              <span>정확도</span>
              <br></br>

              <b>{accuracyBefore}%</b>
              <span className="arrow">→</span>
              <b className={accuracyAfter >= accuracyBefore ? "up" : "down"}>
                {accuracyAfter}%
              </b>
            </div>
          </div>
        </div>

        {/* 반응 속도 게이지 */}
        <div className="recog-card gauge">
          <div className="recog-head">반응 속도</div>

          <div className="rs-gauge">
            <svg viewBox="0 0 200 140" className="rs-gauge-svg">
              {/* 바깥 기본 아크(노랑) */}
              <path
                d="M20 100 A80 80 0 0 1 180 100"
                stroke="#f2c200"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
              />

              {/* 좌측 녹색 짧은 구간 */}
              <path
                d="M20 100 A80 80 0 0 1 180 100"
                stroke="#22c55e"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="70 400"
              />

              {/* 우측 붉은 짧은 구간 */}
              <path
                d="M20 100 A80 80 0 0 1 180 100"
                stroke="#ef4444"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="55 400"
                strokeDashoffset="-75"
              />

              {/* 내부 붉은 아크들(원본처럼 3단) */}
              <path
                d="M40 100 A60 60 0 0 1 160 100"
                stroke="#ef4444"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="85 400"
                strokeDashoffset="-35"
              />
              <path
                d="M60 100 A40 40 0 0 1 140 100"
                stroke="#ef4444"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="60 400"
                strokeDashoffset="-20"
              />
              <path
                d="M80 100 A20 20 0 0 1 120 100"
                stroke="#ef4444"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />

              {/* 바늘 */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="28"
                stroke="black"
                strokeWidth="3"
                transform={`rotate(${deg - 90}, 100, 100)`}
              />
            </svg>

            <div className="rs-value">{responseTime}ms</div>
            <div className="rs-label">{label}</div>
          </div>
        </div>
      </div>

      <p className="empathy-caption" style={{ marginTop: 12 }}>
        국회의원은 그 지위를 남용하여 국가·공공단체 또는 기업체와의 계약이나 그
        처분에 의하여 재산상의 권리·이익 또는 직위를 취득하거나 타인을 위하여 그
        취득을 알선할 수 없다.
      </p>
    </section>
  );
}
