var day3;
(function (day3) {
    // noprotect
    class Grouping {
        static groupBy(list, keyGetter) {
            var result = new Array();
            list.forEach((item) => {
                var key = keyGetter(item);
                var grouping = result.find(g => g.key === key);
                if (typeof grouping === "undefined") {
                    var newGrouping = new Grouping();
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
    class Table {
        constructor() {
            this.rows = new Array();
            this.columns = new Array();
        }
        createNew(rows) {
            var result = new Table();
            rows.forEach(r => result.addRow(r));
            return result;
        }
        addRow(bits) {
            this.rows.push(bits);
            bits.forEach((value, index, array) => {
                if (this.columns.length <= index) {
                    this.columns.push(new Array());
                }
                this.columns[index].push(value);
            }, this);
        }
        calcGamma() {
            var bit = this.columns.map(c => this.getMostCommon(c).toString()).join("");
            return parseInt(bit, 2);
        }
        calcEpsilon() {
            var bit = this.columns.map(c => this.getLeastCommon(c).toString()).join("");
            return parseInt(bit, 2);
        }
        getLeastCommon(arr, equalCountResult) {
            var grouped = Grouping.groupBy(arr, (i) => i);
            var sorted = grouped.sort((a, b) => a.values.length - b.values.length);
            var result = sorted[0].key;
            if (typeof equalCountResult !== "undefined" && sorted.length > 0 && sorted[0].values.length === sorted[1].values.length) {
                result = equalCountResult;
            }
            return result;
        }
        getMostCommon(arr, equalCountResult) {
            var grouped = Grouping.groupBy(arr, (i) => i);
            var sorted = grouped.sort((b, a) => a.values.length - b.values.length);
            var result = sorted[0].key;
            if (typeof equalCountResult !== "undefined" && sorted.length > 0 && sorted[0].values.length === sorted[1].values.length) {
                result = equalCountResult;
            }
            return result;
        }
        calcOxygen() {
            var result = 0;
            var tmpTable = this.createNew(this.rows);
            for (var position = 0; position < tmpTable.columns.length; position++) {
                var mostCommonAtPosition = tmpTable.getMostCommon(tmpTable.columns[position], 1);
                var currentRows = tmpTable.rows.filter(r => r[position] === mostCommonAtPosition);
                tmpTable = tmpTable.createNew(currentRows);
                if (tmpTable.rows.length === 1) {
                    var resultString = tmpTable.rows[0].join("");
                    result = parseInt(resultString, 2);
                    break;
                }
            }
            return result;
        }
        calcCO2Scrub() {
            var result = 0;
            var tmpTable = this.createNew(this.rows);
            for (var position = 0; position < tmpTable.columns.length; position++) {
                var leastCommonAtPosition = tmpTable.getLeastCommon(tmpTable.columns[position], 0);
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
    window.module = function () {
        var answerA = 0;
        var answerB = 0;
        var table = new Table();
        var processLine = function (line) {
            var result = 0;
            var bits = line.split('').map((i) => parseInt(i));
            table.addRow(bits);
            return result;
        };
        var processLineA = function (line) {
            var result = 0;
            var lineContents = line.trim();
            if (lineContents.length > 0) {
                processLine(lineContents);
            }
            return result;
        };
        var processLinesA = function (lines) {
            var result = 0;
            table = new Table();
            lines.forEach((line) => {
                result += processLineA(line);
            });
            answerA = table.calcEpsilon() * table.calcGamma();
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
            var result = 0;
            table = new Table();
            lines.forEach(function (line) {
                result += processLineB(line);
            });
            var oxy = table.calcOxygen();
            var co2 = table.calcCO2Scrub();
            answerB = oxy * co2;
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
})(day3 || (day3 = {}));
//# sourceMappingURL=script.js.map