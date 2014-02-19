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

var id;

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
		
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
		//app.receivedEvent('deviceready');
		
		var tastoBack = document.getElementById('back');
		tastoBack.addEventListener('click', function(){window.history.back();}, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		app.receivedEvent('deviceready');
		nfc.addNdefListener(app.pay,function(){},function(){});		
    },
	
	
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		var datab = window.openDatabase("Database", "1.0", "Coupon storage", 200000);
		db.setdb(datab);
        db.getdb().transaction(app.getCoupons, app.errorCB, app.successCB);
		
    },
	
	getCoupons:function(tx){
		$i=0;
		while(window.location.href.charAt($i) && window.location.href.charAt($i)!='='){
			$i=$i+1;
		}
		$id="";
		while(window.location.href.charAt($i)){
			$id=$id+window.location.href.charAt($i+1);
			$i=$i+1;
		}
		id=$id;
		tx.executeSql('CREATE TABLE IF NOT EXISTS COUPON (id int primary key, imgurl text, discount int);');
		tx.executeSql('SELECT * FROM COUPON WHERE id='+id,[], app.querySuccess, app.errorCB);
		
		
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
	
	// Query success
	querySuccess:function(tx, results){
		
		var len = results.rows.length;
		var htmlContent="";
				
		if(len==0){
			htmlContent=htmlContent+"<div>NO COUPONS SAVED</div>";
		}
		else{
			var coupons = new Array();
			var discounts = new Array();
			htmlContent=htmlContent+"<div class='swiper-container'>";
        	for (var i=0; i<len; i++){
            	coupons[i] = results.rows.item(i).imgurl;
				discounts[i] = results.rows.item(i).discount;
				htmlContent=htmlContent+"<div class='swiper-slide' style='text-align:center;'><img width='100%' src='"+coupons[i]+"'>"+discounts[i]+"% Discount</div>";
			}
		}
		document.getElementById("carousel").innerHTML=htmlContent+"</div>";
		
	},
	
	pay:function(){
		db.getdb().transaction(app.removeCoupons,app.errorCB);
		
	},
	
	removeCoupons:function(tx){
		tx.executeSql('DELETE FROM COUPON WHERE id='+id,[], function(){alert("The coupon has been used!"); window.location.href = "pay.html";}, app.errorCB);
	},
	
	
};
