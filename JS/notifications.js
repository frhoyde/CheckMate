
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
  



var today = new Date();
var notificationTimes = [];

var today_month =
  today.getMonth() + 1 >= 10
    ? today.getMonth() + 1
    : "0" + (today.getMonth() + 1);

var today_date =
  today.getDate() >= 10 ? today.getDate() : "0" + today.getDate();

var today_string = today.getFullYear() + "-" + today_month + "-" + today_date;

function timeToString(a, b){
    return a + ":" + b;
}

function stringToHour(a){
    return parseInt(a[0] + a[1]);
}

function stringToMin(a){
    return parseInt(a[3]+a[4]);
}



todaysTaskArray.forEach(function(i) {
    var timeVar = todaysTaskArray[i].time;
    var hourVar = stringToHour(timeVar);
    var minVar = stringToMin(timeVar);
    if(minVar >=30){
        minVar -= 30;
    }else {
        minVar = 60 - (30 - minVar);
    }

    notificationTimes.push(timeToString(hourVar, minVar));
    console.log(notificationTimes);
});



setInterval(updateTime, 1000);
function updateTime() {
    let time = new Date();
    let hour = time.getHours();
    let min = time.getMinutes();
    
    var currentTime = hour + ":" + min;

    notificationTimes.forEach(function(i) {
        if(currentTime === notificationTimes[i]){
            callNotification(i);
        }
    
    });
   
}
updateTime();


function callNotification(i){
    var list = document.getElementById("notification-list");
    newLI = document.createElementNS(null,"li");
    notificationTxt = document.createTextNode(todaysTaskArray[i].title);
    newLI.appendChild(notificationTxt);
    list.appendChild(newLI);
    console.log(notificationTxt);
}