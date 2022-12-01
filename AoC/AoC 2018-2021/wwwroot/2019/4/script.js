// noprotect
window.module = function () {
  
    var processLinesA = function (lines) {
        var result = 0;
        for (var i = 123257; i <= 647015; i++) {
            var passwordText = '' + i;
            if((passwordText.indexOf('00') >-1 )||
                passwordText.indexOf('11') > -1 ||
                passwordText.indexOf('22') > -1||
                passwordText.indexOf('33') > -1||
                passwordText.indexOf('44') > -1||
                passwordText.indexOf('55') > -1||
                passwordText.indexOf('66') > -1||
                passwordText.indexOf('77') > -1||
                passwordText.indexOf('88') > -1||
                passwordText.indexOf('99') > -1) {

                var isValid = true;
                for (var j = 0; j < passwordText.length - 1; j++) {
                    if (passwordText.charCodeAt(j + 1) < passwordText.charCodeAt(j)) {
                        isValid = false;
                        break;
                    }
                }
                if (isValid) {
                    result++;
                }
            }
        }
        return result;
    };
    
    var processLinesB = function (lines) {
        var result = 0;
        for (var i = 123257; i <= 647015; i++) {
            var passwordText = '' + i;
            if ((passwordText.indexOf('00') > -1 && passwordText.indexOf('000') == -1) ||
                (passwordText.indexOf('11') > -1 && passwordText.indexOf('111') == -1) ||
                (passwordText.indexOf('22') > -1 && passwordText.indexOf('222') == -1) ||
                (passwordText.indexOf('33') > -1 && passwordText.indexOf('333') == -1) ||
                (passwordText.indexOf('44') > -1 && passwordText.indexOf('444') == -1) ||
                (passwordText.indexOf('55') > -1 && passwordText.indexOf('555') == -1) ||
                (passwordText.indexOf('66') > -1 && passwordText.indexOf('666') == -1) ||
                (passwordText.indexOf('77') > -1 && passwordText.indexOf('777') == -1) ||
                (passwordText.indexOf('88') > -1 && passwordText.indexOf('888') == -1) ||
                (passwordText.indexOf('99') > -1 && passwordText.indexOf('999') == -1)) {

                var isValid = true;
                for (var j = 0; j < passwordText.length - 1; j++) {
                    if (passwordText.charCodeAt(j + 1) < passwordText.charCodeAt(j)) {
                        isValid = false;
                        break;
                    }
                }
                if (isValid) {
                    result++;
                }
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



