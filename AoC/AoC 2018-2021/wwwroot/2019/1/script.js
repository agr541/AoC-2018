// noprotect
window.module = function () {
    var answerALeea = 0;
    var answerAAnt = 0;
    var answerBLeea = 0;
    var answerBAnt = 0;

    var calcFuel = function (mass) {
        var result = 0;
        result = Math.floor(mass / 3) - 2;

        return result;

    };

    var processLine = function (line) {
        var result = 0;
        var lineContents = line.trim();
        var sum = 0;
        if (lineContents.length > 0) {
            answerALeea += parseInt(lineContents);
            var fuelModule = calcFuel(lineContents);
            answerBAnt += fuelModule;

            var extraFuel = calcFuel(fuelModule);
            if (extraFuel > 0) {
                answerBAnt += extraFuel;
                while (extraFuel > 0) {
                    extraFuel = calcFuel(extraFuel);
                    if (extraFuel > 0) {
                        answerBAnt += extraFuel;
                    }
                }
            }
        }
        return result;
    };
    
    var processLinesA = function (lines) {
        var result = 0;
        lines.forEach(function (line) {
            processLine(line);
        });
        answerALeea /= 3;
        answerALeea -= lines.length * 2 + 1;
        answerALeea = Math.floor(answerALeea);
        return result;
    };
    
    var processLinesB = function (lines) {
        var result = 0;
        lines.forEach(function (line) {
            processLine(line);
        });
        
        

        return result;
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
            setOutput(options.outputSelector, 'L:' + answerALeea + ', A:' + answerAAnt);
        });
    };

    var initializeB = function (options) {
        var input = getInputFromUrl(options.inputUrl, function (input) {
            var output = pocessInputB(input);
            setOutput(options.outputSelector, 'L:' + answerBLeea + ', A:' + answerBAnt);
        });
    };

    return {
        runA: initializeA,
        runB: initializeB
    };
};



