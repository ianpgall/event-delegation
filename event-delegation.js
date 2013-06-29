(function (w) {
    "use strict";

    var F, O, executeCallback, generateNormalHandler,
        generateDelegateHandler, bindChooser, handleBinding, exposedHandler;

    F = function () {};
    O = {};

    executeCallback = function (callbackFunction, context, evnt) {
        var result;
        result = F.call.call(callbackFunction, context, evnt);
        if (result === false) {
            if (evnt.preventDefault) {
                evnt.preventDefault();
            } else {
                evnt.returnValue = false;
            }
        }
    };

    generateNormalHandler = function (callb) {
        var func;
        func = function (e) {
            e = e || window.event;
            executeCallback(callb, this, e);
        };
        return func;
    };

    generateDelegateHandler = function (sel, callb) {
        var func;
        func = function (e) {
            var target, i, isMatch, matches, matchesLength;
            e = e || window.event;
            target = e.target || e.srcElement;
            isMatch = false;
            matches = this.querySelectorAll(sel);
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
        return func;
    };

    bindChooser = (function () {
        var tester, binder;
        tester = document.createElement("div");
        if (tester.addEventListener) {
            binder = function (el, en, cb) {
                el.addEventListener(en, cb, false);
            };
        } else if (tester.attachEvent) {
            binder = function (el, en, cb) {
                el.attachEvent("on" + en, cb);
            };
        } else {
            binder = function () {};
        }
        return binder;
    }());

    handleBinding = function (el, en, fo, cb) {
        var han;
        if (typeof fo === "string" && fo) {
            // Delegated
            han = generateDelegateHandler(fo, cb);
        } else {
            // Normal
            han = generateNormalHandler(cb || fo);
        }
        bindChooser(el, en, han);
    };

    exposedHandler = function (element, eventName, filterOn, callback) {
        var name, evtObj, curCallback;
        if (O.toString.call(eventName) === "[object Object]") {
            evtObj = eventName;
            for (name in evtObj) {
                curCallback = evtObj[name];
                handleBinding(element, name, filterOn, curCallback);
            }
        } else {
            handleBinding(element, eventName, filterOn, callback);
        }
    };

    w.addEvent = exposedHandler;
}(window));
