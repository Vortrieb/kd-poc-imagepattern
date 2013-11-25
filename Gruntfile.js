module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		compass: {
			dev: {
				options: {
					sassDir: 'sass',
					cssDir: 'public/stylesheets',
				}
			}
		},

		autoprefixer: {
			options: {
				// default:
				// browsers: ['> 1%', 'last 2 versions', 'ff 17', 'opera 12.1']
			},

			css: {
				src: 'public/stylesheets/screen.css'
			}
		},

		csso: {
			compress: {
				options: {
					report: 'gzip',
					banner: '/* :) */'
				},

				files: {
					'public/stylesheets/screen.css': ['public/stylesheets/screen.css']
				}
			}
		},

		uglify: {
			compact: {
				files: {
					'public/js/scripts.min.js': [
						'public/js/main.js'
					]
				}
			}
		},

		express: {
			options: {
				script: 'app.js'
			},
			dev: {
				options: {
					script: 'app.js',
					node_env: 'development',
				}
			}
		},

		simplemocha: {
			dev: {
				src: [ "test/*_test.js", "test/**/*_test.js"],
				options: {
					reporter: 'spec',
					slow: 200,
					timeout: 1000
				}
			},
			src: ['test/*_test.js', 'test/**/*_test.js']
		},

		watch: {
			simplemocha: {
				files: ['lib/*.js', 'test/*_test.js', 'test/**/*_test.js'],
				tasks: ['simplemocha:dev']
			},

			javascript: {
				files: ['public/js/*.js'],
				options: {
					livereload: true
				}
			},

			express: {
				files: [
					'app.js', 'lib/*.js', 'lib/**/*.js'
				],
				tasks: ['express:dev'],
				options: {
					nospawn: true,
					livereload: true
				}
			},

			compass: {
				files: ['sass/*.scss'],
				tasks: ['compass', 'autoprefixer', 'csso'],
				options: {
					livereload: true
				}
			},

			livereload: {
				options: {
					livereload: true,
				},
				files: [
					'public/stylesheets/*.css',
					'views/*.mustache'
				],
			}
		}
	});

	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-csso');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-simple-mocha');

	grunt.registerTask('server', [ 'express:dev', 'watch' ])
};
