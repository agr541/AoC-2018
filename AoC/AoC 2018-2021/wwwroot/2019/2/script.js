// noprotect
window.module = function () {
    var answerA;
    var answerB;
    var processLine = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            
            
            for (var verb = 0; verb <= 99; verb++) {
                for (var noun = 0; noun <= 99; noun++) {
                    var programData = lineContents.split(',').map(v => parseInt(v));
                    var instructionPointer = 0;
                    programData[1] = noun;
                    programData[2] = verb;
                    while (instructionPointer < programData.length) {
                        var i = instructionPointer;
                        switch (programData[i]) {
                            case 1:
                                programData[programData[i + 3]] = programData[programData[i + 1]] + programData[programData[i + 2]];
                                instructionPointer += 4;
                                break;
                            case 2:
                                programData[programData[i + 3]] = programData[programData[i + 1]] * programData[programData[i + 2]];
                                instructionPointer += 4;
                                break;
                            case 99:
                                instructionPointer = programData.length;
                                if (programData[0] === 19690720) {
                                    answerB = 100*noun + verb;
                                    break;
                                }
                                break;
                            default:
                                instructionPointer = programData.length;
                                break;
                        }
                    }
                }
            }
        }


        return result;
    };
    
    var processLinesA = function (lines) {
        var result = 0;
        lines.forEach(function (line) {
           
            var lineContents = line.trim();
            if (lineContents.length > 0) {

                var programData = lineContents.split(',').map(v => parseInt(v));
                programData[1] = 12;
                programData[2] = 2;
                for (var i = 0; i < programData.length; i += 4) {
                    switch (programData[i]) {
                        case 1:
                            programData[programData[i + 3]] = programData[programData[i + 1]] + programData[programData[i + 2]];
                            break;
                        case 2:
                            programData[programData[i + 3]] = programData[programData[i + 1]] * programData[programData[i + 2]];
                            break;
                        case 99:
                            break;
                        default:
                            alert('error');
                            break;
                    }
                }
                answerA = programData[0];
            }


            
        });
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



