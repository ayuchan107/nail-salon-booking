/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14では experimental.appDir は不要
  // output: 'export', // 開発時は無効化（デプロイ時のみ有効化）
  trailingSlash: true, // URLの末尾にスラッシュを追加
  images: {
    unoptimized: true // 静的エクスポート時に必要
  }
}

module.exports = nextConfig
