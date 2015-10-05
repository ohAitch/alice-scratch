// @match       http*://*.facebook.com/zii.prime/friends
// @require     https://code.jquery.com/jquery-latest.js

$('body').append($('<button id="compact" style="z-index:1000; position:fixed; top:13px; left:13px;">compactify</button>'))
$('#compact').click(function(){
	$('.fbChatSidebar').remove()
	$('._3i9').css('width','1425px').css('margin-left','-125px')
	$('li._698').css('width','180px')
	$('.FriendButton').parent().parent().parent().remove()
})
