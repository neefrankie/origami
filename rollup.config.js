import buble from 'rollup-plugin-buble';

export default {
  entry: './main.js',
  plugins: [
    buble()
  ],
  format: 'es',
  dest: './dist/toggle.es2015.js',
}