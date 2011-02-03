/*
--------------------------------
	ExtNews.js
	Author: Elia Cereda
	Copyright (c) 2011
	
	Safari extension news system
--------------------------------
	Version History:
		* 1.0 - Initial release
		
--------------------------------

This file is licensed under the MIT license. Copyright (c) 2010-2011 Elia Cereda.
*/
(function() {
	var i;
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
        var match = str.match(/([0-9]+)\.(a|b)\.([0-9]+)$/i);
        if (match) {
            str = str.replace(/([0-9]+)\.(a|b)\.([0-9]+)$/i, ((match[2] === "a") ? -1e+10 : -2e+10) + Number(match[1]) - Number(match[3]));
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
	
	var url = "http://elix14.altervista.org/api/ExtNews/";
	
	window.ExtNews = function (info) {
		if (info) {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						i = info;
						_parse(xhr.responseText);
						_set("lastVersion", i.version);
					} else {
						console.error("News loading failed");
					}
				}
			};
			xhr.open("GET", url, true);
			xhr.send();
			return true;
		} else {
			console.error("ExtNews require a valid info object. You provided %o", info);
			return false;
		}
	};
	
	function _parse (a) {
		JSON.parse(a).forEach(function(b) {
			if(_target(b.targets) && _active(b)) {
				_action(b.actions);
			}
		});
	}
	
	function _target (a) {
		var r;
		a.forEach(function( b ) {
			if ((targetsConditions[b.type] || function(){})(b.value)) r = true;
		});
		return r || false;
	}
	function _active (a) {
		return ((activesConditions[a.actives] || function(){})(a));
	}
	function _action (a) {
		a.forEach(function( b ) {
			(actionsSet[b.type] || function(){})(b.value); 
		});
	}
	
	function _get (key) { return (JSON.parse(safari.extension.settings["ExtNews"])["a-"+key]); }
	function _set (key, value) { 
		var a = JSON.parse(safari.extension.settings["ExtNews"]);
		a["a-"+key] = value || true;
		return !!(safari.extension.settings["ExtNews"] = JSON.stringify(a));
	}
	
	var targetsConditions = {
		"everyone": function() { return true; },
		"version": function(value) { return (v(i.version) === v(value)); },
		"releaseType": function(value) { return (i.releaseType === value); },
		"newer": function(value) { return (v(value) < v(i.version)); },
		"older": function(value) { return (v(value) > v(i.version)); }
	};
	
	var activesConditions = {
		"everytime": function() { return true; },
		"onUpdates": function() { return (v(i.version) !== v(_get("lastVersion"))); },
		"once": function(e) { if(!_get(e.id)) return _set(e.id); }
	};
	
	var actionsSet = {
		"openURL": function(a) { safari.application.openBrowserWindow().activeTab.url = a; },
		"openAlert": function(a) { alert(a); }
	};
})();