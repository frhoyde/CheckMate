// google api js

// Client ID and API key from the Developer Console
var CLIENT_ID =
  "778401257741-6a75o3ij228620vchcjjovh3muh3hu6s.apps.googleusercontent.com";
var API_KEY = "AIzaSyBzFIsDwS53ueZZ9X79V06CvATUbde5XyI";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      },
      function (error) {
        appendPre(JSON.stringify(error, null, 2));
      }
    );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById("content");
  var textContent = document.createTextNode(message + "\n");
  pre.appendChild(textContent);
}

var google_events = [];

function listUpcomingEvents() {
  gapi.client.calendar.events
    .list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    })
    .then(function (response) {
      var events = response.result.items;

      //appendPre("Upcoming events:");

      if (events.length > 0) {
        // for (var i, i = 0; i < taskArray.length; i++) {
        //   task_date = taskArray[i].date;
        //   task_key = taskArray[i].key;
        //   task_title = taskArray[i].title;
        //   task_description = taskArray[i].description;

        //   var new_event = {
        //     id: taskArray[i].key,
        //     name: taskArray[i].title,
        //     description: taskArray[i].description,
        //     date: taskArray[i].date,
        //     type: "event",
        //     everyYear: !0,
        //   };

        //   event_array.push(new_event);
        // }
        for (var i, i = 0; i < events.length; i++) {
          //  task_date2 = events[i].start.data;
          // task_key2 = events[i].id;
          // task_title2 = events[i].summary;
          // task_description2 = events[i].summary;

          var temp_event = events[i];
          console.log(events[i]);
          var when = temp_event.start.dateTime;
          if (!when) {
            when = temp_event.start.date;
          }
          console.log(when);

          var new_event2 = {
            id: events[i].id,
            name: events[i].summary,
            description: events[i].summary,
            date: when,
            type: "event",
            everyYear: !0,
          };

          google_events.push(new_event2);
        }
        console.log(google_events);
        appendPre("");
      } else {
        appendPre("No upcoming events found.");
      }
    });
  //  $("#demoEvoCalendar").evoCalendar({
  //   format: "MM dd, yyyy",
  //   titleFormat: "MM",
  //   calendarEvents: google_events,

  // });
}

// /*google api js*/

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

var taskArray = [];

var defaultTheme = getRandom(4);

var today = new Date();
console.log(today);

var active_events = [];

var week_date = [];

var curAdd, curRmv;

function getRandom(a) {
  return Math.floor(Math.random() * a);
}

function getWeeksInMonth(a, b) {
  var c = [],
    d = new Date(b, a, 1),
    e = new Date(b, a + 1, 0),
    f = e.getDate();
  var g = 1;
  var h = 7 - d.getDay();
  while (g <= f) {
    c.push({
      start: g,
      end: h,
    });
    g = h + 1;
    h += 7;
    if (h > f) h = f;
  }
  return c;
}

week_date = getWeeksInMonth(today.getMonth(), today.getFullYear())[2];

