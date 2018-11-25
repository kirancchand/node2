var http = require('http'); // Calls for http.js 
var url = require('url'); // Calls for url.js
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var mongo = require('mongodb');

/**registration**/

var monk = require('monk');
var db = monk('localhost:27017/userdatadb');
// Make our db accessible to our router monk////////////
app.use(function(req,res,next){
    req.db = db;
    next();
});
/////////////////monk/////////////
/***login**/
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:true});
/*
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';*/


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// Database
// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('views', __dirname);

//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//////////////monk  registration////////////

app.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var Name = req.body.name;
    var Email = req.body.email;
    var Gender = req.body.gender;
    var Phoneno = req.body.phoneno;
    var password = req.body.password;

    // Set our collection
    var collection = db.get('userlist');
    //res.send('You sent the name "' + Name + '".');

    // Submit to the DB
    collection.insert({
        "name" : Name,
        "email" : Email,
        "gender" : Gender,
        "phoneno" : Phoneno,
        "password" : password
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/login");
        }
    });

  
  
});


/////////////////monk   registration/////////////

/////////////////monk login///////////////////


app.post('/loginaction', function(req, res) {
 var db = req.db;
  var collection = db.get('userlist');
  collection.findOne({email: req.body.email,password: req.body.password},{},function(e,docs){
    if(docs===null)
      {
        res.send('invalid field');
      }
    else
      {
        res.redirect("/home");
             
      }
  });
});


/////////////user update////////////

app.post('/userdelete', function(req, res) {
  var db = req.db;
   //console.log(req.body.userid);
  var collection = db.get('userlist');
  collection.remove(
            {_id:req.body.userid}, 
            function (err, result){ 
              if(result===null)
                  {
                    console.log('0');
                    res.send('0');
                  }
                else
                  {
                    console.log('1');
                        res.send('1');
                         
                  }
              });
});


app.post('/update_data', function(req, res) {
  var db = req.db;
   //console.log(req.body.userid);
  var collection = db.get('userlist');
  collection.findOne({_id: req.body.userid},{},function(e,docs){
    if(docs===null)
      {
        res.send('invalid data');
      }
    else
      {
        res.send(docs);
             
      }
  });

});

app.post('/updateuser', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  collection.update({_id:req.body.user_id}, {$set:{name:req.body.name,gender:req.body.gender,phoneno:req.body.phoneno}}, function(err, result)
    {

    if(result===null)
      {
         res.send('0');
      }
    else
      {
         res.send('1');     
      }
  });

});







app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//app.use('/register', registerRouter);

app.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});



module.exports = app;
