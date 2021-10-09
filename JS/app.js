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

var tagImportant = null;
var tagProgress = null;
var taskKey;
var firebaseRef = firebase.database().ref();

var today = new Date();

var today_month =
  today.getMonth() + 1 >= 10
    ? today.getMonth() + 1
    : "0" + (today.getMonth() + 1);

var today_date =
  today.getDate() >= 10 ? today.getDate() : "0" + today.getDate();

var today_string = today.getFullYear() + "-" + today_month + "-" + today_date;

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

function create_unfinished_task() {
  unfinished_task_container =
    document.getElementsByClassName("all-container")[0];
  unfinished_task_container.innerHTML = "";
  var taskArray = [];
  var tag_Imp, tag_Progress;
  task_listUl = document.createElement("ul");
  task_listUl.setAttribute("class", "task-list");
  firebase.auth().onAuthStateChanged(function (user) {
    var firebaseRef = firebase
      .database()
      .ref("users/" + user.uid + "/unfinished_task/")
      .orderByChild("time");

    // var allTask = firebase.database().ref("users/" + user.uid + "/all_task/");

    // copyTask(firebaseRef, allTask);

    if (user) {
      user = firebase.auth().currentUser;
      // Retrieve new tasks as they are added to our database
      firebaseRef.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var childkey = childSnapshot.key;
          var date_given = new Date(childSnapshot.val().date);

          /*** Checking if task is for today or not ***/
          if (
            today.getDate() == date_given.getDate() &&
            today.getMonth() == date_given.getMonth() &&
            today.getFullYear() == date_given.getFullYear()
          )
            taskArray.push(childSnapshot.val());
        });
        for (var i, i = 0; i < taskArray.length; i++) {
          task_date = taskArray[i].date;
          task_key = taskArray[i].key;
          task_title = taskArray[i].title;
          task_time = taskArray[i].time;
          task_description = taskArray[i].description;
          tag_Imp = taskArray[i].tag_important;
          tag_Progress = taskArray[i].tag_progress;
          console.log(task_title);

          task_list = document.createElement("li");
          task_list.setAttribute("class", "draggable");
          task_list.setAttribute("id", "task-list-detail");
          task_list.setAttribute("draggable", "true");

          task_container = create_task_container(i, task_key, user.uid);

          task_details_unfinished = create_task_detail_card(
            i,
            task_key,
            user.uid,
            task_date,
            task_title,
            task_time,
            task_description,
            tag_Imp,
            tag_Progress
          );

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

          tagImp = document.createElement("span");
          tagImp.setAttribute("class", "tag review"); //for now review tag
          tagImp.innerHTML = "important";

          tagProgress = document.createElement("span");
          tagProgress.setAttribute("class", "tag progress"); //for now review tag
          tagProgress.innerHTML = "progress";

          // TASK TOOLS
          task_tool = document.createElement("div");
          task_tool.setAttribute("id", "task_tool");

          task_done_button = document.createElement("button");
          task_done_button.setAttribute("id", "task_done_button");
          task_done_button.setAttribute(
            "onclick",
            "task_done(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)"
          );
          task_done_button.innerHTML = "done";
          fa_done = document.createElement("i");
          fa_done.setAttribute("class", "bi bi-check-lg");

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

          if (tag_Imp) {
            task_data.append(tagImp);
          }

          if (tag_Progress) {
            task_data.append(tagProgress);
          }

          task_data.append(time);
          task_data.append(date);
          task_container.append(task_tool);

          task_tool.append(task_done_button);
          task_done_button.append(fa_done);

          task_tool.append(task_delete_button);
          task_delete_button.append(fa_delete);
          task_list.append(task_details_unfinished);
        }
      });
    }
  });
}

/**Important-Task Container */
function create_important_task() {
  imp_task_container = document.getElementsByClassName(
    "important-container"
  )[0];

  imp_task_container.innerHTML = "";
  var imp_taskArray = [];
  imp_task_listUl = document.createElement("ul");
  imp_task_listUl.setAttribute("class", "task-list drag-list");
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

          /** Checking if the task has Important Tag and If Task is Today's**/

          if (
            childSnapshot.val().tag_important &&
            today.getDate() == date_given.getDate() &&
            today.getMonth() == date_given.getMonth() &&
            today.getFullYear() == date_given.getFullYear()
          ) {
            imp_taskArray.push(childSnapshot.val());
          }
        });

        for (var i, i = 0; i < imp_taskArray.length; i++) {
          task_date = imp_taskArray[i].date;
          task_key = imp_taskArray[i].key;
          task_title = imp_taskArray[i].title;
          task_time = imp_taskArray[i].time;
          task_description = imp_taskArray[i].description;
          //console.log(imp_taskArray[i]);

          task_list = document.createElement("li");
          task_list.setAttribute("class", "drag-item");
          task_list.setAttribute("draggable", "true");

          task_container = create_task_container(i, task_key, user.uid);

          task_details_imp = create_task_detail_card(
            i,
            task_key,
            user.uid,
            task_date,
            task_title,
            task_time,
            task_description,
            "Important"
          );

          // TASK DATA
          task_data = document.createElement("div");
          task_data.setAttribute("id", "task_data");

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

          task_delete_button = document.createElement("button");
          task_delete_button.setAttribute("id", "task_delete_button");
          task_delete_button.setAttribute(
            "onclick",
            "task_delete(this.parentElement.parentElement)"
          );
          task_delete_button.innerHTML = "delete";
          fa_delete = document.createElement("i");
          fa_delete.setAttribute("class", "bi bi-trash-fill");

          /*** Appends Starts ***/

          imp_task_container.append(imp_task_listUl);
          imp_task_listUl.append(task_list);
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
          task_tool.append(task_delete_button);
          task_delete_button.append(fa_delete);
          task_list.append(task_details_imp);
        }
      });
    }
  });
}

