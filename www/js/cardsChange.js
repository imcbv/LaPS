function swiperInstance(){
	
	this.mySwiper;
	this.posid;
	
	this.createPosid = function(){
		posid=new Array();
	};
	
	this.getSwiper = function() {
        return this.mySwiper;
    };
	
	this.setSwiper = function(mySwiper){
		this.mySwiper=mySwiper;
	};
	
	this.setPosid = function(id){
		
		posid.push(id);
	};
	
	this.getPosid = function(pos){
		return posid[pos];
	};
	
	
}

function database(){
	this.db;
	this.getdb = function() {
		return this.db;
	}
	this.setdb = function(db){
		this.db=db;
	}
	
}

var swipe = new swiperInstance();
var db = new database();
var posterId;

var app = {
	
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
		
		var datab = window.openDatabase("Database", "1.0", "Coupon storage", 200000);
		db.setdb(datab);
		
		//abilitare questa funzione solo per test da computer
		app.onDeviceReady();
        
		document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },
	
	onDeviceReady: function() {
		
        app.receivedEvent('deviceready');
		
		var tastoSelect = document.getElementById('select');
		tastoSelect.addEventListener('click', app.openDb, false);
		
		var tastoBack = document.getElementById('back');
		tastoBack.addEventListener('click', function(){window.history.back();}, false);
			
    },

    receivedEvent: function(id) {		
		server.mostraInfo();
								
    },
	
	openDb: function() {		
        db.getdb().transaction(app.populateDB, app.errorCB, app.successCB);
	},
	
	populateDB:function(tx) {
		 tx.executeSql('DROP TABLE IF EXISTS CARD;');
		 tx.executeSql('CREATE TABLE IF NOT EXISTS CARD (id int primary key);');
		 tx.executeSql('INSERT INTO CARD (id) VALUES ('+swipe.getPosid(swipe.getSwiper().activeLoopIndex)+');',[], function(tx){}, app.errorCB);
		 
	},
	
	

    // Transaction error callback
    //
    errorCB:function(tx, err) {
        alert("Error processing SQL: "+err);
    },

    // Transaction success callback
    //
    successCB:function() {  
	
		alert('Card correctly selected');
		window.history.back();
	
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
				htmlContent=htmlContent+"<div class='swiper-container'><div class='swiper-wrapper'>";
				var xmlDoc=xmlhttp.responseXML;
				var i=0;
				swipe.createPosid();
				while(i<xmlDoc.getElementsByTagName('picture').length){
					swipe.setPosid(xmlDoc.getElementsByTagName('id')[i].firstChild.nodeValue);
					var picture=xmlDoc.getElementsByTagName('picture')[i].firstChild.nodeValue;
					htmlContent=htmlContent+"<div class='swiper-slide'><img width='100%' src='"+picture+"'>"+name+"</div>";
					i=i+1;
					
				}
				document.getElementById("carousel").innerHTML=htmlContent+"</div></div>";
				app.loadSwiper()
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
