// noprotect
window.module = function () {
    var answerA = 0;
    var answerB = 0;
    var tile = {
        widths: [],
        treeCoords: [],
        openSpaceCoords: []
    };
    var speed = { x: 1, y: 1 };
    var position = { x: 1, y: 1 };
    var trail = [];
    var canvas;
    var ctx;
    var drawSize = 10;

    var processLine = function (line, index) {
        var y = index + 1;
        var result = 0;
        var lineContents = line.trim();
        tile.treeCoords[y] = [];
        tile.openSpaceCoords[y] = [];
        if (lineContents.length > 0) {
            tile.widths[y] = lineContents.length;
            for (var i = 0; i < lineContents.length; i++) {
                var char = lineContents.charAt(i);
                if (char === '#') {
                    tile.treeCoords[y].push(i + 1);
                } else if (char === '.') {
                    tile.openSpaceCoords[y].push(i + 1);
                }
            }
        }
        return result;
    };

    var processLinesA = function (lines) {
        var height = lines.length + 1;
        tile.treeCoords = new Array(height);
        tile.openSpaceCoords = new Array(height);
        tile.widths = new Array(height);
        var result = 0;
        lines.forEach(function (line, index) {
            processLine(line, index);
        });

        createCanvas();

        while (position.y <= lines.length) {

            var treeRow = tile.treeCoords[position.y];
            var openSpaceRow = tile.openSpaceCoords[position.y];
            var width = tile.widths[position.y];

            if (position.x * drawSize > canvas.width) {
                var newMapX = 1 + Math.floor(position.x / width) * width;
                drawMap(lines, newMapX);
            }

            var lookupX = (position.x % width);
            if (lookupX === 0) {
                lookupX = width;
            }
            if (typeof (openSpaceRow) != 'undefined' &&
                openSpaceRow.indexOf(lookupX) != -1) {
                trail.push('O');
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.fillRect(position.x * drawSize, position.y * drawSize, drawSize, drawSize);
            } else if (typeof (treeRow) != 'undefined' &&
                treeRow.indexOf(lookupX) != -1) {
                trail.push('X');
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.fillRect(position.x * drawSize, position.y * drawSize, drawSize, drawSize);
                answerA++;
                result++;
            } else {
                debugger;
            }
            position.x += speed.x;
            position.y += speed.y;
        }

        return result;
    };


    var drawMap = function (lines, startX) {
        var newHeight = (lines.length + 1) * drawSize;
        if (canvas.height < newHeight ) {
            canvas.height = newHeight;
        }

        for (var y = 1; y <= lines.length; y++) {
            var treeRow = tile.treeCoords[y];
            var openSpaceRow = tile.openSpaceCoords[y];
            var width = tile.widths[y];

            for (var x = startX; x < startX + tile.widths[y]; x++) {
                var newWidth = (startX + width) * drawSize;
                if (canvas.width < newWidth) {
                    var imageData = null;
                    if (canvas.width > 0 && canvas.height > 0) {
                        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    }


                    canvas.width = newWidth;

                    if (imageData != null) {
                        ctx.putImageData(imageData, 0, 0);
                    }
                }
                var lookupX = 1 + x - startX;
                if (typeof (treeRow) != 'undefined' &&
                    treeRow.indexOf(lookupX) != -1) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
                    ctx.fillRect(x * drawSize, y * drawSize, drawSize, drawSize);

                }
                if (typeof (openSpaceRow) != 'undefined' &&
                    openSpaceRow.indexOf(lookupX) != -1) {
                    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
                    ctx.fillRect(x * drawSize, y * drawSize, drawSize, drawSize);

                }
            }
        }
    };

    var createCanvas = function () {
       
        canvas = document.createElement('canvas');
        canvas.id = "canvas";
        canvas.style.border = "1px solid";
        canvas.style.display = "block";

        var body = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);
        ctx = canvas.getContext("2d");
       
        canvas.width = 0;
        canvas.height = 0;

    };

    var processLinesB = function (lines) {
        var result = 0;
        lines.forEach(function (line, index) {
            processLine(line, index);
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
        speed = { x: 3, y: 1 };
        position = { x: 1, y: 1 };
        var input = getInputFromUrl(options.inputUrl, function (input) {
            var output = pocessInputA(input);
            setOutput(options.outputSelector, answerA);
        });
    };

    //1, down 1.
    //Right 3, down 1.(This is the slope you already checked.)
    //Right 5, down 1.
    //Right 7, down 1.
    //Right 1, down 2
    var initializeB = function (options) {
        answerB = 1;
        speeds = [
            { x: 1, y: 1 },
            { x: 3, y: 1 },
            { x: 5, y: 1 },
            { x: 7, y: 1 },
            { x: 1, y: 2 }
            ];
        position = { x: 1, y: 1 };
        var input = getInputFromUrl(options.inputUrl, function (input) {
            for (currentSpeed of speeds) {
                speed = currentSpeed;
                var output = pocessInputA(input);
                position = { x: 1, y: 1 };
                answerB *= output;
                setOutput(options.outputSelector, answerB);
            }
        });
    };

    return {
        runA: initializeA,
        runB: initializeB
    };
};




