export const basePath = '/sc';

export const endpoint = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080'
  : 'https://studentcenter.qccareerschool.com/api';
