
var radios = document.querySelectorAll('input[type=radio][name="themeButton"]');

function changeHandler() {
    console.log("theme");
   if ( this.value === 'nature' ) {
     console.log('value', 'nature');
    
     swapStyleSheet("https://bootswatch.com/4/minty/bootstrap.min.css");
     localStorage.setItem("theme", "nature");
     
   } else if ( this.value === 'midnight' ) {
    swapStyleSheet("https://bootswatch.com/4/superhero/bootstrap.min.css");
    localStorage.setItem("theme", "midnight");
    
   } else if ( this.value === 'beige' ) {
    swapStyleSheet("https://bootswatch.com/4/journal/bootstrap.min.css");
    //document.querySelector("body").style.background = "beige";
    window.localStorage.setItem("theme", "beige");
   } else {
  
    window.localStorage.setItem("theme", "classic");
    swapStyleSheet("https://bootswatch.com/4/lux/bootstrap.min.css");
   }  
}

Array.prototype.forEach.call(radios, function(radio) {
   radio.addEventListener('change', changeHandler);
});

function swapStyleSheet(sheet) {
    document.getElementById("pagestyle").setAttribute("href", sheet);  
}

if (window.localStorage.getItem("theme") === "beige") {
    document.getElementById("radios4").checked = true;
    swapStyleSheet("https://bootswatch.com/4/journal/bootstrap.min.css");
}
if (window.localStorage.getItem("theme") === "classic") {
    document.getElementById("radios1").checked = true;
    swapStyleSheet("https://bootswatch.com/4/lux/bootstrap.min.css");
}
if (window.localStorage.getItem("theme") === "nature") {
    document.getElementById("radios2").checked = true;
    swapStyleSheet("https://bootswatch.com/4/minty/bootstrap.min.css");
}
if (localStorage.getItem("theme") === "midnight") {
    document.getElementById("radios3").checked = true;
    swapStyleSheet("https://bootswatch.com/4/superhero/bootstrap.min.css");
}
