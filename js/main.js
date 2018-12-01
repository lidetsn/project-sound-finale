//
var Main = (function() {

    var venueLatitude;
    var venueLongitude;
    var clickCounter=0;
    var name;
    var seeOnYouTubeBtn
    var ref

    var initialArtists = ["Zeds Dead", "Said The Sky", "Louis The Child","Minus the Bear", "Big Wild",
                             "Gucci Mane", "Delta Heavy", "Pushloop", 
                             "The White Panda", "Benzi", "The Widdler", "Keys N Krates", "Jack Beats", 
                            "RJD2", "Slimez", "San Holo", "Ookay", "Thievery Corporation", 
                            "Porter Robinson", "Seven Lions", "Diplo", "Borgore"];
     // var initialArtist = initialArtists[Math.floor(Math.random() * initialArtists.length)];
    $(document).on("click","#search-Artist ", getArtistName)           
    var seeUpComingEvents=$("<button>").addClass("upComingEvent mt-2 mb-3 mr-2 btn  btn-primary").text("click to see other Events")
    var addToFavorit=$("<button>").addClass("favorit mt-2 mb-3 btn  btn-primary").attr("id","favoritArtist").attr("disabled","true").text("Add To Favorite")   
//------------------------------

function getArtistName(){
        name=$("#artistName").val()
        if(name!=""){
        searchBandsInTown(name)
        searchEvent(name)
        $("#artistName").val("");
        $("#location").html("");
        $("#dataDrop1").empty();
      }
}
function  showYouTube(){
         seeOnYouTubeBtn.text("See Events")
         seeOnYouTubeBtn.addClass("seeEvent");
         seeOnYouTubeBtn.removeClass("seeOnYouTube")
         search(name)
         $(document).on("click",".seeEvent",showEvent)
}

function showEvent(){
        searchEvent(name);
        seeOnYouTubeBtn.text("see youtube history")
        seeOnYouTubeBtn.addClass("seeOnYouTube");
        seeOnYouTubeBtn.removeClass("seeEvent")
}
function showNext(){ 
    $("loctions").empty()   
    $("#dataDrop1").empty();
    $("#dataDrop2").empty();       
    clickCounter++
   if(clickCounter<initialArtists.length){
          searchBandsInTown(initialArtists[clickCounter]) 
          searchEvent(initialArtists[clickCounter]);  
          name= initialArtists[clickCounter];         
   }
   else{
       clickCounter=0;
       searchBandsInTown(initialArtists[clickCounter]) 
       searchEvent(initialArtists[clickCounter]);
       name= initialArtists[clickCounter];  
   }
}
function removeTooltip(id) {
    $(id).tooltip("hide");
    
  }
  function deleteTooltip(id){
    $(id).removeAttr("data-original-title");
  
}
// ---------database
function AddToFavoritDataBase(){
     var favArry=[]
    var user=  firebase.auth().currentUser; 
    var query = firebase.database().ref("users").orderByKey();

    query.once("value")
             .then(function(snapshot) {
             snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
                   var key = childSnapshot.key;
      // childData will be the actual contents of the child
                    var childData = childSnapshot.val();
                    if(childData.uid===user.uid){
                        var userref=ref.child(key);
       // userfav=userref.child("favorit")
                            favArry= childData.favorit
                            console.log(favArry)
                                 if(favArry!=null ){
                                     if(!favArry.includes(name)){
                                     
                                 favArry.push(name);
                                     }
                                     else{
                                        $("#favoritArtist").attr("data-original-title","this artist already found in your favorite");
                                        $("#favoritArtist").tooltip("show");
                                         setTimeout(removeTooltip, 6000,"#favoritArtist");
                                         setTimeout(deleteTooltip, 7000,"#favoritArtist");

                                     }
                                   }
                                 else
                              favArry=name;
                           userref.update({
                                favorit:favArry
                            })    
                    }
               });
           });
           $("#favoritArtist").attr("data-original-title","Added to Favorite");
           $("#favoritArtist").tooltip("show");
            setTimeout(removeTooltip, 6000,"#favoritArtist");
            setTimeout(deleteTooltip, 7000,"#favoritArtist");
}
function retriveMyFavoritArtist(){

    var favdiv=$("<div>")
    favdiv.addClass("text-muted")
    $("#dataDrop1").empty();
    $("#locations").empty();
    console.log("from favorite")
        var favArry=[]
       var user=  firebase.auth().currentUser; 
       var query = firebase.database().ref("users").orderByKey();
   
       query.once("value")
                .then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
         // key will be "ada" the first time and "alan" the second time
                      var key = childSnapshot.key;
         // childData will be the actual contents of the child
                       var childData = childSnapshot.val();
                       if(childData.uid===user.uid){
                           var userref=ref.child(key);
          // userfav=userref.child("favorit")
                               favArry= childData.favorit
                               favArry.shift()
                               favArry.sort()
                 favdiv.append("<h4>Favorite Arists</h4><br>")
                 for(var i=0;i<favArry.length;i++){                      
                    
                    searchFavoriteBandsInTown(favArry[i])

                 }
                 $("#dataDrop1").prepend(favdiv)
                // $("#dataDrop1").append(favdiv)
                                    if(favArry==null){
                                    console.log("you have no favorite artist yet")
                                      }
                                    else{
                                        console.log(favArry)
                                    }
                                
                                }
              });
             
   });
   $(document).on("click",".favBtn",function() { 
    name = $(this).attr('value')
   
   console.log("hi there from favorite ")
   searchEvent(name)
   
 })



}
function searchFavoriteBandsInTown(artist) {

    // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=projectSound";
    
    $.ajax({
        url: queryURL,
        method: "GET"

    }).then(function (response) {

        var favBtn = $("<button>").text(artist);
        favBtn.addClass("favBtn btn btn-outline-primary my-2");
        favBtn.attr("value",artist )
       $("#dataDrop1").append(favBtn).append("<br>")
   
           var artistImage = $("<img>").attr("src", response.thumb_url);
        var upcomingEvents = $("<p>").addClass("text-muted").text(response.upcoming_event_count + " upcoming events");
        $("#dataDrop1").append(upcomingEvents,artistImage);
    })
}

