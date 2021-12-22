// noprotect

class Grouping {
    public key: number;
    public values: number[];
    public constructor(value: number) {
        this.key = value;
        this.values = new Array<number>();
        this.values.push(value);
    }
}


class Table {
    public rows: Array<Array<number>>;
    public columns: Array<Array<number>>;
    
    public constructor() {
        this.rows = new Array<Array<number>>();
        this.columns = new Array<Array<number>>();
    }

    public createNew(rows:Array<Array<number>>):Table {
        var result: Table = new Table();
        rows.forEach(r => result.addRow(r));
        return result;
    }

    public addRow(bits: number[]) {
        this.rows.push(bits);
        
        bits.forEach((value, index, array) => {
            if (this.columns.length <= index) {
                this.columns.push(new Array<number>());
            }
            this.columns[index].push(value);
        }, this);
    }

    public calcGamma(): number {
        var bit = this.columns.map(c => this.getMostCommon(c).toString()).join("");
        return parseInt(bit, 2);
    }

    public calcEpsilon(): number {
        var bit = this.columns.map(c => this.getLeastCommon(c).toString()).join("");
        return parseInt(bit, 2);
    }
    private getLeastCommon(arr: number[], equalCountResult?: number ): number {
        var grouped = this.GroupBy(arr);
        var sorted = grouped.sort((a, b) => a.values.length - b.values.length);
        var result = sorted[0].value;
        if (sorted[0].values.length === sorted[1].values.length && typeof equalCountResult !== "undefined") {
            result = equalCountResult;
        }
        return result;
    }
    private GroupBy(arr: number[]) {
        return arr.reduce((acc, currentValue) => {
            let groupKey = currentValue;
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(currentValue);
            return acc;
        }, {});
    };
    private getMostCommon(arr: number[], equalCountResult?: number): number {
        var grouped = this.GroupBy(arr);

        var sorted = grouped.sort((a, b) => b.values.length - a.values.length);
        var result = sorted[0].value;
        if (sorted[0].values.length === sorted[1].values.length && typeof equalCountResult !== "undefined") {
            result = equalCountResult;
        }
        return result;
    }

    public calcOxygen():number {
        var result: number = 0;
        var tmpTable = this.createNew(this.rows);
        
        
        for (var position: number = 0; position < tmpTable.columns.length; position++) {
            var mostCommonAtPosition = tmpTable.getMostCommon(tmpTable.columns[position],1);
            var currentRows = tmpTable.rows.filter(r => r[position] === mostCommonAtPosition);
            tmpTable = tmpTable.createNew(currentRows);
            if (tmpTable.rows.length === 1)
            {
                var resultString = tmpTable.rows[0].join("");
                result = parseInt(resultString, 2);
                break;
            }
        }

        return result;
    }

    public calcCO2Scrub(): number {
        var result: number = 0;
        var tmpTable = this.createNew(this.rows);


        for (var position: number = 0; position < tmpTable.columns.length; position++) {
            var leastCommonAtPosition = tmpTable.getLeastCommon(tmpTable.columns[position],0);
            var currentRows = tmpTable.rows.filter(r => r[position] === leastCommonAtPosition);
            tmpTable = tmpTable.createNew(currentRows);
            if (tmpTable.rows.length === 1) {
                var resultString = tmpTable.rows[0].join("");
                result = parseInt(resultString, 2);
                break;
            }
        }

        return result;
    }

}



(window as any).module = function () {
    var answerA: number = 0;
    var answerB: number = 0;
    var table = new Table();
    var processLine = function (line: string) {
        var result = 0;
        var bits = line.split('').map((i)=>parseInt(i));
        table.addRow(bits);
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
        table = new Table();
        lines.forEach((line: string) => {
            result += processLineA(line);
        });
        answerA = table.calcEpsilon() * table.calcGamma();
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
        table = new Table();
        lines.forEach(function (line) {
            result += processLineB(line);
        });
        answerB = table.calcOxygen() * table.calcCO2Scrub();
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
