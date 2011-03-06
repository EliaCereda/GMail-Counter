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
		humanVersion: "0.9 | alpha 1",
		version: "9.a.1",
		releaseType: "alpha"
	},
	
	tracker: {}, //This will contain the ExtTracker object
	trackerId: "UA-17690004-2", //ExtTracker extension ID
	
	init: function() {
		GMailCounter.tracker = new ExtTracker(GMailCounter.trackerId, GMailCounter.info.version, true);

	},
	
	event: function(e, data) {
		return GMailCounter.tracker.logEvent(e, data);
	},
	
	getUserID: function(e, data) {
		return GMailCounter.tracker.getUserID();
	}
};

window.addEventListener("load", GMailCounter.init);