/** Create In-Progress Task */
function create_inProgress_task() {
  progress_task_container =
    document.getElementsByClassName("progress-container")[0];

  progress_task_container.innerHTML = "";
  var progress_taskArray = [];
  progress_task_listUl = document.createElement("ul");
  progress_task_listUl.setAttribute("class", "task-list drag-list");
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

          /** Checking if the task has In-Progress Tag and If Task is Today's**/

          if (
            childSnapshot.val().tag_progress &&
            today.getDate() == date_given.getDate() &&
            today.getMonth() == date_given.getMonth() &&
            today.getFullYear() == date_given.getFullYear()
          ) {
            progress_taskArray.push(childSnapshot.val());
          }
        });

        for (var i, i = 0; i < progress_taskArray.length; i++) {
          task_date = progress_taskArray[i].date;
          task_key = progress_taskArray[i].key;
          task_title = progress_taskArray[i].title;
          task_time = progress_taskArray[i].time;
          task_description = progress_taskArray[i].description;

          task_list = document.createElement("li");
          task_list.setAttribute("class", "drag-item");
          task_list.setAttribute("draggable", "true");

          task_container = create_task_container(i, task_key, user.uid);

          task_details_imp = create_task_detail_card(
            i,
            task_key,
            user.uid,
            task_date,
            task_title,
            task_time,
            task_description,
            null,
            "In-Progress"
          );

          // TASK DATA
          task_data = document.createElement("div");
          task_data.setAttribute("id", "task_data");

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
          tag.setAttribute("class", "tag progress"); //for now review tag
          tag.innerHTML = "progress";

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

          task_delete_button = document.createElement("button");
          task_delete_button.setAttribute("id", "task_delete_button");
          task_delete_button.setAttribute(
            "onclick",
            "task_delete(this.parentElement.parentElement)"
          );
          task_delete_button.innerHTML = "delete";
          fa_delete = document.createElement("i");
          fa_delete.setAttribute("class", "bi bi-trash-fill");

          /*** Appends Starts ***/

          progress_task_container.append(progress_task_listUl);
          progress_task_listUl.append(task_list);
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

          task_tool.append(task_delete_button);
          task_delete_button.append(fa_delete);
          task_list.append(task_details_imp);
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
        task_time = finished_task_array[i].time;
        task_description = finished_task_array[i].description;

        task_list = document.createElement("li");
        task_list.setAttribute("class", "draggable");
        task_list.setAttribute("draggable", "true");

        task_container = create_task_container(i, task_key, user.uid);

        task_details = create_finished_task_detail_card(
          i,
          task_key,
          user.uid,
          task_date,
          task_title,
          task_time,
          task_description
        );

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
        task_list.append(task_details);
      }
    });
  });
}

//Create Task_container

