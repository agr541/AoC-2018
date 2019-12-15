// noprotect
window.module = function () {
    var answerA = 0;
    var answerB = 0;
    var width = 0;
    var height = 0;
    var processLine = function (line) {
        var result;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            var numbers = lineContents.split('').map(char => parseInt(char));
            result = splitAt(numbers, width * height);

        }
        return result;
    };

    var countOccurence = function (values, value) {
        var result = 0;
        values.forEach(valuesValue => { if (valuesValue === value) { result++ } });
        return result;
    };

    var splitAt = function (arr, imageSize) {
        var result = [];
        for (var i = 0; i < arr.length; i += imageSize) {
            result.push(arr.slice(i, i + imageSize));
        }
        return result;
    };

    var processLinesA = function (lines) {
        width = 25;
        height = 6;

        var result = { numberOfZeros: 0, numberOfOnes: 0, numberOfTwos: 0 };;
        lines.forEach(function (line) {

            var layers = processLine(line);
            var minCountZero = line.length;
            var minCountZeroLayer;
            layers.forEach(layer => {
                var countZero = countOccurence(layer, 0);
                if (countZero < minCountZero) {
                    minCountZeroLayer = layer;
                    minCountZero = countZero;
                }
            });
            result.numberOfZeros = minCountZero;
            result.numberOfOnes = countOccurence(minCountZeroLayer, 1);
            result.numberOfTwos = countOccurence(minCountZeroLayer, 2);

            answerA = result.numberOfTwos * result.numberOfOnes;
        });
        return result;
    };

    var processLinesB = function (lines) {
        width = 6;
        height = 25;
        var result = { grid: [] };;

        lines.forEach(function (line) {
            grid = [];
            for (var x = 0; x < width; x++) {
                grid[x] = [];
                for (var y = 0; y < height; y++) {
                    grid[x].push(2);
                }
            }


            var layers = processLine(line);
            var layerGrids = layers.map(layer => {
                var index = 0;
                result = [];
                for (var x = 0; x < width; x++) {
                    result[x] = [];
                    for (var y = 0; y < height; y++) {
                        result[x].push(layer[index]);
                        index++;
                    }
                }
                return result;
            });
            layerGrids.forEach(layerGrid => {
                for (var x = 0; x < width; x++) {
                    for (var y = 0; y < height; y++) {
                        if (grid[x][y] === 2 && layerGrid[x][y] !== 2) {
                            grid[x][y] = layerGrid[x][y];
                        }
                    }
                }
            });
            result.grid = grid;
        });

        answerB = render(result.grid);

        

        return result;
    };

    var render = function (grid) {
        var result = '';
        grid.forEach(row => {
            row.forEach(col => {

                result += col === 0 ? ' ' : '#';
            });
            result += '\n';
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
            setOutput(options.outputSelector, answerA);
        });
    };

    var initializeB = function (options) {
        var input = getInputFromUrl(options.inputUrl, function (input) {
            var output = pocessInputB(input);
            setOutput(options.outputSelector, answerB);
        });
    };

    return {
        runA: initializeA,
        runB: initializeB
    };
};



