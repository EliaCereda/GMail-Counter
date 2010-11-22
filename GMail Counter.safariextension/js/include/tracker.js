(function() {
    var storage = {
        "get": function(name) {
            var persistent = JSON.parse(localStorage.getItem(name));
            var nonpersistent = ((typeof safari) === "object") ?
                safari.extension.settings.getItem(name) :
                null;
            
            return (nonpersistent === null) ? persistent : nonpersistent;
        },
        
        "set": function(name, value, persistent) {
            if (persistent || (typeof safari) !== "object") {
                localStorage.setItem(
                    name,
                    JSON.stringify((value === undefined) ? null : value)
                );
            } else {
                safari.extension.settings.setItem(name, value);
            }
        }
    };
    
    var version = (new (function() {
        // ===============
        // = Constructor =
        // ===============
        var parse;
        
        // ===================
        // = Private Methods =
        // ===================
        parse = function(str) {
            // Remove double dots
            str = str.replace(/(\.)+/g, ".");
            
            // Remove dots at the start and end
            str = str.replace(/^\./, "");
            str = str.replace(/\.$/, "");
            
            return str;
        };
        
        // ======================
        // = Privileged Methods =
        // ======================
        this.compare = function(version1, version2) {
            var version1 = parse(version1),
                version2 = parse(version2),
                longer,
                shorter;
            
            if (version1 === version2) {
                return "equal";
            }
            
            version1 = version1.split(".");
            version2 = version2.split(".");
            longer = (version1.length >= version2.length) ? version1 : version2;
            shorter = (longer === version1) ? version2 : version1;
            
            for (index in longer) {
                if (Number(longer[index]) < Number(shorter[index])) {
                    return (longer === version1) ? "older" : "newer";
                }
                
                if (Number(longer[index]) > Number(shorter[index]) ||
                    (
                        shorter[index] === undefined &&
                        longer[index] !== "0"
                    )
                ) {
                    return (longer === version1) ? "newer" : "older";
                }
            }
            
            return "equal";
        };
        
        this.newer = function(version1, version2) {
            return (this.compare(version1, version2) === "newer");
        };
        
        this.older = function(version1, version2) {
            return (this.compare(version1, version2) === "older");
        };
        
        this.equal = function(version1, version2) {
            return (this.compare(version1, version2) === "equal");
        };
    }));
    
    var ExtTracker = this.ExtTracker = function(trackingID, extVersion) {
        // ===============
        // = Constructor =
        // ===============
        var trackingID = ((typeof trackingID) === "string") ? trackingID : "",
            uID,
            state = "started",
            extVersion = ((typeof extVersion) === "string") ? extVersion : "",
            push;
        
        // Installation state
        if (storage.get("ExtTracker.installed") === null) {
            state = "installed";
            storage.set("ExtTracker.installed", true);
            
            if (storage.get("ExtTracker.uID") !== null) {
                state = "reinstalled";
            }
        }
        
        // Upgrade state
        if (storage.get("ExtTracker.version") !== null) {
            var compare = version.compare(extVersion, storage.get("ExtTracker.version"));
            
            if (state === "started" && compare === "newer") {
                state = "upgraded";
            }
            
            if (compare === "older") {
                state = "downgraded";
            }
        }
        storage.set("ExtTracker.version", extVersion, true);
        
        // Unique ID
        uID = storage.get("ExtTracker.uID");
        if (uID === null) {
            uID = +(new Date);
            uID = (uID++).toString(36);
            storage.set("ExtTracker.uID", uID, true);
        }
        
        // ======================
        // = Privileged Methods =
        // ======================
        this.getUID = function() {
            return uID;
        };
        
        this.getState = function() {
            return state;
        };
        
        this.push = function() {
            if (storage.get("ExtTracker.logs") !== null) {
                var data,
                    request;
                
                data = "data=" + JSON.stringify({
                    "trackingID": trackingID,
                    "uID": uID,
                    "logs": storage.get("ExtTracker.logs")
                });
                storage.set("ExtTracker.logs", null, true);
                
                request = new XMLHttpRequest();
                request.open(
                    "POST",
                    "http://exttracker.appspot.com/request/push",
                    true
                );
                request.setRequestHeader(
                    "Content-type",
                    "application/x-www-form-urlencoded"
                );
                request.send(data);
                
                storage.set("ExtTracker.lastPush", +(new Date));
            }
        };
        
        this.logEvent = function(message) {
            var instantly,
                logs;
            
            instantly = (
                (+(new Date) - storage.get("ExtTracker.lastPush")) >
                (3 * 86400000)
            );
            
            logs = storage.get("ExtTracker.logs");
            if (logs === null) {
                logs = [];
            }
            logs.push({"message": message, "version": extVersion, "time": (+(new Date)).toString()});
            storage.set("ExtTracker.logs", logs, true);
            
            if (instantly) {
                this.push();
            }
        };
        
        // Autolog
        this.logEvent(state);
        if (state !== "started") {
            this.push();
        }
    };
})();
