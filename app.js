function OnLoad() {
    RenderKbForWord();
    RenderMatchingWordButtons();
}

function RenderKbForWord() {
    var topRow="QWERTYUIOP";
    var midRow = "ASDFGHJKL";
    var botRow = "ZXCVBNM";
    var top = DrawKbRow(topRow);
    var mid = DrawKbRow(midRow);
    var bot = DrawKbRow(botRow);
    var el = document.getElementById("kbForWord");
    el.setHTMLUnsafe(top + "<br>" + DrawHalfKeyGap() + mid + "<br>" + DrawKeyGap() + bot);
}

function DrawKbRow(keys) {
    var result="";
    for (var i = 0; i < keys.length; i++) {
        result += DrawKeyButton(keys[i]) + "\n";
    }
    return result;
}

function DrawKeyButton(ch) {
    return "<button class='letter' onclick='KbPressForWord(\"" + ch + "\")'>" + ch + "</button>";
}

function DrawHalfKeyGap() {
    return "&nbsp;&nbsp;&nbsp;";
}

function DrawKeyGap() {return DrawHalfKeyGap() + DrawHalfKeyGap();}

function KbPressForWord(ch) {
    var el = document.getElementById("prefix");
    el.setAttribute("value", el.getAttribute("value") +ch);
    RenderMatchingWordButtons();
}

function RenderMatchingWordButtons() {
    var prefix = document.getElementById("prefix").getAttribute("value");
    var el = document.getElementById("matchingWords");
    el.setHTMLUnsafe(DrawMatchingWordButtons(prefix));
}
