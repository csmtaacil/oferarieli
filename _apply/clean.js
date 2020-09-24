const glob = require('glob');
const fs = require('fs');
const fm = require('front-matter');
const path = require('path');

fileNameList = glob.sync("../**/*.md");

for (const fileName of fileNameList) {
	if (fs.lstatSync(fileName).isDirectory())
		continue;
	
	const contents = fs.readFileSync(fileName, 'utf8');
	const parts = fm(contents);

	if (parts.attributes.smartGenerated)
		fs.unlinkSync(fileName);
}


