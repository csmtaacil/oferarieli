const glob = require('glob');
const fs = require('fs');
const fm = require('front-matter');
const path = require('path');
const bibtex = require('bibtex-parser-js');

fileNameList = glob.sync("../**/_*.bib");

for (const fileName of fileNameList) {
	if (fs.lstatSync(fileName).isDirectory())
		continue;
	
	const contents = fs.readFileSync(fileName, 'utf8');
	var out = BibtexToMd(contents);

	var dir = path.dirname(fileName);
	var basename = path.basename(fileName).slice(1,-3);
	var outName =  dir + '/' + basename + "md";

	fs.writeFileSync(outName, out, 'utf8');
}

var drops, bolds;
function BibtexToMd(contents) {
	var pubList = bibtex.toJSON(contents);
	var out = "---\n";
	out += 'smartGenerated: "true"\n';

	let allDetails = false;
	let flagWith = false;
	let sortParse = false;
	
	drops = [];
	bolds = [];

	for (const pub of pubList) {
		let et = pub.entryType;
		if (et == 'MTAFLAGS') {
			if (pub.entryTags.ALLDETAILS == "1") 
				allDetails = true;
			if (pub.entryTags.WITH == "1") 
				flagWith = true;
			
			for (let i = 0; i < 100; i++) {
				let tt = "DROP"+i;
				if (pub.entryTags[tt]) { 
					drops.push(pub.entryTags[tt]);
				}
			}

			for (let i = 0; i < 100; i++) {
				let tt = "BOLD"+i;
				if (pub.entryTags[tt]) { 
					bolds.push(pub.entryTags[tt]);
				}
			}

		
			for (var key in pub.entryTags) {
				let t = pub.entryTags[key];
				out += key.toLowerCase() + ": \"" + t + "\"\n";
			}
		}
	}

	pubList.sort(function(a, b) {
		if (a.entryType == "MTAFLAGS"  &&  b.entryType == "MTAFLAGS")
			return (0);
		
		if (a.entryType == "MTAFLAGS")
			return (-1);
		
		if (b.entryType == "MTAFLAGS")
			return (1);

		let at = a.entryTags;
		let bt = b.entryTags;
			
		let ayear = "3000";
		if (at.DATE != undefined)
			ayear = at.DATE.substring(0,4);
		if (at.YEAR != undefined)
			ayear = at.YEAR;
		
		let byear = "3000";
		if (bt.DATE != undefined)
			byear = bt.DATE.substring(0,4);
		if (bt.YEAR != undefined)
			byear = bt.YEAR;
				
		if (ayear < byear) return (1);
		if (ayear > byear) return (-1);

		let amonth = "13";
		if (at.DATE != undefined)
			if (at.DATE.length > 4) amonth = at.DATE.substring(5,7);
		if (at.MONTH != undefined)
			amonth = getMonthFromString(at.MONTH).toString().padStart(2,"0");
			
		let bmonth = "13";
		if (bt.DATE != undefined)
			if (bt.DATE.length > 4) bmonth = bt.DATE.substring(5,7);
		if (bt.MONTH != undefined)
			bmonth = getMonthFromString(bt.MONTH).toString().padStart(2,"0");
				
		if (amonth < bmonth) return (1);
		if (amonth > bmonth) return (-1);

		let aauthor = "";
		if (at.AUTHOR != undefined)
			aauthor = at.AUTHOR;
		let bauthor = "";
		if (bt.AUTHOR != undefined)
			bauthor = bt.AUTHOR;

		if (aauthor < bauthor) return (-1);
		if (aauthor > bauthor) return (+1);
			
		let atitle = "";
		if (at.TITLE != undefined)
			atitle = at.TITLE;
		let btitle = "";
		if (bt.TITLE != undefined)
			btitle = bt.TITLE;

		if (atitle < btitle) return (-1);
		if (atitle > btitle) return (+1);
			
		return (0);
	});

	
	out += "listPublications:\n";
	for (const pub of pubList) {
		let et = pub.entryType;


		if (et == 'MTAFLAGS')
			continue;
		
		if (et == "INBOOKS")
			et = "INCOLLECTION";
//		if (et == "INPROCEEDINGS")
	//		et = "INCOLLECTION";
		
		out += " - pubType: " + et.toLowerCase() + "\n";
	
		let prefix = "   ";
		let tags = pub.entryTags;
		if (tags.DATE != undefined) {
			out += prefix + "pubDate: \"" + tags.DATE + "\"\n";
		} else if (tags.YEAR != undefined) {
			out += prefix + "pubDate: \"" + tags.YEAR;
			if (tags.MONTH != undefined) {
				let mm = monToNum(tags.MONTH);
				out += "-" + mm;
			}
			out += "\"\n";
		} else {
			out += prefix + "pubDate: \"9999\"\n";
		}
		let jaxxed = false;
		if (allDetails)
			out += prefix + "allDetails: 1\n";
		
		for (var key in tags) {
			let t = tags[key];
			t = charReplace(t);
			t = backslashDouble(t);
			t = braceUpperCase(t);
			//t = braceMath(t);
			//t = quoteReplace(t);
			t = braceRemove(t);
			if (key == 'AUTHOR') {
				t = authorRules(t);
			}
			if (key == 'EDITOR') {
				t = authorRules(t);
			}

			if (t.includes("$")) jaxxed = true;
			if (t != "") {
				if (key == 'AUTHOR' && flagWith)
					out += prefix + "with" + ": \"" + t + "\"\n";
				else
					out += prefix + key.toLowerCase() + ": \"" + t + "\"\n";
			}
		}
		if (jaxxed) {
			out += prefix + "mathjax: 1\n";
		}
	}
	out += "---\n";
	return (out);
}

