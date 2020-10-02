function QuestionX86srcDst_radio(e) {
	var c = parseInt(e.target.id.substr(-1));
	var i;
	for (i = 0; i < 3; i++) {
		if (i != c) {
			document.getElementById("QuestionX86srcDst" + (i.toString(10))).checked = false;
		}
	}
}

function QuestionX86srcDst_zuzu(e) {
	//if (e.key != 'Enter')
	//	return;
	Question.ansRadio = new Array();
	var i;
	for (i = 0; i < 3; i++) {
		Question.ansRadio[i] = document.getElementById("QuestionX86srcDst" + (i.toString(10))).checked;
		if (i > 0  &&  Question.ansRadio[i])
			Question.answer = document.getElementById("QuestionX86srcDst" + ((i+2).toString(10))).value;
	}
		// Always
	Question.endTime = new Date();
	Question.doneRoutine();
}

function QuestionX86srcDst(doneRoutine) {
	this.answer = "";
	this.ansRadio = new Array();
	
	if (Math.random() < 0.2) {
		this.srcIsReg = true;
		this.srcReg = Math.trunc(Math.random() * 8);
		
		this.dstIsReg = true;
		this.dstReg = Math.trunc(Math.random() * 8);
		this.srcWanted = [true, false][Math.trunc(Math.random() * 2)];
	} else {
		this.reg1 = -1+Math.trunc(Math.random() * 9);
		this.reg2 = -1;
		this.off = 0;
		this.mult = 1;
		if (Math.random() > 0.3)
			this.reg2 = Math.trunc(Math.random() * 7);
		if (this.reg2 >=0) this.mult = [1,2,4][Math.trunc(Math.random() * 3)];
		if (Math.random() < 0.5) {
			this.srcIsReg = false;
			this.dstIsReg = true;
			this.dstReg = Math.trunc(Math.random() * 8);
		} else {
			this.srcIsReg = true;
			this.dstIsReg = false;
			this.srcReg = Math.trunc(Math.random() * 8);
		}
		if (Math.random() > 0.1)
			this.srcWanted = !this.srcIsReg;
		else
			this.srcWanted = this.srcIsReg;
	}
	this.regValue = new Array();
	var i;
	for (i = 0; i < QuestionX86srcDst.regName.length; i++)
		this.regValue[i] = Math.trunc(Math.random() * Math.pow(2,32));
		
	this.regValue[4] &= -4 & 0xFFFFFFFF;
	this.regValue[7] &= -4 & 0xFFFFFFFF;
	if (this.srcWanted) {
		this.correctIsReg = this.srcIsReg;
		if (this.srcIsReg) {
			this.correctReg = this.srcReg;
		} else {
			this.correctAddr = 0;
			if (this.reg1 >= 0)
				this.correctAddr += this.regValue[this.reg1];
			if (this.reg2 >= 0)
				this.correctAddr += this.regValue[this.reg2] * this.mult;
			this.correctAddr &= 0xFFFFFFFF;
		}
	} else {
		this.correctIsReg = this.dstIsReg;
		if (this.dstIsReg) {
			this.correctReg = this.dstReg;
		} else {
			this.correctAddr = 0;
			if (this.reg1 >= 0)
				this.correctAddr += this.regValue[this.reg1];
			if (this.reg2 >= 0)
				this.correctAddr += this.regValue[this.reg2] * this.mult;
			this.correctAddr &= 0xFFFFFFFF;
		}
	}
	//
	// Always
	//
	this.doneRoutine = doneRoutine;
	this.begTime = new Date();
}

QuestionX86srcDst.regName = ["eax", "ecx", "edx", "ebx", "ebp", "esi", "edi", "esp"];

QuestionX86srcDst.prototype.operand = function (off, reg1, reg2, mult) {
	var s = "";
	if (off != 0)
		s += off.toString();
	if (reg1 >= 0  ||  this.reg2 >= 0)
		s += "(";
	if (reg1 >= 0)
		s += "\\%" + QuestionX86srcDst.regName[reg1];
	if (reg2 >= 0  || mult > 1)
		s += ",";
	if (reg2 >= 0)
		s += "\\%" + QuestionX86srcDst.regName[reg2];
	if (mult > 1)
		s += "," + this.mult.toString();
	if (reg1 >= 0  ||  this.reg2 >= 0)
		s += ")";
	return (s);
}

