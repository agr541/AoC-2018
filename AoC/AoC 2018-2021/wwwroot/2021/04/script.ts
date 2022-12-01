// noprotect
namespace day4 {
    class BingoCard {
        public numberLines: number[][] = [];
        public winLines: number[][] = [];
        public drawnNumbers: number[] = [];
        public hasBingo: boolean = false;
        public unDrawnNumbers: number[];
        public lastDrawnNumber: number;
        public bingoNumber: number = -1;

        public addNumbers(numbers: number[]) {
            this.numberLines.push(numbers);
            if (this.numberLines.length === numbers.length) {
                this.calculateLines();
            }
        }

        public drawNumber(drawing: number[]) {
            var tmpWinLines = Array.from(this.winLines);
            drawing.forEach((drawnNumber) => {
                this.drawnNumbers.push(drawnNumber);
                this.lastDrawnNumber = drawnNumber;
                var unDrawnIndex = this.unDrawnNumbers.indexOf(drawnNumber);
                if (unDrawnIndex > -1) {
                    this.unDrawnNumbers.splice(unDrawnIndex, 1);
                }
                tmpWinLines.forEach((wl) => {
                    var winLineIndex = wl.indexOf(drawnNumber);
                    if (winLineIndex > -1) {
                        wl.splice(winLineIndex, 1);
                        if (wl.length === 0 && this.bingoNumber === -1) {
                            this.bingoNumber = drawnNumber;
                        }
                    }
                });
                this.hasBingo = tmpWinLines.some(v => v.length === 0);
            });
        }


        private calculateLines() {
            this.unDrawnNumbers = this.numberLines.flat();
            //horizontal
            this.winLines.push(...this.numberLines);

            //vertical
            for (var i: number = 0; i < this.numberLines.length; i++) {
                this.winLines.push(this.numberLines.map(nl => nl[i]));
            }

            //diagonals
            //var diagonalLines: number[][] = [[],[]];
            //for (var i: number = 0; i < this.numberLines.length; i++) {
            //    diagonalLines[0].push(this.numberLines[i][i]);
            //    diagonalLines[1].push(this.numberLines[this.numberLines.length - i - 1][this.numberLines.length - i - 1]);
            //}
            //this.winLines.push(...diagonalLines);
        }


    }

    (window as any).module = function () {
        var answerA: number = 0;
        var answerB: number = 0;
        var bingoDraw: number[] = [];
        var currentBingoCard: BingoCard;
        var bingoCards: BingoCard[] = [];
        var bingoCardsWithBingo: BingoCard[] = [];
        var processLine = function (line: string) {
            var result = 0;

            if (bingoDraw.length === 0) {
                var numbers = line.split(',').map((n) => parseInt(n));
                bingoDraw.push(...numbers);
            } else if (line.length == 0) {
                currentBingoCard = new BingoCard();
                bingoCards.push(currentBingoCard);
            } else {
                var numbers = line.replaceAll('  ', ' ').split(' ').map((n) => parseInt(n));
                currentBingoCard.addNumbers(numbers);
            }

            return result;
        };

        var processLineA = function (line: string) {
            var result = 0;
            var lineContents = line.trim();
            processLine(lineContents);

            return result;
        };

        var processLinesA = function (lines: string[]) {
            var result = 0;

            lines.forEach((line: string) => {
                result += processLineA(line);
            });

            bingoDraw.forEach((drawNumber) => {
                bingoCards.forEach(bc => {
                    bc.drawNumber([drawNumber]);

                    if (bc.hasBingo) {
                        if (answerA === 0) {
                            answerA = multiplyUndrawnWithWinningNumber(bc);
                        }
                    }
                });
            })


            return result;
        };

        var multiplyUndrawnWithWinningNumber = function (bc: BingoCard): number {
            var result = 0;
            if (bc.unDrawnNumbers.length > 0) {
                var sumOfUndrawnNumber = bc.unDrawnNumbers.reduce((a, b) => a + b);
                if (bc.unDrawnNumbers.length > 0) {
                    result = sumOfUndrawnNumber * bc.bingoNumber
                }
            }
            return result;
        }

        var processLineB = function (line: string) {
            var result = 0;
            var lineContents = line.trim();
            result += processLine(lineContents);
            return result;
        };


        var processLinesB = function (lines: string[]) {
            var result = 0;
            lines.forEach(function (line) {
                result += processLineB(line);
            });



            bingoDraw.forEach((drawNumber) => {
                bingoCards.forEach(bc => {
                    if (bingoCardsWithBingo.indexOf(bc) === -1) {
                        bc.drawNumber([drawNumber]);
                        if (bc.hasBingo) {
                            bingoCardsWithBingo.push(bc);
                        }
                    }
                });
            })

            answerB = multiplyUndrawnWithWinningNumber(bingoCardsWithBingo.reverse()[0]);
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