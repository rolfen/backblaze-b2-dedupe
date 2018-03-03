# backblaze-b2-dedupe
De-duplicate files before uploading to Backblaze B2

This is work in progress.

## Installation

```
npm install
```


## Remote Checksums

The "local" directory is not committed, because it contains temporary and sensitive information (backblaze api key, for example).

It should exist and contain a file named config.js, with the information resembling the following:

```
{
	"bucketId": "cdf6711c606e3a711367f427",
	"accountId": "364fd60cfdad",
	"applicationKey": "000c60fa6031e86d64d6e7faa070f711cf2acb390a"
}
```

When run (`node index.js`), this script will connect to the specified bucket and try to fetch the SHA1 checksum for **all files**. 

Charges can be incurred - see the B2 site for more info.

The SHA1 checksums will be saved in `local/remoteHashes.txt`, with one line per file, containing the checksum, then a space, then the path of the file relative to the bucket root, then a newline (\n).

```
6bc5aa1d824b35e4cb09429eee74feccbfbe8c42 myPhotos/Updloads/3340175.ORF
```

The number of lines in this file (`wc -l`) should be equal to the number of files in your bucket.

**Warning**: The contents of `local/remoteHashes.txt` will be deleted every time this script is run!

## Local Checksums

### Using node.js

```
node localChecksums.js -d /my/directory/ > local/localHashes.txt
```

It will calculate checksums for local files and send them to standard output. Similar output format to "remote checksums".

`node localChecksums.js -h` for more options.


### sha1sum

The JS option has an issue with big files - it runs out of memory on some movies,etc.

Alternatively, there is a bash script which uses the `sha1sum` command to produce the same output. It works on Linux.

It takes a list of files and returns hashes:

```
find ./test -type f |./addSum.sh
```

### Monitoring progress

Number of hashes generated
```
wc -l local/localHashes.txt
```

Should ultimately equal number of files analyzed
```
find /my/directory -type f | wc -l
```

### Validating Output

Finding abnormal lines:
```
grep -vP '^[a-f0-9]{40} .*' local/localHashes.txt
```

Duplicates lines should never appear in the hashes of a particular directory (it means the same file was processed twice). Here is how to detect this anomaly:
```
sort local/localHashes.txt |uniq -c|grep -P '^\s+([2-9]|\d{2,})\s+'
```

and to filter them out:
```
perl -ne 'print if ! $a{$_}++' local/localHashes.txt
```

## Diffing

So, now that we have a list of checksums for local files, and also for remote files, we should be able to compare them and obtain a list of files that we do not want to upload, or alternatively of files that we want to upload.

### Perl script

`dupes.pl` can process the hashes.

It takes a list of hashes in standard input.

Example:
```
find ./test/ -type f|./addSum.sh|./dupes.pl count
```

This will output the number of occurrances for each hash:
```
8f627205dfae0cbe639149db8a2acf5410cc37f6 1
adc83b19e793491b1c6ea0fd8b46cd9f32e592fc 2
ca2adeb0d33b44c6bbb99a1b17574cb77681afa0 1
```

To print details about duplicates:
```
find ./test/ -type f|./addSum.sh|./dupes.pl
```

To recursively process all `.hashes.txt` files in `local/hashes` and get the number of unique files:
```
find local/hashes -type f -name *.hashes.txt |xargs -d "\n" cat| ./dupes.pl count |wc -l
```

### Putting it together

We can put together some of the bash expressions which we previously used. The following will output a list of hashes of all duplicate entries within given has lists, with the number of duplicates for each:

```
cat hashes.txt moreHashes.txt evenMoreHashes.txt| cut -d' ' -f 1| sort| uniq -c | grep -P '^\s*([2-9]|\d{2-})'
```

### Sqlite (or other)

Convert hashes to CSV (assuming there are no double-quotes in the filenames):
```
cat hashes.txt |sed -e s/^/\"/ -e s/' '/\",\"/ -e s/\$/\"/
```

Then import in sqlite tables and run queries on them. This option is deprecated in favor of the perl script.

## Known issues

`localChecksums.js` fails SHA1 on big files.  
Undefined behavior with file links (hard or symbolic).

## Platform compatibility

This was primarily developed on Linux. However, the all the parts used *should* be available on OSX and also Windows, through Cygwin or BusyBox, for example.