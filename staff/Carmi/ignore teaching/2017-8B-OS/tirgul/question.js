function chooseQuestion() {
	if ( typeof chooseQuestion.i == 'undefined' ) {
        // It has not... perform the initialization
        chooseQuestion.i = 0;
    }
	//Question = new Question16SplitToPhys(nextQuestion);
	//var i = Math.trunc(Math.random() * questionName.length);
	var q;
	var s = "q = new Question" + chooseQuestion.qName[chooseQuestion.i % chooseQuestion.qName.length] + "(nextQuestion);";
	eval(s);
	chooseQuestion.i++;
	return (q);
}

chooseQuestion.qName = ["X86srcDst",
					"CexprBits",
					"XV6v2p",
					"XV6p2v",
					"X86pmLoadSegReg",
					"X86rmPhysToSplit",
					"X86rmPhysToSplit64K",
					"X86rmSplitToPhys"];

chooseQuestion.i = 0;
for (chooseQuestion.i = 0; chooseQuestion.i < chooseQuestion.qName.length; chooseQuestion.i++) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","question" + chooseQuestion.qName[chooseQuestion.i]+".js", false);
	xmlhttp.send();
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.innerHTML = xmlhttp.responseText;
	document.getElementsByTagName("head")[0].appendChild(s);
}
chooseQuestion.i = 0;