function getMonthFromString(mon){
   var d = Date.parse(mon + "1, 2012");
   if(!isNaN(d)){
      return new Date(d).getMonth() + 1;
   }
   return -1;
 }



function authorRules(str) {
	let s = str.trim();
	for (let i = 0; i < drops.length; i++) {
		s = s.replace(drops[i],"");
	}
	let vs = s.split(/\sand\s/);
	for (let i = 0; i < vs.length; i++) {
		vs[i] = authorForm(vs[i]).trim();
	}
		
	for (let i = 0; i < vs.length; i++) {
		if (vs[i] == "")
			vs.splice(i,1);
	}

	for (let i = 0; i < vs.length; i++) {
		for (let j = 0; j < bolds.length; j++) {
			if (vs[i] == bolds[j])
				vs[i] = "<span style='font-weight:bold;'>" + vs[i]+"</span>";
		}
	}


	s = "";
	for (let i = 0; i < vs.length; i++) {
		if (i == 0)
			s = vs[0];
		else if (i < vs.length - 1)
			s = s + ", " + vs[i];
		else
			s = s + " and " + vs[i];
	}
	return (s);
}

function authorForm(str) {
	vs = str.split(",");
	if (vs.length == 1)
		return (str);
	return(vs[1].trim()+" "+vs[0].trim());
}

