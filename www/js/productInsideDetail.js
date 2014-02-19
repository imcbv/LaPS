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
var posterId;
var picture;

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
		
		
		var tastoBack = document.getElementById('back');
		tastoBack.addEventListener('click', function(){window.history.back();}, false);
		
		var twit = document.getElementById('twitter');
		twit.addEventListener('click',function(){window.plugins.socialsharing.shareViaTwitter('What do you think about this?', null, picture);},false);
		
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
								
    },
	
	
};

var server = {

	mostraInfo:function(str) {
		xmlhttp=server.GetXmlHttpObject();
		if (xmlhttp==null) {
			alert ("Browser does not support HTTP Request");
			return;
		}
		var url="http://laps.altervista.org/php/productInsideDetail.php";
		url=url+"?q="+str;
		
		xmlhttp.open("GET",url,false);
		xmlhttp.send();
		server.stateChanged();
		
		
	},

	stateChanged:function() {
		
			
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) { 
				var htmlContent="";
				var xmlDoc=xmlhttp.responseXML;
					picture=xmlDoc.getElementsByTagName('picture')[0].firstChild.nodeValue;
					var name=xmlDoc.getElementsByTagName('name')[0].firstChild.nodeValue;
					var description=xmlDoc.getElementsByTagName('description')[0].firstChild.nodeValue;
					var price=xmlDoc.getElementsByTagName('price')[0].firstChild.nodeValue;
					var likes=xmlDoc.getElementsByTagName('likes')[0].firstChild.nodeValue;
					htmlContent += "<img src='"+picture+"' style='width: 330px;'><p style='text-align: center'><b>"+name+"</b></p><p>"+description+"<br>Price: "+price+" Euro</p><img src='img/like.png'>"+likes+" Likes";
				
				document.getElementById("carousel").innerHTML=htmlContent;
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
