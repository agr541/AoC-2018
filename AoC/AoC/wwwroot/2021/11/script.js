class Octopus {
    constructor(energyLevel) {
        this.step = function () {
            var result = false;
            if (!this.flashed) {
                this.energyLevel++;
                if (this.energyLevel > 9) {
                    this.flash();
                    result = true;
                }
            }
            return result;
        };
        this.flash = function () {
            this.flashCount++;
            this.energyLevel = 0;
            this.flashed = true;
        };
        this.energyLevel = energyLevel;
        this.flashCount = 0;
        this.flashed = false;
    }
}
// noprotect
window.module = function () {
    var answerA = 0;
    var answerB = 0;
    var octopi = new Array();
    var out;
    var processLine = function (line) {
        var result = 0;
        octopi.push(line.split('').map(e => new Octopus(parseInt(e))));
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
    var processLineB = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            result += processLine(lineContents);
        }
        return result;
    };
    var processLinesA = function (lines) {
        var result = 0;
        octopi = new Array();
        lines.forEach((line) => {
            result += processLineA(line);
        });
        out = addDebugOut();
        runStep(100);
        answerA = octopi.flat().map(o => o.flashCount).reduce((a, b) => a + b);
        return result;
    };
    var outputOctopi = function () {
        var result = '';
        octopi.forEach(octoRow => {
            octoRow.forEach(octo => {
                result += octo.energyLevel;
            });
            result += '\n';
        });
        return result;
    };
    var addDebugOut = function () {
        var debugOut = document.createElement("pre");
        document.body.append(debugOut);
        return debugOut;
    };
    var runStep = function (count) {
        for (var i = 0; i < count; i++) {
            step(octopi.flat());
            octopi.flat().flat().forEach(octo => octo.flashed = false);
            out.innerHTML = outputOctopi();
        }
    };
    var runUntilAllLit = function () {
        var result = 0;
        var count = 1000;
        for (var i = 0; i < count; i++) {
            step(octopi.flat());
            if (octopi.flat().flat().every(octo => octo.flashed)) {
                result = i + 1;
                break;
            }
            octopi.flat().flat().forEach(octo => octo.flashed = false);
            out.innerHTML = outputOctopi();
        }
        return result;
    };
    var step = function (steppingOctos) {
        var flashedOctos = new Array();
        steppingOctos.forEach(octo => {
            if (octo.step()) {
                var closeOctoPi = getCloseOctopi(octo);
                step(closeOctoPi);
            }
        });
    };
    var getCloseOctopi = function (octo) {
        var y = octopi.findIndex(or => or.indexOf(octo) > -1);
        var x = octopi[y].indexOf(octo);
        var nearbyOctopi = new Array();
        nearbyOctopi.push([x - 1, y - 1]);
        nearbyOctopi.push([x, y - 1]);
        nearbyOctopi.push([x + 1, y - 1]);
        nearbyOctopi.push([x - 1, y]);
        nearbyOctopi.push([x + 1, y]);
        nearbyOctopi.push([x - 1, y + 1]);
        nearbyOctopi.push([x, y + 1]);
        nearbyOctopi.push([x + 1, y + 1]);
        return nearbyOctopi.filter(coords => coords[0] > -1 && coords[1] > -1 && coords[1] < octopi.length && coords[0] < octopi[0].length).map(coords => octopi[coords[1]][coords[0]]);
    };
    var processLinesB = function (lines) {
        var result = 0;
        octopi = new Array();
        lines.forEach(function (line) {
            result += processLineB(line);
        });
        out = addDebugOut();
        answerB = runUntilAllLit();
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