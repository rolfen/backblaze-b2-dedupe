
'use strict';

const DUPLICATE = 0;
const UNIQUE = 1;

var hash = {};


/* TODO:
 Mutliple linked lists
 Maybe:

 FileList, HashList, DirList

 FileItem {
 	path: string (or dirname/basename?),
 	directory: DirItem
	hash: HashItem
 }

 HashItem {
 	sha1: string,
	files: FileList
 }

 DirItem {
 	path: string,
	files: FileList
 }

Functions as methods
Eg: DirList.getCombinations()

*/

function FileItem() {
	this.path = undefined;
	this.directory = undefined;
	this.hash = undefined;
}

function FileList() {
	this.items = {};
}

FileList.prototype.add = function(fileItem) {
	if(!fileItem.path) {
		throw new Error("Need path to add");
	} else if(fileItem.path in this.files) {
		throw new Error("File " + filePath + " already added");
	} else {
		this.items[fileItem.path] = fileItem;
		return(fileItem);
	}	
}


function HashItem() {
 	this.sha1 = undefined; // string,
	this.fileItem = new FileList(); // [FileItem]
}

/*
HashItem.prototype.addFile = function(fileItem) {
	var filePath = 
	if(filePath in this.files) {
		throw new Error("File " + filePath + " already added");
	} else {
		this.fileItems.push(filePath);
		return(filePath);
	}
}
*/

// HashItem.prototype.addFileIfNotExists ?

function DirItem() {
	this.dirname = undefined; // string
	this.fileItems = []; // [FileItem]
}

function DirList() {
	this.dirItems = []; // [DirItem]
}

DirList.prototype.addDir = function(dirname) {
	var dirItem = new DirItem();
	dirItem.dirname = dirname;
	return this.addDirItem(dirItem);
}

// returns newly added dirItem
DirList.prototype.addDirItem = function(dirItem) {
	if(typeof dirItem.dirname == "string") {
		var dirname = dirItem.dirname;
		if(!(dirname in this.dirItems)) {
			dirItem = new DirItem();
			this.dirItems[dirname] = dirItem;
			return(dirItem);
		} else {
			throw new Error("Directory " +  dirname + " has already been added");
		}
	} else {
		throw new Error("dirItem.dirname must be set");
	}
}

DirList.prototype.fromHashList = function(hashList) {
	const path = require('path');
	for(var sha1 in hash) {
		if(hashList.hasOwnProperty(sha1)) {

			hash[sha].forEach(function(file){
				var dirEntry = new DirItem();
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
	return dir;
}


/*
 * @param {HashList} hash
 * @return {DirList} 
 */
function dirList(hash) {
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
	return dir;
}

function mdAdd(key, val, hash) {
	if(!(key in hash)) {
		hash[key] = [];
	} 
	hash[key].push(val);
}


function skipThis() {
	return false;

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
				var dir = dirList(hash)
				for(var dirname in dir) {
					if(dir.hasOwnProperty(dirname)) { 
						process.stdout.write(dirname + "\n");
					}
				}
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

}

module.exports = {
	HashItem,
	DirItem,
	DirList
};
