/*
--------------------------------
	bar.js
	Author: Elia Cereda
	© 2010 All rights reserved.
	
	Extension bar javascript file
--------------------------------

This file is part of Safari's Extension "GMail Counter", developed by Elia Cereda <cereda.extensions@yahoo.it>

If you redestribute, edit or share this file you MUST INCLUDE THIS NOTICE and you cannot remove it without prior written permission by Elia Cereda.
If you use this file or its derivates in your projects you MUST release it with this or any other compatible license.

This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
	Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/

var GMail //This will contain the GMail Object
var Global //This will contain the Global Object

ExtensionBar = {
	alreadyActivated: false,	//Setted to true on first update
	
	inactive: 1, //The inactive mail div, aka the div with high class (1 or 2)
	
	init: function() {
		this.onresize();
		
		this.requestActivation();
	},
	
	onresize: function() {
		ww = window.innerWidth;
		
		m1 = $("mail_1");
		m2 = $("mail_2");
		
		bc = $("buttonContainer");
		
		w1 = document.defaultView.getComputedStyle(m1, "").width.split("px")[0];
		w2 = document.defaultView.getComputedStyle(m2, "").width.split("px")[0];
		
		m1.style.left = ((ww/2)-(w1/2))+"px";
		m2.style.left = ((ww/2)-(w2/2))+"px";
		
		bc.style.left = ((ww/2)-25)+"px";
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
		}
	},
	
	update: function() {
		if(!ExtensionBar.alreadyActivated) {
			ExtensionBar.requestActivation();
		} else {
			mailObject = Global.mailsArray[Global.currentIndex];
			
			if(typeof(mailObject) == "undefined") {
				setTimeout(ExtensionBar.update, 100);
			} else {
			
				m = $("mail_"+ExtensionBar.inactive);
				
				$$("mailId", m)[0].innerHTML = Global.currentIndex;
				$$("title", m)[0].innerHTML = mailObject.title;
				$$("author", m)[0].innerHTML = mailObject.author;
				
				$$$("body")[0].style.backgroundColor = mailObject.color[0];
				m.style.color = mailObject.color[1];
				
				ExtensionBar.toggleBar();
				
				ExtensionBar.onresize();
			}
		}
	},
	
	openLink: function(link) {
		Global.openLink(link)
	},
	
	openMail: function(id) {
		
		switch ( id.innerHTML ) {
			case "-":
				url = GMail.GMailBaseURL();
				break;
				
			default:
				console.log(Global.mailsArray, id.innerHTML);
				
				url = Global.mailsArray[id.innerHTML].link;
				break;
				
		}
		
		this.openLink(url);
	},
	
	toggleBar: function() {
		
	},
	
	toggleMenu: function() {
		if($("actions").className == "plus") {
			$("actions").className="close";
			$("actions").title="Close menu...";
			
			$("next").className="hide";
			$("previous").className="hide";
			
			$("overlay").className="overlayActive";
		} else {
			$("actions").className="plus";
			$("actions").title="Open menu...";
			
			$("next").className="";
			$("previous").className="";
			
			$("overlay").className="overlayInactive";
		}
	},
	
	next: function() {
		
	},
	
	compose: function() {
		this.openLink(GMail.GMailBaseURL(false, false, "#compose"));
	}
	
};

window.onresize = ExtensionBar.onresize;

function $ (id, ns) {
	ns = (typeof(ns) != "undefined")?ns : document;
	return ns.getElementById(id);
}
function $$ (className, ns) {
	ns = (typeof(ns) != "undefined")?ns : document;
	return ns.getElementsByClassName(className);
}

function $$$ (tag, ns) {
	ns = (typeof(ns) != "undefined")?ns : document;
	return ns.getElementsByTagName(tag);
}