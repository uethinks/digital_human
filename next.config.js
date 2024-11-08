/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'resource2.heygen.ai',
            },
            {
                protocol: 'https',
                hostname: 'files2.heygen.ai',
            },
        ],
    },
    eslint: {
        dirs: ['src'], // 只在 src 目录下运行 ESLint
        ignoreDuringBuilds: false, // 构建时不忽略 ESLint 错误
    },
}

module.exports = nextConfig 