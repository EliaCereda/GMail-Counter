GMail = {
	status: "notInited",	//This can be "notInited", "loading", "notLogged", "logged", "error", "updated", "parsing", "noMails", "noNewMails", "newMails"
	error: 0,				//Only setted if status is "error", "0" means "all is ok"
	
	atomFeed: null,			//This will be the container for unparsed data from feed
	mails: null,			//This will be the container for mails' array
	latestReadMail: null, 	//This will contain the id of the latest mail when user click hide button
	
	debug: true,			//If this is true "logThis" will output debug informations to console
	
	GMailBaseURL: function(feed) {
		if (feed === "gmail") {
			return 'http://purl.org/atom/ns#'; //This is for using with XMLDocument.evaluate, it's the NameSpaceResolver
		}
		
		base = "https://mail.google.com";
		domain = "" //safari.extension.settings.getItem("appsDomain");
		label = "" //safari.extension.settings.getItem("label");
		
		url=base;
		url += (domain) ? ("/a/"+ domain + ((domain[domain.length - 1] != "/") ? "/" : "")) : "/mail/";
		url += (feed) ? "feed/atom/" + ((label)? label : "") : "";
		
		this.logThis(0, "GMailBaseURL", "I've generated an URL", url);
		
		return url;
	},
	
	checkLogin: function(callback) {
		this.setStatus("loading");
		xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (this.readyState==4) {
					if (xhr.responseText.indexOf("<!DOCTYPE html>") != -1) {	//For some strange reason Login page still use HTML 4 and then HTML 5: this is a freaky method to know if you're logged in or not
						GMail.setStatus("logged");
						GMail.logThis(0, "checkLogin", "You're logged-in!", 0);
						(typeof callback == "function")?callback("checkLogin", true):"";
					} else {
						GMail.setStatus("notLogged");
						GMail.logThis(1, "checkLogin", "You're NOT logged-in!", 0);
						(typeof callback == "function")?callback("checkLogin", false):"";
					}
				}
			};
		xhr.open("GET", this.GMailBaseURL(false));
		xhr.send();
		
		return "STARTED";
	},
	
	updateFeed: function(callback) {
		this.setStatus("loading");
		xhr = new XMLHttpRequest();
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
						(typeof callback == "function")?callback("error", null):"";
					}
				}
			}
		xhr.open("GET", this.GMailBaseURL(true));
		xhr.send();
		
		return "STARTED";
	},
	
	parseFeed: function(callback) {	//This function is synchronus, but for consistence it has a callback anyway. Parsed data will be also returned 
		this.setStatus("parsing");
		
		this.mails = [];
		length = this.XMLEvaluate(this.atomFeed, '/gmail:feed/gmail:entry').snapshotLength;
		
		for ( i = 0; i < length; i++ ) {
			this.mails[i] = {
				title : this.XMLEvaluate(this.atomFeed, '/gmail:feed/gmail:entry['+(i+1)+']/gmail:title').snapshotItem(0).textContent,
				author : this.XMLEvaluate(this.atomFeed, '/gmail:feed/gmail:entry['+(i+1)+']/gmail:author/gmail:name').snapshotItem(0).textContent,
				link : this.XMLEvaluate(this.atomFeed, '/gmail:feed/gmail:entry['+(i+1)+']/gmail:link/@href').snapshotItem(0).textContent,
				id : this.XMLEvaluate(this.atomFeed, '/gmail:feed/gmail:entry['+(i+1)+']/gmail:id').snapshotItem(0).textContent,
				
				color: [],		//COLOR IS SETTED LATER ||
								//						\/
				current : i+1,
				total : length
			}
			
			this.mails[i].color = this.string2Color(this.mails[i].author); //COLOR IS SETTED RIGHT HERE
			
		}
		
		if(this.mails.length == 0) {
			this.setStatus("noMails");
			
			GMail.logThis(0, "parseFeed", "There isn't unread mails");
			
			this.mails[0] = {
				title : "No unread mails",
				author : "GMail Counter",
				link : this.GMailBaseURL(false),
				id : "000-000",
				
				color: ["", "#000", "dark"],
				
				current : "-",
				total : "0"
			};
			
			(typeof callback == "function")?callback("parseFeed", "noMails"):"";
			
		} else if(this.mails[0].id == this.latestReadMail) {
			this.setStatus("noNewMails");
			
			GMail.logThis(0, "parseFeed", "There isn't unread and unviewed mails");
			
			(typeof callback == "function")?callback("parseFeed", "noNewMails"):"";
		} else {
			this.setStatus("newMails");
			
			GMail.logThis(0, "parseFeed", "There is/are "+this.mails.length+" unread mail(s)", this.mails);
			
			(typeof callback == "function")?callback("parseFeed", "newMails"):"";
		}
		
		return this.getStatus();
	},
	
	getMailArray: function() {
		if(this.getStatus() == "notLogged") {
			return [{
				title : "Click here to login",
				author : "GMail Counter",
				link : this.GMailBaseURL(false),
				id : "000-000",
				
				color: ["", "#000", "dark"],
				
				current : "-",
				total : "0"
			}]
		} else if(this.getStatus() == "error" || this.getStatus() == "notInited" || this.mails == null) {
			return [{
				title : "An error occurred, please contact me",
				author : "GMail Counter",
				link : "mailto: cereda.extensions@yahoo.it",
				id : "000-000",
				
				color: ["", "#000", "dark"],
				
				current : "-",
				total : "0"
			}]
		} else if(this.getStatus() == "noNewMails") {
			return "noNewMails";
		} else {
			return this.mails;
		}
	},
	
	readAll: function() {
		if(typeof this.mails != null && typeof this.mails[0] != undefined && typeof this.mails[0].id != undefined) {
			this.latestReadMail = this.mails[0].id;
			GMail.logThis(0, "readAll", "You've read all mails: this is the latest", this.mails[0]);
			this.setStatus("noNewMails");
		} else {
			GMail.logThis(0, "readAll", "There aren't new mails");
		}
		
		return this.mails[0];
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
			if(isError) {
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
		
		color = "#"+hex_md5(s).substring(0,6);

		r=this.h2d(color.substring(1,3));
		g=this.h2d(color.substring(3,5));
		b=this.h2d(color.substring(5,7));
		
		HSV = this.RGB2HSV(r,g,b);
		
		false_positives = [[50,26,249], [142, 11, 244]];
		false_negatives = [[225,229,58]];
		
		false_positives.forEach(function(value) {
			if (r == value[0] && g == value[1] && b == value[2]) {
				HSV[2] = 89;
			}
		});
		
		false_positives.forEach(function(value) {
			if (r == value[0] && g == value[1] && b == value[2]) {
				HSV[2] = 91;
			}
		});
		
		array = [color];
		
		if(HSV[2] > 90) {
			array[1] = "#000";
			array[2] = "dark";
		} else {
			array[1] = "#fff";
			array[2] = "light";
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