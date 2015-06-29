//ResearchersDB
//Module resposiable on all researchers user function to DB
var Q = require('q');
var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : 'workflow.cmdci40vhwqs.eu-central-1.rds.amazonaws.com',
  user     : 'flexiprice',
  password : 'flexi2015',
  database : 'flexiprice'
});

//used in local-signup strategy
exports.localReg = function (emailNew, passwordNew) {
  var deferred = Q.defer();
  post = { email: emailNew, password: passwordNew, avatar:"http://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png"};
  var user;

  pool.getConnection(function (err, connection) {
    connection.query('INSERT INTO flexiprice.researchers SET ?', post, function (err, result) {
      if (err != null) {
        //Email already in use
        deferred.resolve(false);
      }
      if (err == null) {                           
        connection.query('SELECT * FROM flexiprice.researchers where email = \"' + emailNew + '\";' ,function(err, rows, fields) {
          if (err!= null) {
           //Error finding user
           deferred.resolve(false);
          }

          if (err == null) {
            for (var i in rows) {
              
              user = {
               "email": rows[i].email,
               "password": rows[i].password,
               "user_id": rows[i].user_id,
               "avatar": rows[i].avatar,
                "resetPasswordToken": rows[i].resetPasswordToken,
                "resetPasswordExpires": rows[i].resetPasswordExpires
             }
             deferred.resolve(user);
           }
         }
            
       });
      }
      connection.end();
    });

  });

  return deferred.promise;
};



exports.localAuth = function (emailNew, passwordNew) {
  var deferred = Q.defer();

  var user;

  pool.getConnection(function (err, connection) {
    connection.query('SELECT * FROM flexiprice.researchers where email = \"' + emailNew + '\";' ,function(err, rows, fields) {
    if (err!= null) {
      //Error finding user
       deferred.resolve(false);
    }

    if (err == null) {
      for (var i in rows) {
       
        if (passwordNew == rows[i].password) {
         user = {
           "email": rows[i].email,
           "password": rows[i].password,
           "user_id": rows[i].user_id,
           "avatar": rows[i].avatar,
           "resetPasswordToken": rows[i].resetPasswordToken,
           "resetPasswordExpires": rows[i].resetPasswordExpires
         }
         deferred.resolve(user);
        } else {
          //PASSWORDS NOT MATCH
          deferred.resolve(false);
        }
      }
      if (rows.length == 0) {
      //Error finding user
       deferred.resolve(false);
    }

    }
      connection.end();
    });
  });
  return deferred.promise;
}

exports.findUser = function (emailNew) {
  var deferred = Q.defer();

  var user;

  pool.getConnection(function (err, connection) {
    connection.query('SELECT * FROM flexiprice.researchers where email = \"' + emailNew + '\";' ,function(err, rows, fields) {
    if (err!= null) {
      //Error finding user
       deferred.resolve(false);
    }

    if (err == null) {
      for (var i in rows) {
         user = {
           "email": rows[i].email,
           "password": rows[i].password,
           "user_id": rows[i].user_id,
           "avatar": rows[i].avatar,
           "resetPasswordToken": rows[i].resetPasswordToken,
           "resetPasswordExpires": rows[i].resetPasswordExpires
         }
         deferred.resolve(user);
      }
      if (rows.length == 0) {
      //Error finding user
       deferred.resolve(false);
    }

    }
      connection.end();
    });
  });
  return deferred.promise;
}

exports.findToken = function (token) {
  var deferred = Q.defer();

  var user;

  pool.getConnection(function (err, connection) {
    connection.query('SELECT * FROM flexiprice.researchers where resetPasswordToken = \"' + token + '\";' ,function(err, rows, fields) {
    if (err!= null) {
      //Error finding user
       deferred.resolve(false);
    }

    if (err == null) {
      for (var i in rows) {
         user = {
           "email": rows[i].email,
           "password": rows[i].password,
           "user_id": rows[i].user_id,
           "avatar": rows[i].avatar,
           "resetPasswordToken": rows[i].resetPasswordToken,
           "resetPasswordExpires": rows[i].resetPasswordExpires
         }
         deferred.resolve(user);
      }
      if (rows.length == 0) {
      //Error finding user
       deferred.resolve(false);
    }

    }
      connection.end();
    });
  });
  return deferred.promise;
}

//UPDATE `flexiprice`.`researchers` SET `password`='78979', `resetPasswordToken`='76867', `resetPasswordExpires`='987987' WHERE `user_id`='11' and`email`='natalim82@gmail.com';
exports.updateUser = function (userN) {
  var deferred = Q.defer();

  var user;
          var temp = userN.password
  user = { password: temp, resetPasswordToken: userN.resetPasswordToken, resetPasswordExpires:userN.resetPasswordExpires};

  pool.getConnection(function (err, connection) {
    connection.query('UPDATE flexiprice.researchers SET ? WHERE user_id=? and email=?;', [user, userN.user_id, userN.email] ,function(err, rows, fields) {
    if (err!= null) {
      //Error finding user
       deferred.resolve(false);
    }

    if (err == null) {
        connection.query('SELECT * FROM flexiprice.researchers where email = \"' + userN.email + '\";' ,function(err, rows, fields) {
          if (err!= null) {
            //Error finding user
            deferred.resolve(false);
          }

          if (err == null) {
            for (var i in rows) {
              user = {
               "email": rows[i].email,
               "password": rows[i].password,
               "user_id": rows[i].user_id,
               "avatar": rows[i].avatar,
                "resetPasswordToken": rows[i].resetPasswordToken,
                "resetPasswordExpires": rows[i].resetPasswordExpires
             }
             deferred.resolve(user);
           }
         }
            
       });
      }
    
      connection.end();
    });
  });
  return deferred.promise;
}
