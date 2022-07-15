export const basePath = '/sc';

export const endpoint = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/v1'
  : 'https://studentcenter.qccareerschool.com/api/v1';

export const crmEndpoint = process.env.NODE_ENV === 'development'
  ? 'http://localhost:12080/v4'
  : 'https://studentcenter.qccareerschool.com/crm/v4';
