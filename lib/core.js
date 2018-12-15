((scope) => {

    async function transform(m) {
        if(m.code && m.config){
            return Babel.transform(m.code, m.config)
        }
    }

    scope.addEventListener('message', e => {
      if (e.data) {
        transform(e.data).then((a)=>{
          if(a.code){
            this.clients.matchAll().then(clients => {
              clients.forEach(client => client.postMessage(a.code));
            });
          }
        })
      }
    })

    // these arnt eowkring...
    scope.addEventListener('install', (event) => {
      return scope.skipWaiting()
    });

    scope.addEventListener('activate', (event) => {
      return scope.clients.claim()
    });

})(self);


