
'use strict';

const readline = require('readline');
const minimist = require("minimist");

const DUPLICATE = 0;
const UNIQUE = 1;

var hash = {};

// parse arguments
var args = minimist(process.argv.slice(2),{
	alias: {
		/* put flags here
		i: "inverse",
		l: "local",
		r: "remote"
		*/
	}
});

var lineRead = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function mdAdd(key, val, hash) {
	if(!(key in hash)) {
		hash[key] = [];
	} 
	hash[key].push(val);
}


lineRead.on('line', function (line) {
	var sha = line.substr(0, 40);
	var path = line.substr(41);
	mdAdd(sha, path, hash);
});

lineRead.on('close', function (line) {
	switch(process.argv[2]) {
		case "count":
		break;
		case "dirs":
			const path = require('path');
			var dir = {};
			for(var sha in hash) {
				if(hash.hasOwnProperty(sha)) {
					hash[sha].forEach(function(file){
						var dirEntry;
						var dirname = path.dirname(file);
						var basename = path.basename(file);
						if(!(dirname in dir)) {
							dir[dirname] = [[],[]];
						}
						dirEntry = dir[dirname];
						if(hash[sha].length > 1) {
							dirEntry[DUPLICATE].push(basename);
						} else if (hash[sha].length == 0){
							dirEntry[UNIQUE].push(basename);							
						}
						dir[dirname] = dirEntry;
					});
				}
			}
			for(var dirname in dir) {
				if(dir.hasOwnProperty(dirname) && (dir[dirname][DUPLICATE].length > 0)) { 
					process.stdout.write(dirname + "\n");
					process.stdout.write("Dupe: " + dir[dirname][DUPLICATE].length + "\n");
					process.stdout.write("Uniq: " + dir[dirname][UNIQUE].length + "\n");
					process.stdout.write("\n");
				}
			}
		break;
		default:
			for(sha in hash) {
				if(hash.hasOwnProperty(sha)) {
					var files = hash[sha];
					if(files.length > 1) {
						process.stdout.write(
							sha + "\n" + files.join("\n") + "\n\n"
						);
					}
				}
			}
		break;
	}
});
