// src/components/DetailedResultSkeleton.tsx
// import React from 'react';

export default function DetailedResultSkeleton() {
  return (
    <main className="page">
      <section className="panel">
        <h2 className="sub-title">표정 공감하기</h2>
        <div className="placeholder" style={{ height: 240 }} />
      </section>

      <section className="panel">
        <h2 className="sub-title">표정 따라하기</h2>
        <div className="placeholder" style={{ height: 200 }} />
      </section>

      <section className="panel">
        <h2 className="sub-title">표정 인지하기</h2>
        <div className="placeholder" style={{ height: 200 }} />
      </section>

      <section className="panel">
        <h2 className="sub-title">표정 지어보기</h2>
        <div className="placeholder" style={{ height: 200 }} />
      </section>

      <button className="primary block" style={{ marginTop: 24 }}>
        종료
      </button>
    </main>
  );
}
