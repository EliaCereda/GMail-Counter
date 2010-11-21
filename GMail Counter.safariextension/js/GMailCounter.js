/*
--------------------------------
	GMailCounter.js
	Author: Elia Cereda
	© 2010 All rights reserved.
	
	 Auxiliary functions.
--------------------------------
	Version History:
		* 0.8 - Initial release
		
--------------------------------

This file is part of Safari's Extension "GMail Counter", developed by Elia Cereda <cereda.extensions@yahoo.it>

If you redestribute, edit or share this file you MUST INCLUDE THIS NOTICE and you cannot remove it without prior written permission by Elia Cereda.
If you use this file or its derivates in your projects you MUST release it with this or any other compatible license.

This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
	Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
GMailCounter = {
	humanVersion: "0.8 | beta 1",
	version: "8.b.1",
	releaseType: "publicBeta",
	homepage: "http://elix14.altervista.org/",
	motdURL: "api/motd.php",
	
	tracker: {}, //This will contain the ExtTracker object
	trackerId: "---", //ExtTracker extension ID
	
	init: function() {
		GMailCounter.tracker = new ExtTracker(GMailCounter.trackerId, GMailCounter.version);
		GMailCounter.motd();
	},
	
	log: function(message) {
		GMailCounter.tracker.log(message);
	},
	
	motd: function() {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status) {
				var obj = JSON.parse(xhr.responseText);
				
				obj.forEach(function(element) {
					var AmITarget;
					element.targets.forEach(function(target) {
						switch ( target ) {
							case GMailCounter.version:
							case GMailCounter.releaseType:
							case "everyone":
								AmITarget = true;
							break;
						}
					});
					
					if(AmITarget) {
						var toBeShownNow;
						switch ( element.toBeShown ) {
							//case "once":\\	TO
							//	null	  \\	DO
							//break;	  \\
							case "onEveryUpdate":
								var state = GMailCounter.tracker.getState();
								if(state != "started") {
									toBeShownNow = true;
								}
							break;
							case "onEveryStartup":
								toBeShownNow = true;
							break;
						}
						if(toBeShownNow) {
							element.actions.forEach(function(a) {
								switch ( a.type ) {
									case "OpenURL":
										safari.application.openBrowserWindow().activeTab.url = a.url;
									break;
									
									case "ShowAlert":
										alert(a.text);
									break;
								}
							});
						}
					}
				});
			}
		};
		xhr.open("GET", GMailCounter.homepage+GMailCounter.motdURL, true);
		xhr.send();
	}
};

window.addEventListener("load", GMailCounter.init);