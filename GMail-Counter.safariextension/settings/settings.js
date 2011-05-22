window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {
        console.log(settings);
        settings.manifest.Sounds_name.element.readOnly = true;  //Set sound name to read-only, as it will be set on sound change
        settings.manifest.Sounds_choose.addEvent("action", function(e){
            
            if (settings.manifest.Sounds_choose.element.value != "OK") {
                settings.manifest.Sounds_choose.element.value = "OK";
            } else {
                settings.manifest.Sounds_choose.element.value = settings.manifest.Sounds_choose.params.text;
            }
            alert("This is still TODO (issue #5)...");
        });
    });
});
