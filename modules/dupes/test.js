'use strict';

const assert = require('assert');

!function() {
	console.log("HashItem Object");

	const HashItem = require('./index.js').HashItem;

	var hashItem = new HashItem();

	hashItem.sha1 = "8f627205dfae0cbe639149db8a2acf5410cc37f6";
	hashItem.addFile("/my/file.png");
	hashItem.addFile("/my/otherFile.png");

	assert.deepEqual(hashItem, {
		sha1:"8f627205dfae0cbe639149db8a2acf5410cc37f6",
		files:[
			"/my/file.png",
			"/my/otherFile.png"
		]
	})	
}();

!function() {
	console.log("FileItem Object");

	const FileItem = require('./index.js').FileItem;

	var fileItem = new FileItem();

}()

!function() {
	console.log("DirItem Object");

	const DirItem = require('./index.js').DirItem;

	var dirItem = new DirItem();

}()

!function() {
	console.log("DirList Object");

	const DirList = require('./index.js').DirList;

	var dirList = new DirList();
	
}()
