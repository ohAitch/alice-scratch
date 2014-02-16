// ==UserScript==
// @name       beeminder misc
// @namespace  alice0meta.beeminder
// @version    0.1
// @match      http*://*.beeminder.com/*
// ==/UserScript==

/////  THE FOLLOWING IS COPIED FROM ELSEWHERE  ///// lw_unread.js
function scroll_to(v) {
	// this may be rather hacky and bad, unsure
	var t = location.href
	location.replace(typeof v === 'string'? v.replace(/^#?/,'#') : '#'+v.id)
	window.history.replaceState(null,null,t)
}

(function($){
	// style
	$('.delete_datapoint').css({padding:'0px 1em'})
	
	// if #goal-user exists, scroll to it
	if ($('#goal-user')[0]) scroll_to('goal-user')

	// get rid of the datapoint deletion dialog
	$('.delete_datapoint').removeAttr('data-confirm')

	// on this specific goal, display most recent datapoint
	if (location.href === 'https://www.beeminder.com/alice0meta/goals/team') {
		$('#datapoint-msg').remove()
		var t = $('.recent-data').find('span').last()
		var data = t.attr('data-comment').match(/\| (.*)/)[1]
		var day = parseInt(t.text().match(/^(\d+)/)[1])
		var msg = 'alice-'+(new Date().getDate()-1 === day? 'yesterday' : day)+' would like you to:\n'+data
		$('body').append($('<div id="datapoint-msg" style="top:20px; left:20px; position:fixed; max-width:400px; font-family:monospace; text-align:left; padding:0px 3px; border: 1px solid #000; background-color:rgba(255,255,255,.7); white-space:pre-wrap">').text(msg))
	}
})(jQuery)