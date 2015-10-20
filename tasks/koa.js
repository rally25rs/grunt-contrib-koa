'use strict';

var koa = require('koa');
var koaStatic = require('koa-static');
var path = require('path');

var SOCKET_TIMEOUT = 2000;
var DEFAULT_PORT = 8000;

module.exports = function(grunt) {
   	grunt.registerMultiTask('koa', 'Start a koa web server.', function() {
	    var done = this.async();
	    var httpServer;
	    var koaApplication = koa();
	    
        // Merge task-specific options with these defaults.
		var options = this.options({
			port: DEFAULT_PORT,
			static: null,
			livereload: false,
			middleware: null
		});

		var addKoaErrorHandling = function() {
			koaApplication.on('error', function(err, errorContext){
				grunt.log.error('>  Koa server error: ', err);

				// according to the koa docs, if there is an error and the server can not reply to the client, then context will be non-null.
				// this seems like a good reason to stop the server at this point.
				if(errorContext) {
					closeKoaServer();
				}
			});
		};

		var addKoaMiddleware = function() {
			var staticPath;

			if(options.static) {
				staticPath = path.join(process.cwd(), options.static);
				grunt.log.writeln('  Serving static files from: ' + staticPath);
				koaApplication.use(koaStatic(staticPath, {
				}));
			}

			if(options.middleware) {
				if(typeof(options.middleware) === 'function') {
					options.middleware(koaApplication);
				} else if (options.middleware instanceof Array) {
					for(var i = 0; i < options.middleware.length; i++) {
						koaApplication.use(options.middleware[i]);
					}
				} else {
					grunt.log.error('koa.options.middleware must be a function or an array of middlewares.');
					done();
				}
			}
		};

		// we attempt a graceful shutdown by calling server.close() which will stop listening for requests
		// the server will then halt and this callback will be called when all sockets have timed out.
		// this is why we set the socket timeout to shorter than the default, otherwise it would take 2 min to close the server.
		var closeKoaServer = function() {
		    grunt.log.write('Stopping Koa Server...');

			httpServer.close(function() {
				grunt.log.writeln(' Koa Server Stopped.');
				done();
			});	
		};

		var onSigint = function() {
			closeKoaServer();
		};

	    grunt.log.writeln('Starting Koa Server...');

	    addKoaErrorHandling();
	    addKoaMiddleware();

	    process.on('SIGINT', onSigint); // triggered when the user presses ctrl+c

	    httpServer = koaApplication.listen(options.port, function () {
	    	grunt.log.writeln('  Koa server listening on http://localhost:' + options.port);
	    	grunt.log.writeln('  Press <ctrl>+c to stop the Koa server.');
	    });
	    httpServer.setTimeout(SOCKET_TIMEOUT);
	});
};
