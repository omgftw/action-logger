/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var logger = __webpack_require__(1);

window.actionLogger = {
  actions: [],
  ignoreKeys: [16, 17, 18],
  eventHandlers: [],
  defaultListeners: []
};

(function () {
  //calls correct handling code dependent on factors such as tag type
  function dispatch(e) {
    var keyupIgnore = ["INPUT", "TEXTAREA"];
    if (e.type === "keyup" && keyupIgnore.indexOf(e.target.tagName) === -1 && !e.repeat) {
      return handleKeyUp(e);
    }

    var keydownIgnore = ["INPUT", "TEXTAREA"];
    if (e.type === "keydown" && keydownIgnore.indexOf(e.target.tagName) === -1 && !e.repeat) {
      return handleKeyDown(e);
    }

    var keypressTargets = ["INPUT", "TEXTAREA"];
    if (e.type === "keypress" && keypressTargets.indexOf(e.target.tagName) !== -1) {
      return handleKeyPress(e);
    }

    if (e.type === "mousedown" || e.type === "mouseup") {
      return handleMouse(e);
    }
  }

  function createAction(e, actionType) {
    var action = {
      which: e.which,
      type: e.type,
      event: e,
      element: e.target,
      actionType: actionType,
      elementId: e.target.id,
      elementClasses: e.target.classList,
      elementTagName: e.target.tagName,
      elementType: e.target.type,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      date: new Date()
    };

    if (actionType === "keyboard") {
      action.key = e.key;
    }

    if (actionType === "mouse") {
      action.clientX = e.clientX;
      action.clientY = e.clientY;
      action.layerX = e.layerX;
      action.layerY = e.layerY;
      action.offsetX = e.offsetX;
      action.offsetY = e.offsetY;
      action.pageX = e.pageX;
      action.pageY = e.pageY;
      action.screenX = e.pageY;
      action.screenY = e.pageY;
    }

    return action;
  }

  function handleKeyDown(e) {
    var action = createAction(e, "keyboard");

    //prevent capture of passwords
    if (e.target.type === "password") {
      action.key = "*";
      action.which = 42;
    }

    actionLogger.actions.push(action);

    emitEvent(action);
  }

  function handleKeyUp(e) {
    var action = createAction(e, "keyboard");

    //prevent capture of passwords
    if (e.target.type === "password") {
      action.key = "*";
      action.which = 42;
    }

    actionLogger.actions.push(action);

    emitEvent(action);
  }

  function handleKeyPress(e) {
    if (actionLogger.ignoreKeys.indexOf(e.which) !== -1) {
      return;
    }

    var action = createAction(e, "keyboard");

    //prevent capture of passwords
    if (e.target.type === "password") {
      action.key = "*";
      action.which = 42;
    }

    actionLogger.actions.push(action);

    emitEvent(action);
  }

  function handleMouse(e) {
    var action = createAction(e, "mouse");

    actionLogger.actions.push(action);

    emitEvent(action);
  }

  //TBI
  function handleOther(e) {
    var action = createAction(e, "");

    actionLogger.actions.push(action);

    emitEvent(action);
  }

  //Adds a js event listener that will be handled by actionLogger
  function addListener(element, eventType) {
    //if passed arg is a string, assume it's a css selector
    if (typeof element === "string") {
      element = document.querySelector(element);
    }

    //Add the key up event handler
    element.addEventListener(eventType, dispatch);

    //return an event listener cancel function
    return function () {
      element.removeEventListener(eventType, dispatch);
    };
  }

  //calls all attached listener callbacks
  function emitEvent(action) {
    var handlers = actionLogger.eventHandlers;
    for (var i = 0; i < handlers.length; i++) {
      handlers[i](action);
    }
  }

  actionLogger.getActions = function () {
    return actionLogger.actions;
  };

  actionLogger.listen = function (callback) {
    actionLogger.eventHandlers.push(callback);
  };

  //currently non-functional due to recording change
  // actionLogger.getActionsText = function () {
  //   let actions = actionLogger.actions;
  //   let consolidatedActions = [];
  //   let previousAction = null;
  //   let currentText = "";
  //   let ignoredKeys = ["Tab"];
  //   for (var i = 0; i < actions.length; i++) {
  //     //first action
  //     if (previousAction === null) {
  //       if (actions[i].type === "keyboard") {
  //         currentText += actions[i].key;
  //       } else {
  //         consolidatedActions.push(actions[i]);
  //       }
  //       previousAction = actions[i];
  //       continue;
  //     }

  //     //action was performed on the same element as the previous action
  //     if (actions[i].element === previousAction.element) {
  //       if (
  //         actions[i].type === "keyboard" &&
  //         previousAction.type === "keyboard" &&
  //         ignoredKeys.indexOf(actions[i].key) === -1
  //       ) {
  //         currentText += actions[i].key;
  //       }
  //     }
  //     //action was performed on another element
  //     else {
  //       if (currentText !== "") {
  //         consolidatedActions.push({ element: actions[i].element, text: currentText });
  //         currentText = "";
  //         //if the current action is a keyboard action
  //         if (actions[i].type === "keyboard" && ignoredKeys.indexOf(actions[i].key) === -1) {
  //           currentText = actions[i].key;
  //         }
  //       } else {
  //         consolidatedActions.push(actions[i]);
  //       }
  //     }

  //     previousAction = actions[i];
  //   }
  //   if (currentText !== "") {
  //     consolidatedActions.push({ element: actions[i].element, text: currentText });
  //   }

  //   return consolidatedActions;
  // };

  actionLogger.defaultListeners.push(addListener(document, "keydown"));
  actionLogger.defaultListeners.push(addListener(document, "keyup"));
  actionLogger.defaultListeners.push(addListener(document, "keypress"));
  actionLogger.defaultListeners.push(addListener(document, "mousedown"));
  actionLogger.defaultListeners.push(addListener(document, "mouseup"));

  actionLogger.listen(function (action) {
    logger.log(action);
  });

  logger.log('action-logger loaded successfully');
})();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  log: function log(text) {
    if (false) {
      console.log(text);
    }
  },
  warn: function warn(text) {
    if (false) {
      console.warn(text);
    }
  },
  error: function error(text) {
    if (false) {
      console.error(text);
    }
  }
};

/***/ })
/******/ ]);