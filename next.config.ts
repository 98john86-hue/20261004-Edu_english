import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 모바일에서 CSS 요청 왕복을 없애 첫 화면을 빨리 그린다
  experimental: { inlineCss: true },
};

export default nextConfig;
