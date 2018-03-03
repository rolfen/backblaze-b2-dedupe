#!/usr/bin/perl

my %hash;

while($line = <STDIN>) {
	my($sha, $path) = split(/ +/, $line, 2);
	if(exists $hash{$sha}) {
		push(@{$hash{$sha}}, $path);
	} else {
		$hash{$sha} = [($path)];
	}
}


foreach $key (keys %hash) {
	if($ARGV[0] eq "count") {
		print $key." ".scalar(@{$hash{$key}})."\n";
	} else {
		if(scalar(@{$hash{$key}}) > 1) {
			print $key."\n".join("", @{$hash{$key}})."\n";
		}			
	}
}