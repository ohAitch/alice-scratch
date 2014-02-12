// may lack support for dynamically loaded new comments

(function($){
	function char(v){return typeof v === 'number'? v : v.charCodeAt(0)}
	function on_key(key,f){$(window).keydown(function(e){if (e.which === char(key)) f(e)})}
	function mod(a,b){return ((a%b)+b) % b}

	var ids = ['#'].concat($.map($('.new-comment'),function(v){return '#'+v.id}))
	window.ids = ids
	if (ids.length === 1) return

	$('head').append($('<style type="text/css"> .at-comment {'+
		'border: 5px solid #ee90ee !important;'+
		'padding: 0 0 0 10px !important;'+ // needed only because we have to remove new-comment
		'margin-right: 0 !important;'+
		'} </style>'))

	var at = 0
	function update_button(){$('#next-unread')[0].value = 'unread('+at+'/'+(ids.length-1)+')\nkeys: [←] [→]'}
	function update(prev_at){
		location.href = ids[at]
		$(ids[prev_at]).removeClass('at-comment')
		$(ids[at]).addClass('at-comment')
		// lw uses !important, which is hard to override :c
		$(ids[prev_at]).addClass('new-comment')
		$(ids[at]).removeClass('new-comment')
		update_button()
	}

	on_key(37, window.unread_prev = function(){var t = at; at=mod(at-1, ids.length); update(t)})
	on_key(39, window.unread_next = function(){var t = at; at=mod(at+1, ids.length); update(t)})

	$('body').append('<input id="next-unread" type="button" onclick="unread_next()" style="top:20px; left:20px; position:fixed; font-family:monospace; background-color:white; text-align:left">')
	update_button()
})(jQuery)