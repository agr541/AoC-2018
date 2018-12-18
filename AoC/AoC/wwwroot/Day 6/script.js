window.module = function () {
    var parseCoordinates = function (lineContents, lineIndex) {
        var xYComponents = lineContents.split(', ');
        var x = parseInt(xYComponents[0]);
        var y = parseInt(xYComponents[1]);
        var name = 'Coordinate ' + (lineIndex + 1);
        var result = {
            name: name,
            isCoordinate: true,
            isCoordinateDistance: false,
            x: x,
            y: y
        };
        return result;
    };

    var getFiniteArea = function (coordinates) {
        var getXCoordinate = function (coordinate) {
            return coordinate.x;
        };
        var getYCoordinate = function (coordinate) {
            return coordinate.y;
        };

        var maxX = Math.max(...coordinates.map(getXCoordinate));
        var maxY = Math.max(...coordinates.map(getYCoordinate));
        var width = maxX;
        var height = maxY;
        var size = width * height;
        var result = {
            x: 0,
            y: 0,
            w: width,
            h: height,
            points: new Array(size)
        };
        for (var i = 0; i < result.points.length; i++) {
            result.points[i] = [];
        }
        return result;
    };

    var getCoordinatePointIndex = function (coordinate, finiteArea) {
        return coordinate.y * finiteArea.width + coordinate.x;
    };

    var setPoint = function (finiteArea, coordinate) {
        var coordinatePointIndex = getCoordinatePointIndex(coordinate, finiteArea);
        finiteArea.points[coordinatePointIndex] = [coordinate];
    };

    var getPosition = function (coordinatePointIndex, finiteArea) {
        var y = Math.floor(coordinatePointIndex / finiteArea.w);
        var x = coordinatePointIndex - y * finiteArea.w;
        return {
            x: x,
            y: y
        };
    };

    var isCoordinate = function (areaPoint) {
        var result = areaPoint.length === 1 && areaPoint[0].isCoordinate === true;
        return result;
    };

    var getCoordinateDistance = function (coordinate, position) {
        var distance = Math.abs(coordinate.x - position.x) + Math.abs(coordinate.y - position.y);
        var result = {
            name: 'Distance to ' + coordinate.name,
            x: position.x,
            y: position.y,
            isCoordinate: false,
            isCoordinateDistance: true,
            distance: distance
        };
        return result;
    };

    var setDistance = function (finiteArea, coordinate) {
        finiteArea.points.forEach(function (areaPoint, areaPointIndex) {

            if (!isCoordinate(areaPoint)) {
                var position = getPosition(areaPointIndex, finiteArea);
                var distance = getCoordinateDistance(coordinate, position);
                areaPoint.push(distance);
            }
        });
    };

    var byDistance = function (pointContents, otherPointContents) {
        var distance = 0;
        var otherDistance = 0;
        if (pointContents.isCoordinateDistance === true) {
            distance = pointContents.distance;
        }
        if (otherPointContents.isCoordinateDistance === true) {
            otherDistance = otherPointContents.distance;
        }
        return distance - otherDistance;
    };

    var setClosestDistance = function (coordinatesArray, finiteArea) {
        coordinatesArray.forEach(function (coordinate) {
            setPoint(finiteArea, coordinate);
        });

        coordinatesArray.forEach(function (coordinate) {
            setDistance(finiteArea, coordinate);
        });
    };

    var getFinitePointDistances = function (finiteArea) {
        var result = [];
        var infiniteAreasNames = [];
        finiteArea.points.forEach(function (areaPoint) {
            areaPoint.forEach(function (coordinateDistance) {
                if (coordinateDistance.isCoordinateDistance === true
                    && infiniteAreasNames.indexOf(coordinateDistance.name) === -1
                    && (coordinateDistance.x === finiteArea.x
                        || coordinateDistance.y === finiteArea.y
                        || coordinateDistance.x === finiteArea.w
                        || coordinateDistance.y === finiteArea.h)) {
                    infiniteAreasNames.push(coordinateDistance.name);
                }
            });
        });


        finiteArea.points.forEach(function (areaPoint) {
            areaPoint.forEach(function (coordinateDistance) {
                if (infiniteAreasNames.indexOf(coordinateDistance.name) === -1 &&
                    coordinateDistance.isCoordinateDistance === true) {
                    result.push(coordinateDistance);
                }
            });
        });
        return result;
    };

    var getBiggestAreaSize = function (finitePointDistances) {
        var counts = [];
        var result = 0;
        finitePointDistances.forEach(function (finitePointDistance) {
            if (typeof counts[finitePointDistance.name] === 'undefined') {
                counts[finitePointDistance.name] = 0;
            }
            counts[finitePointDistance.name]++;
            if (counts[finitePointDistance.name] > result) {
                result = counts[finitePointDistance.name];
            }

        });
        return result;
    };

    var getPointsWithDistanceSumLowerThan = function (finiteArea, maxAreaSize) {
        var result = [];
        finiteArea.points.forEach(function (areaPoint) {
            var sumOfDistance = 0;
            for (var pointDistanceKey in areaPoint) {
                var pointDistance = areaPoint[pointDistanceKey];
                if (pointDistance.isCoordinateDistance === true) {
                    sumOfDistance += pointDistance.distance;
                    if (sumOfDistance >= maxAreaSize) {
                        break;
                    }
                }
            }
            if (sumOfDistance < maxAreaSize) {
                result.push(areaPoint);
            }
        });
        return result;
    };

    var removeLargerThanSmallestDistances = function (finiteArea) {
        finiteArea.points.forEach(function (areaPoint) {
            areaPoint.sort(byDistance);
            if (areaPoint[0].isCoordinateDistance === true) {
                var distance = areaPoint[0].distance;
                for (var i = areaPoint.length - 1; i >= 0; i--) {
                    if (areaPoint[i].distance !== distance) {
                        areaPoint.splice(i, 1);
                    }
                }
            }
            if (areaPoint.length > 1) {
                areaPoint.length = 0;
            }
        });
    };

    var processLine = function (line, lineIndex) {
        var result = null;

        var lineContents = line.trim();
        if (lineContents.length > 0) {
            result = parseCoordinates(lineContents, lineIndex);
        }
        return result;
    };

    var processLinesA = function (lines) {
        var coordinatesArray = [];
        var result = 0;
        lines.forEach(function (line, lineIndex) {
            var coordinates = processLine(line, lineIndex);
            coordinatesArray.push(coordinates);
        });
        var finiteArea = getFiniteArea(coordinatesArray);
        setClosestDistance(coordinatesArray, finiteArea);
        removeLargerThanSmallestDistances(finiteArea);
        var finitePointDistances = getFinitePointDistances(finiteArea);
        var biggestAreaSize = getBiggestAreaSize(finitePointDistances);
        result = biggestAreaSize;
        return result;
    };

    var processLinesB = function (lines) {
        var coordinatesArray = [];
        var result = 0;
        lines.forEach(function (line, lineIndex) {
            var coordinates = processLine(line, lineIndex);
            coordinatesArray.push(coordinates);
        });
        var finiteArea = getFiniteArea(coordinatesArray);
        setClosestDistance(coordinatesArray, finiteArea);
        var finitePointDistances = getPointsWithDistanceSumLowerThan(finiteArea, 10000);
        result = finitePointDistances.length;
        return result;
    };

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