function charReplace(str) {
	let s = str;
	s = s.replace(/{\\ss}/g, "&szlig;");
	
	s = s.replace(/{\\c{c}}/g, "&ccedil;");
	s = s.replace(/{\\cc}/g, "&ccedil;");
	
	s = s.replace(/{\\"{a}}/g, "&#228;");
	s = s.replace(/{\\"a}/g, "&#228;");
	s = s.replace(/{\\"{A}}/g, "&#192;");
	s = s.replace(/{\\"A}/g, "&#192;");
	s = s.replace(/{\\"{i}}/g, "&iuml;");
	s = s.replace(/{\\"i}/g, "&iuml;");
	s = s.replace(/{\\"{\\i}}/g, "&iuml;");
	s = s.replace(/{\\"\\i}/g, "&iuml;");
	s = s.replace(/{\\"{I}}/g, "&Iuml;");
	s = s.replace(/{\\"I}/g, "&Iuml;");
	s = s.replace(/{\\"{o}}/g, "&#246;");
	s = s.replace(/{\\"o}/g, "&#246;");
	s = s.replace(/{\\"{O}}/g, "&#214;");
	s = s.replace(/{\\"O}/g, "&#214;");
	s = s.replace(/{\\"{u}}/g, "&#252;");
	s = s.replace(/{\\"u}/g, "&#252;");
	s = s.replace(/{\\"{U}}/g, "&#220;");
	s = s.replace(/{\\"U}/g, "&#220;");

	s = s.replace(/{\\'{a}}/g, "&aacute;");
	s = s.replace(/{\\'{A}}/g, "&Aacute;");
	s = s.replace(/{\\'{e}}/g, "&eacute;");
	s = s.replace(/{\\'{E}}/g, "&Eacute;");
	s = s.replace(/{\\'{i}}/g, "&iacute;");
	s = s.replace(/{\\'{\\i}}/g, "&iacute;");
	s = s.replace(/{\\'{I}}/g, "&Iacute;");
	s = s.replace(/{\\'{o}}/g, "&oacute;");
	s = s.replace(/{\\'{O}}/g, "&Oacute;");
	s = s.replace(/{\\'{u}}/g, "&uacute;");
	s = s.replace(/{\\'{U}}/g, "&Uacute;");
	
	s = s.replace(/{\\o}/g, "&oslash;");
	s = s.replace(/{\\O}/g, "&Oslash;");

	s = s.replace(/{\\~{a}}/g, "&atilde;");
	s = s.replace(/{\\~{A}}/g, "&Atilde;");
	s = s.replace(/{\\~{n}}/g, "&ntilde;");
	s = s.replace(/{\\~{N}}/g, "&Ntilde;");

	s = s.replace(/{\\v{s}}/g, "&scaron;");
	s = s.replace(/{\\v{S}}/g, "&Scaron;");

	s = s.replace(/{\\\^{a}}/g, "&acirc;");
	s = s.replace(/{\\\^{A}}/g, "&Acirc;");
	s = s.replace(/{\\\^{e}}/g, "&ecirc;");
	s = s.replace(/{\\\^{E}}/g, "&Ecirc;");
	s = s.replace(/{\\\^{o}}/g, "&ocirc;");
	s = s.replace(/{\\\^{O}}/g, "&Ocirc;");

	s = s.replace(/{\\&}/g, "&amp;");
	s = s.replace(/\\&/g, "&amp;");
	s = s.replace(/\\_/g, "_");
	s = s.replace(/ - /g, "&mdash;");
	s = s.replace(/---/g, "&mdash;");
	s = s.replace(/--/g, "&ndash;");
	return(s);
}

function quoteReplace(str) {
	let i = 0;
	let s = str;
	while (i < s.length) {
		let c0 = s.substring(i,i+1);
		let c1 = s.substring(i+1,i+2);
		if ((c0 == '`') && (c1 == '`'))  {
			let l = s.substring(0,i);
			let r = s.substring(i+2,s.length);
			s = l + "&ldquo;" + r;
		} else if ((c0 == '\'') && (c1 == '\''))  {
			let l = s.substring(0,i);
			let r = s.substring(i+2,s.length);
			s = l + "&rdquo;" + r;
		} else if ((c0 == '`'))  {
			let l = s.substring(0,i);
			let r = s.substring(i+1,s.length);
			s = l + "&lsquo;" + r;
		} else if ((c0 == '\''))  {
			let l = s.substring(0,i);
			let r = s.substring(i+1,s.length);
			s = l + "&rsquo;" + r;
		} 
		i++;
	}
	return (s);
}

//
// Remove braces which are outside of $...$ block
//
function braceRemove(str) {
	let i = 0;
	let s = "";
	const inText = 0;
	const inMath = 1;
	let state = inText;
	while (i < str.length) {
		let c = str.substring(i,i+1);
		switch (state) {
		case inText:
			if ((c == '{')  ||  (c== '}'))
				break;
			if (c == '$')
				state = inMath;
			s = s + c;
			break;
			
		case inMath:
			if (c == '$')
				state = inText;
			s = s + c;
			break;
		}
		i++;
	}
	return (s);
}

//
// Change either "{$" or "$}" to "$"
//
function braceMath(str) {
	let i = 0;
	let s = str;
	while (i < s.length) {
		let c0 = s.substring(i,i+1);
		let c1 = s.substring(i+1,i+2);
		if ((c0 == '{') && (c1 == '$')) {
			let l = s.substring(0,i);
			let r = s.substring(i+1, s.length);
			s = l + r;
		} else if ((c0 == '$') && (c1 == '}')) {
			let l = s.substring(0,i+1);
			let r = s.substring(i+2, s.length);
			s = l + r;
		}
		i++;
	}
	return (s);
}

//
// Removes braces. This and the previous are bad code.
//
function braceUpperCase(str) {
	let s = "";
	
	while (str != "") {
		let i0 = str.indexOf("{");
		let i1 = str.indexOf("}");
		if (i0 < 0  ||  i1 < 0) {
			s = s + str;
			str = "";
			continue;
		}
		if (i0 > i1) {
			s = s + str;
			str = "";
			continue;
		}

		s = s + str.substring(0,i0);
	
		let t = str.substring(i0+1,i1);
		if (t == t.toUpperCase()) {
			s = s + t;
			str = str.substring(i1+1,str.length);
		} else {
			s = s + "{" +  t + "}";
			str = str.substring(i1+1,str.length);
		}
	}
	return (s);
}

function backslashDouble(str) {
	let i = 0;
	let s = str;
;	while (i < s.length) {
		let c = s.substring(i, i+1);
		if (c == '\\') {
			let l = s.substring(0,i);
			let r = s.substring(i, s.size);
			s = l + '\\' + r;
			i++;
		}
		i++;
	}
	return (s);
}

function findKey(obj, key) {
	for (var k in obj) {
		if (k.toLowerCase() == key.toLowerCase()) {
			return k;
		}
	}
	return ("");
}

function monToNum(mon) {
	let date = mon + " 1, 2000";
	let m = new Date(Date.parse(date)).getMonth() + 1;
	return (m.toString().padStart(2, '0'));
}