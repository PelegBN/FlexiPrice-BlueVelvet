//Paymeny Functions
//Show Price ON
function showPriceOnPayment(productId,path,value, productName){
  var temp = JSON.parse(sessionStorage.getItem("product"+productId));
  var showPricesDialog = document.getElementById('showPricesDialog');
  showPricesDialog.showModal();

  document.getElementById('showPricesYesBTN').onclick = function() {    
    if((sessionStorage.getItem("wallet") - value) > 0){
      //Updating Wallet and setting product to be avilable
      window.open(path, '_blank');
      sessionStorage.setItem("wallet", (sessionStorage.getItem("wallet") - value).toFixed(2));
      document.getElementById("wallet").innerHTML = sessionStorage.getItem("wallet");

      temp["avilable"] = true;
      temp["paid_price"] = value;
      sessionStorage.setItem("product"+productId, JSON.stringify(temp));

      question["numOfProducts"]++;
      question["products"].push(temp);
      sessionStorage.setItem("question"+questionNum, JSON.stringify(question));

      document.getElementById('product'+productId).className = 'productBought';
    }
    else {
      notEnoughMoney();
    }  
    showPricesDialog.close();  
  };  
  document.getElementById('showPricesNoBTN').onclick = function() { 
    showPricesDialog.close();    
  };  
}

//Open negotiation is on
function openNegPop(productId, path, productName, value) {  

  var openNegotiationDialog = document.getElementById('openNegotiationDialog');
  openNegotiationDialog.showModal();
  
  document.getElementById('openNegotiationBidBTN').onclick = function() { 
    var price = document.getElementById('openNegotiationPrice').value;
    if (price === ""){console.log("price is empty");}

    else{
      if (price !== null) {
        if((sessionStorage.getItem("wallet") - price) > 0)
        {
          //Updating wallet and setting product to be avilabe
          window.open(path, '_blank');
          sessionStorage.setItem("wallet", (sessionStorage.getItem("wallet") - price).toFixed(2));
          document.getElementById("wallet").innerHTML = sessionStorage.getItem("wallet");

          var temp = JSON.parse(sessionStorage.getItem("product"+productId));
          temp["avilable"] = true;
          temp["subjective_price"] = price;
          temp["paid_price"] = price;

          sessionStorage.setItem("product"+productId, JSON.stringify(temp));

          question["products"].push(temp);
          question["numOfProducts"]++;
          sessionStorage.setItem("question"+questionNum, JSON.stringify(question));

          document.getElementById('product'+productId).className = 'productBought';

        }
        else {
          notEnoughMoney();
        }
      }
      else {}
    }
    openNegotiationDialog.close();    
  };

  document.getElementById('openNegotiationCancelBTN').onclick = function() {   
    openNegotiationDialog.close();    
  };  
  document.getElementById('openNegotiationPrice').value = "";
}

//Open negotiation off + use min price on
function useMinPriceOn(productId, path, value, productName, max_tries){
  console.log("useMinPriceOn");
  var count = max_tries;
  var done = false;
  var tempProduct;

  if (count == 0 && done == false)
  {
    document.getElementById('useMinimumOnPrice').value = "";
    maxTries();
    return;
  }

  var useMinimumOnDialog = document.getElementById('useMinimumOnDialog');
  useMinimumOnDialog.showModal();

  document.getElementById('useMinimumOnBidBTN').onclick = function() {
    var price = document.getElementById('useMinimumOnPrice').value;
    if (price =="") {
      console.log("Price empty");
    }
    else {
      if (price !== null) {
        if(price >= value) {
            if((sessionStorage.getItem("wallet") - value) > 0)
            {
              //Updating wallet and setting product to be avilabe
              window.open(path, '_blank');
              sessionStorage.setItem("wallet", (sessionStorage.getItem("wallet") - value).toFixed(2));
              document.getElementById("wallet").innerHTML = sessionStorage.getItem("wallet");

              tempProduct = JSON.parse(sessionStorage.getItem("product"+productId));
              tempProduct["avilable"] = true;
              tempProduct["subjective_price"].push(price);
              tempProduct["paid_price"] = value;

              sessionStorage.setItem("product"+productId, JSON.stringify(tempProduct));
                                    
              question["numOfProducts"]++;
              question["products"].push(tempProduct);
              sessionStorage.setItem("question"+questionNum, JSON.stringify(question));
              done = true;

              document.getElementById('product'+productId).className = 'productBought';

              document.getElementById('useMinimumOnPrice').value = "";
              useMinimumOnDialog.close(); 
            }
            else {
              notEnoughMoney();
            }
        }
        else {
          count--;
          useMinimumOnDialog.close(); 
          
          tempProduct = JSON.parse(sessionStorage.getItem("product"+productId));
          tempProduct["subjective_price"].push(price);

          sessionStorage.setItem("product"+productId, JSON.stringify(tempProduct));
          
          useMinPriceOn(productId, path, value, productName, count);
          priceLow();
        }
      }
      else {}
    }
  };

  document.getElementById('useMinimumOnCancelBTN').onclick = function() {   
    useMinimumOnDialog.close();    
  };  

  
  document.getElementById('useMinimumOnPrice').value = "";
}

