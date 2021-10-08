
const body = document.body;
const menuLinks = document.querySelectorAll(".admin-menu a");
const collapseBtn = document.querySelector(".admin-menu .collapse-btn");
const toggleMobileMenu = document.querySelector(".toggle-mob-menu");
const switchInput = document.querySelector(".switch input");
const switchLabel = document.querySelector(".switch label");
const switchLabelText = switchLabel.querySelector("span:last-child");
const collapsedClass = "collapsed";
const lightModeClass = "light-mode";

/*TOGGLE HEADER STATE*/
collapseBtn.addEventListener("click", function () {
  body.classList.toggle(collapsedClass);
  this.getAttribute("aria-expanded") == "true"
    ? this.setAttribute("aria-expanded", "false")
    : this.setAttribute("aria-expanded", "true");
  this.getAttribute("aria-label") == "collapse menu"
    ? this.setAttribute("aria-label", "expand menu")
    : this.setAttribute("aria-label", "collapse menu");
});

/*TOGGLE MOBILE MENU*/
toggleMobileMenu.addEventListener("click", function () {
  body.classList.toggle("mob-menu-opened");
  this.getAttribute("aria-expanded") == "true"
    ? this.setAttribute("aria-expanded", "false")
    : this.setAttribute("aria-expanded", "true");
  this.getAttribute("aria-label") == "open menu"
    ? this.setAttribute("aria-label", "close menu")
    : this.setAttribute("aria-label", "open menu");
});

/*SHOW TOOLTIP ON MENU LINK HOVER*/
for (const link of menuLinks) {
  link.addEventListener("mouseenter", function () {
    if (
      body.classList.contains(collapsedClass) &&
      window.matchMedia("(min-width: 768px)").matches
    ) {
      const tooltip = this.querySelector("span").textContent;
      this.setAttribute("title", tooltip);
    } else {
      this.removeAttribute("title");
    }
  });
}

/*TOGGLE LIGHT/DARK MODE*/


/****** Add task form ******/
function openAddForm() {
  document.getElementById("popupForm").style.display = "block";

  /** Minimum Date picker */
  document.getElementById("input_date").setAttribute("min", today_string);
  document.getElementById("input_date").setAttribute("value", today_string);

  console.log(today_string);

  /** Minimum Time picker */
  time = document.getElementById("input_time");
  time.setAttribute(
    "value",
    String(today.getHours() + ":" + today.getMinutes())
  );
  console.log(today.getHours() + ":" + today.getMinutes());
}

function closeAddForm() {
  document.getElementById("popupForm").style.display = "none";
}

function closeAddForm_edit() {
  document.getElementById("editTaskModal").style.display = "none";
  location.reload();
}

/****Today's task radio button nav ****/
var currentState = $(".all-container");
$("input[type=radio][name=nav]").on("change", function () {
  currentState.hide();
  currentState = $("." + $("input[type='radio'][name=nav]:checked").val());
  currentState.show();
});

/****Upcoming task radio button nav ****/
var currentStateForUpcoming = $(".up-all-container");
$("input[type=radio][name=nav-upcoming]").on("change", function () {
  currentStateForUpcoming.hide();
  currentStateForUpcoming = $(
    "." + $("input[type='radio'][name=nav-upcoming]:checked").val()
  );
  currentStateForUpcoming.show();
});

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

// var tag_opt = $("#select_tag").find(":selected");
// console.log(tag_opt);
