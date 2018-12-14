// noprotect
window.module = function () {
    var getInputFromUrl = function (url, callBack) {
        var req = new XMLHttpRequest();
        req.addEventListener('readystatechange', function () {
            var xhr = this;
            if (xhr.readyState === 4 && xhr.status === 200) {
                callBack(req.responseText);
            }
        });
        req.open('GET', url);
        req.send();
    };

    var setOutput = function (outputSelector, outputValue) {
        var output = document.querySelector(outputSelector);
        output.value = outputValue;
    };

    var processLine = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            result = parseRectangle(lineContents);
        }
        return result;
    };

    var setPosition = function (data, result) {
        var splitted = data.split(',');
        result.left = parseInt(splitted[0]) + 1;
        result.top = parseInt(splitted[1]) + 1;
        return result;
    };

    var setSize = function (data, result) {
        var splitted = data.split('x');
        result.width = parseInt(splitted[0]);
        result.height = parseInt(splitted[1]);
        return result;
    };

    var parseRectangle = function (line) {
        var idDimensions = line.split(' @ ');
        var result = {
            id: idDimensions[0],
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };
        var dimensions = idDimensions[1].trim();
        var positionSize = dimensions.split(':');
        var position = positionSize[0];
        var size = positionSize[1].trim();
        setPosition(position, result);
        setSize(size, result);
        return result;
    };

    var createCanvas = function (rectangles, defaultValue) {
        var result = new Object();
        var columnCount = Math.max(...rectangles.map(getRight));
        var rowCount = Math.max(...rectangles.map(getBottom));
        var rows = new Array(rowCount);
        rows.fill(null);
        rows.forEach(function (row, rowIndex, rowArray) {
            rowArray[rowIndex] = new Array(columnCount).fill(defaultValue);
        });
        result.rows = rows;
        result.defaultValue = defaultValue;
        result.rowCount = rowCount;
        result.columnCount = columnCount;
        result.writes = 0;
        writeRectangles(rectangles, result);
        return result;
    };

    var writeRectangles = function (rectangles, canvas) {
        rectangles.forEach(function (rectangle) {
            writeRectangle(rectangle, canvas);
        });
    };

    var writeRectangle = function (rectangle, canvas) {
        var right = rectangle.left + rectangle.width;
        var bottom = rectangle.top + rectangle.height;
        for (var rowIndex = rectangle.top; rowIndex < bottom; rowIndex++) {
            var row = canvas.rows[rowIndex];
            for (var columnIndex = rectangle.left; columnIndex < right; columnIndex++) {
                row[columnIndex]++;
                canvas.writes++;
            }
        }
    };

    var renderCanvas = function (canvas) {
        var canvasElement = document.createElement('canvas');
        canvasElement.width = canvas.columnCount;
        canvasElement.height = canvas.rowCount;
        document.body.appendChild(canvasElement);
        var context = canvasElement.getContext("2d");
        canvas.rows.forEach(function (row, rowIndex ) {
            row.forEach(function (cell, columnIndex) {
                var color = "#FFFFFF";
                if (cell === 1) {
                    color = "#000000";
                } else if (cell > 1) {
                    color = "#FF0000";
                }
                context.fillStyle = color;
                context.fillRect(rowIndex + 1, columnIndex + 1, 1, 1);
            });
        });
    };

    var getValueCountHigherThan = function (canvas, higherThan) {
        var result = 0;
        canvas.rows.forEach(function (row) {
            row.forEach(function (cell) {
                if (cell > higherThan) {
                    result++;
                }
            });
        });
        return result;
    };

    var getRight = function (rectangle, index, rectangles) {
        return rectangle.width + rectangle.left;
    };

    var getBottom = function (rectangle, index, rectangles) {
        return rectangle.height + rectangle.top;
    };

    var processLinesA = function (lines) {
        var result = 0;
        var rectangles = [];
        var rectangle;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            rectangle = processLine(line);
            rectangles.push(rectangle);
        }

        var canvas = createCanvas(rectangles, 0);
        result = getValueCountHigherThan(canvas,1);

        renderCanvas(canvas);
        return result;
    };

    function findNonOverlappingRectangleId(rectangles, canvas) {
        var result = '';
        rectangles.forEach(function (rectangle) {
            var writeCount = GetWriteCount(rectangle, canvas);
            if (writeCount === 0) {
                result = rectangle.id;
            }
        });
        return result;
    }

    var GetWriteCount = function (rectangle, canvas) {
        var result = 0;
        var right = rectangle.left + rectangle.width;
        var bottom = rectangle.top + rectangle.height;
        for (var rowIndex = rectangle.top; rowIndex < bottom; rowIndex++) {
            var row = canvas.rows[rowIndex];
            for (var columnIndex = rectangle.left; columnIndex < right; columnIndex++) {
                result += row[columnIndex];
            }
        }
        return result;
    };

    var processLinesB = function (lines) {
        var result = '';
        var rectangles = [];
        var rectangle;
        lines.forEach(function (line) {
            rectangle = processLine(line);
            rectangles.push(rectangle);
        });
        var canvas = createCanvas(rectangles, -1);
        result = findNonOverlappingRectangleId(rectangles, canvas);
        return result;
    };

    var pocessInputA = function (input) {
        var lines = input.split('\n');
        return processLinesA(lines);
    };

    var pocessInputB = function (input) {
        var lines = input.split('\n');
        return processLinesB(lines);
    };

    var initializeA = function (options) {
        var input = getInputFromUrl(options.inputUrl, function (input) {
            var output = pocessInputA(input);
            setOutput(options.outputSelector, output);
        });
    };

    var initializeB = function (options) {
        var input = getInputFromUrl(options.inputUrl, function (input) {
            var output = pocessInputB(input);
            setOutput(options.outputSelector, output);
        });
    };

    return {
        runA: initializeA,
        runB: initializeB
    };
};



