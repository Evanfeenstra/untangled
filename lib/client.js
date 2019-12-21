((scope) => {

    class Untangled {

        static checkSupport() {
          if (typeof Worker === 'function') {
            return true
          } else {
            throw 'Untangled cannot work without Web Worker support.';
          }
        }

        static register(path, options) {
          return new Promise((resolve) => {
            if (this.checkSupport()) {
              Untangled.worker = new Worker(path);
              Untangled.worker.onmessage = function() {
                resolve()
              };
            }
          })
        }

        static transform(m){
          return new Promise((resolve,reject) => {
            const defaultConfig = {
              presets:[['stage-2', {"decoratorsLegacy":true}]],
              sourceMaps:false,
              compact: m.compact || false,
              plugins: [
                ["transform-react-jsx", {pragma:'h'}]
              ],
            }
            Untangled.worker.onmessage = function(event) {
              var data = event.data
              if(!data) return
              if (data.error) {
                return reject(data.error)
              }
              if (!data.type==='babel') {
                return reject('use await')
              }
              else resolve(data)
            }
            Untangled.worker.postMessage({
              type: 'babel',
              code: m.code,
              options: defaultConfig
            })
          })
        }

        static minify(code){
          return new Promise((resolve) => {
            var minifyOptions = {
              collapseWhitespace:true,
              removeComments:true,
              removeOptionalTags:true,
              removeRedundantAttributes:true,
              removeScriptTypeAttributes:true,
              removeTagWhitespace:true,
              useShortDoctype:true,
              minifyCSS:true,
              minifyJS:true,
            }
            Untangled.worker.onmessage = function(event) {
              var data = event.data;
              if (data.error) reject(data.error)
              if (!data.type==='minify') reject('use await')
              else resolve(data)
            }
            Untangled.worker.postMessage({
              type: 'minify',
              code: code,
              options: minifyOptions
            })
          })
        }

        static import(code) {
          return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.addEventListener('load', () => {
              resolve();
            });
            script.addEventListener('error', (err) => {
              reject(err);
            });
            script.text = code;
            document.head.appendChild(script);
          })
        }


    }

    // export Untangled
    scope.Untangled = Untangled;
})(window);
