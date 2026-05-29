/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/sc',
  pageExtensions: [ 'page.tsx', 'page.ts', 'page.jsx', 'page.js' ],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'studentcenter.qccareerschool.com' },
    ],
  },
  sassOptions: {
    quietDeps: true, // hide deprecation warnings from node_modules
    // If your sass-loader / Sass version supports it, you can also do:
    silenceDeprecations: [ 'import', 'global-builtin' ],
  },
};

module.exports = nextConfig;
