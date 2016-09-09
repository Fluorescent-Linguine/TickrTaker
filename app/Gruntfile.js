module.exports = function(grunt) {

//config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    processhtml: {
      dist: {
        files: {
          'compiled/index.html': ['index.html']
        }
      }
    },
    shell: {
      options: {
        stderr: false
      },
      compile: {
        command: 'webpack'
      },
      startDevServer: {
        command: 'node start.js'
      },
      eslint: {
        command: 'eslint "**/*.js" "**/*.jsx"'
      }
    },

    clean: ['compiled/*']
  });

//dependencies
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-processhtml');

//tasks
  grunt.registerTask('build', [
    'clean',
    'shell:compile',
    'processhtml'     
  ]);

  grunt.registerTask('eslint', ['shell:eslint']);
  
  grunt.registerTask('start', ['shell:startDevServer']);
};