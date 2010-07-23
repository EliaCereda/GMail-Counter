var newTab;
var eventVar;
var user_uid;
var version;
var atom;
var mails;
var currentIndex = -1;
var timeout;
var delay;

var loggedIn = true;

function getGmailUrl(withFeed) {
  var url = "https://mail.google.com";
  var domain = safari.extension.settings.getItem("appsDomain");
  var label = safari.extension.settings.getItem("label");
  
  if (domain) {
    url += "/a/" + domain + ((domain[domain.length - 1] != "/") ? "/" : "");
  } else {
    url += "/mail/";
  }
  
  if(withFeed){
  	url += "feed/atom/";
  	if(label) {
	  	url += label;
	  }
  }
  
  return url;
}

function gmailNSResolver(prefix) {
  if(prefix == 'gmail') {
	return 'http://purl.org/atom/ns#';
  }
}

function performCommand(event) {
    if (event.command === "button") {
    	if (safari.extension.settings.getItem("tab")) {
			if (typeof(newTab) == 'undefined' || typeof(newTab.url) == 'undefined') {
				newTab = safari.application.activeBrowserWindow.openTab();
			}
			newTab.url = getGmailUrl(false);
			newTab.activate();
			newTab.browserWindow.activate();
		} else {
			safari.application.activeBrowserWindow.activeTab.url = getGmailUrl(false);
		}
    }

}

function validateCommand(event) {

    if (event.command === "button") {
		
		eventVar=event;
		event.target.toolTip = "GMail Counter - Loading...";
		xhr1 = new XMLHttpRequest();
	    xhr1.onreadystatechange = function () {
	    	if (xhr1.readyState==4) {
		    	if (xhr1.responseText.indexOf("<!DOCTYPE html>") != -1) {
		    		console.log("ok");
		    		
			        xhr = new XMLHttpRequest();
			        xhr.onreadystatechange = function () {
			        	if (xhr.readyState==4 && xhr.status==200 && xhr.responseXML) {
							xmlData = xhr.responseXML;
							atom = xmlData;
							fullCountSet = xmlData.evaluate("/gmail:feed/gmail:fullcount", xmlData, gmailNSResolver, XPathResult.ANY_TYPE, null);
							unread = fullCountSet.iterateNext();
							if(unread.textContent != 0) {
								message = (unread.textContent==1)?"message":"messages";
								event.target.toolTip = "GMail Counter - "+unread.textContent+" new "+message;
								event.target.badge = unread.textContent;
							} else {
								event.target.toolTip = "GMail Counter - No new messages";
								event.target.badge = unread.textContent;
							}
							
							updateBarsData();
							if(currentIndex == -1) {
								updateBars();
							}
							
							if(!loggedIn) {
			    				updateBars();
			    			}
			    										
						}
					}
					xhr.open("GET",getGmailUrl(true),true);
					xhr.send();
				} else {
					console.log("no");
					loggedIn = false;
					
					event.target.toolTip = "GMail Counter - Not logged-in";
					event.target.badge = 0;
					
					mails = new Array;
					mails[0] = new Array;
			
					mails[0]["content"] = "Click here to login";
					mails[0]["sender"] = "GMail Counter";
					mails[0]["background"] = ";#000";
					mails[0]["link"] = getGmailUrl(false);
			
					mails[0]["current"] = "-";
					mails[0]["total"] = "0";
					updateBars();
				}
			}
		}
		xhr1.open("GET",getGmailUrl(false),true);
		xhr1.send();
    }
}

function changedCommand(event) {
	if (event.key == "label") {
		updateBarsData();
	} else if(event.key == "delay") {
		setDelay(event.newValue);
	}
}

