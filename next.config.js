/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/sc',
  reactStrictMode: true,
  images: {
    domains: [ 'localhost', 'studentcenter.qccareerschool.com' ],
  },
};

module.exports = nextConfig;
