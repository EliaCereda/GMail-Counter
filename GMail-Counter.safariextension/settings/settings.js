window.addEvent("domready", function () {
	
	new FancySettings.initWithManifest(function (settings) {
		store = new Store("settings");
		
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
				iframe.src = "http://2.gmailcounter-app.appspot.com/";
				iframe.scrolling = "no";
				iframe.setStyle("height", "27px");
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
		
		settings.manifest.Sounds_enable.addEvent("action", function (value) {
			if(!settings.manifest.Sounds_enable.get()) {
				settings.manifest.Sounds_volume.element.disabled = true;
				settings.manifest.Sounds_volume.bundle.setStyle("color", "#7F7F7F");

				settings.manifest.Sounds_description.bundle.setStyle("color", "#7F7F7F");

				settings.manifest.Sounds_name.element.setStyle("color", "#7F7F7F");
				settings.manifest.Sounds_name.bundle.setStyle("color", "#7F7F7F");

				settings.manifest.Sounds_choose.element.disabled = true;
				
				document.id("GCPlayButton").removeEvents("click");
				document.id("GCPlayButton").setStyle("cursor", "auto");
			} else {
				settings.manifest.Sounds_volume.element.disabled = false;
				settings.manifest.Sounds_volume.bundle.setStyle("color", "#222");
			
				settings.manifest.Sounds_description.bundle.setStyle("color", "#555");
			
				settings.manifest.Sounds_name.element.setStyle("color", "#222");
				settings.manifest.Sounds_name.bundle.setStyle("color", "#222");
			
				settings.manifest.Sounds_choose.element.disabled = false;
				
				document.id("GCPlayButton").addEvent("click", audioToggle);
				document.id("GCPlayButton").setStyle("cursor", "pointer");
			}
			
		});
		settings.manifest.Sounds_enable.fireEvent("action");
		
		settings.manifest.GoogleApps_enable.addEvent("action", function (value) {
			if(!settings.manifest.GoogleApps_enable.get()) {
				settings.manifest.GoogleApps_domain.element.readonly = true;
				settings.manifest.GoogleApps_domain.element.setStyle("color", "#7F7F7F");
				settings.manifest.GoogleApps_domain.bundle.setStyle("color", "#7F7F7F");
			} else {
				settings.manifest.GoogleApps_domain.element.readonly = false;
				settings.manifest.GoogleApps_domain.element.setStyle("color", "#222");
				settings.manifest.GoogleApps_domain.bundle.setStyle("color", "#222");
			}
			
		});
		settings.manifest.GoogleApps_enable.fireEvent("action");
	});
});
