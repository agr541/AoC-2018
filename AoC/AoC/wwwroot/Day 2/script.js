// noprotect
window.module = function () {
    var getInput = function (inputSelector) {
        var input = document.querySelector(inputSelector);
        return input.value;
    };

    var getInputFromUrl = function (url, callBack) {
        var req = new XMLHttpRequest();
        req.addEventListener('readystatechange', function () {
            var xhr = this;
            if (xhr.readyState === 4 && xhr.status === 200) {
                callBack(req.responseText);
            }
        });
        req.open('GET', url);
        req.send();
    };

    var setOutput = function (outputSelector, outputValue) {
        var output = document.querySelector(outputSelector);
        output.value = outputValue;
    };

    var processLine = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
           
        }
        return result;
    };

    var getCoeficient = function (charCount) {
        var result = { exactlyTwoOccurs: false, exactlyThreeOccurs: false };
        var keys = Object.keys(charCount);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            result.exactlyTwoOccurs = result.exactlyTwoOccurs || (charCount[key] === 2);
            result.exactlyThreeOccurs = result.exactlyThreeOccurs || (charCount[key] === 3);
            if (result.exactlyTwoOccurs && result.exactlyThreeOccurs) {
                break;
            }
        }
        return result;
    };

    var multiplyKeys = function (coeficients) {
        var result = 1;
        var keys = Object.keys(coeficients);
        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            result *= coeficients[key];
        }
        return result;
    };

    var sumKeys = function (coeficients) {
        var result = new Object();
        for (var i = 0; i < coeficients.length; i++) {
            var coeficient = coeficients[i];
            var keys = Object.keys(coeficient);
            for (var j = 0; j < keys.length; j++) {
                var key = keys[j];
                if (coeficient[key]) {
                    if (typeof result[key] === 'undefined') {
                        result[key] = 1;
                    } else {
                        result[key]++;
                    }
                }
            }
        }
        return result;
    };

    var processLinesA = function (lines) {
        var results = new Array();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var charCount = new Object();
            for(var j = 0; j < line.length; j++) {
                var char = line.charCodeAt(j);
                if (typeof charCount[char] === 'undefined') {
                    charCount[char] = 1;
                } else {
                    charCount[char]++;
                }
            }
            var lineCoeficient = getCoeficient(charCount);
            results.push(lineCoeficient);
        }
        var coeficientSum = sumKeys(results);
        var result = multiplyKeys(coeficientSum);
        return result;
    };
    var getNotMatchingCharactersPositions = function (line, otherLine, max) {
        var result = [];
        for (var i = 0; i < line.length; i++) {
            var lineCharCode = line.charCodeAt(i);
            var otherlineCharCode = otherLine.charCodeAt(i);
            if (lineCharCode !== otherlineCharCode) {
                result.push(i);
                if (result.length > max) {
                    result = [];
                    break;
                }
            }
        }
        return result;
    };

    var processLinesB = function (lines) {
        var result = '';
        for (var i = 0; i < lines.length; i++) {
           
            var line = lines[i];
            for (var j = 0; j < lines.length; j++) {
                if (j === i) continue;
                var otherLine = lines[j];
                var notMatchingCharactersPositions = getNotMatchingCharactersPositions(line, otherLine, 1);
                var notMatchingCharactersCount = notMatchingCharactersPositions.length;
                if (notMatchingCharactersCount === 1) {
                    for (var k = 0; k < line.length; k++) {
                        if (notMatchingCharactersPositions.indexOf(k) === -1) {
                            result += line.substr(k,1);
                        }
                    }
                    break;
                }
            }
            if (result != '') {
                break;
            }
        }
        return result;
    };
    
    var pocessInputA = function (input) {
        var lines = input.split('\n');
        return processLinesA(lines);
    };

    var pocessInputB = function (input) {
        var lines = input.split('\n');
        return processLinesB(lines);
    };

    var initializeA = function (options) {
        var input = getInputFromUrl(options.inputUrl, function (input) {
            var output = pocessInputA(input);
            setOutput(options.outputSelector, output);
        });
    };

    var initializeB = function (options) {
        var input = getInputFromUrl(options.inputUrl, function (input) {
            var output = pocessInputB(input);
            setOutput(options.outputSelector, output);
        });
    };

    return {
        runA: initializeA,
        runB: initializeB
    };
};



