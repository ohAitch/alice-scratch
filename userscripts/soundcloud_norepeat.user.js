// ==UserScript==
// @name        soundcloud norepeat
// @namespace   comely-naiad
// @version     1.0.0
// @downloadURL https://github.com/alice0meta/scratch/raw/master/userscripts/soundcloud_norepeat.user.js
// @match       http*://*.padm.us/*
// @match       http*://*.soundcloud.com/*
// @require     https://code.jquery.com/jquery-latest.js
// @grant       none
// ==/UserScript==

var t = setInterval(function(){
	if (!$('.heroPlayButton-pause').length && $('.playControl.playing').length) {$('.playControl').click(); clearInterval(t)}
	}, 100)
