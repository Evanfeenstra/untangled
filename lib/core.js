

((scope) => {

  //scope.importScripts('./html-minifier.min.js');
  var minify = require('html-minifier').minify;
  scope.addEventListener('message', function(event) {
    try { 
      if(event.data.type==='minify'){
        var options = event.data.options;
        options.log = function(message) {
          console.log(message);
        };
        scope.postMessage(minify(event.data.code, options));
      } else if(event.data.type==='babel'){
        var r = Babel.transform(event.data.code, event.data.options)
        scope.postMessage(r.code)
      }
    }
    catch (err) {
      scope.postMessage({
        error: err + ''
      });
    }
  });
  scope.postMessage(null);

})(self);

