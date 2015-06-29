$('tr.detailsRow').bind('click', function(){
     window.location = $('a:first', this).attr('href');
});

// Tabs

function generalPressed() {
	document.getElementById('generalSection').style.display = "block";
	document.getElementById('participantsSection').style.display = "none";
	document.getElementById('iterationSection').style.display = "none";
	
	document.getElementById('generalTab').className = "btn btn-default tabStyleActive";
	
	document.getElementById('ParticipantsTab').className = "btn btn-default tabStyle";
	
	var iterationColor = $('#IterationTab').css('color');
	if (iterationColor != "rgb(63, 69, 92)") {
		document.getElementById('IterationTab').className = "btn btn-default tabStyle";
	}

	var iterationSection = $('viewIteration').css('display');
	if (iterationSection != null) {
		document.getElementById('iterationTable').style.display = "block";	
		document.getElementById('viewIteration').style.display = "none";
	}
}

function participantsPressed() {
	document.getElementById('generalSection').style.display = "none";
	document.getElementById('participantsSection').style.display = "block";
	document.getElementById('iterationSection').style.display = "none";
	
	document.getElementById('generalTab').className = "btn btn-default tabStyle";
	
	document.getElementById('ParticipantsTab').className = "btn btn-default tabStyleActive";
	
	var iterationColor = $('#IterationTab').css('color');
	if (iterationColor != "rgb(63, 69, 92)") {
		document.getElementById('IterationTab').className = "btn btn-default tabStyle";
	}

	var iterationSection = $('viewIteration').css('display');
	if (iterationSection != null) {
		document.getElementById('iterationTable').style.display = "block";	
		document.getElementById('viewIteration').style.display = "none";
	}
}

function iterationPressed() {
	document.getElementById('generalSection').style.display = "none";
	document.getElementById('participantsSection').style.display = "none";
	document.getElementById('iterationSection').style.display = "block";
	
	document.getElementById('generalTab').className = "btn btn-default tabStyle";
	
	document.getElementById('ParticipantsTab').className = "btn btn-default tabStyle";
	
	document.getElementById('IterationTab').className = "btn btn-default tabStyleActive";	
}

function editIterationPressed(index) {
	document.getElementById('generalSection').style.display = "none";
	document.getElementById('participantsSection').style.display = "none";
	document.getElementById('iterationSection').style.display = "block";
	
	document.getElementById('generalTab').className = "btn btn-default tabStyle";
	
	document.getElementById('ParticipantsTab').className = "btn btn-default tabStyle";
	
	document.getElementById('IterationTab').className = "btn btn-default tabStyleActive";	

	document.getElementById('iterationTable').style.display = "none";	
	document.getElementById('viewIteration').style.display = "block";	
}

function newIterationPressed() {
	document.getElementById('generalSection').style.display = "none";
	document.getElementById('participantsSection').style.display = "none";
	document.getElementById('iterationSection').style.display = "block";
	
	document.getElementById('generalTab').className = "btn btn-default tabStyle";
	
	document.getElementById('ParticipantsTab').className = "btn btn-default tabStyle";
	
	document.getElementById('IterationTab').className = "btn btn-default tabStyleActive";	

	document.getElementById('iterationTable').style.display = "none";	
	document.getElementById('viewIteration').style.display = "block";

	var link = createLink();
	privateSwitch();
}

function iterationSubmitPressed() {
	document.getElementById('generalSection').style.display = "none";
	document.getElementById('participantsSection').style.display = "none";
	document.getElementById('iterationSection').style.display = "block";
	
	document.getElementById('generalTab').className = "btn btn-default tabStyle";
	
	document.getElementById('ParticipantsTab').className = "btn btn-default tabStyle";
	
	document.getElementById('IterationTab').className = "btn btn-default tabStyleActive";	

	document.getElementById('iterationTable').style.display = "block";	
	document.getElementById('viewIteration').style.display = "none";

	document.getElementById('password').value = "";
	document.getElementById('PrivateOnOffSwitch').checked = false;
}

// New Product Radio Buttons
function website() {
	document.getElementById('weburl').disabled = false;
	document.getElementById('fileUpload').disabled = true; 
	document.getElementById('fileUpload').value = null;
	document.getElementById('submitBTN').disabled = false;

	document.getElementById('noneSelected').style.color = "#757E8C";
	document.getElementById('urlSelected').style.color = "#EEE";
	document.getElementById('fileSelected').style.color = "#757E8C"; }
	
function fileup() {
	document.getElementById('weburl').disabled = true;
	document.getElementById('weburl').value = ""; 
	document.getElementById('fileUpload').disabled = false;

	document.getElementById('noneSelected').style.color = "#757E8C";
	document.getElementById('urlSelected').style.color = "#757E8C";
	document.getElementById('fileSelected').style.color = "#EEE";

	document.getElementById('submitBTN').disabled = true; }
	
