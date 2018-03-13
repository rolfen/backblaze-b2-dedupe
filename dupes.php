#!/usr/bin/php
<?php

$hash = array();

while($f = fgets(STDIN)){
    $line = rtrim($f);
    $sha = substr($line, 0, 40);
    $path = substr($line, 41);

    if(isset($hash[$sha])) {
    	array_push($hash[$sha], $path);
    } else {
    	$hash[$sha] = array($path);
    }
}

if($argv[1] == "count") {

} else {
	# print groups of duplicates
	foreach ($hash as $sha => $files) {
		if(count($files) > 1) {
			echo $sha."\n";
			echo implode("\n", $files)."\n\n";
		}			
	}
}

?>