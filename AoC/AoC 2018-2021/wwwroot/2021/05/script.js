// noprotect
var day5;
(function (day5) {
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
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        static fromString(coords) {
            var coordsParts = coords.split(',');
            var x = parseInt(coordsParts[0]);
            var y = parseInt(coordsParts[1]);
            return new Point(x, y);
        }
        ;
    }
    class Grid {
        constructor() {
            this.points = [];
            this.lines = [];
            this.allowDiagonals = false;
        }
        addLineFromString(lineParts) {
            var firstPoint = Point.fromString(lineParts[0]);
            var secondPoint = Point.fromString(lineParts[1]);
            this.addLine(firstPoint, secondPoint);
        }
        addLine(pointA, pointB) {
            var line = [pointA, pointB];
            var pointsByX = line.sort((a, b) => a.x - b.x);
            var pointsByY = line.sort((a, b) => a.y - b.y);
            if (pointsByX[0].x === pointsByX[1].x) {
                this.addVerticalLine(pointsByX[0], pointsByY[1].y - pointsByY[0].y);
                this.lines.push(line);
            }
            else if (pointsByY[0].y === pointsByY[1].y) {
                this.addHorizontalLine(pointsByY[0], pointsByX[1].x - pointsByX[0].x);
                this.lines.push(line);
            }
            else if (this.allowDiagonals) {
                this.addDiagonalLine(line[0], line[1]);
                this.lines.push(line);
            }
        }
        addHorizontalLine(start, length) {
            for (var i = 0; i <= length; i++) {
                this.points.push(new Point(start.x + i, start.y));
            }
        }
        addVerticalLine(start, length) {
            for (var i = 0; i <= length; i++) {
                this.points.push(new Point(start.x, start.y + i));
            }
        }
        addDiagonalLine(start, end) {
            var point = start;
            var dX = start.x > end.x ? -1 : 1;
            var dY = start.y > end.y ? -1 : 1;
            this.points.push(new Point(start.x, start.y));
            while (point.x != end.x && point.y != end.y) {
                point.x += dX;
                point.y += dY;
                this.points.push(new Point(point.x, point.y));
            }
        }
        async drawGrid() {
            var result = "";
            var largestX = this.points.reduce((p, c) => p.x > c.x ? p : c).x;
            var largestY = this.points.reduce((p, c) => p.y > c.y ? p : c).y;
            var width = largestX + 1;
            var height = largestY + 1;
            var arr = [];
            arr.length = width * height;
            arr.fill(0);
            this.points.forEach(p => {
                var pos = p.x + (p.y * height);
                arr[pos]++;
            });
            arr.forEach((p, i) => {
                if (i > 0 && i % width == 0) {
                    result += "\r\n";
                }
                result += p === 0 ? "." : p.toString();
            });
            return result;
        }
        getOverlapCount() {
            var overlaps = Grouping.groupBy(this.points, (value) => "" + value.x + "," + value.y);
            var overlapsWith2OrMore = overlaps.filter(f => f.values.length > 1);
            return overlapsWith2OrMore.length;
        }
    }
    // noprotect
    window.module = function () {
        var answerA = 0;
        var answerB = 0;
        var grid;
        var processLine = function (line) {
            var result = 0;
            var splitted = line.split(' -> ');
            grid.addLineFromString(splitted);
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
            grid = new Grid();
            var result = 0;
            lines.forEach((line) => {
                result += processLineA(line);
            });
            if (lines.length < 100) {
                var debugOut = createDebugOut();
                writeOutput(grid, debugOut);
            }
            answerA = grid.getOverlapCount();
            return result;
        };
        var createDebugOut = function () {
            var debugOut = document.getElementById("debugOut");
            if (debugOut === null) {
                debugOut = document.createElement("pre");
                debugOut.id = "debugOut";
                document.body.append(debugOut);
            }
            debugOut.innerHTML = "loading...";
            return debugOut;
        };
        var writeOutput = async function (grid, elem) {
            var gridString = await grid.drawGrid();
            elem.innerHTML = gridString;
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
            grid = new Grid();
            grid.allowDiagonals = true;
            var result = 0;
            lines.forEach(function (line) {
                result += processLineB(line);
            });
            if (lines.length < 100) {
                var debugOut = createDebugOut();
                writeOutput(grid, debugOut);
            }
            answerB = grid.getOverlapCount();
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
})(day5 || (day5 = {}));
//# sourceMappingURL=script.js.map