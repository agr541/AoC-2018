// noprotect
window.module = function () {
    var answerA = 0;
    var answerB = 0;
    var items = [];
    var processLine = function (line) {
        var result = 0;
        var lineContents = line.trim();
        //if (lineContents.length > 0) {
           
        //}
        return result;
    };
    
    var processLinesA = function (lines) {
        var result = 0;
        items = [];
        var number;
        lines.forEach(function (line) {
            number = parseInt(line);
            
            items.forEach(function (item) {
                if (item + number === 2020) {
                    result = number * item;
                }
            });
            items.push(number);

            processLine(line);
        });
        
        return result;
    };
    
    var processLinesB = function (lines) {
        var result = 0;
        lines.forEach(function (line) {
            number = parseInt(line);

            items.forEach(function (item1, index1) {
                
                items.forEach(function (item2, index2) {
                    if (index1 !== index2) {
                        if (item1 + item2 + number === 2020) {
                            result = number * item1 * item2;
                        }
                    }
                });
            });
            items.push(number);

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
            answerA = output;
            setOutput(options.outputSelector, answerA);
        });
    };

    var initializeB = function (options) {
        var input = getInputFromUrl(options.inputUrl, function (input) {
            var output = pocessInputB(input);
            answerB = output;
            setOutput(options.outputSelector, answerB);
        });
    };

    return {
        runA: initializeA,
        runB: initializeB
    };
};



