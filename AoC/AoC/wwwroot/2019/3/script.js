// noprotect
window.module = function () {
    var processLine = function (line) {

        var result = [];
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            var instructions = lineContents.split(',');
            var x = 0;
            var y = 0;
            var steps = 0;

            instructions.forEach(function (instruction) {
                var direction = instruction[0];
                var distance = parseInt(instruction.substring(1));
                steps += distance;
                var deltaY = 0;
                var deltaX = 0;
                switch (direction) {
                    case 'R':
                        deltaX = distance;
                        break;
                    case 'L':
                        deltaX = -1 * distance;
                        break;
                    case 'D':
                        deltaY = distance;
                        break;
                    case 'U':
                        deltaY = -1 * distance;
                        break;
                }
                
                var lastX = x;
                var lastY = y;
                x += deltaX;
                y += deltaY;
                result.push({
                    beginSteps: steps - distance,
                    xFrom: lastX,
                    yFrom: lastY,
                    xTo: x,
                    yTo: y
                });
            });
            return result;
        }
    };

    var processLinesA = function (textLines) {
        var result = 0;
        var linePoints = [];
        textLines.forEach(function (textLine) {
            linePoints.push(processLine(textLine));
        });

        var intersections = [];
        linePoints[0].forEach(function (line1) {
            linePoints[1].forEach(function (line2) {
                var intersection = checkLineIntersection(line1.xFrom, line1.yFrom, line1.xTo, line1.yTo,
                    line2.xFrom, line2.yFrom, line2.xTo, line2.yTo);
                if (intersection !== null) {
                    intersections.push(intersection);
                }
            });
        });

        intersections.forEach(function (intersection) {
            var x0 = 0;
            var y0 = 0;
            var x1 = intersection.x;
            var y1 = intersection.y;

            var distance = Math.abs(x1 - x0) + Math.abs(y1 - y0);
            intersection.distance = distance;
        });

        result = Math.min(...intersections.map(intersection => intersection.distance));

        return result;
    };


    function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
        // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
        var denominator, a, b, numerator1, numerator2, result = {
            x: null,
            y: null
        };
        denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
        if (denominator == 0) {
            return null;
        }
        a = line1StartY - line2StartY;
        b = line1StartX - line2StartX;
        numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
        numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;
        if (a > 0 && a < 1
            && b > 0 && b < 1) {
            result.x = line1StartX + (a * (line1EndX - line1StartX));
            result.y = line1StartY + (a * (line1EndY - line1StartY));
            return result;
        } else {
            return null;
        }
    }

    var processLinesB = function (textLines) {
        var result = 0;
        var linePoints = [];
        textLines.forEach(function (textLine) {
            linePoints.push(processLine(textLine));
        });

        var intersections = [];
        linePoints[0].forEach(function (line1) {
            linePoints[1].forEach(function (line2) {
                var intersection = checkLineIntersection(line1.xFrom, line1.yFrom, line1.xTo, line1.yTo,
                    line2.xFrom, line2.yFrom, line2.xTo, line2.yTo);
                if (intersection !== null) {
                    intersections.push({ point: intersection, line1: line1, line2: line2 });
                }
            });
        });

        intersections.forEach(function (intersection) {
            var line1DistanceToIntersectionPoint = getDistance(intersection.point.x, intersection.point.y, intersection.line1.xFrom, intersection.line1.yFrom);
            var line2DistanceToIntersectionPoint = getDistance(intersection.point.x, intersection.point.y, intersection.line2.xFrom, intersection.line2.yFrom);
            intersection.stepsToIntersectionPoint = intersection.line1.beginSteps + intersection.line2.beginSteps + line1DistanceToIntersectionPoint + line2DistanceToIntersectionPoint;
        });

        result = Math.min(...intersections.map(intersection => intersection.stepsToIntersectionPoint));

        return result;
    };

    var getDistance = function (x0,y0,x1,y1) {
        return Math.abs(x1 - x0) + Math.abs(y1 - y0);
    }

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



