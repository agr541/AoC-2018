// noprotect
class Crab {
    public x: number = 0;
    constructor(x:number) {
        this.x = x;
    }
}
(window as any).module = function () {
    var answerA: number = 0;
    var answerB: number = 0;
    var crabs: Crab[] = [];
    var processLine = function (line: string) {
        var result = 0;
        crabs.push(...line.split(',').map(n => parseInt(n)).map(i => new Crab(i)));
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
        var result = 0;
        crabs = [];
        lines.forEach((line: string) => {
            result += processLineA(line);
        });
        var maxX = crabs.map(c => c.x).reduce((a, b) => a > b ? a : b);

        var fuelCosts: number[] = [];
        for (var x = 0; x <= maxX; x++) {
            var fuelCost = crabs.map(c => Math.abs(x - c.x)).reduce((a, b) => a + b);
            fuelCosts.push(fuelCost);
        }

        var leastFuel = fuelCosts.reduce((a, b) => a < b ? a : b);
        answerA = leastFuel;
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
        var result = 0; 
        crabs = [];
       
        lines.forEach(function (line) {
            result += processLineB(line);
        });
        var maxX = crabs.map(c => c.x).reduce((a, b) => a > b ? a : b);

        var fuelCosts: number[] = [];
        for (var x = 0; x <= maxX; x++) {
            var fuelCost = crabs.map((c) => {
                var n = Math.abs(x - c.x);
                return (n * (n + 1)) / 2;
            }).reduce((a, b) => a + b);
            fuelCosts.push(fuelCost);
        }

        var leastFuel = fuelCosts.reduce((a, b) => a < b ? a : b);
        answerB = leastFuel;
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