var ssss = 0;

var count = 0;
var wrongNumber = 0;
var rightNumber = 0;
var emptyNumber = 0;
var answerList = new Array(9);
var tableList = new Array(9);
var customerTable = [];
for(var i = 0; i < 9; i++){
    answerList[i] = new Array(9);
    tableList[i] = new Array(9);
}

var dragEle;
        
function showAnswer() {
    $("#sudoTable td").empty();
	for(var i = 0; i < 9; i++){
        for(var j = 0; j < 9; j++){
			var no = $("#no" + answerList[i][j]).clone();
			no.attr("draggable", "false");
            $("#" + i + "_" + j).append(no);
        }
    }
}        

function bindDrag(obj){
	obj.on("dragstart", function(e){
	   dragEle = $(this).clone();
	})
}

function bindDragOver(obj){
	obj.on("dragover", function(e){
		e.preventDefault();
		$("#sudoTable .dragover").removeClass("dragover");
		$(this).addClass("dragover");
	})
}

function bindDrop(obj, type) {
    obj.on("drop", function (e) {
        $("#sudoTable dragover").removeClass("dragover");
        e.preventDefault();
        var id = $(this).attr("id");
        var row = parseInt(id.split("_")[0]);
        var line = parseInt(id.split("_")[1]);
        if (("no" + answerList[row][line]) == $(dragEle).attr("id")) {
            $(dragEle).attr("draggable", "false");
            $(this).append(dragEle);
            rightNumber++;
            $(this).off("dragover");
            $(this).off("drop");
            emptyNumber--;
            $("#right").html(rightNumber);
            $("#empty").html(emptyNumber);
			if(emptyNumber <= 0){
				alert("Congratulation!");
			}
        }
        else {
            alert("wrong!");
            wrongNumber++;
            $("#wrong").html(wrongNumber);
        }
    })
}

function clearAnswerList() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            answerList[i][j] = null;
        }
    }
}

function bindCustomerDrop(obj) {
    obj.on("drop", function (e) {
        $("#sudoTable dragover").removeClass("dragover");
        e.preventDefault();
        $(this).empty();
        var id = $(this).attr("id");
        var row = parseInt(id.split("_")[0]);
        var line = parseInt(id.split("_")[1]);
        var number = parseInt($(dragEle).attr("id").split("no")[1]);
        if(checkTable(answerList, number, row, line)){
            answerList[row][line] = number;
            $(this).append(dragEle);
        }
        else {
            alert("Can not put here");
        }
    })
}

function init_list() {
    var answerList = new Array(9);
    var numberList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var i = 0; i < 9; i++) {
        answerList[i] = new Array(9);
    }
    for (var i = 0; i < 9; i++) {
        var random = Math.floor(Math.random() * (8 - i));
        var row = Math.floor(Math.random() * 9);
        answerList[row][i] = numberList[random];
        numberList.remove(numberList[random]);
    }
    return answerList;
}

function init_sudoTable() {
    count = 0;
    time = 0;
    wrongNumber = 0;
    rightNumber = 0;
    emptyNumber = 0;
    $("#sudoTable td").empty();
    $("#sudoTable td").off("dragover");
    $("#sudoTable td").off("drop");
    $("#numberlist a").off("dragstart");
	var emptyList = [];
	var restList;
	var numberList = new Array(9);
    tableList = new Array(9);
    for(var i = 0; i < 9; i++){
        tableList[i] = new Array(9);
        numberList[i] = [];
        for (var j = 0; j < 9; j++) {
            numberList[i].push(j);
        }
    }
    answerList = init_list();
    while (!resolveSudo(answerList, getEmptyList(answerList))) {
        answerList = init_list();
    };

    for(var i = 0; i < 9; i++){
        for(var j = 0; j < 9; j++){
            tableList[i][j] = answerList[i][j];
        }
    }

    /** Dig Method (1)
    **/
    var noList = new Array(9);
    for (var i = 0; i < 9; i++) {
        noList[i] = [];
        for (var j = 0; j < 9; j++) {
            noList[i].push(j);
        }
    }
    var ran = Math.floor(Math.random() * 9);
    for (var i = 0; i < 9; i++) {
        tableList[ran][i] = null;
        noList[i].remove(ran);
    }
    var len = 8;
    var po = 0;
    while (len > 0) {
        ran = Math.floor(Math.random() * len);
        var pos1 = noList[po][ran];
        for (var j = 0; j < 9; j++) {
            if (tableList[pos1][j] == (po + 1)) {
                if (digTable(tableList, (po + 1), pos1, j))
                    tableList[pos1][j] = null;
                break;
            }
        }
        noList[po].remove(pos1);
        len--;
        for (var i = 0; i < 9; i++) {
            if (noList[i].length > len) {
                po = i;
                len = noList[i].length;
            }
        }
    }


    /** Dig Method (2)
    
    var numberList = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (var i = 0; i < 9; i++) {
        var random = numberList[Math.floor(Math.random() * (9 - i))];
        for(var j = 0; j < 9; j++){
            if (tableList[random][j] != null) {
                if (digTable(tableList, answerList[random][j], random, j)){
                    tableList[random][j] = null;
                }
            }
        }
        numberList.remove(random);
    }

    **/
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (tableList[i][j] == null) {
                emptyNumber++;
                bindDragOver($("#" + i + "_" + j));
                bindDrop($("#" + i + "_" + j));
            }
            else {
                var no = $("#no" + tableList[i][j]).clone();
                no.attr("draggable", "false");
                $("#" + i + "_" + j).append(no);
            }
        }
    }
	$("#right").html(rightNumber);
	$("#wrong").html(wrongNumber);
	$("#empty").html(emptyNumber);
	bindDrag($("#numberlist a"));
}

function getEmptyList(arrList){
    var emptyList = [];
    for(var i=0; i<=8; i++) {
        for(var j=0; j<=8; j++) {
            if (arrList[i][j] == null) {
                emptyList.push(9*i+j);
            }
        }
    }
    return emptyList;
}

function resolveSudo(arrList, emptyList) {
    ssss++;
    if (emptyList.length == 0) {
        count++;
        return true;
    }
    var firstValue = emptyList[emptyList.length - 1];
    var row = parseInt(firstValue/9);
    var col = parseInt(firstValue % 9);
    for(var k=1; k<=9; k++) {
        if(checkTable(arrList, k, row, col)) {
            arrList[row][col] = k;
            emptyList.pop();
            if(resolveSudo(arrList, emptyList)){
                if (count > 1) return true;
				//return false;
			}
            arrList[row][col] = null;
            emptyList.push(firstValue);
        }
    }
    return false;
}

function checkTable(arrList, num, row, line){
    for(var p = 0; p < 9; p++){
        if((arrList[row][p] == num)||(arrList[p][line] == num))
            return false;
    }
    var startRow = Math.floor(row/3)*3;
    var startLine = Math.floor(line/3)*3;
    for(var i = startRow; i < startRow + 3; i++){
        for(var j = startLine; j < startLine + 3; j++){
            if((arrList[i][j] == num))
                return false;
        }
    }
    return true;
}

function digTable(arrList, num, row, line) {

    var tempArray = new Array(9);
    for (var i = 0; i < 9; i++) {
        tempArray[i] = new Array(9);
        for (var j = 0; j < 9; j++) {
            tempArray[i][j] = arrList[i][j];
        }
    }

    for (var n = 1; n <= 9; n++) {
        if(num != n){
            if (checkTable(tempArray, n, row, line)) {
                tempArray[row][line] = n;
                if (resolveSudo(tempArray, getEmptyList(tempArray)))
                    return false;
            }
        }
    }
    return true;
}