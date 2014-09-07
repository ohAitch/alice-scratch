// ==UserScript==
// @name        padm tweaks
// @namespace   comely-naiad
// @version     1.0.7
// @downloadURL https://github.com/alice0meta/scratch/raw/master/userscripts/padm_tweaks.user.js
// @match       http://*.padm.us/*
// @require     https://code.jquery.com/jquery-latest.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js
// ==/UserScript==

$.css = function(v){$('head').append('<style>'+v+'</style>')}
$.on_view = function(f){document.addEventListener('visibilitychange',function(){if (!document.hidden) f()})}
String.prototype.repeat = function(v){return new Array(v+1).join(this)}
var print = console.log.bind(console)
var poll = function(f,cb){var t; if (t=f()) cb(null,t); else setTimeout(poll,10,f,cb)}

$.css(
	'.floaty_btn {font-size:large; font-family:monospace; background-color:#333; padding:3px; position:fixed; left:143px; top:6px; z-index:10; border-radius:5px; text-decoration:none; color:#fff; line-height:normal;}'+
	'.floaty_btn:hover {text-decoration:underline;}'+
	'')

var t
if (location.href.match(/expost.padm.us/)) {
	if ($(window).width() < 1250) $('body').prepend('<div style="padding:3px">')
	$('body').append('<a class="floaty_btn" href="'+location.href.replace('expost.padm.us','padm.us')+'">edit</a>')
} else {
	if (t=location.href.match(/^(.+)\?useMonospaceFont=true$/)) window.location = t[1]
	else {
		$.on_view(function(){if ($('#connectionbox').is(":visible")) location.reload()})
		$('body').append('<a class="floaty_btn" href="'+location.href.replace('padm.us','expost.padm.us')+'">expost</a>')
		if (t=location.href.match(/^(.+)-old$/)) $('body').append('<a class="floaty_btn" style="left:220px;" href="'+t[1]+'">main</a>')
        else $('body').append('<a class="floaty_btn" style="left:220px;" href="'+location.href+'-old">old</a>')
		$('.acl-write.separator').first().after('<li class="acl-write separator"></li>'.repeat(12))
		_.range(50).map(function(v){setTimeout(function(){unsafeWindow.pad.changeViewOption('useMonospaceFont',true)},(0.8+v*0.2)*1000)})
		var confirm_ = unsafeWindow.confirm; unsafeWindow.confirm = function(v){return v==='Clear authorship colors on entire document?' || confirm_(v)}
	}
}