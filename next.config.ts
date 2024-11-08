import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'resource2.heygen.ai',
      'files2.heygen.ai',
      // 添加其他需要的域名
    ],
  },
  eslint: {
    dirs: ['src'], // 只在 src 目录下运行 ESLint
    ignoreDuringBuilds: false, // 构建时不忽略 ESLint 错误
  },
};

export default nextConfig;
