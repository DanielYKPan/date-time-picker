import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify'

export default {
    format: 'umd',
    moduleName: 'ng-pick-datetime',
    external: [
        '@angular/animations',
        '@angular/core',
        '@angular/common',
        '@angular/forms',
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
                'node_modules/date-fns/**',
            ],
            namedExports: {
                'node_modules/date-fns/index.js': [
                    'parse',
                    'isValid',
                    'startOfMonth',
                    'getDate',
                    'setDate',
                    'getDay',
                    'addDays',
                    'addMonths',
                    'isSameDay',
                    'isSameMonth',
                    'getMonth',
                    'setMonth',
                    'getYear',
                    'addYears',
                    'differenceInCalendarDays',
                    'setYear',
                    'getHours',
                    'setHours',
                    'getMinutes',
                    'setMinutes',
                    'addMinutes',
                    'getSeconds',
                    'setSeconds',
                    'addSeconds',
                    'isBefore',
                    'isAfter',
                    'startOfDay',
                    'format',]
            }
        }),
        uglify()
    ]
};