function none(){
	document.getElementById('weburl').disabled = true;
	document.getElementById('weburl').value = ""; 
	document.getElementById('fileUpload').disabled = true;	
	document.getElementById('fileUpload').value = null;
	document.getElementById('submitBTN').disabled = false;

	document.getElementById('noneSelected').style.color = "#EEE";
	document.getElementById('urlSelected').style.color = "#757E8C";
	document.getElementById('fileSelected').style.color = "#757E8C"; }

// New Experiment Switches
function lightShow(){
	var showPrices = document.getElementById('PriceOnOffSwitch');
	var negotiation = document.getElementById('BidOnOffSwitch');
	var minimumPrice = document.getElementById('MinPriceOnOffSwitch');
	
	if (minimumPrice.checked) {
		document.getElementById('firstLvlActivate').style.borderColor = "#4960BD";
		document.getElementById('secondLvlActivate').style.borderColor = "#4960BD";
		document.getElementById('firstLvlArrowActivate').style.color = "#4960BD";
		document.getElementById('secondLvlArrowActivate').style.color = "#4960BD";
	}
	
	if (showPrices.checked) {
		document.getElementById('firstLvlActivate').style.borderColor = "#242735";
		document.getElementById('secondLvlActivate').style.borderColor = "#242735";
		document.getElementById('firstLvlArrowActivate').style.color = "#242735";
		document.getElementById('secondLvlArrowActivate').style.color = "#242735";
	}
	else{
		document.getElementById('firstLvlActivate').style.borderColor = "#4960BD";
		document.getElementById('secondLvlActivate').style.borderColor = "#242735";
		document.getElementById('firstLvlArrowActivate').style.color = "#4960BD";
		document.getElementById('secondLvlArrowActivate').style.color = "#242735";
	}
	
	if (negotiation.checked) {
		document.getElementById('firstLvlActivate').style.borderColor = "#4960BD";
		document.getElementById('secondLvlActivate').style.borderColor = "#242735";
		document.getElementById('firstLvlArrowActivate').style.color = "#4960BD";
		document.getElementById('secondLvlArrowActivate').style.color = "#242735";
	}
	else {
		if ((!negotiation.checked) && (!showPrices.checked)) {
			document.getElementById('secondLvlActivate').style.borderColor = "#4960BD";
			document.getElementById('secondLvlArrowActivate').style.color = "#4960BD";
		}
	}
	
}

function showPrices() {
	var temp = document.getElementById('PriceOnOffSwitch');
	if (temp.checked)	{
		document.getElementById('PriceOnOffSwitch').checked = true;
		document.getElementById('BidOnOffSwitch').checked = false;
		document.getElementById('MinPriceOnOffSwitch').checked = false;
		document.getElementById('showPriceLabel').style.color = "#EEE";
		document.getElementById('negotiationLabel').style.color = "#757E8C";
		document.getElementById('nimPriceLabel').style.color = "#757E8C";
		lightShow();
	}
	else {
		document.getElementById('PriceOnOffSwitch').checked = false;
		document.getElementById('showPriceLabel').style.color = "#757E8C";
		lightShow();
	}
}
	
function negotiation() {
	var temp = document.getElementById('BidOnOffSwitch');
		if (temp.checked)	{
		document.getElementById('PriceOnOffSwitch').checked = false;
		document.getElementById('BidOnOffSwitch').checked = true;
		document.getElementById('MinPriceOnOffSwitch').checked = false;
		document.getElementById('showPriceLabel').style.color = "#757E8C";
		document.getElementById('negotiationLabel').style.color = "#EEE";
		document.getElementById('nimPriceLabel').style.color = "#757E8C";
		lightShow();
	}
	else {
		document.getElementById('BidOnOffSwitch').checked = false;
		document.getElementById('negotiationLabel').style.color = "#757E8C";
		lightShow();
	}
}
	

function minimumPrice(){
	var temp = document.getElementById('MinPriceOnOffSwitch');
		if (temp.checked )	{
		document.getElementById('PriceOnOffSwitch').checked = false;
		document.getElementById('BidOnOffSwitch').checked = false;
		document.getElementById('MinPriceOnOffSwitch').checked = true;
		document.getElementById('showPriceLabel').style.color = "#757E8C";
		document.getElementById('negotiationLabel').style.color = "#757E8C";
		document.getElementById('nimPriceLabel').style.color = "#EEE";
		lightShow();
	}
	else {
		document.getElementById('MinPriceOnOffSwitch').checked = false;
		document.getElementById('nimPriceLabel').style.color = "#757E8C";
		lightShow();
	}
}
	
function privateSwitch(){
	var privateSwitch = document.getElementById('PrivateOnOffSwitch');
	if (privateSwitch.checked )	{
		randomString();
		document.getElementById("generateBTN").style.pointerEvents = 'auto';
		document.getElementById('password').disabled = false;
	}
	else {
		document.getElementById("generateBTN").style.pointerEvents = 'none';
		document.getElementById('password').value = "";
		document.getElementById('password').disabled = true;
	}
}

// Password Generator
function randomString() {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 8;
  var randomstring = '';
  for (var i=0; i<string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }

  document.getElementById('password').value = randomstring;
}

