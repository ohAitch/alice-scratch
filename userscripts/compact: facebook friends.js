// @match       *://*.facebook.com/*
// @require     https://code.jquery.com/jquery-latest.js

window.$ = $

if ($('#pagelet_timeline_medley_friends').length) {

var load_friends = function(cb){(function load_friends(){
	if ($('.FriendButton').length < parseInt($('[data-tab-key="friends"] ._gs6').text())) {
		window.scrollBy(0,1e9)
		var t = $('.FriendButton').length; (function λ(){if ($('.FriendButton').length !== t) load_friends(); else setTimeout(λ,1000*0.01)})()
		} else cb&&cb() })() }

$('body').append('<button id="load_friends" style="z-index:1000; position:fixed; top:3px; left:22px;">load all</button>')
$('body').append('<button id="compact" style="z-index:1000; position:fixed; top:23px; left:13px;">compactify</button>')
$('#load_friends').click(load_friends)
$('#compact').click(function(){
	load_friends(function(){
		$('.fbChatSidebar').remove()
		$('#pagelet_timeline_medley_friends ~').remove()
		$('#pagelet_timeline_medley_friends')//.css('border','none').css('background','none')
		$('#pagelet_timeline_medley_friends').css('width','1425px').css('margin-left','-120px')
		$('#pagelet_timeline_medley_friends li').css('width','176px')
		$('.FriendButton').parent().parent().parent().remove()

		$('u:contains("Acquaintance")').closest('li').remove()

		for(;;){
			var ls = $('.uiList[data-pnref="friends"]')
			ls.filter(function(){return $(this).find('>').length === 0}).remove()
			var ul_cnt = 7*3 // desired 7, but must be ≥ 20, so multiply by 3
			if (ls.slice(0,-1).toArray().every(function(ι){return $(ι).find('>').length === ul_cnt})) break
			while (ls.eq(0).find('>').length === ul_cnt) ls.splice(0,1)
			ls.eq(1).find('>').eq(0).detach().appendTo(ls.eq(0)) }

		window.scrollBy(0,-1e9)
		}) })

}
