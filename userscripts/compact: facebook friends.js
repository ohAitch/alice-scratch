// @match       http*://*.facebook.com/zii.prime/friends
// @require     https://code.jquery.com/jquery-latest.js

// window.$ = $

$('body').append($('<button id="compact" style="z-index:1000; position:fixed; top:13px; left:13px;">compactify</button>'))
$('#compact').click(function λ(){
	if ($('.FriendButton').length < parseInt($('[data-tab-key="friends"] ._gs6').text())) {
		window.scrollBy(0,1e9)
		setTimeout(λ,1000*0.05)
	} else {
		$('u:contains("Acquaintance")').closest('li').remove()
		$('.fbChatSidebar').remove()
		$('._3i9').css('width','1425px').css('margin-left','-125px')
		$('li._698').css('width','180px')
		$('.FriendButton').parent().parent().parent().remove()
		for(;;){
			var ls = $('.uiList[data-pnref="friends"]')
			ls.filter(function(){return $(this).find('>').length === 0}).remove()
			if (ls.slice(0,-1).toArray().every(function(ι){return $(ι).find('>').length === 21})) break
			while (ls.eq(0).find('>').length === 21) ls.splice(0,1)
			ls.eq(1).find('>').eq(0).detach().appendTo(ls.eq(0)) }
		window.scrollBy(0,-1e9)
	}
	})
