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
    user = firebase.auth().currentUser;
    console.log(user.email + " signed in");
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

/****Today's task radio button nav ****/
var currentState = $(".important-container");
$("input[type='radio']").on("change", function () {
  currentState.hide();
  currentState = $("." + $("input[type='radio']:checked").val());
  currentState.show();
});

function add_task() {
  new_task = document.getElementById("new-task");
  //console.log(new_task.value.length);

  if (new_task.value.length != 0) {
    add_task_to_database();
  }
}

function create_unfinished_task() {
  unfinished_task_container = document.getElementsByClassName(
    "important-container"
  )[0];
  unfinished_task_container.innerHTML = "";
  var taskArray = [];

  firebase.auth().onAuthStateChanged(function (user) {
    var firebaseRef = firebase
      .database()
      .ref("users/" + user.uid + "/unfinished_task/")
      .orderByChild("date");
    if (user) {
      user = firebase.auth().currentUser;
      // Retrieve new tasks as they are added to our database
      firebaseRef.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var childkey = childSnapshot.key;
          //console.log(childSnapshot.val());
          taskArray.push(childSnapshot.val());
        });
        for (var i, i = 0; i < taskArray.length; i++) {
          task_date = taskArray[i].date;
          task_key = taskArray[i].key;
          task_title = taskArray[i].title;
          console.log(task_title);

          task_container = document.createElement("div");
          task_container.setAttribute("class", "task_container");
          task_container.setAttribute("data-key", task_key);
          task_container.setAttribute("user-uid", user.uid);

          // TASK DATA
          task_data = document.createElement("div");
          task_data.setAttribute("id", "task_data");

          //TASK DONE CHECKBOX

          // label_for_checkbox = document.createElement("label");
          // label_for_checkbox.setAttribute("for", "task_done_button");

          title = document.createElement("span");
          title.setAttribute("id", "task_title");
          title.setAttribute("contenteditable", false);
          title.innerHTML = task_title;

          date = document.createElement("p");
          date.setAttribute("id", "task_date");
          date.setAttribute("contenteditable", false);
          date.innerHTML = task_date;

          // TASK TOOLS
          task_tool = document.createElement("div");
          task_tool.setAttribute("id", "task_tool");

          task_done_button = document.createElement("button");
          task_done_button.setAttribute("id", "task_done_button");
          task_done_button.setAttribute(
            "onclick",
            "task_done(this.parentElement.parentElement, this.parentElement)"
          );
          task_done_button.innerHTML = "done";
          fa_done = document.createElement("i");
          fa_done.setAttribute("class", "bi bi-check-lg");

          task_edit_button = document.createElement("button");
          task_edit_button.setAttribute("id", "task_edit_button");
          task_edit_button.setAttribute(
            "onclick",
            "task_edit(this.parentElement.parentElement, this)"
          );
          task_edit_button.innerHTML = "edit";
          fa_edit = document.createElement("i");
          fa_edit.setAttribute("class", "bi bi-pencil");

          task_delete_button = document.createElement("button");
          task_delete_button.setAttribute("id", "task_delete_button");
          task_delete_button.setAttribute(
            "onclick",
            "task_delete(this.parentElement.parentElement)"
          );
          task_delete_button.innerHTML = "delete";
          fa_delete = document.createElement("i");
          fa_delete.setAttribute("class", "bi bi-trash-fill");

          unfinished_task_container.append(task_container);
          task_container.append(task_data);
          task_data.append(title);
          task_data.append(date);

          task_container.append(task_tool);

          task_tool.append(task_done_button);
          task_done_button.append(fa_done);
          task_tool.append(task_edit_button);
          task_edit_button.append(fa_edit);
          task_tool.append(task_delete_button);
          task_delete_button.append(fa_delete);
        }
      });
    }
  });
}
//show_task_from_database();

