// noprotect
var module = function () {
    var getInput = function (inputSelector) {
        var input = document.querySelector(inputSelector);
        return input.value;
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
    };

    var setOutput = function (outputSelector, outputValue) {
        var output = document.querySelector(outputSelector);
        output.value = outputValue;
    };

    var processLine = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
           
        }
        return result;
    };

    var processLines = function (lines) {
        var operations = [];
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            
        }
    };
    
    var pocessInput = function (input) {
        var lines = input.split('\n');
        return processLines(lines);
    };

    var initialize = function (options) {
        var input = getInputFromUrl(options.inputUrl, function (input) {
            var output = pocessInput(input);
            setOutput(options.outputSelector, output);
        });
    };

    return {
        start: initialize
    };
};

