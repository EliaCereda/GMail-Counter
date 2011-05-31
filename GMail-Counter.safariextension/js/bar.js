/*
--------------------------------
	bar.js
	Author: Elia Cereda
	Copyright (c) 2010-2011
	
	Extension bar javascript file
--------------------------------
	Version History:
		* 0.8 - Initial release
		
--------------------------------

This file is part of Safari's Extension "GMail Counter" and is licensed under the MIT license.
Copyright (c) 2010-2011 Elia Cereda.
*/

var GMail; //This will contain the GMail Object
var GMailCounter; //This will contain the GMailCounter Object
var Global; //This will contain the Global Object

ExtensionBar = {
	alreadyActivated: false,	//Setted to true on first update
	
	inactive: 1, //The inactive mail div, aka the div with high class (1 or 2)
	
	init: function() {
		$("close").title = i18n.get("close");
		$("compose").title = i18n.get("compose");
		$("previous").title = i18n.get("previous");
		$("next").title = i18n.get("next");
		$("numberOf").innerHTML = i18n.get("of");
		
		this.requestActivation();
	},
	
	requestActivation: function () {
		Global = safari.extension.globalPage.contentWindow.Global || {};
		
		p = Global.processActivation || function () {};
		p(this);
	},
	
	activate: function() {
		if(this.alreadyActivated)
			return;
		GMail = safari.extension.globalPage.contentWindow.GMail || {};
		GMailCounter = safari.extension.globalPage.contentWindow.GMailCounter || {};
		Global  = safari.extension.globalPage.contentWindow.Global || {};
		
		ExtensionBar.alreadyActivated = true;
		ExtensionBar.update();
		ExtensionBar.setUpdateState(Global.updateState);
	},
	
	update: function() {
		if(!ExtensionBar.alreadyActivated) {
			ExtensionBar.requestActivation();
		} else {
			var mailObject = Global.mailsArray[Global.currentIndex];
			
			if(typeof(mailObject) == "undefined") {
				setTimeout(ExtensionBar.update, 100);
			} else {
			
				var m = $("mail_"+ExtensionBar.inactive);
				
				$$("mailId", m)[0].innerHTML = Global.currentIndex;
				$$("title", m)[0].innerHTML = mailObject.title;
				$$("author", m)[0].innerHTML = mailObject.author;
				
				$$$("body")[0].style.backgroundColor = mailObject.color[0];
				m.style.color = mailObject.color[1];
				
				$("current").innerHTML = mailObject.current;
				$("total").innerHTML = mailObject.total;
				
				ExtensionBar.toggleBar();
			}
		}
	},
	
	toggleBar: function() {
		switch ( this.inactive ) {
			case 1:
				$("mail_2").className="mail high";
				
				$("mail_1").className="mail low";
				
				this.inactive=2;
				break;
			
			case 2:
				$("mail_2").className="mail low";
				
				$("mail_1").className="mail high";
				
				this.inactive=1;
				break;
			
		}
	},
	
	openMail: function() {
		
		switch ( this.inactive ) {
			case 1:
				var id = $$('mailId', $('mail_2'))[0].innerHTML;
				break;
				
			case 2:
				var id = $$('mailId', $('mail_1'))[0].innerHTML;
				break;		
		}
		
		switch ( id ) {
			case "-":
				var url = GMail.GMailBaseURL();
				break;

			default:
				var url = Global.mailsArray[id].link;
				break;
		}
		
		this.openLink(url);
	},
	
	next: function() {
		var a = Global.BarNext || function(){};
		a();
	},
	
	previous: function() {
		var a = Global.BarPrevious || function(){};
		a();
	},
	
	compose: function() {
		this.openLink(GMail.GMailBaseURL(false, false, "#compose"));
	},
	
	openLink: function(link) {
		var a = Global.openLink || function(){};
		
		a(link);
	},
	
	requestUpdate: function() {
		var a = Global.processUpdate || function(){};
		a(window.event.altKey);
		
		if(window.event.altKey) {
			GMailCounter.event("manualForcedUpdate");
		}
	},
	
	requestClose: function() {
		if(window.event.altKey && window.event.shiftKey) {
			alert("Anonymous UserID:\n\t"+GMailCounter.getUserID());
		} else {
			var a = Global.processBarClose || function(){};
			a(safari.self);
		}
	},
	
	setUpdateState: function(state) {
		if(state) {
			$("reload").className = "reloadSpinning";
			$("reload").title = i18n.get("Updating");
		} else {
			$("reload").className = "";
			$("reload").title = i18n.get("Update");
		}
	},

	sendNotification: function() {
		if (GMailCounter.settings.get("Sounds_enable")){
			var a = new Audio(GMailCounter.settings.get("Hidden_audioData"));
			a.volume = GMailCounter.settings.get("Sounds_volume");
			a.play();
		}
	}
};

function $ (id, ns) {
	var ns = (typeof(ns) != "undefined")?ns : document;
	return ns.getElementById(id);
}

function $$ (className, ns) {
	var ns = (typeof(ns) != "undefined")?ns : document;
	return ns.getElementsByClassName(className);
}

function $$$ (tag, ns) {
	var ns = (typeof(ns) != "undefined")?ns : document;
	return ns.getElementsByTagName(tag);
}