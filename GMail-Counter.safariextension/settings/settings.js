window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    
	new FancySettings.initWithManifest("manifest.json", function (settings) {
		settings.manifestOutput.Sounds_name.element.readOnly = true;	//Set sound name to read-only, as it will be set on sound change
		settings.manifestOutput.Sounds_choose.addEvent("action", function(){
			alert("This is still TODO (issue #5)...");
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
