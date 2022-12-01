// noprotect
window.module = function () {

    function isDestroyable(unit, otherUnit) {
        return unit !== otherUnit
            && unit.toLowerCase() === otherUnit.toLowerCase();
    };

    function destroyUnits(units) {
        var unitArray = [...units];
        var destroyedUnits = -1;
        while (destroyedUnits !== 0) {
            destroyedUnits = 0;
            for (var unitIndex = 0; unitIndex < unitArray.length; unitIndex++) {
                var unit = unitArray[unitIndex];
                if (unitIndex < unitArray.length - 1) {
                    var nextUnit = unitArray[unitIndex + 1];
                    if (isDestroyable(unit, nextUnit)) {
                        unitArray.splice(unitIndex, 2);
                        destroyedUnits++;
                    }
                }
            }
        }
        return unitArray;
    };

    var processLine = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            var units = destroyUnits(lineContents);
            result += units.length;
        }
        return result;
    };

    var getUnits = function (reactedLine) {
        var result = [];
        var lineCharacters = [...reactedLine];
        lineCharacters.forEach(function (unit) {
            var upperCaseUnit = unit.toUpperCase();
            if (result.indexOf(upperCaseUnit) === -1) {
                result.push(upperCaseUnit);
            }
        });
        return result;
    };

    var removeUnit = function(unit, reactedLine) {
        var lowerCaseUnit = unit.toLowerCase();
        var upperCaseUnit = unit.toUpperCase();
        var lineWithoutUnit = reactedLine.replace(lowerCaseUnit, '').replace(upperCaseUnit, '');
        while (lineWithoutUnit.indexOf(lowerCaseUnit) !== -1
            && lineWithoutUnit.indexOf(upperCaseUnit) !== -1) {
            lineWithoutUnit = lineWithoutUnit.replace(lowerCaseUnit, '').replace(upperCaseUnit, '');
        }
        return lineWithoutUnit;
    };

    var processLinesA = function (lines) {
        var result = '';
        lines.forEach(function (line) {
            result = processLine(line);
        });
        return result;
    };
    
    var processLinesB = function (lines) {
        var result = 0;
        lines.forEach(function (line) {
            var reactedLineArray = destroyUnits(line);
            var reactedLine = reactedLineArray.join('');
            var units = getUnits(reactedLine);
            units.forEach(function (unit) {
                var lineWithoutUnit = removeUnit(unit, reactedLine);
                var reactedLineWithoutUnit = processLine(lineWithoutUnit);
                if (result === 0 || reactedLineWithoutUnit < result) {
                    result = reactedLineWithoutUnit;
                }
            });
        });
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



