//
// Copyright (c) 2011 Frank Kohlhepp
// License: MIT-license
// https://github.com/frankkohlhepp/store
//
(function () {
    window.Store = function (name) {
        var storePrototype = {
            "save": function () {
                var stringifiedObj = JSON.stringify(this);
                localStorage.setItem(name, stringifiedObj);
                
                if (localStorage.getItem(name) !== stringifiedObj) {
                    return false;
                } else {
                    return this;
                }
            },
            
            "clean": function () {
                localStorage.removeItem(name);
            }
        };
        
        var store = (localStorage.getItem(name)) ? JSON.parse(localStorage.getItem(name)) : {};
        store.__proto__ = storePrototype;
        return store;
    };
})();