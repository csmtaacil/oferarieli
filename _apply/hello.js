const glob = require('glob');
const fs = require('fs');
const fm = require('front-matter');
const path = require('path');

const flatten = (arr) => [].concat.apply([], arr);

const product = (...sets) =>
  sets.reduce((acc, set) =>
    flatten(acc.map(x => set.map(y => [ ...x, y ]))),
    [[]]);

const langList = ['en', 'he'];

fileNameList = glob.sync("../**/_*.md");

for (const fileName of fileNameList) {
	if (fs.lstatSync(fileName).isDirectory())
		continue;
	
	const contents = fs.readFileSync(fileName, 'utf8');
	const parts = fm(contents);
	if (!parts.attributes.smartApply)
		continue;

	console.log('------');
	console.log(fileName);
	delete parts.attributes.smartApply;
	parts.attributes.smartGenerated = true;
	
	var prod = null;
	var subFiles = parts.attributes.subFileNamesApply;
	if (subFiles) {
		var subFilesVec = subFiles.split(',');

		var sortKeys = parts.attributes.sortKeyApply;
		var sortKeysVec = sortKeys.split(',');
	}
	for (const lang of langList) {
		if (subFiles) {
			var dir = path.dirname(fileName);
			var basename = path.basename(fileName).slice(1,-3);
			for (var i = 0; i < subFilesVec.length; i++) {
				var outName =  dir + '/' + basename + '_' + subFilesVec[i] + '_' + lang + ".md";
				parts.attributes.sortKey = sortKeysVec[i];
				generate(outName, parts);
			}
		} else {
			var dir = path.dirname(fileName);
			var basename = path.basename(fileName).slice(1,-3);
			var outName =  dir + '/' + basename + '_' + lang + ".md";
			generate(outName, parts);
		}
	}
}

function generate(outName, parts) { 
	var oparts = parts;

	out = '---\n';
	for (attr in oparts.attributes) {
		out += attr+ ': "' + oparts.attributes[attr] + '"\n';
	}
	out += '---\n';
	out += oparts.body;
	
	fs.writeFileSync(outName, out, 'utf8');

}