$(document).ready(function () {
  firebase.auth().onAuthStateChanged(function (user) {
    var firebaseRef = firebase
      .database()
      .ref("users/" + user.uid + "/unfinished_task/");

    user = firebase.auth().currentUser;
    // Retrieve new tasks as they are added to our database
    firebaseRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var childkey = childSnapshot.key;
        //console.log(childSnapshot.val());
        taskArray.push(childSnapshot.val());
      });
      var event_array = [];

      for (var i, i = 0; i < taskArray.length; i++) {
        var new_event = {
          id: taskArray[i].key,
          name: taskArray[i].title,
          description: taskArray[i].description,
          date: taskArray[i].date,
          type: "event",
          everyYear: !0,
        };

        event_array.push(new_event);
      }
      //console.log(new_event);

      $("#demoEvoCalendar").evoCalendar({
        format: "MM dd, yyyy",
        titleFormat: "MM",
        calendarEvents: $.merge(event_array, google_events),
      });
      //console.log(calendarEvents);

      // calendarEvents : [
      //   {
      //         id: taskArray[i].key,
      //         name: taskArray[i].title,
      //         description: taskArray[i].description,
      //         date: taskArray[i].date,
      //         type: "birthday",
      //         everyYear: !0,
      //       },

      // ],

      // calendarEvents: [

      //   {
      //     id: "sKn89hi",
      //     name: "1-Week Coding Bootcamp",
      //     description: "Lorem ipsum dolor sit amet.",
      //     badge: "5-day event",
      //     date: [
      //       today.getMonth() +
      //         1 +
      //         "/" +
      //         week_date.start +
      //         "/" +
      //         today.getFullYear(),
      //       today.getMonth() +
      //         1 +
      //         "/" +
      //         week_date.end +
      //         "/" +
      //         today.getFullYear(),
      //     ],
      //     type: "event",
      //     everyYear: !0,
      //   },
      //   {
      //     id: "in8bha4",
      //     name: "Holiday #2",
      //     description:
      //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      //     date: today,
      //     type: "holiday",
      //   },
      //   {
      //     id: "in8bha4",
      //     name: "Event #2",
      //     date: today,
      //     type: "event",
      //   },
      // ],

      $("[data-set-theme]").click(function (b) {
        a(b.target);
      });
      $("#addBtn").click(function (a) {
        curAdd = getRandom(events.length);
        $("#demoEvoCalendar").evoCalendar("addCalendarEvent", events[curAdd]);
        active_events.push(events[curAdd]);
        events.splice(curAdd, 1);
        if (0 === events.length) a.target.disabled = !0;
        if (active_events.length > 0) $("#removeBtn").prop("disabled", !1);
      });
      $("#removeBtn").click(function (a) {
        curRmv = getRandom(active_events.length);
        $("#demoEvoCalendar").evoCalendar(
          "removeCalendarEvent",
          active_events[curRmv].id
        );
        events.push(active_events[curRmv]);
        active_events.splice(curRmv, 1);
        if (0 === active_events.length) a.target.disabled = !0;
        if (events.length > 0) $("#addBtn").prop("disabled", !1);
      });
      a($("[data-set-theme]")[defaultTheme]);
      function a(a) {
        var b = a.dataset.setTheme;
        $("[data-set-theme]").removeClass("active");
        $(a).addClass("active");
        $("#demoEvoCalendar").evoCalendar("setTheme", b);
      }
      var b = getRandom($("[data-settings]").length);
      var c = $("[data-settings]")[b];
      var d = getRandom($("[data-method]").length);
      var e = $("[data-method]")[d];
      var f = getRandom($("[data-event]").length);
      var g = $("[data-event]")[f];
      showSettingsSample($(c).data().settings);
      showMethodSample($(e).data().method);
      showEventSample($(g).data().event);
      $("[data-settings]").on("click", function (a) {
        var b = $(a.target).closest("[data-settings]");
        var c = b.data().settings;
        showSettingsSample(c);
      });
      $("[data-method]").on("click", function (a) {
        var b = $(a.target).closest("[data-method]");
        var c = b.data().method;
        showMethodSample(c);
      });
      $("[data-event]").on("click", function (a) {
        var b = $(a.target).closest("[data-event]");
        var c = b.data().event;
        showEventSample(c);
      });
    });
  });
});

