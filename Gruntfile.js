module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // project configuration
  grunt.initConfig({
    browserify: {
      options: {
        transform: [
          [ 'stringify', {
            extensions: [ '.bpmn' ]
          } ],
          [ 'babelify', {
            "presets": [
              [
                "env",
                {
                  "targets": {
                    "node": "current"
                  }
                }
              ]
            ],
            global: true
          } ]
        ]
      },
      watch: {
        options: {
          watch: true
        },
        files: {
          'dist/app.js': [ 'app/**/*.js' ]
        }
      },
      app: {
        files: {
          'dist/app.js': [ 'app/**/*.js' ]
        }
      }
    },
    copy: {
      comments: {
        files: [ {
          src: require.resolve('bpmn-js-embedded-comments/assets/comments.css'),
          dest: 'dist/comments.css'
        } ]
      },
      diagram_js: {
        files: [ {
          src: require.resolve('bpmn-js/dist/assets/diagram-js.css'),
          dest: 'dist/diagram-js.css'
        } ]
      },
      bpmn_font: {
        files: [ {
          src: require.resolve('bpmn-js/dist/assets/bpmn-font/css/bpmn.css'),
          dest: 'dist/bpmn.css'
        } ,{
          src: require.resolve('bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'),
          dest: 'dist/bpmn-codes.css'
        } ,{
          src: require.resolve('bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'),
          dest: 'dist/bpmn-embedded.css'
        } ]
      },
      properties_panel: {
        files: [ {
          src: require.resolve('bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'),
          dest: 'dist/bpmn-js-properties-panel.css'
        } ]
      },
      app: {
        files: [
          {
            expand: true,
            cwd: 'app/',
            src: ['**/*', '!**/*.js'],
            dest: 'dist'
          }
        ]
      }
    },

    watch: {
      options: {
        livereload: true
      },

      samples: {
        files: [ 'app/**/*.*' ],
        tasks: [ 'copy:app' ]
      },
    },

    connect: {
      livereload: {
        options: {
          port: 9013,
          livereload: true,
          hostname: 'localhost',
          open: true,
          base: [
            'dist'
          ]
        }
      }
    }
  });

  // tasks

  grunt.registerTask('build', [ 'browserify:app', 'copy' ]);

  grunt.registerTask('auto-build', [
    'copy',
    'browserify:watch',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('default', [ 'build' ]);
};
