/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/sc',
  reactStrictMode: true,
  pageExtensions: [ 'page.tsx', 'page.ts', 'page.jsx', 'page.js' ],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'studentcenter.qccareerschool.com' },
    ],
  },
};

module.exports = nextConfig;
