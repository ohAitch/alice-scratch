// ==UserScript==
// @name        Hipchat Tweaks
// @namespace   comely-naiad
// @version     1.0.1
// @downloadURL https://github.com/alice0meta/scratch/raw/master/userscripts/hipchat_easy.user.js
// @match       https://beeminder.hipchat.com/chat
// ==/UserScript==

//===--------------------------===// copied //===--------------------------===//

$.prototype.on_key = function(key,cb0){
	var t = {'⇥':[9,'↓'],'↩':[13],'⎋':[27,'↑'],'←':[37,'↓'],'↑':[38,'↓'],'→':[39,'↓'],'↓':[40,'↓']}
	var keyc = t[key]? t[key][0] : (typeof(key)==='number'? key : key.charCodeAt(0))
	this[(t[key]?{'↑':'keyup','↓':'keydown'}[t[key][1]]:0)||'keypress'](function(e){if (e.which===keyc) return cb0(e)}) }
$.on_view = function(f){document.addEventListener('visibilitychange',function(){if (!document.hidden) f()})}
$.on_away = function(f){document.addEventListener('visibilitychange',function(){if (document.hidden) f()})}

//===---------------------------===// main //===---------------------------===//

$(window).on_key('⇥',function(e){var t; e.preventDefault()
	;((t=$('#tabs > .alert').first()).length? t :
		(t=$('#tabs > .selected').next()).length? t :
		$('#tabs > :eq(1)')
	).find('.open').click()})

$('[name="27248_167363@chat.hipchat.com"]').append('<div id="tocking" style="position:fixed; left:200px; font-size:150px; color:#a00; display:none;">tocking!</div>')

var poll_tock_status = function(tock_name){
	if ($('#chats > [name="27248_beeminder@conf.hipchat.com"] .systemMessage-green td.nameBlock > :contains("'+tock_name+' tock")').last().closest('tr').find('.messageBlock > div').text().trim().match(/^\d/)) $('#tocking').css('display','')
	else $('#tocking').css('display','none')
	}
var poll_token
$.on_view(function(){poll_token = setInterval(poll_tock_status,1000,'dreeves')})
$.on_away(function(){clearInterval(poll_token)})