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

  var todaysTaskArray = [];
  var upcomingTaskArray = [];
  var taskArrayTitle = [];


firebase.auth().onAuthStateChanged(function (user) {
  var firebaseRef = firebase.database().ref("users/" + user.uid + "/unfinished_task/").orderByChild("time"); // need for all task
  if (user) {
    user = firebase.auth().currentUser;
    // Retrieve new tasks as they are added to our database
    firebaseRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var childkey = childSnapshot.key;

        var date_given = new Date(childSnapshot.val().date);
        taskArrayTitle.push(childSnapshot.val().title);
      /*** Checking if task is for today or not ***/
      if (
        today.getDate() == date_given.getDate() &&
        today.getMonth() == date_given.getMonth() &&
        today.getFullYear() == date_given.getFullYear()
      )
        todaysTaskArray.push(childSnapshot.val());
        

        

      });

  });

  

  }

});

firebase.auth().onAuthStateChanged(function (user) {
var firebaseRef = firebase.database().ref("users/" + user.uid + "/unfinished_task/").orderByChild("date"); // need for all task
if (user) {
  user = firebase.auth().currentUser;
  // Retrieve new tasks as they are added to our database
  firebaseRef.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      var childkey = childSnapshot.key;

      var date_given = new Date(childSnapshot.val().date);
      taskArrayTitle.push(childSnapshot.val().title);
    /*** Checking if task is for today or not ***/
    if (
      today.getDate() != date_given.getDate() &&
      today.getMonth() == date_given.getMonth() &&
      today.getFullYear() == date_given.getFullYear()
    )
      upcomingTaskArray.push(childSnapshot.val());

      

    });

});



}

});


console.log(todaysTaskArray);

