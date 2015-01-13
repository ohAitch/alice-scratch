// ==UserScript==
// @name        beeminder tweaks
// @namespace   comely-naiad
// @version     1.0.1
// @downloadURL https://github.com/alice0meta/scratch/raw/master/userscripts/beeminder.user.js
// @match       http*://*.beeminder.com/*
// ==/UserScript==

$(".delete_datapoint").css({padding:"0px 1em"}).removeAttr("data-confirm")
