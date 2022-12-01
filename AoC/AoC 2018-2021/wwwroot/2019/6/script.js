// noprotect
window.module = function () {
    var answerA = 0;
    var answerB = 0;
    var processLine = function (line) {
        var result;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            result = lineContents.split(')');
        }
        return result;
    };

    var getOrAdd = function (objects, name) {
        var result = objects.find(o => o.name === name);
        if (result === undefined) {
            result = {
                name: name,
                directOrbits: []
            };
            objects.push(result);
        }
        return result;
    };

    var processLinesA = function (lines) {
        var result = 0;
        var objects = [];
        lines.forEach(function (line) {
            var orbit = processLine(line);
            var object1 = getOrAdd(objects, orbit[0]);
            var object2 = getOrAdd(objects, orbit[1]);
            object2.directOrbits.push(object1);
        });
        var direct = 0;
        var indirect = 0;
        objects.forEach(function (object) {
            direct += object.directOrbits.length;
            object.directOrbits.forEach(directOrbitObject => {
                if (directOrbitObject.directOrbits.length > 0) {
                    var inDirectOrbitObject = directOrbitObject.directOrbits[0];
                    indirect++;
                    while (inDirectOrbitObject !== undefined && inDirectOrbitObject.directOrbits.length > 0) {
                        inDirectOrbitObject = inDirectOrbitObject.directOrbits[0];
                        if (inDirectOrbitObject !== undefined) {
                            indirect++;
                        }
                    }
                }

            });
        });

        answerA = direct + indirect;

        return result;
    };

    var processLinesB = function (lines) {
        var result = 0;
        var objects = [];
        lines.forEach(function (line) {
            var orbit = processLine(line);
            var object1 = getOrAdd(objects, orbit[0]);
            var object2 = getOrAdd(objects, orbit[1]);
            object2.directOrbits.push(object1);
        });

        var you = objects.find(o => o.name === 'YOU');
        var san = objects.find(o => o.name === 'SAN');

        var youToStart = toStart(you.directOrbits[0].directOrbits);
        var sanToStart = toStart(san.directOrbits[0].directOrbits);
        var steps = 0;

        console.info('you2start');
        youToStart.forEach(o => console.info(o.name));

        console.info('san2start');
        sanToStart.forEach(o => console.info(o.name));

        youToStart.forEach(routePoint => {
            steps++;
            var sanToStartPointIndex = sanToStart.indexOf(routePoint);
            if (sanToStartPointIndex > -1) {
                var youToSan = steps;
                youToSan += sanToStartPointIndex + 1;
                if (youToSan < answerB || answerB === 0) {
                    answerB = youToSan;
                }
            }
        });
        return result;
    };

    var toStart = function (objects) {
        var result = [];
        objects.forEach(function (object) {
            var inDirectOrbitObject = object.directOrbits[0];
            result = [object, inDirectOrbitObject];
            while (inDirectOrbitObject !== undefined && inDirectOrbitObject.directOrbits.length > 0) {
                inDirectOrbitObject = inDirectOrbitObject.directOrbits[0];
                if (inDirectOrbitObject !== undefined) {
                    result.push(inDirectOrbitObject);
                } else {
                    return result;
                }
            }
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



