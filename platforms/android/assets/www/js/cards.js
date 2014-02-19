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
	
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
		
		var datab = window.openDatabase("Database", "1.0", "Coupon storage", 200000);
		db.setdb(datab);
		
		//abilitare questa funzione solo per test da computer
		//app.onDeviceReady();
        
		document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },
	
	onDeviceReady: function() {
		
        app.receivedEvent('deviceready');
		var tastoPay = document.getElementById('pay');
		tastoPay.addEventListener('click', function(){if(card==-1){alert('First select a card');} else{window.location.href = "pay.html";}}, false);
			
    },

    receivedEvent: function(id) {	
		app.openDb();	
		
								
    },
	
	openDb: function() {		
        db.getdb().transaction(app.populateDB, app.errorCB, app.successCB);
	},
	
	populateDB:function(tx) {
		 tx.executeSql('CREATE TABLE IF NOT EXISTS CARD (id int primary key)');
		 tx.executeSql('SELECT id FROM CARD;',[], function(tx,results){ var len = results.rows.length; if(len>0){card=results.rows.item(0).id;} else{card=-1;} server.mostraInfo();}, app.errorCB);
		 
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
	
	loadSwiper:function(){
		swipe.setSwiper(new Swiper('.swiper-container',{
    	//Your options here:
    	mode:'horizontal',
    	loop: true
    	//etc..
  		}));  
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
				while(i<xmlDoc.getElementsByTagName('id').length){
					if(xmlDoc.getElementsByTagName('id')[i].firstChild.nodeValue == card){
						var picture=xmlDoc.getElementsByTagName('picture')[i].firstChild.nodeValue;
						htmlContent=htmlContent+"<div style='text-align:center; padding:5px;'>Currently selected card:</div><div style='text-align:center'><img width='330px' src='"+picture+"'></div>";
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
