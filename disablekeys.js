function EnableDisableKeys(matchingWordIndices) {
    var el = document.getElementsByClassName("prefix")[0];
    if (!el) {
        // All words now chosen
        HideKeyboard()
        return
    }
    var prefix = el.getAttribute("value");
    var nextChar = prefix.length;
    var enable = [];
    // i==0 corresponds to 'A'
    for (var i = 0; i < 26; i++) {
        enable[i] = false;  // Until we find a word with the char
    }
    for (var m = 0; m < matchingWordIndices.length; m++) {
        var word = bip39Words[matchingWordIndices[m]].toUpperCase();
        var ch = word.charCodeAt(nextChar);
        var chIndex = ch - 65;
        enable[chIndex] = true;
    }
    for (i = 0; i < 26; i++) {
        var id = "keyButton" + String.fromCharCode(i + 65);
        el = document.getElementById(id);
        el.disabled = !enable[i];
    }
}
function HideKeyboard() {
    for (i = 0; i < 26; i++) {
        var id = "keyButton" + String.fromCharCode(i + 65);
        el = document.getElementById(id);
        el.hidden = true;
    }
}