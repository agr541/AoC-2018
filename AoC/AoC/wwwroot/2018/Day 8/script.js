// noprotect
window.module = function () {
    var parseIntArray(lineContents) {
        var result = [];
        result = lineContents.split(' ');
        return result;
    };

    var getNodes = function (ints) {
        var result = [];
        var parseState = {
            childCount: true,
            metaDataCount: false,
            childNode: false,
            metaData: false
        };
        var currentNode = {
            childCount: 0,
            metaDataCount: 0,
            childNodes: []
        };

        for (var i = 0; i < ints.length; i++) {
            var currentInt = ints[i];
            
            if (parseState.childCount === true) {
                currentNode.childCount = currentInt;
                parseState.childCount = false;
                parseState.metaDataCount = true;
            }
            else if (parseState.metaDataCount === true) {
                currentNode.metaDataCount = currentInt;
                parseState.metaDataCount = false;
                parseState.childNode = currentNode.childCount > 0;
            } else if (parseState.childNode) {
                addChildNode(currentNode, ints.splice(i), parseState);
            }
            
        }
        return result;
    }

    var getSumOfMetaData = function (lineContents) {
        var ints = parseIntArray(lineContents);
        var nodes = getNodes(ints);
    };

    var processLine = function (line) {
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            result = getSumOfMetaData(lineContents);
        }
        return result;
    };
    
    var processLinesA = function (lines) {
        var result = 0;
        lines.forEach(function (line) {
            processLine(line);
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



