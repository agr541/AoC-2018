// noprotect
window.module = function () {
    var answerA = 0;
    var answerB = 0;
    var windowedDepths = [];
    var windowIndex = 0;
    var windowSize = 3;
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
    var processLineB = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            if (windowedDepths.length < windowSize) {
                windowedDepths.push([]);
            }
            if (windowedDepths[windowIndex].length == windowSize) {
                windowedDepths.push([]);
                windowIndex++;
            }
            result = parseInt(lineContents);
            for (var i = 0; i < windowSize; i++) {
                if (windowedDepths.length > windowIndex + i) {
                    windowedDepths[windowIndex + i].push(result);
                }
            }
        }
        return result;
    };
    var processLinesB = function (lines) {
        var result = 0;
        lines.forEach(function (line) {
            processLineB(line);
        });
        var windowDepths = windowedDepths.map(function (values) {
            return values.reduce(function (a, b) {
                return a + b;
            });
        });
        for (var i = 1; i < windowDepths.length - 1; i++) {
            if (windowDepths[i] > windowDepths[i - 1]) {
                answerB++;
            }
        }
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
        windowedDepths = [];
        windowIndex = 0;
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