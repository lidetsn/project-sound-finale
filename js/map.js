var myMap= (function() {
 
//var map;

return{
initialize:function(latitude = 47.6062, longitude = -122.3321) {
   
    console.log("hi from map")
    console.log("here is the latitude"+latitude)
    var var_map=document.getElementById('map-container-9') 
    // Map Options
    var mapOptions = {
      zoom: 15,
      center: {lat: latitude, lng: longitude}
    }

    //New map
    var map= new google.maps.Map(var_map, mapOptions);
      
    //New Marker
     var marker = new google.maps.Marker({
      position: {lat: latitude, lng: longitude},
      map: map
      
    });
   
}
}
})
();
