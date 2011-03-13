/*
--------------------------------
	GMail.js
	Author: Elia Cereda
	Copyright (c) 2010-2011
	
	The GMail class. Handle connections with GMail server.
--------------------------------
	Version History:
		* 0.8 - Initial release
		
--------------------------------

This file is part of Safari's Extension "GMail Counter" and is licensed under the MIT license.
Copyright (c) 2010-2011 Elia Cereda.
*/
var store = GMailCounter.store || {};

GMail = {
	status: "notInited",	//This can be "notInited", "loading", "notLogged", "logged", "error", "updated", "parsing", "noMails", "newMails"
	error: 0,				//Only setted if status is "error", "0" means "all is ok"
	
	atomFeed: null,			//This will be the container for unparsed data from feed
	mails: null,			//This will be the container for mails' array
	mailsCount: null,
	
	debug: false,			//If this is true "logThis" will output debug informations to console
	
	GMailBaseURL: function(feed, query, anchor) {
		if (feed === "gmail") {
			return 'http://purl.org/atom/ns#'; //This is for using with XMLDocument.evaluate, it's the NameSpaceResolver
		}
		
		var url = "https://mail.google.com";
		var label = store.general.label;
		
		if (store.GoogleApps.enabled) {
			var domain = store.GoogleApps.domain;
			url += "/a/"+ domain + ((domain[domain.length - 1] != "/") ? "/" : "");
		} else {
			url +="/mail/";
		}
		
		url += (feed) ? "feed/atom/" + ((label)? label : "") : "";
		
		url += (query) ? "?"+query : "";
		
		url += (anchor) ? anchor : "";
		
		this.logThis(0, "GMailBaseURL", "I've generated an URL", url);
		
		return url;
	},
	
	isGMailURL: function(url) {
		var regexp = /(http|https):\/\/(mail\.google\.com)(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		return regexp.test(url);
	},
	
	checkLogin: function(callback) {
		this.setStatus("loading");
		var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (this.readyState==4) {
					try {
						if (xhr.status == 404 || xhr.status == 503) {	//New method to determine if you're logged in or not, based on GMail handling of "404" errors: if you are logged you get a normal 404 error, else you get redirected to login page
							GMail.setStatus("logged");
							GMail.logThis(0, "checkLogin", "You're logged-in!", 0);
							(typeof callback == "function")?callback("checkLogin", true):"";
						} else {
							GMail.setStatus("notLogged");
							GMail.logThis("WaRnInG", "checkLogin", "You're NOT logged-in!", 0);
							(typeof callback == "function")?callback("checkLogin", false):"";
						}
					} catch (e) {}
				}
			};
		xhr.open("GET", this.GMailBaseURL(false, "view=loginCheck"));
		xhr.send();
		
		return "STARTED";
	},
	
	updateFeed: function(callback) {
		this.setStatus("loading");
		var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (this.readyState==4) {
					if (xhr.status==200 && xhr.responseXML) {
						GMail.atomFeed = xhr.responseXML;
						GMail.setStatus("updated");
						GMail.logThis(0, "updateFeed", "New feed downloaded", GMail.atomFeed);
						(typeof callback == "function")?callback("updateFeed", GMail.atomFeed):"";
					} else {
						GMail.atomFeed = null;
						GMail.setStatus("error", "Error while downloading feed");
						GMail.logThis(1, "updateFeed", "I can't download new feed");
						(typeof callback == "function")?callback("updateFeed", "error"):"";
					}
				}
			};
		xhr.open("GET", this.GMailBaseURL(true));
		xhr.send();
		
		return "STARTED";
	},
	
	parseFeed: function(callback) {
		this.setStatus("parsing");
		
		store.hidden.previousMailsArray = this.mails; store.save();
		
		this.mails = [];
		var length = this.XMLEvaluate(this.atomFeed, '/gmail:feed/gmail:entry').snapshotLength;
		
		for ( i = 0; i < length; i++ ) {
			this.mails[i] = {
				title : this.XMLEvaluate(this.atomFeed, '/gmail:feed/gmail:entry['+(i+1)+']/gmail:title').snapshotItem(0).textContent,
				author : this.XMLEvaluate(this.atomFeed, '/gmail:feed/gmail:entry['+(i+1)+']/gmail:author/gmail:name').snapshotItem(0).textContent,
				link : this.XMLEvaluate(this.atomFeed, '/gmail:feed/gmail:entry['+(i+1)+']/gmail:link/@href').snapshotItem(0).textContent,
				id : this.XMLEvaluate(this.atomFeed, '/gmail:feed/gmail:entry['+(i+1)+']/gmail:id').snapshotItem(0).textContent,
				
				color: [],		//COLOR IS SET LATER ||
								//					 \/
				current : i+1,
				total : length
			}
								//COLOR IS SET RIGHT HERE
			this.mails[i].color = this.string2Color(this.mails[i].author); 
			if(this.mails[i].title == "") this.mails[i].title = "[no subject]"
			
		}
		
		this.mailsCount = +(this.XMLEvaluate(this.atomFeed, '/gmail:feed/gmail:fullcount').snapshotItem(0).textContent);
		
		if(this.mails.length == 0) {
			this.setStatus("noMails");
			
			GMail.logThis(0, "parseFeed", "There aren't unread mails");
			
			this.mails[0] = {
				title : "No unread mail",
				author : "GMail Counter",
				link : this.GMailBaseURL(false, false, "#inbox"),
				id : "000-000",
				
				color: ["", "#000"],
				
				current : "-",
				total : "0"
			};
			
			(typeof callback == "function")?callback("parseFeed", "noMails"):"";
			
		} else {
			this.setStatus("newMails");
			
			GMail.logThis(0, "parseFeed", "There is/are "+this.mails.length+" unread mail(s)", this.mails);
			
			(typeof callback == "function")?callback("parseFeed", "newMails"):"";
		}
		
		return this.getStatus();
	},
	
	getMailsArray: function() {
		if(this.getStatus() == "notLogged") {
			GMail.logThis(0, "getMailsArray", "I've returned an array", "notLogged");
			return [{
				title : "Click here to login",
				author : "GMail Counter",
				link : this.GMailBaseURL(false),
				id : "000-000",
				
				color: ["", "#000"],
				
				current : "-",
				total : "0"
			}]
		} else if(this.getStatus() == "error" || this.getStatus() == "notInited" || this.mails == null) {
			GMail.logThis(0, "getMailsArray", "I've returned an array", "error");
			
			GMailCounter.event("errorOccurred");
			
			return [{
				title : "An error occurred, click here to re-login...",
				author : "GMail Counter",
				link : "https://mail.google.com/mail/?logout",
				id : "000-000",
				
				color: ["", "#000"],
				
				current : "-",
				total : "0"
			}]
		} else {
			GMail.logThis(0, "getMailsArray", "I've returned an array", this.mails);
			return this.mails;
		}
	},
	
	getMailsCount: function() {
		count = this.mailsCount
		
		if(this.getStatus() == "notLogged" || this.getStatus() == "error" || this.getStatus() == "notInited" || this.mails == null) {
			count = 0
		}
		
		GMail.logThis(0, "getMailsCount", "There is/are "+count+" unread mail(s)");
		return (count != null)?count:0;
	},
	
	checkNewMails: function() {
		var firstMail = GMail.mails[0];
		var firstId = firstMail.id + firstMail.title + firstMail.author + firstMail.current + firstMail.total;
		
		var latestFirstId = store.hidden.latestFirstId;
		
		store.hidden.latestFirstId = firstId; store.save();
		
		if (firstId !== latestFirstId) {
			if (firstMail.id === "000-000") {
				this.logThis(false, "checkNewMails", "Status messages only");
				return -1;
			} else {
				this.logThis(false, "checkNewMails", "There are new mails");
				return 1;
			}
		} else {
			this.logThis(false, "checkNewMails", "No new mails");
			return 0;
		}
	},
	
	setStatus: function(newStatus, newError) {
		this.status = newStatus;
		this.error = (this.status == "error") ? newError : 0;
		
		this.logThis(this.error, "setStatus", "New status is \""+this.status+"\"", this.error);
		
		//TODO: implement a callback system when status change
		
	},
	
	getStatus: function() {
		return this.status;
	},
	
	getError: function() {
		return this.error;
	},
	
	logThis: function(isError, sender, message, data) {
		if(this.debug) {
			console.group(sender+"() says: ")
			if(isError === "WaRnInG") {
				console.warn(message);
			} else if (isError) {
				console.error(message);
			} else {
				console.log(message);
			}
			
			if(data) {
				console.group("Attached data:");
					console.log(data);
				console.groupEnd();
			}
			console.groupEnd();
		}
	},
	
	//DEPENDENCIES
	string2Color: function(s) {
		
		var color = "#"+hex_md5(s).substring(0,6);

		var r=this.h2d(color.substring(1,3));
		var g=this.h2d(color.substring(3,5));
		var b=this.h2d(color.substring(5,7));
		
		var HSV = this.RGB2HSV(r,g,b);
		
		var shouldBeWhite = ["#321AF9", "#8E0BF4", "#EC1879", "#F92AA9", "#EB0B85"];
		var shouldBeBlack = ["#E1E53A", "#97FB14", "#2FF449", "#7AD132", "#ACC9AA", "#9ADEAA"];
		
		shouldBeWhite.forEach(function(value) {
			if (color.toUpperCase() == value) {
				HSV[2] = 0.89;
			}
		});
		
		shouldBeBlack.forEach(function(value) {
			if (color.toUpperCase() == value) {
				HSV[2] = 0.91;
			}
		});
		
		var array = [color];
		
		if(HSV[2] > 0.90) {
			array[1] = "black";
		} else {
			array[1] = "white";
		}
		
		return array;
	},			//Convert a string into a colors
	
	h2d: function(n){return parseInt(n,16);},	//Ultra-thin Hexadecimal to Decimal converter
	
	RGB2HSV: function (r, g, b){
		r = r/255, g = g/255, b = b/255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, v = max;
	
		var d = max - min;
		s = max == 0 ? 0 : d / max;
	
		if(max == min) {
			h = 0; // achromatic
		} else {
			switch(max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
	
		return [h, s, v];
	},			//Convert color from RGB to HSV
	
	XMLEvaluate: function (XMLObject, XPath) {
		return XMLObject.evaluate(XPath, XMLObject, this.GMailBaseURL, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	}	//A shorter version of (XMLObject).evaluate([...]);
};