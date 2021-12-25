// noprotect
namespace day6 {
    class Grouping<K, V> {
        public key: K;
        public values: V[];

        static groupBy<K, V>(list: V[], keyGetter: (input: V) => K): Grouping<K, V>[] {
            var result = new Array<Grouping<K, V>>();
            list.forEach((item) => {
                var key = keyGetter(item);
                var grouping = result.find(g => g.key === key);
                if (typeof grouping === "undefined") {
                    var newGrouping = new Grouping<K, V>();
                    newGrouping.key = key;
                    newGrouping.values = [];
                    newGrouping.values.push(item);
                    result.push(newGrouping);
                }
                else {
                    grouping.values.push(item);
                }
            });
            return result;
        }
    }

    class LanternFishPopulation {
        public populationCount: number;

        constructor() {
            this.populationCount = 0;
        }
    }

    (window as any).module = function () {
        var answerA: number = 0;
        var answerB: number = 0;
        var fishPopulation: LanternFishPopulation[];

        var processLine = function (line: string) {
            var result = 0;
            fishPopulation = [];
            fishPopulation.length = 9;

            var input = [...line.split(',').map(a => parseInt(a))];
                        
            Grouping.groupBy(input, (fp) => fp)
                .map(fp => {
                    var lfp = new LanternFishPopulation();
                    lfp.populationCount = fp.values.length;
                    fishPopulation[fp.key] = lfp;
                    return lfp;
                });

            for (var i = 0; i < fishPopulation.length; i++) {
                if (typeof fishPopulation[i] === "undefined") {
                    fishPopulation[i] = new LanternFishPopulation();
                }
            }

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

        var ageFishPopulation = function (days: number) {

            for (var i = 1; i < (days + 1); i++) {
                var populationZero = fishPopulation.shift();
                if (typeof populationZero !== "undefined") {
                    fishPopulation.push(populationZero);
                    fishPopulation[6].populationCount += populationZero.populationCount;
                }
            }
        };


        var processLinesA = function (lines: string[]) {
            var result = 0;
            lines.forEach((line: string) => {
                result += processLineA(line);
            });

            ageFishPopulation(18);
            answerA = fishPopulation.map(fp => fp.populationCount).reduce((a, b) => a + b);
            ageFishPopulation(80 - 18);
            answerA = fishPopulation.map(fp => fp.populationCount).reduce((a, b) => a + b);
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
            fishPopulation = [];
            lines.forEach(function (line) {
                result += processLineB(line);
            });
            ageFishPopulation(256);
            
            answerB = fishPopulation.map(fp => fp.populationCount).reduce((a, b) => a + b);
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
}