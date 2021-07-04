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

var showAll = document.getElementById("showAll");
var showImportant = document.getElementById("showImportant");
var showInprogress = document.getElementById("showInprogress");
var showComplete = document.getElementById("showComplete");

var showState = "showImportant";
var firebaseRef = firebase.database().ref();

//****Listen for auth status changes****
firebase.auth().onAuthStateChanged(function (user) {
  console.log(user.uid);
  if (user) {
    // User is signed in.
    console.log("user signed in");
    user = firebase.auth().currentUser;
    let uid;
    if (user != null) {
      uid = user.uid;
    }
  } else {
    console.log("not signed in");
    logOut();
    // No user is signed in.
  }
});

function getUserData(uid) {
  firebase
    .database()
    .ref("users/" + uid)
    .once("value", (snap) => {
      const data = snap.val();
      console.log(data);
    });
}

function add_task() {
  new_task = document.getElementById("new-task");
  //console.log(new_task.value.length);

  if (new_task.value.length != 0) {
    add_task_to_database();
    //create_unfinished_task();
  }
}

function add_task_to_database() {
  // our boxes have data and we take database
  firebase.auth().onAuthStateChanged(function (user) {
    console.log(user.uid);
    if (user) {
      user = firebase.auth().currentUser;
      var key = firebase.database().ref("users/").child(user.uid).push().key;
      var task = {
        title: new_task.value,
        key: key,
      };
      var updates = {};
      updates["users/" + user.uid + "/unfinished_task/" + key] = task;
      firebaseRef.update(updates);
    }
  });
}

/****** For Sign Out ******/
function logOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
      setTimeout(function () {
        window.location.replace("signin.html");
      }, 1000);

      //console.log("user logged out");
    })
    .catch((error) => {
      //An error happened.
      var errorMessage = error.message;
      window.alert(errorMessage);
    });
}
