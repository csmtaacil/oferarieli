function QuestionCexprBits_zuzu(e) {
	//if (e.key != 'Enter')
	//	return;
	Question.answer = document.getElementById('QuestionCexprBits').value;
	
	// Always
	Question.endTime = new Date();
	Question.doneRoutine();
}

function QuestionCexprBits(doneRoutine) {
	this.width = [8,16,32][Math.trunc(3 * Math.random())];
	this.from = Math.trunc(this.width * Math.random());
	this.len = 1 + Math.trunc(Math.random() * (this.width - 1 - this.from));
	if (this.from == 0)
		var s = "x";
	else	
		var s = "(x >> " + this.from + ")";
	s += " & 0x" +  ((1 << this.len) - 1).toString(16).toUpperCase();	
	this.correctAnswer = s;
	//
	// Always
	//
	this.doneRoutine = doneRoutine;
	this.begTime = new Date();
}



QuestionCexprBits.prototype.localHTML = function (active) { 
	var s = "המשתנה x הוא ברוחב " + this.width + " ביטים. ";
	s += " רישמו בטוי המחלץ את ";
	if (this.len == 1)
		s += "ביט " + this.from;
	else
		s += "ביטים " + this.from + " עד " + (this.from + this.len - 1);
	s += " מהמשתנה x: ";
	if (active) {
		s += '<input type="text" id="QuestionCexprBits" size=20 style="direction:ltr;" value="' + this.correctAnswer + '">';
		s += "<input type='button' value='OK' onclick='QuestionCexprBits_zuzu(event)'>";
	}
	return(s); 
}

QuestionCexprBits.prototype.userAnswerHTML = function (active) { 
	var s = this.answer;
	return(s); 
}

QuestionCexprBits.prototype.HTML = function () {
	return(this.localHTML(1));
}

QuestionCexprBits.prototype.feedback = function () {
	return(this.localHTML(0));
}

QuestionCexprBits.prototype.grade = function () {
	var ll, x, xa, xc;
	for (ll = 0; ll < 31; ll++) {
		x = 1 << ll;
		try {
			xa = eval(this.answer);
		} catch (e) {
			return (0);
		}
		xc = eval(this.correctAnswer);
		if (xa != xc)
			return (0);
		x = ~(1 << ll);
		try {
			xa = eval(this.answer);
		} catch (e) {
			return (0);
		}
		xc = eval(this.correctAnswer);
		if (xa != xc)
			return (0);
	}
	return (100);
}


QuestionCexprBits.prototype.goodAnswerHTML = function () {
	return "\\(\\tt\\fbox{" + this.correctAnswer + "}\\)";
}

QuestionCexprBits.prototype.period = function () {
	var delta = Math.round((this.endTime - this.begTime)/1000);
	var m = Math.trunc(delta / 60);
	var s = delta % 60;
	return (m + ":" + (100+s).toString().substr(1,3));
}
