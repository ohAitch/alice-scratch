// ==UserScript==
// @name       beeminder tweaks
// @namespace  alice0meta.beeminder
// @version    0.1
// @match      http*://*.beeminder.com/*
// ==/UserScript==

// todo: fix this: when beeminder gives me a notification, i don't see it, and then when it goes away, i'm not scrolled to the right location . also, the notifications are annoying

/////  THE FOLLOWING IS COPIED FROM ELSEWHERE  ///// lw_unread.js
function scroll_to(v) {
	// this may be rather hacky and bad, unsure
	var t = location.href
	location.replace(typeof v === 'string'? v.replace(/^#?/,'#') : '#'+v.id)
	window.history.replaceState(null,null,t)
}

// experimental
function s(v,s) {return eval('(function(v){'+s.replace(/\./g,'v.')+';return v})')(v)}

/////  THE FOLLOWING IS COPIED FROM ELSEWHERE  ///// lang-alpha
// time
Date.now_s = function(){return Date.now() / 1000}
var run = {
	in:   function(s,f){return {id:setTimeout( f,s*1000), cancel:function(){cancelTimeout( this.id)}}},
	every:function(s,f){return {id:setInterval(f,s*1000), cancel:function(){cancelInterval(this.id)}}},
	tomorrow:function(f){
		var start = new Date()
		var cancel = false
		var r = run.in(new Date(start).setHours(24,0,0,0)/1000 - start/1000,
			function t(){if (new Date().getDate() === start.getDate()) run.in(1,t); else {if (!cancel) f()}})
		return {cancel:function(){cancel = true; r.cancel();}}}
}

;(function($){
	// style
	$('.delete_datapoint').css({padding:'0px 1em'})
	
	// if #goal-user exists, scroll to it
	if ($('#goal-user')[0]) scroll_to('goal-user')

	// remove datapoint deletion dialog
	$('.delete_datapoint').removeAttr('data-confirm')

	// remove dogfood mandate box
	if ($('#admin-links').children('.content-container').children('h3').text()==="Dogfood Mandate")
		$('#admin-links').remove()

	// on this specific goal, display most recent datapoint
	if (location.href === 'https://www.beeminder.com/alice0meta/goals/team') {
		//'< no request :c >'
		var t = $('.recent-data').find('span').map(function(v){var t = v.attr('data-comment').match(/\| (.*)/); return t?[t[1],parseInt(v.text().match(/^(\d+)/)[1])]:undefined}).filter(function(v){return v}).slice(-1)[0]; var data = t[0]; var day = t[1]
		var msg; $('body').append(msg = $('<div id="datapoint-msg" style="top:20px; left:20px; position:fixed; max-width:400px; font-family:monospace; text-align:left; padding:0px 3px; border: 1px solid #000; background-color:rgba(255,255,255,.7); white-space:pre-wrap">'))
		;(function t(){
			msg.text('alice-'+(s(new Date(),'.setDate(.getDate()-1)').getDate() === day? 'yesterday' : day)+' asks:\n'+data)
			run.tomorrow(t)})()
	}
})(jQuery)