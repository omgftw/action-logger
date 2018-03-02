# Action Logger
A library for recording end-user actions for use in creating bug reproduction steps for debugging purposes

## How to use
Add dist/actionLogger.js to your page  
You can be notified of any logged events by using the listen function:
```javascript
actionLogger.listen(function(action) {  
    console.log(action);  
});  
```
You can also view all recorded actions via the getActions function:
```javascript
actionLogger.getActions();
```

## Development
Install NPM packages
```
npm install
```
Install webpack dev server globally
```
npm install -g webpack-dev-server
```  
Run the webpack dev server
```
webpack-dev-server --config=webpack.config.dev.js
```  
Open the webpack dev server in your browser
```
http://localhost:8080/
or directly to the test page:
http://localhost:8080/src/test.html
```

## Build
Install NPM packages
```
npm install
```
Install webpack-cli globally
```
npm install -g webpack-cli
```  
Run webpack-cli
```
webpack-cli
```
The built files can be found in dist/

## Goals
- [ ] Record user keyboard and mouse input (Actions)  
- [ ] JSON serializable actions with all necessary information  
- [ ] XPath information for each action
- [ ] Human-readable output of all actions  
- [ ] Extensibility  
