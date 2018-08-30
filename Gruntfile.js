'use strict';

module.exports = function (grunt) {

  //load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    // Configure a mochaTest task
    mochaTest: {
      unit: {
        options: {
          reporter: 'spec',
          timeout: 20000
        },
        src: ['test/unit/**/*.js']
      },
      intergration: {
        options: {
          reporter: 'spec',
          timeout: 20000
        },
        src: ['test/intergration/**/*.js']
      }
    },

    //configure jshint task
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'index.js',
        'src/**/*.js',
        'test/**/*.js'
      ]
    },

    //configure watch task
    watch: {
      src: {
        files: [
          'index.js',
          'src/**/*.js',
          'test/**/*.js'
        ],
        tasks: ['jshint', 'mochaTest:unit']
      },
    }
  });

  //custom tasks
  grunt.registerTask('default', ['jshint', 'mochaTest:unit', 'watch']);
  grunt.registerTask('test', ['jshint', 'mochaTest:unit']);
  grunt.registerTask('intergration', ['jshint', 'mochaTest:intergration']);

};