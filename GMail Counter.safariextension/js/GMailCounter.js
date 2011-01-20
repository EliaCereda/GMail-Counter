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
		
		if(!safari.extension.settings.settingsPushed) {
			GMailCounter.value("openIn", safari.extension.settings.openIn);
			GMailCounter.value("audioState", safari.extension.settings.audioState);
			GMailCounter.value("audioVolume", safari.extension.settings.audioVolume);
			GMailCounter.value("audioSrc", safari.extension.settings.audioSrc);
			GMailCounter.value("barTimeout", safari.extension.settings.barTimeout);
			GMailCounter.value("hideWhenNoMails", safari.extension.settings.hideWhenNoMails);
			GMailCounter.value("closeBehavior", safari.extension.settings.closeBehavior);
			
			
			
			safari.extension.settings.settingsPushed = true
		}
		
		if(!localStorage.installedVersion) {
			GMailCounter.event("install");
		} else if(v(GMailCounter.info.version) > v(localStorage.installedVersion)) {
			GMailCounter.event("update", {"from": localStorage.installedVersion, "to": GMailCounter.info.version});
		}
	},
	
	event: function(e, data) {
		GMailCounter.tracker.logEvent(e, data);
	},
	
	value: function(k, v) {
		GMailCounter.tracker.logValue(k, v);
	},
	
	push: function() {
		GMailCounter.tracker.push();
	}
};

window.addEventListener("load", GMailCounter.init);