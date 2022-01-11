// noprotect
window.module = function () {
    var answerA = 0;
    var answerB = 0;
    var grid = new Array();
    var processLine = function (line) {
        var result = 0;
        var data = line.split('').map(x => parseInt(x));
        var row = new Array();
        var rowData = data.map((x) => {
            var o = new Array();
            o.push(x);
            return o;
        });
        row.push(...rowData);
        grid.push(row);
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
    var addHeightMap = function () {
        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
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
        var result = new Array();
        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                var heights = cell.filter((v, i) => {
                    return i > 0;
                });
                if (heights.every(h => h < 0)) {
                    var arr = new Array();
                    arr.push(x);
                    arr.push(y);
                    result.push(arr);
                }
            });
        });
        return result;
    };
    var findLowPoints = function () {
        var result = new Array();
        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                var heights = cell.filter((v, i) => {
                    return i > 0;
                });
                if (heights.every(h => h < 0)) {
                    result.push(cell[0]);
                }
            });
        });
        return result;
    };
    var gatherAdjacentsExcept9 = function (x, y, arr) {
        var result = new Array();
        if (grid[y][x][0] === 9) {
            return result;
        }
        if (x > 0) {
            var left = [x - 1, y];
            var leftX = left[0];
            var leftY = left[1];
            if (grid[leftY][leftX][0] !== 9) {
                if (arr.findIndex(a => a[0] === leftX && a[1] === leftY) === -1) {
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
                if (arr.findIndex(a => a[0] === rightX && a[1] === rightY) === -1) {
                    arr.push(right);
                    gatherAdjacentsExcept9(rightX, rightY, arr);
                }
            }
        }
        if (y > 0) {
            var up = [x, y - 1];
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
    };
    var findBasins = function (lowPointLocations) {
        var result = new Array();
        lowPointLocations.forEach(v => {
            var x = v[0];
            var y = v[1];
            var newArray = new Array();
            newArray.push(v);
            result.push(gatherAdjacentsExcept9(x, y, newArray));
        });
        return result;
    };
    var processLinesA = function (lines) {
        var result = 0;
        lines.forEach((line) => {
            result += processLineA(line);
        });
        addHeightMap();
        var lowPoints = findLowPoints();
        result = lowPoints.reduce((a, b) => { return a + b; });
        return result + lowPoints.length;
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