
'use strict';


/* 

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

FileCollection, HashCollection, DirCollection:

DirectoryCollection {
	items: {Directory indexed list}
}

etc.

*/

function connect(item1, item2) {
	item1.mergeIn(item2);
	item2.mergeIn(item1);
}

function setPropertyOnce(propertyName, value) {
	if(propertyName in this) {
		throw new Error("Already set");
	} else {
		this[propertyName] = value;
	}
}	

class Collection {}

Collection.prototype.setOnce = setPropertyOnce;

class Item {
	constructor(value) {
		if(value) {
			this.value = value;
		}		
	}
}

Item.prototype.setOnce = setPropertyOnce;


// +++++++++++++++++++++++++++++++++


class File extends Item {

	constructor (value) {
		super(value);
	}

	mergeIn (item) {
		if (item instanceof Hash) {
			this.setOnce('hash', item)
		} else if (item instanceof Directory) {
			this.setOnce('directory', item)
		} else {
			throw new Error("Unrecognized");
		}
	}
}

class FileCollection extends Collection {}

class Hash extends Item {

	constructor (value) {
		super(value);
		this.files = new FileCollection();
	}

	mergeIn (item) {
		if (item instanceof File) {
			this.files.setOnce(item.value, item);
		} else {
			throw new Error("unrecognized");
		}
	}
}

class HashCollection extends Collection {}

class Directory extends Item {

	constructor (value) {
		super(value);
		this.files = new FileCollection();
	}

	mergeIn (item) {
		if (item instanceof File) {
			this.files.setOnce(item.value, item);
		} else {
			throw new Error("unrecognized");
		}
	}
}

class DirectoryCollection extends Collection {}


// =============


module.exports = {
	Item, // export for testing
	Collection, // export for testing
	File,
	FileCollection,
	Hash,
	HashCollection,
	Directory,
	DirectoryCollection,
	connect
};

