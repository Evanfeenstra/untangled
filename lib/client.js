((scope) => {

    class UntiedClient {

        static checkSupport() {
            if (!('serviceWorker' in navigator)) {
                throw 'Untied cannot work without ServiceWorkers support.';
            }
            if (!('noModule' in document.createElement('script'))) {
                throw 'Untied cannot work without ES6 modules support.';
            }
            return true;
        }

        static register(path, options, config = DEFAULT_CONFIG) {
            if (this.checkSupport()) {
                // Register the SW and wait for installation complete.
                return navigator.serviceWorker.register(path, options)
                    .then(UntiedClient.waitRegistration);
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
                            UntiedClient.ready = true;
                            resolve();
                        }
                    });
                } else {
                    // SW already installed.
                    UntiedClient.ready = true;
                    resolve();
                }
            });
        }

        static import(code) {
            return new Promise((resolve, reject) => {
                let script = document.createElement('script');
                script.type = 'text/javascript';
                script.addEventListener('load', () => {
                    // script ready
                    resolve();
                });
                script.addEventListener('error', (err) => {
                    // script error
                    reject(err);
                });
                script.text = code;
                // import it.
                document.head.appendChild(script);
            })
        }

    }

    // export UntiedClient
    scope.UntiedClient = UntiedClient;
})(window);
