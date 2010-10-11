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
			/*Implement the feed loading*/
		}
	},
	
	update: function() {
		if(!this.alreadyActivated) {
			this.requestActivation();
		} else {
			mailObject = Global.mailsArray[Global.currentIndex];
			
			console.log(GMail, Global, mailObject)
			
			m = $("mail_"+this.inactive);
			
			$$("mailId", m)[0].innerHTML = Global.currentIndex;
			$$("title", m)[0].innerHTML = mailObject.title;
			$$("author", m)[0].innerHTML = mailObject.author;
			
			console.log(m, $$("title", m))
			
			this.onresize();
		}
	},
	
	openLink: function(link) {
		Global.openLink(link)
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