#!/usr/bin/perl

my %hash;

while($line = <>) {
	my($sha, $path) = split(/ +/, $line, 2);
	if(exists $hash{$sha}) {
		push(@{$hash{$sha}}, $path);
	} else {
		$hash{$sha} = [($path)];
	}
}

foreach $key (keys %hash) {
	print $key.' '.scalar(@{$hash{$key}})."\n";
}