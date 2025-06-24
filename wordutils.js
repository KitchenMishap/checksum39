// Assume prefix is uppercase
function MatchingWordIndices(prefix) {
    var charCount = prefix.length;
    var result = [];
    // the bip39Words array is alphabetically sorted
    for (var i=0; i<bip39Words.length; i++) {
        if (bip39Words[i].substring(0,charCount).toUpperCase()===prefix) {
            result.push(i);
        }
    }
    return result;
}

function DrawWord(wordIndex) {
    var num = Number(wordIndex);
    var bin = num.toString(2);
    var binZeroFilled = ('00000000000'+bin).slice(-11)
    var oct = num.toString(8);
    var octZeroFilled = ('0000'+oct).slice(-4)
    var dec = num.toString(10);
    var decZeroFilled = ('0000'+dec).slice(-4)
    var hex = num.toString(16).toUpperCase();
    var hexZeroFilled = ('000'+hex).slice(-3)
    var decString = "<span class='dec'>" + decZeroFilled + "&nbsp;</span>\n";
    var wordString = "<span class='word'>" + bip39Words[wordIndex] + "</span>\n";
    var numString = "<span class='radix'>oct&nbsp;</span><span class='oct'>" + octZeroFilled + "&nbsp;</span><span class='radix'>hex&nbsp;</span><span class='hex'>" + hexZeroFilled + "</span>\n";
    var binString = "<span class='bin'>" + binZeroFilled + "&nbsp;</span>\n";
    var result = "<div>" + decString + wordString + "<br>\n  " + binString + numString + "</div>\n";
    return result;
}

function DrawMatchingWordButtons(prefix) {
    var resultHtml = "";
    var indices = MatchingWordIndices(prefix);
    if (indices.length==0) {
        return "<span class='msg'>No matching words found</span>";
    }
    for (var i=0; i<indices.length; i++) {
        resultHtml += "<button>" + DrawWord(indices[i]) + "</button>\n";
    }
    return resultHtml;
}