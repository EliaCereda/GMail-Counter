var viewArray;

function initViewController() {
	a = safari.extension.settings.getItem("viewArray");
	if( a=="null" ) {
		viewArray = "[]";
	} else {
		viewArray = a;
	}
}

function setAsViewed(id) {
	if(id == "000-000") return 0;
	
	if(viewArray.indexOf(id) == -1) {
		a = JSON.parse(viewArray);
		a[a.length] = id;
		viewArray = JSON.stringify(a);
		safari.extension.settings.viewArray = viewArray;
	}
	return 0;
}

function setAsUnviewed(id) {
	if(id == "000-000") return 0;
	
	if(viewArray.indexOf(id) != -1) {
		a = JSON.parse(viewArray);
		a.forEach(function(value, key){
			if(a[key]==id) {
				a.splice(key,1);
			}
		});
		
		viewArray = JSON.stringify(a);
		safari.extension.settings.viewArray = viewArray;
	}
	return 0;
}

function getViewState(id) {
	if(id == "000-000") return true;
	
	if(viewArray.indexOf(id) == -1) {
		return true;
	} else {
		return false;
	}
}