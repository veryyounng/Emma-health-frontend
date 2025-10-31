import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? '', // 배포에서 실제 API 도메인 지정
  timeout: 8000,
});
