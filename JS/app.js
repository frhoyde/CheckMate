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

/*** copy to Trash in Firebase *****/
function copyTask(oldRef, newRef) {
  oldRef
    .once("value")
    .then((snap) => {
      return newRef.update(snap.val());
    })
    .then(() => {
      console.log("Copy Done!");
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function add_task() {
  new_task = document.getElementById("new-task");
  date = document.getElementById("input_date");
  time = document.getElementById("input_time");
  console.log(time.value);

  if (
    new_task.value.length != 0 &&
    date.value.length != 0 &&
    time.value.length != 0
  ) {
    add_task_to_database();
  }
}

var today = new Date();
console.log(today);

function create_unfinished_task() {
  unfinished_task_container = document.getElementsByClassName(
    "important-container"
  )[0];
  unfinished_task_container.innerHTML = "";
  var taskArray = [];
  task_listUl = document.createElement("ul");
  task_listUl.setAttribute("class", "task-list");
  firebase.auth().onAuthStateChanged(function (user) {
    var firebaseRef = firebase
      .database()
      .ref("users/" + user.uid + "/unfinished_task/");

    var allTask = firebase.database().ref("users/" + user.uid + "/all_task/");

    copyTask(firebaseRef, allTask);

    if (user) {
      user = firebase.auth().currentUser;
      // Retrieve new tasks as they are added to our database
      firebaseRef.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var childkey = childSnapshot.key;
          var date_given = new Date(childSnapshot.val().date);

          /*** Checking if task is for today or not ***/
          if (today.getDate() == date_given.getDate())
            taskArray.push(childSnapshot.val());
        });
        for (var i, i = 0; i < taskArray.length; i++) {
          task_date = taskArray[i].date;
          task_key = taskArray[i].key;
          task_title = taskArray[i].title;
          task_time = taskArray[i].time;
          console.log(task_title);

          task_list = document.createElement("li");
          task_list.setAttribute("class", "draggable");
          task_list.setAttribute("draggable", "true");

          task_container = create_task_container(task_key, user.uid);

          // TASK DATA
          task_data = document.createElement("div");
          task_data.setAttribute("id", "task_data");

          //TASK DONE CHECKBOX

          // label_for_checkbox = document.createElement("label");
          // label_for_checkbox.setAttribute("for", "task_done_button");

          title = create_title(task_title);

          date = document.createElement("p");
          date.setAttribute("id", "task_date");
          date.setAttribute("contenteditable", false);
          date.setAttribute("style", "display:none;");
          date.innerHTML = task_date;

          time = document.createElement("p");
          time.setAttribute("id", "task_time");
          time.setAttribute("contenteditable", false);
          time.innerHTML = task_time;

          tag = document.createElement("span");
          tag.setAttribute("class", "tag review"); //for now review tag
          tag.innerHTML = "important";

          // TASK TOOLS
          task_tool = document.createElement("div");
          task_tool.setAttribute("id", "task_tool");

          task_done_button = document.createElement("button");
          task_done_button.setAttribute("id", "task_done_button");
          task_done_button.setAttribute(
            "onclick",
            "task_done(this.parentElement.parentElement.parentElement, this.parentElement)"
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

          unfinished_task_container.append(task_listUl);
          task_listUl.append(task_list);
          addEventsDragAndDrop(task_list);
          task_list.append(task_container);

          task_container.append(task_data);
          task_data.append(title);
          task_data.append(tag);
          task_data.append(time);
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

/**ALLTask Container */
function create_all_task() {
  all_task_container = document.getElementsByClassName("all-container")[0];
  all_task_container.innerHTML = "";
  var all_taskArray = [];
  all_task_listUl = document.createElement("ul");
  all_task_listUl.setAttribute("class", "task-list drag-list");
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

          /*** Checking if task is for today or not ***/
          if (today.getDate() == date_given.getDate())
            all_taskArray.push(childSnapshot.val());
        });
        for (var i, i = 0; i < all_taskArray.length; i++) {
          task_date = all_taskArray[i].date;
          task_key = all_taskArray[i].key;
          task_title = all_taskArray[i].title;
          task_time = all_taskArray[i].time;
          //console.log(all_taskArray[i]);

          task_list = document.createElement("li");
          task_list.setAttribute("class", "drag-item");
          task_list.setAttribute("draggable", "true");

          task_container = create_task_container(task_key, user.uid);

          // TASK DATA
          task_data = document.createElement("div");
          task_data.setAttribute("id", "task_data");

          //TASK DONE CHECKBOX

          // label_for_checkbox = document.createElement("label");
          // label_for_checkbox.setAttribute("for", "task_done_button");

          title = create_title(task_title);

          date = document.createElement("p");
          date.setAttribute("id", "task_date");
          date.setAttribute("contenteditable", false);
          date.setAttribute("style", "display:none;");
          date.innerHTML = task_date;

          time = document.createElement("p");
          time.setAttribute("id", "task_time");
          time.setAttribute("contenteditable", false);
          time.innerHTML = task_time;

          tag = document.createElement("span");
          tag.setAttribute("class", "tag review"); //for now review tag
          tag.innerHTML = "important";

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

          all_task_container.append(all_task_listUl);
          all_task_listUl.append(task_list);
          addEventsDragAndDrop(task_list);
          task_list.append(task_container);

          task_container.append(task_data);
          task_data.append(title);
          task_data.append(tag);
          task_data.append(time);
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

//Create finished tasks
function create_finished_task() {
  finished_task_container = document.getElementsByClassName(
    "completed-container"
  )[0];
  finished_task_container.innerHTML = "";
  finished_task_listUl = document.createElement("ul");
  finished_task_listUl.setAttribute("class", "task-list drag-list");

  finished_task_array = [];
  firebase.auth().onAuthStateChanged(function (user) {
    var firebaseRef = firebase
      .database()
      .ref("users/" + user.uid + "/finished_task/");

    var allTask = firebase.database().ref("users/" + user.uid + "/all_task/");

    copyTask(firebaseRef, allTask);

    user = firebase.auth().currentUser;
    // Retrieve new tasks as they are added to our database
    firebaseRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var childkey = childSnapshot.key;
        var date_given = new Date(childSnapshot.val().date);

        /*** Checking if task is for today or not ***/
        if (today.getDate() == date_given.getDate())
          finished_task_array.push(childSnapshot.val());
      });

      for (var i, i = 0; i < finished_task_array.length; i++) {
        task_date = finished_task_array[i].date;
        task_key = finished_task_array[i].key;
        task_title = finished_task_array[i].title;
        task_time = taskArray[i].time;

        task_list = document.createElement("li");
        task_list.setAttribute("class", "draggable");
        task_list.setAttribute("draggable", "true");

        task_container = create_task_container(task_key, user.uid);

        // TASK DATA
        task_data = document.createElement("div");
        task_data.setAttribute("id", "task_data");

        title = create_title(task_title);

        date = document.createElement("p");
        date.setAttribute("id", "task_date");
        date.setAttribute("contenteditable", false);
        date.innerHTML = task_date;
        date.setAttribute("style", "display:none;");

        time = document.createElement("p");
        time.setAttribute("id", "task_time");
        time.setAttribute("contenteditable", false);
        time.innerHTML = task_time;

        tag = document.createElement("span");
        tag.setAttribute("class", "tag completed");
        tag.innerHTML = "completed";

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

        finished_task_container.append(finished_task_listUl);
        finished_task_listUl.append(task_list);
        task_list.append(task_container);
        addEventsDragAndDrop(task_list);
        task_container.append(task_data);
        task_data.append(title);
        task_data.append(tag);
        task_data.append(date);

        task_container.append(task_tool);
        task_tool.append(task_delete_button);
        task_delete_button.append(fa_delete);
      }
    });
  });
}

//Create Task_container

function create_task_container(task_key, userUid) {
  task_container = document.createElement("div");
  task_container.setAttribute("class", "task_container");
  task_container.setAttribute("data-key", task_key);
  task_container.setAttribute("user-uid", userUid);
  return task_container;
}

//Create Task Title

function create_title(task_title) {
  title = document.createElement("span");
  title.setAttribute("id", "task_title");
  title.setAttribute("contenteditable", false);
  title.innerHTML = task_title;
  return title;
}

//Task-done button func
function task_done(task, task_tool) {
  console.log(task.childNodes[0].childNodes[0].childNodes[3].innerHTML);
  var date_given = new Date(
    task.childNodes[0].childNodes[0].childNodes[3].innerHTML
  );
  console.log(today.getDate());

  /*** Checking if task is for today or not ***/
  if (today.getDate() == date_given.getDate()) {
    finished_task_container = document.getElementsByClassName(
      "completed-container"
    )[0];
    console.log("hiii");
    task.childNodes[0].removeChild(task_tool);
    finished_task_container.append(task);
  } else {
    finished_upTask_container = document.getElementsByClassName(
      "upcomingCompleted-container"
    )[0];
    task.childNodes[0].removeChild(task_tool);
    finished_upTask_container.append(task);
  }

  var user_uid = task.getAttribute("user-uid");
  var key = task.getAttribute("data-key");
  console.log(task);
  var task_obj = {
    title: task.childNodes[0].childNodes[0].childNodes[0].innerHTML,
    date: task.childNodes[0].childNodes[0].childNodes[3].innerHTML,
    time: task.childNodes[0].childNodes[0].childNodes[2].innerHTML,
    key: key,
  };

  var updates = {};
  updates["users/" + user_uid + "/finished_task/" + key] = task_obj;
  firebaseRef.update(updates);

  // delete our task from unfinished
  task_delete(task);
  if (today.getDate() == date_given.getDate()) create_finished_task();
  else create_upcoming_finished_task();
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

  date = task.childNodes[0].childNodes[2];
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

  date = task.childNodes[0].childNodes[2];
  date.setAttribute("contenteditable", false);
  date.setAttribute("id", "task_date");

  // change in firebase for editing tasks
  var user_uid = task.getAttribute("user-uid");
  var key = task.getAttribute("data-key");
  var task_obj = {
    title: task.childNodes[0].childNodes[0].innerHTML,
    date: task.childNodes[0].childNodes[2].innerHTML,
    key: key,
  };

  var updates = {};
  updates["users/" + user_uid + "/unfinished_task/" + key] = task_obj;
  firebaseRef.update(updates);
}

function task_delete(task) {
  var key = task.getAttribute("data-key");
  var user_uid = task.getAttribute("user-uid");
  task_to_remove = firebase
    .database()
    .ref("users/" + user_uid + "/unfinished_task/" + key);

  var task_obj = {
    title: task.childNodes[0].childNodes[0].innerHTML,
    date: task.childNodes[0].childNodes[2].innerHTML,
    key: key,
  };

  var updates = {};
  updates["users/" + user_uid + "/Trash/" + key] = task_obj;
  firebaseRef.update(updates);

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

  var task_obj = {
    title: task.childNodes[0].childNodes[0].innerHTML,
    date: task.childNodes[0].childNodes[2].innerHTML,
    key: key,
  };

  var updates = {};
  updates["users/" + user_uid + "/Trash/" + key] = task_obj;
  firebaseRef.update(updates);
  task_to_remove.remove();

  // remove from html view or whateversss
  task.remove();
}

function create_upcoming_unfinished_task() {
  unfinished_upTask_container = document.getElementsByClassName(
    "upcomingImportant-container"
  )[0];
  unfinished_upTask_container.innerHTML = "";
  var taskArrayUpcoming = [];
  upcomingTask_listUl = document.createElement("ul");
  upcomingTask_listUl.setAttribute("class", "task-list");

  firebase.auth().onAuthStateChanged(function (user) {
    var firebaseRef = firebase
      .database()
      .ref("users/" + user.uid + "/unfinished_task/");
    if (user) {
      user = firebase.auth().currentUser;
      // Retrieve new tasks as they are added to our database
      firebaseRef.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var childkey = childSnapshot.key;
          var date_given = new Date(childSnapshot.val().date);

          /*** Checking if task is for today or not ***/
          if (today.getDate() != date_given.getDate())
            taskArrayUpcoming.push(childSnapshot.val());
        });
        for (var i, i = 0; i < taskArrayUpcoming.length; i++) {
          task_date = taskArrayUpcoming[i].date;
          task_key = taskArrayUpcoming[i].key;
          task_title = taskArrayUpcoming[i].title;
          console.log(task_title);

          task_list = document.createElement("li");
          task_list.setAttribute("class", "draggable");
          task_list.setAttribute("draggable", "true");

          task_container = create_task_container(task_key, user.uid);

          // TASK DATA
          task_data = document.createElement("div");
          task_data.setAttribute("id", "task_data");

          title = create_title(task_title);

          date = document.createElement("p");
          date.setAttribute("id", "task_date");
          date.setAttribute("contenteditable", false);
          date.innerHTML = task_date;

          tag = document.createElement("span");
          tag.setAttribute("class", "tag review"); //for now review tag
          tag.innerHTML = "important";

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

          unfinished_upTask_container.append(upcomingTask_listUl);
          upcomingTask_listUl.append(task_list);
          addEventsDragAndDrop(task_list);
          task_list.append(task_container);

          task_container.append(task_data);
          task_data.append(title);
          task_data.append(tag);
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

//Create finished tasks
function create_upcoming_finished_task() {
  finished_upTask_container = document.getElementsByClassName(
    "upcomingCompleted-container"
  )[0];
  finished_upTask_container.innerHTML = "";

  finished_upcomingTask_array = [];

  upcomingFinishedTask_listUl = document.createElement("ul");
  upcomingFinishedTask_listUl.setAttribute("class", "task-list");

  firebase.auth().onAuthStateChanged(function (user) {
    var firebaseRef = firebase
      .database()
      .ref("users/" + user.uid + "/finished_task/");

    user = firebase.auth().currentUser;
    // Retrieve new tasks as they are added to our database
    firebaseRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var childkey = childSnapshot.key;
        var date_given = new Date(childSnapshot.val().date);

        /*** Checking if task is for today or not ***/
        if (today.getDate() != date_given.getDate())
          finished_upcomingTask_array.push(childSnapshot.val());
      });

      for (var i, i = 0; i < finished_upcomingTask_array.length; i++) {
        task_date = finished_upcomingTask_array[i].date;
        task_key = finished_upcomingTask_array[i].key;
        task_title = finished_upcomingTask_array[i].title;
        task_time = finished_upcomingTask_array[i].time;

        task_list = document.createElement("li");
        task_list.setAttribute("class", "draggable");
        task_list.setAttribute("draggable", "true");

        task_container = create_task_container(task_key, user.uid);

        // TASK DATA
        task_data = document.createElement("div");
        task_data.setAttribute("id", "task_data");

        title = create_title(task_title);

        date = document.createElement("p");
        date.setAttribute("id", "task_date");
        date.setAttribute("contenteditable", false);
        date.innerHTML = task_date;

        time = document.createElement("p");
        time.setAttribute("id", "task_time");
        time.setAttribute("contenteditable", false);
        time.innerHTML = task_time;

        tag = document.createElement("span");
        tag.setAttribute("class", "tag completed");
        tag.innerHTML = "completed";

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

        finished_upTask_container.append(upcomingFinishedTask_listUl);
        upcomingFinishedTask_listUl.append(task_list);
        addEventsDragAndDrop(task_list);
        task_list.append(task_container);

        task_container.append(task_data);
        task_data.append(title);
        task_data.append(tag);
        task_data.append(date);

        task_container.append(task_tool);
        task_tool.append(task_delete_button);
        task_delete_button.append(fa_delete);
      }
    });
  });
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
        time: input_time.value,
      };
      var updates = {};
      updates["users/" + user.uid + "/unfinished_task/" + key] = task;
      firebaseRef.update(updates);
      create_unfinished_task();
      create_upcoming_unfinished_task();
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

/******************** Drag and Drop ****************/
var remove = document.querySelector(".draggable");
function dragStart(e) {
  this.style.opacity = "0.4";
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

function dragEnter(e) {
  this.classList.add("over");
}

function dragLeave(e) {
  e.stopPropagation();
  this.classList.remove("over");
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  return false;
}

function dragDrop(e) {
  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData("text/html");
  }
  return false;
}

function dragEnd(e) {
  var listItens = document.querySelectorAll(".draggable");
  [].forEach.call(listItens, function (item) {
    item.classList.remove("over");
  });
  this.style.opacity = "1";
}

function addEventsDragAndDrop(el) {
  el.addEventListener("dragstart", dragStart, false);
  el.addEventListener("dragenter", dragEnter, false);
  el.addEventListener("dragover", dragOver, false);
  el.addEventListener("dragleave", dragLeave, false);
  el.addEventListener("drop", dragDrop, false);
  el.addEventListener("dragend", dragEnd, false);
}

var listItens = document.querySelectorAll(".draggable");
[].forEach.call(listItens, function (item) {
  addEventsDragAndDrop(item);
});
