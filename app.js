var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var Movie = require('./models/movie')

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

mongoose.connect('mongodb://localhost/imooc')

// view engine setup
app.set('views', path.join(__dirname, './views/pages'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/')));
app.locals.moment = require('moment')

// app.use('/', routes);
// app.use('/users', users);

// index page
app.get('/', function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err);
    }
    res.render('index', {
      title: 'imooc 首页',
      movies: movies
    })
  })
  // res.render('index', {
  // title: 'imooc 首页',
  //   movies: [{
  //     title: '机械战警',
  //     _id: 1,
  //     poster: 'https://ss2.baidu.com/6OV1bjeh1BF3odCf/it/u=1547347907,2224273665&fm=20'
  //   }, {
  //     title: '机械战警',
  //     _id: 2,
  //     poster: 'https://ss2.baidu.com/6OV1bjeh1BF3odCf/it/u=1547347907,2224273665&fm=20'
  //   }, {
  //     title: '机械战警',
  //     _id: 3,
  //     poster: 'https://ss2.baidu.com/6OV1bjeh1BF3odCf/it/u=1547347907,2224273665&fm=20'
  //   }, {
  //     title: '机械战警',
  //     _id: 4,
  //     poster: 'https://ss2.baidu.com/6OV1bjeh1BF3odCf/it/u=1547347907,2224273665&fm=20'
  //   }, {
  //     title: '机械战警',
  //     _id: 5,
  //     poster: 'https://ss2.baidu.com/6OV1bjeh1BF3odCf/it/u=1547347907,2224273665&fm=20'
  //   }, {
  //     title: '机械战警',
  //     _id: 6,
  //     poster: 'https://ss2.baidu.com/6OV1bjeh1BF3odCf/it/u=1547347907,2224273665&fm=20'
  //   }]
  // })
})

// detail page
app.get('/movie/:id', function(req, res) {
  var id = req.params.id

  Movie.findById(id, function(err, movie) {
    res.render('detail', {
      title: 'imooc ' + movie.title,
      movie: movie
    })
  })
  // res.render('detail', {
  //   title: 'imooc 详情页',
  //   movie: {
  //     doctor: '何塞·帕迪里亚',
  //     country: '美国',
  //     title: '机械战警',
  //     year: 2014,
  //     poster: 'https://ss2.baidu.com/6OV1bjeh1BF3odCf/it/u=1547347907,2224273665&fm=20',
  //     flash: 'http://player.youku.com/player.php/sid/XNjA2NDU2Nzk2/v.swf',
  //     summary: '《机械战警》是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。影片的故事背景与原版基本相同，故事设定在2028年的底特律，男主角亚历克斯·墨菲是一名正直的警察，被坏人安装在车上的炸弹炸成重伤，为了救他，OmniCorp公司将他改造成了生化机器人“机器战警”，代表着美国司法的未来。'
  //   }
  // })
})

// admin page
app.get('/admin/movie', function(req, res) {
  res.render('admin', {
    title: 'imooc 后台录入页',
    movie: {
      title: '',
      doctor: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: ''
    }
  })
})

// admin update movie
app.get('/admin/update/:id', function(req, res) {
  var id = req.params.id
  if (id) {
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: 'imooc 后台更新页',
        movie: movie
      })
    })
  }
})

// admin post movie
app.post('/admin/movie/new', function(req, res) {
  var movieObj = req.body.movie
  var id = movieObj._id
  var _movie

  if (id !== 'undefined') {
    Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err)
      }

      _movie = _.extend(movie, movieObj)
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err)
        }

        res.redirect('/movie/' + movie._id)
      })
    })
  } else {
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })

    _movie.save(function(err, movie) {
      if (err) {
        console.log(err)
      }

      res.redirect('/movie/' + movie._id)
    })
  }
})

// list page
app.get('/admin/list', function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err)
    }

    res.render('list', {
      title: 'list 列表页',
      movies: movies
    })
  })
  // res.render('list', {
  //   title: 'imooc 列表页',
  //   movies: [{
  //     title: '机械战警',
  //     _id: 1,
  //     doctor: '何塞·帕迪里亚',
  //     country: '美国',
  //     year: 2014,
  //     poster: 'https://ss2.baidu.com/6OV1bjeh1BF3odCf/it/u=1547347907,2224273665&fm=20',
  //     language: '英语',
  //     flash: 'http://player.youku.com/player.php/sid/XNjA2NDU2Nzk2/v.swf',
  //     summary: '《机械战警》是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。影片的故事背景与原版基本相同，故事设定在2028年的底特律，男主角亚历克斯·墨菲是一名正直的警察，被坏人安装在车上的炸弹炸成重伤，为了救他，OmniCorp公司将他改造成了生化机器人“机器战警”，代表着美国司法的未来。'
  //   }]
  // })
})

// list delete movie
app.delete('/admin/list', function(req, res) {
  var id = req.query.id

  if (id) {
    Movie.remove({_id: id}, function(err, movie) {
      if (err) {
        console.log(err)
      } else {
        res.json({success: 1})
      }
    })
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