//Open negotiation off + use min price off
function useMinPriceOff(productId, path, value, productName, max_tries){
  console.log("useMinPriceOn");
  var count = max_tries;
  var done = false;
  var tempProduct;

  if (count == 0 && done == false)
  {
    document.getElementById('useMinimumOffPrice').value = "";
    maxTries();
  }

  var useMinimumOffDialog = document.getElementById('useMinimumOffDialog');
  useMinimumOffDialog.showModal();

  document.getElementById('useMinimumOffBidBTN').onclick = function() {
    var price = document.getElementById('useMinimumOffPrice').value;
    if (price =="") {
      console.log("Price empty");
    }
    else {
      if (price !== null) {
        if(price >= value) {
            if((sessionStorage.getItem("wallet") - value) > 0)
            {
              //Updating wallet and setting product to be avilabe
              window.open(path, '_blank');
              sessionStorage.setItem("wallet", (sessionStorage.getItem("wallet") - price).toFixed(2));
              document.getElementById("wallet").innerHTML = sessionStorage.getItem("wallet");

              tempProduct = JSON.parse(sessionStorage.getItem("product"+productId));
              tempProduct["avilable"] = true;
              tempProduct["subjective_price"].push(price);
              tempProduct["paid_price"] = value;

              sessionStorage.setItem("product"+productId, JSON.stringify(tempProduct));
                                    
              question["numOfProducts"]++;
              question["products"].push(tempProduct);
              sessionStorage.setItem("question"+questionNum, JSON.stringify(question));
              done = true;

              document.getElementById('product'+productId).className = 'productBought';

              document.getElementById('useMinimumOffPrice').value = "";
              useMinimumOffDialog.close(); 
            }
            else {
              notEnoughMoney();
            }
        }
        else {
          count--;
          useMinimumOffDialog.close(); 
          
          tempProduct = JSON.parse(sessionStorage.getItem("product"+productId));
          tempProduct["subjective_price"].push(price);

          sessionStorage.setItem("product"+productId, JSON.stringify(tempProduct));
          
          useMinPriceOff(productId, path, value, productName, count);
          priceLow();
        }
      }
      else {}
    }
  };

  document.getElementById('useMinimumOffCancelBTN').onclick = function() {   
    useMinimumOffDialog.close();    
  };  

  document.getElementById('useMinimumOffPrice').value = "";
}


