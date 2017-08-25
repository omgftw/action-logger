# Action Logger
A library for recording end-user actions for use in creating bug reproduction steps for debugging purposes

## How to use
```javascript
actionLogger.listen(function(action) {  
    console.log(action);  
});  
```

## Goals
- [ ] Record user keyboard and mouse input (Actions)  
- [ ] JSON serializable actions with all necessary information  
- [ ] XPath information for each action
- [ ] Human-readable output of all actions  
- [ ] Extensibility  