function updateBarsData() {
	xmlData = atom;
	mails = new Array;
	var allEntries = xmlData.evaluate('/gmail:feed/gmail:entry', xmlData, gmailNSResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null ); 
	for ( var i=0 ; i < allEntries.snapshotLength; i++ )  
	{  
		allTitles = xmlData.evaluate('/gmail:feed/gmail:entry['+(i+1)+']/gmail:title', xmlData, gmailNSResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		title = allTitles.snapshotItem(0).textContent;
		
		allAuthors = xmlData.evaluate('/gmail:feed/gmail:entry['+(i+1)+']/gmail:author/gmail:name', xmlData, gmailNSResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		author = allAuthors.snapshotItem(0).textContent;
		
		allAuthorsEmails = xmlData.evaluate('/gmail:feed/gmail:entry['+(i+1)+']/gmail:author/gmail:email', xmlData, gmailNSResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		authorEmail = allAuthorsEmails.snapshotItem(0).textContent;
		
		allLinks = xmlData.evaluate('/gmail:feed/gmail:entry['+(i+1)+']/gmail:link/@href', xmlData, gmailNSResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		link = allLinks.snapshotItem(0).textContent;
		
		mails[i] = new Array;
		
		mails[i]["content"] = title;
		mails[i]["sender"] = author;
		mails[i]["background"] = stringToColor(mails[i]["sender"]);
		mails[i]["link"] = link;
		
		mails[i]["current"] = i+1;
		mails[i]["total"] = allEntries.snapshotLength;
	}
return mails;
}

function updateBars() {
	clearTimeout(timeout);
	if(mails.length != 0) {
		if(currentIndex > mails.length-2) { //length-1(the index starts from 0 and length from 1)-1(I want to know if this is the last element)
			currentIndex = -1;
		}
		
		if(currentIndex == -1) {
			currentIndex = 0;
		} else {
			++currentIndex;
		}
		
		safari.extension.bars.forEach(function(bar) {
			if(bar.contentWindow.update)
				bar.contentWindow.update(mails[currentIndex]);
		})
	} else {
		currentIndex = -1;
		
		noMail = new Array;
		noMail["content"] = "No new mails";
		noMail["sender"] = "GMail Counter";
		noMail["background"] = ";#000";
		noMail["link"] = getGmailUrl(false);
		
		noMail["current"] = "-"
		noMail["total"] = "0";

		
		safari.extension.bars.forEach(function(bar) {
			if(bar.contentWindow.update)
				bar.contentWindow.update(noMail);
		})
	}
	
	if (mails.length != 0 && loggedIn) {
		timeout = setTimeout("updateBars()",delay*1000);
	}
}

function hideBars(  ) {
	bars = safari.extension.bars;
	for ( i = 0; i < bars.length; i++ ) {
		bars[i].hide();
	}
}

function stringToColor( string ) {
	md5 = hex_md5(string);
	color = "#"+md5.substring(0,6);
	
	r=hex2dec(color.substring(1,3));
	g=hex2dec(color.substring(3,5));
	b=hex2dec(color.substring(5,7));
	
	RGB_ = new RGB(r,g,b);
	HSV_ = ColorConverter.toHSV(RGB_);
	
	false_positive = new RGB (50,26,249);
	false_negative = new RGB (225,229,58);
	
	if (RGB_.r == false_positive.r && RGB_.g == false_positive.g && RGB_.b == false_positive.b) {
		HSV_.v = 89;
	}
	
	if (RGB_.r == false_negative.r && RGB_.g == false_negative.g && RGB_.b == false_negative.b) {
		HSV_.v = 91;
	} 
	
	if(HSV_.v > 90) {
		color += ";#000"
	} else {
		color += ";#fff"
	}
	
	return color;
}

function setDelay(d){
	d=parseInt(d);
	delay=(d>0)?d:10;
	updateBars();
}

function hex2dec( s ) { return parseInt( s, 16 ); }

safari.application.addEventListener("validate", validateCommand, false);
safari.application.addEventListener("command", performCommand, false);
safari.extension.settings.addEventListener("change", changedCommand, false);

setDelay(safari.extension.settings.getItem("delay"));