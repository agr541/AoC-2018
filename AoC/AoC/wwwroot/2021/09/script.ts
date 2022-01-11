// noprotect
(window as any).module = function () {
    var answerA: number = 0;
    var answerB: number = 0;
    var grid = new Array<Array<Array<number>>>();

    var processLine = function (line: string) {
        var result = 0;
        var data = line.split('').map(x => parseInt(x));
        var row = new Array<Array<number>>();
        var rowData = data.map((x) => {
            var o = new Array<number>();
            o.push(x);
            return o;
        });
        row.push(...rowData);
        grid.push(row);
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

    var addHeightMap = function () {
        grid.forEach((row: Array<Array<number>>, y: number) => {
            row.forEach((cell: Array<number>, x: number) => {
                if (x > 0) {
                    var left = cell[0] - grid[y][x - 1][0];
                    cell.push(left);
                }
                if (x < row.length - 1) {
                    var right = cell[0] - grid[y][x + 1][0];
                    cell.push(right);
                }
                if (y > 0) {
                    var up = cell[0] - grid[y - 1][x][0];
                    cell.push(up);
                }
                if (y < grid.length - 1) {
                    var down = cell[0] - grid[y + 1][x][0];
                    cell.push(down);
                }

            });
        });
    };

    var findLowPointLocations = function () {
        var result = new Array<Array<number>>();
        grid.forEach((row: Array<Array<number>>, y: number) => {

            row.forEach((cell: Array<number>, x: number) => {
                var heights = cell.filter((v, i) => {
                    return i > 0
                });
                if (heights.every(h => h < 0)) {
                    var arr = new Array<number>();
                    arr.push(x);
                    arr.push(y);
                    result.push(arr);
                }
            });
        });
        return result;
    }

    var findLowPoints = function () {
        var result = new Array<number>();
        grid.forEach((row: Array<Array<number>>, y: number) => {
            row.forEach((cell: Array<number>, x: number) => {
                var heights = cell.filter((v, i) => {
                    return i > 0
                });
                if (heights.every(h => h < 0)) {
                    result.push(cell[0]);
                }
            });
        });
        return result;
    }
    
    var gatherAdjacentsExcept9 = function (x: number, y: number, arr: Array<Array<number>>) {
        var result = new Array<Array<number>>();
        if (grid[y][x][0] === 9) {
            return result;
        }
        
        if (x > 0) {
            var left = [x - 1, y];
            var leftX = left[0];
            var leftY = left[1];
            if (grid[leftY][leftX][0] !== 9) {
                if (arr.findIndex(a=>a[0]===leftX && a[1] ===leftY) === -1) {
                    arr.push(left);
                    gatherAdjacentsExcept9(leftX, leftY, arr);
                }
            }
        }
        if (x < grid[y].length - 1) {
            var right = [x + 1, y];
            var rightX = right[0];
            var rightY = right[1];
            if (grid[rightY][rightX][0] !== 9) {
                if (arr.findIndex(a=>a[0]===rightX && a[1] === rightY) === -1) {
                    arr.push(right);
                    gatherAdjacentsExcept9(rightX, rightY, arr);
                }
            }
        }

        if (y > 0) {
            var up = [x, y-1];
            var upX = up[0];
            var upY = up[1];
            if (grid[upY][upX][0] !== 9) {
                if (arr.findIndex(a => a[0] === upX && a[1] === upY) === -1) {
                    arr.push(up);
                    gatherAdjacentsExcept9(upX, upY, arr);
                }
            }
        }

        if (y < grid.length - 1) {
            var down = [x, y + 1];
            var downX = down[0];
            var downY = down[1];
            if (grid[downY][downX][0] !== 9) {
                if (arr.findIndex(a => a[0] === downX && a[1] === downY) === -1) {
                    arr.push(down);
                    gatherAdjacentsExcept9(downX, downY, arr);
                }
            }
        }

        return arr;
    }

    var findBasins = function (lowPointLocations: Array<Array<number>>) {
        var result = new Array<Array<Array<number>>>();
        lowPointLocations.forEach(v => {
            var x = v[0];
            var y = v[1];
            var newArray = new Array<Array<number>>();
            newArray.push(v);
            result.push(gatherAdjacentsExcept9(x, y, newArray));
        });
        return result;
    }

    var processLinesA = function (lines: string[]) {
        var result = 0;
        lines.forEach((line: string) => {
            result += processLineA(line);
        });
        addHeightMap();
        var lowPoints = findLowPoints();
        result = lowPoints.reduce((a, b) => { return a + b });
        return result + lowPoints.length;
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
        lines.forEach(function (line) {
            result += processLineB(line);
        });
        addHeightMap();
        var lowPointLocations = findLowPointLocations();

        var basins = findBasins(lowPointLocations);
        var sortedBySize = basins.sort((a, b) => b.length - a.length);
        
        answerB = sortedBySize[0].length * sortedBySize[1].length * sortedBySize[2].length;
        
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