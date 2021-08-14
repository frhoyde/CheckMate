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
var u_sun = 0, u_mon= 0, u_tue= 0,u_wed= 0,u_thu= 0,u_fri= 0,u_sat= 0;
var f_sun= 0, f_mon= 0, f_tue= 0,f_wed= 0,f_thu= 0,f_fri= 0,f_sat= 0; 
var u_chart =[];
var f_chart =[];
var t_fin = 0, t_unfin = 0, up_fin =0, up_unfin =0;

function countAllTask() {
  var all;
  var taskArray = [];
  show_count_all_task = document.getElementById("show_all");
  show_count_all_task.innerHTML = "";
  firebase.auth().onAuthStateChanged(function (user) {
    var firebaseRef = firebase
      .database()
      .ref("users/" + user.uid + "/all_task/"); // need for all task
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
        //show_all.setAttribute("class", "card-text");
        show_all.innerHTML = all;
        show_count_all_task.append(show_all);

        countfinishedTask();
      });
    }
  });
}

function countfinishedTask() {
  var all;
  var taskArray = [];

  show_count_finished_task = document.getElementById("show_fin");
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
        var d = null;
        for (var i, i = 0; i < taskArray.length; i++) {
          task_date = taskArray[i].date;
          task_time = taskArray[i].time;
          console.log(task_date);
          var date_given_month = new Date(task_date);
          task_day = date_given_month.getDay();
          console.log(date_given_month.getDay());
          if(task_date!=d){
            if(task_day == 0) u_sun++;
            else if(task_day == 1) u_mon++;
            else if(task_day == 2) u_tue++;
            else if(task_day == 3) u_wed++;
            else if(task_day == 4) u_thu++;
            else if(task_day == 5) u_fri++;
            else if(task_day == 6) u_sat++;
          }

         console.log(date_given_month.getFullYear());
         var task_month = date_given_month.getMonth()+1;
         var task_year = date_given_month.getFullYear();
         var task_date_d = date_given_month.getDate();
          if(task_year==year && task_month==month && task_date_d==date_d) t_fin++;
          else if(task_year>=year || (task_year==year && task_month>month) ||( task_year==year && task_month==month && task_date_d>date_d) )up_fin++;
          d = task_date;
          
        }
        u_chart = [u_sun, u_mon, u_tue, u_wed, u_thu,u_fri, u_sat ];
        console.log(up_fin, t_fin);

        show_finished = document.createElement("div");
        //show_finished.setAttribute("class", "card-text");
        show_finished.innerHTML = all;
        show_count_finished_task.append(show_finished);

        countunfinishedTask();
        
      });
    }
    
  });
  
}

var today = new Date();
var year = today.getFullYear();
var month = (today.getMonth()+1);
var date_d = today.getDate();
var date = year+'-'+month+'-'+date_d;
console.log(date);



function countunfinishedTask() {
  var all;
  var taskArray = [];
  show_count_unfinished_task = document.getElementById("show_unfin");
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
        var d = null;
        for (var i, i = 0; i < taskArray.length; i++) {
          task_date = taskArray[i].date;
          task_time = taskArray[i].time;
          console.log(task_date);
          var date_given_month = new Date(task_date);
          task_day = date_given_month.getDay();
          console.log(date_given_month.getDay());
          if(task_date!=d){
            if(task_day == 0) f_sun++;
            else if(task_day == 1) f_mon++;
            else if(task_day == 2) f_tue++;
            else if(task_day == 3) f_wed++;
            else if(task_day == 4) f_thu++;
            else if(task_day == 5) f_fri++;
            else if(task_day == 6) f_sat++;
          }
          var task_month = date_given_month.getMonth()+1;
         var task_year = date_given_month.getFullYear();
         var task_date_d = date_given_month.getDate();
          if(task_year==year && task_month==month && task_date_d==date_d) t_unfin++;
          else if(task_year>=year || (task_year==year && task_month>month) ||( task_year==year && task_month==month && task_date_d>date_d) ) up_unfin++;
          d = task_date;
        }
        f_chart = [f_sun, f_mon, f_tue, f_wed, f_thu, f_fri, f_sat ];
        console.log(t_unfin, up_unfin);
        show_unfinished = document.createElement("div");
        //show_unfinished.setAttribute("class", "card-text");
        show_unfinished.innerHTML = all;
        show_count_unfinished_task.append(show_unfinished);
        countTrashTask();
      });
    }
  });
}

function countTrashTask() {
  var all;
  var taskArray = [];
  show_count_trash_task = document.getElementById("show_trash");
  show_count_trash_task.innerHTML = "";
  firebase.auth().onAuthStateChanged(function (user) {
    var firebaseRef = firebase.database().ref("users/" + user.uid + "/Trash/"); // need for all task
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
        //show_trash.setAttribute("class", "card-text");
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

function showDonut() {
  $(document).ready(function () {
    //console.log(fin, n);
    var ctx = $("#chart-line");
    var myLineChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["In-Progress", "Completed", "Unfinished"],
        datasets: [
          {
            data: $.merge(unfin, fin),
            backgroundColor: ["rgba(100, 255, 0, 0.5)", "#4099ff", "#FFB64D"],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "Tasks",
        },
      },
    });
  });
  showChart();
}

function showChart() {
  var ctx = document.getElementById("myChart").getContext("2d");

  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      datasets: [
        {
          label: "Finished", // Name the series
          data: f_chart, // Specify the data values array
          fill: false,
          borderColor: "#2196f3", // Add custom color border (Line)
          backgroundColor: "#2196f3", // Add custom color background (Points and Fill)
          borderWidth: 1, // Specify bar border width
        },
        {
          label: "Uninished", // Name the series
          data: u_chart, // Specify the data values array
          fill: false,
          borderColor: "#4CAF50", // Add custom color border (Line)
          backgroundColor: "#4CAF50", // Add custom color background (Points and Fill)
          borderWidth: 1, // Specify bar border width
        },
      ],
    },
    options: {
      responsive: true, // Instruct chart js to respond nicely.
      maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
    },
  });
  showHighlights();
}


function showHighlights(){
  showcompText = document.getElementById("comText");
  showcompText.innerHTML = "";
  showcompText.append(up_fin);

  showtcompText = document.getElementById("tcomText");
  showtcompText.innerHTML = "";
  showtcompText.append(t_fin);

  showtunText = document.getElementById("tunText");
  showtunText.innerHTML = "";
  showtunText.append(t_unfin);

  showunText = document.getElementById("unText");
  showunText.innerHTML = "";
  showunText.append(up_unfin);
  var t_all = t_fin+t_unfin;
  console.log(t_all);
  var up_all = up_fin+up_unfin;
  var twidth = (t_fin*100)/t_all;
  var upwidth = (up_fin*100)/up_all;
  console.log(twidth, upwidth);
  $(document).ready(function(){
    $("#tprogress").width(twidth);
  });
  $(document).ready(function(){
    $("#upprogress").width(upwidth);
  });
}
