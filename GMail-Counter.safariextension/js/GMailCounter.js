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
		GMailCounter.store = Object.merge(Object.clone(GMailCounter.defaultStore), new Store("GMailCounter")).save();
	},
	
	event: function(e, data) {
		return GMailCounter.tracker.logEvent(e, data);
	},
	
	getUserID: function(e, data) {
		return GMailCounter.tracker.getUserID();
	}
};

GMailCounter.init();