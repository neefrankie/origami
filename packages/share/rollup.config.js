import buble from 'rollup-plugin-buble';

export default {
  input: 'src/js/share.js',
  plugins: [buble()],
  output: {
    file: 'dist/o-share.js',
    format: 'iife',
    name: 'Share'
  }
}