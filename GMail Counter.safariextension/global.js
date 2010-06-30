var newTab;
var eventVar;
var user_uid;
var version;
var atom;
var mails;
var currentIndex = -1;
var timeout;

function performCommand(event) {
    if (event.command === "button") {
    	if (safari.extension.settings.getItem("tab")) {
			if (typeof(newTab) == 'undefined' || typeof(newTab.url) == 'undefined') {
				newTab = safari.application.activeBrowserWindow.openTab();
			}
			newTab.url = 'https://mail.google.com/mail/';
			newTab.activate();
		} else {
			safari.application.activeBrowserWindow.activeTab.url = 'https://mail.google.com/mail/';
		}
    }

}

function validateCommand(event) {

    if (event.command === "button") {

		eventVar=event;
		event.target.toolTip = "GMail Counter - Loading...";
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
					//event.target.image = safari.extension.baseURI + "status-unread.png";
				}
				
				updateBarsData();
				if(currentIndex == -1) {
					updateBars();
				}
			}
		}
		label = safari.extension.settings.getItem("label");
		xhr.open("GET","https://mail.google.com/mail/feed/atom/"+label,true);
		xhr.send();
    }
}

function changedCommand(event) {
	if (event.key == "label") {
		updateBarsData();
	}
}

function gmailNSResolver(prefix) {
  if(prefix == 'gmail') {
	return 'http://purl.org/atom/ns#';
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
		if(currentIndex > mails.length-2) {
			currentIndex = -1;
		}
		
		if(currentIndex == -1) {
			currentIndex = 0;
		} else {
			++currentIndex;
		}
		
		bars = safari.extension.bars;
		for ( i = 0; i < bars.length; i++ ) {
			if(bars[i].contentWindow.update)
				bars[i].contentWindow.update(mails[currentIndex]);
		}
	} else {
		bars = safari.extension.bars;
		
		currentIndex = -1;
		
		noMail = new Array;
		noMail["content"] = "No new mails";
		noMail["sender"] = "GMail Counter";
		noMail["background"] = ";#000";
		noMail["link"] = "https://mail.google.com/mail/";
		
		noMail["current"] = "-"
		noMail["total"] = "0";

		
		for ( i = 0; i < bars.length; i++ ) {
			if(bars[i].contentWindow.update)
				bars[i].contentWindow.update(noMail);
		}
	}
	
	if (mails.length != 0) {
		timeout = setTimeout("updateBars()",10000);
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
		HSV_.v = 89
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

function hex2dec( s ) { return parseInt( s, 16 ); }

safari.application.addEventListener("validate", validateCommand, false);
safari.application.addEventListener("command", performCommand, false);
safari.extension.settings.addEventListener("change", changedCommand, false);