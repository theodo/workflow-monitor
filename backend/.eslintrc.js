module.exports = {
	env: {
	  browser: true,
	  node: true,
	  es6: true,
	},
	extends: ['eslint:recommended', 'prettier'],
	parserOptions: {
		ecmaVersion: 2019,
	  es6: true,
	  sourceType: 'module',
	  node: true
	},
	plugins: ['prettier'],
	rules: {
	  'prettier/prettier': 'error',
	  'no-console': [1],
	  'no-case-declarations': [1],
	},
};
  