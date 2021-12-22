// noprotect
class Instruction {
    public direction: string;
    public value: number;
};


class Position {
    public horizontal: number;
    public depth: number;
    public constructor(horizontal: number, depth: number) {
        this.horizontal = horizontal;
        this.depth = depth;
    }

    public Apply(i: Instruction) {
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
    public horizontal: number;
    public depth: number;
    public aim: number;
    public constructor(horizontal: number, depth: number) {
        this.horizontal = horizontal;
        this.depth = depth;
        this.aim = 0;
    }

    public Apply(i: Instruction) {
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

(window as any).module = function () {
    var answerA: number = 0;
    var answerB: number = 0;
    var currentPosition: Position;
    var currentAimedPosition: AimedPosition;
    var processLine = function (line: string) {
        var result = 0;
        var instruction: Instruction = parseInstruction(line);
        currentPosition?.Apply(instruction);
        currentAimedPosition?.Apply(instruction);
        return result;
    };

    function parseInstruction(line: string): Instruction {
        var splitted = line.split(' ');
        
        var result: Instruction = new Instruction();
        result.direction = splitted[0];
        result.value = parseInt(splitted[1]);
        return result;
    }


    var processLineA = function (line: string) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            processLine(lineContents);
        }
        return result;
    };

    var processLinesA = function (lines: string[]) {
        currentPosition = new Position(0, 0);
        var result = 0;
        lines.forEach((line: string) => {
            result+=processLineA(line);
        });

        result = currentPosition.depth * currentPosition.horizontal
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


    var processLinesB = function (lines: string[]) {
        currentAimedPosition = new AimedPosition(0, 0);
        var result = 0;
        lines.forEach(function (line) {
            result +=processLineB(line);
        });
        result = currentAimedPosition.depth * currentAimedPosition.horizontal
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
        var output: HTMLInputElement|null = document.querySelector(outputSelector);
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

