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

```
node localChecksums.js -d /my/directory/ > local/localHashes.txt
```

It will calculate checksums for local files and send them to standard output. Same format as "remote checksums".

`node localChecksums.js -h` for more options.

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

Duplicates lines should never appear in the hashes for a single directory, but they do, due to an issue with localChecksums.js `-s` option. This is how we can find them:
```
sort local/localHashes.txt |uniq -c|grep -P '^\s+([2-9]|\d{2,})\s+'
```

and filter them out:
```
perl -ne 'print if ! $a{$_}++' local/localHashes.txt
```

## Diffing

So, now that we have a list of checksums for local files, and also for remote files, we should be able to compare them and obtain a list of files that we do not want to upload, or alternatively of files that we want to upload.

### Q

There are various ways of doing that. One way is using the `q` too to run SQL queries on text files. It can be found here: http://harelba.github.io/q/

Running these on two test files in the `test` folder, assuming that `l.txt` contains the local hashes and `r.txt` the remote hashes:

To get the files we don't want to upload, because they already are on the remote:
```
q "select distinct l.* from l.txt l inner join r.txt r on (l.c1 = r.c1)"
```

And here we get the inverse set, that is only the files we want to upload (`Q` does not support `outer join` (yet?), but maybe there is a better way?):
```
q "select * from l.txt l where l.c1 not in (select distinct l.c1 from l.txt l inner join r.txt r on (l.c1 = r.c1))"
```

### Putting it together

Alternatively, we can put together some of the bash expressions which we previously used. The following will output a list of hashes of all duplicate entries within given has lists, with the number of duplicates for each:

```
cat hashes.txt moreHashes.txt evenMoreHashes.txt| cut -d' ' -f 1| sort| uniq -c | grep -P '^\s*([2-9]|\d{2-})'
```
