// ==UserScript==
// @name        attention: thedailywtf
// @namespace   comely-naiad
// @version     1.0.3
// @downloadURL https://github.com/alice0meta/scratch/raw/master/userscripts/attention_thedailywtf.user.js
// @match       http*://thedailywtf.com/*
// @require     https://code.jquery.com/jquery-latest.js
// @grant       none
// ==/UserScript==

$('aside').slice(1).remove()
$('.tales').remove()
