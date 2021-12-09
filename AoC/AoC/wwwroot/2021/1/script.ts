// noprotect
(window as any).module = function () {
    var answerA: number = 0;
    var answerB: number = 0;
    var processLineA = function (line: string) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            result = parseInt(lineContents);
        }
        return result;
    };

    var processLinesA = function (lines: string[]) {
        var result = 0;
        var lastDepth = null;
        lines.forEach((line: string) => {
            var depth = processLineA(line);
            if (lastDepth != null && lastDepth < depth) {
                result++;
            }
            lastDepth = depth;

        });
        return result;
    };

    var windowedDepths = [];
    var firstWindowIndex = 0;
    var windowLength = 3;
    
    var processLineB = function (line: string) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {

            result = parseInt(lineContents);
            if (typeof(windowedDepths[firstWindowIndex])==='undefined') {
                windowedDepths.push([]);
            }
            for (var i = 0; i < (windowLength-1); i++) {
                if (typeof (windowedDepths[firstWindowIndex + i]) !== 'undefined') {
                    var windowDepth = windowedDepths[firstWindowIndex];
                    windowDepth.push(result);
                    if (windowDepth.length === 3) {
                        firstWindowIndex++;
                    }
                }
            }
        }
        return result;
    };

    var processLinesB = function (lines: string[]) {
        var result = 0;
        lines.forEach(function (line) {
            processLineB(line);
        });
        return result;
    };

    var fallBackRequested: boolean = false;
    var getInputFromUrl = function (url: string, fallbackUrl: string, callBack: HandleInputCallback) {
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

    var setOutput = function (outputSelector: string, outputValue: any) {
        var output: HTMLInputElement = document.querySelector(outputSelector);
        output.value = outputValue;
    };

    var pocessInputA = function (input: string) {
        var lines = input.split('\r\n');
        return processLinesA(lines);
    };

    var pocessInputB = function (input: string) {
        var lines = input.split('\r\n');
        return processLinesB(lines);
    };

    var initializeA = function (options: Options) {
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

    var initialize = (options: Options) => {
        if (options.runPart === 1) {
            initializeA(options);
        } else if (options.runPart === 2) {
            initializeB(options);
        }
    };

    return {
        run: initialize
    };

    type HandleInputCallback = (n: string) => any;
    type Options = {
        runPart: number,
        inputUrl: string,
        inputUrlFallback: string,
        outputSelector: string
    };
};