function searchBandsInTown(artist) {

    // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=projectSound";
    
    $.ajax({
        url: queryURL,
        method: "GET"

    }).then(function (response) {

      console.log("response from Bands in town");
      console.log(response);
            
         
             artistName = $("<h3>").text(response.name);
           var artistURL = $("<a>").attr("href", response.url).append(artistName).attr("target", "_blank");
           var artistImage = $("<img>").attr("src", response.thumb_url);
           var trackerCount = $("<p>").addClass("text-muted").text(response.tracker_count + " fans tracking");
           var upcomingEvents = $("<p>").addClass("text-muted").text(response.upcoming_event_count + " upcoming events");
           var goToArtist = $("<a>").attr("href", response.url).attr("target", "_blank");
            // goToArtist.append(`<i class="far fa-calendar-alt"></i>`);
           var facebookPage = $("<a>").attr("href", response.facebook_page_url).attr("target", "_blank");
           //facebookPage.append(`<i class="fa fa-facebook-official" style="font-size:100px"></i>`);
           var facebookText = $("<h4>").text(" Facebook Page ");
           var goToArtist = $("<a>").attr("href", response.url);
           seeOnYouTubeBtn=$("<button>").addClass("seeOnYouTube mr-2 mb-5 btn btn-outline-primary").attr("id", artist).text("see youtube history")
          
           // Empty the contents of the artist-div, append the new artist content
           //$("#dataDrop1").empty();
          // $("#dataDrop2").empty();
           $("#dataDrop1").append(seeUpComingEvents,addToFavorit,artistURL,upcomingEvents,artistImage,trackerCount,seeOnYouTubeBtn);
          // $("#dataDrop2").append(facebookPage);
           if(response.facebook_page_url !== "")
           {
            $("#dataDrop2").append(facebookPage);
           }
           $("#dataDrop2").append(goToArtist);         
        })      
        }

       
        function searchEvent(artist) {

            var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=projectSound"
        
        $.ajax({
            url: queryURL,
            method: "GET"
        
        }).done(function(response) {
            contentVisible = true;
            //showOrHide();
            console.log("result from search event");
            console.log(response)
        
            var eventInfo;
        //     var venueName;
            var eventDate;
        //     var venueCity;
        //     var venueCountry;
            var mapLink;
            var eventDateFormat;
            
            $("#locations").empty();

                for (var index = 0; index < response.length; index++) {
                
                venueName = response[index].venue.name;
                eventDate = response[index].datetime;
                venueCity = response[index].venue.city;
                venueCountry = response[index].venue.country;
                venueLatitude = parseFloat(response[index].venue.latitude);
                venueLongitude = parseFloat(response[index].venue.longitude);
                eventDateFormat = moment(eventDate).format("MMMM DD YYYY HH:mm");
          
                eventInfo = (`<p><i>${venueCountry} ${venueCity} ${venueName} ${eventDateFormat}</i></p>`);
                 
                //appending events   
                $("#locations").append(eventInfo);
        
                // creating map buttons  
                var mapBtn = $("<button>").text("See it on map");
                mapBtn.addClass("map-btn btn btn-outline-primary");
                 mapBtn.attr("data-toggle","modal")
                 mapBtn.attr("data-target","#modalRegular")
                mapBtn.attr('data-lat', venueLatitude);
                mapBtn.attr('data-long', venueLongitude);
                $("#locations").append(mapBtn);
                      
                }; // loop closing

                $(document).on("click",".map-btn",function() { 
                     const lat = $(this).attr('data-lat')
                    const long = $(this).attr('data-long');
                    console.log("hi there from ")
                    myMap.initialize(+lat, +long);  
                  })


               
                    //function to show a specific map for each button 
                   
                    // what happens if the artist has no upcoming events
                    if (response.length === 0) {
                   // $("#locations").empty();
                    $("#locations").html(`<h5 id="locationsTitle">This band has no upcoming events but you can check out their amazing videos below</h5>`);
                };
        
            })
             
             // function to deal with empty input or if artist does not exist in the Bands in Town database
              .fail(function(){
               contentVisible = false;
           // showOrHide();
            
          //  $("#dataDrop1").empty();
         //     $("#dataDrop2").empty();
           // $("#dataDrop1").html(`<h3 id="failArtist">Artist not found</h3>`);
        //      $("#locations").empty();
              });


           // $(document).on("click",".map-btn", showOnMap) 
        
        
        };
        function search(artist) {
            
            var gapikey = 'AIzaSyCKMpw2nmPnon_gkh4EIXnbiAmrZNw-v4M';
            // clear 
            $("#locations").html(" ");
            // get form input   
            $.ajax({
                method: 'GET',
           url: `https://www.googleapis.com/youtube/v3/search?&part=snippet,id&videoEmbeddable=true&videoDuration=short&safeSearch=strict&q=${artist}&type=video&key=${gapikey}`,
              headers: 'Access-Control-Allow-Origin'
                    //  to see the statistics use the below url
                //  url:'https://www.googleapis.com/youtube/v3/videos?id=JZF1LdoR3So&key='+gapikey +
                //       '&part=snippet,contentDetails,statistics,status'
              }).done(function(response) {
                  console.log("from inside of the search")
                  console.log(response)              
                  $.each(response.items, function(i, item) {                       
                    // Get Output
                  getOutput(item);                  
                    // display results
                   // $('#locations').append(output);
                });
                  })  
            }

