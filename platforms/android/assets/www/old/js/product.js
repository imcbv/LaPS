var app = {
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
		
		//abilitare questa funzione solo per test da computer
		app.receivedEvent('deviceready');
        
		document.addEventListener('deviceready', this.onDeviceReady, false);
		
		var tastoBack = document.getElementById('back');
		tastoBack.addEventListener('click', function(){window.location.href = "index.html";}, false);
		
		var tastoRedeem = document.getElementById('redeem');
		tastoRedeem.addEventListener('click', app.addCoupon, false);
		
		var tastoNearest = document.getElementById('nearest');
		tastoNearest.addEventListener('click', function(){window.location.href = "nearestShop.html";}, false);
    },
	
	addCoupon: function() {
		var db = window.openDatabase("Database", "1.0", "Coupon storage", 200000);
        db.transaction(app.populateDB, app.errorCB, app.successCB);
	},
	
	populateDB:function(tx) {
         tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, imgurl)');
		 
         tx.executeSql('INSERT INTO DEMO (imgurl) VALUES ("img/indexSlide/1.jpg")');
	},

    // Transaction error callback
    //
    errorCB:function(tx, err) {
        alert("Error processing SQL: "+err);
    },

    // Transaction success callback
    //
    successCB:function() {  
		navigator.notification.alert("Coupon Correctly Redeemed", function() {}, "","OK");
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');	
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
		server.mostraInfo($id);
    },
	
	
};

var scanner = {
	success: function(resultArray) {	
				$result="";
				$result=$result+resultArray[0];					 
				window.location.href = "product.html?="+$result;
				
                // NOTE: Scandit SDK Phonegap Plugin Versions 1.* for iOS report
                // the scanning result as a concatenated string.
                // Starting with version 2.0.0, the Scandit SDK Phonegap
                // Plugin for iOS reports the result as an array
                // identical to the way the Scandit SDK plugin for Android reports results.

                // If you are running the Scandit SDK Phonegap Plugin Version 1.* for iOS,
                // use the following approach to generate a result array from the string result returned:
                // resultArray = result.split("|");
            },

            failure:function(error){
                navigator.notification.alert("Failed: " + error, 
                                     function() {},
                                     "Error",
                                     "OK");
				
            },

             scan:function() {
                // See below for all available options. 
               	cordova.exec(scanner.success, scanner.failure, "ScanditSDK", "scan",
                           ["apUI4lbZEeObF0YzVzElo/BeyCxmtFI+ZFg7yrQ/qLM",
                              {"beep": true,
                              "1DScanning" : true,
                              "2DScanning" : true}]);
            }
};

var server = {
	
	test:function() {
		
		window.location.href = "product.html?id="+1;
	},

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
				//document.getElementById("resultImg").innerHTML=xmlhttp.responseText;
				var htmlContent="";
				htmlContent=htmlContent+"<div id='mySwipe' style='max-width:50%; height:300px; margin:0 auto; padding-bottom:10px; padding-top:10px;' class='swipe'><div id='slider' class='swipe-wrap'>";
				var xmlDoc=xmlhttp.responseXML;
				var i=0;
				while(i<xmlDoc.getElementsByTagName('picture').length){
					var picture=xmlDoc.getElementsByTagName('picture')[i].firstChild.nodeValue;
					var name=xmlDoc.getElementsByTagName('name')[i].firstChild.nodeValue;
					htmlContent=htmlContent+"<div><img width='100%' src='"+picture+"'>"+name+"</div>";
					i=i+1;
					
				}
				document.getElementById("content").innerHTML=htmlContent+"</div></div>"
				
				var elem = document.getElementById('mySwipe');
				window.mySwipe = Swipe(elem, {
  				// startSlide: 4,
  				auto: 5000,
  				// continuous: true,
  				// disableScroll: true,
  				// stopPropagation: true,
  				// callback: function(index, element) {},
  				// transitionEnd: function(index, element) {}
				});
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
