// ==UserScript==
// @name        augment search
// @namespace   comely-naiad
// @version     1.0.2
// @downloadURL https://github.com/alice0meta/scratch/raw/master/userscripts/augment_search.user.js
// @match       https://*.google.com/*
// @require     https://code.jquery.com/jquery-latest.js
// @require     file:///~/ali/scratch/remember.txt.js
// @grant       none
// ==/UserScript==
if ($('#searchform').length && $('input[title="Search"]').length) {

// todo: the svg thing should extend off the left side farther than it does

var icon = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA9lBMVEUAAAB3AC6HAERYAD16AUZ3AEV7AEZ8AEd5AUV6AUV2AER7AEZ6AEV7AEp6AEh7AEd+AUh8AEd8AEd6AEZ9AEd6AEZ9AEh8AEd8AUh8AEZ9AEd9AUZ4AEp9AEeCAEqBAEqBAEp+AEiBAEt9AEd7AUZ7AEd6AUZ/AEl7AEd9AEl7AUZ6AEd9AUZ8AEd5AUd7AEh7AUaDAEt9AUiCAEt5AEaCAEt5AUZ6AEV8AEeCAEqCAEx9AEd/AEh7AUZ7AkZ7AEh7AEZ5AUZ6AUZ9AEd+AEd5AkZ5AEZyAEOAAUiHAE2CAEqAAEl2AESGAU2CAUqJAE6EAUyIAU3hDeY4AAAATXRSTlMAAgQEZCMYSUA2Lbg8Hw7u6+fi39rW0a6ha08pC/v38+/f2dTMwKibk4N8dFVRRgj9+ff19ejoz8bEvby1nJuQioZeWlhDHRP6zodmOI8+0eIAAAF7SURBVDjLnZDVbsNAFETvXVMMYWZmZmYq2Un+/2e6sZomlmVL7bx4NHPk3Vn4gxB/HS9s5EVMDwxqJzjJEWNXsj857FxmzCuAEC+H58Vczu0by5V6a+9NC2AEnNOLqvrY+MlFc5S16j00EC6hGkq9RxlAgturTDmDdPzcmKoTBWCXDHGA5hU0YnaeXlTxukVAq6VcOOn3NoBYPQYBnN98kiUACMdR0OdxmIjn3KJbkrJPwnhLgonlgAWQApRA8waqbWdFGAJcdmgYottTXBRZd4GnlgFHOsDBq+L1SD4Q9A+0YJX9StAg1g0zz1opjSfL6FEqXcP1SHBUiNQardCVfdSutb/saFPTzOTpAU6htvD2tLdM9AHwldb9XOQCXQGIfp+z2DyIxPjI2C6pa91QgXkiQk0L8T/TzBSNlExfoB9LuYq3CqAVQIuNmucte0BoplJ7sOmdOTVCrHtkymqWs/tBrK992i3gC+osYdMDe0krYAc4Pw60/5++ATtHIuCve5TSAAAAAElFTkSuQmCC" style="width:16px; height:16px; vertical-align:middle;"/>'

var data = []; remember_txt_js.split('\n').filter(function(v){return !/^$|^\/\//.test(v)}).forEach(function(v){v = v.split(' '); v.slice(0,-1).forEach(function(t){data.push([t.split('&'), v[v.length-1]])})}); data.reverse()

$('body').append($('<svg xmlns="http://www.w3.org/2000/svg" style="z-index:5000; position:absolute; top:74px; height:30px; width:9px;"><polygon points="0,0 0,9 9,9"></polygon><polygon points="0,9 9,9 9,21 0,21"></polygon><polygon points="0,30 0,21 9,21"></polygon></svg>'))

var update = function(input){
	$('.augment').remove()
	var augments = {}
	// input.split(/ +/).map(function(v){return data[v]}).filter(function(v){return v}).forEach(function(v){
	data.forEach(function(v){
		if (v[0].every(function(v){return input.indexOf(v) !== -1})) {v = v[1]
			if (augments[v]) return; augments[v] = true
			$('#res').prepend('<div class="augment" style="margin-bottom:18px; white-space:nowrap;">'+icon+' <a href="'+v+'"">'+v+'</a></div>')
			} })
}
var input = ""; setInterval(function(){var t; input === (t=$('input[title="Search"]').val()) || update(input = t)},50)

}
