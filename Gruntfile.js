'use strict';
module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'src/*.js',
                'test/{,*/}*.js',

                // do not lint generated codes
                '!src/dgen.js',

                // do not lint external codes
                '!lib/{,*/}*random.js'
            ]
        },
        jstestdriver: {
            options: {
                canFail: true,
                verbose: true
            },
            files: ['alltests.conf']
        },
        typescript: {
            base: {
                src: ['src/dgen.ts'],
                options: {
                    module: 'amd',
                    sourcemap: true,
                    fullSourceMapPath: true
                }
            }
        },
        shell: {
            runjstestdriver: {
                command: 'java -jar node_modules/grunt-jstestdriver/lib/jstestdriver.jar --port 9876',
                options: {
                    stdout: true
                }
            },
            clean: {
                command: 'rm -rf dist'
            },
            copy: {
                command: [
                    'mkdir dist',
                    'cp lib/random/index.js dist/random.js',
                    'cp src/dgen.js dist/dgen.js',
                    'cp src/index.html dist/index.html'
                ].join('&&')
            }
        }
    });

    grunt.registerTask('testserver', [
        'shell:runjstestdriver'
    ]);

    grunt.registerTask('test', [
        'jstestdriver'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test'
    ]);

    grunt.registerTask('clean', [
        'shell:clean'
    ]);

    grunt.registerTask('dist', [
        'clean',
        'jshint',
        'typescript',
        'shell:copy'
    ]);
};
