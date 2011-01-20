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
		humanVersion: "0.8 | beta 5",
		version: "8.b.5",
		releaseType: "publicBeta"
	},
	
	tracker: {}, //This will contain the ExtTracker object
	trackerId: "GMail-Counter", //ExtTracker extension ID
	
	init: function() {
		GMailCounter.tracker = new ExtTracker(GMailCounter.trackerId, GMailCounter.info.version, true);
		
		ExtNews(GMailCounter.info);
	},
	
	event: function(e, data) {
		GMailCounter.tracker.logEvent(e, data);
	},
	
	value: function(k, v) {
		GMailCounter.tracker.logEvent(k, v);
	},
	
	push: function() {
		GMailCounter.tracker.push();
	}
};

window.addEventListener("load", GMailCounter.init);