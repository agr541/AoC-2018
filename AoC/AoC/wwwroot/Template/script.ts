// noprotect
(window as any).module = function () {
    type HandleInputCallback = (n: string) => any;

    type Options = {
        runPart: number,
        inputUrl: string,
        fallbacInputkUrl: string,
        outputSelector: string
    };

    var answerA: number = 0;
    var answerB: number = 0;

    var processLine = function (line: string) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {

        }
        return result;
    };

    var processLinesA = function (lines: string[]) {
        var result = 0;
        lines.forEach(function (line) {
            processLine(line);
        });
        return result;
    };

    var processLinesB = function (lines: string[]) {
        var result = 0;
        lines.forEach(function (line) {
            processLine(line);
        });
        return result;
    };

    var getInputFromUrl = function (url: string, fallbackUrl: string, callBack: HandleInputCallback) {
        var req = new XMLHttpRequest();
        req.addEventListener('readystatechange', function () {
            var xhr = this;
            if (xhr.readyState === 4 && xhr.status === 200) {
                callBack(req.responseText);
                if (req.responseText.length === 0) {
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
        var input = getInputFromUrl(options.inputUrl, options.fallbacInputkUrl, function (input) {
            var output = pocessInputA(input);
            if (answerA !== 0) {

            }
            setOutput(options.outputSelector, output);
        });
    };

    var initializeB = function (options) {
        var input = getInputFromUrl(options.inputUrl, options.fallbacInputkUrl, function (input) {
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
};


