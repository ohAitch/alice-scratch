// @match       http*://*.soundcloud.com/*
// @require     https://code.jquery.com/jquery-latest.js

var t = setInterval(function(){
	if (!$('.heroPlayButton-pause').length && $('.playControl.playing').length) {$('.playControl').click(); clearInterval(t)}
	}, 100)