QuestionX86srcDst.prototype.localHTML = function (active) { 
	var s = "מצב האוגרים לשימוש כללי הוא כלהלן:"
	s += "<table style='direction: ltr'>";
	s += "<tr>";
	var i;
	for (i = 0; i < QuestionX86srcDst.regName.length;  i++) {
		if (i == 4) s += "</tr><tr>";
		s += "<td>";
		s += "\\(\\tt " + QuestionX86srcDst.regName[i] + "=" + (("0000000" + (this.regValue[i]>>>0).toString(16).toUpperCase()).substr(-8)) + "\\)";
		s += "</td>";
	}
	s += "</tr>";
	s += "</table>";

	s += "מהו אופרנד";
	if (this.srcWanted)
		s += " המקור ";
	else
		s += " היעד ";
	s += "בפקודה ";
	s += "\\(\\tt "+ "movl\\ ";
	if (this.srcIsReg)
		s += "\\%" + QuestionX86srcDst.regName[this.srcReg];
	else {
		s += this.operand(this.off, this.reg1, this.reg2, this.mult);
	}
	s += ",";
	if (this.dstIsReg)
		s += "\\%" + QuestionX86srcDst.regName[this.dstReg];
	else {
		s += this.operand(this.off, this.reg1, this.reg2, this.mult);
	}
	s += "\\):";
	if (active) {
		s += "<table>";
		s += "<tr>";
		s += "<td>";
		s += '<input type="radio" id="QuestionX86srcDst0" onclick="QuestionX86srcDst_radio(event)"> אין פקודה כזו';
		s += "</td>";
		s += "</tr>";
		s += "<tr>";
		s += "<td>";
		s += '<input type="radio" id="QuestionX86srcDst1" onclick="QuestionX86srcDst_radio(event)"';
		if (this.correctIsReg)
			s += ' checked'
		s += '>';
		s += 'האופרנד הינו האוגר ';
		s += '<input type="text" id="QuestionX86srcDst3" size=4 style="direction:ltr;"';
		if (this.correctIsReg)
			s += 'value="' + QuestionX86srcDst.regName[this.correctReg] + '"';
		s += '>';
		s += "</td>";
		s += "</tr>";
		s += "<tr>";
		s += "<td>";
		s += '<input type="radio" id="QuestionX86srcDst2" onclick="QuestionX86srcDst_radio(event)"';
		if (!this.correctIsReg)
			s += ' checked'
		s += '> האופרנד בזיכרון וכתובתו בהקסה ';
		s += '<input type="text" id="QuestionX86srcDst4" size=10 style="direction:ltr;"';
		if (!this.correctIsReg) 
			s += 'value="' + (("0000000" + (this.correctAddr>>>0).toString(16).toUpperCase()).substr(-8)) + '"';
		s += '>';
		s += "</td>";
		s += "</tr>";
		s += "<tr>";
		s += "<td>";
		s += "<input type='button' value='OK' onclick='QuestionX86srcDst_zuzu(event)'>";
		s += "</td>";
		s += "</tr>";
		s += "<table>";
	}
	return(s);
}

QuestionX86srcDst.prototype.HTML = function () {
	return(this.localHTML(1));
}

QuestionX86srcDst.prototype.feedback = function () {
	return(this.localHTML(0));
}

QuestionX86srcDst.prototype.format = function (num, base) {
	if (base == 16) 
		return (("0000000" + this.v.toString(16).toUpperCase()).substr(-8));
	if (base == 8)
		return (("000000000" + this.v.toString(8)).substr(-11));
	if (base == 10)
		return (this.v.toString(10));
	return("???");
}


QuestionX86srcDst.prototype.grade = function () {
	if (this.ansRadio[0])
		return (0);
		
	if (this.correctIsReg != this.ansRadio[1])
		return (0);
	if (this.correctIsReg) {
		if (QuestionX86srcDst.regName[this.correctReg] == this.answer.toLowerCase())
			return (100);
		return (0);
	} else {
		var pat="[^0-9a-fA-F]";
		if (this.answer.search(pat) >= 0)
			return (0);
		if ((this.correctAddr>>>0) == parseInt(this.answer, 16))
			return (100);
		return (0);
	}
}

QuestionX86srcDst.prototype.userAnswerHTML = function () {
	var s = "<table><tr><td>";
	if (this.ansRadio[0])
		s += 'אין פקודה כזו';
	else {
		if (this.ansRadio[1])
			s += 'האופרנד הינו האוגר ';
		else if (this.ansRadio[2])
			s += 'האופרנד בזיכרון וכתובתו ';
		s += this.answer;
	}
	s += "</td></tr></table>";
	return (s);
}

QuestionX86srcDst.prototype.goodAnswerHTML = function () {
	var s;
	s = "<table><tr><td>";
	if (this.correctIsReg) {
		s += 'האופרנד הינו האוגר ';
		s += QuestionX86srcDst.regName[this.correctReg];
	} else {
		s += 'האופרנד בזיכרון וכתובתו ';
		s += ("0000000" + this.correctAddr.toString(16).toUpperCase()).substr(-8);
	}
	s += "</td></tr></table>";
	return (s);
	return "\\(\\fbox{" + this.format(this.correctAnswer, this.radix) + "}\\)";
}

QuestionX86srcDst.prototype.period = function () {
	var delta = Math.round((this.endTime - this.begTime)/1000);
	var m = Math.trunc(delta / 60);
	var s = delta % 60;
	return (m + ":" + (100+s).toString().substr(1,3));
}
