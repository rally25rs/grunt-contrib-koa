'use strict';

var koa = require('koa');

module.exports = function(grunt) {
   	grunt.registerMultiTask('koa', 'Start a koa web server.', function() {
	    var done = this.async();
	    var httpServer;
	    var koaApplication = koa();
	    var port = 8080;

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
	    process.on('SIGINT', onSigint);

	    httpServer = koaApplication.listen(port, function () {
	    	grunt.log.writeln('  Koa server listening on http://localhost:' + port);
	    	grunt.log.writeln('  Press <Ctrl>-c to stop the Koa server.');
	    });
	});
};
