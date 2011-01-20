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
	var v = v || function (v) { return v; }	//Provide JS-standard comparison if version by Frank Kohlhepp isn't available
	
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
		"newer": function(value) { return (v(value) > v(i.version)); },
		"older": function(value) { return (v(value) < v(i.version)); }
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