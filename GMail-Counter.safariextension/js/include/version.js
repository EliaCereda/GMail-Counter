//
// Copyright (c) 2011 Frank Kohlhepp
//
(function () {
    function zero(count) {
        var str = "";
        for (var i = 0; i < count; i++) {
            str += "0";
        }
        
        return str;
    }
    
    window.v = function (str) {
        var match = str.match(/([0-9]+)\.(a|b)\.([0-9]+)$/i);
        if (match) {
            str = str.replace(/([0-9]+)\.(a|b)\.([0-9]+)$/i, ((match[2] === "a") ? -1e+6 : -1e+12) + Number(match[1]) - Number(match[3]));
        }
        
        var parts = str.split(".");
        str = "";
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] < 0) {
                str += "-";
            }
            
            var part = parts[i].replace(/^-/i, "");
            if (part.length < 18) {
                str += zero(18 - part.length);
            }
            str += part + ".";
        }
        
        return str.substr(0, str.length - 1);
    };
})();
