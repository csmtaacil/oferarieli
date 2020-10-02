function QuestionXV6p2v_zuzu(e) {
	//if (e.key != 'Enter')
	//	return;
	Question.answer = document.getElementById('QuestionXV6p2v').value;
	
	// Always
	Question.endTime = new Date();
	Question.doneRoutine();
}

function QuestionXV6p2v(doneRoutine) {
	this.radix = [8,10,16][Math.trunc(3 * Math.random())];
	this.v = Math.trunc(Math.random() * 0x80000000);
	this.correctAnswer = this.v + 0x80000000;
	//
	// Always
	//
	this.doneRoutine = doneRoutine;
	this.begTime = new Date();
}



QuestionXV6p2v.prototype.localHTML = function (active) { 
	var s = "רישמו בבסיס " + this.radix + " את הערך המוחזר מ \\(\\tt p2v(" + this.format(this.v, 16).toUpperCase() + ")\\): ";
	if (active) {
		s += '<input type="text" id="QuestionXV6p2v" size=20 style="direction:ltr;" value="' + this.correctAnswer.toString(this.radix).toUpperCase() + '">';
		s += "<input type='button' value='OK' onclick='QuestionXV6p2v_zuzu(event)'>";
	} else {
		s += '\\(\\tt ' + this.answer + '\\)';
	}
	return(s);
}

QuestionXV6p2v.prototype.userAnswerHTML = function (active) { 
	var s = this.answer;
	return(s);
}

QuestionXV6p2v.prototype.HTML = function () {
	return(this.localHTML(1));
}

QuestionXV6p2v.prototype.feedback = function () {
	return(this.localHTML(0));
}

QuestionXV6p2v.prototype.format = function (num, base) {
	if (base == 16) 
		return (("0000000" + this.v.toString(16).toUpperCase()).substr(-8));
	if (base == 8)
		return (("000000000" + this.v.toString(8)).substr(-11));
	if (base == 10)
		return (this.v.toString(10));
	return("???");
}


QuestionXV6p2v.prototype.grade = function () {
	if (this.radix < 16)
		var pat="[^0-" + (this.radix-1) + "]";
	else
		var pat="[^0-9a-fA-F]";
	if (this.answer.search(pat) >= 0)
		return (0);
	if (this.correctAnswer != parseInt(this.answer, this.radix))
		return (0);
	return (100);
}

QuestionXV6p2v.prototype.goodAnswerHTML = function () {
	return "\\(\\fbox{" + this.format(this.correctAnswer, this.radix) + "}\\)";
}

QuestionXV6p2v.prototype.period = function () {
	var delta = Math.round((this.endTime - this.begTime)/1000);
	var m = Math.trunc(delta / 60);
	var s = delta % 60;
	return (m + ":" + (100+s).toString().substr(1,3));
}