function create_task_container(idNumber, key, userUid) {
  task_container = document.createElement("div");
  task_container.setAttribute("class", "task_container");
  task_container.setAttribute("id", "task_container_modal");
  task_container.setAttribute("data-toggle", "modal");
  task_container.setAttribute("data-target", "#task_detail" + key);
  console.log(task_container.dataset.target);

  task_container.setAttribute("data-key", key);
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
function task_done(task) {
  date =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[1].childNodes[0].childNodes[0].innerHTML;

  var date_given = new Date(date);

  /*** Checking if task is for today or not ***/
  if (
    today.getDate() == date_given.getDate() &&
    today.getMonth() == date_given.getMonth() &&
    today.getFullYear() == date_given.getFullYear()
  ) {
    finished_task_container = document.getElementsByClassName(
      "completed-container"
    )[0];

    //task.childNodes[0].removeChild(task_tool);
    finished_task_container.append(task);
  } else {
    finished_upTask_container = document.getElementsByClassName(
      "upcomingCompleted-container"
    )[0];
    //task.childNodes[0].removeChild(task_tool);
    finished_upTask_container.append(task);
  }

  var key = task.childNodes[0].getAttribute("data-key");
  var user_uid = task.childNodes[0].getAttribute("user-uid");
  console.log(task);

  title =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
      .innerHTML;

  time =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[1].childNodes[1].childNodes[0].childNodes[0].innerHTML;
  console.log(time);

  description =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[3].childNodes[0].innerHTML;
  console.log(description);

  var task_obj = {
    key: key,
    title: title,
    date: date,
    time: time,
    description: description,
  };

  var updates = {};
  updates["users/" + user_uid + "/finished_task/" + key] = task_obj;

  firebaseRef.update(updates);

  /** Close the modal manually **/
  document.getElementById("close_btn").click();
  location.reload();

  // delete our task from unfinished
  task_delete(task);

  if (
    today.getDate() == date_given.getDate() &&
    today.getMonth() == date_given.getMonth() &&
    today.getFullYear() == date_given.getFullYear()
  )
    create_finished_task();
  else create_upcoming_finished_task();
}

function task_edit(task) {
  console.log(task);

  taskKey = task.childNodes[0].childNodes[0].getAttribute("key");

  /** Close the modal manually **/
  //document.getElementById("close_btn").click();
  document.getElementById("task_detail" + taskKey).style.display = "none";

  /** Show the Edit Form */
  document.getElementById("editTaskModal").style.display = "block";

  // taskKey = task.childNodes[0].childNodes[0].getAttribute("key");
  title = task.childNodes[0].childNodes[0].innerHTML;
  date = task.childNodes[1].childNodes[0].childNodes[1].childNodes[0].innerText;
  description = task.childNodes[1].childNodes[0].childNodes[3].innerText;
  time =
    task.childNodes[1].childNodes[0].childNodes[1].childNodes[1].childNodes[1].innerText;

  edit_task = document.getElementById("edit-task");
  edit_task.setAttribute("value", title);

  edit_date = document.getElementById("edit-date");
  edit_date.setAttribute("value", date);

  edit_time = document.getElementById("edit-time");
  edit_time.value = time;

  edit_description = document.getElementById("edit-description");
  edit_description.value = description;

  var submitButton = document.getElementById("edit_btn");
  submitButton.addEventListener("click", get_Edited_Input, false);
}

/** edit database of user input */
function get_Edited_Input() {
  edit_task = document.getElementById("edit-task").value;
  edit_date = document.getElementById("edit-date");
  edit_time = document.getElementById("edit-time");
  edit_description = document.getElementById("edit-description");

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase
        .database()
        .ref("users/" + user.uid + "/unfinished_task/" + taskKey)
        .set({
          title: edit_task,
          key: taskKey,
          description: edit_description.value,
          date: edit_date.value,
          time: edit_time.value,
          tag_important: tagImportant,
          tag_progress: tagProgress,
        });

      create_unfinished_task();
      create_upcoming_unfinished_task();
      create_important_task();
      create_upcoming_important_task();
      create_inProgress_task();
      create_upcoming_inProgress_task();
    }
  });
}

function task_archive(task) {
  date =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[1].childNodes[0].childNodes[0].innerHTML;

  var date_given = new Date(date);

  var key = task.childNodes[0].getAttribute("data-key");
  var user_uid = task.childNodes[0].getAttribute("user-uid");

  title =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
      .innerHTML;

  time =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[1].childNodes[1].childNodes[1].innerHTML;

  description =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[3].childNodes[0].innerHTML;

  var task_obj = {
    key: key,
    title: title,
    date: date,
    time: time,
    description: description,
  };

  var updates = {};
  updates["users/" + user_uid + "/archived_task/unfinished/" + key] = task_obj;

  firebaseRef.update(updates);

  // delete our task from unfinished

  /** Close the modal manually **/
  document.getElementById("close_btn").click();
  location.reload();

  task_to_remove = firebase
    .database()
    .ref("users/" + user_uid + "/unfinished_task/" + key);

  task_to_remove.remove();
  task.remove();
  location.reload();
}

function task_finished_archive(task) {
  date =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[1].childNodes[0].childNodes[0].innerHTML;

  var date_given = new Date(date);

  var key = task.childNodes[0].getAttribute("data-key");
  var user_uid = task.childNodes[0].getAttribute("user-uid");

  title =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
      .innerHTML;

  time =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[1].childNodes[1].childNodes[1].innerHTML;

  description =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[3].childNodes[0].innerHTML;

  var task_obj = {
    key: key,
    title: title,
    date: date,
    time: time,
    description: description,
  };

  var updates = {};
  updates["users/" + user_uid + "/archived_task/finished/" + key] = task_obj;

  firebaseRef.update(updates);

  // delete our task from unfinished

  /** Close the modal manually **/
  document.getElementById("close_btn_completed").click();
  location.reload();

  task_to_remove = firebase
    .database()
    .ref("users/" + user_uid + "/finished_task/" + key);

  task_to_remove.remove();
  task.remove();
}

function task_delete(task) {
  console.log(task);
  var key = task.childNodes[0].getAttribute("data-key");
  var user_uid = task.childNodes[0].getAttribute("user-uid");

  task_to_remove = firebase
    .database()
    .ref("users/" + user_uid + "/unfinished_task/" + key);

  title =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
      .innerHTML;
  date =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[1].childNodes[0].childNodes[0].innerHTML;

  time =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[1].childNodes[1].childNodes[0].childNodes[0].innerHTML;

  description =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[3].childNodes[0].innerHTML;

  var task_obj = {
    key: key,
    title: title,
    date: date,
    time: time,
    description: description,
  };

  var updates = {};
  updates["users/" + user_uid + "/Trash/" + key] = task_obj;
  firebaseRef.update(updates);

  /** Close the modal manually **/
  document.getElementById("close_btn").click();
  location.reload();
  /** remove task from database **/
  task_to_remove.remove();

  // remove from html view or whateversss
  task.remove();
}

