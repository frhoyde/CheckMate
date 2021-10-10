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

var tagImportant = null;
var tagProgress = null;

function showUnfinishedTask() {
  var taskArray = [];
  show_unfinised_task_container =
    document.getElementsByClassName("row unfinished")[0];
  show_unfinised_task_container.innerHTML = "";
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
        for (var i, i = 0; i < taskArray.length; i++) {
          task_date = taskArray[i].date;
          task_key = taskArray[i].key;
          task_title = taskArray[i].title;
          task_description = taskArray[i].description;
          task_time = taskArray[i].time;
          console.log(task_title);

          // TASK DATA
          card_box = document.createElement("div");
          card_box.setAttribute("class", "col-lg-4");

          card_margin = document.createElement("div");
          card_margin.setAttribute("class", "card card-margin");

          card_margin.id = "cardId" + task_key;

          card_margin.setAttribute("title", task_title);
          card_margin.setAttribute("Tdate", task_date);
          card_margin.setAttribute("Ttime", task_time);
          card_margin.setAttribute("Tdescription", task_description);

          card_body = document.createElement("div");
          card_body.setAttribute("class", "card-body pt-0");

          main_text = document.createElement("div");
          main_text.setAttribute("class", "widget-49");

          title_wrapper = document.createElement("div");
          title_wrapper.setAttribute("class", "widget-49-title-wrapper");

          title_info = document.createElement("div");
          title_info.setAttribute("class", "widget-49-meeting-info");

          add_title = document.createElement("span");
          add_title.setAttribute("class", "widget-49-pro-title");
          add_title = create_title(task_title);

          add_title.setAttribute("data-key", task_key);
          add_title.setAttribute("user-uid", user.uid);

          title_time = document.createElement("span");
          title_time.setAttribute("class", "widget-49-meeting-time");

          title_time.innerHTML = task_time;

          date = document.createElement("div");
          date.setAttribute("class", "widget-49-date-primary dateBackground");
          //date.setAttribute("contenteditable", false);

          date_day = document.createElement("span");
          date_day.setAttribute("class", "widget-49-date-day");

          date_month = document.createElement("span");
          date_month.setAttribute("class", "widget-49-date-month");

          var date_given_month = new Date(task_date);
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          date_month.innerHTML = months[date_given_month.getMonth()];
          date_day.innerHTML = date_given_month.getDate();
          console.log(date_given_month.getDate());

          task_tool = document.createElement("div");
          task_tool.setAttribute("class", "dropdown-container");
          task_tool.setAttribute("tabindex", "-2");

          three_dot_button = document.createElement("div");
          three_dot_button.setAttribute("class", "three-dots");

          three_dot_dropdown = document.createElement("div");
          three_dot_dropdown.setAttribute("class", "dropdown");

          task_complete_btn = document.createElement("button");
          task_complete_btn.setAttribute(
            "class",
            "btn btn-outline-success btn-sm done-btn"
          );

          task_complete_btn.setAttribute(
            "onclick",
            "task_done(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)"
          );

          task_complete_icon = document.createElement("i");
          task_complete_icon.setAttribute("class", "bi bi-check2");

          task_edit_btn = document.createElement("button");
          task_edit_btn.setAttribute(
            "class",
            "btn btn-outline-primary btn-sm ml-2"
          );
          task_edit_btn.setAttribute(
            "onclick",
            "task_edit(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)"
          );

          task_edit_icon = document.createElement("i");
          task_edit_icon.setAttribute("class", "bi bi-pen");

          task_delete_btn = document.createElement("button");
          task_delete_btn.setAttribute(
            "class",
            "btn btn-outline-danger btn-sm ml-2"
          );
          task_delete_btn.setAttribute(
            "onclick",
            "task_delete(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement, 'unfinished_task')"
          );

          task_delete_icon = document.createElement("i");
          task_delete_icon.setAttribute("class", "bi bi-trash");

          description_div = document.createElement("div");
          description_div.setAttribute("class", "widget-49-meeting-item");

          description = document.createElement("span");
          description.setAttribute("class", "widget-49-meeting-item span");
          description.innerHTML = task_description;

          show_unfinised_task_container.append(card_box);
          card_box.append(card_margin);
          card_margin.append(card_body);
          card_body.append(main_text);
          main_text.append(title_wrapper);
          title_wrapper.append(date);
          date.append(date_day);
          date.append(date_month);
          main_text.append(title_info);
          title_info.append(add_title);
          title_info.append(title_time);
          title_wrapper.append(task_tool);

          task_tool.append(task_complete_btn);
          task_complete_btn.append(task_complete_icon);

          task_tool.append(task_edit_btn);
          task_edit_btn.append(task_edit_icon);

          task_tool.append(task_delete_btn);
          task_delete_btn.append(task_delete_icon);

          main_text.append(description_div);
          description_div.append(description);
        }
      });
    }
  });
}

