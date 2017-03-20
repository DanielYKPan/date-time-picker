/**
 * polyfills
 */

import 'core-js/es6';
import 'core-js/es7/reflect';

// Web animations for Safari and Firefox #10420
import 'web-animations-js';

require('zone.js/dist/zone');
if (process.env.ENV === 'production') {
    // Production
} else {
    // Development
    Error['stackTraceLimit'] = Infinity;
    require('zone.js/dist/long-stack-trace-zone');
}

