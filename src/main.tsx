// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './query/queryCli';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './er/ErrorFallback';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // 전체 쿼리를 초기화하고 다시 가져오기
          queryClient.resetQueries();
          queryClient.invalidateQueries();
        }}
      >
        <App />
      </ErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>
);
