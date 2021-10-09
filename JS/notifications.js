

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
  var today = new Date();
  var notificationTimes = [];
  var notificationTxt;
  // Notification.permission = "granted";







if(Notification.permission !== "denied"){
  Notification.requestPermission().then( permission => {
    console.log(permission);
  });
}


