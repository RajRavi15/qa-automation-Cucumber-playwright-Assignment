module.exports = {
  default: {
    require: [
      'src/support/**/*.ts',
      'src/steps/**/*.ts',
      'src/hooks/**/*.ts',
    ],
    requireModule: ['ts-node/register'],
    format: ['progress', 'summary'],
    formatOptions: {
      snippetInterface: 'async-await',
    },
  },
};