function showCompletedTask() {
  var taskArray = [];
  show_completed_task_container =
    document.getElementsByClassName("row finished")[0];
  show_completed_task_container.innerHTML = "";
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
        for (var i, i = 0; i < taskArray.length; i++) {
          task_date = taskArray[i].date;
          task_key = taskArray[i].key;
          task_title = taskArray[i].title;
          task_description = taskArray[i].description;
          task_time = taskArray[i].time;
          console.log(task_title);

          // TASK DATA
          card_box = document.createElement("div");
          card_box.setAttribute("class", "col-lg-4");

          card_margin = document.createElement("div");
          card_margin.setAttribute("class", "card card-margin");

          card_margin.id = "cardId" + task_key;

          card_margin.setAttribute("title", task_title);
          card_margin.setAttribute("Tdate", task_date);
          card_margin.setAttribute("Ttime", task_time);
          card_margin.setAttribute("Tdescription", task_description);

          card_body = document.createElement("div");
          card_body.setAttribute("class", "card-body pt-0");

          main_text = document.createElement("div");
          main_text.setAttribute("class", "widget-49");

          title_wrapper = document.createElement("div");
          title_wrapper.setAttribute("class", "widget-49-title-wrapper");

          title_info = document.createElement("div");
          title_info.setAttribute("class", "widget-49-meeting-info");

          add_title = document.createElement("span");
          add_title.setAttribute("class", "widget-49-pro-title");
          add_title = create_title(task_title);

          add_title.setAttribute("data-key", task_key);
          add_title.setAttribute("user-uid", user.uid);

          title_time = document.createElement("span");
          title_time.setAttribute("class", "widget-49-meeting-time");

          title_time.innerHTML = task_time;

          date = document.createElement("div");
          date.setAttribute("class", "widget-49-date-primary dateBackground");
          //date.setAttribute("contenteditable", false);

          date_day = document.createElement("span");
          date_day.setAttribute("class", "widget-49-date-day");

          date_month = document.createElement("span");
          date_month.setAttribute("class", "widget-49-date-month");

          var date_given_month = new Date(task_date);
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          date_month.innerHTML = months[date_given_month.getMonth()];
          date_day.innerHTML = date_given_month.getDate();
          console.log(date_given_month.getDate());

          task_tool = document.createElement("div");
          task_tool.setAttribute("class", "dropdown-container");
          task_tool.setAttribute("tabindex", "-2");

          three_dot_delete = document.createElement("button");
          three_dot_delete.setAttribute(
            "class",
            "btn btn-outline-danger btn-sm ml-2"
          );
          //three_dot_delete.innerHTML = "delete";

          three_dot_delete_icon = document.createElement("i");
          three_dot_delete_icon.setAttribute("class", "bi bi-trash");

          three_dot_delete.setAttribute(
            "onclick",
            "task_delete(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement, 'finished_task')"
          );

          description_div = document.createElement("div");
          description_div.setAttribute("class", "widget-49-meeting-item");

          description = document.createElement("span");
          description.setAttribute("class", "widget-49-meeting-item span");
          description.innerHTML = task_description;

          show_completed_task_container.append(card_box);
          card_box.append(card_margin);
          card_margin.append(card_body);
          card_body.append(main_text);
          main_text.append(title_wrapper);
          title_wrapper.append(date);
          date.append(date_day);
          date.append(date_month);
          main_text.append(title_info);
          title_info.append(add_title);
          title_info.append(title_time);
          title_wrapper.append(task_tool);
          task_tool.append(three_dot_delete);
          three_dot_delete.append(three_dot_delete_icon);
          main_text.append(description_div);
          description_div.append(description);
        }
      });
    }
  });
}

function create_title(task_title) {
  title = document.createElement("span");
  title.setAttribute("id", "task_title");
  title.setAttribute("contenteditable", false);
  title.innerHTML = task_title;
  return title;
}

function task_done(task_parentDiv) {
  task =
    task_parentDiv.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      .childNodes[0];

  console.log(task);

  var key = task.getAttribute("data-key");
  var user_uid = task.getAttribute("user-uid");

  console.log(key, user_uid);

  unfinshed_task = firebase
    .database()
    .ref("users/" + user_uid + "/unfinished_task/" + key);

  completed_task = firebase
    .database()
    .ref("users/" + user_uid + "/finished_task/" + key);

  copyTask(unfinshed_task, completed_task);

  task_parentDiv.remove();

  showUnfinishedTask();
  showCompletedTask();
}

