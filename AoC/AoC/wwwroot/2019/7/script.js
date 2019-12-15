// noprotect
window.module = function () {
    var answerA;
    var answerB;
    var lastAmpHalted = false;
    var processLine = function (line, input) {
        var result = 0;
        var output = 0;

        var lineContents = line.trim();
        if (lineContents.length > 0) {
            var programData = lineContents.split(',').map(v => parseInt(v));
            var instructionPointer = 0;
            while (instructionPointer < programData.length) {
                var i = instructionPointer;
                var instruction = programData[i];
                var instructionString = '0000' + instruction;
                var opCode = parseInt(instructionString.charAt(instructionString.length - 1));
                var paramCount = 0;
                switch (opCode) {
                    case 1:
                        paramCount = 3;

                        break;
                    case 2:
                        paramCount = 3;

                        break;
                    case 3:
                        paramCount = 1;

                        break;
                    case 4:
                        paramCount = 1;

                        break;
                    case 5:
                        paramCount = 2;

                        break;
                    case 6:
                        paramCount = 3;

                        break;
                    case 7:
                        paramCount = 3;

                        break;
                    case 8:
                        paramCount = 1;

                        break;
                    case 9:
                        opCode = 99;
                        break;
                    default:
                        alert('error');
                }
                var paramModes = [];
                if (opCode !== 99) {
                    for (var j = instructionString.length - 3; j >= 0; j--) {
                        paramModes.push(parseInt(instructionString.charAt(j)));
                    }
                }

                switch (opCode) {
                    case 1:
                        programData[programData[i + 3]] = getParam(programData, programData[i + 1], paramModes[0]) + getParam(programData, programData[i + 2], paramModes[1]);
                        instructionPointer += 4;
                        break;
                    case 2:
                        programData[programData[i + 3]] = getParam(programData, programData[i + 1], paramModes[0]) * getParam(programData, programData[i + 2], paramModes[1]);
                        instructionPointer += 4;
                        break;
                    case 3:
                        var inputValue = input.pop();
                        programData[programData[i + 1]] = inputValue;
                        instructionPointer += 2;
                        break;
                    case 4:
                        output = getParam(programData, programData[i + 1], paramModes[0]);
                        instructionPointer += 2;
                        break;
                    case 5:
                        if (getParam(programData, programData[i + 1], paramModes[0]) !== 0) {
                            instructionPointer = getParam(programData, programData[i + 2], paramModes[1]);
                        }
                        else {
                            instructionPointer += 3;
                        }
                        break;
                    case 6:
                        if (getParam(programData, programData[i + 1], paramModes[0]) === 0) {
                            instructionPointer = getParam(programData, programData[i + 2], paramModes[1]);
                        }
                        else {
                            instructionPointer += 3;
                        }
                        break;
                    case 7:
                        if (getParam(programData, programData[i + 1], paramModes[0]) < getParam(programData, programData[i + 2], paramModes[1])) {
                            programData[programData[i + 3]] = 1;
                        } else {
                            programData[programData[i + 3]] = 0;
                        }
                        instructionPointer += 4;
                        break;
                    case 8:
                        if (getParam(programData, programData[i + 1], paramModes[0]) == getParam(programData, programData[i + 2], paramModes[1])) {
                            programData[programData[i + 3]] = 1;
                        } else {
                            programData[programData[i + 3]] = 0;
                        }
                        instructionPointer += 4;
                        break;

                    case 99:
                        instructionPointer = programData.length;
                        lastAmpHalted = true;
                        break;
                    default:
                        alert('error');
                        break;
                }
            }
            result = output;
        }
        return result;
    };

    var processLinesA = function (lines) {
        var program = lines[0];
        var maxOutput = 0;
        var combinationStrings = getCombinations([0, 1, 2, 3, 4]);
        var amplifierCount = 5;
        var combinations = combinationStrings.map(combinationString => combinationString.split('').map(combinationChar => parseInt(combinationChar)));
        combinations.forEach(function (combination) {
            
            var output = 0;
            for (var i = 0; i < combination.length; i++) {
                var input = output;
                output = processLine(program, [combination[i], input].reverse());
            }
            if (maxOutput < output) {
                maxOutput = output;
            }
        });
        answerA = maxOutput;
    };

    var getCombinations = function (input) {
        var result = [];
        var expectedTotal = 1;
        for (var i = 1; i <= input.length; i++) {
            expectedTotal *= i;
        }
        
        while (result.length < expectedTotal) {
            var combination = '';
            while (combination.length < 5) {
                var rnd = Math.floor(Math.random() * input.length);
                var suggestion = '' + input[rnd];
                if (combination.indexOf(suggestion) === -1) {
                    combination += '' + suggestion;
                }
            }
            if (result.indexOf(combination) === -1) {
                result.push(combination);
            }
            
        }

        return result;
    };

    var getParam = function (data, param, mode) {
        var result = 0;
        if (mode === 0) {
            result = data[param];
        } else if (mode === 1) {
            result = param;
        }
        return result;
    };

    var processLinesB = function (lines) {
        var program = lines[0];
        var maxOutput = 0;
        var combinationStrings = getCombinations([9, 8, 7, 6, 5]);
        var amplifierCount = 5;
        var combinations = combinationStrings.map(combinationString => combinationString.split('').map(combinationChar => parseInt(combinationChar)));
        var output = 0;
        var input = 0;
        combination = [[9, 8, 7, 6, 5]];
        combinations.forEach(function (combination) {
            while (!lastAmpHalted) {
                for (var i = 0; i < combination.length; i++) {
                    input = output;
                    output = processLine(program, [combination[i], input].reverse());
                }
                input = output;
                if (maxOutput < output) {
                    maxOutput = output;
                }
            }
        });
        answerB = maxOutput;
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



