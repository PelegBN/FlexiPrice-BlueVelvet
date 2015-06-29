// functions.js/
// This files is responsible on ALL DB queries 
// Experiments queries and Iterations queries
var Q = require('q');
var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : 'workflow.cmdci40vhwqs.eu-central-1.rds.amazonaws.com',
  user     : 'flexiprice',
  password : 'flexi2015',
  database : 'flexiprice'
});

exports.newExperiment = function (user_id, details) {
  var today = getTodayDate();

  var postExperiment = {
    user_id: user_id,
    category_id: details.Category,
    experiment_name: details.ExpName,
    experiment_desc : details.ExpDesc,
    creation_date: today,
    last_modified: today,
    gizmo_code: details.GizmoCode,
    show_prices: JSON.parse(details.showPrices),
    open_negotiation: JSON.parse(details.openNegotiation),
    use_min_price: JSON.parse(details.MinPrice),
    active: '1',
    max_tries: details.MaxTries,
    starting_wallet: details.Wallet
  };

  var postTitles = {
    introduction: details.intro,
    conclusion: details.conclusion,
    showPricesON: details.msgPriceOn,
    minPriceON: details.msgMinPriceOn,
    minPriceOFF: details.msgMinPriceOff,
    openNegotiation: details.msgNegoOn,
    aboveProducts: details.msgAboveProducts,
    priceTooLow: details.msgPriceLow,
    ratingHeader: details.rateHeader,
    ratingSubHeader: details.rateSubHeader
  };

  pool.getConnection(function (err, connection){
    connection.query('INSERT INTO flexiprice.experiments SET ?', postExperiment, function (err, result) {
      if (err != null) {
        
        deferred.reject(new Error(err.body));
      }
      if (err == null) {                                  
        var tempID = result.insertId;
        postTitles['experimentID'] = tempID;
        connection.query('INSERT INTO flexiprice.titlesNMessages SET ?', postTitles, function (err, result) {
          if (err != null) {
            deferred.reject(new Error(err.body));
          }
          if (err == null) {                           

          }
             
        });
      }
          connection.end();
    });
  });

}


exports.updateExperiment = function (user_id, experiment_id, details) {
  
  var today = getTodayDate();

  var postExperiment = {
    user_id: user_id,
    category_id: details.Category,
    experiment_name: details.ExpName,
    experiment_desc : details.ExpDesc,
    last_modified: today,
    gizmo_code: details.GizmoCode,
    show_prices: JSON.parse(details.showPrices),
    open_negotiation: JSON.parse(details.openNegotiation),
    use_min_price: JSON.parse(details.MinPrice),
    active: '1',
    max_tries: details.MaxTries,
    starting_wallet: details.Wallet
  };

  var postTitles = {
    introduction: details.intro,
    conclusion: details.conclusion,
    showPricesON: details.msgPriceOn,
    minPriceON: details.msgMinPriceOn,
    minPriceOFF: details.msgMinPriceOff,
    openNegotiation: details.msgNegoOn,
    aboveProducts: details.msgAboveProducts,
    priceTooLow: details.msgPriceLow,
    ratingHeader: details.rateHeader,
    ratingSubHeader: details.rateSubHeader
  };

  pool.getConnection(function (err, connection){
    connection.query('UPDATE flexiprice.experiments SET ?  WHERE experiment_id = ?', [postExperiment, experiment_id], function (err, result) {
      if (err != null) {
        deferred.reject(new Error(err.body));
      }
      if (err == null) {                           
        connection.query('UPDATE flexiprice.titlesNMessages SET ? WHERE experimentID = ?', [postTitles, experiment_id], function (err, result) {
          if (err != null) {
            deferred.reject(new Error(err.body));
          }
          if (err == null) {                           

          }
             
        });
      }
          connection.end();
    });
  });

}

exports.deleteExperiment = function (exp_id) {

  pool.getConnection(function (err, connection){
    connection.query('DELETE FROM flexiprice.experiments WHERE experiment_id = ?', exp_id, function (err, result) {
      if (err != null) {
        deferred.reject(new Error(err.body));
      }
      if (err == null) {                           

      }
          connection.end();
    });
  });

}

function getTodayDate() {
  var today = new Date();
   var dd = today.getDate();
   var mm = today.getMonth()+1; //January is 0!
   var yyyy = today.getFullYear();

   if(dd<10) {
       dd='0'+dd
   } 

   if(mm<10) {
       mm='0'+mm
  } 

  today = dd+'/'+mm+'/'+yyyy;

  return today;
}


exports.getExperiments = function (user_id) {
  var deferred = Q.defer();
 
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT * FROM flexiprice.experiments where user_id=?;'
     connection.query(sql, user_id , function (err, rows) {
    if (err!= null) {
      deferred.reject(new Error(err.body));
    }

    if (err == null) {
         deferred.resolve(rows);
       }  
       connection.end();
    
    });
   });

  return deferred.promise;
}

