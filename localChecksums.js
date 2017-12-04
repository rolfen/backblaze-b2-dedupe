const path = require('path');
const sha1File = require("sha1-file");
const fs = require('fs');

// parse arguments
const minimist = require("minimist");
var args = minimist(process.argv.slice(2),{
	alias: {
		d: "directory",
		s: "skip"
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

function fileAccessible(f) {
	try {
		fs.accessSync(f);
		return(true);
	} catch(e) {
		return(false);
	}
}

function fileProcessed(path, previouslyProcessed) {
	return previouslyProcessed.includes(path);
}

function recursiveProcessDirectory(path, previouslyProcessed) {
	const recursiveReaddir = require("recursive-readdir");
	var skippedFiles = 0;
	var processedFiles = 0;
	var lastOp = 0;

	recursiveReaddir(path, (err, files) => {
		if(err) {
			throw new Error(err);
		}
		var fileCount = files.length;
		files.forEach((file, i) => {
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

try {
	// normalize trailing slashes
	var dirPath = args.d.replace(/[\/\\]$/,'') + path.sep;
	var skipListFile = args.o;
	var previouslyProcessed = null;
	if(skipListFile && fileAccessible(skipListFile)) {
		previouslyProcessed = fs.readFileSync(skipListFile).toString().split("\n").map((line)=>{
			// return line.split(/(?<=$[^ ]) /);
			var separatorIndex = line.indexOf(' ');
			return line.substring(separatorIndex + 1);
			// return [line.substring(0, separatorIndex), line.substring(separatorIndex + 1)];
		});
	}
	recursiveProcessDirectory(dirPath, previouslyProcessed);
} catch(e) {
	console.error(e);
	console.error("----------");
	console.error("Usage: " + process.argv[1].split(path.sep).pop() + " -d input-directory [-s skip-list]");
	console.error("Optional parameter -o points to a list of previously processed files that will be skipped");
}
