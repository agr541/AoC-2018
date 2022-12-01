// noprotect
window.module = function () {
    var answerA = 0;
    var answerB = 0;
    var items = [];
    var passwords = {};
    var processLine = function (line) {
        var result = 0;
        var lineContents = line.trim();

        var spaceSplitted = lineContents.split(' ', 3);
        var occurs = spaceSplitted[0].split('-', 2);
        var character = spaceSplitted[1];
        var passwordValue = spaceSplitted[2];

        var password = parsePassword(passwordValue);
        var item = {};
        item.arg0 = parseInt(occurs[0]);
        item.arg1 = parseInt(occurs[1]);
        item.character = character.charAt(0);
        item.password = password;
        item.validA = isValid(item);
        item.validB = isValidB(item);
        if (item.validA) {
            answerA++;
        }
        if (item.validB) {
            answerB++;
        }
        items.push(item);

        return result;
    };

    var parsePassword = function (passwordValue) {
        var password = passwords[passwordValue];
        if (!password) {
            password = {
                value: passwordValue,
                charCounts: [],
                count: 1
            };
            for (var passwordChar of password.value) {
                var count = password.charCounts[passwordChar];
                if (isNaN(count)) {
                    count = 0;
                }
                password.charCounts[passwordChar] = ++count;
            }
        }
        else {
            password.count++;
        }
        passwords[password.value] = password;
        return password;
    };

    var processLinesA = function (lines) {
        var result = 0;
        answerA = 0;
        items = [];
        passwords = {};
        var number;
        lines.forEach(function (line) {
            processLine(line);
        });

        for (var item of items) {
            if (!item.valid) {
                result++;
            }
        }

        return result;
    };

    var isValidB = function (item) {
        var result = true;
        var password = item.password.value;
        var arg0IsValid = password.charAt(item.arg0-1) === item.character;
        var arg1IsValid = password.charAt(item.arg1-1) === item.character;

        result = arg0IsValid ^ arg1IsValid;
        return result === 1;
    };
    var isValid = function (item) {
        var result = true;
        var password = item.password;

        var charCount = password.charCounts[item.character];

        if (typeof (charCount) === 'undefined' || charCount < item.arg0 || charCount > item.arg1) {
            result = false;
        }
        return result;
    };

    var processLinesB = function (lines) {
        var result = 0;
        answerB = 0;
        items = [];
        passwords = {};
        var number;
        lines.forEach(function (line) {
            processLine(line);
        });

        for (var item of items) {
            if (!item.validB) {
                result++;
            }
        }

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



