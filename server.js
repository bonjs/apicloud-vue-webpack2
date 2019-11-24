
const webpackConfig = require('./webpack.config.js');

const webpack = require('webpack');
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs  = require('fs');
const express = require('express');
const app = express();



var isDev = process.env.NODE_ENV == 'development';
console.log('模式: ', process.env.NODE_ENV);

var maxAge = 30 * 60 * 10000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    name: 'my',
    secret: '12345',
    cookie: {maxAge },
    resave: true,
    saveUninitialized: false
}));

const compression = require("compression");
app.use(compression());



app.use(function(req, res, next) {
  console.log(req.path)
  if(req.session.user) {
    res.cookie('islogin', '1', { maxAge, httpOnly: false }) 
    
    req.session._garbage = Date();
    req.session.touch();
  } else {
    res.clearCookie('islogin');
  }

  next();
});

// 首页禁止缓存
app.get(/^\/$/, (req, res, next) => {
  console.log('地址', req.path)
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  next();
});

app.get(/\.(js|css|png)$/, (req, res, next) => {
  res.setHeader("Cache-Control", `max-age=${86400 * 7}`); // HTTP 1.1.
  res.setHeader("Expires", "10d"); // Proxies.
  next();
});

var getIndexHtml = function() {
  var html;
  return function() {
    if(html) {
      return html;
    }
    return new Promise(function(resolve, reject) {
      fs.readFile('./src/index.html', function(err, s) {
        if(!err) {
          resolve(html = s.toString());
        }
      });
    });
  }
}();


function getHash() {
  return new Promise(function(resolve, reject) {
    if(process.env.hash) {
      resolve(process.env.hash);
    }
  });
}

if (isDev) {

  // 启动node服务来代替html-webpack-plugin生成html以减轻webpack编译负担
  app.get('/:mod.html', async function (req, res, next) {
    var mod = req.params.mod;

    var html = await getIndexHtml();


    /*
    <!-- ###mod### -->
    <!-- ###vendor### -->
    <!-- ###dll### -->
    */
    res.send(littleTpl(html, {
      mod: `./${mod}-${process.env.hash}.js`,
      vendor: `./vendor-${process.env.hash}.js`,
    }))
  });
}


/*

    <!-- ###mod### -->
    <!-- ###vendor### -->

    <script src="./m1-fdsa.js"></script>
    <script src="./vendor-fdsa.js"></script>
*/
function littleTpl(tpl, data) {
  return tpl.replace(/<!--\s*###([^#]+)###\s*-->/g, function(x, a) {
    if(data[a] && data[a]) {
      return `<script src="${data[a]}"></script>`;
    }
  });
}

app.post('/login', async function (req, res) {
  var user = await new Promise(function(resolve, reject) {
    login({
      uid: req.body.uid,//'18610346767',
      pwd: util.decrypt(req.body.pwd, 'efvj40$#9gr#idfijp43k2fdna;kwe')//'123456'
    }, function(x, user) {
      resolve(user);
    })
  })

  res.cookie('islogin', '1', { maxAge, httpOnly: false }) 

  req.session.user = JSON.stringify(user);
  res.end(JSON.stringify(user));
})

app.get('/logout', function(req, res) {

  console.log('logout')
  req.session.user = null;
  res.clearCookie('islogin');
  res.redirect('/login.html');
})
/* 

app.use(proxy('/api/**', {
  target: 'http://192.168.100.131:8080',
  changeOrigin: false,
  cookieDomainRewrite: false
})); */


app.use('/api/**', function(req, res) {

  if(!req.session.user) {
    res.end(JSON.stringify({
      suc: false,
      msg: '请重新登录'
    }))
    return;
  }
  return proxy({
    target: 'http://192.168.100.131:8080',
    changeOrigin: false,
    cookieDomainRewrite: false,
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader('x-forwarded-for', '127.0.0.1')
    }
  }).apply(this, arguments)
});


// 处理mode:'history'下的地址问题
var history = require('connect-history-api-fallback');

app.use(history({
  index: '',
  verbose: false,
}));

app.use(express.static('./dist'))
app.use('/dll', express.static('dll'))

if(isDev) {

  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');

  var compiler = webpack(webpackConfig);

  var devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    noInfo: true,
    quiet: true,  //向控制台显示任何内容 
    stats: {
      colors: true,
      chunks: false
    }
  });
  var hotMiddleware = webpackHotMiddleware(compiler);
  app.use(devMiddleware);
  app.use(hotMiddleware);
}

var port = 3000;
app.listen(port, function(req, res) {
  console.log(`listening on port ${port}!`);
});
