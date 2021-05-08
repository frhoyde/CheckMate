var firebaseConfig = {
    apiKey: "AIzaSyBzFIsDwS53ueZZ9X79V06CvATUbde5XyI",
    authDomain: "checkmate-b5734.firebaseapp.com",
    projectId: "checkmate-b5734",
    storageBucket: "checkmate-b5734.appspot.com",
    messagingSenderId: "778401257741",
    appId: "1:778401257741:web:4bbd814828867fc012f844",
    measurementId: "G-HQ64910E4B"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  firebase.auth.Auth.Persistence.LOCAL;

  $("#btn login").click(function(){
    var email = $ ("#email").val();
    var password = $ ("#password").val();

    if(email!="" && password!= ""){
        var result = firebase.auth().signInWithEmailAndPassword();
    
        result.catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
    
            console.log(error.code);
            window.alert("Message: "+ errorMessage);
        });
    }
    else {
        window.alert("Please fill out all fields");
    }
  });