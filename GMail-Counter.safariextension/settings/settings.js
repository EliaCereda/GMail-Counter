window.addEvent("domready", function () {
	
	new FancySettings.initWithManifest(function (settings) {
		store = new Store("settings");
		
		if(store.get("Hidden_newInstall")) {
			console.log(store.get("Hidden_newInstall"));
			
			store.set("Hidden_newInstall", false);
			
			var alertDiv = new Element("div");
			alertDiv.className = "tab-content show";
			alertDiv.id = "GCAlertDiv";
			
			var title = new Element("h2");
			title.innerHTML = i18n.get("Welcome");;
			title.inject(alertDiv);
			
			var body = new Element("div");
			body.id = "GCBody";
			body.innerHTML = i18n.get("welcomeMessage");
			body.inject(alertDiv);
			
			var image = new Element("img");
			image.src = "http://3.gmailcounter-app.appspot.com/images/"+i18n.get("context.png");
			image.inject(alertDiv);
			
			var arrow = new Element("img");
			arrow.id = "GCArrow";
			arrow.src = "http://3.gmailcounter-app.appspot.com/images/arrow.png";
			
			arrow.inject(alertDiv);
			
			
			var close = new Element("input");
			close.id = "GCClose";
			close.type = "button";
			close.value = i18n.get("Close");
			close.addEvent("click", function () {
				alertDiv.className = "tab-content";
			})
			close.inject(alertDiv);
			
			alertDiv.inject(document.body);
		}
		
		settings.manifest.Sounds_name.element.readOnly = true;
		
		var play = new Element("span");
		play.id="GCPlayButton";
		play.innerHTML="▶";
	
		function audioToggle () {
			if(play.innerHTML == "▶") {
				window.audioObj = new Audio(store.get("Hidden_audioData"));
				audioObj.addEventListener("ended", audioToggle, false);
				
				audioObj.play();
				
				
				play.innerHTML="◼";
			} else {
				window.audioObj.pause();
				window.audioObj.destroy();
				
				play.innerHTML = "▶";
			}
		}
	
		play.addEvent("click", audioToggle);
		
		play.inject(settings.manifest.Sounds_name.container);
		
		var Sounds_choose = settings.manifest.Sounds_choose;
		Sounds_choose.container.setStyle("height", "27px");
		Sounds_choose.addEvent("action", function(){
			
			if (Sounds_choose.element.value == Sounds_choose.params.text) {
				Sounds_choose.element.value = i18n.get("OK");
				
				var cancel = new Element("input");
				cancel.id = "GCCancelButton"
				cancel.type = "button";
				cancel.value = i18n.get("Cancel");
				cancel.addEvent("click", function() {
					Sounds_choose.element.value = Sounds_choose.params.text;

					document.id("GCCancelButton").destroy();
					document.id("GCiFrame").destroy();
				});
				
				cancel.inject(Sounds_choose.container);
				
				var iframe = new Element("iframe");
				iframe.id = "GCiFrame";
				iframe.src = "http://3.gmailcounter-app.appspot.com/";
				iframe.scrolling = "no";
				iframe.setStyle("height", "29px");
				iframe.setStyle("position", "relative");
				iframe.setStyle("top", "6px");
				
				iframe.inject(Sounds_choose.container);
			} else if(Sounds_choose.element.value == "OK"){
				var iframe = document.id("GCiFrame");
				iframe.contentWindow.postMessage({message:"submitForm"}, "*");
			} else {
				Sounds_choose.element.value = Sounds_choose.params.text;
				document.id("GCiFrame").destroy();
			}
			
			window.addEventListener("message", function(e){
				switch (e.data.message) {
		        	case "success":
						document.id("GCCancelButton").destroy();
						Sounds_choose.element.value = i18n.get("Close");
						store.set("Sounds_name", e.data.data.name);
						settings.manifest.Sounds_name.element.value = e.data.data.name;
						
						store.set("Hidden_audioData", "data:"+e.data.data.mimetype+";base64,"+e.data.data.audio);
					break;
					case "error":
						Sounds_choose.element.value = Sounds_choose.params.text;
						document.id("GCCancelButton").destroy();
						document.id("GCiFrame").destroy();
						
						alert(e.data.data.details)
						console.log(e);
				}
			}, false);
		});
	});
});
