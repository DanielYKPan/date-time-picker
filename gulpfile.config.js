/**
 * gulpfile.config
 */

(function () {
    'use strict';

    var GulpConfig = (function () {
        function gulpConfig() {

            this.source = './';
            this.sourceApp = this.source + 'src/';

            this.allSass = this.sourceApp + '/**/*.scss';
            this.allHtml = this.sourceApp + '/**/*.html';
            this.allTs = this.sourceApp + '/**/*.ts';
            this.allAssets = this.sourceApp + '/assets/**/*.*';

            this.tmpOutputPath = this.source + 'tmp';
            this.alltmpTs = this.source + 'tmp/**/*.ts';
            this.alltmpSpecTs = this.source + 'tmp/**/*spec.ts';
            this.alltmpResources = this.source + 'tmp/assets/**';

            this.allDistFiles = this.source + 'dist/**/*.*';

        }
        return gulpConfig;
    })();
    module.exports = GulpConfig;

})();