function closeAddForm_edit() {
  document.getElementById("editTaskModal").style.display = "none";
  location.reload();
}

function task_edit(task_parentDiv) {
  console.log(task_parentDiv);

  task = task_parentDiv.childNodes[0];
  console.log(task);

  /** Show the Edit Form */
  document.getElementById("editTaskModal").style.display = "block";

  taskKey = task.getAttribute("id").substring(6);
  console.log(taskKey);

  title = task.getAttribute("title");
  console.log(title);
  date = task.getAttribute("Tdate");
  description = task.getAttribute("Tdescription");
  time = task.getAttribute("Ttime");

  document.getElementById("edit-task").value = title;

  document.getElementById("edit-date").value = date;

  document.getElementById("edit-time").value = time;

  document.getElementById("edit-description").value = description;

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

      showUnfinishedTask();
      showCompletedTask();
    }
  });
}

function task_delete(task_parentDiv, tasktype) {
  console.log(task_parentDiv);
  task =
    task_parentDiv.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      .childNodes[0];

  console.log(task);

  var key = task.getAttribute("data-key");
  var user_uid = task.getAttribute("user-uid");

  task_to_remove = firebase
    .database()
    .ref("users/" + user_uid + "/" + tasktype + "/" + key);

  trash = firebase.database().ref("users/" + user_uid + "/Trash/" + key);

  copyTask(task_to_remove, trash);

  task_parentDiv.remove();
}

/*** copy to Trash in Firebase *****/
function copyTask(oldRef, newRef) {
  oldRef
    .once("value")
    .then((snap) => {
      return newRef.set(snap.val());
    })
    .then(() => {
      oldRef.set(null);
      console.log("Delete Done!");
    })
    .catch((err) => {
      console.log(err.message);
    });
}

/** Select2 For Tag */
$(".select2").select2({
  tags: true,
  maximumSelectionLength: 10,
  tokenSeparators: [",", " "],
  placeholder: "Select or type keywords",
  //minimumInputLength: 1,
  //ajax: {
  //   url: "you url to data",
  //   dataType: 'json',
  //  quietMillis: 250,
  //  data: function (term, page) {
  //     return {
  //         q: term, // search term
  //    };
  //  },
  //  results: function (data, page) {
  //  return { results: data.items };
  //   },
  //   cache: true
  // }
});

$(".select2").on("select2:select", function (e) {
  var select_val = $(e.currentTarget).val();
  console.log(select_val);

  select_val.forEach(function (item) {
    if (item == "Important") tagImportant = "Important";
    if (item == "In-Progress") tagProgress = "In-Progress";
  });
});



/** tasklist js */

var taskArrayTitle = [];
var taskID = [];

firebase.auth().onAuthStateChanged(function (user) {
  var firebaseRef = firebase
    .database()
    .ref("users/" + user.uid + "/all_task/")
    .orderByChild("time"); // need for all task
  if (user) {
    user = firebase.auth().currentUser;
    // Retrieve new tasks as they are added to our database
    firebaseRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var childkey = childSnapshot.key;

        taskArrayTitle.push(childSnapshot.val().title);
        taskID.push(childkey);
      });
    });
  }
});
/** Searchbar Js */
// getting all required elements
const searchWrapper = document.querySelector(".search-input");
const SearchinputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
// const searchicon = searchWrapper.querySelector(".searchicon");
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
    let allString = suggBox.querySelectorAll("li");

    function hrefAdder(TitleString) {
      for (let i = 0; i < taskArrayTitle.length; i++) {
        if (TitleString == taskArrayTitle[i]) {
          // console.log(i);
          return i;
        }
      }
    }

    for (let i = 0; i < allList.length; i++) {
      //adding onclick attribute in all li tag
      taskTitleString = allString[i].innerHTML;

      task_string = "cardId" + taskID[hrefAdder(taskTitleString)];
      console.log(task_string);
      allList[i].setAttribute("href", "alltask.html#" + task_string);
      //allList[i].task_id += ;

      //allList[i].setAttribute("onclick", "OpenModal(this)");

      // console.log(allList[i]);
      // console.log(taskID[i]);
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
    listData = `<li>No Tasks Found<li>`;
  } else {
    listData = list.join("");
  }
  suggBox.innerHTML = listData;
}
