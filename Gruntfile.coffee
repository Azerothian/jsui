module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    copy:
      build:
        cwd: 'src'
        src: [ '**', '!**/*.coffee' ]
        dest: 'build'
        expand: true
    clean:
      build:
        [ 'build' ]
    coffee:
      lib:
        files:[
          expand: true
          cwd: 'src'
          src: ['**/*.coffee']
          dest: 'build'
          ext: '.js'
        ]
    watch:
      files: [
        'Gruntfile.coffee'
        'src/**/*'
        'package.json'
      ]
      tasks: ['init']
    plato:
      default:
        files:
          'report/': ['build/**/*.js']

          
    shell: 
      codo: 
        options:
          stdout: true
        command: 'codo ./src'
      projectz: 
        options:
          stdout: true
        command: 'projectz compile'

  grunt.loadNpmTasks 'grunt-shell';
  grunt.loadNpmTasks 'grunt-contrib-copy';
  grunt.loadNpmTasks 'grunt-contrib-clean';
  grunt.loadNpmTasks 'grunt-contrib-coffee';
  grunt.loadNpmTasks 'grunt-contrib-watch';
  grunt.loadNpmTasks 'grunt-plato';
  grunt.loadNpmTasks 'grunt-install-dependencies';

  grunt.registerTask 'default', 'Compiles all of the assets and copies the files to the build directory.', [ 'init' ]
  grunt.registerTask 'clear', 'Clears all files from the build directory.', [ 'clean' ]
  grunt.registerTask 'init', 'Compiles all of the assets and copies the files to the build directory.', [ 'build', 'doc' ]
  grunt.registerTask 'build', 'Builds the application', [ 'install-dependencies', 'clean', 'copy', 'coffee' ]
  grunt.registerTask 'doc', 'Builds the application documentation', [ 'plato', 'shell:codo' ]
