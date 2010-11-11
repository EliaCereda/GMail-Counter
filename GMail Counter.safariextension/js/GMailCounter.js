GMailCounter = {
	humanVersion: "0.8 alpha",
	version: "8.0",
	homepage: "http://elix14.altervista.org/",
	motd: "motd.php",
	
	tracker, //This will contain the ExtTracker object
	trackerId: "---", //ExtTracker extension ID
	
	init: function() {
		GMailCounter.tracker = new ExtTracker(GMailCounter.trackerId, GMailCounter.version);
	},
	
	log: function(message) {
		GMailCounter.tracker.log(message);
	}
};

window.addEventListener("load", GMailCounter.init);