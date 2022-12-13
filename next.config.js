/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
};

module.exports = nextConfig;

const isDevelopment = process.env.NODE_ENV === 'development';

const withVideos = require('next-videos');

module.exports = withVideos({
	assetPrefix: isDevelopment ? 'http://localhost:3000' : 'http://localhost',
});
