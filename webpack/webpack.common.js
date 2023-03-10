const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'prod';

module.exports = {
	entry: {
		app: path.resolve(__dirname, '..', 'src', 'index.tsx'),
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.scss'],
	},
	optimization: {
		moduleIds: 'deterministic',
		splitChunks: {
			cacheGroups: {
				vendor: {
					name: 'vendors',
					test: /node_modules/,
					chunks: 'all',
					enforce: true,
				},
			},
		},
	},
	output: {
		publicPath: '/',
		path: path.resolve(__dirname, '..', 'build'),
		filename: 'js/[name].[contenthash].js',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/,
				use: [
					{
						loader: 'babel-loader',
						// options: {
						// 	plugins: [
						// 		[
						// 			'react-remove-properties',
						// 			{ properties: ['data-testid'] },
						// 		],
						// 	],
						// },
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.module\.s(a|c)ss$/,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: devMode,
							modules: {
								auto: true,
								localIdentName: devMode
									? '[folder]__[local]__[hash:base64:5]'
									: '[local]__[hash:base64:5]',
							},
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: devMode,
							postcssOptions: {
								config: `./postcss.config.js`,
							},
						},
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: devMode },
					},
				],
			},
			{
				test: /\.css$/,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { sourceMap: devMode },
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: devMode,
							postcssOptions: {
								config: `./postcss.config.js`,
							},
						},
					},
				],
			},
			{
				test: /\.s(a|c)ss$/,
				exclude: /\.module.(s(a|c)ss)$/,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { sourceMap: devMode },
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: devMode,
							postcssOptions: {
								config: `./postcss.config.js`,
							},
						},
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: devMode },
					},
				],
			},
			{
				test: /\.svg$/,
				issuer: /\.[jt]sx?$/,
				use: ['@svgr/webpack'],
			},
			{
				test: /\.(ico|gif|png|jpg|jpeg)$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/img/[name][ext][query]',
				},
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf|)$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[name][ext][query]',
				},
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash].css',
			chunkFilename: 'css/[id].[contenthash].css',
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '..', 'src', 'index.html'),
			inject: 'body',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'src/assets/img', to: 'assets/img' },
				{ from: 'src/assets/static', to: 'assets/static' },
			],
		}),
	],
	stats: 'errors-only',
};
