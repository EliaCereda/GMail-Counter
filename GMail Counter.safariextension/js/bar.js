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
var store; //This will contain the store.js Object

ExtensionBar = {
	alreadyActivated: false,	//Setted to true on first update
	
	inactive: 1, //The inactive mail div, aka the div with high class (1 or 2)
	
	mouseOver: false, //True if the mouse is over the bar
	
	init: function() {
		this.onresize();
		
		this.requestActivation();
	},
	
	onresize: function() {
		var ww = window.innerWidth;
		
		var m1 = $("mail_1");
		var m2 = $("mail_2");
		
		var nb = $$("number")[0];
		var wnb = +(document.defaultView.getComputedStyle(nb, "").width.split("px")[0]);
		
		var prev = $("previous");
		
		if(this.mouseOver) {
			maxWidth = (+(ww)-(30+20+20+20+20+18+20)-(20+14+wnb+14+30)).toString() + "px";
		} else {
			maxWidth = (ww-40).toString() + "px";
		}
		
		m1.style.maxWidth = maxWidth;
		m2.style.maxWidth = maxWidth;
		
		var w1 = document.defaultView.getComputedStyle(m1, "").width.split("px")[0];
		var w2 = document.defaultView.getComputedStyle(m2, "").width.split("px")[0];
		
		m1.style.left = ((ww/2)-(w1/2)).toString()+"px";
		m2.style.left = ((ww/2)-(w2/2)).toString()+"px";
		
		prev.style.right = (24 + parseFloat(wnb) + 10).toString()+ "px";
	},
	
	onmouseover: function()  {
		this.mouseOver = true;
		this.onresize();
	},
	
	onmouseout: function() {
		this.mouseOver = false;
		this.onresize();
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
		store = GMailCounter.store || {};
		
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
				
				ExtensionBar.onresize();
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
		var a = Global.BarNext || void(0);
		a();
	},
	
	previous: function() {
		var a = Global.BarPrevious || void(0);
		a();
	},
	
	compose: function() {
		this.openLink(GMail.GMailBaseURL(false, false, "#compose"));
	},
	
	openLink: function(link) {
		var a = Global.openLink || void(0);
		
		a(link);
	},
	
	requestUpdate: function() {
		var a = Global.processUpdate || void(0);
		a(window.event.altKey);
		
		if(window.event.altKey) {
			GMailCounter.event("manualForcedUpdate");
		}
	},
	
	requestClose: function() {
		if(window.event.altKey && window.event.shiftKey) {
			alert("Anonymous UserID:\n\t"+GMailCounter.getUserID());
		} else {
			var a = Global.processBarClose || void(0);
			a(safari.self);
		}
	},
	
	setUpdateState: function(state) {
		if(state) {
			$("reload").className = "reloadSpinning";
			$("reload").title = "Updating...";
		} else {
			$("reload").className = "";
			$("reload").title = "Update";
		}
	},

	sendNotification: function() {
		if (store.audio.enabled){
			var a = new Audio(audioData[store.audio.src]);
			a.volume = store.audio.volume;
			a.play();
		}
	}
};

window.onresize = ExtensionBar.onresize;

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