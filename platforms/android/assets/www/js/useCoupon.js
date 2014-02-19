var app = {
    // Application Constructor
    initialize: function() {
		var db = window.openDatabase("Database", "1.0", "Coupon storage", 200000);
        db.transaction(app.getCoupons, app.errorCB, app.successCB);
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
		
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
		var tastoBack = document.getElementById('back');
		tastoBack.addEventListener('click', function(){window.history.back();}, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		app.receivedEvent('deviceready');		
    },
	
	
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    },
	
	getCoupons:function(tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS COUPON (id int primary key, imgurl text, discount int);');
		tx.executeSql('SELECT * FROM COUPON',[], app.querySuccess, app.errorCB);
		
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
			var id = new Array();
			htmlContent=htmlContent+"<div class='swiper-container'><div class='swiper-wrapper'>";
        	for (var i=0; i<len; i++){
            	coupons[i] = results.rows.item(i).imgurl;
				discounts[i] = results.rows.item(i).discount;
				id[i] = results.rows.item(i).id;
				
				htmlContent=htmlContent+"<div class='swiper-slide' style='text-align:center;'><a href='nfcCoupon.html?id="+id[i]+"' rel='external'><img width='100%' src='"+coupons[i]+"'></a>"+discounts[i]+"% Discount</div>";
			}
		}
		document.getElementById("carousel").innerHTML=htmlContent+"</div></div>";
		app.loadSwiper();
		
	},
	
	loadSwiper:function(){
		var mySwiper = new Swiper('.swiper-container',{
    	//Your options here:
    	mode:'horizontal',
    	loop: true
    	//etc..
  		});  
	},
	
	
};
