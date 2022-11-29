/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
};

module.exports = nextConfig;

/**
 * next-videos
 */
// 提供先リモートURL切り替え用フラグ
const isDevelopment = process.env.NODE_ENV === 'development';

// 動画をリモートURLに提供
const withVideos = require('next-videos');

// 提供先の選択
module.exports = withVideos({
	assetPrefix: isDevelopment ? 'http://localhost:3000' : 'http://localhost',
});