function task_finished_delete(task) {
  var key = task.childNodes[0].getAttribute("data-key");
  var user_uid = task.childNodes[0].getAttribute("user-uid");

  task_to_remove = firebase
    .database()
    .ref("users/" + user_uid + "/finished_task/" + key);

  title =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
      .innerHTML;
  date =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[1].childNodes[0].childNodes[0].innerHTML;

  time =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[1].childNodes[1].childNodes[0].innerHTML;
  console.log(time);

  description =
    task.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0]
      .childNodes[3].childNodes[0].innerHTML;

  var task_obj = {
    key: key,
    title: title,
    date: date,
    time: time,
    description: description,
  };

  var updates = {};
  updates["users/" + user_uid + "/Trash/" + key] = task_obj;
  firebaseRef.update(updates);

  /** Close the modal manually **/
  document.getElementById("close_btn_completed").click();
  location.reload();

  task_to_remove.remove();

  // remove from html view or whateversss
  task.remove();
}

function create_upcoming_unfinished_task() {
  unfinished_upTask_container =
    document.getElementsByClassName("up-all-container")[0];
  unfinished_upTask_container.innerHTML = "";
  var taskArrayUpcoming = [];
  var tag_Imp_up, tag_Progress_up;
  upcomingTask_listUl = document.createElement("ul");
  upcomingTask_listUl.setAttribute("class", "task-list");

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
          var date_given = new Date(childSnapshot.val().date);

          /*** Checking if task is for today or not ***/

          if (
            today.getDate() < date_given.getDate() &&
            today.getMonth() <= date_given.getMonth() &&
            today.getFullYear() <= date_given.getFullYear()
          )
            taskArrayUpcoming.push(childSnapshot.val());
        });
        for (var i, i = 0; i < taskArrayUpcoming.length; i++) {
          task_date = taskArrayUpcoming[i].date;
          task_key = taskArrayUpcoming[i].key;
          task_title = taskArrayUpcoming[i].title;
          task_time = taskArrayUpcoming[i].time;
          task_description = taskArrayUpcoming[i].description;
          tag_Imp_up = taskArrayUpcoming[i].tag_important;
          tag_Progress_up = taskArrayUpcoming[i].tag_progress;
          console.log(task_title);

          task_list = document.createElement("li");
          task_list.setAttribute("class", "draggable");
          task_list.setAttribute("draggable", "true");

          task_container = create_task_container(i, task_key, user.uid);

          task_details_up_unfinished = create_task_detail_card(
            i,
            task_key,
            user.uid,
            task_date,
            task_title,
            task_time,
            task_description,
            tag_Imp_up,
            tag_Progress_up
          );

          // TASK DATA
          task_data = document.createElement("div");
          task_data.setAttribute("id", "task_data");

          title = create_title(task_title);

          date = document.createElement("p");
          date.setAttribute("id", "task_date");
          date.setAttribute("contenteditable", false);
          date.innerHTML = task_date;

          tagImp = document.createElement("span");
          tagImp.setAttribute("class", "tag review"); //for now review tag
          tagImp.innerHTML = "important";

          tagProgress = document.createElement("span");
          tagProgress.setAttribute("class", "tag progress"); //for now review tag
          tagProgress.innerHTML = "progress";

          // TASK TOOLS
          task_tool = document.createElement("div");
          task_tool.setAttribute("id", "task_tool");

          task_done_button = document.createElement("button");
          task_done_button.setAttribute("id", "task_done_button");
          task_done_button.setAttribute(
            "onclick",
            "task_done(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)"
          );
          task_done_button.innerHTML = "done";
          fa_done = document.createElement("i");
          fa_done.setAttribute("class", "bi bi-check-lg");

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
          if (tag_Imp_up) {
            task_data.append(tagImp);
          }

          if (tag_Progress_up) {
            task_data.append(tagProgress);
          }

          task_data.append(date);

          task_container.append(task_tool);

          task_tool.append(task_done_button);
          task_done_button.append(fa_done);

          task_tool.append(task_delete_button);
          task_delete_button.append(fa_delete);
          task_list.append(task_details_up_unfinished);
        }
      });
    }
  });
}

/****** Create Upcoming Important Tasks */

