module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'react-app', 'prettier', 'prettier/react'],
  parserOptions: {
		ecmaVersion: 2019,
    es6: true,
    sourceType: 'module',
    node: true
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': [1],
    'no-case-declarations': [1],
    'react/jsx-uses-react': [2],
    'react/jsx-uses-vars': [2],
    'react/no-array-index-key': 2,
    'react/prefer-stateless-function': 0,
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'react/no-array-index-key': 1
  },
};
