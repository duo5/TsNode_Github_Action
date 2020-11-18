const gulp = require('gulp');
const shell = require('gulp-shell');
const apidoc = require('gulp-apidoc');
const argv = require('yargs')['argv'];

gulp.task('apidoc',(done) => {
    apidoc({
        src: './src/routes',
        dest: './dist/public',
        config: `./apidoc/${argv.env || 'staging'}`,
        includeFilters: ['.*\\.controller\\.js|ts$']
    },done);
});

// Run api doc when change in controller
// gulp.task('document-watch', ['apidoc'], () => {
//     gulp.watch('src/routes/**/*.controller.ts', ['apidoc'])();
// });

gulp.task('test',
    shell.task([`ENV_FILE=./config/.env.test jest --config ./jest.config.js`])
);

gulp.task('build', 
    shell.task(['tsc -p .', 'tslint -c tslint.json -p tsconfig.json'])
);

gulp.task('build:local',
    shell.task([`gulp build`, 'gulp apidoc --env=local'])
);

gulp.task('build:staging',
    shell.task(['gulp build', 'gulp apidoc --env=staging'])
);
