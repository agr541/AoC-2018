window.module = function () {
    

    var parseGuardStatus = function (guardStatusLine) {
        var parseDateTime = function (trimmedGuardStatusLine) {
            var year = parseInt(trimmedGuardStatusLine.substr(1, 4));
            var month = parseInt(trimmedGuardStatusLine.substr(6, 2));
            var day = parseInt(trimmedGuardStatusLine.substr(9, 2));
            var hour = parseInt(trimmedGuardStatusLine.substr(12, 2));
            var minute = parseInt(trimmedGuardStatusLine.substr(15, 2));
            return new Date(year, month, day, hour, minute);
        };

        var parseGuardId = function (trimmedGuardStatusLine) {
            var result = 0;
            var guardIndex = trimmedGuardStatusLine.indexOf('Guard #');
            if (guardIndex > -1) {
                guardNumberStartIndex = guardIndex + 7;
                guardNumberEndIndex = trimmedGuardStatusLine.indexOf(' ', guardNumberStartIndex);
                result = parseInt(trimmedGuardStatusLine.substring(guardNumberStartIndex, guardNumberEndIndex));
            }
            return result;
        };

        var parseStatus = function (guardId, trimmedGuardStatusLine) {
            var result = '';
            var statusIndex = 19;
            if (guardId !== 0) {
                var guardIdLength = Math.log(guardId) * Math.LOG10E + 1 | 0;
                statusIndex += 8 + guardIdLength;
            }
            result = trimmedGuardStatusLine.substring(statusIndex);
            return result;
        };

        var result = null;
        var trimmedGuardStatusLine = guardStatusLine.trim();
        if (trimmedGuardStatusLine.length > 0) {
            var dateTime = parseDateTime(trimmedGuardStatusLine);
            var guardId = parseGuardId(trimmedGuardStatusLine);
            var status = parseStatus(guardId, trimmedGuardStatusLine);
            result = {
                dateTime: dateTime,
                fallsAsleep: status === 'falls asleep',
                wakesUp: status === 'wakes up',
                beginsShift: status === 'begins shift',
                guardId: guardId
            };
        }
        return result;
    };

    var setGuardIds = function (guardStatusArray) {
        var sortByDateTime = function (guardStatus, otherGuardStatus) {
            return guardStatus.dateTime - otherGuardStatus.dateTime;
        };
        guardStatusArray.sort(sortByDateTime);
        var currentGuardId = undefined;
        guardStatusArray.forEach(function (guardStatus) {
            if (typeof currentGuardId === 'undefined' && guardStatus.guardId > 0) {
                currentGuardId = guardStatus.guardId;
            } else if (guardStatus.guardId === 0) {
                guardStatus = currentGuardId;
            }
        });
    };

    var findMostSleepingGuard = function(guardStatusArray) {
        var findMostSleepingGuard = function (guards) {
            var result = null;
            function bySleepTimeDesc(guard, otherGuard) {
                return otherGuard.sleepTime - guard.sleepTime;
            };

            var tmpGuards = guards.copyWithin(0, 0);
            tmpGuards = tmpGuards.sort(bySleepTimeDesc);
            result = tmpGuards[0];
            return result;
        };

        var result = 0;
        var guards = [];
        var currentGuard = null;
        guardStatusArray.forEach(function (guardStatus) {
            if (guardStatus.beginsShift) {
                if (typeof guards[guardStatus.guardId] === 'undefined') {
                    guards[guardStatus.guardId] = {
                        guardId: guardStatus.guardId,
                        sleepTime: 0,
                        fallsAsleepDateTimes: [],
                        wakesUpDateTimes: []
                    };
                }
                currentGuard = guards[guardStatus.guardId];
            }
            if (guardStatus.fallsAsleep) {
                currentGuard.sleepStartTime = guardStatus.dateTime;
            } else if (guardStatus.wakesUp) {
                guardSleepTime = guardStatus.dateTime - currentGuard.sleepStartTime;
                currentGuard.sleepTime += guardSleepTime.valueOf();
                currentGuard.fallsAsleepDateTimes.push(currentGuard.sleepStartTime);
                currentGuard.wakesUpDateTimes.push(guardStatus.dateTime);
            }
        });
        result = findMostSleepingGuard(guards);
        return result;
    };
    var minute = new Date(0, 0, 0, 0, 1).valueOf();
    var findSleepsMostOnMinute = function (guard) {
        function createSleepingMinutes() {
            var result = [];
            for (var minute = 0; minute < 60; minute++) {
                result[minute] = 0;
            }
            return result;
        }
        var sleepingMinutes = createSleepingMinutes();
        guard.fallsAsleepDateTimes.forEach(function (fallsAsleepDateTime) {
            var wakeUpTime = guard.wakesUpDateTimes.find(function (wakesUpDateTime) {
                return wakesUpDateTime > fallsAsleepDateTime;
            });
            
            var currentSleepingTime = fallsAsleepDateTime;
            while (currentSleepingTime < wakeUpTime) {
                var minutes = currentSleepingTime.getMinutes();
                sleepingMinutes[minutes]++;
                currentSleepingTime.setMinutes(currentSleepingTime.getMinutes() + 1);
            }
        });
        var result = 0;
        var highestSleepingMinutesValue = Math.max(...sleepingMinutes.values());
        var byValueEqualsHighestSleepingMinutes = function (key) {
            return sleepingMinutes[key] === highestSleepingMinutesValue;
        };
        var keys = new Array(...sleepingMinutes.keys());
        keys.some(function (key) {
            if (sleepingMinutes[key] === highestSleepingMinutesValue) {
                result = key;
                return true;
            }
        });
        return result;
    };

    var findMostSleptMinuteGuard = function (guards) {
       
    };
    var processLinesA = function (lines) {
        var guardStatusArray = [];
        lines.forEach(function (line) {
            var guardStatus = parseGuardStatus(line);
            guardStatusArray.push(guardStatus);
        });
        setGuardIds(guardStatusArray);
        mostSleepingGuard = findMostSleepingGuard(guardStatusArray);
        sleepsMostOnMinute = findSleepsMostOnMinute(mostSleepingGuard);
        result = mostSleepingGuard.guardId * sleepsMostOnMinute;
        return result;
    };
    
    var processLinesB = function (lines) {
        var guardStatusArray = [];
        lines.forEach(function (line) {
            var guardStatus = parseGuardStatus(line);
            guardStatusArray.push(guardStatus);
        });
        setGuardIds(guardStatusArray);
        mostSleepingGuard = findMostSleepingGuard(guardStatusArray);
        sleepsMostOnMinute = findSleepsMostOnMinute(mostSleepingGuard);
        result = mostSleepingGuard.guardId * sleepsMostOnMinute;
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



