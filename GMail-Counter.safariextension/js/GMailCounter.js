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
		humanVersion: "0.8.2",
		version: "8.2",
		releaseType: "stable"
	},
	
	tracker: {}, //This will contain the ExtTracker object
	trackerId: "UA-17690004-2", //ExtTracker extension ID
	
	init: function() {
		GMailCounter.tracker = new ExtTracker(GMailCounter.trackerId, GMailCounter.info.version, true);
		
		ExtNews(GMailCounter.info);

	},
	
	event: function(e, data) {
		return GMailCounter.tracker.logEvent(e, data);
	},
	
	getUserID: function(e, data) {
		return GMailCounter.tracker.getUserID();
	}
};

window.addEventListener("load", GMailCounter.init);