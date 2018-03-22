
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
	item1.addRef(item2);
	item2.addRef(item1);
}

// returns this[key]
// creates it first if not exist
function unique(itemClass, key, value) {
	if(!(key in this)) {
		this[key] = new itemClass(value);
	}
	return(this[key]);
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
		if(value !== undefined) {
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

	addRef (item) {
		if (item instanceof Hash) {
			this.setOnce('hash', item)
		} else if (item instanceof Directory) {
			this.setOnce('directory', item)
		} else {
			throw new Error("Unrecognized");
		}
	}
}

class FileCollection extends Collection {
	unique(key, value) {
		return unique.call(this, File, key, value);
	}
}

class Hash extends Item {

	constructor (value) {
		super(value);
		this.files = new FileCollection();
	}

	addRef (item) {
		if (item instanceof File) {
			this.files.setOnce(item.value, item);
		} else {
			throw new Error("unrecognized");
		}
	}
}

class HashCollection extends Collection {
	unique(key, value) {
		return unique.call(this, Hash, key, value);
	}
}

class Directory extends Item {

	constructor (value) {
		super(value);
		this.files = new FileCollection();
	}

	addRef (item) {
		if (item instanceof File) {
			this.files.setOnce(item.value, item);
		} else {
			throw new Error("unrecognized");
		}
	}
}

class DirectoryCollection extends Collection {
	unique(key, value) {
		return unique.call(this, Directory, key, value);
	}
}


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

