// ==UserScript==
// @name        padm tweaks
// @namespace   comely-naiad
// @version     1.0.3
// @downloadURL https://github.com/alice0meta/scratch/raw/master/userscripts/padm_tweaks.user.js
// @match       http://*.padm.us/*
// @require     https://code.jquery.com/jquery-latest.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js
// ==/UserScript==

$.css = function(v){$('head').append('<style>'+v+'</style>')}
$.on_view = function(f){document.addEventListener('visibilitychange',function(){if (!document.hidden) f()})}
String.prototype.repeat = function(v){return new Array(v+1).join(this)}

$.css(
	'.floaty_btn {font-size:large; font-family:monospace; background-color:#333; padding:3px; position:fixed; left:10%; top:6px; z-index:10; border-radius:5px; text-decoration:none; color:#fff; line-height:normal;}'+
	'.floaty_btn:hover {text-decoration:underline;}'+
	'')

if (location.href.match(/expost.padm.us/)) {
	$('body').append('<a class="floaty_btn" href="'+location.href.replace('expost.padm.us','padm.us')+'?useMonospaceFont=true">edit</a>')
} else {
	if (!location.href.match(/useMonospaceFont/)) window.location = location.href+'?useMonospaceFont=true'
	else {
		$.on_view(function(){if ($('#connectionbox').is(":visible")) location.reload()})
		$('body').append('<a class="floaty_btn" href="'+location.href.replace('padm.us','expost.padm.us').replace('?useMonospaceFont=true','')+'">expost</a>')
		$('.acl-write.separator').first().after('<li class="acl-write separator"></li>'.repeat(8))
	}
}