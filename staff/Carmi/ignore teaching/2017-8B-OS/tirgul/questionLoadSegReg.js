function QuestionLoadSegReg_zuzu(e) {
	//if (e.key != 'Enter')
	//	return;
	Question.answer = document.getElementById('QuestionLoadSegReg').value;
	Question.endTime = new Date();
	Question.doneRoutine();
}

function QuestionLoadSegReg(doneRoutine) {
	this.DTentry = Math.trunc(1+Math.random()*8192);
	this.DT = Math.trunc(Math.random() * 2);
	this.inRadix = [8,10,16][Math.trunc(Math.random() * 3)];
	this.outRadix = [8,10,16][Math.trunc(Math.random() * 3)];
	this.correctAnswer = ((this.DTentry << 3) + (this.DT << 2)).toString(this.inRadix).toUpperCase();
	this.doneRoutine = doneRoutine;
	this.begTime = new Date();
}


QuestionLoadSegReg.prototype.period = function () {
	var delta = Math.round((this.endTime - this.begTime)/1000);
	var m = Math.trunc(delta / 60);
	var s = delta % 60;
	return (m + ":" + (100+s).toString().substr(1,3));
}

QuestionLoadSegReg.prototype.HTML = function () {
	var s = "<table>";
	s += "<tr><td>";
	s += "הקלידו בבסיס ";
	s += this.inRadix;
	s += " את הערך אותו יש לטעון לאוגר סגמנטים כדי לפנות לכניסה ";
	if (this.outRadix == 10)
		s += this.DTentry;
	else
		s += "\\(" + this.DTentry.toString(this.outRadix).toUpperCase() + "_{" + this.outRadix+ "}\\)";
	
	s += " ב-";
	if (this.DT == 0) 
		s += "GDT";
	else
		s += "LDT";
	s += " כאשר המעבד במצב 32-ביט:";
	s += "</td></tr>"	;
	s += "<tr><td>";
	s += '<input type="text" id="QuestionLoadSegReg" size=8 value="' + this.correctAnswer + '">';
	s += "<input type='button' value='OK' onclick='QuestionLoadSegReg_zuzu(event)'>";
	s += "</td></tr>";
	s += "</table>";
	return(s);
}

QuestionLoadSegReg.prototype.feedback = function () {
	var s = "<table>";
	s += "<tr><td>";
	s += "הקלידו בבסיס ";
	s += this.inRadix;
	s += " את הערך אותו יש לטעון לאוגר סגמנטים כדי לפנות לכניסה ";
	if (this.outRadix == 10)
		s += this.DTentry;
	else
		s += "\\(" + this.DTentry.toString(this.outRadix).toUpperCase() + "_{" + this.outRadix + "}\\)";
	
	s += " ב-";
	if (this.DT == 0) 
		s += "GDT";
	else
		s += "LDT";
	s += " כאשר המעבד במצב 32-ביט:";
	s += "</td></tr>"	;
	s += "<tr><td>";
	s += this.answer;
	s += "</td></tr>";
	s += "</table>";
	return(s);
}

QuestionLoadSegReg.prototype.grade = function () {
	if (this.answer.toUpperCase() == this.correctAnswer)
		return (100);
	return (0);
}


QuestionLoadSegReg.prototype.goodAnswerHTML = function () {
	return "\\(\\fbox{" + this.correctAnswer + "}\\)";
}

