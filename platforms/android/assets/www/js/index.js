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
		
		//abilitare questa funzione solo per test da computer
		//app.receivedEvent('deviceready');
		
		
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
		if(typeof nfc != 'undefined'){
		nfc.addMimeTypeListener(
                'text/pg',
                app.onNfc);
		}
													
		
    },
	
	onNfc:function(nfcEvent) {
    	var tag = nfcEvent.tag,
    	ndefMessage = tag.ndefMessage;
    	var url = nfc.bytesToString(ndefMessage[0].payload).substring(3);
		if(url.indexOf("product") == -1 && url.indexOf("discovery") == -1){
			alert("Tag not recognized");
		}
		
		else{
			window.location.href = url;
		}
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
	
	
	
	
};	 
	