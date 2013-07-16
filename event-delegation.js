(function (w) {
	"use strict";

	var O, allHandlers, tester, executeCallback,
		generateNormalHandler, generateDelegateHandler, generateAttacher,
		bindChooser, remover, handleBinding, exposedHandler;

	O = {};
	allHandlers = [];
	tester = document.createElement("div");

	executeCallback = function (callbackFunction, context, evnt) {
		var result;
		result = callbackFunction.call(context, evnt);
		if (result === false) {
			if (evnt.preventDefault) {
				evnt.preventDefault();
			} else {
				evnt.returnValue = false;
			}
			if (evnt.stopPropagation) {
				evnt.stopPropagation();
			} else {
				evnt.cancelBubble = true;
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

	generateAttacher = function (ele, callB) {
		var ret;
		ret = function (e) {
			var cbRet;
			e = e || window.event;
			cbRet = callB.call(ele, e);
			if (cbRet === false) {
				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
			}
		};
		return ret;
	};

	if (tester.addEventListener) {
		bindChooser = function (el, en, cb) {
			allHandlers.push({
				element: el,
				eventName: en,
				callback: cb
			});
			el.addEventListener(en, cb, false);
		};
		remover = function (el, en, cb) {
			el.removeEventListener(en, cb);
		};
	} else if (tester.attachEvent) {
		bindChooser = function (el, en, cb) {
			var finalCallback;
			finalCallback = generateAttacher(el, cb);
			allHandlers.push({
				element: el,
				eventName: en,
				callback: finalCallback
			});
			el.attachEvent("on" + en, finalCallback);
		};
		remover = function (el, en, cb) {
			el.detachEvent("on" + en, cb);
		};
	}

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

	exposedHandler(window, "load", function () {
		var i, j, cur;
		for (i = 1, j = allHandlers.length; i < j; i++) {
			cur = allHandlers[i];
			remover(cur.element, cur.eventName, cur.callback);
		}
	});

	w.addEvent = exposedHandler;
}(window));
