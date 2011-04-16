//
// Copyright (c) 2011 Frank Kohlhepp
// https://github.com/frankkohlhepp/store-js
// License: MIT-license
//
// Contains a small and customized part of MooTools
// Copyright (c) 2006-2010 Valerio Proietti
// http://mootools.net/
// License: MIT-license
//
(function () {
    Array.prototype.$family = function () { return "array"; };
    
    function typeOf(item) {
        if (item === null) {
            return "null";
        }
        
        if (item.$family) {
            return item.$family();
        }
        
        return typeof item;
    };
    
    function cloneObject(object) {
        var clone = {};
        for (var key in object) {
            clone[key] = cloneItem(object[key]);
        }
        
        return clone;
    }
    
    function cloneArray(item) {
        var i = item.length,
            clone = new Array(i);
        
        while (i--) {
            clone[i] = cloneItem(item[i]);
        }
        
        return clone;
    }
    
    function cloneItem(item) {
        if (typeOf(item) === "array") {
            return cloneArray(item);
        } else if (typeOf(item) === "object") {
            return cloneObject(item);
        } else {
            return item;
        }
    }
    
    function merge() {
        var target = cloneObject(arguments[0]),
            original = cloneObject(arguments[0]);
        
        for (var i = 1; i < arguments.length; i++) {
            var object = arguments[i];
            
            // Remove keys from the target, that were removed
            for (var key in original) {
                if (original.hasOwnProperty(key)) {
                    if (!object.hasOwnProperty(key)) {
                        delete target[key];
                    } else if (typeof object[key] === "object" && object[key] !== null) {
                        target[key] = merge(original[key], object[key]);
                    }
                }
            }
            
            // Merge the rest
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    if (typeof object[key] === "object" && object[key] !== null) {
                        target[key] = merge(original[key], object[key]);
                    } else if (object[key] !== original[key]) {
                        target[key] = object[key];
                    }
                }
            }
        }
        
        return target;
    }
    
    this.Store = function (name) {
        // Creates a new prototype for every store
        // because the name variable is transmitted
        // via a closure.
        var storePrototype = {
            "save": function () {
                var newStorage = localStorage.getItem(name);
                if (newStorage !== originalStorage) {
                    var newStorageObj = JSON.parse(newStorage || "{}");
                    originalStorageObj = JSON.parse(originalStorage || "{}");
                    
                    var save = merge(originalStorageObj, newStorageObj, this);
                } else {
                    var save = this;
                }
                
                try {
                    localStorage.setItem(name, JSON.stringify(save));
                } catch (e) {
                    if (e.code === 22) {
                        throw "quotaExceeded";
                    } else {
                        throw "unknownError"
                    }
                }
                
                if (save === this) {
                    originalStorage = localStorage.getItem(name);
                }
                
                return this;
            },
            
            "remove": function () {
                localStorage.removeItem(name);
                
                // Restore to a clean store
                for (var key in this) {
                    if (this.hasOwnProperty(key)) {
                        delete this[key];
                    }
                }
                
                return this;
            }
        };
        
        // Save the current state in localStorage
        var originalStorage = localStorage.getItem(name),
            store = JSON.parse(localStorage.getItem(name)  || "{}");
        store.__proto__ = storePrototype;
        return store;
    };
}());
