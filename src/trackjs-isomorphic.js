module.exports = typeof window !== 'undefined' ?
  require('trackjs') :
  require('trackjs-node');
