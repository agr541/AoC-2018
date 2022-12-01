var req = new XMLHttpRequest();
var year = new Date().getFullYear();
var handleResponse = function () {
    var xhr = this;
    if (xhr.readyState === 4 && xhr.status === 200) {
        var resp = xhr.responseText;
        var regex = /(\.\/\d+\/)/gm;
        var matches = resp.match(regex);
        var r = regex.exec(resp);
        if (matches !== null) {
            var lastMatch = matches[matches.length - 1];
            window.location.href = '/' + year + '/' + lastMatch;
        }
    } else if (xhr.readyState === 2 && xhr.status === 404) {

        req = new XMLHttpRequest();
        year = new Date().getFullYear() - 1;
        req.addEventListener('readystatechange', handleResponse);
        req.open('GET', '/' + year + '/');
        req.send();
    };
};

req.addEventListener('readystatechange', handleResponse);
req.open('GET', '/' + year + '/');
req.send();