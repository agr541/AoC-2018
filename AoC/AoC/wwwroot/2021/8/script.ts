// noprotect
(window as any).module = function () {
    var answerA: number = 0;
    var answerB: number = 0;
    var digitCounts:number[] = [10];
    
    var processLine = function (line: string) {

        var result = 0;
        var splitted = line.split(' | ');
        var digits = splitted[1].split(' ');
        digits.forEach((digit) => {
            switch (digit.length) {
                case 2:
                    digitCounts[1]++;
                    break;
                case 4:
                    digitCounts[4]++;
                    break;
                case 3:
                    digitCounts[7]++;
                    break;
                case 7:
                    digitCounts[8]++;
                    break;
            }
        });

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

    var processLinesA = function (lines: string[]) {
        digitCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var result = 0;
        lines.forEach((line: string) => {
            result += processLineA(line);
        });
        return result;
    };

    var processLineB = function (line: string) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            var digitPatterns = ['', '', '', '', '', '', '', '', '', ''];
            var result = 0;
            var splitted = line.split(' | ');
            var digits = splitted[0].split(' ');
            digits.forEach((digit) => {
                switch (digit.length) {
                    case 2:
                        digitPatterns[1] = digit;
                        digitCounts[1]++;
                        break;
                    case 4:
                        digitPatterns[4] = digit;
                        digitCounts[4]++;
                        break;
                    case 3:
                        digitPatterns[7] = digit;
                        digitCounts[7]++;
                        break;
                    case 7:
                        digitPatterns[8] = digit;
                        digitCounts[8]++;
                        break;
                }
            });
            var remainingDigitPatterns = digits.filter(f => f != digitPatterns[1] && f != digitPatterns[4] && f != digitPatterns[7] && f != digitPatterns[8]);
            /*
             *   0:      1:      2:      3:      4:
                 aaaa    ....    aaaa    aaaa    ....
                b    c  .    c  .    c  .    c  b    c
                b    c  .    c  .    c  .    c  b    c
                 ....    ....    dddd    dddd    dddd
                e    f  .    f  e    .  .    f  .    f
                e    f  .    f  e    .  .    f  .    f
                 gggg    ....    gggg    gggg    ....
                
                  5:      6:      7:      8:      9:
                 aaaa    aaaa    aaaa    aaaa    aaaa
                b    .  b    .  .    c  b    c  b    c
                b    .  b    .  .    c  b    c  b    c
                 dddd    dddd    ....    dddd    dddd
                .    f  e    f  .    f  e    f  .    f         
                .    f  e    f  .    f  e    f  .    f
                 gggg    gggg    ....    gggg    gggg
             */
          
            var digit3Canditates = remainingDigitPatterns.filter(p => p.length === 5);
            digitPatterns[3] = findOverlapsWith(digit3Canditates, digitPatterns[7]);
            remainingDigitPatterns = remainingDigitPatterns.filter(p => p != digitPatterns[3]);

            var digit9Canditates = remainingDigitPatterns.filter(p => p.length === 6);
            digitPatterns[9] = findOverlapsWith(digit9Canditates, digitPatterns[3]);
            remainingDigitPatterns = remainingDigitPatterns.filter(p => p != digitPatterns[9]);

            var digit0Canditates = remainingDigitPatterns.filter(p => p.length === 6);
            digitPatterns[0] = findOverlapsWith(digit0Canditates, digitPatterns[7]);
            remainingDigitPatterns = remainingDigitPatterns.filter(p => p != digitPatterns[0]);

            var digit6Canditates = remainingDigitPatterns.filter(p => p.length === 6);
            digitPatterns[6] = digit6Canditates[0];
            remainingDigitPatterns = remainingDigitPatterns.filter(p => p != digitPatterns[6]);

            var digit5Canditates = remainingDigitPatterns.filter(p => p.length === 5);

            
            var matchFound = findOverlapsWith([digitPatterns[6]], digit5Canditates[0]);
            if (matchFound === '') {
                digitPatterns[5] = digit5Canditates[1];
                digitPatterns[2] = digit5Canditates[0];
            } else {
                digitPatterns[5] = digit5Canditates[0];
                digitPatterns[2] = digit5Canditates[1];
            }
            digitPatterns.forEach((v: string, i:number) => {
                digitPatterns[i] = v.split('').sort().join('');
            });

            var outputPatterns = splitted[1].split(' ');
            var outputNumberString = '';
            outputPatterns.forEach(outputPattern => {
                var opSorted = outputPattern.split('').sort().join('');
                outputNumberString += digitPatterns.indexOf(opSorted);
            })
            result = parseInt(outputNumberString);
        }
        return result;
    };

    var findOverlapsWith = function (candidates: string[], pattern: string) {
        var result = candidates.filter((candidate) => pattern.split('').every(ch => candidate.indexOf(ch) > -1));
        if (result.length === 0) {
            return '';
        }
        return result[0];
    }

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