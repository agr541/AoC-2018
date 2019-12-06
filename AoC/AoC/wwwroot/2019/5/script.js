// noprotect
window.module = function () {
    var answerA;
    var answerB;
    var processLine = function (line) {
        var result = 0;
        var output = 0;
        var input = 5;

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
                        programData[programData[i + 1]] = input;
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
                        if (programData[0] === 19690720) {
                            answerB = 100 * noun + verb;
                            break;
                        }
                        break;
                    default:
                        instructionPointer = programData.length;
                        break;
                }
            }
            answerB = output;
        }
        return result;
    };

    var processLinesA = function (lines) {
        var result = 0;
        var output = 0;
        var input = 1;
        lines.forEach(function (line) {

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
                            programData[programData[i + 1]] = input;
                            instructionPointer += 2;
                            break;
                        case 4:
                            output = getParam(programData, programData[i + 1], paramModes[0]);
                            instructionPointer += 2;
                            break;
                        case 99:
                            instructionPointer = programData.length;
                            if (programData[0] === 19690720) {
                                answerB = 100 * noun + verb;
                                break;
                            }
                            break;
                        default:
                            instructionPointer = programData.length;
                            break;
                    }
                }
                answerA = output;
            }
        });
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
        var result = 0;
        lines.forEach(function (line) {
            processLine(line);
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