exports.getExperiment = function (wanted) {
  var deferred = Q.defer();
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT * FROM flexiprice.experiments inner join flexiprice.titlesNMessages where experiments.experiment_id=titlesNMessages.experimentID and experiment_id=?;'
     connection.query(sql, wanted , function (err, rows) {
    if (err!= null) {
      //Error finding experiments
      deferred.reject(new Error(err.body));
    }

    if (err == null) {
         deferred.resolve(rows);
       }  
       connection.end();
    
    });
   });

  return deferred.promise;
}

exports.getRunningExperiment = function (experiment_id) {
  var deferred = Q.defer();
 
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT * FROM experiments INNER JOIN products ON experiments.category_id = products.category_id inner join titlesNMessages ON experiments.experiment_id = titlesNMessages.experimentID And experiments.experiment_id =?;'
     connection.query(sql, experiment_id , function (err, rows) {
    if (err!= null) {
      //Error finding running experiment
      deferred.reject(new Error(err.body));
    }

    if (err == null) {
         deferred.resolve(rows);
       }  
       connection.end();
    
    });
   });

  return deferred.promise;
}

exports.getIterations = function (experiment_id) {
  var deferred = Q.defer();
 
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT * FROM flexiprice.iterations where experiment_id=?;'
     connection.query(sql, experiment_id , function (err, rows) {
    if (err!= null) {
      //Error finding iterations
      deferred.reject(new Error(err.body));
    }

    if (err == null) {
         deferred.resolve(rows);
       }  
       connection.end();
    
    });
   });

  return deferred.promise;
}

//Enter User iteration details
exports.iterationDetails = function (details) {

  var tempUserId = Math.floor(Math.random() * 10000);

  //Insert New User
  var postUser = {
    iteration_id: details.iteration,
    grade: details.grade,
    balance : details.balance,
    name: details.name,
    user_id: tempUserId,
    sessionID: details.sessionID
  }

  pool.getConnection(function (err, connection){

          connection.query('INSERT INTO flexiprice.users SET ?', postUser, function (err, result) {
            if (err != null) {
              deferred.reject(new Error(err.body));
            }
            if (err == null) {                           
                exports.iterationDetailsQuestions(details, tempUserId);
                exports.updateIteration(details.iteration);
            }
                connection.end();
          });
  });

}

