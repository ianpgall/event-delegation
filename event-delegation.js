var addEvent = (function () {
    "use strict";
    
    var executeCallback = function (callbackFunction, context, evnt) {
        var result = Function.prototype.call.call(callbackFunction, context, evnt);
        if (result === false) {
            if (evnt.preventDefault) {
                evnt.preventDefault();
            }
            evnt.returnValue = false;
        }
    }, generateNormalHandler = function (callb) {
        return function (e) {
            e = e || window.event;
            executeCallback(callb, this, e);
        };
    }, generateDelegateHandler = function (sel, callb) {
        return function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement,
                i, cur, isMatch = false,
                matches = this.querySelectorAll(sel),
                matchesLength = matches.length;
            while (target && target !== this) {
                for (i = 0; !isMatch && i < matchesLength; i++) {
                    if (matches[i] === target) {
                        isMatch = true;
                    }
                }
                if (isMatch) {
                    executeCallback(callb, target, e);
                    target = null;
                } else {
                    target = target.parentNode;
                }
            }
        };
    }, actualHandler = (function () {
        var binder = (function () {
            var tester = document.createElement("div");
            if (tester.addEventListener) {
                return function (el, en, cb) {
                    el.addEventListener(en, cb, false);
                };
            } else if (tester.attachEvent) {
                return function (el, en, cb) {
                    el.attachEvent("on" + en, cb);
                };
            }
        })(), mainHandler = function (element, eventName, filterOn, callback) {
            var handler;
            if (typeof filterOn === "string" && filterOn) {
                // Delegate
                handler = generateDelegateHandler(filterOn, callback);
            } else {
                // Normal
                handler = generateNormalHandler(filterOn ? filterOn : callback);
            }
            binder(element, eventName, handler);
        };
        
        return mainHandler;
    })();
    
    return actualHandler;
})();
