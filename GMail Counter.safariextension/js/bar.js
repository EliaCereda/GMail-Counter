/*
--------------------------------
	bar.js
	Author: Elia Cereda
	© 2010 All rights reserved.
	
	Extension bar javascript file
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

var GMail; //This will contain the GMail Object
var Global; //This will contain the Global Object
var Storage = safari.extension.settings;

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
		Global  = safari.extension.globalPage.contentWindow.Global;
		if (typeof(Global) != 'undefined' && typeof(Global.processActivation) != 'undefined') {
			Global.processActivation(this);
		}
	},
	
	activate: function() {
		if(!this.alreadyActivated) {
			GMail = safari.extension.globalPage.contentWindow.GMail;
			Global  = safari.extension.globalPage.contentWindow.Global;
			
			this.alreadyActivated = true;
			
			this.update();
			this.setUpdateState(Global.updateState);
		}
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
		Global.BarNext();
	},
	
	previous: function() {
		Global.BarPrevious();
	},
	
	compose: function() {
		this.openLink(GMail.GMailBaseURL(false, false, "#compose"));
	},
	
	openLink: function(link) {
		Global.openLink(link);
	},
	
	requestUpdate: function() {
		Global.processUpdate(window.event.altKey);
	},
	
	requestClose: function() {
		Global.processBarClose(safari.self);
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
		var a = new Audio("http://elix14.altervista.org/api/audio/"+Storage.audioSrc+".mp3");
		a.volume = Storage.audioVolume;
		a.play();
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