function create_upcoming_important_task() {
  imp_task_container_upcoming = document.getElementsByClassName(
    "upcomingImportant-container"
  )[0];

  imp_task_container_upcoming.innerHTML = "";
  var imp_taskArray_upcoming = [];
  imp_task_listUl_up = document.createElement("ul");
  imp_task_listUl_up.setAttribute("class", "task-list drag-list");
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
          var date_given = new Date(childSnapshot.val().date);

          /** Checking if the task has Important Tag and If Task is Today's**/

          if (
            childSnapshot.val().tag_important &&
            today.getDate() < date_given.getDate() &&
            today.getMonth() <= date_given.getMonth() &&
            today.getFullYear() <= date_given.getFullYear()
          ) {
            imp_taskArray_upcoming.push(childSnapshot.val());
          }
        });

        for (var i, i = 0; i < imp_taskArray_upcoming.length; i++) {
          task_date = imp_taskArray_upcoming[i].date;
          task_key = imp_taskArray_upcoming[i].key;
          task_title = imp_taskArray_upcoming[i].title;
          task_time = imp_taskArray_upcoming[i].time;
          task_description = imp_taskArray_upcoming[i].description;

          task_list = document.createElement("li");
          task_list.setAttribute("class", "drag-item");
          task_list.setAttribute("draggable", "true");

          task_container = create_task_container(i, task_key, user.uid);

          task_details = create_task_detail_card(
            i,
            task_key,
            user.uid,
            task_date,
            task_title,
            task_time,
            task_description
          );

          // TASK DATA
          task_data = document.createElement("div");
          task_data.setAttribute("id", "task_data");

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

          task_delete_button = document.createElement("button");
          task_delete_button.setAttribute("id", "task_delete_button");
          task_delete_button.setAttribute(
            "onclick",
            "task_delete(this.parentElement.parentElement)"
          );
          task_delete_button.innerHTML = "delete";
          fa_delete = document.createElement("i");
          fa_delete.setAttribute("class", "bi bi-trash-fill");

          /*** Appends Starts ***/

          imp_task_container_upcoming.append(imp_task_listUl_up);
          imp_task_listUl_up.append(task_list);
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

          task_tool.append(task_delete_button);
          task_delete_button.append(fa_delete);
        }
      });
    }
  });
}

/** Create Upcoming In-Progress Task */
function create_upcoming_inProgress_task() {
  progress_task_container_upcoming = document.getElementsByClassName(
    "upcomingInprogress-container"
  )[0];

  progress_task_container_upcoming.innerHTML = "";
  var progress_taskArray_upcoming = [];
  progress_task_listUl_up = document.createElement("ul");
  progress_task_listUl_up.setAttribute("class", "task-list drag-list");
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
          var date_given = new Date(childSnapshot.val().date);

          /** Checking if the task has In-Progress Tag and If Task is Today's**/

          if (
            childSnapshot.val().tag_progress &&
            today.getDate() < date_given.getDate() &&
            today.getMonth() <= date_given.getMonth() &&
            today.getFullYear() <= date_given.getFullYear()
          ) {
            progress_taskArray_upcoming.push(childSnapshot.val());
          }
        });

        for (var i, i = 0; i < progress_taskArray_upcoming.length; i++) {
          task_date = progress_taskArray_upcoming[i].date;
          task_key = progress_taskArray_upcoming[i].key;
          task_title = progress_taskArray_upcoming[i].title;
          task_time = progress_taskArray_upcoming[i].time;
          task_description = progress_taskArray_upcoming[i].description;

          task_list = document.createElement("li");
          task_list.setAttribute("class", "drag-item");
          task_list.setAttribute("draggable", "true");

          task_container = create_task_container(i, task_key, user.uid);

          task_details = create_task_detail_card(
            i,
            task_key,
            user.uid,
            task_date,
            task_title,
            task_time,
            task_description
          );

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
          time.setAttribute("style", "display:none;");
          time.innerHTML = task_time;

          tag = document.createElement("span");
          tag.setAttribute("class", "tag progress"); //for now review tag
          tag.innerHTML = "progress";

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

          task_delete_button = document.createElement("button");
          task_delete_button.setAttribute("id", "task_delete_button");
          task_delete_button.setAttribute(
            "onclick",
            "task_delete(this.parentElement.parentElement)"
          );
          task_delete_button.innerHTML = "delete";
          fa_delete = document.createElement("i");
          fa_delete.setAttribute("class", "bi bi-trash-fill");

          /*** Appends Starts ***/

          progress_task_container_upcoming.append(progress_task_listUl_up);
          progress_task_listUl_up.append(task_list);
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
      .ref("users/" + user.uid + "/finished_task/")
      .orderByChild("date");

    user = firebase.auth().currentUser;
    // Retrieve new tasks as they are added to our database
    firebaseRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var childkey = childSnapshot.key;
        var date_given = new Date(childSnapshot.val().date);

        /*** Checking if task is for today or not ***/
        if (
          today.getDate() < date_given.getDate() &&
          today.getMonth() <= date_given.getMonth() &&
          today.getFullYear() <= date_given.getFullYear()
        )
          finished_upcomingTask_array.push(childSnapshot.val());
      });

      for (var i, i = 0; i < finished_upcomingTask_array.length; i++) {
        task_date = finished_upcomingTask_array[i].date;
        task_key = finished_upcomingTask_array[i].key;
        task_title = finished_upcomingTask_array[i].title;
        task_time = finished_upcomingTask_array[i].time;
        task_description = finished_upcomingTask_array[i].description;

        task_list = document.createElement("li");
        task_list.setAttribute("class", "draggable");
        task_list.setAttribute("draggable", "true");

        task_container = create_task_container(i, task_key, user.uid);

        task_details = create_finished_task_detail_card(
          i,
          task_key,
          user.uid,
          task_date,
          task_title,
          task_time,
          task_description
        );

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
        task_list.append(task_details);
      }
    });
  });
}

