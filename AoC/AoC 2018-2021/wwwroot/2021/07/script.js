// noprotect
class Crab {
    constructor(x) {
        this.x = 0;
        this.x = x;
    }
}
window.module = function () {
    var answerA = 0;
    var answerB = 0;
    var crabs = [];
    var processLine = function (line) {
        var result = 0;
        crabs.push(...line.split(',').map(n => parseInt(n)).map(i => new Crab(i)));
        return result;
    };
    var processLineA = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            processLine(lineContents);
        }
        return result;
    };
    var processLinesA = function (lines) {
        var result = 0;
        crabs = [];
        lines.forEach((line) => {
            result += processLineA(line);
        });
        var maxX = crabs.map(c => c.x).reduce((a, b) => a > b ? a : b);
        var fuelCosts = [];
        for (var x = 0; x <= maxX; x++) {
            var fuelCost = crabs.map(c => Math.abs(x - c.x)).reduce((a, b) => a + b);
            fuelCosts.push(fuelCost);
        }
        var leastFuel = fuelCosts.reduce((a, b) => a < b ? a : b);
        answerA = leastFuel;
        return result;
    };
    var processLineB = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            result += processLine(lineContents);
        }
        return result;
    };
    var processLinesB = function (lines) {
        var result = 0;
        crabs = [];
        lines.forEach(function (line) {
            result += processLineB(line);
        });
        var maxX = crabs.map(c => c.x).reduce((a, b) => a > b ? a : b);
        var fuelCosts = [];
        for (var x = 0; x <= maxX; x++) {
            var fuelCost = crabs.map((c) => {
                var n = Math.abs(x - c.x);
                return (n * (n + 1)) / 2;
            }).reduce((a, b) => a + b);
            fuelCosts.push(fuelCost);
        }
        var leastFuel = fuelCosts.reduce((a, b) => a < b ? a : b);
        answerB = leastFuel;
        return result;
    };
    var fallBackRequested = false;
    var getInputFromUrl = function (url, fallbackUrl, callBack) {
        var req = new XMLHttpRequest();
        req.addEventListener('readystatechange', function () {
            var xhr = this;
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (req.responseText.length !== 0 && fallbackUrl !== 'undefined') {
                    callBack(req.responseText);
                }
                if (req.responseText.length === 0 && typeof fallbackUrl !== 'undefined' && fallBackRequested === false) {
                    fallBackRequested = true;
                    req.open('GET', fallbackUrl);
                    req.send();
                }
            }
        });
        req.open('GET', url);
        req.send();
    };
    var setOutput = function (outputSelector, outputValue) {
        var output = document.querySelector(outputSelector);
        if (output !== null) {
            output.value = outputValue;
        }
    };
    var pocessInputA = function (input) {
        var lines = input.split('\r\n');
        return processLinesA(lines);
    };
    var pocessInputB = function (input) {
        var lines = input.split('\r\n');
        return processLinesB(lines);
    };
    var initializeA = function (options) {
        var input = getInputFromUrl(options.inputUrl, options.inputUrlFallback, function (input) {
            var output = pocessInputA(input);
            if (answerA !== 0) {
                output = answerA;
            }
            setOutput(options.outputSelector, output);
        });
    };
    var initializeB = function (options) {
        var input = getInputFromUrl(options.inputUrl, options.inputUrlFallback, function (input) {
            var output = pocessInputB(input);
            if (answerB !== 0) {
                output = answerB;
            }
            setOutput(options.outputSelector, output);
        });
    };
    var initialize = (options) => {
        if (options.runPart === 1) {
            initializeA(options);
        }
        else if (options.runPart === 2) {
            initializeB(options);
        }
    };
    return {
        run: initialize
    };
};
//# sourceMappingURL=script.js.map