module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    copy:
      build:
        cwd: 'src'
        src: [ '**', '!**/*.ts' ]
        dest: 'build'
        expand: true
    clean:
      build:
        [ 'build' ]
    ts:
      base:
        src: ["src/**/*.ts"]        #The source typescript files, http://gruntjs.com/configuring-tasks#files
        #html: ["test/work/**/*.tpl.html"], # The source html files, https://github.com/basarat/grunt-ts#html-2-typescript-support
        reference: "build/reference.ts",  # If specified, generate this file that you can use for your reference management
        #out: 'test/out.js',             # If specified, generate an out.js file which is the merged js file
        outDir: 'build'                  # If specified, the generate javascript files are placed here. Only works if out is not specified
        #watch: 'src'                     # If specified, watches this directory for changes, and re-runs the current target
        options:                         #use to override the default options, http://gruntjs.com/configuring-tasks#options
          target: 'es3',                 # 'es3' (default) | 'es5'
          module: 'amd',                 # 'amd' (default) | 'commonjs'
          sourceMap: true,               # true (default) | false
          declaration: true,             # true | false (default)
          removeComments: true           # true (default) | false
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
  grunt.loadNpmTasks 'grunt-ts';
  grunt.loadNpmTasks 'grunt-contrib-watch';
  grunt.loadNpmTasks 'grunt-plato';
  grunt.loadNpmTasks 'grunt-install-dependencies';

  grunt.registerTask 'default', 'Compiles all of the assets and copies the files to the build directory.', [ 'init' ]
  grunt.registerTask 'clear', 'Clears all files from the build directory.', [ 'clean' ]
  grunt.registerTask 'init', 'Compiles all of the assets and copies the files to the build directory.', [ 'build', 'doc' ]
  grunt.registerTask 'build', 'Builds the application', [ 'install-dependencies', 'clean', 'copy', 'ts' ]
  grunt.registerTask 'doc', 'Builds the application documentation', [ 'plato', 'shell:codo' ]
