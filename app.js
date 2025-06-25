// globals
var wordIndices

function OnLoad() {
    wordIndices = [];
    RenderChosenWords();
    RenderKbForWord();
    var matchingWordIndices = RenderMatchingWordButtons();
    EnableDisableKeys(matchingWordIndices);
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
    return "<button class='letter' id='keyButton" + ch + "' onclick='KbPressForWord(\"" + ch + "\")'>" + ch + "</button>";
}

function DrawHalfKeyGap() {
    return "&nbsp;&nbsp;&nbsp;";
}

function DrawKeyGap() {return DrawHalfKeyGap() + DrawHalfKeyGap();}

function KbPressForWord(ch) {
    var el = document.getElementsByClassName("prefix")[0];
    el.setAttribute("value", el.getAttribute("value") +ch);
    var matchingWordIndices = RenderMatchingWordButtons();
    if( matchingWordIndices.length===1) {
        AddWord(matchingWordIndices[0]);
        el.setAttribute("value", "");
        matching = MatchingWordIndices("");
        EnableDisableKeys(matching);
        RenderMatchingWordButtons();
    } else {
        EnableDisableKeys(matchingWordIndices);
    }
}

function RenderMatchingWordButtons() {
    var elPrefix = document.getElementsByClassName("prefix")[0]
    var el = document.getElementById("matchingWords");
    if (elPrefix !== undefined) {
        var prefix = elPrefix.getAttribute("value");
        var matchingWordIndices = MatchingWordIndices(prefix);
        el.setHTMLUnsafe(DrawMatchingWordButtons(matchingWordIndices));
        return matchingWordIndices;
    } else {
        el.setHTMLUnsafe("");
        return [];
    }
}

function AddWord(wordIndex) {
    wordIndices.push(wordIndex);
    RenderChosenWords();
}

function RenderChosenWords() {
    for (var i = 0; i < 12; i++) {
        var id = "w" + i;
        var el = document.getElementById(id);
        html = "(word " + (i+1) + ")<br>";
        if( i < wordIndices.length ) {
            var buttonClass = "insufficient";
            if (wordIndices.length===12) {
                buttonClass = "invalid";
            }
            html += "<button class='" + buttonClass + "'>";
            html += DrawWord(wordIndices[i]);
            html += "</button>\n";
        } else if ( i === wordIndices.length ) {
            html += DrawWordEditBox();
        } else {
            html += DrawEmptyWord();
        }
        el.setHTMLUnsafe(html);
    }
}

function DrawWordEditBox() {
    return "<input type='text' " +
        "class='prefix' " +
        "size='4' " +
        "maxlength='4' " +
        "value='' " +
        "inputmode='none'" +
        "/>";
}

function DrawEmptyWord() {
    return "----";
}

function OnChooseWord(index) {
    AddWord(index);
    var el = document.getElementsByClassName("prefix")[0];
    if (el) {
        el.setAttribute("value", "");
    }
    matching = MatchingWordIndices("");
    EnableDisableKeys(matching);
    RenderMatchingWordButtons();
}