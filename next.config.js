/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 静态导出，适配 Cloudflare Pages
  distDir: 'out',    // 输出到 out 目录
  images: {
    unoptimized: true,  // 静态导出需要
  },
}

module.exports = nextConfig
