#!/usr/bin/env bash

function each_line {
	while read path
	do
	  sha1sum "$path"
	done < /proc/self/fd/0
}

# Normalize spaces
each_line | sed s/'  '/' '/