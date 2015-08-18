// ==UserScript==
// @name        compact: google calendar
// @namespace   comely-naiad
// @version     1.0.1
// @downloadURL https://github.com/alice0meta/scratch/raw/master/userscripts/compact_googlecalendar.user.js
// @match       http*://www.google.com/calendar/render*
// @grant       none
// ==/UserScript==

var t = document.getElementById("onegoogbar")
while (t.firstChild) t.removeChild(t.firstChild)
t.style.height = "30px"
t.style.background_color = "#f1f1f1"

;
