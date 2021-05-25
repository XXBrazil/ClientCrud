const proxy = [
  {
    context: '/ws',
    logLevel: 'debug',
    secure: false,
    target: 'https://viacep.com.br',
    pathRewrite: {'^/ws' : ''}
  }
];module.exports = proxy;

