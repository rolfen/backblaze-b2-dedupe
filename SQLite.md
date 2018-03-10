
###Convert to CSV 

Assuming no double-quotes (`"`) in the filenames:

```
cat PhotoOriginals.hashes.txt | sed -e s/^/\"/ -e s/' '/\",\"/ -e s/\$/\"/ > PhotoOriginals.hashes.csv 
```

Double check count:

```
wc -l Unsorted\ Photos.hashes.complete.*
   11520 Unsorted Photos.hashes.complete.csv
   11520 Unsorted Photos.hashes.complete.txt
   23040 total
```

###Import into SQLite

Start SQLite, specifying the database

```
sqlite3 my.db
```

Import CSVs

```
SQLite version 3.8.10.2 2015-05-20 18:17:19
Enter ".help" for usage hints.
Connected to a transient in-memory database.
Use ".open FILENAME" to reopen on a persistent database.
sqlite> .mode csv
sqlite> create table UnsortedPhotos (sha, path);
sqlite> .import '../Big Fat Disk/Unsorted Photos.hashes.complete.csv' UnsortedPhotos
```

###List duplicates

Enter `.mode column` for formatted output.

This finds the union between two tables:

```
select * from UnsortedPhotos join PhotoOriginals on UnsortedPhotos.sha = PhotoOriginals.sha
```
SQL grouping and sorting could be useful.