function submitNewExperiment(){
      
    var data = {};
    data.ExpName = document.getElementById('ExpName').value;
    data.ExpDesc = document.getElementById('ExpDesc').value;

    data.MaxTries = document.getElementById('tries').value;
    data.Wallet = document.getElementById('wallet').value;
    data.GizmoCode = document.getElementById('GizmoCode').value;

    var e = document.getElementById('Categories');
	var Category = e.options[e.selectedIndex].value;
    data.Category = Category;

    data.showPrices = document.getElementById("PriceOnOffSwitch").checked;
    data.openNegotiation = document.getElementById("BidOnOffSwitch").checked;
    data.MinPrice = document.getElementById("MinPriceOnOffSwitch").checked;

             
    data.intro = document.getElementById('intro').value;
    data.conclusion = document.getElementById('conclusion').value;
    data.msgPriceOn = document.getElementById('msgPriceOn').value;
    data.msgNegoOn = document.getElementById('msgNegoOn').value;
    data.msgMinPriceOn = document.getElementById('msgMinPriceOn').value;
    data.msgMinPriceOff = document.getElementById('msgMinPriceOff').value;
    data.msgAboveProducts = document.getElementById('msgAboveProducts').value;
    data.msgPriceLow = document.getElementById('msgPriceLow').value;
    data.rateHeader = document.getElementById('rateHeader').value;
    data.rateSubHeader = document.getElementById('rateSubHeader').value;

    var request = $.ajax({
        url: "/SubmitExperiment",
        async: false,
        type: "POST",
        data: data,
        contentType: "application/x-www-form-urlencoded"
    });


    request.success(function(result) {
      	window.location.href = '/Experiments';
    });

    request.fail(function(jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}

function submitModifiedExperiment(exp_id){
  
    var data = {};
    data.ExpName = document.getElementById('ExpName').value;
    data.ExpDesc = document.getElementById('ExpDesc').value;

    data.MaxTries = document.getElementById('tries').value;
    data.Wallet = document.getElementById('wallet').value;
    data.GizmoCode = document.getElementById('GizmoCode').value;

    var e = document.getElementById('Categories');
	var Category = e.options[e.selectedIndex].value;
    data.Category = Category;

    data.showPrices = document.getElementById("PriceOnOffSwitch").checked;
    data.openNegotiation = document.getElementById("BidOnOffSwitch").checked;
    data.MinPrice = document.getElementById("MinPriceOnOffSwitch").checked;

             
    data.intro = document.getElementById('intro').value;
    data.conclusion = document.getElementById('conclusion').value;
    data.msgPriceOn = document.getElementById('msgPriceOn').value;
    data.msgNegoOn = document.getElementById('msgNegoOn').value;
    data.msgMinPriceOn = document.getElementById('msgMinPriceOn').value;
    data.msgMinPriceOff = document.getElementById('msgMinPriceOff').value;
    data.msgAboveProducts = document.getElementById('msgAboveProducts').value;
    data.msgPriceLow = document.getElementById('msgPriceLow').value;
    data.rateHeader = document.getElementById('rateHeader').value;
    data.rateSubHeader = document.getElementById('rateSubHeader').value;



    var request = $.ajax({
        url: "/SubmitModifiedExperiment:"+exp_id,
        async: false,
        type: "POST",
        data: data,
        contentType: "application/x-www-form-urlencoded"
    });


    request.success(function(result) {
      	window.location.href = '/Experiments';
    });

    request.fail(function(jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}

function submitNewIteration(exp_id){

 	token = document.getElementById("share_token").value;
    var data = {};
    data.iteration_id = token;
    data.experiment_id = exp_id; 
    data.link = document.getElementById('newIterationLink').innerText;
    data.comment = document.getElementById('iterationComment').value;
    data.privateIteration = document.getElementById("PrivateOnOffSwitch").checked;
    if (data.privateIteration)
    {
    	data.iterationPassword = document.getElementById('password').value;
    } 
    data.subjects = 0;

    
    var request = $.ajax({
        url: "/SubmitNewIteration",
        async: false,
        type: "POST",
        data: data,
        contentType: "application/x-www-form-urlencoded"
    });


    request.success(function(result) {
      	window.location.href = '/ModifyExperiment:'+exp_id;
    });
    
    request.fail(function(jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });

}

function submitModifiedIteration(exp_id, iteration_id){
  	console.log("Submitting");

    var data = {};
    data.comment = document.getElementById('iterationComment').value;
    data.privateIteration = document.getElementById("PrivateOnOffSwitch").checked;
    if (data.privateIteration)
    {
    	data.iterationPassword = document.getElementById('password').value;
    } 
         
    console.log(data);
    
    var request = $.ajax({
        url: "/SubmitModifiedIteration:"+iteration_id,
        async: false,
        type: "POST",
        data: data,
        contentType: "application/x-www-form-urlencoded"
    });


    request.success(function(result) {
      	window.location.href = '/ModifyExperiment:'+exp_id;
    });
    
    request.fail(function(jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });  
}