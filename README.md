Untangled JS
============

Untangled is a utility to transpile modern Javascript in a browser service worker, using babel-standalone 

![Demo Screenshot](https://raw.githubusercontent.com/Evanfeenstra/untangled/master/demo/demo-screenshot.png)

To try out the demo, start a web server in the root directory, such as "python -m SimpleHTTPServer"

API
===
```
UntangledClient.register(path_to_service_worker, service_worker_options)
```
```
UntangledClient.transform({
	code: 'const JSXComponent = () => <div>Transform Me!</div>',
	config: {
	    plugins: [
	      ["transform-react-jsx", {pragma:'h'}]
	    ],
	    compact: false,
	}
})
```
```
UntangledClient.import(code)
```

Inspired by this awesome project: https://github.com/edoardocavazza/unchained