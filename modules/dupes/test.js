'use strict';

const assert = require('assert');

const HashItem = require('./index.js').HashItem;
const HashList = require('./index.js').HashList;

const FileItem = require('./index.js').FileItem;
const FileList = require('./index.js').FileList;

const DirItem = require('./index.js').DirItem;
const DirList = require('./index.js').DirList;


!function() {
	console.log("FileItem Object");

	const FileItem = require('./index.js').FileItem;

	var fileItem = new FileItem();
	var hashItem = new HashItem();

	hashItem.sha1 = "8f627205dfae0cbe639149db8a2acf5410cc37f6";

	fileItem.hash = hashItem;

}()


/*
!function() {
	console.log("HashItem Object");

	var hashItem = new HashItem();

	hashItem.sha1 = "8f627205dfae0cbe639149db8a2acf5410cc37f6";

	var fileItem1 = new FileItem();
	fileItem1.path = "/my/file.png";

	var fileItem2 = new FileItem();
	fileItem2.path = "/my/otherFile.png";

	hashItem.files.add(fileItem1);
	hashItem.files.add(fileItem2);

	assert.equal(hashItem.sha1,"8f627205dfae0cbe639149db8a2acf5410cc37f6");

	// HashItem holds links to FileItem objects
	assert.strictEqual(hashItem.files[fileItem1.path]. fileItem1);
}();
*/


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


	// v v v v v v THIS v v v v v v

	// test scalar properties

	const filename = 'fname.png';
	const dirname = "/one/two";

	var fileItem = new FileItem();
	fileItem.filename = filename;
	assert.strictEqual(fileItem.filename, filename);

	// todo: rename DirectoryItem() to Directory(), etc.

	// test "connect"

	var fileItem = new FileItem();
	fileItem.filename = filename;

	var dirItem = new DirectoryItem();
	dirItem.path = dirname;

	connect(dirItem, fileItem);

	assert.strictEqual(fileItem.directory, dirItem);
	assert.strictEqual(dirItem.files[filename], fileItem);

	// todo: test lists

	var fileItem = fileList.unique('fname.png')
	var dirItem = dirList.unique('/my/dir')
	var hashItem = hashList.unique('23894280389420')

	/* no!
	var dirItem = new DirItem({
		path: "/my/dir",
		files: new FileList([
			new FileItem({
				filename: "one.png",
				hash: new HashItem({
					sha1: ,

				})
			}),
			new FileItem({
				filename: "two.png",
				hash: new HashItem({
					sha1: ,

				})
			})			
		])
	});
	*/

}()

!function() {
	console.log("DirList Object");

	var dirList = new DirList();
	
}()
