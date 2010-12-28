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
	humanVersion: "0.8 | beta 4",
	version: "8.b.4",
	releaseType: "publicBeta",
	homepage: "http://elix14.altervista.org/",
	
	tracker: {}, //This will contain the ExtTracker object
	trackerId: "GMailCounter", //ExtTracker extension ID
	
	init: function() {
		GMailCounter.tracker = new ExtTracker(GMailCounter.trackerId, GMailCounter.version);
	},
	
	log: function(message) {
		GMailCounter.tracker.logEvent(message);
	}
};

window.addEventListener("load", GMailCounter.init);