//Create Unfinished tasks
function create_finished_task() {
  finished_task_container = document.getElementsByClassName(
    "completed-container"
  )[0];
  finished_task_container.innerHTML = "";

  finished_task_array = [];
  firebase.auth().onAuthStateChanged(function (user) {
    var firebaseRef = firebase
      .database()
      .ref("users/" + user.uid + "/finished_task/");

    user = firebase.auth().currentUser;
    // Retrieve new tasks as they are added to our database
    firebaseRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var childkey = childSnapshot.key;
        //console.log(childSnapshot.val());
        finished_task_array.push(childSnapshot.val());
      });

      for (var i, i = 0; i < finished_task_array.length; i++) {
        task_date = finished_task_array[i].date;
        task_key = finished_task_array[i].key;
        task_title = finished_task_array[i].title;

        task_container = document.createElement("div");
        task_container.setAttribute("class", "task_container");
        task_container.setAttribute("data-key", task_key);

        // TASK DATA
        task_data = document.createElement("div");
        task_data.setAttribute("id", "task_data");

        title = document.createElement("p");
        title.setAttribute("id", "task_title");
        title.setAttribute("contenteditable", false);
        title.innerHTML = task_title;

        date = document.createElement("p");
        date.setAttribute("id", "task_date");
        date.setAttribute("contenteditable", false);
        date.innerHTML = task_date;

        // TASK TOOLS
        task_tool = document.createElement("div");
        task_tool.setAttribute("id", "task_tool");

        task_delete_button = document.createElement("button");
        task_delete_button.setAttribute("id", "task_delete_button");
        task_delete_button.setAttribute(
          "onclick",
          "task_finished_delete(this.parentElement.parentElement)"
        );
        task_delete_button.innerHTML = "delete";
        fa_delete = document.createElement("i");
        fa_delete.setAttribute("class", "bi bi-trash-fill");

        finished_task_container.append(task_container);
        task_container.append(task_data);
        task_data.append(title);
        task_data.append(date);

        task_container.append(task_tool);
        task_tool.append(task_delete_button);
        task_delete_button.append(fa_delete);
      }
    });
  });
}

//Task-done button func
function task_done(task, task_tool) {
  finished_task_container = document.getElementsByClassName(
    "completed-container"
  )[0];
  task.removeChild(task_tool);
  finished_task_container.append(task);

  var user_uid = task.getAttribute("user-uid");
  var key = task.getAttribute("data-key");
  var task_obj = {
    title: task.childNodes[0].childNodes[0].innerHTML,
    date: task.childNodes[0].childNodes[1].innerHTML,
    key: key,
  };

  var updates = {};
  updates["users/" + user_uid + "/finished_task/" + key] = task_obj;
  firebaseRef.update(updates);

  // delete our task from unfinished
  task_delete(task);
  create_finished_task();
}

function task_edit(task, edit_button) {
  edit_button.setAttribute("id", "task_edit_button_editing");
  edit_button.setAttribute(
    "onclick",
    "finish_edit(this.parentElement.parentElement, this)"
  );

  title = task.childNodes[0].childNodes[0];
  title.setAttribute("contenteditable", true);
  title.setAttribute("id", "title_editing");
  title.focus();

  date = task.childNodes[0].childNodes[1];
  date.setAttribute("contenteditable", true);
  date.setAttribute("id", "date_editing");
}

//Finish-edit-tasks

function finish_edit(task, edit_button) {
  edit_button.setAttribute("id", "task_edit_button");
  edit_button.setAttribute(
    "onclick",
    "task_edit(this.parentElement.parentElement, this)"
  );

  title = task.childNodes[0].childNodes[0];
  title.setAttribute("contenteditable", false);
  title.setAttribute("id", "task_title");

  date = task.childNodes[0].childNodes[1];
  date.setAttribute("contenteditable", false);
  date.setAttribute("id", "task_date");

  // change in firebase for editing tasks
  var user_uid = task.getAttribute("user-uid");
  var key = task.getAttribute("data-key");
  var task_obj = {
    title: task.childNodes[0].childNodes[0].innerHTML,
    date: task.childNodes[0].childNodes[1].innerHTML,
    key: key,
  };

  var updates = {};
  updates["users/" + user_uid + "/finished_task/" + key] = task_obj;
  firebaseRef.update(updates);
}

function task_delete(task) {
  var key = task.getAttribute("data-key");
  var user_uid = task.getAttribute("user-uid");
  task_to_remove = firebase
    .database()
    .ref("users/" + user_uid + "/unfinished_task/" + key);
  task_to_remove.remove();

  // remove from html view or whateversss
  task.remove();
}

function task_finished_delete(task) {
  var key = task.getAttribute("data-key");
  var user_uid = task.getAttribute("user-uid");
  task_to_remove = firebase
    .database()
    .ref("users/" + user_uid + "/finished_task/" + key);
  task_to_remove.remove();

  // remove from html view or whateversss
  task.remove();
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
        description: description.value,
        date: input_date.value,
      };
      var updates = {};
      updates["users/" + user.uid + "/unfinished_task/" + key] = task;
      firebaseRef.update(updates);
      create_unfinished_task();
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
    })
    .catch((error) => {
      //An error happened.
      var errorMessage = error.message;
      window.alert(errorMessage);
    });
}
