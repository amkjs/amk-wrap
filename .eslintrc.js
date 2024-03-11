module.exports = {
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: '2023',
    sourceType: 'commonjs'
  },
  env: {
    mocha: true,
    node: true,
  },
  rules: {
    semi: 1,
  }
};