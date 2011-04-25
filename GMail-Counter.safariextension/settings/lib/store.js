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
    var Store;
    
    // MooTools features
    Array.prototype.$isArray = true;
    
    function typeOf(item) {
        if (item === undefined) {
            return "undefined";
        }
        
        if (item === null) {
            return "null";
        }
        
        if (item.$isArray) {
            return "array";
        }
        
        return typeof item;
    };
    
    function cloneItem(item) {
        if (typeOf(item) === "object") {
            return cloneObject(item);
        }
        
        if (typeOf(item) === "array") {
            return cloneArray(item);
        }
        
        return item;
    }
    
    function cloneObject(object) {
        var clone,
            key;
        
        clone = {};
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                clone[key] = cloneItem(object[key]);
            }
        }
        
        return clone;
    }
    
    function cloneArray(item) {
        var clone,
            i;
        
        clone = [];
        for (i = 0; i < item.length; i++) {
            clone[i] = cloneItem(item[i]);
        }
        
        return clone;
    }
    
    // Custom 3-way merge
    function merge() {
        var target,
            original,
            i,
            object;
        
        target = cloneObject(arguments[0]);
        original = cloneObject(arguments[0]);
        
        for (i = 1; i < arguments.length; i++) {
            object = arguments[i];
            
            // Remove keys from the target that were removed
            mergeRemove(target, original, object);
            
            // Merge the rest
            mergeCopy(target, original, object);
        }
        
        return target;
    }
    
    function mergeRemove(target, original, object) {
        var key;
        
        for (key in original) {
            if (original.hasOwnProperty(key)) {
                if (!object.hasOwnProperty(key)) {
                    delete target[key];
                } else if (typeOf(target[key]) === "object" && typeOf(original[key]) === "object" && typeOf(object[key]) === "object") {
                    mergeRemove(target[key], original[key], object[key]);
                }
            }
        }
    }
    
    function mergeCopy(target, original, object) {
        var key;
        
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                if (typeOf(object[key]) === "object" && (typeOf(target[key]) === "object" || typeOf(original[key]) === "object")) {
                    if (JSON.stringify(object[key]) !== JSON.stringify(original[key])) {
                        if (typeOf(target[key]) !== "object") {
                            target[key] = {};
                        }
                        
                        if (typeOf(original[key]) !== "object") {
                            original[key] = {};
                        }
                        
                        mergeCopy(target[key], original[key], object[key]);
                    }
                } else if (object[key] !== original[key] || typeOf(object[key]) === "object") {
                    target[key] = object[key];
                }
            }
        }
    }
    
    // Main store function
    Store = this.Store = function (name) {
        var storePrototype,
            originalStorage,
            store;
        
        storePrototype = {
            "save": function (noMerge) {
                var newStorage,
                    newStorageObj,
                    originalStorageObj,
                    save;
                
                // Check if localStorage has been updated by
                // another instance of store.js
                newStorage = localStorage.getItem(name);
                if (newStorage !== originalStorage && noMerge !== true) {
                    newStorageObj = JSON.parse(newStorage || "{}");
                    originalStorageObj = JSON.parse(originalStorage || "{}");
                    
                    save = merge(originalStorageObj, newStorageObj, this);
                } else {
                    save = this;
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
                    // Update the current state of localStorage,
                    // if we havn't merged
                    originalStorage = localStorage.getItem(name);
                }
                
                return this;
            },
            
            "clean": function () {
                var key;
                
                for (key in this) {
                    if (this.hasOwnProperty(key)) {
                        delete this[key];
                    }
                }
                
                return this;
            },
            
            "remove": function () {
                localStorage.removeItem(name);
                originalStorage = "{}";
                return this.clean();
            }
        };
        
        // Save the current state of localStorage
        originalStorage = localStorage.getItem(name);
        store = JSON.parse(localStorage.getItem(name) || "{}");
        store.__proto__ = storePrototype;
        return store;
    };
    
    Store.__proto__.initWithDefaults = function (name, obj) {
        var store,
            proto;
        
        store = Store(name);
        proto = store.__proto__;
        
        store = merge({}, obj, store);
        store.__proto__ = proto;
        
        return store;
    };
}());