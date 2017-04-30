export default {
    format: 'umd',
    moduleName: 'DateTimePicker',
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/forms',
        'moment/moment'
    ],
    onwarn: (warning) => {
        const skip_codes = [
            'THIS_IS_UNDEFINED',
            'MISSING_GLOBAL_NAME'
        ];
        if (skip_codes.indexOf(warning.code) != -1) return;
        console.error(warning);
    }
};

