const readline = require('readline');
const minimist = require("minimist");

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


lineRead.on('line', function (line) {
	var sha, path;
	[sha, path] = line.split('/ +/', 2);
	if(sha in hash) {
		// exists
		hash[sha].push(path);
	} else {
		// new
		hash[sha] = [path];
	}
});

lineRead.on('close', function (line) {
	debugger;
	for(sha in hash) {
		if(hash.hasOwnProperty(sha)) {
			var files = hash[sha];
			switch(process.argv[2]) {
				case "count":
				break;
				default:
					if(files.length > 1) {
						process.stdout.write(
							$sha + "\n" + files.join("\n") + "\n"
						);
					}
				break;
			}			
		}
	}
});
