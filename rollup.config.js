import buble from 'rollup-plugin-buble';

export default {
  entry: 'src/js/toggle.js',
  plugins: [buble()],
  targets: [
    {
      dest: 'dist/toggle.es.js',
      format: 'es'
    },
    {
      dest: 'dist/toggle.browser.js',
      format: 'iife',
      moduleName: 'Toggle'
    }
  ]
}