$(".select2").on("select2:select", function (e) {
  var select_val = $(e.currentTarget).val();
  console.log(select_val);

  select_val.forEach(function (item) {
    if (item == "Important") tagImportant = "Important";
    if (item == "In-Progress") tagProgress = "In-Progress";
  });
});

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
        tag_important: tagImportant,
        tag_progress: tagProgress,
      };
      var updates = {};
      updates["users/" + user.uid + "/unfinished_task/" + key] = task;
      firebaseRef.update(updates);
      create_unfinished_task();
      create_upcoming_unfinished_task();
      create_important_task();
      create_upcoming_important_task();
      create_inProgress_task();
      create_upcoming_inProgress_task();
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
        window.location.replace("/index.html");
      }, 1000);
    })
    .catch((error) => {
      //An error happened.
      var errorMessage = error.message;
      window.alert(errorMessage);
    });
}

/******************** Open Task Detail Card ****************/

function create_task_detail_card(
  idNumber,
  key,
  userUid,
  date,
  title,
  time,
  description,
  impTag,
  progressTag
) {
  task_card = document.createElement("div");

  let idNum = idNumber;

  task_card.setAttribute("class", "modal fade task-detail");
  task_card.setAttribute("id", "task_detail");
  task_card.id = "task_detail";
  task_card.id += key;

  task_card.setAttribute("tabindex", "-1");
  task_card.setAttribute("role", "dialog");
  task_card.setAttribute("aria-hidden", "true");
  // console.log("show task card");

  task_card_center = document.createElement("div");
  task_card_center.className =
    "modal-dialog modal-dialog-centered modal-dialog-lg task-modal-card";

  task_card_content = document.createElement("div");
  task_card_content.className = "modal-content ";

  task_header = document.createElement("div");
  task_header.setAttribute("class", "card-header modal-header");

  task_close = document.createElement("button");
  task_close.setAttribute("class", "close task-detail-close-button");
  task_close.setAttribute("id", "close_btn");
  task_close.setAttribute("type", "button");
  task_close.setAttribute("data-dismiss", "modal");
  task_close.setAttribute("aria-label", "Close");

  //task_close.setAttribute("href", "#");
  //task_close.setAttribute("onclick", "closeTaskDetail()");

  task_close_icon = document.createElement("i");
  task_close_icon.setAttribute("class", "bi bi-x-lg");

  task_title_detail = document.createElement("h3");
  task_title_detail.setAttribute("class", "task-title-detail modal-title");
  task_title_detail.setAttribute("key", key);
  task_title_detail.innerHTML = title;
  // console.log(key);

  task_header_right = document.createElement("div");
  task_header_right.setAttribute("class", "task-detail-action-right");

  option_buttons = document.createElement("div");
  option_buttons.setAttribute("class", "option_btns");

  task_complete_btn = document.createElement("button");
  task_complete_btn.setAttribute("class", "btn btn-success done-btn");
  task_complete_btn.innerHTML = "Completed";
  task_complete_btn.setAttribute(
    "onclick",
    "task_done(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)"
  );

  task_complete_icon = document.createElement("i");
  task_complete_icon.setAttribute("class", "bi bi-check2");

  task_edit_btn = document.createElement("button");
  task_edit_btn.setAttribute("class", "btn btn-outline-primary ml-2");
  task_edit_btn.setAttribute(
    "onclick",
    "task_edit(this.parentElement.parentElement.parentElement.parentElement.parentElement, this)"
  );

  task_edit_icon = document.createElement("i");
  task_edit_icon.setAttribute("class", "bi bi-pen");

  task_delete_btn = document.createElement("button");
  task_delete_btn.setAttribute(
    "class",
    "btn btn-outline-danger ml-2 delete_btn"
  );
  task_delete_btn.setAttribute(
    "onclick",
    "task_delete(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)"
  );

  task_delete_icon = document.createElement("i");
  task_delete_icon.setAttribute("class", "bi bi-trash");

  task_archive_btn = document.createElement("button");
  task_archive_btn.setAttribute(
    "class",
    "btn btn-outline-info ml-2 dropdown-archive"
  );
  task_archive_btn.setAttribute("id", "dropdown_archive");
  task_archive_btn.setAttribute(
    "onclick",
    "task_archive(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)"
  );

  task_archive_icon = document.createElement("i");
  task_archive_icon.setAttribute("class", "bi bi-journal-arrow-down");

  task_description_detail = document.createElement("div");
  task_description_detail.setAttribute("class", "task-detail-description");
  // task_description_detail.setAttribute("tabindex", "9");

  task_description_card = document.createElement("div");
  task_description_card.setAttribute("class", "modal-body");

  date_tag_div = document.createElement("div");
  date_tag_div.setAttribute(
    "class",
    "d-flex align-items-center p-l-r-0 m-b-20 date-tag-div"
  );

  task_date_detail = document.createElement("div");
  task_date_detail.setAttribute("class", "task-detail-date");

  task_date_show = document.createElement("p");
  task_date_show.style = "width: 100px";
  task_date_show.innerHTML = date;

  left_tag_time = document.createElement("div");
  left_tag_time.setAttribute("class", "ml-auto");

  tag_span = document.createElement("span");
  tag_span.setAttribute("class", "badge bg-warning badge-pill mr-2");
  tag_span.innerHTML = "Important";

  tag_span_progress = document.createElement("span");
  tag_span_progress.setAttribute("class", "badge bg-info badge-pill mr-2");
  tag_span_progress.innerHTML = "In-Progress";

  time_tag = document.createElement("div");
  time_span = document.createElement("span");
  time_span.setAttribute("class", "text-muted task-time-show");
  time_span.innerHTML = time;

  task_description_show = document.createElement("div");
  task_description_show.setAttribute("class", "task-description-show");

  task_description_span = document.createElement("span");
  task_description_span.innerHTML = description;

  horizontalLine = document.createElement("hr");
  horizontalLine.setAttribute("class", "m-0");

  /***************** Append Start *********************/

  task_card.append(task_card_center);
  task_card_center.append(task_card_content);
  task_card_content.append(task_header);
  task_card_content.append(task_description_detail);
  task_description_detail.append(task_description_card);

  task_header.append(task_title_detail);

  //task_card_content.append(task_close);
  task_header.appendChild(task_close);

  task_close.append(task_close_icon);

  task_description_card.append(task_header_right);
  task_header_right.append(option_buttons);

  option_buttons.append(task_complete_btn);
  task_complete_btn.append(task_complete_icon);

  option_buttons.append(task_edit_btn);
  task_edit_btn.append(task_edit_icon);

  option_buttons.append(task_delete_btn);
  task_delete_btn.append(task_delete_icon);

  option_buttons.append(task_archive_btn);
  task_archive_btn.append(task_archive_icon);
  /**  end card header div **/

  task_description_card.append(date_tag_div);
  date_tag_div.append(task_date_detail);
  task_date_detail.append(task_date_show);

  date_tag_div.append(left_tag_time);
  left_tag_time.append(time_tag);
  time_tag.append(time_span);

  if (impTag == "Important") left_tag_time.append(tag_span);

  if (progressTag == "In-Progress") left_tag_time.append(tag_span_progress);

  task_description_card.append(horizontalLine);

  task_description_card.append(task_description_show);
  task_description_show.append(task_description_span);

  //console.log(task_card);

  return task_card;
}

