
'use strict';

const readline = require('readline');
const minimist = require("minimist");
const HashCollection = require("./modules/dupes/index.js").HashCollection;
const DirectoryCollection = require("./modules/dupes/index.js").DirectoryCollection;
const File = require("./modules/dupes/index.js").File;
const connect = require("./modules/dupes/index.js").connect;



// Util

function countKeys(o) {
	return (Object.keys(o).length);
}

// forEach() for objects
function forEachProp(o, func) {
	var propNames = Object.keys(o);
	propNames.forEach(function(propName){
		func(o[propName], propName, o);
	})
}

function mapProps(o, func) {
	// ?
}

// end Util


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

var verb = process.argv[2];
var hashes = new HashCollection();

var lineRead = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


lineRead.on('line', function (line) {
	var sha = line.substr(0, 40);
	var path = line.substr(41);
	var hash = hashes.unique(sha);
	var file = new File(path);
	connect(hash, file);
});


lineRead.on('close', function (line) {
	switch(verb) {
		case "test":
			const assert = require('assert');
			console.log("forEachProp");
			var obj = {
				p1 : "First Prop",
				p2 : "Prop Two"
			};
			var res = '';
			forEachProp(obj, function(v, k, o) {
				res += v + k + JSON.stringify(o)
			})
			assert.strictEqual(res, 
				obj['p1'] + 'p1' + JSON.stringify(obj) 
				+ obj['p2'] + 'p2' + JSON.stringify(obj)
			);
		break;
		case "list-hashes":
			Object.keys(hashes).forEach((h)=>{
				process.stdout.write(h + "\n");
			});
		break;
		case "count":
			Object.keys(hashes).forEach((h)=>{
				var count = countKeys(hashes[h].files);
				if(count > 1) {
					process.stdout.write(h + ' ' + count + "\n");
				}
			});
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
			var so = require('setops');
			
			var dir = dirList(hash);
			var combinations = [];
			var paths = Object.keys(dir);
			// find all combinations of hashes
			paths.forEach(function(hashA, i){
				paths.slice(i+1).forEach(function(hashB){
					combinations.push([hashA, hashB]);
					console.log('[' + hashA + ', ' + hashB + ']' );
				});
			});
		break;
		case "dirlist":
			const path = require('path');
			var dirs = new DirectoryCollection();
			forEachProp(hashes, function(hashItem, hash){
				forEachProp(hashItem.files, function(fileItem, filePath){
					var dirPath = path.dirname(filePath);
					var dirItem = dirs.unique(dirPath);
					dirItem.value = dirPath;
					debugger;
					connect(fileItem, dirItem);
				});
			});
			forEachProp(dirs, function(dirItem, dirPath){
				process.stdout.write(dirname + "\n");
			})
		break;
		case "dirs":
			var dir = dirList(hash)
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
