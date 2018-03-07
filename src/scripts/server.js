import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/app';
import reducers from './reducers';

const app = Express();
const port = 8000;

app.use('./public', Express.static('static'));

app.use(handleRender);

function handleRender(request, response) { 
	const store = createStore(reducers);

	const html = renderToString(
		<Provider store={store}>
			<App />
		</Provider>
	);

	const preloadedState = store.getState();

	response.send(renderFullPage(html, preloadedState));
}

function renderFullPage(html, preloadedState) {
	return `<!doctype html>
	<html>
		<head>
			<title>Redux Universal Example</title>
		</head>
		<body>
			<div id="root">${html}</div>
			<script>
				// WARNING: See the following for security issues around embedding JSON in HTML:
				// http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
				window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
			</script>
			<script src="/static/bundle.js"></script>
		</body>
	</html>`;
}

app.listen(port);
console.log('Server running at http://localhost:' + port + '/');