//Rating Page
function startRating(){
  tipWallet = sessionStorage.getItem("wallet");
  document.getElementById("ratingArea").style.display = "block";

  var tbl=document.getElementById('keywords1');
  var tbdy=document.createElement('tbody');
  tbdy.className = "ratingTableStyle";
  
    var i=1;
    while (sessionStorage.getItem("question"+i)){
        var quesNum = i;
        var temp = JSON.parse(sessionStorage.getItem("question"+quesNum));
        var products = temp["products"];

        for(var j=0; j<products.length; j++){
          var tr=document.createElement('tr');
          var name = products[j]["name"];
          var prodNum = j+1;
          for(var k=0;k<4;k++){
              var td=document.createElement('td');
              td.style.textAlign = "center";
              if(k==0) td.innerText = quesNum; 
              if (name == "") name = "You didn't choose any item in this question"
              if (k==1 ) td.innerHTML = name;
              if (k == 2) td.innerHTML = "<input class='numStyle' type='number' id='tip" +quesNum+prodNum+ "' name='tip' min='0' step='1' value='0' onchange='checkValidTip()'>";
              if (k==3) {
                  tempRate = '<span class="star-rating">';
                  tempRate+= '<input type="radio" name="rating'+quesNum+prodNum+'" id="rate'+quesNum+prodNum+'" value="1"><i></i>';
                  tempRate+= '<input type="radio" name="rating'+quesNum+prodNum+'" id="rate'+quesNum+prodNum+'" value="2"><i></i>';
                  tempRate+= '<input type="radio" name="rating'+quesNum+prodNum+'" id="rate'+quesNum+prodNum+'" value="3"><i></i>';
                  tempRate+= '<input type="radio" name="rating'+quesNum+prodNum+'" id="rate'+quesNum+prodNum+'" value="4"><i></i>';
                  tempRate+= '<input type="radio" name="rating'+quesNum+prodNum+'" id="rate'+quesNum+prodNum+'" value="5"><i></i>';
                  tempRate+= '</span>';

              var myString = tempRate;
                  myString = $("<div />").html(myString);
                  $(td).append(myString);
              }
             
              tr.appendChild(td)
          }
        tbdy.appendChild(tr);

        }
        i++;
    }
    tbl.appendChild(tbdy);
}

function checkValidTip(){
  var totalTip = 0;
  var tipWallet = sessionStorage.getItem("wallet");
  for(var i=1;i<=JSON.parse(sessionStorage.getItem("questionNumber"));i++){
    var questionTemp = JSON.parse(sessionStorage.getItem("question"+i));
    var products = questionTemp["products"];
    for(var j=0; j<products.length; j++){
      var num = j+1;
      var tip = document.getElementById("tip"+i+num).value;
      totalTip += JSON.parse(tip);
    }
  }
  //totalTip -= tip;
  console.log('Tip: ' + tip);
  if((tipWallet - totalTip) < 0)
  {
    notEnoughMoney();
    document.getElementById('submitBTN').disabled = true;
  }
  else {
    document.getElementById('submitBTN').disabled = false;
    //tipWallet -= tip;
  }
}

function submitAllIterationData(exp_id){
  var totalTip = 0;
  //Getting Tip and rating
  
  var i=1;
  while (sessionStorage.getItem("question"+i)){
    var questionTemp = JSON.parse(sessionStorage.getItem("question"+i));
    var products = questionTemp["products"];
    
    for(var j=0; j<products.length; j++){

      var num = j+1;
      var tip = document.getElementById("tip"+i+num).value;
      totalTip += JSON.parse(tip);

      //var rate = document.getElementById("rate"+i+num).value;
      var rate = $("input:radio[name='rating"+i+num+"']:checked").val();
      products[j]["revealed_price"] = tip;
      products[j]["rating"] = rate;
    }
    questionTemp["products"] = products;
    sessionStorage.setItem("question"+i, JSON.stringify(questionTemp));

    i++;
  }

  var questionsArray = [];

  var j=1;
  while (sessionStorage.getItem("question"+j)){
    questionsArray.push(JSON.parse(sessionStorage.getItem("question"+j)));
    j++;
  }

  var data = {};
  data.iteration = sessionStorage.getItem("iteration");
  data.sessionID = sessionStorage.getItem("sessionID");
  data.name = sessionStorage.getItem("name");
  data.numOfquestions = i-1;
  data.grade = sessionStorage.getItem("score");
  data.balance = sessionStorage.getItem("wallet") - totalTip;
  data.question_array = questionsArray;

  var request = $.ajax({
    url: "/iterationSubmit",
    async: false,
    type: "POST",
    data: data,
    contentType: "application/x-www-form-urlencoded", //This is what made the difference.
    dataType: "json",
  });


  request.success(function(result) {
      window.location.href = '/ExperimentConclusion:'+exp_id;
  });

  request.fail(function(jqXHR, textStatus) {
      alert("Request failed: " + textStatus);
  });
}