ExtensionBar = {

	init: function() {
		onresize();
	},
	
	onresize: function() {
		ww = window.innerWidth;
		
		m1 = $("mail_1");
		m2 = $("mail_2");
		
		w1 = document.defaultView.getComputedStyle(m1, "").width.split("px")[0];
		w2 = document.defaultView.getComputedStyle(m2, "").width.split("px")[0];

		m1.style.left = ((ww/2)-(w1/2))+"px";
		m2.style.left = ((ww/2)-(w2/2))+"px";
	},
	
	openLink: function(link) {
		safari.extension.globalPage.contentWindow.openLink(link)
	},
	
	toggleMenu: function() {
		if($("actions").className == "plus") {
			$("actions").className="close";
			$("actions").title="Close menu...";
			
			$("next").className="dontHide";
			$("previous").className="dontHide";
			
			$("overlay").className="overlayActive";
		} else {
			$("actions").className="plus";
			$("actions").title="Open menu...";
			
			$("next").className="";
			$("previous").className="";
			
			$("overlay").className="overlayInactive";
		}
	}
	
	next: function() {
		
	}
	
};

window.onresize = ExtensionBar.onresize;

function $ (id) { return document.getElementById(id); }
function $$ (className) { return document.getElementsByClassName(className); }