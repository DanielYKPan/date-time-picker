import nodeResolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import alias from 'rollup-plugin-alias';
import {buildOptimizer} from '@angular-devkit/build-optimizer';

function angularBuildOptimizer() {
    return {
        name: 'angular-optimizer',
        transform: (content) => buildOptimizer({content}).content,
    }
}

const rxPaths = require('rxjs/_esm5/path-mapping');

export default {
    output: {
        format: 'umd',
        name: 'ng-pick-datetime',
        globals: {
            '@angular/cdk': 'vendor._angular_cdk',
            '@angular/core': 'vendor._angular_core',
            '@angular/common': 'vendor._angular_common',
            '@angular/forms': 'vendor._angular_forms',
            '@angular/animations': 'vendor._angular_animations',
        },
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
        alias(rxPaths()),
        nodeResolve({jsnext: true, module: true}),
        angularBuildOptimizer(),
        uglify()
    ]
};

