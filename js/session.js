var Session = (function() {   
    var loggedIn = false;
    var ref

    function authStateChangeListener(user) {
        console.log("Auth state change: ", user);

        //signin
        if (user) {
            console.log("I am now logged in as ---"+ user.displayName);
            loggedIn = true;         
            document.querySelector("#login-form").style.display = "none";
            document.querySelector("#logOut").style.display = "block";         
           
        } else { //signout
            if (loggedIn) {
                loggedIn = false;
                window.location.reload();
            }
        }
    }

    /*
     * Sign in with a username and password
     * */
    function signInWithEmailandPassword() {
        var email = document.querySelector("#email");
        var password = document.querySelector("#password");
        var valid = Forms.validateForm([email, password]);

        if (valid) {
            firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(function(user) {
                console.log("Signed in with user: ", user);
                Main.onLogin();
                // closeLoginDialog();                     
                $('#login-modal').modal('hide')
                $("#login-container").hide();
                $("#logOut-container").show()
              
            }, function(error) {
                console.log("Sign in error: ", error);
                $("#loginto").attr("data-original-title","Incorrect passWord or email");
                $("#loginto").tooltip("show");
                setTimeout(removeTooltip, 5000,"#loginto");
                 setTimeout(deleteTooltip, 4000,"#loginto");
            })
        } else {
            console.log("please put the correct pass or email")
            
            $("#loginto").attr("data-original-title","please put the correct passWord or email");
            $("#loginto").tooltip("show");
            setTimeout(removeTooltip, 5000,"#loginto");
             setTimeout(deleteTooltip, 4000,"#loginto");
            var data = {message: "All fields required"};
            
        }
    }
    //hide the login modal when a user click a creat account btn
    function creatAccount(){
        $('#login-modal').modal('hide')
      
    } 
    function removeTooltip(id) {
        $(id).tooltip("hide");
        
      }
      function deleteTooltip(id){
        $(id).removeAttr("data-original-title");
      
    }
    function submitCreateAccount() {
        //fields
        var displayName = document.querySelector("#entry-displayname");
        var email = document.querySelector("#entry-email");
        var password = document.querySelector("#entry-password");
        var valid = Forms.validateForm([displayName, email, password]);

        if (valid) {
            firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(function(user) {
                console.log('Create user and sign in Success', user);              
                user.updateProfile({displayName: displayName.value});
                
        
//____________________________data base profile_______________________
                var user = {              
                    uid: user.uid,
                    displayName: displayName.value,
                    favorit:["liii"]                  
              };           
      var key = ref.push(user.uid);//every user has a unique key
       key.set(user, function(error) {
           if (error) {
               console.log("Uh oh, error creating profile.", error);               
           }
           else
           console.log("data base created")
        })
 //..............................................................
                    $("#favoritArtist").removeAttr("disabled");
                    $(".greating-container").show(); 
                    $('#creat-account-modal').modal('hide')
                    $("#login-container").hide();
                    $("#logOut-container").show()
                    $("#userName").html("Hi"+" "+ displayName.value.toUpperCase() +" "+"Welcome")
                    

            }, function(error) {
                console.error('Create user and sign in Error', error);
                
            });
        } else {
            $("#creatAcc").attr("data-original-title","All Fields required");
            $("#creatAcc").tooltip("show");
             setTimeout(removeTooltip, 5000,"#creatAcc");
             setTimeout(deleteTooltip, 4000,"#creatAcc");
            var data = {message: "All fields required"};
            
        }
    }
 
    return {
        
        init: function() {
                    firebase.auth().onAuthStateChanged(authStateChangeListener);          
                    $(document).on("click","#logOut",function(){
                       firebase.auth().signOut().then(function() {
                          console.log('Signed Out');
                        }, function(error) {
                          console.error('Sign Out Error', error);
                        });
                     });
            ref = firebase.database().ref("/users");
            $(document).on("click","#sign-in",signInWithEmailandPassword)         
            $(document).on("click","#entry-submit",submitCreateAccount)
            $(document).on("click","#create-account", creatAccount) 
            
            // $(document).on("click","#entry-update",submitUpdateProfile)
        },
       }
 })();