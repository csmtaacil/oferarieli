function QuestionX86rmSplitToPhys_zuzu(e) {
	//if (e.key != 'Enter')
	//	return;
	Question.answer = document.getElementById('QuestionX86rmSplitToPhys').value;
	Question.endTime = new Date();
	Question.doneRoutine();
}

function QuestionX86rmSplitToPhys(doneRoutine) {
	this.seg = Math.trunc(Math.random()*(2<<15));
	this.off = Math.trunc(Math.random()*(2<<15));
	this.correctAnswer = ((this.seg << 4) + this.off) & ((2<<19)-1);
	this.doneRoutine = doneRoutine;
	this.begTime = new Date();
}

QuestionX86rmSplitToPhys.prototype.period = function () {
	var delta = Math.round((this.endTime - this.begTime)/1000);
	var m = Math.trunc(delta / 60);
	var s = delta % 60;
	return (m + ":" + (100+s).toString().substr(1,3));
}

QuestionX86rmSplitToPhys.prototype.HTML = function () {
	var s = "איזו כתובת פיזית מייצ הרישום  ";
	s += ("000" + this.seg.toString(16).toUpperCase()).substr(-4) + ":";
	s += ("000" + this.off.toString(16).toUpperCase()).substr(-4);
	s += " במצב 16-ביט:";
	s += '<input type="text" id="QuestionX86rmSplitToPhys" size=5 value="' + this.correctAnswer.toString(16).toUpperCase() + '">:';
	s += "<input type='button' value='OK' onclick='QuestionX86rmSplitToPhys_zuzu(event)'>";
	return(s);
}

QuestionX86rmSplitToPhys.prototype.feedback = function () {
	var s = "איזו כתובת פיזית מייצ הרישום  ";
	s += ("000" + this.seg.toString(16).toUpperCase()).substr(-4) + ":";
	s += ("000" + this.off.toString(16).toUpperCase()).substr(-4);
	s += " במצב 16-ביט:";
	return(s);
}

QuestionX86rmSplitToPhys.prototype.userAnswerHTML = function () {
	var s = "\\(\\fbox{" + this.answer + '}\\):';
	return(s);
}

QuestionX86rmSplitToPhys.prototype.grade = function () {
	var a1 = parseInt(this.answer, 16);
	if (a1 >= 2<<19)
		return (0);
		
	if (this.correctAnswer == a1)
		return (100);
		
	return (0);
}

QuestionX86rmSplitToPhys.prototype.goodAnswerHTML = function () {
	var s = "\\(\\fbox{" + ("0000" + this.correctAnswer.toString(16).toUpperCase()).substr(-5) + 
			"}\\)";
	return (s);
}
