Untangled JS
============

Untangled is a utility to transpile modern Javascript in a web worker, using babel-standalone 

![Demo Screenshot](https://raw.githubusercontent.com/Evanfeenstra/untangled/master/demo/demo-screenshot.png)

To try out the demo, start a web server in the root directory, such as "python -m SimpleHTTPServer"

API
===
```
UntangledClient.register(path_to_worker)
```
```
const code = await UntangledClient.transform({
	code: 'const JSXComponent = () => <div>Transform Me!</div>',
	compact: false,
})
```
```
UntangledClient.import(code)
```
To minify HTML:
```
const html = await UntangledClient.minify(
	`<body> 
		<div>
			this html will be minified
		</div> 
	</body>`
)
```

Inspired by this awesome project: https://github.com/edoardocavazza/unchained