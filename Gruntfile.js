// Wrapper函数
module.exports = function(grunt) {
  'use strict';

  // 引入安装的grunt插件
  require('load-grunt-tasks')(grunt);

  // 构建配置任务
  grunt.initConfig({

    // 读取package.json的内容，形成个json数据
    pkg: grunt.file.readJSON('package.json'),

    // 读取配置文件
    cfg: grunt.file.readJSON('config.json'),

    // 注释信息
    banner: '/*!\n' +
          ' * name:<%= pkg.name %>\n' +
          ' * version:<%= pkg.version %>\n' +
          ' * author:<%= pkg.company %>\n' +
          ' * date:<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' * Copyright (c)<%= grunt.template.today("yyyy") %>\n' +
          ' */',

    // 清除发布文件
    clean: {
      dist: {
        src: ['dist']
      }
    },

    // 编译sass
    sass: {
      dist: {
        options: {
          sourcemap: "none"
        },
        files: [
          {
            expand: true,
            cwd: '<%= cfg.src.sass %>',
            src: ['style.scss'],
            dest: '<%= cfg.dist.sass %>',
            ext: '.css'
          }
        ]
      }
    },

    // 压缩css
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= cfg.dist.sass %>',
          src: ['*.css', '!*.min.css'],
          dest: '<%= cfg.dist.sass %>',
          ext: '.css'
        }]
      }
    },

    // html替换
    includereplace: {
      dist: {
        options: {
          globals: {
            // 全局版本号，自动取时间
            pageVersion: '<%= grunt.template.today("yymmddhh") %>'
          },
          includesDir: 'html/fachina/common'
        },
        files: [{
          expand: true,
          cwd: '<%= cfg.src.html %>',
          dest: '<%= cfg.dist.html %>',
          src: ['**/*.html', '!common/**/*.html', '!template/**/*.html']
        }]
      }
    },

    // 模板预编译
    tmod: {
      template: {
        src: '<%= cfg.src.tpls %>/**/*.tpl',
        dest: '<%= cfg.dist.js %>/template.js',
        options: {
          base: '<%= cfg.src.tpls %>',
          helpers: '<%= cfg.src.tpls %>/templateHelper.js',
          cache: true,
          combo: true
        }
      }
    },

    // Js语法检查
    jshint: {
      options: {
        jshintrc: true,
        force: true
      },
      files: {
        src: [
          'static/**/*.js',
          '!static/common/js/libs/**/*.js'
        ]
      }
    },

    //压缩js文件
    uglify: {
      dist: {
        options: {
          banner: '<%= banner %>'
        },
        files: [
          {
            expand: true,
            cwd: '<%= cfg.src.js %>',
            src: ['**/*.js', '!**/*.min.js', '!tpls/**/*.js'],
            dest: '<%= cfg.dist.js %>'
          }
        ]
      }
    },

    // 复制文件
    copy: {
      fonts: {
        files: [
          {
            expand: true,
            cwd: '<%= cfg.src.fonts %>',
            src: ['**/*'],
            dest: '<%= cfg.dist.fonts %>'
          }
        ]
      },
      images: {
        files: [
          {
            expand: true,
            cwd: '<%= cfg.src.images %>',
            src: ['**/*.jpg', '**/*.png', '**/*.gif'],
            dest: '<%= cfg.dist.images %>'
          }
        ]
      },
      scripts: {
        files: [
          {
            expand: true,
            cwd: '<%= cfg.src.libs %>',
            src: ['**/*'],
            dest: '<%= cfg.dist.libs %>'
          }
        ]
      },
      html: {
        files: [{
          'dist/index.html':'index.html' // 展示首页
        }]
      }
    },

    // 本地服务
    connect: {
      options: {
        port: 9003,
        hostname: '*', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
        livereload: 35729  //声明给 watch 监听的端口
      },
      server: {
        options: {
          open: true, //自动打开网页 http://
          base: [
            'dist', 'data' //主目录
          ]
        }
      }
    },

    // 监听文件修改
    watch: {
      options: {
        dateFormat: function(time) {
          grunt.log.writeln('此次监听共历时' + time + '毫秒');
          grunt.log.writeln('程序监听中...');
        }
      },
      sass: {
        files: ['static/fachina/scss/**/*.scss'],
        tasks: ['sass', 'cssmin']
      },
      tomd: {
        files: ['<%= cfg.src.tpls %>/**/*.tpl'],
        tasks: ['tmod']
      },
      uglify: {
        files: ['static/fachina/**/*.js'],
        tasks: ['uglify']
      },
      other: {
        files: [
          'index.html',
          'html/**/*.html',
          'static/**/*.jpg',
          'static/**/*.png'
        ],
        tasks: ['copy', 'includereplace']
      },
      livereload: {
        options: {
          livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
        },
        files: ['dist/**/*']  //文件的改变就会实时刷新网页
      }
    }
  });

  // 执行Grunt任务
  grunt.registerTask('default',
    ['clean:dist', 'sass', 'cssmin', 'includereplace', 'tmod', 'jshint', 'uglify', 'copy', 'connect', 'watch']
  );
};