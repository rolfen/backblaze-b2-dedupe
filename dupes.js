
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
		case "affinity":
			/*
				

				Alternative: 
				Compile a list of UniqueFile objects
				We sort of already have this in the gloabl hash object
				But I guess it would be nice to have the sha1 inside the object so that we can move it around without loosing this information.
				We can then also add properties / methods.
				(but do we need to?)

				
				uniqueFile {
					sha1 89278ca987e9ae772d01f9278ca987de8a717e9a
					paths [
						/a/b/file.orf
						/x/y/sameFile.orf
					]
				}

				Then group them in directory sets
				Then it will be fast to find intersection by comparing object references
				Maybe we don't need set-manipulator

				Alternative:
				Keep it as it is now, and add directory set arrays of sha1 string,
				and compare using the set-manipulator module

				In any case would be nice to use "classes" to abstract and decouple these details from the code
			
			*/

			// todo: unit testing
			
			/*
			const affinity = {};
			const directories = {};
			const intersections = {};
			function Set() {
				this.intersections = {};
			}
			function Intersection() {
				this.set0 = undefined; // holds reference to set0
				this.set1 = undefined; // as above
				this.points = [];
			}
			function SetList() {
				this.set = {};
			} 
			SetList.prototype.addIntersection = function(set0, set1, point) {
				if(!this.sets[set0]) {

				}
			}
			DirectoryList.prototype.
			function addIntersection(dir0, dir1, path) {
				var intersection = {
					'path' : path
				};
				directories[dir0] = intersection;
				directories[dir1] = intersection;
			}
			*/
			for(var sha in hash) {
				if(hash.hasOwnProperty(sha)) {
				}
			}
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
