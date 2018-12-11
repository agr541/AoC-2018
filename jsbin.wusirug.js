// noprotect
var module = function() {
  var getInput = function(inputSelector) {
    var input = document.querySelector(inputSelector);
    return input.value;
  };
  
  var setOutput = function(outputSelector, outputValue) {
    var output = document.querySelector(outputSelector);
    output.value = outputValue;
  };
  
  var processLine = function(line) {
    var result = 0;
    var lineContents = line.trim();
    if(lineContents.length > 0) {
      var operator = lineContents.charAt(0);
      switch(operator) {
        case '+':
          result = parseInt(lineContents.substring(1))
          break;
        case '-':
          result = parseInt(lineContents);
          break;
      }
    }
    return result;
  };
  
  var processLines = function(lines) {
    var operations = [];
    for(var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var operation = processLine(line);
      if(operation !== 0) {
          operations.push(operation);
      }
    }
    return findFirstDuplicate(operations, [0], 0);
  };
      
  var findFirstDuplicate = function(operations, results, result) {
    var duplicateFound = false;
    while(duplicateFound===false) {
      for(var i = 0; i < operations.length; i++) {
        var operation = operations[i];
        result += operation;
        var indexOfResult = results.indexOf(result);
        if(indexOfResult > -1)
        {
          duplicateFound=true;
          break;
        }
        results.push(result);
      }
    }
    return result;
  };
  
  var pocessInput = function(input) {
    var lines = input.split('\n');
    return processLines(lines);
  };
  
  var initialize = function(options) {
    try {
    var input = getInput(options.inputSelector);
    var output = pocessInput(input);
    setOutput(options.outputSelector, output);
    }
    catch(e) {
      console.info('error occurred ' + e)
    }
  };
  
  return { 
    start: initialize
  };
};

var module = new module();
module.start({
  inputSelector:'textarea',
  outputSelector:'input'
});