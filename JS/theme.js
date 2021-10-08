function swapStyleSheet(sheet) {
    document.getElementById("pagestyle").setAttribute("href", sheet);  
  }
  
  if (window.localStorage.getItem("theme") === "pitch-dark") {
    swapStyleSheet("https://bootswatch.com/4/slate/bootstrap.min.css");
  }
  if (window.localStorage.getItem("theme") === "classic") {
    swapStyleSheet("https://bootswatch.com/4/lux/bootstrap.min.css");
  }
  if (window.localStorage.getItem("theme") === "nature") {
    document.querySelector("body").style.background = "#FFFBE6";
    swapStyleSheet("https://bootswatch.com/4/minty/bootstrap.min.css");
  }
  if (localStorage.getItem("theme") === "midnight") {
    swapStyleSheet("https://bootswatch.com/4/superhero/bootstrap.min.css");
  }