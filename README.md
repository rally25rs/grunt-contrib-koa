# grunt-koa

This is a [Grunt](http://gruntjs.com/) task for running a [Koa](http://koajs.com/) web server.

## Installing

```
npm install grunt-koa --save-dev
```

## Configuration

Example of serving static content. This is useful if you just want to serve a set of static files from a build directory at the end of your grunt build. This example serves content from the `static/` directory.

```
	grunt.initConfig({
		koa: {
			serve: {
				options: {
					static: 'static'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-koa');

	grunt.registerTask('default', ['koa:serve']);

```

Example of custom middleware. This is useful when you want to run a Koa server with a set of middleware installed.

```
	var sampleMiddleware = function *(next) {
		grunt.log.writeln('sample middleware');
		yield next;
	};

	grunt.initConfig({
		koa: {
			serve: {
				options: {
					middleware: [sampleMiddleware]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-koa');

	grunt.registerTask('default', ['koa:serve']);
```

### port (type: number, default: 8000)

Specifies the port to run Koa on.

### static (type: string, default: null)

A path to serve static files from, relative to where Grunt is executed. If this option is specified, then the `koa-static` middleware will automatically be installed and set to serve static files using this option as the path.

### middleware (type: array or function, default: null)

If this options is used to install middleware(s) into Koa. It should be set to an array of middleware functions, or a function which will be called with a reference to the Koa application. If this is set to a function, it should take the form `function (koaApplication) {}` and should register middleware on the passed in Koa application object. For example, these two configurations would be functionally the same:

```
	grunt.initConfig({
		koa: {
			serve: {
				options: {
					middleware: [someMiddleware, moreMiddleware];
				}
			}
		}
	});

	grunt.initConfig({
		koa: {
			serve: {
				options: {
					middleware: function(koaApplication) {
						koaApplication.use(someMiddleware);
						koaApplication.use(moreMiddleware);
					}
				}
			}
		}
	});
```

### livereload (type: boolean, default: false)

*Not Yet Implemented. Coming Soon!* If enabled, the `koa-livereload` middleware will be automatically loaded.
