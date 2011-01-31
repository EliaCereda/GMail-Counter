//
// Copyright (c) 2011 Frank Kohlhepp
// License: MIT-license
// https://github.com/frankkohlhepp/exttracker
//
(function () {
    // =========
    // = store =
    // =========
    function Store(name) {
        var storePrototype = {
            "save": function () {
                var stringifiedObj = JSON.stringify(this);
                localStorage.setItem(name, stringifiedObj);
                
                if (localStorage.getItem(name) !== stringifiedObj) {
                    return false;
                } else {
                    return this;
                }
            },
            
            "clean": function () {
                localStorage.removeItem(name);
            }
        };
        
        var store = (localStorage.getItem(name)) ? JSON.parse(localStorage.getItem(name)) : {};
        store.__proto__ = storePrototype;
        return store;
    }
    
    // ===========
    // = version =
    // ===========
    function zero(count) {
        var str = "";
        for (var i = 0; i < count; i++) {
            str += "0";
        }
        
        return str;
    }
    
    function v(str) {
        if ((typeof str) !== "string") {
            str = "";
        }
        var match = str.match(/([0-9]+).(a|b).([0-9]+)$/i);
        if (match) {
            str = str.replace(/([0-9]+).(a|b).([0-9]+)$/i, ((match[2] === "a") ? -1e+10 : -2e+10) + Number(match[1]) - Number(match[3]));
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
    }
    
    // ========
    // = main =
    // ========
    window._gaq = [];
    window.ExtTracker = function (webPropertyId, version) {
        // =====================
        // = private variables =
        // =====================
        var store = new Store("extTracker");
        
        // ===============
        // = constructor =
        // ===============
        _gaq.push(["_setAccount", webPropertyId]);
        _gaq.push(["_trackPageview"]);
        _gaq.push(["_setCustomVar", 1, "Version", version]);
        
        // installation
        if (!store.installed) {
            _gaq.push(["_trackEvent", "installation", version]);
            
            store.installed = true;
            store.version = version;
            store.save();
        }
        
        // upgrade
        else if (v(version) > v(store.version)) {
            _gaq.push(["_trackEvent", "upgrade", "from: " + store.version + " to: " + version]);
            
            store.version = version;
            store.save();
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
        this.logEvent = function (name, action) {
            _gaq.push(["_trackEvent", name, action]);
        };
    };
})();