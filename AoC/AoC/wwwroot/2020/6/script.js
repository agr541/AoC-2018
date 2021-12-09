// noprotect
window.module = function () {
    var answerA = 0;
    var answerB = 0;
    var groupAnswers = [];
    var processLine = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
        }
        return result;
    };
    var processLinesA = function (lines) {
        var result = 0;
        var currentGroup = null;
        for (var line of lines) {
            if (currentGroup === null || line === '') {
                if (currentGroup !== null) {
                    var copy = JSON.parse(JSON.stringify(currentGroup));
                    groupAnswers.push(copy);
                }
                currentGroup = {
                    answers: [],
                    uniqueAnswers: 0,
                    answersPerPerson: []
                };
            }
            if (line === '') {
                continue;
            }
            var answersPerPerson = [];
            for (var answer of line) {
                if (!currentGroup.answers.includes(answer)) {
                    currentGroup.uniqueAnswers++;
                }
                answersPerPerson.push(answer);
                currentGroup.answers.push(answer);
            }
            currentGroup.answersPerPerson.push(Array.from(answersPerPerson));
        }
        if (currentGroup !== null) {
            groupAnswers.push(currentGroup);
        }
        var uniqueAnswers = groupAnswers
            .map((a) => a.uniqueAnswers);
        var uniqueAnswersSum = uniqueAnswers
            .reduce((a, b) => a + b);
        answerA = uniqueAnswersSum;
        answerB = 0;
        for (var ga of groupAnswers) {
            var distinctAnswers = Array.from(new Set(ga.answers));
            for (var a of distinctAnswers) {
                if (ga.answersPerPerson.every(app => app.includes(a))) {
                    answerB++;
                }
            }
        }
        return result;
    };
    var processLinesB = function (lines) {
        var result = processLinesA(lines);
        lines.forEach(function (line) {
            // processLine(line);
        });
        return result;
    };
    var fallBackRequested = false;
    var getInputFromUrl = function (url, fallbackUrl, callBack) {
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
    var setOutput = function (outputSelector, outputValue) {
        var output = document.querySelector(outputSelector);
        output.value = outputValue;
    };
    var pocessInputA = function (input) {
        var lines = input.split('\r\n');
        return processLinesA(lines);
    };
    var pocessInputB = function (input) {
        var lines = input.split('\r\n');
        return processLinesB(lines);
    };
    var initializeA = function (options) {
        var input = getInputFromUrl(options.inputUrl, options.inputUrlFallback, function (input) {
            var output = pocessInputA(input);
            if (answerA !== 0) {
            }
            setOutput(options.outputSelector, output);
        });
    };
    var initializeB = function (options) {
        var input = getInputFromUrl(options.inputUrl, options.inputUrlFallback, function (input) {
            var output = pocessInputB(input);
            if (answerB !== 0) {
                output = answerB;
            }
            setOutput(options.outputSelector, output);
        });
    };
    var initialize = (options) => {
        if (options.runPart === 1) {
            initializeA(options);
        }
        else if (options.runPart === 2) {
            initializeB(options);
        }
    };
    return {
        run: initialize
    };
};
//# sourceMappingURL=script.js.map