function create_finished_task_detail_card(
  idNumber,
  key,
  userUid,
  date,
  title,
  time,
  description
) {
  task_card = document.createElement("div");

  let idNum = idNumber;

  task_card.setAttribute("class", "modal fade task-detail");
  task_card.setAttribute("id", "task_detail");
  task_card.id = "task_detail";
  task_card.id += key;

  task_card.setAttribute("tabindex", "-1");
  task_card.setAttribute("role", "dialog");
  task_card.setAttribute("aria-hidden", "true");
  // console.log("show task card");

  task_card_center = document.createElement("div");
  task_card_center.className = "modal-dialog modal-dialog-centered";

  task_card_content = document.createElement("div");
  task_card_content.className = "modal-content";

  task_header = document.createElement("div");
  task_header.setAttribute("class", "card-header modal-header");

  task_close = document.createElement("button");
  task_close.setAttribute("class", "close task-detail-close-button");
  task_close.setAttribute("id", "close_btn_completed");
  task_close.setAttribute("type", "button");
  task_close.setAttribute("data-dismiss", "modal");
  task_close.setAttribute("aria-label", "Close");

  //task_close.setAttribute("href", "#");
  //task_close.setAttribute("onclick", "closeTaskDetail()");

  task_close_icon = document.createElement("i");
  task_close_icon.setAttribute("class", "bi bi-x-lg");

  task_title_detail = document.createElement("h3");
  task_title_detail.setAttribute("class", "task-title-detail modal-title");
  task_title_detail.setAttribute("key", key);
  task_title_detail.innerHTML = title;
  // console.log(key);

  task_header_right = document.createElement("div");
  task_header_right.setAttribute("class", "task-detail-action-right");

  option_buttons = document.createElement("div");
  option_buttons.setAttribute("class", "option_btns");

  task_delete_btn = document.createElement("button");
  task_delete_btn.setAttribute(
    "class",
    "btn btn-outline-primary ml-2 delete_btn"
  );
  task_delete_btn.setAttribute(
    "onclick",
    "task_finished_delete(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)"
  );

  task_delete_icon = document.createElement("i");
  task_delete_icon.setAttribute("class", "bi bi-trash");

  task_archive_btn = document.createElement("button");
  task_archive_btn.setAttribute(
    "class",
    "btn btn-outline-primary ml-2 dropdown-archive"
  );
  task_archive_btn.setAttribute("id", "dropdown_archive");
  task_archive_btn.setAttribute(
    "onclick",
    "task_finished_archive(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)"
  );

  task_archive_icon = document.createElement("i");
  task_archive_icon.setAttribute("class", "bi bi-journal-arrow-down");

  task_description_detail = document.createElement("div");
  task_description_detail.setAttribute("class", "task-detail-description");
  // task_description_detail.setAttribute("tabindex", "9");

  task_description_card = document.createElement("div");
  task_description_card.setAttribute("class", "modal-body");

  date_tag_div = document.createElement("div");
  date_tag_div.setAttribute(
    "class",
    "d-flex align-items-center p-l-r-0 m-b-20 date-tag-div"
  );

  task_date_detail = document.createElement("div");
  task_date_detail.setAttribute("class", "task-detail-date");

  task_date_show = document.createElement("p");
  task_date_show.innerHTML = date;

  left_tag_time = document.createElement("div");
  left_tag_time.setAttribute("class", "ml-auto");

  time_span = document.createElement("span");
  time_span.setAttribute("class", "text-muted task-time-show");
  time_span.innerHTML = time;

  task_description_show = document.createElement("div");
  task_description_show.setAttribute("class", "task-description-show");

  task_description_span = document.createElement("span");
  task_description_span.innerHTML = description;

  horizontalLine = document.createElement("hr");
  horizontalLine.setAttribute("class", "m-0");

  /***************** Append Start *********************/

  task_card.append(task_card_center);
  task_card_center.append(task_card_content);
  task_card_content.append(task_header);
  task_card_content.append(task_description_detail);
  task_description_detail.append(task_description_card);

  task_header.append(task_title_detail);

  //task_card_content.append(task_close);
  task_header.appendChild(task_close);

  task_close.append(task_close_icon);

  task_description_card.append(task_header_right);
  task_header_right.append(option_buttons);

  option_buttons.append(task_delete_btn);
  task_delete_btn.append(task_delete_icon);

  option_buttons.append(task_archive_btn);
  task_archive_btn.append(task_archive_icon);
  /**  end card header div **/

  task_description_card.append(date_tag_div);
  date_tag_div.append(task_date_detail);
  task_date_detail.append(task_date_show);

  date_tag_div.append(left_tag_time);
  left_tag_time.append(time_span);

  task_description_card.append(horizontalLine);

  task_description_card.append(task_description_show);
  task_description_show.append(task_description_span);

  //console.log(task_card);

  return task_card;
}

