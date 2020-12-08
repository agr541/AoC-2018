// noprotect
(window as any).module = function () {
    var answerA: number = 0;
    var answerB: number = 0;
    var myBagName: string = 'shiny gold';
    var bagRules: BagRule[] = [];

    type BagAmount = {
        bagName: string,
        amount: number
    };
    type BagRule = {
        bagName: string,
        contains: BagAmount[]
    };

    var processLine = function (line: string) {
        var result = 0;
        var lineContents = line.trim().toLowerCase();
        if (lineContents.length > 0) {
            var spaceSplitted = lineContents.split(' ');
            //light red bags contain 1 bright white bag, 2 muted yellow bags.
            var bagName: string = spaceSplitted[0] + ' ' + spaceSplitted[1];

            var bagRule = {
                bagName: bagName,
                contains: []
            }

            for (var i: number = 4; i < spaceSplitted.length; i += 4) {
                var amount = parseInt(spaceSplitted[i]);
                if (amount > 0) {
                    var amountBagName = spaceSplitted[i + 1] + ' ' + spaceSplitted[i + 2];

                    var bagAmount: BagAmount = {
                        amount: amount,
                        bagName: amountBagName,
                    };
                    bagRule.contains.push(bagAmount);
                }
            }

            bagRules.push(bagRule);
        }
       
        return result;
    };

    var countBagColorsFor = function (bagName: string) {
        var containingBags: string[] = [];
        var currentBagNames: string[] = [bagName];
        while (currentBagNames.length > 0) {
            var copy = Array.from(currentBagNames);
            currentBagNames = [];
            for (var currentBagName of copy) {
                var currentBagRules = bagRules.filter(bagRule => bagRule.contains.some(c => c.bagName === currentBagName));
                currentBagNames.push(...Array
                    .from(currentBagRules
                        .map(cbr => cbr.bagName)
                        .filter(cbn => !copy.includes(cbn))));

                for (var foundBagRule of currentBagNames) {
                    containingBags.push(foundBagRule);
                }
            }
        }

        var uniqueContainingBags = Array.from(new Set(containingBags));
        return uniqueContainingBags.length;
    };

    var processLinesA = function (lines: string[]) {
        var result = 0;
        lines.forEach((line: string) => {
            processLine(line);
        });
        answerA = countBagColorsFor(myBagName);

        return result;
    };

    var processLinesB = function (lines: string[]) {
        var result = 0;
        lines.forEach(function (line) {
            processLine(line);
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