// ==UserScript==
// @name        stayfocusd: happier
// @namespace   comely-naiad
// @version     1.0.0
// @downloadURL https://github.com/alice0meta/scratch/raw/master/userscripts/stayfocusd_happier.user.js
// @match       http://www.stayfocusd.com/?background
// @require     https://code.jquery.com/jquery-latest.js
// ==/UserScript==

document.open()
document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><style>body {text-align:center; font-family:"Courier New",monospace; color:#ddd; background-color:#333;} .round {border-radius:100%;} #gonna {font-family:inherit; font-size:16px; color:inherit; background-color:inherit; border-radius:3px; border-style:solid;}</style></head><body><div id="body"><p>hey <3</p><p>wanna try a willpower exercise now?</p><p>(willpower is a muscle.<br>focus is a muscle.<br>this is a thing which you can do!)</p><br><p><button id="gonna">gonna do it?</button></p></div></body></html>')
document.close()

$('#gonna').click(function(){$('#gonna').remove(); $('#body').append($('<img class="round" src="https://i.imgur.com/3CBZcat.jpg" width=506>'))})
