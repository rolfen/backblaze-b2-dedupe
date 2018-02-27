const path = require('path');
const sha1File = require("sha1-file");
const fs = require('fs');

// parse arguments
const minimist = require("minimist");
var args = minimist(process.argv.slice(2),{
	alias: {
		d: "directory",
		s: "skip",
		h: "help"
	}
});


function processFile(f) {
	try {
		var shaSum = sha1File(f);
		process.stdout.write( shaSum + " " + f + "\n" );
	} catch(e) {
		console.error("SHA1 failed: " + f);
		console.error(e);
	}
}

/*
function fileAccessible(f) {
	try {
		fs.accessSync(f);
		return(true);
	} catch(e) {
		return(false);
	}
}
*/

function fileProcessed(path, previouslyProcessed) {
	return previouslyProcessed.includes(path);
}

function recursiveProcessDirectory(path, previouslyProcessed) {
	const recursiveReaddir = require("recursive-readdir");
	var skippedFiles = 0;
	var processedFiles = 0;
	var lastOp = 0; // code for "last operation"

	recursiveReaddir(path, (err, files) => {
		if(err) {
			throw new Error(err);
		}
		var fileCount = files.length;
		files.forEach((file, i) => {
			// prints updates during the process
			// todo: refactor this thing
			if(!previouslyProcessed || !fileProcessed(file, previouslyProcessed)) {
				if(lastOp == 2 || (i+1 == fileCount)) {
					console.error("Skipped " + skippedFiles + " files")
					skippedFiles = 0;
				}
				processedFiles ++;
				lastOp = 1;
				processFile(file);
			} else {
				if(lastOp == 1 || (i+1 == fileCount)) {
					console.error("Processed " + processedFiles + " files")
					processedFiles = 0;
				}
				skippedFiles ++;
				lastOp = 2;
			}
		});
	})
}

function printHelp() {
	console.error("Usage: " + process.argv[1].split(path.sep).pop() + " -d input-directory [-s skip-list]");
	console.error("Optional parameter -s points to a list of previously processed files that will be skipped");	
}

function parseHash(line) {
	var separatorIndex = line.indexOf(' ');
	return line.substring(separatorIndex + 1);
}

try {
	// normalize trailing slashes
	if(args.h) {
		printHelp();
	} else {
		var skipListFile = args.s;
		if(skipListFile) {
			var previouslyProcessed = fs
				.readFileSync(skipListFile)
				.toString()
				.split("\n")
				.map(parseHash)
			;
		} 

		var dirPath = args.d;
		if(dirPath) {
			dirPath = dirPath.replace(/[\/\\]$/,'') + path.sep;
			recursiveProcessDirectory(dirPath, previouslyProcessed);
		}
	}
} catch(e) {
	console.error(e);
	console.error("----------");
	printHelp();
}
