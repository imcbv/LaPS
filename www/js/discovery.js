var posterid;

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
		
		var tastoBack = document.getElementById('back');
		tastoBack.addEventListener('click', function(){window.location.href = "index.html";}, false);
		app.receivedEvent('deviceready');	
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
		
	$i=0;
		while(window.location.href.charAt($i) && window.location.href.charAt($i)!='='){
			$i=$i+1;
		}
		$id="";
		while(window.location.href.charAt($i)){
			$id=$id+window.location.href.charAt($i+1);
			$i=$i+1;
		}
		
		posterid=$id;
		document.getElementById('continue').href="productFar.html?id="+posterid;
		document.getElementById('carousel').innerHTML="<div style='text-align:center'><img src='http://laps.altervista.org/img/discovery/"+posterid+".jpg'></div>";
        console.log("cazzofiga"+posterids)
    },
	
}

