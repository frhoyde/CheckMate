var pinp = 0;
var fin = [];
var unfin = [];
var u_sun = 0,
  u_mon = 0,
  u_tue = 0,
  u_wed = 0,
  u_thu = 0,
  u_fri = 0,
  u_sat = 0;
var f_sun = 0,
  f_mon = 0,
  f_tue = 0,
  f_wed = 0,
  f_thu = 0,
  f_fri = 0,
  f_sat = 0;
var u_chart = [];
var f_chart = [];
var t_fin = 0,
  t_unfin = 0,
  up_fin = 0,
  up_unfin = 0;

function countAllTask() {
  var all;
  var taskArray = [];
  show_count_all_task = document.getElementById("show_all");
  show_count_all_task.innerHTML = "";
  firebase.auth().onAuthStateChanged(function (user) {
    var firebaseRef = firebase
      .database()
      .ref("users/" + user.uid + "/all_task/");
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

        show_all = document.createElement("div");
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
        var d = null;
        for (var i, i = 0; i < taskArray.length; i++) {
          task_date = taskArray[i].date;
          task_time = taskArray[i].time;

          var date_given_month = new Date(task_date);
          task_day = date_given_month.getDay();

          if (task_date != d) {
            if (task_day == 0) u_sun++;
            else if (task_day == 1) u_mon++;
            else if (task_day == 2) u_tue++;
            else if (task_day == 3) u_wed++;
            else if (task_day == 4) u_thu++;
            else if (task_day == 5) u_fri++;
            else if (task_day == 6) u_sat++;
          }

          var task_month = date_given_month.getMonth() + 1;
          var task_year = date_given_month.getFullYear();
          var task_date_d = date_given_month.getDate();
          if (task_year == year && task_month == month && task_date_d == date_d)
            t_fin++;
          else if (
            task_year >= year ||
            (task_year == year && task_month > month) ||
            (task_year == year && task_month == month && task_date_d > date_d)
          )
            up_fin++;
          d = task_date;
        }
        u_chart = [u_sun, u_mon, u_tue, u_wed, u_thu, u_fri, u_sat];

        show_finished = document.createElement("div");

        show_finished.innerHTML = all;
        show_count_finished_task.append(show_finished);

        countunfinishedTask();
      });
    }
  });
}

var today = new Date();
var year = today.getFullYear();
var month = today.getMonth() + 1;
var date_d = today.getDate();
var date = year + "-" + month + "-" + date_d;

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
          if (taskArray[i].tag_progress == "In-Progress") {
            pinp++;
          }

          console.log(task_date);
          var date_given_month = new Date(task_date);
          task_day = date_given_month.getDay();
          console.log(date_given_month.getDay());
          if (task_date != d) {
            if (task_day == 0) f_sun++;
            else if (task_day == 1) f_mon++;
            else if (task_day == 2) f_tue++;
            else if (task_day == 3) f_wed++;
            else if (task_day == 4) f_thu++;
            else if (task_day == 5) f_fri++;
            else if (task_day == 6) f_sat++;
          }
          var task_month = date_given_month.getMonth() + 1;
          var task_year = date_given_month.getFullYear();
          var task_date_d = date_given_month.getDate();
          if (task_year == year && task_month == month && task_date_d == date_d)
            t_unfin++;
          else if (
            task_year >= year ||
            (task_year == year && task_month > month) ||
            (task_year == year && task_month == month && task_date_d > date_d)
          )
            up_unfin++;
          d = task_date;
        }
        unfin.push(pinp);
        f_chart = [f_sun, f_mon, f_tue, f_wed, f_thu, f_fri, f_sat];
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
        show_trash = document.createElement("div");
        //show_trash.setAttribute("class", "card-text");
        show_trash.innerHTML = all;
        show_count_trash_task.append(show_trash);
        showHighlights();
        showUpcomingHighlights();
        showDonut();  
      });
    }
  });
}

var color1;
var color2;
var color3;

if (
  window.localStorage.getItem("theme") === "pitch-dark" ||
  localStorage.getItem("theme") === "midnight"
) {
  color1 = "#ffcf44";
  color2 = "#1EB980";
  color3 = "#ff6859";
}

if (
  window.localStorage.getItem("theme") === "nature" ||
  localStorage.getItem("theme") === "classic"
) {
  color1 = "rgba(100, 255, 0, 0.5)";
  color2 = "#4099ff";
  color3 = "#FFB64D";
}

function showDonut() {
  $(document).ready(function () {
    var ctx = $("#chart-line");
    var myLineChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["In-Progress", "Completed", "Unfinished"],
        datasets: [
          {
            data: $.merge(unfin, fin),
            backgroundColor: [color1, color2, color3],
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
          label: "Finished",
          data: f_chart,
          fill: false,
          borderColor: color2,
          backgroundColor: color2,
          borderWidth: 1,
        },
        {
          label: "Uninished",
          data: u_chart,
          fill: false,
          borderColor: color3,
          backgroundColor: color3,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
  
}

function showHighlights() {
  
  showtcompText = document.getElementById("tcomText");
  showtcompText.innerHTML = "";
  showtcompText.append(t_fin);

  showtunText = document.getElementById("tunText");
  showtunText.innerHTML = "";
  showtunText.append(t_unfin);

  var t_all = t_fin + t_unfin;
  var up_all = up_fin + up_unfin;
  var twidth = (t_fin * 100) / t_all;
  var upwidth = (up_fin * 100) / up_all;
  $(document).ready(function () {
    $("#tprogress").width(twidth);
  });
}

function showUpcomingHighlights() {
  showcompText = document.getElementById("comText");
  showcompText.innerHTML = "";
  showcompText.append(up_fin);

  showunText = document.getElementById("unText");
  showunText.innerHTML = "";
  showunText.append(up_unfin);
  var up_all = up_fin + up_unfin;
  var upwidth = (up_fin * 100) / up_all;

  $(document).ready(function () {
    $("#upprogress").width(upwidth);
  });
}
