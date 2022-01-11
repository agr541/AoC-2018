// noprotect
namespace day5 {
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

    class Point {
        static fromString(coords: string) {
            var coordsParts = coords.split(',');
            var x = parseInt(coordsParts[0]);
            var y = parseInt(coordsParts[1]);
            return new Point(x, y);
        };

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        public x: number;
        public y: number;
    }

    class Grid {
        public points: Point[];
        public lines: Point[][];
        public allowDiagonals:boolean;

        public constructor() {
            this.points = [];
            this.lines = [];
            this.allowDiagonals = false;
        }

        public addLineFromString(lineParts: string[]) {
            var firstPoint = Point.fromString(lineParts[0]);
            var secondPoint = Point.fromString(lineParts[1]);
            this.addLine(firstPoint, secondPoint);
        }

        private addLine(pointA: Point, pointB: Point) {
            var line = [pointA, pointB];
            var pointsByX = line.sort((a, b) => a.x - b.x);
            var pointsByY = line.sort((a, b) => a.y - b.y);
            if (pointsByX[0].x === pointsByX[1].x) {
                this.addVerticalLine(pointsByX[0], pointsByY[1].y - pointsByY[0].y);
                this.lines.push(line);
            } else if (pointsByY[0].y === pointsByY[1].y) {
                this.addHorizontalLine(pointsByY[0], pointsByX[1].x - pointsByX[0].x);
                this.lines.push(line);
            } else if (this.allowDiagonals) {
                this.addDiagonalLine(line[0], line[1]);
                this.lines.push(line);
            }
        }
        private addHorizontalLine(start: Point, length: number) {
            for (var i = 0; i <= length; i++) {
                this.points.push(new Point(start.x + i, start.y));
            }
        }

        private addVerticalLine(start: Point, length: number) {
            for (var i = 0; i <= length; i++) {
                this.points.push(new Point(start.x, start.y + i));
            }
        }

        private addDiagonalLine(start: Point, end: Point) {
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

        public async drawGrid() {

            var result = "";
            var largestX = this.points.reduce((p, c) => p.x > c.x ? p : c).x;
            var largestY = this.points.reduce((p, c) => p.y > c.y ? p : c).y;
            var width = largestX + 1;
            var height = largestY + 1;
            var arr: number[] = [];
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
            })
            return result;
        }

        public getOverlapCount() {
            var overlaps = Grouping.groupBy(this.points, (value) => "" + value.x + "," + value.y);
            var overlapsWith2OrMore = overlaps.filter(f => f.values.length > 1);
            return overlapsWith2OrMore.length;
        }
    }

    // noprotect
    (window as any).module = function () {
        var answerA: number = 0;
        var answerB: number = 0;
        var grid: Grid;

        var processLine = function (line: string) {
            var result = 0;
            var splitted = line.split(' -> ');
            grid.addLineFromString(splitted);

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

            grid = new Grid();
            var result = 0;
            lines.forEach((line: string) => {
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
        }

        var writeOutput = async function (grid: Grid, elem: HTMLElement) {
            var gridString = await grid.drawGrid();
            elem.innerHTML = gridString;
        }

        var processLineB = function (line: string) {
           
            var result = 0;
            var lineContents = line.trim();
            if (lineContents.length > 0) {
                result += processLine(lineContents);
            }
            return result;
        };


        var processLinesB = function (lines: string[]) {
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