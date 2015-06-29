//index.js/
// This file is responsible on all the application routing
// Sending request for the modules responsible on the DB

var express = require('express'),
    exphbs = require('express3-handlebars'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    aws = require('aws-sdk');

var flash = require('express-flash');
var path = require('path');
var fs = require('fs');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var url = require('url');

var nodeExcel = require('excel-export');
var dateFormat = require('dateformat');

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

var experimentsDB = require('./experimentsDB'); 
var researchers = require('./researchersDB');
var categories = require('./categoriesDB');

var app = express();
app.use('/', express.static('./public'));
app.use('/css',express.static(path.join(__dirname, 'css')));
app.use('/js',express.static(path.join(__dirname, 'js')));
app.use('/font-awesome',express.static(path.join(__dirname, 'font-awesome')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use('/jQuery-TE_v.1.4.0',express.static(path.join(__dirname, 'jQuery-TE_v.1.4.0')));
app.use(express.static(__dirname + 'views/public'));


//===============PASSPORT===============

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the LocalStrategy within Passport to login/”signin” users.
passport.use('local-signin', new LocalStrategy({     
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, email, password, done) {
    researchers.localAuth(email, password)
    .then(function (user) {
      if (user) {
        req.session.success = 'You are successfully logged in ' + user.email + '!';
        done(null, user);
      }
      if (!user) {
        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));
// Use the LocalStrategy within Passport to register/"signup" users.
passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, email, password, done) {
    researchers.localReg(email, password)
    .then(function (user) {
      if (user) {
        req.session.success = 'You are successfully registered and logged in ' + user.email + '!';
        done(null, user);
      }
      if (!user) {
        req.session.error = 'That email is already in use, please try a different one.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));


//===============EXPRESS================
// Configure Express
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});


// Configure express to use handlebars templates
var hbs = exphbs.create({
    defaultLayout: 'main', 
    helpers: {
        highlight: function(value) {
          return JSON.parse(value);
        }
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


//===============ROUTES=================

//displays our homepage
app.get('/',isLoggedIn, function(req, res){
   experimentsDB.getIterationsByUser(req.user.user_id)
    .then(function (itemsList) {
      if (itemsList) {
        
         experimentsDB.getExperimentsNum(req.user.user_id)
          .then(function (expNum) {
            if (expNum) {
              
                 categories.getCategoriesNum(req.user.user_id)
                .then(function (catNum) {
                  if (catNum) {
                    
                    res.render('home', {user: req.user, catNum:JSON.stringify(catNum).replace(/[^0-9]/g, ''), expNum:JSON.stringify(expNum).replace(/[^0-9]/g, ''), iterations: itemsList });
                    done(null, catNum, expNum, itemsList);
                  }
                  if (!catNum) {
                    req.session.error = 'Could not find Categories number';
                    done(null, catNum);
                  }
                })
                .fail(function (err){
                  console.log("**** Error: " + err.body);
                });
              done(null, expNum, itemsList);
            }
            if (!expNum) {
              req.session.error = 'Could not find Experiments numer';
              done(null, expNum);
            }
          })
          .fail(function (err){
            console.log("**** Error: " + err.body);
          });
          
        done(null, itemsList);
      }
      if (!itemsList) {
        req.session.error = 'Could not find iterations';
        done(null, itemsList);
      }
    })
    .fail(function (err){
      console.log("**** Error: " + err.body);
    });
 
  
});



//displays our signup page
app.get('/signin', function(req, res){
  res.render('signin');
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/local-reg', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/local-reg'
  })
);

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/login', passport.authenticate('local-signin', { 
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

app.get('/local-reg', function(req, res){
  res.render('register', {user: req.user});
});

//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function(req, res){
  var name = req.user.email;
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});

// route middleware to make sure user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/signin');
}


//Forgot passwords routes
app.get('/forgot', function(req, res) {
  res.render('forgot', {
    user: req.user
  });
});

app.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      // User.findOne({ email: req.body.email }, function(err, user) {
        researchers.findUser(req.body.email)
      .then(function (user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          req.session.error = 'No account with that email address exists.';
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = (Date.now() + 3600000); // 1 hour

        researchers.updateUser(user)
        .then(function (user,err) { 
          done(err, user.resetPasswordToken, user);
        });
        
      });
      
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'gmail',
        auth: {
            user: 'flexiprice@gmail.com',
            pass: 'flexi2015'
        }
      });

      var mailOptions = {
        from: 'passwordreset@FlexiPrice.com',
        to: user.email,
        subject: 'FlexiPrice Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset?token=' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    
    res.redirect('/');
    req.session.notice = 'An e-mail has been sent to you with further instructions.';
  });
});

app.get('/reset', function(req, res) {
  //User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    var urlPart = url.parse(req.url, true);
    var query = urlPart.query;
    researchers.findToken(query.token)
    .then(function (user) {
        if (!user) {
          return res.redirect('/forgot');
        }
        if (Date.now() > user.resetPasswordExpires)
        {
          return res.redirect('/forgot');
        }
        res.render('reset', {
          user: req.user
        });

  });
});

app.post('/reset', function(req, res) {
  async.waterfall([
    function(done) {
      //User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        var urlPart = url.parse(req.url, true);
        var query = urlPart.query;
       
      researchers.findToken(query.token)
      .then(function (user) {
        if (!user) {
          req.session.error = 'Password reset token is invalid or has expired.';
          return res.redirect('back');
        }
        if (Date.now() > user.resetPasswordExpires)
        {
          return res.redirect('/forgot');
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        researchers.updateUser(user)
        .then(function (user,err) { 
          console.log("3. Changed user token");
          done(err, user);
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'gmail',
        auth: {
            user: 'flexiprice@gmail.com',
            pass: 'flexi2015'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@FlexiPrice.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        req.session.notice = 'Success! Your password has been changed.';
        
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
    req.session.notice = 'Success! Your password has been changed.';
  });
});

app.get('/contact', isLoggedIn, function(req, res){
 res.render('contact', {user: req.user});
});

app.post('/contact', function(req, res, next) {
 
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'gmail',
        auth: {
            user: 'flexiprice@gmail.com',
            pass: 'flexi2015'
        }
      });

      var mailOptions = {
        from: req.body.email,
        to: 'flexiprice@gmail.com',
        subject: 'FlexiPrice Contact Message',
        text: 'Message from: '+req.body.name+", Email Address: " +req.body.email+"\n" +req.body.message
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        //done(err, 'done');
        res.redirect('/');
      });
});

// === Experiments related routes ===
//Experiments page
app.get('/Experiments', isLoggedIn, function(req, res){

  experimentsDB.getExperiments(req.user.user_id)
    .then(function (itemsList) {
      if (itemsList) {
          res.render('view-experiments', {user: req.user, items: itemsList});
        done(null, itemsList);
      }
      if (!itemsList) {
        req.session.error = 'Could\'nt find Experiments';
        done(null, itemsList);
      }
    })
    .fail(function (err){
      console.log("**** Error: " + err.body);
    });
 
});

//Go to -> Add new experiment page
app.get('/NewExperiment', isLoggedIn, function(req, res){
 categories.getCategories(req.user.user_id)
    .then(function (itemsList) {
      if (itemsList) {
          res.render('new-experiment', {user: req.user, items: itemsList});
        done(null, itemsList);
      }
      if (!itemsList) {
        req.session.error = 'Could\'nt find Categories';
        done(null, itemsList);
      }
    })
    .fail(function (err){
      console.log("**** Error: " + err.body);
    });
});


app.post('/SubmitExperiment', function(req, res){

  var details = req.body;

  experimentsDB.newExperiment(req.user.user_id, req.body);
  res.redirect('/Experiments');
});


//Modify experiment : needs experiment details, categories, experiment iterations
app.get('/ModifyExperiment:id' , isLoggedIn, function(req, res){
  var id = (req.params.id).replace(/[^0-9]/g, ''); ;
  experimentsDB.getExperiment(id)
    .then(function (itemsList) {
      if (itemsList) {
        categories.getCategories(req.user.user_id)
        .then(function (categoriesList) {
          if (categoriesList) {
              experimentsDB.getIterations(id)
              .then(function (iterations) {
                if (iterations) {
                   res.render('showExperiment', {user: req.user, items: itemsList, categories:categoriesList, iterations:iterations, tries: itemsList[0].max_tries});
                   done(null, itemsList, categoriesList, iterations);
                }
                if (!iterations) {
                  req.session.error = 'Could\'nt find iterations';
                  done(null, iterations);
                }
                    })
            .fail(function (err){
              console.log("**** Error: " + err.body);
            });
             
            done(null, itemsList, categoriesList);
          }
          if (!categoriesList) {
            req.session.error = 'Could\'nt find categories';
            done(null, categoriesList);
          }
        })
        .fail(function (err){
          console.log("**** Error: " + err.body);
        });
        done(null, itemsList);
      }
      if (!itemsList) {
        req.session.error = 'Could\'nt find Experiment';
        done(null, itemsList);
      }
    })
    .fail(function (err){
      console.log("**** Error: " + err.body);
    });
});

app.post('/SubmitModifiedExperiment:experiment_id', function(req, res){

  var details = req.body;
  
  var id = (req.params.experiment_id).replace(/[^0-9]/g, '');

  experimentsDB.updateExperiment(req.user.user_id, id, req.body);
  res.redirect('/Experiments');
});

app.post('/SubmitModifiedIteration:iteration_id', function(req, res){

  var details = req.body;
  
  var id = (req.params.iteration_id).replace(/[^0-9]/g, '');

  experimentsDB.modifyIteration(id, req.body);
  res.redirect('/Experiments');
});

app.post('/SubmitNewIteration', function(req, res){

  var details = req.body;

  experimentsDB.newIteration(req.user.user_id, req.body);
  res.redirect('/Experiments');
});

//Delete experiment
app.get('/DeleteExperiment:experiment_id' , isLoggedIn, function(req, res){
  var id = (req.params.experiment_id).replace(/[^0-9]/g, ''); ;
  experimentsDB.deleteExperiment(id);
  res.writeHead(301,
    {Location: '/Experiments'}
  );
  res.end();
});

// === Categories related routes ===
//Categories page
app.get('/Categories', isLoggedIn, function(req, res){

  categories.getCategories(req.user.user_id)
    .then(function (itemsList) {
      if (itemsList) {
          res.render('view-categories', {user: req.user, items: itemsList});
        done(null, itemsList);
      }
      if (!itemsList) {
        req.session.error = 'Could\'nt find Categories';
        done(null, itemsList);
      }
    })
    .fail(function (err){
      console.log("**** Error: " + err.body);
    });
});


//Go to -> Add new category page
app.get('/NewCategory', isLoggedIn, function(req, res){
   res.render('new-category', {user: req.user});
});

//Submit new category
app.post('/SubmitCategory' , isLoggedIn, function(req, res){
  categories.newCategory(req.body.name, req.body.message, req.user.user_id)
      .then(function (item) {
      if (item) {
         res.writeHead(301,
            {Location: '/addNewProduct:'+item[0].category_id}
          );
          res.end();

        done(null, item);
      }
      if (!item) {
        req.session.error = 'Could\'nt submit new Category';
        done(null, item);
      }
    })
    .fail(function (err){
      console.log("**** Error: " + err.body);
    });
});

//Modify category - need Category details + products related to category
app.get('/ShowCategory:id' , isLoggedIn, function(req, res){
  var id = (req.params.id).replace(/[^0-9]/g, ''); ;

  categories.getCategory(id)
    .then(function (itemsList) {
      if (itemsList) {

        categories.getProducts(id)
            .then(function (productsList) {
              if (productsList) {
                 res.render('showCategory', {user: req.user, items: productsList, category:itemsList});
                 done(null, productsList, itemsList);
              }
              if (!productsList) {
                 req.session.error = 'Could\'nt find products';
                done(null, productsList);
              }
            })
            .fail(function (err){
              console.log("**** Error: " + err.body);
             });

        done(null, itemsList);
      }
      if (!itemsList) {
        req.session.error = 'Could\'nt find category';
        done(null, itemsList);
      }
    })
    .fail(function (err){
      console.log("**** Error: " + err.body);
    });
});

//Delete Categort
app.get('/DeleteCategory:category_id', isLoggedIn, function(req, res){

  var cat_id = (req.params.category_id).replace(/[^0-9]/g, ''); 

  categories.deleteCategory(cat_id);
  res.writeHead(301,
    {Location: '/Categories'}
  );
  res.end();
});

//Add new product page
app.get('/addNewProduct:id', isLoggedIn, function(req, res){


  var id = (req.params.id).replace(/[^0-9]/g, ''); ;


    categories.getCategory(id)
    .then(function (itemsList) {
      if (itemsList) {

          res.render('new-product', {user: req.user, category: itemsList});
        done(null, itemsList);
      }
      if (!itemsList) {
        req.session.error = 'Could\'nt find category';
        done(null, itemsList);
      }
    })
    .fail(function (err){
      console.log("**** Error: " + err.body);
    });
});

//Submit new product
app.post('/SubmitProduct:id' , isLoggedIn, function(req, res){

   var id = (req.params.id).replace(/[^0-9]/g, ''); ;

  categories.newProduct(req.body.name, req.body.message, req.body.price, req.body.MinPrice, req.body.webpage, req.body.file_url, req.body.productType, id);

  res.writeHead(301,
    {Location: '/ShowCategory:' + id}
  );
  res.end();
});

//Update product
app.post('/ModifyProduct:product_id/:category_id' , isLoggedIn, function(req, res){
  var id = (req.params.product_id).replace(/[^0-9]/g, ''); 
  var cat_id = (req.params.category_id).replace(/[^0-9]/g, ''); 
 
  categories.updateProduct(req.body.name, req.body.message, req.body.price, req.body.MinPrice, req.body.webpage, req.body.file_url, req.body.productType, id);
 
  res.writeHead(301,
    {Location: '/ShowCategory:' + cat_id}
  );
  res.end();
});

//Delete product
app.get('/DeleteProduct:product_id/:category_id' , isLoggedIn, function(req, res){
  var id = (req.params.product_id).replace(/[^0-9]/g, '');
  var cat_id = (req.params.category_id).replace(/[^0-9]/g, ''); 
  categories.deleteProduct(id, cat_id);
  res.writeHead(301,
    {Location: '/ShowCategory:' + cat_id}
  );
  res.end();
});

//Modify product - need Category details + products related to category
app.get('/ShowProduct:product_id' , isLoggedIn, function(req, res){
  var product_id = (req.params.product_id).replace(/[^0-9]/g, ''); 
  categories.getProduct(product_id)
    .then(function (productsList) {
      if (productsList) {

          categories.getCategory(productsList[0].category_id)
              .then(function (itemsList) {
                if (itemsList) {
                  res.render('showProduct', {user: req.user, product:productsList, category:itemsList});
                  done(null, itemsList, productsList);
                }
                if (!itemsList) {
                  req.session.error = 'Could\'nt find category';
                  done(null, itemsList, productsList);
                }
              })
              .fail(function (err){
                console.log("**** Error: " + err.body);
              });
      }
      if (!productsList) {
         req.session.error = 'Could\'nt find product';
        done(null, productsList);
      }
    })
    .fail(function (err){
      console.log("**** Error: " + err.body);
     });

});

//Amazon S3 bucket - file uploading
app.get('/sign_s3', isLoggedIn, function(req, res){
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
    var s3 = new aws.S3();
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.file_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
});


//Running Experiment!!!!!
app.get('/experimentWelcomePage', function(req, res){
  var urlPart = url.parse(req.url, true);
  var query = urlPart.query;

experimentsDB.getIteration(query.iteration_id)
    .then(function (itemsList) {
      if (itemsList) {
        experimentsDB.getIntro(query.exp_id)
            .then(function (intro) {
              if (intro) {
                res.render('RunningExperiment/experimentWelcomePage', {layout: false, experimentId:query.exp_id, iteration_id: query.iteration_id, intro:intro[0].introduction, iteration: itemsList, private: itemsList[0].private});
                done(null, intro, itemsList);
              }
              if (!intro) {
                req.session.error = 'Could\'nt find intro';
                done(null, intro);
              }
            })
            .fail(function (err){
              console.log("**** Error: " + err.body);
            });

          //res.render('showIteration', {user: req.user, iteration: itemsList});
        done(null, itemsList);
      }
      if (!itemsList) {
        req.session.error = 'Could\'nt find iteration';
        done(null, itemsList);
      }
    })
    .fail(function (err){
      console.log("**** Error: " + err.body);
    });


  
});

//Submit and start Experiment!!!!!
app.post('/SubmitToExperiment', function(req, res){
 //var id = (req.params.experimentId).replace(/[^0-9]/g, ''); ;
 var urlPart = url.parse(req.url, true);
  var query = urlPart.query;

  res.writeHead(301,
    {Location: '/experiment?exp_id='+query.exp_id+"&iteration_id="+query.iteration_id+"&name="+req.body.name}
  );
 
  res.end();
});

//Running Experiment!!!!!
app.get('/experiment', function(req, res){
  
  //var id = (req.params.experimentId).replace(/[^0-9]/g, ''); ;
  var urlPart = url.parse(req.url, true);
  var query = urlPart.query;
    experimentsDB.getRunningExperiment(query.exp_id)
    .then(function (itemsList) {
      if (itemsList) {
         var body;
        fs.readFile(__dirname +'/views/RunningExperiment/experimentstart.handlebars', function (err, data) {
          if (err) throw err;
          body = data;
          body += itemsList[0].gizmo_code;

          fs.readFile(__dirname +'/views/RunningExperiment/experimentend.handlebars', function (err, data1) {
            if (err) throw err;
            body += data1;
          
            var path = "views/public/experiment"+query.exp_id+".handlebars";
            fs.writeFile(path, body, function(err) {
                if(err) {
                }
                res.render("public/experiment"+query.exp_id, {layout: false, details: itemsList,experimentId:query.exp_id, iteration_id: query.iteration_id, name:query.name});
            });

          });
          
        });
        done(null, itemsList);
      }
      if (!itemsList) {
        req.session.error = 'Could\'nt find Running Experiment';
        done(null, itemsList);
      }
    })
    .fail(function (err){
     // console.log("**** Error: " + err.body);
    });
});






//Show Iteration page
app.get('/iteration:id', isLoggedIn, function(req, res){

  var id = (req.params.id).replace(/[^0-9]/g, ''); ;

    experimentsDB.getIteration(id)
    .then(function (itemsList) {
      if (itemsList) {

          res.render('showIteration', {user: req.user, iteration: itemsList});
        done(null, itemsList);
      }
      if (!itemsList) {
        req.session.error = 'Could\'nt find iteration';
        done(null, itemsList);
      }
    })
    .fail(function (err){
      console.log("**** Error: " + err.body);
    });
});

app.get('/rating:id', function(req, res){
 var id = (req.params.id).replace(/[^0-9]/g, ''); ;

  experimentsDB.getRateHaders(id)
      .then(function (headers) {
        if (headers) {
          res.render('RunningExperiment/rating', {layout: false, header:headers[0].ratingHeader, subHeader:headers[0].ratingSubHeader,exp_id:id });
          done(null, headers);
        }
        if (!headers) {
          console.log("COULD NOT FIND");
          done(null, headers);
        }
      })
      .fail(function (err){
        console.log("**** Error: " + err.body);
      });
});

//Submitting iteration data
app.post('/iterationSubmit', function(req, res){

  var details = req.body;

  experimentsDB.iterationDetails(req.body);
  res.send(req.body);
  
});

app.get('/ExperimentConclusion:id', function(req, res){
 var id = (req.params.id).replace(/[^0-9]/g, ''); ;

  experimentsDB.getConclusion(id)
      .then(function (conclusion) {
        if (conclusion) {
          res.render('RunningExperiment/conclusion', {layout: false, conclusion:conclusion[0].conclusion});
          done(null, conclusion);
        }
        if (!conclusion) {
          console.log("COULD NOT FIND");
          done(null, conclusion);
        }
      })
      .fail(function (err){
        console.log("**** Error: " + err.body);
      });
});



app.get('/Excel', isLoggedIn, function(req, res){
  var urlPart = url.parse(req.url, true);
  var query = urlPart.query;
  var iteration_id = query.iterationId;
  var tries = query.tries;

    var conf={}
    conf.cols=[
        {
            caption:'Iteration ID',
            type:'string',
            width:10
        },
        {
            caption:'User ID',
            type:'string',
            width:10
        },
        {
            caption:'SessionID',
            type:'string',
            width:10
        },
        {
            caption:'Name',
            type:'string',
            width:50
        },
        {
            caption:'Score',
            type:'number',
            width:4
        },
        {
            caption:'Wallet',
            type:'number',
            width:4
        },
        {
            caption:'Question Title',
            type:'string',
            width:50
        },
        {
            caption:'Product Name',
            type:'string',
            width:50
        },       
        {
            caption:'Min Price',
            type:'number',
            width:4
        },
        {
            caption:'Paid Price',
            type:'number',
            width:4
        },
        {
            caption:'Revealed Price',
            type:'number',
            width:4
        },
        {
            caption:'Rating',
            type:'string',
            width:50
        }];

        for(var i=0 ; i<tries ; i++){
         conf.cols.push( {
            caption:'Subjective Price',
            type:'number',
            width:10
          });
        }


        experimentsDB.getIterationsDetails(iteration_id)
            .then(function (itemsList) {
              if (itemsList) {

                  arr=[];
                  for(i=0;i<itemsList.length;i++){
                      iteration_id =itemsList[i].iteration_id;
                      grade = itemsList[i].grade;
                      balance = itemsList[i].balance;
                      name = itemsList[i].name;
                      userId = itemsList[i].user_id;
                      min_price = itemsList[i].min_price;
                      subjective_price = itemsList[i].subjective_price;
                      revealed_price = itemsList[i].revealed_price;
                      paid_price = itemsList[i].paid_price;
                      question_title = itemsList[i].question_title;
                      product_name = itemsList[i].product_name;

                      rating = itemsList[i].rating;
                      SessionID = itemsList[i].sessionID

                      a=[iteration_id,userId, SessionID, name, grade, balance, question_title, product_name, min_price, paid_price, revealed_price, rating];
                      
                      
                      var subjectiveArray = subjective_price.split(',');

                      for(var j=0 ; j<tries ; j++){
                        if (subjectiveArray[j] != null)
                          a.push((subjectiveArray[j]).replace(/[^0-9.]/g, ""));
                        else a.push(0);
                      }
                      arr.push(a);
                  }
                  
                  conf.rows=arr;

                  var result = nodeExcel.execute(conf);
                  res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                  res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                  res.end(result, 'binary');
                 done(null,itemsList);
              }
              if (!itemsList) {
                 req.session.error = 'Could\'nt find iteration details';
                done(null, itemsList);
              }
            })
            .fail(function (err){
              console.log("**** Error: " + err.body);
             });
});

//===============PORT=================
var port = process.env.PORT || 5000; //select your port or let it pull from your .env file
app.listen(port);
console.log("listening on " + port + "!");