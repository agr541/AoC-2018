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
        var result = 0;
        var lineContents = line.trim();
        if (lineContents.length > 0) {
           
        }
        return result;
    };

    var setXY = function (data, result) {
        var arr = data.split(',');
        result.x = parseInt(arr[0])+1;
        result.y = parseInt(arr[1])+1;
        return result;
    };

    var setWH = function (data, result) {
        var arr = data.split('x');
        result.w = parseInt(arr[0]);
        result.h = parseInt(arr[1]);
        return result;
    }

    var parseRect = function (line) {
        var result = {
            id: '',
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        var lineParts = line.split(' @ ');
        var rectInfo = lineParts[1].trim();
        var rectInfoParts = rectInfo.split(':');
        var xyPart = rectInfoParts[0];
        var whPart = rectInfoParts[1].trim();
        result = setXY(xyPart, result);
        result = setWH(whPart, result);
        result.id = lineParts[0];
        return result;
    };

    var createCanvas = function (w, h, v) {
        if (typeof v === 'undefined') {
            v = 0;
        };

        var result = [];
        var rows = new Array();
        rows.length = h;
        for (var r = 0; r < h; r++) {
            var cols = new Array();
            cols.length = w;
            rows[r] = cols;
        }
        result = rows;
        var size = (w * h);
        for (var i = 0; i < size; i++) {
            var y = Math.floor(i / w);
            var x = i - y * w;
            var row = result[y];
            row[x] = v;
        }
        return result;
    };

    var drawRect = function (rect, canvas) {
        var right = rect.x + rect.w;
        var bottom = rect.y + rect.h;
        for (var y = rect.y; y < bottom; y++) {
            var row = canvas[y];
            for (var x = rect.x; x < right; x++) {
                row[x]++;
            }
        }
        return canvas;
    };

    var getOverlap = function (rect, otherRect) {
        var result = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        var cols = Math.max(rect.x + rect.w, otherRect.x+otherRect.w);
        var rows = Math.max(rect.y + rect.h, otherRect.y + otherRect.h);
        var canvas = createCanvas(cols, rows);
        

        drawRect(rect, canvas);
        drawRect(otherRect, canvas);

        for (var i = 0; i < (rows * cols); i++) {
            var y = Math.floor(i / cols);
            var x = i - y * cols;
            if (canvas[y][x] > 1) {
                if (result.x < x) result.x = x;
                if (result.y < y) result.y = y;
                var w = result.x - x;
                var w = result.y - y;
                if (result.w < w) result.w = w;
                if (result.h < h) result.h = h;
            }
        }
        return result;
    };

    var processLinesA = function (lines) {
        var result = 0;
        var rects = [];
        var maxW = 0;
        var maxH = 0;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var rect = parseRect(line);
            rects.push(rect);
            var r = rect.x + rect.w;
            if (r > maxW) {
                maxW = r;
            }
            var b = rect.y + rect.h;
            if (b > maxH) {
                maxH = b;
            }
        }
        var w = maxW;
        var h = maxH;
        var canvas = createCanvas(maxW, maxH);
        
        for (var j = 0; j < rects.length; j++) {
            var rect = rects[j];
            drawRect(rect, canvas);
        }
        var c = document.createElement('canvas');
        c.width = maxW+1;
        c.height = maxH+1;
        document.body.appendChild(c);
        var ctx = c.getContext("2d");
        var canvasData = ctx.getImageData(0, 0, maxW, maxH);
        

        for (var i = 0; i < canvas.length; i++) {
            
            var row = canvas[i];
            for (var j = 0; j < row.length; j++) {
                if (row[j] == 0) {
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(i + 1, j + 1, 1, 1);
                }
                if (row[j] > 0) {
                    ctx.fillStyle = "#000000";
                    ctx.fillRect(i+1, j+1, 1, 1);
                }
                if (row[j] > 1) {
                    ctx.fillStyle = "#FF0000";
                    ctx.fillRect(i + 1, j + 1, 1, 1);
                    result++;
                }
            }
        }
       
        console.info(canvas);
        return result;
    };
    var getNotMatchingCharactersPositions = function (line, otherLine, max) {
        var result = [];
        for (var i = 0; i < line.length; i++) {
            var lineCharCode = line.charCodeAt(i);
            var otherlineCharCode = otherLine.charCodeAt(i);
            if (lineCharCode !== otherlineCharCode) {
                result.push(i);
                if (result.length > max) {
                    result = [];
                    break;
                }
            }
        }
        return result;
    };

    var getRectSum = function (rect, canvas) {
        var result = 0;
        var right = rect.x + rect.w;
        var bottom = rect.y + rect.h;
        for (var y = rect.y; y < bottom; y++) {
            var row = canvas[y];
            for (var x = rect.x; x < right; x++) {
                result+=row[x];
            }
        }
        return result;
    }
    var processLinesB = function (lines) {
        var result = '';
        var rects = [];
        var maxW = 0;
        var maxH = 0;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var rect = parseRect(line);
            rects.push(rect);
            var r = rect.x + rect.w;
            if (r > maxW) {
                maxW = r;
            }
            var b = rect.y + rect.h;
            if (b > maxH) {
                maxH = b;
            }
        }
        var w = maxW;
        var h = maxH;
        var canvas = createCanvas(maxW, maxH, -1);
        for (var j = 0; j < rects.length; j++) {
            var r = rects[j];
            drawRect(r, canvas);
        }

        for (var j = 0; j < rects.length; j++) {
            var r = rects[j];
            var rs = getRectSum(r,canvas);
            if (rs === 0) {
                result = r.id;
                //break;
            }
        }

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



