// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyBzFIsDwS53ueZZ9X79V06CvATUbde5XyI",
  authDomain: "checkmate-b5734.firebaseapp.com",
  projectId: "checkmate-b5734",
  storageBucket: "checkmate-b5734.appspot.com",
  messagingSenderId: "778401257741",
  appId: "1:778401257741:web:4bbd814828867fc012f844",
  measurementId: "G-HQ64910E4B",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/******hide and show tablinks */
$(document).ready(function () {
  $("#myTab a").click(function (e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

// firebaseRef.once("value").then(function (snapshot) {
//   console.log(snapshot.val());
//   //display on pre tag
//   //preObject.innerHTML = snapshot.val();
// });

firebase.auth().onAuthStateChanged(function (user) {
  console.log(user.uid);
  var firebaseRef = firebase.database().ref("users/" + user.uid);
  if (user) {
    user = firebase.auth().currentUser;
    firebaseRef.once("value", (snapshot) => {
      const userData = snapshot.val();
      console.log(userData);
      console.log(userData.userSurname);
      document.getElementById("fullname-div").innerHTML =
        userData.userFullName + " " + userData.userSurname;
      //document.getElementById("fullname").style.display = "none";

      document.getElementById("bio").innerHTML = userData.userBio;
      document.getElementById("fb-url").innerHTML = userData.userFb;
      document.getElementById("tw-url").innerHTML = userData.userTw;

      document.getElementById("username-div").innerHTML = userData.userFullName;

      // key + value from your firbase database
      //display on pre tag
      //preObject.innerHTML = snapshot.val();
    });
  }
});
