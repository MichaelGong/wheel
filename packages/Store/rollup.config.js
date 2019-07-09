// 为了让rollup识别commonjs类型的包,默认只支持导入ES6
import commonjs from 'rollup-plugin-commonjs';
// 为了支持import xx from 'xxx'
import nodeResolve from 'rollup-plugin-node-resolve';
// ts转js的编译器
import typescript from 'rollup-plugin-typescript2';
// 支持加载json文件
import json from 'rollup-plugin-json';
// 支持字符串替换, 比如动态读取package.json的version到代码
import replace from 'rollup-plugin-replace';
// 代码生成sourcemaps
import sourceMaps from 'rollup-plugin-sourcemaps';
// import babel from 'rollup-plugin-babel';
// import { uglify } from 'rollup-plugin-uglify';
// import tsTreeshaking from 'rollup-plugin-ts-treeshaking';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
// 读取package.json
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const isDev = process.env.NODE_ENV === 'development';

// 代码头
const banner = `/*!
 * @license
 * MgStore.js v${pkg.version}
 * (c) 2019-${new Date().getFullYear()} MichaelGong
 * https://github.com/MichaelGong/wheel
 * Released under the MIT License.
 */`;

export default {
  input: './Store.ts',
  output: [
    {
      format: 'iife',
      file: pkg.iife,
      banner,
      sourcemap: true,
      name: 'mgStore'
    },
    {
      format: 'cjs',
      // 生成的文件名和路径
      // package.json的main字段, 也就是模块的入口文件
      file: pkg.main,
      banner,
      sourcemap: true
    },
    {
      format: 'es',
      // rollup和webpack识别的入口文件, 如果没有该字段, 那么会去读取main字段
      file: pkg.module,
      banner,
      sourcemap: true
    },
    {
      format: 'umd',
      name: 'mgStore',
      file: pkg.browser,
      banner,
      sourcemap: true
    }
  ],
  plugins: [
    replace({
      __VERSION__: pkg.version
    }),

    json(),
    nodeResolve({ extensions }),

    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript')
    }),
    // tsTreeshaking(),
    commonjs(),
    sourceMaps(),

    // babel({
    //   extensions,
    //   exclude: ['./node_modules'],
    //   include: ['./**/*']
    // }),

    // (process.env.NODE_ENV === 'production' && uglify()),
    // uglify(),
    terser({
      output: {
        comments: function(node, comment) {
          var text = comment.value;
          var type = comment.type;
          if (type == 'comment2') {
            // multiline comment
            return /@preserve|@license|@cc_on/i.test(text);
          }
        }
      }
    }),
    isDev &&
      serve({
        open: true, // 是否打开浏览器
        contentBase: './',
        openPage: '/public/index.html', // 入口html的文件位置
        historyApiFallback: true, // Set to true to return index.html instead of 404
        host: 'localhost',
        port: 10001
      })
  ]
};