function showMethodSample(a) {
  var b = $("#method-code");
  var c;
  switch (a) {
    case "setTheme":
      c =
        '<br><span class="green">// setTheme</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'setTheme\'</span>, <span class="red">\'Theme Name\'</span>);' +
        "<br> ";
      break;

    case "toggleSidebar":
      c =
        '<br><span class="green">// toggleSidebar</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'toggleSidebar\'</span>);' +
        "<br> " +
        '<br><span class="green">// open sidebar</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'toggleSidebar\'</span>, <span class="blue">true</span>);' +
        "<br> ";
      break;

    case "toggleEventList":
      c =
        '<br><span class="green">// toggleEventList</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'toggleEventList\'</span>);' +
        "<br> " +
        '<br><span class="green">// close event list</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'toggleEventList\'</span>, <span class="blue">false</span>);' +
        "<br> ";
      break;

    case "getActiveDate":
      c =
        '<br><span class="green">// getActiveDate</span><br>' +
        '<span class="red">var</span> <span class="orange">active_date</span> = $(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'getActiveDate\'</span>);' +
        "<br> ";
      break;

    case "getActiveEvents":
      c =
        '<br><span class="green">// getActiveEvents</span><br>' +
        '<span class="red">var</span> <span class="orange">active_events</span> = $(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'getActiveEvents\'</span>);' +
        "<br> ";
      break;

    case "selectYear":
      c =
        '<br><span class="green">// selectYear</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'selectYear\'</span>, <span class="red">2021</span>);' +
        "<br> ";
      break;

    case "selectMonth":
      c =
        '<br><span class="green">// selectMonth</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'selectMonth\'</span>, <span class="red">1</span>); <span class="green">// february</span>' +
        "<br> ";
      break;

    case "selectDate":
      c =
        '<br><span class="green">// selectDate</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'selectDate\'</span>, <span class="red">\'February 15, 2020\'</span>);' +
        "<br> ";
      break;

    case "addCalendarEvent":
      c =
        '<br><span class="green">// addCalendarEvent</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'addCalendarEvent\'</span>, {<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">id</span>: <span class="red">\'kNybja6\'</span>,<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">name</span>: <span class="red">\'Mom\\\'s Birthday\'</span>,<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">description</span>: <span class="red">\'Lorem ipsum dolor sit..\'</span>,<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">date</span>: <span class="red">\'May 27, 2020\'</span>,<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">type</span>: <span class="red">\'birthday\'</span><br>' +
        "});" +
        '<br><span class="green">// add multiple events</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'addCalendarEvent\'</span>, [<br>' +
        "&#8194;&#8194;&#8194;&#8194;&#8194;{<br>" +
        '&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">id</span>: <span class="red">\'kNybja6\'</span>,<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">name</span>: <span class="red">\'Mom\\\'s Birthday\'</span>,<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">date</span>: <span class="red">\'May 27, 1965\'</span>,<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">type</span>: <span class="red">\'birthday\'</span>,<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">everyYear</span>: <span class="blue">true</span> <span class="green">// optional</span><br>' +
        "&#8194;&#8194;&#8194;&#8194;&#8194;},<br>" +
        "&#8194;&#8194;&#8194;&#8194;&#8194;{<br>" +
        '&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">id</span>: <span class="red">\'asDf87L\'</span>,<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">name</span>: <span class="red">\'Graduation Day!\'</span>,<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">date</span>: <span class="red">\'March 21, 2020\'</span>,<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">type</span>: <span class="red">\'event\'</span><br>' +
        "&#8194;&#8194;&#8194;&#8194;&#8194;}<br>" +
        "]);" +
        "<br> ";
      break;

    case "removeCalendarEvent":
      c =
        '<br><span class="green">// removeCalendarEvent</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'removeCalendarEvent\'</span>, <span class="red">\'kNybja6\'</span>);' +
        "<br> " +
        '<br><span class="green">// delete multiple event</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'removeCalendarEvent\'</span>, [<span class="red">\'kNybja6\'</span>, <span class="red">\'asDf87L\'</span>]);' +
        "<br> ";
      break;

    case "destroy":
      c =
        '<br><span class="green">// destroy</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'destroy\'</span>);' +
        "<br> ";
  }
  $("[data-method]").removeClass("active");
  $('[data-method="' + a + '"]').addClass("active");
  b.html(c);
}

function showEventSample(a) {
  var b = $("#event-code");
  var c;
  switch (a) {
    case "selectDate":
      c =
        '<br><span class="green">// selectDate</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">on</span>(<span class="violet">\'selectDate\'</span>, <span class="blue">function</span>(<span class="yellow">event</span>, <span class="yellow">newDate</span>, <span class="yellow">oldDate</span>) {<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;<span class="green">// code here...</span><br>' +
        "});" +
        "<br> ";
      break;

    case "selectEvent":
      c =
        '<br><span class="green">// selectEvent</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">on</span>(<span class="violet">\'selectEvent\'</span>, <span class="blue">function</span>(<span class="yellow">event</span>, <span class="yellow">activeEvent</span>) {<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;<span class="green">// code here...</span><br>' +
        "});" +
        "<br> ";
      break;

    case "selectMonth":
      c =
        '<br><span class="green">// selectMonth</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">on</span>(<span class="violet">\'selectMonth\'</span>, <span class="blue">function</span>(<span class="yellow">event</span>, <span class="yellow">activeMonth</span>, <span class="yellow">monthIndex</span>) {<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;<span class="green">// code here...</span><br>' +
        "});" +
        "<br> ";
      break;

    case "selectYear":
      c =
        '<br><span class="green">// selectYear</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">on</span>(<span class="violet">\'selectYear\'</span>, <span class="blue">function</span>(<span class="yellow">event</span>, <span class="yellow">activeYear</span>) {<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;<span class="green">// code here...</span><br>' +
        "});" +
        "<br> ";
      break;

    case "destroy":
      c =
        '<br><span class="green">// destroy</span><br>' +
        '$(<span class="red">\'#calendar\'</span>).<span class="yellow">on</span>(<span class="violet">\'destroy\'</span>, <span class="blue">function</span>(<span class="yellow">event</span>, <span class="yellow">evoCalendar</span>) {<br>' +
        '&#8194;&#8194;&#8194;&#8194;&#8194;<span class="green">// code here...</span><br>' +
        "});" +
        "<br> ";
  }
  $("[data-event]").removeClass("active");
  $('[data-event="' + a + '"]').addClass("active");
  b.html(c);
}

$('[data-go*="#"]').on("click", function (a) {
  a.preventDefault();
  var b = $(this).data().go;
  if ("#top" === b) {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      500
    );
    return;
  } else var c = $(b)[0].offsetTop - $("header")[0].offsetHeight - 10;
  $("html, body").animate(
    {
      scrollTop: c,
    },
    500
  );
});
