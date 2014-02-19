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
		
		var tastoShare = document.getElementById('share');
		tastoShare.addEventListener('click', function(){window.plugins.socialsharing.share('Message and subject', 'The subject');}, false);
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
		var url="http://172.20.10.3/php/product.php";
		url=url+"?q="+str;
		
		xmlhttp.open("GET",url,false);
		xmlhttp.send();
		server.stateChanged();
		
		
	},

	stateChanged:function() {
		
			
		if (xmlhttp.readyState==4) {
			document.getElementById("resultImg").innerHTML=xmlhttp.responseText;
			//document.getElementById("resultImg").innerHTML=xmlhttp.responseXML;
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
