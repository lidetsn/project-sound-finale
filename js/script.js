// to control the login and the main task
firebase.initializeApp(Config.firebase);

// Application starts
window.onload = function() {   
    Session.init();//login
    Main.init();
  myMap.initialize()
    
};
