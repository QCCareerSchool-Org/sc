/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/sc',
  reactStrictMode: true,
  pageExtensions: [ 'page.tsx', 'page.ts', 'page.jsx', 'page.js' ],
  images: {
    domains: [ 'localhost', 'studentcenter.qccareerschool.com' ],
  },
};

module.exports = nextConfig;
