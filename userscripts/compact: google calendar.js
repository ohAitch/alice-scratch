// @match       http*://www.google.com/calendar/render*

var t = document.getElementById("onegoogbar")
while (t.firstChild) t.removeChild(t.firstChild)
t.style.height = "30px"
t.style.background_color = "#f1f1f1"
