// src/errors/ErrorFallback.tsx
type Props = { error: Error; resetErrorBoundary: () => void };

export default function ErrorFallback({ error, resetErrorBoundary }: Props) {
  return (
    <div className="page">
      <h2 style={{ marginBottom: 8 }}>문제가 발생했어요</h2>
      <p className="muted" style={{ marginBottom: 16 }}>
        {error.message}
      </p>
      <button className="btn" onClick={resetErrorBoundary}>
        다시 시도
      </button>
    </div>
  );
}
