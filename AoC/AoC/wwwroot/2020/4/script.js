// noprotect
window.module = function () {
    var answerA = 0;
    var answerB = 0;
    //byr(Birth Year)
    //iyr(Issue Year)
    //eyr(Expiration Year)
    //hgt(Height)
    //hcl(Hair Color)
    //ecl(Eye Color)
    //pid(Passport ID)
    //cid(Country ID)
    var fieldDefinitions = [
        { name: 'byr', optional: false },
        { name: 'iyr', optional: false },
        { name: 'eyr', optional: false },
        { name: 'hgt', optional: false },
        { name: 'hcl', optional: false },
        { name: 'ecl', optional: false },
        { name: 'pid', optional: false },
        { name: 'cid', optional: true }
    ];
    var idDocuments = [];
    var idDocument = {
        fields: [
            {
                field: {
                    name: '',
                    optional: false
                },
                value: null,
                isValid: false
            }
        ],
        isValid: true
    };
    var processLine = function (line) {
        var result = [];
        var lineContents = line.trim();
        if (lineContents.length > 0) {
            var fieldNameValues = line.split(' ');
            for (var fieldNameValue of fieldNameValues) {
                var fieldNameValueSplitted = fieldNameValue.split(':', 2);
                var fieldDefinition = fieldDefinitions.find(function (fieldDefinition) {
                    return fieldDefinition.name === fieldNameValueSplitted[0];
                });
                var field = {
                    field: fieldDefinition,
                    value: fieldNameValueSplitted[1],
                    isValid: fieldDefinition.optional
                };
                result.push(field);
            }
        }
        return result;
    };
    var getRequiredFieldDefinitions = function () {
        return fieldDefinitions.filter(function (fieldDefinition) {
            return fieldDefinition.optional === false;
        });
    };
    var requiredFieldDefinitions = getRequiredFieldDefinitions();
    var validateNumberBetween = function (fieldValue, min, max) {
        var val = parseInt(fieldValue);
        var result = val >= min && val <= max;
        return result;
    };
    var validateLength = function (fieldValue, minCm, maxCm, minIn, maxIn) {
        var extraSpaced = '  ' + fieldValue;
        var unit = extraSpaced.substr(extraSpaced.length - 2);
        var result = false;
        switch (unit) {
            case 'cm':
                result = validateNumberBetween(fieldValue, 150, 193);
                break;
            case 'in':
                result = validateNumberBetween(fieldValue, 59, 76);
                break;
        }
        return result;
    };
    var colorRegex = /^#{1}[0123456789abcdefg]{6}$/;
    var validateColor = function (fieldValue) {
        var result = colorRegex.test(fieldValue);
        return result;
    };
    var validateEnum = function (fieldValue, validItems) {
        var result = validItems.includes(fieldValue);
        return result;
    };
    var validateNumberLength = function (fieldValue, length) {
        var re = new RegExp('^\\d{' + length + '}$');
        var result = re.test(fieldValue);
        return result;
    };
    //byr(Birth Year) - four digits; at least 1920 and at most 2002.
    //iyr(Issue Year) - four digits; at least 2010 and at most 2020.
    //eyr(Expiration Year) - four digits; at least 2020 and at most 2020.
    //hgt(Height) - a number followed by either cm or in:
    //If cm, the number must be at least 150 and at most 193.
    //If in, the number must be at least 59 and at most 76.
    //hcl(Hair Color) - a # followed by exactly six characters 0 - 9 or a - f.
    //ecl(Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
    //pid(Passport ID) - a nine - digit number, including leading zeroes.
    //cid(Country ID) - ignored, missing or not.
    var validateField = function (documentField) {
        var result = false;
        switch (documentField.field.name) {
            case 'byr':
                result = validateNumberBetween(documentField.value, 1920, 2002);
                documentField.field.isValid = result;
                break;
            case 'iyr':
                result = validateNumberBetween(documentField.value, 2010, 2020);
                documentField.field.isValid = result;
                break;
            case 'eyr':
                result = validateNumberBetween(documentField.value, 2020, 2030);
                documentField.field.isValid = result;
                break;
            case 'hgt':
                result = validateLength(documentField.value, 150, 193, 59, 76);
                documentField.field.isValid = result;
                break;
            case 'hcl':
                result = validateColor(documentField.value);
                documentField.field.isValid = result;
                break;
            case 'ecl':
                var eyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
                result = validateEnum(documentField.value, eyeColors);
                documentField.field.isValid = result;
                break;
            case 'pid':
                result = validateNumberLength(documentField.value, 9);
                documentField.field.isValid = result;
                break;
            case 'cid':
                result = true;
                documentField.field.isValid = result;
                break;
        }
        return result;
    };
    var isAllFieldsValid = function (idDocument) {
        return idDocument.fields.every(validateField);
    };
    var validateDocument = function (idDocument) {
        idDocument.isValid = requiredFieldDefinitions.every(function (requiredFieldDefinition) {
            var idDocumentFields = idDocument.fields.map(function (idDocumentField) {
                return idDocumentField.field;
            });
            return idDocumentFields.includes(requiredFieldDefinition);
        }) && isAllFieldsValid(idDocument);
        return idDocument;
    };
    var getValidDocuments = function () {
        var result = idDocuments.map(validateDocument)
            .filter(function (document) {
            return document.isValid === true;
        });
        return result;
    };
    var runTests = function () {
        var testFields = [
            {
                field: {
                    name: 'byr',
                },
                value: '2002',
                shouldBeValid: true,
            },
            {
                field: {
                    name: 'byr',
                },
                value: '2003',
                shouldBeValid: false,
            },
            {
                field: {
                    name: 'hgt',
                },
                value: '60in',
                shouldBeValid: true,
            },
            {
                field: {
                    name: 'hgt',
                },
                value: '190cm',
                shouldBeValid: true,
            },
            {
                field: {
                    name: 'hgt',
                },
                value: '190in',
                shouldBeValid: false,
            },
            {
                field: {
                    name: 'hgt',
                },
                value: '190',
                shouldBeValid: false,
            },
            {
                field: {
                    name: 'hcl',
                },
                value: '#123abc',
                shouldBeValid: true,
            },
            {
                field: {
                    name: 'hcl',
                },
                value: ' #123abz',
                shouldBeValid: false,
            },
            {
                field: {
                    name: 'hcl',
                },
                value: '123abc',
                shouldBeValid: false,
            },
            {
                field: {
                    name: 'ecl',
                },
                value: 'brn',
                shouldBeValid: true,
            },
            {
                field: {
                    name: 'ecl',
                },
                value: 'wat',
                shouldBeValid: false,
            },
            {
                field: {
                    name: 'pid',
                },
                value: '000000001',
                shouldBeValid: true,
            },
            {
                field: {
                    name: 'pid',
                },
                value: '0123456789',
                shouldBeValid: false,
            }
        ];
        testFields.forEach(function (tf) {
            if (tf.shouldBeValid !== validateField(tf)) {
                debugger;
            }
        });
    };
    var processLinesA = function (lines) {
        runTests();
        var result = 0;
        idDocuments = [];
        var currentDocument = null;
        lines.forEach(function (line) {
            if (line === '') {
                idDocuments.push(Object.assign({}, currentDocument));
                currentDocument = null;
            }
            else {
                if (currentDocument === null) {
                    currentDocument = {
                        fields: [],
                        isValid: false
                    };
                }
                var fields = processLine(line);
                currentDocument.fields.push(...fields.map(function (f) { return f; }));
            }
        });
        if (currentDocument !== null) {
            idDocuments.push(Object.assign({}, currentDocument));
        }
        var validDocuments = getValidDocuments();
        return result = validDocuments.length;
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
        var lines = input.split('\r\n');
        return processLinesA(lines);
    };
    var pocessInputB = function (input) {
        var lines = input.split('\r\n');
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
            var output = pocessInputA(input);
            answerB = output;
            setOutput(options.outputSelector, answerB);
        });
    };
    return {
        runA: initializeA,
        runB: initializeB
    };
};
//# sourceMappingURL=script.js.map