// global variables
var static = require('node-static');
var http = require('http');
var query = require('./flickrQuery');

// create a Web server instance
var webServer = http.createServer(handler);

// Create a node-static server instance to serve the './public' folder
var fileServer = new static.Server('./public');

// And start listening for the arrival of http requests
webServer.listen(57987);

// called on http request arrival event
function handler (request, response) {
//    var fileServer = new static.Server('./public');

    // wait for end of request
    request.addListener('end', function () {

	// is it a query? 
	url = request.url;
	if (url.indexOf("/query") == 0) {
	    // call handler function in query module
	    query.handler(request,response,url);
	}
	
	// otherwise try to serve a static file
	else {
	    fileServer.serve(request, response, function (e, res) {
	    if (e && (e.status === 404)) { // If the file wasn't found
		fileNotFound(request, response);
	      } //if 
	    } // function
			    ); // call to fileServer.serve
	} // else
	
    } // anonymous listener function 
		       ).resume(); // keep listening...
}

// what to do when file not found
function fileNotFound (request, response) {
    fileServer.serveFile('/not-found.html', 404, {},request, response);
}

