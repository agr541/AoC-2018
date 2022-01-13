// noprotect
(window as any).module = function () {

    var answerA: number = 0;
    var answerB: number = 0;

    var processLine = function (line: string) {
        var result = 0;

        return result;
    };

    var processLineA = function (line: string) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            processLine(lineContents);
        }
        return result;
    };

    var processLineB = function (line: string) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            result += processLine(lineContents);
        }
        return result;
    };

    var processLinesA = function (lines: string[]) {
        var result = 0;
        lines.forEach((line: string) => {
            result += processLineA(line);
        });

        debugOutput.innerHTML = 'test';
        return result;
    };

    var processLinesB = function (lines: string[]) {
        var result = 0;
        lines.forEach(function (line) {
            result += processLineB(line);
        });
        return result;
    };

    var fallBackRequested: boolean = false;
    var getInputFromUrl = function (url: string, fallbackUrl: string, callBack: HandleInputCallback) {
        var req = new XMLHttpRequest();
        req.addEventListener('readystatechange', async function () {
            var xhr = this;
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (req.responseText.length !== 0) {
                    callBack(req.responseText);
                } else if (fallBackRequested === true || fallbackUrl === null) {
                    await requestAocInput();
                } else {
                    fallBackRequested = true;
                    req.open('GET', fallbackUrl);
                    req.send();
                }
            }

            async function requestAocInput() {
                var aocInputUrl = await getAocInputUrl();
                req.open('GET', aocInputUrl);
                req.send();
            }

            async function getAocInputUrl() {
                var result = '/get-input';
                var cookie = await eval('window.cookieStore.get(\'session\');');
                var storedSession = null;
                if (cookie !== null) {
                    storedSession = cookie.value;
                }
                if (storedSession === null) {
                    var newSession = prompt('Enter session cookie from aoc value');
                    if (newSession !== null) {
                        storedSession = newSession;
                        result += '?session=' + newSession;
                    }
                }
                return result;
            }
        });
        req.open('GET', url);
        req.send();
    };

    var debugOutput: HTMLPreElement;
    var addDebugOutput = function () {
        if (typeof debugOutput === 'undefined') {
            debugOutput = document.createElement("pre");
            document.body.append(debugOutput);
        }
    };

    var setOutput = function (outputSelector: string, outputValue: any) {
        var output: HTMLInputElement | null = document.querySelector(outputSelector);
        if (output !== null) {
            output.value = outputValue;
        }
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

    var initializeB = function (options: Options) {
        var input = getInputFromUrl(options.inputUrl, options.inputUrlFallback, function (input) {
            var output = pocessInputB(input);
            if (answerB !== 0) {
                output = answerB;
            }
            setOutput(options.outputSelector, output);
        });
    };

    var initialize = (options: Options) => {
        addDebugOutput();
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