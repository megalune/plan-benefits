// config-overrides.js

const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: 'src/index.js',
    template: 'public/index.html',
    outPath: '/index.html'
  },
  {
    entry: 'src/index.js',
    template: 'public/commercial.html',
    outPath: '/commercial.html'
  },
  {
    entry: 'src/index.js',
    template: 'public/medicare.html',
    outPath: '/medicare.html'
  }
]);

module.exports = {
  webpack: function(config, env) {
    multipleEntry.addMultiEntry(config);
    return config;
  }
};