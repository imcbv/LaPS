var app = {
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
		
		//abilitare questa funzione solo per test da computer
		app.receivedEvent('deviceready');
        
		document.addEventListener('deviceready', this.onDeviceReady, false);
		
		var tastoBack = document.getElementById('back');
		tastoBack.addEventListener('click', function(){window.history.back();}, false);
		
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');	
		
    },

    receivedEvent: function(id) {	
		navigator.geolocation.getCurrentPosition(app.onSuccess,app.onError,{timeout:10000, enableHighAccuracy:true, maximumAge:90000});
    },
	
	onSuccess: function(position) {
		
		var directionsService = new google.maps.DirectionsService();
     	var directionsDisplay = new google.maps.DirectionsRenderer();
     	var map = new google.maps.Map(document.getElementById('map'), {
       		zoom:7,
       		mapTypeId: google.maps.MapTypeId.ROADMAP
     	});

	 	//document.getElementById("loading").innerHTML = "";
	 
     	directionsDisplay.setMap(map);
	 
	 	var cords = new google.maps.LatLng(position.coords.latitude ,position.coords.longitude);
	 	
     	var request = {
       		origin: cords, 
       		destination: 'Corso Vittorio Emanuele 7, Milano',
       		travelMode: google.maps.DirectionsTravelMode.DRIVING
     	};

     	directionsService.route(request, function(response, status) {
       		if (status == google.maps.DirectionsStatus.OK) {
         	directionsDisplay.setDirections(response);
       		}
     	});
	},
	
	onError: function(error) {
        
		if(error.code != 1){
			navigator.geolocation.getCurrentPosition(app.onSuccess,app.onError,{timeout:10000, enableHighAccuracy:true, maximumAge:90000});
		}
		else{
			alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
		}
    },
	
	
};

