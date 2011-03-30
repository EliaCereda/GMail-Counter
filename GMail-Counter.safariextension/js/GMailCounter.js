/*
--------------------------------
	GMailCounter.js
	Author: Elia Cereda
	Copyright (c) 2010-2011
	
	 Auxiliary functions.
--------------------------------
	Version History:
		* 0.8 - Initial release
		
--------------------------------

This file is part of Safari's Extension "GMail Counter" and is licensed under the MIT license.
Copyright (c) 2010-2011 Elia Cereda.
*/
GMailCounter = {
	info: {
		humanVersion: "0.9 | alpha 2",
		version: "9.a.2",
		releaseType: "alpha"
	},
	
	tracker: {}, //This will contain the ExtTracker object
	trackerId: "UA-17690004-2", //ExtTracker extension ID
	
	store: {}, 	//This will contain the store.js object 
	
	defaultStore: {
		"audio": {
			"enabled": true,
			"src": "Bell",
			"volume": "0.5"
		},
		"general": {
			"label": "Inbox",
			"openLinksIn": "GMailTab"
		},
		"GoogleApps": {
			"enabled": false,
			"domain": ""
		},
		"HeadViewer": {
			"interval": 15,
			"autoHide": false,
			"closeBehavior": "closeAll"
		},
		"hidden": {
			"BarHiddenByMe": true,
			"latestFirstId": ""
		}
	},
	
	init: function() {
		GMailCounter.tracker = new ExtTracker(GMailCounter.trackerId, GMailCounter.info.version, true);
		GMailCounter.store = merge(clone(GMailCounter.defaultStore), new Store("GMailCounter")).save();
	},
	
	event: function(e, data) {
		return GMailCounter.tracker.logEvent(e, data);
	},
	
	getUserID: function(e, data) {
		return GMailCounter.tracker.getUserID();
	}
};

function merge(source, k, v) {
	var mergeOne = function(source, key, current){
		switch (typeof current){
			case 'object':
				if (typeof source[key] == 'object') merge(source[key], current);
				else source[key] = clone(current);
			break;
			case 'array': source[key] = clone(current); break;
			default: source[key] = current;
		}
		return source;
	};
	
	if (typeof k == 'string') return mergeOne(source, k, v);
	for (var i = 1, l = arguments.length; i < l; i++){
		var object = arguments[i];
		for (var key in object) mergeOne(source, key, object[key]);
	}
	return source;
}

function clone(item) {
	switch (typeof item) {
		case "array":
			var newItem = new Array(i);
			
			var i = item.length;
			while (i--) newItem[i] = clone(newItem[i]);
			return newItem;
		
		case "object":
			var newItem = {};
			
			for (var key in item) newItem[key] = clone(item[key]);
			return newItem;
		
		default:
			return item;
	}
}

GMailCounter.init();