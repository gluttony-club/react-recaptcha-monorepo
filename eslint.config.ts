import janna from '@jannajs/lint/eslint'

import '@antfu/eslint-config'

// 使用 @jannajs/lint 预设配置，默认禁用 vue，开启 react等
export default janna({
  rules: {
    // 禁用 console 和全局变量
    'no-console': 'off',
    // 禁用 require 和 import
    'no-restricted-globals': 'off',
    // 禁用 process 全局变量
    'node/prefer-global/process': 'off',
    // 禁用 var 和 require
    'ts/no-var-requires': 'off',
    // 禁用 require 和 import
    'ts/no-require-imports': 'off',
  },
})
