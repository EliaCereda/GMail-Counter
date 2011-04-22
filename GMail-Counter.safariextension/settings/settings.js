window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    
     new FancySettings.initWithManifest("manifest.json", function (settings) {
	
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
