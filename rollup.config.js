import path from 'path';
import fs from 'fs';
import babel from 'rollup-plugin-babel';
import nodeGlobals from 'rollup-plugin-node-globals';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

let pkg = JSON.parse(fs.readFileSync('./package.json')),
  external = Object.keys(pkg.dependencies || {}),
  babelRc = pkg.babel || JSON.parse(fs.readFileSync('./.babelrc'));
console.log(external);

export default {
  moduleName: pkg.amdName || pkg.name,
  input: 'app.js',
  output: {
    file: 'build/browser/app.js',
    format: 'iife'
  },
  plugins: [
    babel({
      babelrc: false,
      ...babelRc
    }),
    nodeResolve({
      browser: true,
      jsnext: true,
      main: true,
    }),
    nodeGlobals({ process: true, global: true }),
    commonjs({
      include: 'node_modules/**',
    })
  ]
};
