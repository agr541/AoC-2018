// noprotect
class Instruction {
}
;
class Position {
    constructor(horizontal, depth) {
        this.horizontal = horizontal;
        this.depth = depth;
    }
    Apply(i) {
        switch (i.direction) {
            case 'forward':
                this.horizontal += i.value;
                break;
            case 'up':
                this.depth -= i.value;
                break;
            case 'down':
                this.depth += i.value;
                break;
        }
    }
}
class AimedPosition {
    constructor(horizontal, depth) {
        this.horizontal = horizontal;
        this.depth = depth;
        this.aim = 0;
    }
    Apply(i) {
        switch (i.direction) {
            case 'forward':
                this.horizontal += i.value;
                this.depth += (i.value * this.aim);
                break;
            case 'up':
                this.aim -= i.value;
                break;
            case 'down':
                this.aim += i.value;
                break;
        }
    }
}
window.module = function () {
    var answerA = 0;
    var answerB = 0;
    var currentPosition;
    var currentAimedPosition;
    var processLine = function (line) {
        var result = 0;
        var instruction = parseInstruction(line);
        currentPosition?.Apply(instruction);
        currentAimedPosition?.Apply(instruction);
        return result;
    };
    function parseInstruction(line) {
        var splitted = line.split(' ');
        var result = new Instruction();
        result.direction = splitted[0];
        result.value = parseInt(splitted[1]);
        return result;
    }
    var processLineA = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            processLine(lineContents);
        }
        return result;
    };
    var processLinesA = function (lines) {
        currentPosition = new Position(0, 0);
        var result = 0;
        lines.forEach((line) => {
            result += processLineA(line);
        });
        result = currentPosition.depth * currentPosition.horizontal;
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
        currentAimedPosition = new AimedPosition(0, 0);
        var result = 0;
        lines.forEach(function (line) {
            result += processLineB(line);
        });
        result = currentAimedPosition.depth * currentAimedPosition.horizontal;
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