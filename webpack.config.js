var Path = require('path');

module.exports = {
	entry: './src/scripts/client.jsx',
	output: {
		path: Path.join(__dirname, 'public'),
		filename: 'bundle.js',
		publicPath: '/public/'
	},
	devtool: 'cheap-module-source-map',
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: ['babel-loader'],
				include: Path.join(__dirname, 'src')
			},
			{
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader']
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx']
	}
};