function QuestionXV6v2p_zuzu(e) {
	//if (e.key != 'Enter')
	//	return;
	Question.answer = document.getElementById('QuestionXV6v2p').value;
	
	// Always
	Question.endTime = new Date();
	Question.doneRoutine();
}

function QuestionXV6v2p(doneRoutine) {
	this.radix = [8,10,16][Math.trunc(3 * Math.random())];
	this.v = 0x80000000 + Math.trunc(Math.random() * 0x80000000);
	this.correctAnswer = this.v & ~(1<<31);
	//
	// Always
	//
	this.doneRoutine = doneRoutine;
	this.begTime = new Date();
}



QuestionXV6v2p.prototype.localHTML = function (active) {
	var s = "רישמו בבסיס " + this.radix + " את הערך המוחזר מ \\( \\tt v2p(" + this.format(this.v, 16) + ")\\): ";
	if (active) {
		s += '<input type="text" id="QuestionXV6v2p" size=20 style="direction:ltr;" value="' + this.correctAnswer.toString(this.radix).toUpperCase() + '">';
		s += "<input type='button' value='OK' onclick='QuestionXV6v2p_zuzu(event)'>";
	} else {
		s += '\\( \\tt ' + this.answer + '\\)';
	}
	return(s);
}

QuestionXV6v2p.prototype.userAnswerHTML = function (active) {
	var s = '\\( \\tt ' + this.answer + '\\)';
	return(s);
}

QuestionXV6v2p.prototype.HTML = function () {
	return(this.localHTML(1));
}

QuestionXV6v2p.prototype.feedback = function () {
	return(this.localHTML(0));
}

QuestionXV6v2p.prototype.format = function (num, base) {
	if (base == 16) 
		return (("0000000" + this.v.toString(16).toUpperCase()).substr(-8));
	if (base == 8)
		return (("000000000" + this.v.toString(8)).substr(-11));
	if (base == 10)
		return (this.v.toString(10));
	return("???");
}

QuestionXV6v2p.prototype.grade = function () {
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

QuestionXV6v2p.prototype.goodAnswerHTML = function () {
	return "\\(\\fbox{" + this.correctAnswer.toString(this.radix).toUpperCase() + "}\\)";
}

QuestionXV6v2p.prototype.period = function () {
	var delta = Math.round((this.endTime - this.begTime)/1000);
	var m = Math.trunc(delta / 60);
	var s = delta % 60;
	return (m + ":" + (100+s).toString().substr(1,3));
}
