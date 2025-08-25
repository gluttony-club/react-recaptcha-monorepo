import path from 'node:path'

import { mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'

import type { UserConfig } from 'vite'

import baseConfig from './vite.base.config'

// https://vitejs.dev/config/
export default mergeConfig(baseConfig, {
  plugins: [
    dts({
      exclude: '**/demos',
      beforeWriteFile: (filePath) => {
        return {
          filePath: filePath.replace('src/', ''),
        }
      },
    }),
  ],
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        dir: 'dist',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
      external: (source, _, isResolved) =>
        !(isResolved || /^[./]|^@\//.test(source)),
    },
    target: 'esnext',
  },
} as UserConfig)
