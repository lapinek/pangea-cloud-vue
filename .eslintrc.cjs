/* eslint-env node */
module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  ignorePatterns : [
    'dist'
  ],
  "globals": {
    "process": "readonly",
    "__dirname": "readonly",
    "__filename": "readonly"
  },
  "rules": {
    "vue/multi-word-component-names": "off",
    "semi": [2, "never"]
  }
}
