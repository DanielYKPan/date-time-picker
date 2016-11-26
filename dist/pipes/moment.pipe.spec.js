"use strict";
var moment_pipe_1 = require('./moment.pipe');
var moment = require('moment/moment');
describe('MomentPipe', function () {
    var defaultFormat;
    var nowMoment;
    var pipe = new moment_pipe_1.MomentPipe();
    beforeEach(function () {
        defaultFormat = 'MMM DD, YYYY';
        nowMoment = moment();
    });
    it('should transform "nowMoment" to a string formatted as defaultFormat', function () {
        expect(pipe.transform(nowMoment)).toBe(nowMoment.format(defaultFormat));
    });
    it('should transform "nowMoment" to a string formatted as a provided format', function () {
        var providedFormat = "dddd, MMMM Do YYYY, h:mm:ss a";
        expect(pipe.transform(nowMoment, providedFormat)).toBe(nowMoment.format(providedFormat));
    });
});

//# sourceMappingURL=moment.pipe.spec.js.map
