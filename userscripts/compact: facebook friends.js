// @match       *://*.facebook.com/*
// @require     https://code.jquery.com/jquery-2.1.4.min.js

// window.$ = $

if ($('#pagelet_timeline_medley_friends').length) {

var load_friends = cb => {(function load_friends(){
	if ($('.FriendButton').length < parseInt($('[data-tab-key="friends"] ._gs6').text())) {
		window.scrollBy(0,1e9)
		var t = $('.FriendButton').length; (function Λ(){if ($('.FriendButton').length !== t) load_friends(); else setTimeout(Λ,1000*0.01)})()
		} else cb&&cb() })() }

$('body').append('<button id="load_friends" style="z-index:1000; position:fixed; top:3px; left:22px;">load all</button>')
$('body').append('<button id="compact" style="z-index:1000; position:fixed; top:23px; left:13px;">compactify</button>')
$('#load_friends').click(load_friends)
$('#compact').click( ()=>{
	$('#pagelet_sidebar, #pagelet_dock').remove()
	load_friends( ()=>{
		$('u:contains("Acquaintance")').closest('li').remove()

		$('#pagelet_timeline_medley_friends ~').remove()
		$('#pagelet_timeline_medley_friends').css('width','1425px').css('margin-left','-120px')
		$('#pagelet_timeline_medley_friends li').css('width','176px')
		$('.FriendButton').parent().parent().parent().remove()
		
		var t = $('.uiList[data-pnref="friends"]'); t.toArray().slice(1).map(ι => $(ι).find('>').toArray().map(ι => $(ι).detach().appendTo(t.eq(0))))

		window.scrollBy(0,-1e9)
		}) })

}
