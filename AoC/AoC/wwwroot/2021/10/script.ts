// noprotect
(window as any).module = function () {
    var answerA: number = 0;
    var answerB: number = 0;
    /*
    If a chunk opens with (, it must close with ).
    If a chunk opens with [, it must close with ].
    If a chunk opens with {, it must close with }.
    If a chunk opens with <, it must close with >.
    */
    var syntaxErrorTokens = new Array<string>();
    var pairs = [['(', ')'], ['[', ']'], ['{', '}'], ['<', '>']];
    var processLine = function (line: string) {
        
        var tokens = line.split('');
        var openTokens = pairs.map(a => a[0]);
        var closeTokens = pairs.map(a => a[1]);
        var openedTokens = new Array<string>();

        for (var t of tokens) {
            if (openTokens.indexOf(t) > -1) {
                openedTokens.push(t);
            }
            if (closeTokens.indexOf(t) > -1) {
                var openedToken = openedTokens.pop();
                var tokenIndex = openTokens.findIndex(a=>a===openedToken);
                
                var expected = '';
                if (tokenIndex > -1) {
                    expected = closeTokens[tokenIndex];
                }
                
                if (t !== expected) {
                    syntaxErrorTokens.push(t);
                    openedTokens.length = 0;
                    break;
                }
            }
        }
        
        return openedTokens;
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
            var openedTokens = processLine(lineContents);
            var scores = openedTokens.map(t => getOpenTokenScore(t));
            scores.reverse().forEach(s => {
                result *= 5;
                result += s;
            });
        }
        return result;
    };
    var getOpenTokenScore = function (token: string) {
        var result: number = 0;
        /*
        ): 1 point.
        ]: 2 points.
        }: 3 points.
        >: 4 points.
        */

        switch (token) {
            case '(':
                result = 1;
                break;
            case '[':
                result = 2;
                break;
            case '{':
                result = 3;
                break;
            case '<':
                result = 4;
                break;
        }
        return result;
    }

    var getInvalidTokenScore = function (token: string) {
        var result:number = 0;
        switch (token) {
            case ')':
                result= 3;
                break;
            case ']':
                result =57;
                break;
            case '}':
                result =1197
                break;
            case '>':
                result =25137
                break;
        }
        return result;
    }

    var processLinesA = function (lines: string[]) {
        var result = 0;
        syntaxErrorTokens = new Array<string>();
        lines.forEach((line: string) => {
            result += processLineA(line);
        });

        answerA = syntaxErrorTokens.map(t => getInvalidTokenScore(t)).reduce((a, b) => a + b);
        return result;
    };

    var processLinesB = function (lines: string[]) {
        answerB = 0;
        var result = 0;
        var lineResults = new Array<number>();
        lines.forEach(function (line) {
            var lineResult = processLineB(line);
            if (lineResult > 0) {
                lineResults.push(lineResult);
            }
        });

        var sorted = lineResults.sort((a, b) => a - b);
        var middleIndex = Math.floor(sorted.length / 2);
        answerB = sorted[middleIndex];

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