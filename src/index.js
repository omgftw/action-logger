var logger = require('./logger.js');

window.actionLogger = {
  actions: [],
  ignoreKeys: [16, 17, 18],
  eventHandlers: []
  // keyUpElements: []
};

(function () {
  //calls correct handling code dependent on factors such as tag type
  function dispatch(e) {
    let keyupIgnore = ["INPUT", "TEXTAREA"];
    if (e.type === "keyup" && keyupIgnore.indexOf(e.target.tagName) === -1 && !e.repeat) {
      return handleKeyUp(e);
    }

    let keydownIgnore = ["INPUT", "TEXTAREA"];
    if (e.type === "keydown" && keydownIgnore.indexOf(e.target.tagName) === -1 && !e.repeat) {
      return handleKeyDown(e);
    }

    let keypressTargets = ["INPUT", "TEXTAREA"];
    if (e.type === "keypress" && keypressTargets.indexOf(e.target.tagName) !== -1) {
      return handleKeyPress(e);
    }
  }

  function createAction(e, actionType) {
    return {
      key: e.key,
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
  }



  function handleKeyDown(e) {
    let action = createAction(e, "keyboard");

    //prevent capture of passwords
    if (e.target.type === "password") {
      action.key = "*";
      action.which = 42;
    }

    actionLogger.actions.push(action);

    emitEvent(action);
  }

  function handleKeyUp(e) {
    let action = createAction(e, "keyboard");

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

    let action = createAction(e, "keyboard");

    //prevent capture of passwords
    if (e.target.type === "password") {
      action.key = "*";
      action.which = 42;
    }

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
    return () => {
      element.removeEventListener(eventType, dispatch);
    };
  }

  //calls all attached listener callbacks
  function emitEvent(action) {
    let handlers = actionLogger.eventHandlers;
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

  window.testing1 = addListener(document, "keydown");
  window.testing2 = addListener(document, "keyup");
  window.testing3 = addListener(document, "keypress");

  actionLogger.listen(action => {
    logger.log(action);
  })

  logger.log('action-logger loaded successfully');
})();