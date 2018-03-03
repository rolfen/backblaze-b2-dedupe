const fs = require('fs');

// parse arguments
const minimist = require("minimist");
var args = minimist(process.argv.slice(2),{
	alias: {
		i: "inverse",
		l: "local",
		r: "remote"
	}
});

debugger;

function arrayFromFile(f) {
	return fs.readFileSync(f).toString().split("\n").map((line)=>{
		return line.split(' ');
	}).filter((el)=>{el !== undefined});
} 