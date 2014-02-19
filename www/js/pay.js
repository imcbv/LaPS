function database(){
	this.db;
	this.getdb = function() {
		return this.db;
	}
	this.setdb = function(db){
		this.db=db;
	}
	
}

var db = new database();
var card;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
		
		var datab = window.openDatabase("Database", "1.0", "Coupon storage", 200000);
		db.setdb(datab);
		
        document.addEventListener('deviceready', this.onDeviceReady, false);
		var tastoBack = document.getElementById('back');
		tastoBack.addEventListener('click', function(){window.history.back();}, false);
		//app.receivedEvent('deviceready');	
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		nfc.addNdefListener(app.pay,function(){},function(){});
		app.receivedEvent('deviceready');		
    },
	
	pay: function() {
		
			alert("Payment completed");
			window.location.href = "share.html";
		
	},
	
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		
		app.openDb();	
        
    },
	
	openDb: function() {		
        db.getdb().transaction(app.populateDB, app.errorCB, app.successCB);
	},
	
	populateDB:function(tx) {
		 tx.executeSql('CREATE TABLE IF NOT EXISTS CARD (id int primary key)');
		 tx.executeSql('SELECT id FROM CARD;',[], function(tx,results){var len = results.rows.length; if(len>0){card=results.rows.item(0).id;} else{card=-1;} server.mostraInfo();}, app.errorCB);
		 
	},
	
	

    // Transaction error callback
    //
    errorCB:function(tx, err) {
        alert("Error processing SQL: "+err);
    },

    // Transaction success callback
    //
    successCB:function() {  
	
    },
	
	
};

var server = {

	mostraInfo:function() {
		xmlhttp=server.GetXmlHttpObject();
		if (xmlhttp==null) {
			alert ("Browser does not support HTTP Request");
			return;
		}
		var url="http://laps.altervista.org/php/cards.php";
		
		xmlhttp.open("GET",url,false);
		xmlhttp.send();
		server.stateChanged();
		
		
	},

	stateChanged:function() {
		
			
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) { 
				var htmlContent="";
				var pages = "";
				var xmlDoc=xmlhttp.responseXML;
				var i=0;
				var printed = false;
				while(i<xmlDoc.getElementsByTagName('picture').length){
					if(xmlDoc.getElementsByTagName('id')[i].firstChild.nodeValue == card){
						var picture=xmlDoc.getElementsByTagName('picture')[i].firstChild.nodeValue;
						htmlContent=htmlContent+"<div style='text-align:center; padding-top:15px; padding-bottom:5px;'>Currently selected card:</div><div style='text-align:center'><img width='150px' src='"+picture+"'></div>";
						printed=true;
					}
					i=i+1;
					
				}
				if(printed == false){
					htmlContent+="<div style='text-align:center'>No card selected</div>";
				}
				document.getElementById("carousel").innerHTML=htmlContent;
				
			}
			else {
				alert("Server error");
			}
			
		}
		
	},

	GetXmlHttpObject:function(){
		if (window.XMLHttpRequest){
			// code for IE7+, Firefox, Chrome, Opera, Safari
			return new XMLHttpRequest();
		}
		if (window.ActiveXObject){
			// code for IE6, IE5
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	return null;
	}
}

