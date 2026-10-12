.PHONY: linkedin github exports

linkedin:
	node scripts/linkedin-experience.js

github:
	/bin/cp profiles/github/README.md ../jamescodesthings/README.md
	git -C ../jamescodesthings diff --stat

exports:
	node scripts/exports.js