function getOutput(item) {

            var videoID = item.id.videoId;
            var title = item.snippet.title;
            var description = item.snippet.description;
            var thumb = item.snippet.thumbnails.default.url;
            var channelTitle = item.snippet.channelTitle;``
            var videoDate = item.snippet.publishedAt;
            
            // Build output string
               var frame=$("<iframe>");
               frame.attr("width","560")
               frame.attr("height","315")
               frame.attr("src","https://www.youtube.com/embed/"+videoID)
               $('#locations').append(frame);         
        }

    // Exposed functions
    return {     
        init: function() {              
                $("#logOut-container").hide();
                $(".greating-container").hide();                           
                $(document).on("click", ".upComingEvent",showNext) 
                $(document).on("click", ".seeOnYouTube", showYouTube)
                $(document).on("click", "#favoritArtist",AddToFavoritDataBase) 
                $(document).on("click","#getMyfavoriteArtis",retriveMyFavoritArtist) 
                $(document).on("click","#home",showNext)

                ref = firebase.database().ref("/users");
                searchBandsInTown(initialArtists[0]);
                searchEvent(initialArtists[0]);
                name=initialArtists[0];
               // search(initialArtist);                              
        },
        onLogin:function(){
                $(".greating-container").show();     
                user=  firebase.auth().currentUser.displayName        
                $("#userName").html("Hi"+" "+ user.toUpperCase() +" "+"Welcome")
                $("#favoritArtist").removeAttr("disabled");
        }               
    };
})
();