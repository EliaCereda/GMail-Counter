window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    
	new FancySettings.initWithManifest(function (settings) {
		console.log(settings);
		settings.manifest.Sounds_name.element.readOnly = true;
		
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
						store = new Store("settings");
						store.set("Sounds_name", e.data.data.name);
						settings.manifest.Sounds_name.element.value = e.data.data.name;
						
						store.set("Hidden_audioData", "data:"+e.data.data.mimetype+";base64,"+e.data.data.audio);
						console.log(e);
				}
			}, false);
		});
	});
    
    // Option 2: Do everything manually:
    
    // var settings = new FancySettings("My Extension");
    // 
    // var checkbox1 = settings.create("tabName", "groupName", "checkbox", {
    //     "name": "checkbox1",
    //     "label": "Enable this"
    // });
    // 
    // checkbox1.addEvent("action", function (value) {
    //     alert("you toggled me: " + value);
    // });
});
