
'use strict';


/* TODO:
 Mutliple linked lists
 Maybe:

 FileList, HashList, DirList

 File {
 	filename: string,
 	directory: Directory
	hash: Hash
 }

 Hash {
 	sha1: string,
	files: {File indexed list}
 }

 Directory {
 	path: string,
	files: {File indexed list}
 }

DirectoryList {
	items: {Directory indexed list}
}

Functions as methods
Eg: 
DirectoryList.getCombinations()
HashList.merge(someHashItem)
.unique() sounds better than .merge()
*/


function File(path) {
	if(path) {
		this.path = path;
	} else {
		this.path = undefined;
	}
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


function Hash(sha1) {
	if(sha1) {
		this.sha1 = sha1;
	} else {
		this.sha1 = undefined;
	}
	this.files = {}; // FileItems
}


function Directory(dirname) {
	if(dirname) {
		this.dirname = dirname;
	} else {
		this.dirname = undefined;
	}
	this.files = {}; // FileItems
}

function DirectoryList() {
	this.items = {}; // [DirItem]
}

// returns newly added dirItem
DirectoryList.prototype.add = function(dir) {
	if (!(dir instanceof Dir)) {
		throw new Error("Invalid argument");
	} else if (typeof dir.dirname == "string") {
		throw new Error("Dirname missing");
	} else  {
		var dirname = dir.dirname;
		if(!(dirname in this.items)) {
			this.items[dirname] = dir;
			return(this);
		} else {
			throw new Error("Directory " +  dirname + " has already been added");
		}
	} 
}

DirectoryList.prototype.merge = function(dir) {
}


// must check code below
DirectoryList.prototype.fromHashList = function(hashList) {
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
	return this;
}

module.exports = {
	File,
	Hash,
	Directory,
	DirectoryList
};

// =============

// Code below is for reference

/*
 * @param {HashList} hash
 * @return {DirList} 
 */

const DUPLICATE = 0;
const UNIQUE = 1;

const hash = {};

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
