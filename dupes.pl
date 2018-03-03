#!/usr/bin/perl

my %hash; # Key: checksum. Values: (reference to) array of file paths

while($line = <STDIN>) {
	my($sha, $path) = split(/ +/, $line, 2);
	if(exists $hash{$sha}) {
		# duplicate
		push(@{$hash{$sha}}, $path);
	} else {
		$hash{$sha} = [($path)];
	}
}


foreach $key (keys %hash) {
	if($ARGV[0] eq "count") {
		print $key." ".scalar(@{$hash{$key}})."\n";
	} elsif($ARGV[0] eq "dirs") {
		use File::Basename;
		my %dir;
		while(my($k, $v) = each(%hash)) {
			my $dirpath = basename($v);
			if(scalar(@{$v}) > 1) {
				# duplicates
			} elsif(scalar(@{$v}) == 1) {
				# single file
			}
		}
	} else {
		if(scalar(@{$hash{$key}}) > 1) {
			print $key."\n".join("", @{$hash{$key}})."\n";
		}			
	}
}