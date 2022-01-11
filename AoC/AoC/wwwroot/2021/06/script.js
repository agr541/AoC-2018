// noprotect
var day6;
(function (day6) {
    class Grouping {
        static groupBy(list, keyGetter) {
            var result = new Array();
            list.forEach((item) => {
                var key = keyGetter(item);
                var grouping = result.find(g => g.key === key);
                if (typeof grouping === "undefined") {
                    var newGrouping = new Grouping();
                    newGrouping.key = key;
                    newGrouping.values = [];
                    newGrouping.values.push(item);
                    result.push(newGrouping);
                }
                else {
                    grouping.values.push(item);
                }
            });
            return result;
        }
    }
    class LanternFishPopulation {
        constructor() {
            this.populationCount = 0;
        }
    }
    window.module = function () {
        var answerA = 0;
        var answerB = 0;
        var fishPopulation;
        var processLine = function (line) {
            var result = 0;
            fishPopulation = [];
            fishPopulation.length = 9;
            var input = [...line.split(',').map(a => parseInt(a))];
            Grouping.groupBy(input, (fp) => fp)
                .map(fp => {
                var lfp = new LanternFishPopulation();
                lfp.populationCount = fp.values.length;
                fishPopulation[fp.key] = lfp;
                return lfp;
            });
            for (var i = 0; i < fishPopulation.length; i++) {
                if (typeof fishPopulation[i] === "undefined") {
                    fishPopulation[i] = new LanternFishPopulation();
                }
            }
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
        var ageFishPopulation = function (days) {
            for (var i = 1; i < (days + 1); i++) {
                var populationZero = fishPopulation.shift();
                if (typeof populationZero !== "undefined") {
                    fishPopulation.push(populationZero);
                    fishPopulation[6].populationCount += populationZero.populationCount;
                }
            }
        };
        var processLinesA = function (lines) {
            var result = 0;
            lines.forEach((line) => {
                result += processLineA(line);
            });
            ageFishPopulation(18);
            answerA = fishPopulation.map(fp => fp.populationCount).reduce((a, b) => a + b);
            ageFishPopulation(80 - 18);
            answerA = fishPopulation.map(fp => fp.populationCount).reduce((a, b) => a + b);
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
            fishPopulation = [];
            lines.forEach(function (line) {
                result += processLineB(line);
            });
            ageFishPopulation(256);
            answerB = fishPopulation.map(fp => fp.populationCount).reduce((a, b) => a + b);
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
})(day6 || (day6 = {}));
//# sourceMappingURL=script.js.map