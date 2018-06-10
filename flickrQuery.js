var APIrequest = require('request');

var sqlite3 = require("sqlite3").verbose();
var dbFileName = "Collection.db";
var db = new sqlite3.Database(dbFileName);


// what to do on a query
// entry point for module
function handler (request, response, url) {
    var query = url.substr(6); // position 6 thru end
    var type = query.split("=")[0];
    // var params = query.split("=")[1];
    // does not work if there are more than one parameters separated by "&"
    var params = query.split("&");
    if (type == "?tags") { handleTagQuery(params, response); }
    else if (type == "?src") { handleAddQuery(params, response); }
    else { badQuery(response); }
}

//Problem #9 on practice final

var img_ct = 0;
function handleAddQuery (params, response) {
    	console.log(params);
	let cmdStr = ' INSERT OR REPLACE INTO photos VALUES ('+(img_ct++)+','+'"'+params[0].replace("?src=","") +'"'+','+'"'+ params[1].replace("tags=","") +'"'+') ';
	console.log(cmdStr);
	db.run(cmdStr,dbCallback);

	// Callback checks error
	function dbCallback(err) {
	    if (err) {
		console.log("Table creation error",err);
	    } else {
		console.log("query added");
		dumpDB();
	    }
	}	
    
}

function dumpDB() {
  db.all ( 'SELECT * FROM photos', dataCallback);
      function dataCallback( err, data ) {
                console.log(data);
      		db.close();
      }
}

// answer a tag query by getting answer from flickr API
function handleTagQuery ( params, response ) {

    // the begininng of the query URL
    const APIurl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=766088011c39025e7563742fcd2ba8b3&per_page=12&format=json&nojsoncallback=1&sort=relevance&tag_mode=all&tags="

    // check input.  Always important on the server.
    // var tags = params.split("+");
    // need to change because params is now an array
    var tags = params[0].split("=")[1].split("+");
    tags.map(function (n) { decodeURI(n).trim(); });
    for (let i=0; i<tags.length; i++) {
	tags[i] = decodeURI(tags[i]).trim();
	if (/[^a-zA-Z ]/.test(tags[i])) {
	    console.log("bad query", tags[i]);
	    badQuery(response);
	    tags = [];
	    break;
	}
    }
    
    // construct query 
    if (tags.length > 0) {
	var query = APIurl+tags[0];
	for (let i=1; i< tags.length; i++) {
	    query = query+","+tags[i];
	}
	
	// API call to get selection of photos from Flickr
	// The call that makes a request to the API
	APIrequest(
	    { // HTTP header stuff
		url: query,
		method: "GET"
	    },
	    // callback function for API request
	    APIcallback
	);
	console.log("Sent request", query);
    }

    // closure will contain the response object
    function APIcallback (err, object) {
	console.log("in callback");
	sendResponseToBrowser(err, object, response);
    }
}


// just like in demo code for photoq
function sendResponseToBrowser(err, object, response) {
    if (err) {
	console.log("Error", err);
    } else {
	response.writeHead(200, {"Content-Type": "text"});
	jsonList = JSON.stringify(object); 
	response.write(jsonList);
	response.end();
    }
}

// just like in demo code for photoq
function badQuery(response) {
    response.writeHead(400, {"Content-Type": "text"});
    response.write("bad query");
    response.end();
}
    

exports.handler = handler;

