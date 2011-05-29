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
				Sounds_choose.element.value = "OK";
				
				var cancel = new Element("input");
				cancel.id = "GCCancelButton"
				cancel.type = "button";
				cancel.value = "Cancel";
				cancel.addEvent("click", function() {
					Sounds_choose.element.value = Sounds_choose.params.text;

					document.id("GCCancelButton").destroy();
					document.id("GCiFrame").destroy();
				});
				
				cancel.inject(Sounds_choose.container);
				
				var iframe = new Element("iframe");
				iframe.id = "GCiFrame";
				iframe.src = "http://localhost:8080/";
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
						Sounds_choose.element.value = "Close";
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
