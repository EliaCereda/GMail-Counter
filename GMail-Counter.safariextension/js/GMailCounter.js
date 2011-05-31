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
(function() {
	this.GMailCounter = {
		info: {
			humanVersion: "0.9 | beta 1",
			version: "9.b.1",
			releaseType: "beta"
		},
	
		tracker: {}, //This will contain the ExtTracker object
		trackerId: "UA-17690004-2", //ExtTracker extension ID
	
		settings: {}, 	//This will contain the store.js object 
	
		defaultStore: {
			//General tab
				//Behavior group
					"Behavior_label": "Inbox",
					"Behavior_openLinksIn": "GmailTab",
				//Google Apps group
					"GoogleApps_enable": false,
					"GoogleApps_domain": "",
			//Notifications tab
				//Sounds group
					"Sounds_enable": true,
					"Sounds_volume": 0.5,
					"Sounds_name": "Bell",
				//Head Viewer group
					"HeadViewer_interval": "15",
					"HeadViewer_autoHide": false,
					"HeadViewer_closeBehavior": "closeAll",
			"Hidden_BarHiddenByMe": false,
			"Hidden_latestFirstId": "",
			"Hidden_audioData": audioData["Bell"]
		},

		event: function(e, data) {
			return GMailCounter.tracker.logEvent(e, data);
		},
	
		getUserID: function(e, data) {
			return GMailCounter.tracker.getUserID();
		}
	};
	
	//init
	(function () {
		GMailCounter.tracker = new ExtTracker(GMailCounter.trackerId, GMailCounter.info.version, true);
		GMailCounter.settings = new Store("settings", GMailCounter.defaultStore);
	})();
})();