#!/usr/bin/perl

use strict; 
use warnings; 

my %hash; 


sub myPush {
	# $hash is a reference to hash of arrays
	# every entry in %hash should be an array
	# $hashRef is the key
	my ($hashRef, $value) = @_;
	if(exists $hash{$hashRef}) {
		push(@{$hash{$hashRef}}, $value);
	} else {
		# create new array for key $hashRef
		$hash{$hashRef} = [($value)];
	}
}

# Key: checksum. Values: (reference to) array of file paths

my ($line, $key, $ARGV);

while($line = <STDIN>) {
	my($sha, $path) = split(/ +/, $line, 2);
	myPush($sha, $path, \%hash);
}

if($ARGV[0] eq "count") {
	# print counts for each hash
	foreach $key (keys %hash) {
		print $key." ".scalar(@{$hash{$key}})."\n";
	}
} elsif($ARGV[0] eq "dirs") {
	my %dirs;
	use File::Basename;
	while(my($k, $v) = each(%hash)) {
		# my $dirpath = basename($v);
		if(scalar(@{$v}) > 1) {
			# duplicates
		} elsif(scalar(@{$v}) == 1) {
			# single file
		}
	}
} else {
	# print groups of duplicates
	foreach $key (keys %hash) {
		if(scalar(@{$hash{$key}}) > 1) {
			print $key."\n".join("", @{$hash{$key}})."\n";
		}			
	}
}