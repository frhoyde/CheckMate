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


  var pinp = 0;
  var fin = [];
  var unfin = [];

  function countAllTask(){
    var all;
    var taskArray = [];
    show_count_all_task =
    document.getElementById("show_all");
    show_count_all_task.innerHTML = "";
    firebase.auth().onAuthStateChanged(function (user) {
        var firebaseRef = firebase
          .database()
          .ref("users/" + user.uid + "/unfinished_task/"); // need for all task
        if (user) {
          user = firebase.auth().currentUser;
          // Retrieve new tasks as they are added to our database
          firebaseRef.once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              var childkey = childSnapshot.key;
              var date_given = new Date(childSnapshot.val().date);
    
              taskArray.push(childSnapshot.val());
            });
            all = taskArray.length;
            
            console.log(all);
            show_all = document.createElement("div");
          show_all.setAttribute("class", "card-text");
          show_all.innerHTML = all;
            show_count_all_task.append(show_all);
            countfinishedTask();
        });

        }
    });

}

  
  function countfinishedTask(){
    var all;
    var taskArray = [];
    
    show_count_finished_task =
    document.getElementById("show_fin");
    console.log(show_count_finished_task);
    show_count_finished_task.innerHTML = "";
    firebase.auth().onAuthStateChanged(function (user) {
        var firebaseRef = firebase
          .database()
          .ref("users/" + user.uid + "/finished_task/"); // need for all task
        if (user) {
          user = firebase.auth().currentUser;
          // Retrieve new tasks as they are added to our database
          firebaseRef.once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              var childkey = childSnapshot.key;
              var date_given = new Date(childSnapshot.val().date);
    
              taskArray.push(childSnapshot.val());
            });
           
            all = taskArray.length;
            fin.push(all);
            console.log(fin);
            show_finished = document.createElement("div");
          show_finished.setAttribute("class", "card-text");
          show_finished.innerHTML = all;
            show_count_finished_task.append(show_finished);

            countunfinishedTask();
           // fin[0] = all;

        });
       
        }
        console.log(fin[0]);
    });
    console.log(fin);

  }
  console.log(fin.values);

  function countunfinishedTask(){
    var all;
    var taskArray = [];
    show_count_unfinished_task =
    document.getElementById("show_unfin");
    show_count_unfinished_task.innerHTML = "";
    firebase.auth().onAuthStateChanged(function (user) {
        var firebaseRef = firebase
          .database()
          .ref("users/" + user.uid + "/unfinished_task/"); // need for all task
        if (user) {
          user = firebase.auth().currentUser;
          // Retrieve new tasks as they are added to our database
          firebaseRef.once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              var childkey = childSnapshot.key;
              var date_given = new Date(childSnapshot.val().date);
    
              taskArray.push(childSnapshot.val());
            });
            all = taskArray.length;
            fin.push(all);
            console.log(all);
            show_unfinished = document.createElement("div");
          show_unfinished.setAttribute("class", "card-text");
          show_unfinished.innerHTML = all;
            show_count_unfinished_task.append(show_unfinished);
            countTrashTask();
            
        });

        }
    });

  }

  function countTrashTask(){
    var all;
    var taskArray = [];
    show_count_trash_task =
    document.getElementById("show_trash");
    show_count_trash_task.innerHTML = "";
    firebase.auth().onAuthStateChanged(function (user) {
        var firebaseRef = firebase
          .database()
          .ref("users/" + user.uid + "/Trash/"); // need for all task
        if (user) {
          user = firebase.auth().currentUser;
          // Retrieve new tasks as they are added to our database
          firebaseRef.once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              var childkey = childSnapshot.key;
              var date_given = new Date(childSnapshot.val().date);
    
              taskArray.push(childSnapshot.val());
            });
            all = taskArray.length;
            console.log(all);
            show_trash = document.createElement("div");
          show_trash.setAttribute("class", "card-text");
          show_trash.innerHTML = all;
            show_count_trash_task.append(show_trash);
            showDonut();
        });

        }
    });

  }



   console.log(fin);

unfin.push(0);

console.log(fin);

  function showDonut(){
    $(document).ready(function() {
        //console.log(fin, n);
        var ctx = $("#chart-line");
        var myLineChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ["In-Progress", "Completed", "Unfinished"],
                datasets: [{
                    data: $.merge(unfin, fin),
                    backgroundColor: ["rgba(100, 255, 0, 0.5)","#4099ff", "#FFB64D"]
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Tasks'
                }
            }
        });
    });
  }