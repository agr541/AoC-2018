// noprotect
window.module = function () {
    var answerA = 0;
    var answerB = 0;
    var processLineA = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            result = parseInt(lineContents);
        }
        return result;
    };
    var processLinesA = function (lines) {
        var result = 0;
        var lastDepth = null;
        lines.forEach((line) => {
            var depth = processLineA(line);
            if (lastDepth != null && lastDepth < depth) {
                result++;
            }
            lastDepth = depth;
        });
        return result;
    };
    var windowedDepths = [];
    var windowIndex = 0;
    var windowLength = 3;
    var lastWindowDistance = 0;
    var answerB = 0;
    var processLineB = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            if (windowedDepths.length < 3) {
                windowedDepths.push([]);
            }
            if (windowedDepths[windowIndex].length == 3) {
                var windowDistance = windowedDepths[windowIndex].reduce((a, b) => a + b);
                if (windowDistance > lastWindowDistance) {
                    answerB++;
                    lastWindowDistance = windowDistance;
                }
                windowedDepths.push([]);
                windowIndex++;
            }
            result = parseInt(lineContents);
            windowedDepths[windowIndex].push(result);
            if (windowedDepths.length > windowIndex + 1) {
                windowedDepths[windowIndex + 1].push(result);
            }
            if (windowedDepths.length > windowIndex + 2) {
                windowedDepths[windowIndex + 2].push(result);
            }
        }
        return result;
    };
    var processLinesB = function (lines) {
        var result = 0;
        lines.forEach(function (line) {
            processLineB(line);
        });
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
        output.value = outputValue;
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
        windowedDepths = [];
        windowIndex = 0;
        windowLength = 3;
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