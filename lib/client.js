((scope) => {

    class UntangledClient {

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

        static transform(m) {
            if (navigator.serviceWorker.controller && m.code && m.config){
                const defaultConfig = {
                    presets:[
                      ['stage-2', {"decoratorsLegacy":true}]
                    ],
                    sourceMaps:false
                }
                defaultConfig.plugins = m.config.plugins
                defaultConfig.compact = m.config.hasOwnProperty('compact') ?
                    m.config.compact : true
                return new Promise((resolve, reject) => {
                    this.listen().then((code)=>resolve(code))
                    navigator.serviceWorker.controller.postMessage({
                        code: m.code,
                        config: defaultConfig
                    });
                })
            }
        }

        static checkSupport() {
            if (!('serviceWorker' in navigator)) {
                throw 'Untangled cannot work without ServiceWorkers support.';
            }
            if (!('noModule' in document.createElement('script'))) {
                throw 'Untangled cannot work without ES6 modules support.';
            }
            return true;
        }

        static register(path, options) {
            if (this.checkSupport()) {
                // Register the SW and wait for installation complete.
                return navigator.serviceWorker.register(path, options)
                    .then(UntangledClient.waitRegistration)
                    .then(()=>{
                        if(!navigator.serviceWorker.controller){
                            window.location = window.location.origin
                            return Promise.reject()
                        } else {
                            return Promise.resolve()
                        }
                    })
            }
        }

        static waitRegistration(registration) {
            return new Promise((resolve) => {
                let installing = registration.installing || registration.waiting;
                if (installing) {
                    // The SW needs to be installed.
                    installing.addEventListener('statechange', () => {
                        if (installing.state === 'activated') {
                            // SW is ready.
                            UntangledClient.ready = true;
                            resolve();
                        }
                    });
                } else {
                    // SW already installed.
                    UntangledClient.ready = true;
                    resolve();
                }
            });
        }

    }

    // export UntangledClient
    scope.UntangledClient = UntangledClient;
})(window);
