/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/sc',
  reactStrictMode: true,
  // experimental: {
    // Enables the styled-components SWC transform
    // styledComponents: true
  // },
  images: {
    domains: [ 'localhost', 'studentcenter.qccareerschool.com' ],
  },
};

module.exports = nextConfig;
