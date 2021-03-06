/*jshint node:true */
module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('component.json'),
		meta: {
			banner: '/*!\n' +
				' * <%= pkg.name %> <%= pkg.version %> - <%= grunt.template.today("dS mmm yyyy") %>\n' +
				' * <%= pkg.homepage %>\n' +
				' *\n' +
				' * Licensed under the <%= pkg.licenses[0].type %> license.\n' +
				' * <%= pkg.licenses[0].url %>\n' +
				' */\n',
			bannerLight: '/*! <%= pkg.name %> <%= pkg.version %>' +
				' - <%= grunt.template.today("dS mmm yyyy") %> | <%= pkg.homepage %> */'
		},

		// JSHint the code.
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['src/*.js']
		},

		// Clean folders.
		clean: {
			dist: ['dist/**', '!dist']
		},

		// Concatenate files.
		concat: {
			dist: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: 'src/sly.js',
				dest: 'dist/sly.js'
			}
		},

		// Minify with Google Closure Compiler.
		gcc: {
			dist: {
				options: {
					banner: '<%= meta.bannerLight %>'
				},
				src: 'src/sly.js',
				dest: 'dist/sly.min.js'
			}
		},

		// Compress files.
		compress: {
			dist: {
				options: {
					mode: 'gzip'
				},
				src: 'dist/sly.min.js',
				dest: 'dist/sly.min.js.gz'
			}
		},

		// Bump up fields in JSON files.
		bumpup: ['component.json', 'sly.jquery.json'],

		// Commit changes and tag the latest commit with a version from JSON file.
		tagrelease: ['component.json']
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-tagrelease');
	grunt.loadNpmTasks('grunt-bumpup');
	grunt.loadNpmTasks('grunt-gcc');

	// Build task.
	grunt.registerTask('build', function () {
		grunt.task.run('jshint');
		grunt.task.run('clean');
		grunt.task.run('concat');
		grunt.task.run('gcc');
	});

	// Release task.
	grunt.registerTask('release', function (type) {
		type = type ? type : 'patch';
		grunt.task.run('build');
		grunt.task.run('bumpup:' + type);
		grunt.task.run('tagrelease');
	});

	// Default task.
	grunt.registerTask('default', ['jshint']);
};