import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify'

export default {
  output: {
    format: 'umd',
    name: 'ng-pick-datetime',
  },
  external: [
    '@angular/core',
    '@angular/common',
    '@angular/forms',
    '@angular/animations',
    '@angular/cdk',
    'moment/moment',
  ],
  onwarn: (warning) => {
    const skip_codes = [
      'THIS_IS_UNDEFINED',
      'MISSING_GLOBAL_NAME'
    ];
    if (skip_codes.indexOf(warning.code) != -1) return;
    console.error(warning);
  },
  plugins: [
    nodeResolve({jsnext: true, module: true}),
    commonjs({
      include: [
        'node_modules/rxjs/**',
      ],
    }),
    uglify()
  ]
};

