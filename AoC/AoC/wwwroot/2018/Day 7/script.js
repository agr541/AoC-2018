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
        var result = new Object()
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            var lineParts = lineContents.split(' must be finished before step ');
            var stepMustBeFinishedPart = lineParts[0];
            var stepCanBeginPart = lineParts[1];
            result.previousStep = stepMustBeFinishedPart.substr(stepMustBeFinishedPart.length - 1, 1);
            result.step = stepCanBeginPart.substr(0, 1);
        }
        return result;
    };

    var allPreviousStepsCompleted = function (step, instructions, finishedSteps) {
        var result = true;
        var previousSteps = [];
        for (var j = 0; j < instructions.length; j++) {
            var instruction = instructions[j];
            if (instruction.step === step) {
                previousSteps.push(instruction.previousStep);
            }
        }

        for (var k = 0; k < previousSteps.length; k++) {
            if (finishedSteps.indexOf(previousSteps[k]) === -1) {
                result = false;
                break;
            }
        }

        return result;
    };

    var getFirstCompletableStep = function (instructions, finishedSteps, busySteps) {
        var result = '';
        var completableSteps = [];
        for (var i = 0; i < instructions.length; i++) {
            var instruction = instructions[i];
            if (finishedSteps.indexOf(instruction.step) === -1
                && allPreviousStepsCompleted(instruction.step, instructions, finishedSteps)) {
                if (typeof busySteps === 'undefined' || busySteps.indexOf(instruction.step) === -1) {
                    completableSteps.push(instruction.step);
                }
            }
        }
        completableSteps.sort();
        if (completableSteps.length > 0) {
            result = completableSteps[0];
        }
        return result;
    };

    var getFirstStep = function (instructions, finishedSteps, busySteps) {
        var result = '';
        var previousOnlySteps = [];
        for (var i = 0; i < instructions.length; i++) {
            var instruction = instructions[i];
            var previousStepFound = false;
            for (var j = 0; j < instructions.length; j++) {
                if (i === j) continue;
                var otherInstruction = instructions[j];
                if (instruction.previousStep === otherInstruction.step) {
                    previousStepFound = true;
                    break;
                }
            }
            if (previousStepFound === false
                && finishedSteps.indexOf(instruction.previousStep) === -1
                && (typeof busySteps === 'undefined'
                    || busySteps.indexOf(instruction.previousStep) === -1)) {
                previousOnlySteps.push(instruction.previousStep);
            }
        }
        if (previousOnlySteps.length > 0) {
            previousOnlySteps.sort();
            result = previousOnlySteps[0];
        }
        return result;
    };

    function createWorker(id) {
        var result = {
            id: id,
            workingOnStep: null,
            secondsUntilCompletion: 0
        };
        return result;
    };

    function createWorkers(count) {
        var result = [];
        for (var i = 0; i < count; i++) {
            var worker = createWorker(i);
            result.push(worker);
        }
        return result;
    };

    function getStepValue(nextStep) {
        var result = nextStep.charCodeAt(0) - 64;
        return result;
    };

    function getNextStep(instructions, finishedSteps, workers) {
        var busySteps = '';
        workers.forEach(function (worker) {
            if (worker.workingOnStep !== null) {
                busySteps += worker.workingOnStep;
            }
        });
        var nextStepA = getFirstStep(instructions, finishedSteps, busySteps);
        var nextStepB = getFirstCompletableStep(instructions, finishedSteps, busySteps);
        if (nextStepA.length + nextStepB.length === 0) {
            finishedSteps = finishedSteps;
        }

        var result;
        if (nextStepA !== "" && (nextStepB === "" || nextStepA.charCodeAt(0) < nextStepB.charCodeAt(0))) {
            result = nextStepA;
        } else {
            result = nextStepB;
        }
        return result;
    }

    var processLinesA = function (lines) {
        var result = '';
        var instructions = [];
        var steps = [];
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var instruction = processLine(line);
            instructions.push(instruction);
            if (steps.indexOf(instruction.previousStep) === -1) {
                steps.push(instruction.previousStep);
            }
            if (steps.indexOf(instruction.step) === -1) {
                steps.push(instruction.step);
            }
        }
        var finishedSteps = '';
        while (finishedSteps.length < steps.length) {
            var nextStepA = getFirstStep(instructions, finishedSteps);
            var nextStepB = getFirstCompletableStep(instructions, finishedSteps);
            if (nextStepA.length + nextStepB.length === 0) {
                finishedSteps = finishedSteps;
            }
            if (nextStepA !== "" && (nextStepB === "" || nextStepA.charCodeAt(0) < nextStepB.charCodeAt(0))) {
                finishedSteps += nextStepA;
            } else {
                finishedSteps += nextStepB;
            }

        }
        result = finishedSteps;
        return result;
    };

    var processLinesB = function (lines) {
        var result = '';
        var instructions = [];
        var steps = [];
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var instruction = processLine(line);
            instructions.push(instruction);
            if (steps.indexOf(instruction.previousStep) === -1) {
                steps.push(instruction.previousStep);
            }
            if (steps.indexOf(instruction.step) === -1) {
                steps.push(instruction.step);
            }
        }
        var finishedSteps = '';
        var workers = createWorkers(5);
        var currentTime = 0;
        while (finishedSteps.length < steps.length) {
            workers.forEach(function (worker) {
                if (worker.workingOnStep !== null) {
                    worker.secondsUntilCompletion--;
                    if (worker.secondsUntilCompletion === 0) {
                        finishedSteps += worker.workingOnStep;
                        worker.workingOnStep = null;
                        var nextStep = getNextStep(instructions, finishedSteps, workers);
                        if (nextStep !== '') {
                            worker.workingOnStep = nextStep;
                            worker.secondsUntilCompletion = 60 + getStepValue(nextStep);
                        }
                    }
                }
            });

            workers.forEach(function (worker) {
                if (worker.workingOnStep === null) {
                    var step = getNextStep(instructions, finishedSteps, workers);
                    if (step !== '') {
                        worker.workingOnStep = step;
                        worker.secondsUntilCompletion = 60 + getStepValue(step);
                    }
                }
            });

            var infoLine = '';
            workers.forEach(function (worker) {
                if (worker.workingOnStep === null) {
                    infoLine += ' .';
                } else {
                    infoLine += ' ' + worker.workingOnStep;
                }
            });
            console.info('' + currentTime + ' ' + infoLine);
            currentTime++;
        }
        currentTime--;
        result = currentTime;
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



