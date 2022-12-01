class Octopus {
    public energyLevel: number;
    public flashCount: number;
    public flashed: boolean;

    constructor(energyLevel: number) {
        this.energyLevel = energyLevel;
        this.flashCount = 0;
        this.flashed = false;
    }

    public step = function () {
        var result = false;
        if (!this.flashed) {
            this.energyLevel++;
            if (this.energyLevel > 9) {
                this.flash();
                result = true;
            }
        }
        return result;
    }

    public flash = function () {
        this.flashCount++;
        this.energyLevel = 0;
        this.flashed = true;
    }

}
// noprotect
(window as any).module = function () {
    var answerA: number = 0;
    var answerB: number = 0;
    var octopi = new Array<Array<Octopus>>();
    var out: HTMLPreElement;
    var processLine = function (line: string) {
        var result = 0;
        octopi.push(line.split('').map(e => new Octopus(parseInt(e))));
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
        octopi = new Array<Array<Octopus>>();
        lines.forEach((line: string) => {
            result += processLineA(line);
        });

        out = addDebugOut();


        runStep(100);


        answerA = octopi.flat().map(o => o.flashCount).reduce((a, b) => a + b);

        return result;
    };

    var outputOctopi = function () {
        var result = '';

        octopi.forEach(octoRow => {
            octoRow.forEach(octo => {
                result += octo.energyLevel;
            });
            result += '\n';
        });

        return result;
    }

    var addDebugOut = function (): HTMLPreElement {
        var debugOut = document.createElement("pre");
        document.body.append(debugOut);
        return debugOut;
    };

    var runStep = function (count: number) {
        for (var i = 0; i < count; i++) {
            step(octopi.flat());
            octopi.flat().flat().forEach(octo => octo.flashed = false);
            out.innerHTML = outputOctopi();
        }
    }

    var runUntilAllLit = function () {
        var result = 0;
        var count = 1000;
        for (var i = 0; i < count; i++) {
            step(octopi.flat());
            
            if (octopi.flat().flat().every(octo => octo.flashed)) {
                result = i+1;
                break;
            }
            octopi.flat().flat().forEach(octo => octo.flashed = false);
            out.innerHTML = outputOctopi();
        }

        return result;
    }

    var step = function (steppingOctos: Array<Octopus>) {
        var flashedOctos = new Array<Octopus>();
        steppingOctos.forEach(octo => {
            if (octo.step()) {
                var closeOctoPi = getCloseOctopi(octo);
                step(closeOctoPi);
            }
        });
    }

    var getCloseOctopi = function (octo: Octopus) {
        var y = octopi.findIndex(or => or.indexOf(octo) > -1);
        var x = octopi[y].indexOf(octo);

        var nearbyOctopi = new Array<Array<number>>();
        nearbyOctopi.push([x - 1, y - 1]);
        nearbyOctopi.push([x, y - 1]);
        nearbyOctopi.push([x + 1, y - 1]);

        nearbyOctopi.push([x - 1, y]);
        nearbyOctopi.push([x + 1, y]);

        nearbyOctopi.push([x - 1, y + 1]);
        nearbyOctopi.push([x, y + 1]);
        nearbyOctopi.push([x + 1, y + 1]);

        return nearbyOctopi.filter(coords => coords[0] > -1 && coords[1] > -1 && coords[1] < octopi.length && coords[0] < octopi[0].length).map(coords => octopi[coords[1]][coords[0]]);
    }

    var processLinesB = function (lines: string[]) {
        var result = 0;
        octopi = new Array<Array<Octopus>>();

        lines.forEach(function (line) {
            result += processLineB(line);
        });
        out = addDebugOut();

        answerB = runUntilAllLit();

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