//Insert Questions
//Insert QuestionToProduct
exports.iterationDetailsQuestions = function (details, userId) {

var questions = [];
pool.getConnection(function (err, connection){
    for (var i=0 ; i<details.numOfquestions ; i++){
      var postQuestion = {
        question_title: JSON.stringify(details["question_array["+i+"][title]"]).replace(/['"]+/g, ''),
      }
      connection.query('INSERT INTO flexiprice.questions SET ?', postQuestion, function (err, result) {
        if (err != null) {
          deferred.reject(new Error(err.body));
        }
        if (err == null) {                           
          questionID = result.insertId;
          questions.push(questionID);
          if (questions.length == details.numOfquestions) exports.questionToProduct(details, userId, questions);
        }
            
      });
    
  }
    connection.end();

  });
 
}

exports.questionToProduct = function(details, userID, questions){
  pool.getConnection(function (err, connection){
    for (var i=0 ; i<details.numOfquestions ; i++){

      for (var j=0; j<details["question_array["+i+"][numOfProducts]"] ; j++) {
        var postProduct = {
          userID: userID,
          questionID: questions[i],
          productID: details["question_array["+i+"][products]["+j+"][product_id]"],
          min_price: details["question_array["+i+"][products]["+j+"][min_price]"],
          revealed_price: details["question_array["+i+"][products]["+j+"][revealed_price]"],
          paid_price: details["question_array["+i+"][products]["+j+"][paid_price]"], 
          rating: JSON.stringify(details["question_array["+i+"][products]["+j+"][rating]"]).replace(/['"]+/g, ''),
          sessionID: details.sessionID
        }
        if (details["question_array["+i+"][products]["+j+"][subjective_price][]"] != null)
        {
            postProduct['subjective_price']=JSON.stringify(details["question_array["+i+"][products]["+j+"][subjective_price][]"]).replace(/['"]+/g, '');
        }

        connection.query('INSERT INTO flexiprice.questionToProduct SET ?', postProduct, function (err, result) {
          if (err != null) {
            deferred.reject(new Error(err.body));
          }
          if (err == null) { 
          }
        });     
      }
    }
    connection.end();
  });
}

exports.updateIteration = function(iterationId){

  pool.getConnection(function (err, connection){
     var sql = 'UPDATE flexiprice.iterations SET date=\''+getTodayDate() +'\', subjects=subjects+1 WHERE iteration_id=?;'
     connection.query(sql, iterationId , function (err, rows) {
      if (err != null) {
        deferred.reject(new Error(err.body));
      }
      if (err == null) {                           

      }
          connection.end();
    });  
   });
}

exports.modifyIteration = function(iterationId, details){

  var postIteration = {
  comment: details.comment,
  private: JSON.parse(details.privateIteration)}

  if(details.privateIteration)
  {
    postIteration['password'] = details.iterationPassword;
  }

  pool.getConnection(function (err, connection){
     var sql = 'UPDATE flexiprice.iterations SET ? WHERE iteration_id=?;'
     connection.query(sql, [postIteration,iterationId] , function (err, rows) {
      if (err != null) {
        deferred.reject(new Error(err.body));
      }
      if (err == null) {                           

      }
          connection.end();
    });  
   });

}

exports.newIteration = function(userId, details){

  var postIteration = {
    comment: details.comment,
    private: JSON.parse(details.privateIteration),
    iteration_id: details.iteration_id,
    experiment_id: details.experiment_id,
    link: details.link,
    subjects: details.subjects,
    researcher_id: userId
  }

  if(details.privateIteration)
  {
    postIteration['password'] = details.iterationPassword;
  }

  pool.getConnection(function (err, connection){
     var sql = 'INSERT INTO flexiprice.iterations SET ?'
     connection.query(sql, postIteration , function (err, rows) {
      if (err != null) {
        deferred.reject(new Error(err.body));
      }
      if (err == null) {                           

      }
          connection.end();
    });  
   });
}

//Getting Iteration Details for excel
exports.getIterationsDetails = function (iterationId) {
  var deferred = Q.defer();
 
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT * FROM flexiprice.users as users INNER JOIN questionToProduct as questionToProduct ON users.user_id=questionToProduct.userID ';
    sql += 'INNER JOIN questions as questions ON questionToProduct.questionID =questions.question_id ';
    sql += 'INNER JOIN (select products.name as product_name, products.product_id from products) products ON questionToProduct.productID=products.product_id where users.iteration_id =?;';
     connection.query(sql, iterationId , function (err, rows) {
    if (err!= null) {
      deferred.reject(new Error(err.body));
    }

    if (err == null) {

        deferred.resolve(rows);
       }  
       connection.end();
    
    });
   });

  return deferred.promise;
}

exports.getExperimentsNum = function (user_id) {
  var deferred = Q.defer();
 
   pool.getConnection(function (err, connection) {
   var sql = 'select count(*) from experiments where experiments.user_id =?;'
     connection.query(sql, user_id , function (err, rows) {
    if (err!= null) {
      deferred.reject(new Error(err.body));
    }

    if (err == null) {
         deferred.resolve(rows);
       }  
       connection.end();
    
    });
   });

  return deferred.promise;
}

exports.getIterationsByUser = function (user_id) {
  var deferred = Q.defer();
 
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT * FROM flexiprice.iterations ';
sql += 'inner JOIN (select experiments.experiment_name, experiments.user_id, experiments.experiment_id from experiments) experiments ';
 sql+= 'where iterations.experiment_id = experiments.experiment_id and researcher_id=?;';
     connection.query(sql, user_id , function (err, rows) {
    if (err!= null) {
      deferred.reject(new Error(err.body));
    }

    if (err == null) {
         deferred.resolve(rows);
       }  
       connection.end();
    
    });
   });

  return deferred.promise;
}

exports.getIntro = function (exp_id) {
  var deferred = Q.defer();
 
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT introduction FROM flexiprice.titlesNMessages where experimentID=?;';     
   connection.query(sql, exp_id , function (err, rows) {
    if (err!= null) {
      deferred.reject(new Error(err.body));
    }

    if (err == null) {
         deferred.resolve(rows);
       }  
       connection.end();
    
    });
   });
  return deferred.promise;
}

exports.getConclusion = function (exp_id) {
  var deferred = Q.defer();
 
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT conclusion FROM flexiprice.titlesNMessages where experimentID=?;';     
   connection.query(sql, exp_id , function (err, rows) {
    if (err!= null) {
      deferred.reject(new Error(err.body));
    }

    if (err == null) {
         deferred.resolve(rows);
       }  
       connection.end();
    
    });
   });

  return deferred.promise;
}

exports.getIteration = function (iteration_id) {
  var deferred = Q.defer();
 
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT * FROM flexiprice.iterations '; 
  sql += 'inner JOIN (select experiments.experiment_name, experiments.experiment_id from experiments) experiments '; 
  sql += 'where iterations.experiment_id = experiments.experiment_id and iterations.iteration_id=?;';
     connection.query(sql, iteration_id , function (err, rows) {
    if (err!= null) {
      deferred.reject(new Error(err.body));
    }

    if (err == null) {
         deferred.resolve(rows);
       }  
       connection.end();
    
    });
   });

  return deferred.promise;
}

exports.getRateHaders = function (exp_id) {
  var deferred = Q.defer();
 
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT ratingHeader, ratingSubHeader FROM flexiprice.titlesNMessages where experimentID=?;';     
   connection.query(sql, exp_id , function (err, rows) {
    if (err!= null) {
      console.log("Error finding conclusion" + err);
      deferred.reject(new Error(err.body));
    }

    if (err == null) {
         deferred.resolve(rows);
       }  
       connection.end();
    
    });
   });

  return deferred.promise;
}