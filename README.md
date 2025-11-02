# 🧠 정신건강 검사 결과 조회 페이지

rPPG(원격 광용적 맥파) 기반 생체신호와 감정 분석 데이터를 시각화하고,  
AI 표정 분석과 사용자의 감정 인식 일치도를 한눈에 비교할 수 있는 대시보드형 웹페이지입니다.

---

## 🚀 배포 URL
- **프론트엔드**: https://emma-health-frontend.vercel.app/

---

## 🛠 기술 스택

### Frontend
- React 18
- TypeScript
- Vite
- Tanstack Query
- Recharts – 생체신호 시각화용
- Axios
- CSS Modules / Custom CSS

---

## ⚙️ 기술 선택 이유
- **React**: 컴포넌트 단위 설계로 구조적이고 유지보수가 용이하며, 생체신호 그래프·테이블 등 반복되는 UI를 재사용 가능  
- **TypeScript**: API 응답 구조(`Report`, `RppgBlock`)를 명확히 정의해 런타임 에러 예방  
- **Tanstack Query**: 서버 상태를 자동 캐싱·갱신하며 500 오류 시 재시도 처리로 안정성 확보  
- **Recharts**: `hrValues`, `emotionResult` 등 시계열·비율 데이터를 커스텀 라벨/범례로 시각화  
- **Vite**: 빠른 빌드 속도와 모듈 핫리로드로 개발 효율 향상  

---

## 💻 설치 및 실행
npm install  
npm run dev  


---

## 📁 프로젝트 구조
src/  
├── api/  
│   └── client.ts           # axios 인스턴스 설정  
├── components/  
│   ├── RPPGChart/          # rPPG 데이터 시각화 (라인차트)  
│   ├── HrRangeChart.tsx    # 심박수 min/avg/max 표시  
│   ├── HrLegendBox.tsx     # 범례 정렬 및 색상 구분  
│   ├── HrvGauge.tsx        # HRV 반원 게이지  
│   ├── EmpathyTable.tsx    # 감정 비교 테이블 (3그룹 구조)  
│   └── ...  
├── hooks/  
│   └── useRppgReport.ts    # Tanstack Query 훅  
├── pages/  
│   └── DetailedResult.tsx  # 전체 결과 페이지 조립  
├── types/  
│   └── report.ts           # 데이터 타입 정의  
└── styles/  
    └── global.css          # 전역 CSS 및 테이블 스타일  

---

## 🌡 주요 기능
- rPPG 생체신호 데이터 시각화 (심박수 그래프)  
- 감정 분석 결과 표시 (AI 분석 vs 나의 감정 비교)  
- 이전/현재 측정값 비교 (공감도 변화, 색상 구분)  
- 우울증 점수 변화 추이 (반원 게이지 시각화)  
- 반응형 UI (모바일 카드형 스택 구조)  

---

## 🔍 구현 상세

### 🧱 에러 핸들링
- Tanstack Query의 `retry` 옵션으로 500 에러 재시도  
- ErrorBoundary로 비정상 응답 시 UI 보호  
- Toast 알림으로 사용자 피드백 제공  

### 🧭 상태 관리
- 서버 상태: Tanstack Query  
- 클라이언트 상태: useState, useEffect 기반  

### 📊 데이터 시각화
- 심박수 시계열 차트: `hrValues` 배열 기반 라인차트  
- 감정 분석 그래프: `emotionResult` 객체를 바차트/파이차트로 시각화  
- 공감도 테이블:  
  - 제시 감정 / AI 분석 / 나의 감정 / 일치 여부 / 공감도(이전→현재)  
  - 일치 시 파랑, 불일치 시 빨강  
  - 첫 행만 `#99C0FF` 선 표시  
  - 좌·우 컬럼은 `#DDE9FF` 배경, 헤더 포함 라운드 처리  

---

## 🧩 개발 중 주요 오류와 극복
| 문제 상황 | 원인 | 해결 방법 |
|------------|------|------------|
| useQuery 타입 에러 | Tanstack Query v5 옵션 오버로드 불일치 | 제너릭 명시 및 onError 제거 |
| 범례 세로 정렬 깨짐 | img 높이/라인 높이 차이 | display: inline-flex; align-items: center 적용 |
| LabelList 라벨 잘림 | 차트 도메인 부족 | domain buffer(±5%) 추가 |
| 테이블 과도한 경계선 | border-collapse로 인한 중첩 | border-spacing으로 그룹 간 여백 확보 |
| 공감도 색상 미적용 | 조건 분기 누락 | isMatch ? match : mismatch 조건부 렌더링 |
| 이미지 스타일 미적용 | 인라인 우선순위 충돌 | 별도 클래스 분리, CSS로 통일 관리 |

---

## 🧾 커밋 컨벤션
| 타입 | 설명 |
|------|------|
| ✨ feat | 새로운 기능 추가 |
| 🐛 fix | 버그 수정 |
| 💄 style | UI/스타일 수정 |
| ♻️ refactor | 코드 리팩토링 |
| 📦 chore | 환경 설정 관련 |
| 🚀 Deploy | 빌드 관련 |

---

## 🚧 개선 사항
실제 프로덕션 환경이라면 아래 기능을 추가할 계획입니다.  
- PDF 리포트 생성 및 다운로드  
- 로딩 상태 개선 : Skeleton UI 및 인터랙션 대기 애니메이션 추가  

---

## 💬 프로젝트 회고
실제 API 응답 데이터의 구조적 불안정, Tanstack Query 타입 충돌,  
시각화 영역의 스타일 겹침 등 다양한 문제를 직접 해결하면서  
데이터 기반 UI 안정화 및 퍼블리싱 정교화 역량을 강화했습니다.

---


UI/UX, 퍼포먼스, 에러 처리, 반응형 퍼블리싱을 종합적으로 경험한 결과물입니다.  
React 기반 데이터 시각화 구조와 예외 대응 역량을 실무 수준으로 끌어올렸습니다.
