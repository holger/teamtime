module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['dist'],

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'spec/**/*.js']
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'min'
      },
      dist: {
        src: ['lib/handlebars-v1.1.2.js', 'lib/jquery-1.10.2.min.js', 'lib/bootstrap.min.js', 'src/**/*.js'],
        dest: 'dist/teamtime-<%= pkg.version %>.min.js'
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['lib/handlebars-v1.1.2.js', 'lib/jquery-1.10.2.min.js', 'lib/bootstrap.min.js', 'src/**/*.js'],
        dest: 'dist/teamtime-<%= pkg.version %>.js',
      },
    },

    jasmine: {
      sources: {
        src: 'src/**/*.js',
        options: {
          specs: 'spec/**/*.js'
        }
      },
      distribuition: {
        src: 'dist/teamtime-<%= pkg.version %>.js',
        options: {
          specs: 'spec/**/*.js'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('default', ['clean', 'jshint', 'uglify', 'concat', 'jasmine']);

};