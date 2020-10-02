function QuestionX86rmPhysToSplit64K_zuzu(e) {
	//if (e.key != 'Enter')
	//	return;
	Question.answer1 = document.getElementById('QuestionX86rmPhysToSplit64K1').value;
	Question.answer2 = document.getElementById('QuestionX86rmPhysToSplit64K2').value;
	Question.endTime = new Date();
	Question.doneRoutine();
}

function QuestionX86rmPhysToSplit64K(doneRoutine) {
	this.Phys = Math.trunc(Math.random()*(2<<19));
	this.doneRoutine = doneRoutine;
	this.begTime = new Date();
}

QuestionX86rmPhysToSplit64K.prototype.period = function () {
	var delta = Math.round((this.endTime - this.begTime)/1000);
	var m = Math.trunc(delta / 60);
	var s = delta % 60;
	return (m + ":" + (100+s).toString().substr(1,3));
}

QuestionX86rmPhysToSplit64K.prototype.HTML = function () {
	var s = "רישמו צורת הפיצול של הכתובת ";
	s += ("0000" + this.Phys.toString(16).toUpperCase()).substr(-5);
	s += " במצב 16-ביט כאשר הסגמנט נמצא על גבול 64KB:";
	s += '<input type="text" id="QuestionX86rmPhysToSplit64K1" size=4 value="' + ("000" + (this.Phys - ((this.Phys >> 16) <<16)).toString(16).toUpperCase()).substr(-4) + '">:';
	s += '<input type="text" id="QuestionX86rmPhysToSplit64K2" size=4 value="' + ("000" + ((this.Phys >> 16)<<12).toString(16).toUpperCase()).substr(-4) + '">';
	s += "<input type='button' value='OK' onclick='QuestionX86rmPhysToSplit64K_zuzu(event)'>";
	return(s);
}

QuestionX86rmPhysToSplit64K.prototype.feedback = function () {
	var s = "רישמו צורת הפיצול של הכתובת ";
	s += ("0000" + this.Phys.toString(16).toUpperCase()).substr(-5);
	s += " במצב 16-ביט כאשר הסגמנט נמצא על גבול 64KB:";
	return(s);
}

QuestionX86rmPhysToSplit64K.prototype.userAnswerHTML = function () {
	var s = "\\(\\fbox{" + this.answer2 + "}:";
	s += "\\fbox{" + this.answer1 + "}\\)";
	return(s);
}

QuestionX86rmPhysToSplit64K.prototype.grade = function () {
	a1 = parseInt(this.answer1, 16);
	a2 = parseInt(this.answer2, 16);
	if (a1 == "NaN"  ||  a2 == "NaN")
		return (0);
	if (a1 >= 2<<15   ||  a2 >= 2 <<15)
		return (0);
	if (a2 != ((a2 >> 12) << 12))
		return (0);
	if ((a2 << 4) + a1 == this.Phys)
		return (100);
		
	return (0);
}

QuestionX86rmPhysToSplit64K.prototype.goodAnswerHTML = function () {
	var a2 = (this.Phys >> 16) << 12;
	var s2 = ("0000" + a2.toString(16).toUpperCase()).substr(-4);
	var a1 = this.Phys - ((this.Phys >> 16) << 16);
	var s1 = ("0000" + a1.toString(16).toUpperCase()).substr(-4);
	var s = "\\(\\fbox{" + s2 + "}:\\fbox{" + s1 + "}\\)";
	return (s);
}
