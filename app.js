// globals
var wordIndices;
var selectedWord;

function OnLoad() {
    wordIndices = [];
    selectedWord = null;
    RenderChosenWords().then(buttonClass => {
        RenderInstruction(buttonClass);
        RenderKbForWord();
        var matchingWordIndices = RenderMatchingWordButtons();
        EnableDisableKeys(matchingWordIndices);
    }).catch(() => {
        RenderInstruction("invalid");
        RenderKbForWord();
        var matchingWordIndices = RenderMatchingWordButtons();
        EnableDisableKeys(matchingWordIndices);
    });
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
    RenderChosenWords().then(buttonClass => {
        RenderInstruction(buttonClass);
    }).catch(()=>{
        RenderInstruction("invalid");
    });
}

async function Check12Words() {
    var wordsArray = [];
    for (var i=0; i<12; i++ ) {
        wordsArray[i]= bip39Words[wordIndices[i]];
    }
    return await TryWords(wordsArray)
}

async function RenderChosenWords() {
    var valid = await Check12Words();
    var buttonClass = "valid";
    if (!valid) {
        buttonClass = "invalid";
    }
    if (wordIndices.length !== 12) {
        buttonClass = "insufficient"
    }
    for (var i = 0; i < 12; i++) {
        var id = "w" + i;
        var el = document.getElementById(id);
        html = "(word " + (i + 1) + ")<br>";
        var thisButtonClass = buttonClass;
        if (selectedWord === i) {
            thisButtonClass = "selected";
        }
        if (i < wordIndices.length) {
            html += "<button " +
                "class='" + thisButtonClass + "' " +
                "onclick='OnSelectWord(" + i + ")' " +
                ">";
            html += DrawWord(wordIndices[i]);
            html += "</button>\n";
        } else if (i === wordIndices.length) {
            html += DrawWordEditBox();
        } else {
            html += DrawEmptyWord();
        }
        el.setHTMLUnsafe(html);
    }
    return buttonClass;
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

function RenderInstruction(buttonClass) {
    el = document.getElementsByClassName("msg")[0];
    if (buttonClass === "insufficient") {
        el.setHTMLUnsafe("Add letters or a word:")
    } else if (buttonClass === "invalid") {
        if (selectedWord === null) {
            el.setHTMLUnsafe("Checksum invalid, choose a word above to change...");
            HideKeyboard();
            ClearValidChecksumButtons();
        } else {
            el.setHTMLUnsafe("Checksum invalid, replace with one of these valid words:");
            RenderValidChecksumButtons();
        }
    } else if (buttonClass === "valid") {
        el.setHTMLUnsafe("Checksum valid, well done!")
        ClearValidChecksumButtons();
        HideKeyboard();
    }
}

function OnSelectWord(nthWord) {
    selectedWord = nthWord;
    RenderChosenWords().then(buttonClass => {
        RenderInstruction(buttonClass);
    }).catch(()=>{
        RenderInstruction("invalid");
    });
}

async function GenerateValidWordButtons(baselineWords, indexToReplace) {
    return await AppendButtonIfChecksumValidRecurse(baselineWords, indexToReplace, 0,"");
}

async function AppendButtonIfChecksumValidRecurse(baselineWords, indexToReplace, nextWordIndexToTry, appendStringSoFar) {
    var htmlResultSoFar = "" + appendStringSoFar;
    if (nextWordIndexToTry === 2048) {
        return htmlResultSoFar;   // Break recursive calls
    }

    var wordsToTry = [];
    for (var i = 0; i < 12; i++) {
        wordsToTry.push(baselineWords[i]);
    }
    wordsToTry[indexToReplace] = bip39Words[nextWordIndexToTry];

    var valid = await TryWords(wordsToTry);

    var button = "";
    if (valid) {
        button += "<button " +
            "class='correctschecksum' " +
            "onclick='OnReplaceWord(" + nextWordIndexToTry + ")' " +
            ">";
        button += DrawWord(nextWordIndexToTry);
        button += "</button>\n";
    }
    htmlResultSoFar += button;
    return await AppendButtonIfChecksumValidRecurse(baselineWords, indexToReplace, nextWordIndexToTry + 1, htmlResultSoFar);
}

function RenderValidChecksumButtons()
{
    var html = "";
    var el = document.getElementById("matchingWords");
    if (selectedWord === null ) {
        // User has not selected a word to replace
        el.setHTMLUnsafe(html);
        return;
    }
    if (wordIndices.length!==12) {
        // There can be no valid replacements until we have 12 words
        el.setHTMLUnsafe(html);
        return;
    }
    var baselineWords = [];
    for (var i = 0; i < 12; i++) {
        baselineWords[i] = bip39Words[wordIndices[i]];
    }
    GenerateValidWordButtons(baselineWords, selectedWord).then((p)=>{
        html = p;
        el.setHTMLUnsafe(html);
    });
}

function ClearValidChecksumButtons()
{
    var el = document.getElementById("matchingWords");
    el.setHTMLUnsafe("");
}


async function TryWords(wordsArray) {
    var passphrase = wordsArray[0];
    for (var i = 1; i < 12; i++) {
        passphrase += " " + wordsArray[i];
    }
    try {
        await Passphrase.decode(passphrase);
    } catch {
        return false;
    }
    return true;
}

function OnReplaceWord(wordIndex) {
    wordIndices[selectedWord] = wordIndex;
    RenderChosenWords().then(buttonClass => {
        RenderInstruction(buttonClass);
    }).catch(()=>{
        RenderInstruction("invalid");
    });
}