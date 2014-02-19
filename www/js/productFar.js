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
		
		var tastoRedeem = document.getElementById('redeem');
		tastoRedeem.addEventListener('click', app.openDb, false);
		
		var tastoBack = document.getElementById('back');
		tastoBack.addEventListener('click', function(){window.location.href = "index.html";}, false);
													
		var tastoNear = document.getElementById('nearest');
		tastoNear.addEventListener('click', function(){
													window.location.href = "nearestShop.html";
													}, false);	
    },

    receivedEvent: function(id) {		
		$i=0;
		while(window.location.href.charAt($i) && window.location.href.charAt($i)!='='){
			$i=$i+1;
		}
		$id="";
		while(window.location.href.charAt($i)){
			$id=$id+window.location.href.charAt($i+1);
			$i=$i+1;
		}
		posterId=$id;
		server.mostraInfo(posterId);
		var tastoClue = document.getElementById('clue').href="clue.html?id="+posterId;
		db.getdb().transaction(function(tx){tx.executeSql('CREATE TABLE IF NOT EXISTS VISITED (id unique)');
										  tx.executeSql('SELECT * FROM VISITED WHERE id='+posterId,[], app.visitedCheck, app.errorCB);},
								app.errorCB);
								
    },
	
	openDb: function() {		
        db.getdb().transaction(app.populateDB, app.errorCB, app.successCB);
	},
	
	populateDB:function(tx) {
		 tx.executeSql('CREATE TABLE IF NOT EXISTS COUPON (id int primary key, imgurl text, discount int);');
		 tx.executeSql('SELECT * FROM COUPON WHERE id='+swipe.getPosid(swipe.getSwiper().activeLoopIndex),[], app.addCoupon, app.errorCB);
	},
	
	visitedCheck:function(tx, results){
		var len = results.rows.length;
		if(len != 0){
			document.getElementById("redeem").setAttribute("class", "ui-btn ui-icon-arrow-r ui-btn-icon-left ui-corner-all ui-state-disabled");
		}
	},
	
	addCoupon:function(tx, results){
		
		var len = results.rows.length;
		
		if(len == 0){
			tx.executeSql('INSERT INTO COUPON (id, imgurl, discount) VALUES ('+swipe.getPosid(swipe.getSwiper().activeLoopIndex)+', "img/indexSlide/'+swipe.getPosid(swipe.getSwiper().activeLoopIndex)+'.png", 5)');
		}
		
		else{
			tx.executeSql('UPDATE COUPON SET discount=discount+5 WHERE id='+swipe.getPosid(swipe.getSwiper().activeLoopIndex));
		}
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS VISITED (id unique)');
		tx.executeSql('INSERT INTO VISITED (id) VALUES ('+posterId+')');
		document.getElementById("redeem").setAttribute("class", "ui-btn ui-icon-arrow-r ui-btn-icon-left ui-corner-all ui-state-disabled");
		
		
		
	},

    // Transaction error callback
    //
    errorCB:function(tx, err) {
        alert("Error processing SQL: "+err);
    },

    // Transaction success callback
    //
    successCB:function() {  
		alert("Coupon correctly redeemed", function() {}, "","OK");
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

	mostraInfo:function(str) {
		xmlhttp=server.GetXmlHttpObject();
		if (xmlhttp==null) {
			alert ("Browser does not support HTTP Request");
			return;
		}
		var url="http://laps.altervista.org/php/productFar.php";
		url=url+"?q="+str;
		
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
					var name=xmlDoc.getElementsByTagName('name')[i].firstChild.nodeValue;
					htmlContent=htmlContent+"<div class='swiper-slide'><a href='productFarDetail.html?id="+xmlDoc.getElementsByTagName('id')[i].firstChild.nodeValue+"' rel='external' ) data-transition='slide'><img width='100%' src='"+picture+"'></a>"+name+"</div>";
					document.getElementById('redeem').addEventListener('click', app.openDb, false);
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
