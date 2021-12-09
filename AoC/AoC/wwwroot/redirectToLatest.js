var req = new XMLHttpRequest();
var year = new Date().getFullYear();
req.addEventListener('readystatechange', function () {
    var xhr = this;
    if (xhr.readyState === 4 && xhr.status === 200) {
        var resp = xhr.responseText;
        var regex = /(\.\/\d+\/)/gm;
        var matches = resp.match(regex);
        var r = regex.exec(resp);
        var lastMatch = matches[matches.length - 1];
        window.location.href = '/' + year + '/' + lastMatch;
    }
});
req.open('GET', '/' + year + '/');
req.send();
//# sourceMappingURL=redirectToLatest.js.map