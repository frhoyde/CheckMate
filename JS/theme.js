const natureMode = "natureMode";
const pitchMode = "pitchMode";
const classicMode = "classicMode";
const midnightMode = "midnightMode";
const html = document.documentElement;

function swapStyleSheet(sheet) {
    document.getElementById("pagestyle").setAttribute("href", sheet);  
  }
  
  if (window.localStorage.getItem("theme") === "pitch-dark") {
    html.classList.add(pitchMode);
    swapStyleSheet("https://bootswatch.com/4/slate/bootstrap.min.css");
  }
  if (window.localStorage.getItem("theme") === "classic") {
    html.classList.add(classicMode);
    swapStyleSheet("https://bootswatch.com/4/lux/bootstrap.min.css");
  }
  if (window.localStorage.getItem("theme") === "nature") {
    document.querySelector("body").style.background = "#FFFBE6";
    html.classList.add(natureMode);
    swapStyleSheet("https://bootswatch.com/4/minty/bootstrap.min.css");
  }
  if (localStorage.getItem("theme") === "midnight") {
   // document.querySelector("span", "text-primary");
   html.classList.add(midnightMode);
    swapStyleSheet("https://bootswatch.com/4/superhero/bootstrap.min.css");
  }
