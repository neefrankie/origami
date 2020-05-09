import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";
import buble from '@rollup/plugin-buble';

const production = !process.env.ROLLUP_WATCH;

// Rollup is used to compile ts to a single file that can be used in
// `<script>` directly.
export default [
  // Process vanilla TS.
  {
    input: "src/main.ts",
    output: {
      file: "build/script/main.js",
      format: "iife",
      sourcemap: true,
    },
    plugins: [
      // When using this plugin, tsconfig.json cannot have this option:  
      // "outDir": "../build/ts-out"
      // See https://github.com/rollup/plugins/issues/287
      typescript({
        tsconfig: './tsconfig.base.json' // relative to process.cwd().
      }),
      buble(),
      production && terser(),
    ],
  },
];
