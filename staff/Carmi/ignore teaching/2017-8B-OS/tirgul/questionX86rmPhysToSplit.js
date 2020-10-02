function QuestionX86rmPhysToSplit_zuzu(e) {
	//if (e.key != 'Enter')
	//	return;
	Question.answer1 = document.getElementById('QuestionX86rmPhysToSplit1').value;
	Question.answer2 = document.getElementById('QuestionX86rmPhysToSplit2').value;
	Question.endTime = new Date();
	Question.doneRoutine();
}

function QuestionX86rmPhysToSplit(doneRoutine) {
	this.Phys = Math.trunc(Math.random()*(2<<19));
	this.doneRoutine = doneRoutine;
	this.begTime = new Date();
}

QuestionX86rmPhysToSplit.prototype.period = function () {
	var delta = Math.round((this.endTime - this.begTime)/1000);
	var m = Math.trunc(delta / 60);
	var s = delta % 60;
	return (m + ":" + (100+s).toString().substr(1,3));
}

QuestionX86rmPhysToSplit.prototype.HTML = function () {
	var s = "רישמו את צורת הפיצול של הכתובת ";
	s += this.Phys.toString(16).toUpperCase();
	s += " במצב 16-ביט:";
	s += '<input type="text" id="QuestionX86rmPhysToSplit1" size=4 value="' + (this.Phys - ((this.Phys >> 4) <<4)).toString(16).toUpperCase() + '">:';
	s += '<input type="text" id="QuestionX86rmPhysToSplit2" size=4 value="' + (this.Phys >> 4).toString(16).toUpperCase() + '">';
	s += "<input type='button' value='OK' onclick='QuestionX86rmPhysToSplit_zuzu(event)'>";
	return(s);
}

QuestionX86rmPhysToSplit.prototype.feedback = function () {
	var s = "רישמו את צורת הפיצול של הכתובת ";
	s += this.Phys.toString(16).toUpperCase();
	s += " במצב 16-ביט:";
	return(s);
}

QuestionX86rmPhysToSplit.prototype.userAnswerHTML = function () {
	var s = "\\(\\fbox{" + this.answer2 + "}:";
	s += "\\fbox{" + this.answer1 + "}\\)";
	return(s);
}

QuestionX86rmPhysToSplit.prototype.grade = function () {
	a1 = parseInt(this.answer1, 16);
	a2 = parseInt(this.answer2, 16);
	if (a1 == "NaN"  ||  a2 == "NaN")
		return (0);
	if (a1 >= 2<<15   ||  a2 >= 2 <<15)
		return (0);
		
	if ((a2 << 4) + a1 == this.Phys)
		return (100);
		
	return (0);
}

QuestionX86rmPhysToSplit.prototype.goodAnswerHTML = function () {
	var a2 = this.Phys >> 4;
	var s2 = ("000" + a2.toString(16).toUpperCase()).substr(-4);
	var a1 = this.Phys - ((this.Phys >> 4) << 4);
	var s1 = ("000" + a1.toString(16).toUpperCase()).substr(-4);
	var s = "\\(\\fbox{" + s2 + "}:\\fbox{" + s1 + "}\\)";
	return (s);
}
