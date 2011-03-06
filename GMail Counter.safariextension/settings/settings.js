function receiveMessage(e) {
	if (e.origin !== "http://localhost:8080")
		return;

	console.log(e);
	localStorage['customSound'] = e.data;
	console.log("Sound %s been saved correctly", (localStorage['customSound'] === e.data)?"has":"hasn't");
}
window.addEventListener("message", receiveMessage, false);