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
### 1. 500 에러 재시도와 안전한 UI 복구
####  문제
외부 API가 간헐적으로 500(서버 내부 오류)을 반환하면서 사용자 화면에 빈 패널이나 깨진 컴포넌트가 노출되는 문제가 발생했습니다.  
이때 사용자는 직접 새로고침을 해야만 화면이 복구되었고, 서비스 신뢰도와 사용자 경험이 크게 저하되었습니다.

#### 원인
서버 과부하나 일시적인 네트워크 지연 등 ‘일시적 장애’가 발생했을 때도 모든 요청을 즉시 실패로 처리하고 있었습니다.  
또한 `ErrorBoundary`나 재시도 로직이 없어 “일시 오류(복구 가능)”와 “지속 오류(복구 불가)”를 구분하지 못하는 구조였습니다.  
그 결과, 시스템은 장애를 완화하거나 자동 복구할 기회를 잃고 사용자에게 오류 화면을 그대로 노출했습니다.

#### 해결 방법
#### 1️⃣ TanStack Query v5의 재시도 로직 커스터마이징  
`AxiosError`의 상태 코드에 따라 재시도 여부를 결정하도록 로직을 개선하였습니다.  
500번대 에러의 경우 **서버 일시 장애 가능성**이 높다고 판단하여 최대 2회까지 재시도하며,  
재시도 간격은 `4^n × 250ms`로 증가하는 **지수형 딜레이**를 적용했습니다.  
반면, 400번대 에러는 클라이언트 측 문제로 판단해 재시도를 수행하지 않도록 분리하였습니다.

```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        const status = (error as AxiosError)?.response?.status ?? 0;
        return status >= 500 && status < 600 && failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(250 * Math.pow(4, attempt), 3000),
      useErrorBoundary: (error: any) => (error?.response?.status ?? 0) >= 500,
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});
```

#### 2️⃣ ErrorBoundary와 QueryErrorResetBoundary를 이용한 UI 보호

react-error-boundary를 도입해 오류 발생 시 깨진 UI가 즉시 숨겨지고,
사용자가 직접 “다시 시도” 버튼을 눌러 복구할 수 있도록 구성했습니다.
```ts
<QueryErrorResetBoundary>
  {({ reset }) => (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <div className="error-panel">
          <h3>일시적인 오류가 발생했어요</h3>
          <p>네트워크 또는 서버 상태를 확인 중입니다.</p>
          <button onClick={() => resetErrorBoundary()}>다시 시도</button>
        </div>
      )}
    >
      <ReportPage />
    </ErrorBoundary>
  )}
</QueryErrorResetBoundary>

```

이 방식은 Query 내부에서 throw된 에러를 상위 경계 컴포넌트에서 흡수하여,
화면이 완전히 깨지지 않고 안정적인 상태로 유지될 수 있도록 도와주었습니다.

#### 3️⃣ Toast 알림을 통한 사용자 피드백

사용자에게는 react-hot-toast를 통해 즉각적인 시각 피드백을 제공했습니다.
단, Toast는 ErrorBoundary와 역할이 중복되지 않도록 알림용으로만 한정했습니다.
```ts
useEffect(() => {
  if (isError && !isFetching) {
    const status = (error as any)?.response?.status ?? 0;
    if (status >= 500) toast.error("서버가 잠시 불안정해요. 자동으로 재시도했어요.");
    else toast.error("요청을 처리할 수 없어요. 입력 값 또는 권한을 확인해주세요.");
  }
}, [isError, isFetching, error]);

```

이렇게 함으로써 사용자는 오류 발생 원인을 명확히 인식할 수 있고,
UI는 깨지지 않은 상태로 유지되며 “자동 복구 중”임을 시각적으로 알 수 있었습니다.

### 결과

- 일시적인 500 오류 발생 시 무중단 UI가 유지되었습니다.
- 자동 재시도 성공률이 상승하여 사용자 새로고침 의존도가 감소했습니다.
- 평균 복구 시간이 단축되어, 체감 UX 품질이 향상되었습니다.

### 배운 점

“재시도는 만능이 아니다”라는 사실을 깨달았습니다.
단순히 횟수를 늘리는 것이 아니라 오류 등급별 정책 설계(500번대만 재시도)가 핵심이었습니다.

ErrorBoundary는 UI를 보호하는 최후의 안전망,
Toast는 사용자에게 상황을 전달하는 채널로 역할을 분리해야
시스템 복구와 사용자 경험이 동시에 안정적으로 유지됨을 배웠습니다.

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
실제 프로덕션 환경이라면 아래 기능을 추가하고 싶습니다.
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