// $("body")
//   .on("click", ".task_container", function (e) {
//     $(".modal-background, .task-detail").show();
//     e.preventDefault();
//   })
//   .on("click", ".task-detail-close-button", function (e) {
//     $(".modal-background, .task-detail").hide();
//     e.preventDefault();
//   });

// if (!$(".modal-background.task-detail-close-button").length) {
//   $("<div/>")
//     .addClass("modal-background task-detail-close-button")
//     .appendTo("body");
// }

/**********************************************************/

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


/** tasklist js */

var taskArrayTitle = [];


firebase.auth().onAuthStateChanged(function (user) {
  var firebaseRef = firebase.database().ref("users/" + user.uid + "/unfinished_task/").orderByChild("time"); // need for all task
  if (user) {
    user = firebase.auth().currentUser;
    // Retrieve new tasks as they are added to our database
    firebaseRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var childkey = childSnapshot.key;

        taskArrayTitle.push(childSnapshot.val().title);
      
        

        

      });

  });

}

});



/** Searchbar Js */
// getting all required elements
const searchWrapper = document.querySelector(".search-input");
const SearchinputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
const searchicon = searchWrapper.querySelector(".searchicon");
let linkTag = searchWrapper.querySelector("a");
let webLink;

// if user press any key and release
SearchinputBox.onkeyup = (e) => {
  let userData = e.target.value; //user enetered data
  let emptyArray = [];
  if (userData) {
    // searchicon.onclick = () => {
    //   webLink = `https://www.google.com/search?q=${userData}`;
    //   linkTag.setAttribute("href", webLink);
    //   linkTag.click();
    // };
    emptyArray = taskArrayTitle.filter((data) => {
      //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
      return data
        ?.toLocaleLowerCase()
        .startsWith(userData?.toLocaleLowerCase());
    });
    emptyArray = emptyArray.map((data) => {
      // passing return data inside li tag
      return (data = `<a><li>${data}</li></a>`);
    });
    searchWrapper.classList.add("active"); //show autocomplete box
    showSuggestions(emptyArray);
    let allList = suggBox.querySelectorAll("a");
    for (let i = 0; i < allList.length; i++) {
      //adding onclick attribute in all li tag

      task_string = "cardId" + taskID[i];
      console.log(task_string);
      allList[i].setAttribute("href", "alltask.html#" + task_string);
      //allList[i].task_id += ;

      //allList[i].setAttribute("onclick", "OpenModal(this)");

      console.log(allList[i]);
      console.log(taskID[i]);
    }
    // } else if (document.getElementById("searchbox-home").hasFocus() == false) {
    //   searchWrapper.classList.remove("active"); //hide autocomplete box
  } else searchWrapper.classList.remove("active"); //hide autocomplete box
};

function select(element) {
  let selectData = element.textContent;
  SearchinputBox.value = selectData;
  // searchicon.onclick = () => {
  //   webLink = `https://www.google.com/search?q=${selectData}`;
  //   linkTag.setAttribute("href", webLink);
  //   linkTag.click();
  // };
  searchWrapper.classList.remove("active");
}

function showSuggestions(list) {
  let listData;
  if (!list.length) {
    userValue = SearchinputBox.value;
    listData = `<li>${userValue}</li>`;
  } else {
    listData = list.join("");
  }
  suggBox.innerHTML = listData;
}


