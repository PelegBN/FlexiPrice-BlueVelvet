//CategoriesDB
//Module resposiable on all categories function to DB

var Q = require('q');
var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : 'workflow.cmdci40vhwqs.eu-central-1.rds.amazonaws.com',
  user     : 'flexiprice',
  password : 'flexi2015',
  database : 'flexiprice'
});

exports.getCategories = function (user_id) {
  var deferred = Q.defer();
 
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT * FROM flexiprice.categories where user_id=?;'
     connection.query(sql, user_id , function (err, rows) {
    if (err!= null) {
      //Error finding categories
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


exports.newCategory = function (name, description, user_idNew) {
  var deferred = Q.defer();

  var postCategory = {
    user_id: user_idNew,
    category_name: name,
    category_desc : description,
    active: '1',
    products_number: '0'
  }

  pool.getConnection(function (err, connection){
    connection.query('INSERT INTO flexiprice.categories SET ?', postCategory, function (err, result) {
      if (err != null) {
        //Can't insert category
        deferred.reject(new Error(err.body));
      }
      if (err == null) {                           
        var lastId = result.insertId;
        var category = exports.getCategory(lastId);
        deferred.resolve(category);

      }
          connection.end();
    });
  });
 return deferred.promise;
}

exports.getCategory = function (category_id) {
  var deferred = Q.defer();
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT * FROM flexiprice.categories where category_id=?;'
     connection.query(sql, category_id , function (err, rows) {
    if (err!= null) {
      //Error finding category
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

exports.getProducts = function (category_id) {
  var deferred = Q.defer();
 
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT * FROM flexiprice.products where category_id=?;'
     connection.query(sql, category_id , function (err, rows) {
    if (err!= null) {
      //Error finding products
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

exports.getProduct = function (product_id) {
  var deferred = Q.defer();
   pool.getConnection(function (err, connection) {
   var sql = 'SELECT * FROM flexiprice.products where product_id=?;'
     connection.query(sql, product_id , function (err, rows) {
    if (err!= null) {
      //Error finding product
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

exports.newProduct = function (name, description, value, min_price, url, file_url, type, category_id) {
 var final_url;

  switch(type)
  {
    case 'URL': final_url = url; break;
    case 'Image': final_url = file_url; break;
  }

  var postProduct = {
    category_id: category_id,
    name: name,
    description : description,
    value: value,
    type: type,
    path:final_url, 
    min_price: min_price
  }

  pool.getConnection(function (err, connection){
    connection.query('INSERT INTO flexiprice.products SET ?', postProduct, function (err, result) {
      if (err != null) {
        
        deferred.reject(new Error(err.body));
      }
      if (err == null) {                           
        exports.updateCategory(category_id);
      }
          connection.end();
    });
  });

}

//UPDATE `flexiprice`.`products` SET `category_id`='2', `description`='PHP dynamic insert - mysql. Is there a better !', `type`='url', `name`='codereview !', `value`='52', `min_price`='43' WHERE `product_id`='16';
exports.updateProduct = function (name, description, value, min_price, url, file_url, type, product_id) {
 var final_url;

  switch(type)
  {
    case 'URL': final_url = url; break;
    case 'Image': final_url = file_url; break;
  }

  var postProduct = {
    name: name,
    description : description,
    value: value,
    type: type,
    path:final_url, 
    min_price: min_price
  }

  pool.getConnection(function (err, connection){
    connection.query('UPDATE flexiprice.products SET ? WHERE product_id = ?', [postProduct, product_id], function (err, result) {
      if (err != null) {
        deferred.reject(new Error(err.body));
      }
      if (err == null) {                           
    
      }
          connection.end();
    });
  });

}

exports.deleteProduct = function (pro_id, cat_id) {
  pool.getConnection(function (err, connection){
    connection.query('DELETE FROM flexiprice.products WHERE product_id = ?', pro_id, function (err, result) {
      if (err != null) {
        deferred.reject(new Error(err.body));
      }
      if (err == null) {                           
          exports.deleteFromCategory(cat_id);
      }
          connection.end();
    });
  });

}

exports.deleteCategory = function (cat_id) {
  pool.getConnection(function (err, connection){
    connection.query('DELETE FROM flexiprice.categories WHERE category_id = ?', cat_id, function (err, result) {
      if (err != null) {
        deferred.reject(new Error(err.body));
      }
      if (err == null) {  
        connection.query('DELETE FROM flexiprice.products WHERE category_id = ?', cat_id, function (err, result) {
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

exports.updateCategory = function (cat_id) {
  pool.getConnection(function (err, connection){
      var sql = 'UPDATE flexiprice.categories SET products_number=products_number+1 WHERE category_id=?;'
     connection.query(sql, cat_id , function (err, rows) {
      if (err != null) {
        deferred.reject(new Error(err.body));
      }
      if (err == null) {                           

      }
          connection.end();
    });
  });

}

exports.deleteFromCategory = function (cat_id) {
  pool.getConnection(function (err, connection){
      var sql = 'UPDATE flexiprice.categories SET products_number=products_number-1 WHERE category_id=?;'
     connection.query(sql, cat_id , function (err, rows) {
      if (err != null) {
        deferred.reject(new Error(err.body));
      }
      if (err == null) {                           

      }
          connection.end();
    });
  });

}

exports.getCategoriesNum = function (user_id) {
  var deferred = Q.defer();
 
   pool.getConnection(function (err, connection) {
   var sql = 'select count(*) from categories where categories.user_id =?;'
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
