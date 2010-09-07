var version;
var installedVersion;
var targetURL = "http://elix14.altervista.org/Extensions/GMail%20Counter/WhatsNew/";

function checkInstalledVersion() {
	version = safari.extension.settings.version;
	installedVersion = safari.extension.settings.installedVersion;
	
	if (installedVersion == 0) {
		safari.extension.settings.installedVersion = version;
		safari.application.openBrowserWindow().activeTab.url = targetURL+"?v="+version;
	} else if (installedVersion != version) {
		safari.application.openBrowserWindow().activeTab.url = targetURL+"?v="+version+"&pV="+installedVersion;
		safari.extension.settings.installedVersion = version;
	}
}