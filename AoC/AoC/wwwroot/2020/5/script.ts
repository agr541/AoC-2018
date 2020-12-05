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

    var rows = { min: 0.0, max: 127.0 };
    var columns = { min: 0.0, max: 7.0 };
    var seatIds = [];
    
    var processLine = function (line: string) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            var currentRows = Object.assign({}, rows);
            var currentColumns = Object.assign({}, columns);

            for (var char of lineContents) {
                switch (char) {
                    case 'F':
                        currentRows.max -= Math.ceil((currentRows.max - currentRows.min) / 2);
                        break;
                    case 'B':
                        currentRows.min += Math.ceil((currentRows.max - currentRows.min) / 2);
                        break;
                    case 'L':
                        currentColumns.max -= Math.ceil((currentColumns.max - currentColumns.min) / 2);
                        break;
                    case 'R':
                        currentColumns.min += Math.ceil((currentColumns.max - currentColumns.min) / 2);
                        break;
                    
                }
            }
            result = currentRows.max * (columns.max + 1) + currentColumns.max
        }

        if (answerA < result) {
            answerA = result;
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
        seatIds = [];
        lines.forEach(function (line) {
            var seatId = processLine(line);
            seatIds.push(seatId);
        });
    
        seatIds.sort((a, b) => a - b);
        
        for (var i = 0; i < seatIds.length; i++) {
            if ((seatIds[i] - seatIds[i + 1])!==-1) {
                answerB = (seatIds[i] + 1);
                break;
            }
        }


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
                output = answerA;
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


