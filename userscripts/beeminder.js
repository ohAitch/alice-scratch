// ==UserScript==
// @name       beeminder tweaks
// @namespace  alice0meta.beeminder
// @version    0.1
// @match      http*://*.beeminder.com/*
// ==/UserScript==

// todo: add checks so that things get executed only on the right pages
// todo‽: consider writing an svg graph generator
// todo: the datapoints link doesn't handle not having goals in the url

/////  THE FOLLOWING IS COPIED FROM ELSEWHERE  ///// lw_unread.js
/*function scroll_to(v) {
	// this may be rather hacky and bad, unsure
	var t = location.href
	location.replace(typeof v === 'string'? v.replace(/^#?/,'#') : '#'+v.id)
	window.history.replaceState(null,null,t)
}*/
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
	function at_a_goal(){return location.pathname.match(/^\/\w+\/(goals\/)?\w/)}

	// make feedback button actually link to the feedback forums, although middle-click still doesn't work
	$('#uvTabLabel').attr('href','https://beeminder.uservoice.com/forums/3011-general')

	if (at_a_goal()) {
		// dark theme
		$('head').append('<style media="screen" type="text/css">'+
			'body > div.content { min-height:100% }'+
			'div.header,'+
			'#goal-user > div.content-container > div.user-profile > a > img,'+ // profile picture
			'body > div.content { -webkit-filter: invert(100%) hue-rotate(180deg) }</style>')
		;[0.3,0.4,1,2,3,4,5,6,7,8,9,10].map(function(v){run.in(v,function(){$('#uvTab').css({'border-top-color':'','border-right-color':'','border-bottom-color':'','-webkit-box-shadow':'','box-shadow':''})})})
		
		// style
		$('.delete_datapoint').css({padding:'0px 1em'})

		// remove header
		$('#header').remove()
		$('.content').css({'padding-top': '0px'})

		// remove footer
		$('#footer').remove()

		// remove datapoint deletion dialog
		$('.delete_datapoint').removeAttr('data-confirm')

		// remove dogfood mandate box
		if ($('#admin-links').children('.content-container').children('h3').text()==='Dogfood Mandate')
			$('#admin-links').remove()

		// provide convenient link to datapoints in sane order
		$($('.control')[0]).append($('<div class="settings"><a href="'+location.pathname.replace(/^((\/[^\/]+){0,3}).*/,'$1')+'/datapoints?dir=desc&sort=measured_at"><div style="background: url(https://raw.githubusercontent.com/alice0meta/userscripts/master/userscripts/datapoints_icon.png); background-repeat: no-repeat; height: 36px; width: 36px; background-size:32px 32px; background-position: 2px;"></div></a></div>'))

		// on this specific goal, display most recent datapoint
		if (location.pathname === '/alice0meta/goals/team') {
			//'< no request :c >'
			var t = $.map($('.recent-data').find('span'),function(v){var t = $(v).attr('data-comment').match(/\| (.*)/); return [t?[t[1],parseInt($(v).text().match(/^(\d+)/)[1])]:undefined]}).filter(function(v){return v}).slice(-1)[0]; var data = t[0]; var day = t[1]
			var msg; $('body').append(msg = $('<div id="datapoint-msg" style="top:20px; left:20px; position:fixed; max-width:400px; font-family:monospace; text-align:left; padding:0px 3px; border: 1px solid #000; background-color:rgba(255,255,255,.7); white-space:pre-wrap">'))
			;(function t(){
				msg.text('alice-'+(s(new Date(),'.setDate(.getDate()-1)').getDate() === day? 'yesterday' : day)+' asks:\n'+data)
				run.tomorrow(t)})()
		}
	}	
})(jQuery)