export const basePath = process.env.NODE_ENV === 'development'
  ? '/'
  : '/sc/';

export const endpoint = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080' + basePath
  : 'https://studentcenter.qccareerschool.com' + basePath;
