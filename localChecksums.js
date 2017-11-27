const path = require('path');
const sha1File = require("sha1-file");
const fs = require('fs');

// parse arguments
const minimist = require("minimist");
var args = minimist(process.argv.slice(2),{
	alias: {
		d: "directory",
		o: "output-file"
	},
	default: {
		o: "local/localHashes.txt"
	}
});


function processFile(f) {
	var sha1 = sha1File(f);
	process.stdout.write( sha1 + " " + f + "\n" );
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
	var isAlreadyProcessed = (entry) => {
		return (entry[1] == path);
	}
	return (previouslyProcessed.filter(isAlreadyProcessed).length == 0);
}

function recursiveProcessDirectory(path, previouslyProcessed) {
	const recursiveReaddir = require("recursive-readdir");

	recursiveReaddir(args.d, (err, files) => {
		if(err) {
			throw new Error(err);
		}
		files.forEach((file) => {
			if(!previouslyProcessed || fileProcessed(file, previouslyProcessed)) {
				processFile(file);
				process.stderr.write('w');
			} else {
				process.stderr.write('s');
			}
		});
	})
}

try {
	// normalize trailing slashes
	args.d = args.d.replace(/[\/\\]$/,'') + path.sep;
	var previouslyProcessed = null;
	if(args.o && fileAccessible(args.o)) {
		previouslyProcessed = fs.readFileSync(args.o).toString().split("\n").map((line)=>{
			// return line.split(/(?<=$[^ ]) /);
			var separatorIndex = line.indexOf(' ');
			return [line.substring(0, separatorIndex), line.substring(separatorIndex + 1)];
		});
	}
	recursiveProcessDirectory(args.d, previouslyProcessed);
} catch(e) {
	console.dir(e);
	console.log("----------");
	// console.log("Usage: " + process.argv[1].split(path.sep).pop() + " -d input-directory");
	console.log("Usage: " + process.argv[1].split(path.sep).pop() + " -d input-directory [-o output-file]");
	console.log("Optional parameter -o points to a list of previously processed files that will be skipped");
}
