
var radios = document.querySelectorAll('input[type=radio][name="themeButton"]');

function changeHandler() {
    console.log("theme");
   if ( this.value === 'nature' ) {
     console.log('value', 'nature');
     localStorage.setItem("theme", "nature");
     swapStyleSheet("https://bootswatch.com/4/minty/bootstrap.min.css");
     location.reload();
     
   } else if ( this.value === 'midnight' ) {
    localStorage.setItem("theme", "midnight");
    swapStyleSheet("https://bootswatch.com/4/superhero/bootstrap.min.css");
    location.reload();
    
   } else if ( this.value === 'pitch-dark' ) {
    window.localStorage.setItem("theme", "pitch-dark");
    swapStyleSheet("https://bootswatch.com/4/slate/bootstrap.min.css");
    location.reload();
   } else {
    location.reload();
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

if (window.localStorage.getItem("theme") === "pitch-dark") {
    document.getElementById("radios4").checked = true;
    swapStyleSheet("https://bootswatch.com/4/slate/bootstrap.min.css");
}
else if (window.localStorage.getItem("theme") === "nature") {
    document.querySelector("body").style.background = "#FFFBE6";
    document.getElementById("radios2").checked = true;
    swapStyleSheet("https://bootswatch.com/4/minty/bootstrap.min.css");
    
}
else if (localStorage.getItem("theme") === "midnight") {
    document.getElementById("radios3").checked = true;
    swapStyleSheet("https://bootswatch.com/4/superhero/bootstrap.min.css");
}
else{
    document.getElementById("radios1").checked = true;
    swapStyleSheet("https://bootswatch.com/4/lux/bootstrap.min.css");
}
