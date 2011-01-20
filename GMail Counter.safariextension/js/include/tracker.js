//
// Copyright (c) 2011 Frank Kohlhepp
//
(function () {
    // =========
    // = store =
    // =========
    var Store;
    (function () {
        Store = function (name) {
            var storePrototype = {
                "save": function () {
                    var stringifiedObj = JSON.stringify(this);
                    localStorage.setItem(name, stringifiedObj);
                    
                    if (localStorage.getItem(name) !== stringifiedObj) {
                        return false;
                    } else {
                        return this;
                    }
                }
            };
            
            var store = JSON.parse(localStorage.getItem(name)) || {};
            store.__proto__ = storePrototype;
            return store;
        };
    })();
    
    // ========
    // = main =
    // ========
    (function () {
        var client_version = 2;
        window.ExtTracker = function (extensionId, version) {            
            // ======================
            // = Privileged Methods =
            // ======================
            this.getUserId = function () {
                return userId;
            };
            
            this.logEvent = function (name, data) {
                if ((typeof store.events) !== "object") {
                    store.events = [];
                }
                
                store.events.push({"name": name, "data": data, "version": version, "time": Math.round(+(new Date) / 1000)});
                store.save();
            };
            
            this.logValue = function (key, value) {
                if ((typeof store.values) !== "object") {
                    store.values = {};
                }
                
                store.values[key] = value;
                store.save();
            };
            
            var pushBrowserInfo = function () {
            		
            		var browser = {
            			platform: navigator.platform.toLowerCase().match(/mac|win|linux/)[0],
            			language: navigator.language.split("-")[0]
            		}
            		store.browser = browser;
            		store.save();

            		that.logValue("platform", browser.platform);
            		that.logValue("language", browser.language);
            };
            
            this.push = function () {
                var postData = "client_version=" + client_version + "&data=" + JSON.stringify({
                    "userId": userId,
                    "extensionId": extensionId,
                    "version": version,
                    
                    "events": store.events || null,
                    "values": store.values || null
                });
                
                var request = new XMLHttpRequest();
                request.open(
                    "POST",
                    "http://worldcerve.com/exttracker/push.php",
                    true
                );
                request.setRequestHeader(
                    "Content-type",
                    "application/x-www-form-urlencoded"
                );
                request.send(postData);
                
                store.events = [];
                store.values = {};
                store.save();
            };
            
            // ===============
            // = Constructor =
            // ===============
            var that = this,
                store = new Store("tracker"),
                userId = store.userId;
                browser = store.browser || {};
            
            if (!userId) {
                userId = +(new Date);
                userId = (userId++).toString(36);
                store.userId = userId;
                store.save();
            }
            
            if (!browser.platform || !browser.language) {
            	pushBrowserInfo();
            }
            
           	(function autoPush() {
                that.push();
                setTimeout(autoPush, 3600000);
            })();	
        };
    })();
})();
