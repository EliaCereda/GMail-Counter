//
// Copyright (c) 2011 Frank Kohlhepp
// License: MIT-license
// https://github.com/frankkohlhepp/exttracker
//
(function () {
    // ===========
    // = version =
    // ===========
    var v;
    (function () {
        function zero(count) {
            var str = "";
            for (var i = 0; i < count; i++) {
                str += "0";
            }
            
            return str;
        }
        
        v = function (str) {
            var match = str.match(/([0-9]+)(a|b)([0-9]+)$/i);
            if (match) {
                str = str.replace(/([0-9]+)(a|b)([0-9]+)$/i, ((match[2] === "a") ? -1e+10 : -2e+10) + Number(match[1]) - Number(match[3]));
            }
            
            var parts = str.split(".");
            str = "";
            for (var i = 0; i < parts.length; i++) {
                if (parts[i] < 0) {
                    str += "-";
                }
                
                var part = parts[i].replace(/^-/i, "");
                if (part.length < 15) {
                    str += zero(15 - part.length);
                }
                str += part + ".";
            }
            
            return str.substr(0, str.length - 1);
        };
    })();
    
    // ========
    // = main =
    // ========
    window._gaq = [];
    window.ExtTracker = function (webPropertyID, version) {
        // =====================
        // = private variables =
        // =====================
        var userID = localStorage.getItem("extTracker.userID");
        
        // ===============
        // = constructor =
        // ===============
        if (!userID) {
            userID = (+(new Date)).toString(36);
            localStorage.setItem("extTracker.userID", userID);
        }
        
        _gaq.push(["_setAccount", webPropertyID]);
        _gaq.push(["_trackPageview", "user_" + userID]);
        _gaq.push(["_setCustomVar", 1, "Version", version]);
        
        // installation
        if (!localStorage.getItem("extTracker.installed")) {
            _gaq.push(["_trackEvent", "installation", version]);
            
            localStorage.setItem("extTracker.installed", true);
            localStorage.setItem("extTracker.version", version);
        }
        
        // upgrade
        else if (v(version) > v(localStorage.getItem("extTracker.version"))) {
            _gaq.push(["_trackEvent", "upgrade", "from: " + localStorage.getItem("extTracker.version") + " to: " + version]);
            
            localStorage.setItem("extTracker.version", version);
        }
        
        // run analytics
        (function () {
            var ga = document.createElement("script");
            ga.async = true;
            ga.src = "https://ssl.google-analytics.com/ga.js";
            
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(ga, s);
        })();
        
        // ======================
        // = privileged methods =
        // ======================
        this.getUserID = function () {
            return userID;
        };
    };
    
    // ==================
    // = public methods =
    // ==================
    ExtTracker.prototype.logEvent = function (name, action) {
        _gaq.push(["_trackEvent", name, action]);
    };
})();
