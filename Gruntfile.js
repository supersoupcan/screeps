module.exports = function(grunt){
  
  var config = require('./.config.json');
  var branch = grunt.option('branch') || config.branch;
  var email = grunt.option('email') || config.email;
  var password = grunt.option('password') || config.password;
  var ptr = grunt.option('ptr') ? true : config.ptr

  grunt.loadNpmTasks('grunt-screeps')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.initConfig({
    screeps: {
      options : {
        email: email,
        password: password,
        branch: branch,
        ptr: ptr,
      },
      dist: {
        src : ['src/*.js']
      }
    },
    clean: {
      'dist': ['dist']
    },
    copy: {
      screeps: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**',
          dest: 'dist/',
          filter: 'isFile',
          rename: function (dest, src) {
            return dest + src.replace(/\//g,'_');
          }
        }],
      }
    }
  })

  grunt.registerTask('default',  ['clean', 'copy:screeps', 'screeps']);
}