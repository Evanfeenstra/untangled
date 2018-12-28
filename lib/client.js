((scope) => {

    class Untangled {

        constructor(){
            this.listening = false
            this.listen()
        }

        static listen() {
            if (this.checkSupport()) {
                return new Promise((resolve, reject) => {
                    navigator.serviceWorker.onmessage = function(e){
                        resolve(e.data)
                    }
                    this.listening = true
                })
            }
            return Promise.reject('not supported')
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

        static checkSupport() {
            if (typeof Worker === 'function') {
                return true
            } else {
                 throw 'Untangled cannot work without Web Worker support.';
            }
        }

        static register(path, options) {
          if (this.checkSupport()) {
            Untangled.worker = new Worker(path);
          }
        }

        static transform(m){
          return new Promise((resolve,reject) => {
            const defaultConfig = {
              presets:[['stage-2', {"decoratorsLegacy":true}]],
              sourceMaps:false,
              compact: false,
              plugins: [
                ["transform-react-jsx", {pragma:'h'}]
              ],
            }
            Untangled.worker.onmessage = function(event) {
              var data = event.data;
              if (data.error) reject(data.error)
              else resolve(data)
            }
            Untangled.worker.postMessage({
              type: 'babel',
              code: m.code,
              options: defaultConfig
            })
          })
          // return new Promise((resolve,reject) => {
          //   resolve()
          // })
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
              else resolve(data)
            }
            Untangled.worker.postMessage({
              type: 'minify',
              code: code,
              options: minifyOptions
            })
          })
        }

        static waitRegistration(registration) {
            return new Promise((resolve) => {
                let installing = registration.installing || registration.waiting;
                if (installing) {
                    // The SW needs to be installed.
                    installing.addEventListener('statechange', () => {
                        if (installing.state === 'activated') {
                            // SW is ready.
                            Untangled.ready = true;
                            resolve();
                        }
                    });
                } else {
                    // SW already installed.
                    Untangled.ready = true;
                    resolve();
                }
            });
        }

    }

    // export Untangled
    scope.Untangled = Untangled;
})(window);
