import buble from 'rollup-plugin-buble';

export default {
  entry: 'main.js',
  plugins: [buble()],
  targets: [
    {
      dest: 'dist/share.es.js',
      format: 'es'
    },
    {
      dest: 'dist/share.browser.js',
      format: 'iife',
      moduleName: 'Share'
    }
  ]
}