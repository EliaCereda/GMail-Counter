var ExtNews = {

	load: function( url, callback ) {
		callback = ((typeof callback) === "function") ? callback : ExtNews.parse;
		
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				callback(JSON.parse(xhr.responseText));
			}
		};
		
		xhr.open("GET", url, true);
		xhr.send();
	},
	
	parse: function( data ) {
		data.forEach(function(element) {
			if(ExtNews.AmITargeted(element.targets) && ExtNews.ToBeShown(element)) {
				ExtNews.executeAction(element.actions);
			}
		});
		
	},
	
	
	//PRIVATE METHODS
	
	AmITargeted: function( targetsArray ) {
		var result = false;
		targetsArray.forEach(function( t ) {
			if((typeof t) === "object" && (typeof targetsConditions[t.type]) === "function") {
				if(targetsConditions[t.type](t.value)) {
					result = true;
				}
			}
		});
		
		return result;
	},
	
	ToBeShown: function( element ) {
		var t = element.toBeShown;
		
		if ((typeof showConditions[t]) === "function" ) {
			if ( showConditions[t](element) ) {
				return true;
			} else {
				return false;
			}
		}
	},
	
	executeAction: function( actionsArray ) {
		actionsArray.forEach(function( a ) {
			if((typeof a) === "object" && (typeof actions[a.type]) === "function") {
				actions[a.type](a.value);
			}
		});
	}
};

var targetsConditions = {
	"everyone": function() { return true; },
	
	"version": function(value) {
		if (GMailCounter.version === value) {
			return true;
		}
	},
	
	"releaseType": function(value) {
		if (GMailCounter.releaseType === value) {
			return true;
		}
	},
	
	"newer": function(value) {
		//TODO -- I need version object from ExtTracker
	},
	
	"older": function(value) {
		//TODO -- I need version object from ExtTracker
	}
};

var showConditions = {
	"onEveryStartup": function() { return true; },
	
	"onEveryModify": function() {
		if (GMailCounter.tracker.getState() !== "started") {
			return true;
		}
	},
	
	"once": function(element) {
		if (!_get(element.id)) {
		
			_set(element.id, true);
			
			return true;
		} else {
			return false;
		}
	}
};

var actions = {

	"OpenURL": function(value) {
		safari.application.openBrowserWindow().activeTab.url = value;
	},
	
	"ShowAlert": function(value) {
		alert( value );
	}
};

function _get (key) {
	a = JSON.parse(safari.extension.settings["ExtNews"])[key];
	
	return (typeof a === "null") ? false : a;
}

function _set (key, value) {
	b = JSON.parse(safari.extension.settings["ExtNews"]);
	
	b[key] = value;
	
	safari.extension.settings["ExtNews"] = JSON.stringify(b);
}