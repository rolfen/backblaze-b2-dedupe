'use strict';


const bogusFilename = 'fname.png';
const bogusDirname = "/one/two";
const bogusSha1 = "8f627205dfae0cbe639149db8a2acf5410cc37f6";

const assert = require('assert');

const Item = require('./index.js').Item;
const Collection = require('./index.js').Collection;

const Hash = require('./index.js').Hash;
const HashList = require('./index.js').HashList;

const File = require('./index.js').File;
const FileList = require('./index.js').FileList;

const Directory = require('./index.js').Directory;
const DirectoryList = require('./index.js').DirList;

const connect = require('./index.js').connect;


// v v v v v v THIS v v v v v v


!function() {

	console.log("Item");
	var item = new Item(bogusFilename);
	assert.strictEqual(item.value, bogusFilename);

	const propName = 'foo';
	const propVal = 'baz';

	console.log("setOnce");
	
	item.setOnce(propName,propVal);
	assert.strictEqual(item[propName], propVal);

	assert.throws(()=>{
		item.setOnce(propName,propVal);
	});

}();

!function() {

	console.log("File");

	var file = new File(bogusFilename);
	assert.strictEqual(file.value, bogusFilename);

}();

!function() {
	console.log("connect File to Hash");
	var file = new File(bogusFilename);
	var hash = new Hash(bogusSha1);
	file.mergeIn(hash);
	assert.strictEqual(file.hash,hash);
	hash.mergeIn(file);
	assert.strictEqual(hash.files[file.value],file);
}();

!function() {
	console.log("Hash");
	var hash = new Hash(bogusSha1);
	assert.strictEqual(hash.value, bogusSha1);
}();

!function() {
	console.log("Directory");

	var dir = new Directory(bogusDirname);
	assert.strictEqual(dir.value, bogusDirname);

	console.log("Directory: linked objects");

	var file = new File();

	dir.files[bogusFilename] = file;

	var tmpObj = {};
	tmpObj[bogusFilename] = file;

	assert.deepEqual(dir.files, tmpObj);


}();


!function() {

	console.log("connect(file, dir)");

	var file = new File();
	file.value = bogusFilename;

	var dir = new Directory();
	dir.value = bogusDirname;

	connect(dir, file);

	assert.strictEqual(file.directory, dir);
	assert.strictEqual(dir.files[bogusFilename], file);


}()

/* meh

!function() {
	console.log("DirItem Object");

	// ===============

	var dirItem = new DirItem();
	dirItem.path = "/my/dir";

	fileItem1 = new FileItem();
	fileItem1.filename = "one.png";
	fileItem1.hash = new HashItem(); //
	fileItem1.hash.sha1 = "8f627205dfae0cbe639149db8a2acf5410cc37f6"
	fileItem1.hash.files = new FileList(); //
	fileItem1.hash.files.add(fileItem1); //
	fileItem1.directory = new DirectoryItem(); //
	fileItem1.directory.path = "/some/dir";
	fileItem1.directory.files = new FileList(); //
	fileItem1.directory.files.add(fileItem1); //

	dirItem.files.add(fileItem1);

	// ================

	var hashList = new HashList();
	var directoryList = new DirectoryList();
	var fileList = new FileList();

	fileItem = directoryList.merge({
		filename: "one.png",
		dirname: "/some/dir"
	});

	fileList.merge({
		filename: "one.png",
		directory: [fileItem.directory],
		hash: [fileItem.hash]
	});


	fileItem.hash = hashList.merge({
		sha1: "8f627205dfae0cbe639149db8a2acf5410cc37f6",
		files: [fileItem]
	});

	fileItem.directory = directoryList.merge({
		directory: "/some/dir",
		files: [fileItem]
	});
}

*/
