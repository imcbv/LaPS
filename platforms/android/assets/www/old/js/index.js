/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
		
		var scanBtn = document.getElementById('scanBtn');
		scanBtn.addEventListener('click', function(){document.getElementById("centerDiv").innerHTML="<div class='rowDiv'><div class='content'><img id='scanBtn' src='img/loading.gif'><br></div></div>";
               							  		     scanner.scan();
													 }, false);
		
		var tasto2 = document.getElementById('tasto2');
		tasto2.addEventListener('click', function(){
													app.test();
													}, false);
		
		var clear = document.getElementById('clear');
		clear.addEventListener('click', function(){var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        											db.transaction(app.cleardb, app.errorCB, 
													function(){var db = window.openDatabase("Database", "1.0", "Coupon storage", 200000);
        													   db.transaction(app.getCoupons, app.errorCB, app.successCB);
														       });
													}, false);
		
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
	
	test:function() {
		
		
		document.getElementById("centerDiv").innerHTML="<div class='rowDiv'><div class='content'><img id='scanBtn' src='img/loading.gif'><br></div></div>";
		window.location.href = "productFar.html?id="+1;
	},
	
	getCoupons:function(tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, imgurl)');
		tx.executeSql('SELECT * FROM DEMO',[], app.querySuccess, app.errorCB);
		
	},
	
	populateDB:function(tx) {
		 tx.executeSql('SELECT * FROM DEMO',[], app.querySuccess, app.errorCB);
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
			htmlContent=htmlContent+"<div id='mySwipe' style='max-width:50%; margin:0 auto; padding-bottom:10px; padding-top:10px;' class='swipe'><div id='slider' class='swipe-wrap'>";
        	for (var i=0; i<len; i++){
            	coupons[i] = results.rows.item(i).imgurl;
				htmlContent=htmlContent+"<div><img width='100%' src='"+coupons[i]+"'></div>";
			}
		}
		document.getElementById("content").innerHTML=htmlContent+"</div></div>";
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
	},
	
	cleardb:function(tx){
		tx.executeSql('DROP TABLE IF EXISTS DEMO');
		alert('db cleared');
	}
	
	
};

var scanner = {
	success: function(resultArray) {	
				$result="";
				$result=$result+resultArray[0];					 
				window.location.href = $result;
				
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