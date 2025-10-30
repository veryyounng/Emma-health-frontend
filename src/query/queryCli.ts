// src/query/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5xx/네트워크 오류 재시도, 4xx 즉시 실패
      retry: (failureCount, error: any) => {
        const s = error?.response?.status ?? error?.status;
        if (s && s >= 400 && s < 500) return false;
        return failureCount < 3;
      },
      // 지수 백오프 + 지터(±20%)
      retryDelay: (attempt) => {
        const base = 500 * Math.pow(2, attempt); // 500,1000,2000...
        const jitter = base * 0.2;
        return base + (Math.random() * 2 - 1) * jitter;
      },
      staleTime: 10_000,
      gcTime: 5 * 60_000,
      // 5xx/네트워크 계열은 Boundary로 올려서 흰화면 방지 + Fallback UI
      useErrorBoundary: (err: any) => {
        const s = err?.response?.status ?? err?.status;
        return s >= 500 || s === undefined;
      },
    },
  },
});
