/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
