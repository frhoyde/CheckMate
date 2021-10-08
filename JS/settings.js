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

/******hide and show tablinks and for jQuery add link to html body*/
$(document).ready(function () {
  $("#myTab a").click(function (e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

var resetBtn = document.getElementById("reset_btn");
resetBtn.addEventListener("click", show_user_info, false);

function show_user_info() {
  firebase.auth().onAuthStateChanged(function (user) {
    console.log(user.uid);
    var firebaseRef = firebase.database().ref("users/" + user.uid);
    if (user) {
      user = firebase.auth().currentUser;
      firebaseRef.once("value", (snapshot) => {
        const userData = snapshot.val();
        //console.log(userData);
        document.getElementById("fullname-div").innerHTML =
          userData.userFullName + " " + userData.userSurname;
        //document.getElementById("fullname").style.display = "none";

        document.getElementById("bio").innerHTML = userData.userBio;
        document
          .getElementById("fb-url")
          .setAttribute("value", userData.userFb);
        document
          .getElementById("tw-url")
          .setAttribute("value", userData.userTw);
        document
          .getElementById("location")
          .setAttribute("value", userData.userLocation);

        document.getElementById("username-div").innerHTML =
          userData.userFullName;

        var updateBtn = document.getElementById("update_btn");
        updateBtn.addEventListener("click", get_Edited_data, false);
      });
    }
  });
}

function get_Edited_data() {
  edit_name = document.getElementById("fullname-div").value;
  edit_bio = document.getElementById("bio").value;
  edit_fb = document.getElementById("fb-url").value;
  edit_tw = document.getElementById("tw-url").value;
  edit_location = document.getElementById("location").value;

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var firebaseRef = firebase.database().ref("users/");

      var userData = {
        userUid: user.uid,
        // userFullName: edit_name,
        // userEmail: user.userEmail,
        // userPassword: userPassword,
        userFb: edit_fb,
        userTw: edit_tw,
        userBio: edit_bio,
        userLocation: edit_location,
      };

      firebaseRef.child(user.uid).update(userData);

      show_user_info();
      location.reload();
    }
  });
}

var deleteAccBtn = document.getElementById("delete_account_btn");
deleteAccBtn.addEventListener("click", delete_account, false);

function delete_account() {
  const user = firebase.auth().currentUser;

  console.log(user);
  firebase
    .database()
    .ref("users/" + user.uid)
    .remove();

  user
    .delete()
    .then(() => {
      console.log("The User Is Deleted From Our Server");
      //window.location.replace("/indext.html");
      // User deleted.
    })
    .catch((error) => {
      console.log("The Error: " + error);
      // An error ocurred
      // ...
    });
}

show_user_info();
