


const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const uglify = require('uglifyjs-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';


if(isDev) {
	console.log('当前模式:', '\x1B[32mdev\x1B[0m')
} else {
	console.log('当前模式:', '\x1B[91mprod\x1B[0m')
}

module.exports = {
	devtool: isDev ? 'cheap-module-eval-source-map' : '',
	mode: isDev ? 'development' : 'production',
	/*
	entryfs: {
		main: ['./src/index.js', ...isDev ? ['webpack-hot-middleware/client?noInfo=true&reload=true'] : []],
		login: ['./src/login.js',...isDev ? ['webpack-hot-middleware/client?noInfo=true&reload=true'] : []],
	},
	*/

	entry: function () {

		var glob = require("glob")
		var mg = glob.sync("./src/entry/*.js", {});

		var a = {};
		mg.forEach(function (it, i) {
			var fileName = it.match(/(\w+)\.js/)[1];
			a[fileName] = [it, ...isDev ? ['webpack-hot-middleware/client?noInfo=false&reload=true'] : []]
		})

		return a;
	}(),

	output: {
		pathinfo: true, //输入代码添加额外的路径注释，提高代码可读性
		filename: isDev ? function (data, i) {
			process.env.hash = data.hash;
			/**
			 * a.hash
			 * a.chunk.renderedHash
			 */
			return '[name]-[hash].js'
		} : '[name]-[chunkhash].js',
		publicPath: '',
		hashDigestLength: 4
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					query: {
						presets: ['env'] //按照最新的ES6语法规则去转换
					}
				},
			}, {
				test: /\.html$/,
				use: [
					{
						loader: "html-loader",
						options: { minimize: false }
					}
				]
			}, {
				test: /\.css$/,
				use: [
					...isDev ? ['css-hot-loader'] : [],
					"style-loader",
					"css-loader"
				]
			/*}, {
				test: /index\.pug$/,
				use: ['raw-loader', 'pug-html-loader']
			}, {
				test: /\.pug$/,
				use: ['pug-html-loader']
			*/}, {
				test: /\.vue$/,
				use: 'vue-loader'
			}, {
				test: /\.(gif|png|jpg|woff|ttf|eot|xlsx)$/,//图片的处理
				use: [{
					loader: 'url-loader',
					options: {
						limit: 500,//当图片小于这个值他会生成一个图片的url 如果是一个大于的他会生成一个base64的图片在js里展示
						//outputPath: '/',// 指定打包后的图片位置
						name: '[name].[ext]?[hash:8]',//name:'[path][name].[ext]
						//publicPath:output,
					}
				}]
			}
		]
	},
	plugins: [

		new webpack.DllReferencePlugin({
			context: __dirname,
			manifest: require("./dll/vendors-manifest.json")
		}),

		/*
		new HtmlWebPackPlugin({
			template: "./src/index.html",
			filename: "./index.html",
			chunksSortMode: 'none',
			chunks: ['main', "runtime"],
		}),
		new HtmlWebPackPlugin({
			template: "./src/index.html",
			filename: "./login.html",
			chunksSortMode: 'none',
			chunks: ['login', "runtime"],
		}),
		*/

		/*
		new HtmlWebPackPlugin({
			template: "./src/index.html",
			filename: "./m1.html",
			chunksSortMode: 'none',
			chunks: ['m1', "runtime"],
		}),
		*/
		...(function () {

			if (isDev) {
				return [];
			}

			var glob = require('glob')

			var a = [];

			var mg = glob.sync("./src/entry/*.js", {});

			mg.forEach(function (it, i) {
				// ./src/entry/m1.js

				var fileName = it.match(/(\w+)\.js/)[1];
				a.push(new HtmlWebPackPlugin({
					template: "./src/index.html",
					filename: `./${fileName}.html`,
					chunksSortMode: 'none',
					inject: 'none',
					chunks: ['runtime', 'vendor', fileName],
				}));
			});

			return a;
		}()),

		new webpack.NamedModulesPlugin(),
		new VueLoaderPlugin(),
		
		new webpack.DefinePlugin({
			__DEV__: JSON.stringify(JSON.parse(isDev))
		}),

		...
		isDev ? [
			new webpack.HotModuleReplacementPlugin()
		] : [
			new uglify({
				extractComments: {
					condition: true,
					filename(file) {
						return `${file}`;
					},
					banner(commentsFile) {
						return `Copyright Alex Sun All Rights Reserved`;
					}
				}
			}),
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: "[name]-[chunkhash].css",
				chunkFilename: "[name]-[chunkhash].css"
			})
		]
	],

	optimization: {
		minimize: false, //是否进行代码压缩
		/*
		runtimeChunk: {
		  name: 'runtime'
		},
		*/
		splitChunks: {
			chunks: "all", //默认为async，表示只会提取异步加载模块的公共代码，initial表示只会提取初始入口模块的公共代码，all表示同时提取前两者的代码。
			minSize: 30000, //模块大于30k会被抽离到公共模块
			minChunks: 2, //模块出现1次就会被抽离到公共模块
			maxAsyncRequests: 6, //异步模块，一次最多只能被加载5个
			maxInitialRequests: 3, //入口模块最多只能加载3个
			name: true,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendor",
					filename: '[name]-[hash].js',
					priority: 10,
				},
				common: {
					name: "common",
					priority: 1,
					minChunks: 2,
				}
			}
		}
	},
	devServer: {
		contentBase: require('path').join(__dirname, "dist"),
		compress: false,
		port: 3000,
		host: "127.0.0.1",
		hot: true,
		inline: true,
		proxy: {
			'/api/**': {
				target: 'http://192.168.100.131:8080',
			},
		},
	},
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.common.js'
		}
	}
};
