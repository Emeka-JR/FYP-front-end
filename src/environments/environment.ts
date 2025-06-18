export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api/v1',
  apiEndpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      me: '/auth/me'
    },
    news: '/news',
    users: '/users'
  }
}; 