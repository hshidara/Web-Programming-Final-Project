// Globals
var sqlite3 = require("sqlite3").verbose();  // use sqlite
var fs = require("fs");

var dbFileName = "Collection.db";
var db = new sqlite3.Database(dbFileName);

// Initialize table.
var cmdStr = "CREATE TABLE photos (idNum INTEGER UNIQUE NOT NULL PRIMARY KEY , fileName TEXT, tags TEXT)";
db.run(cmdStr,tableCreationCallback);

// Callback checks error
function tableCreationCallback(err) {
    if (err) {
	console.log("Table creation error",err);
    } else {
	console.log("Database created");
	db.close();
    }
}
