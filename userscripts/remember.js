// @match       https://*.google.com/*
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @require     file:///~/ali/scratch/remember.txt.js

// this line should not be in this file but w/e
if (location.host==='hangouts.google.com'){ var f = ()=>{ $('.g-Ue-v0h5Oe, .g-Qx-eb').remove() }; f(); setInterval(f,0.5*1e3) }
if (location.host==='hangouts.google.com'){
	var dl_data = (ι,name) => {
		var t = document.createElement('a')
		t.href = 'data:application/octet-stream,'+ι
		t.target = '_blank'
		t.download = name
		t.click()
		}
	var recent_data = ()=> $('iframe').toArray().filter(ι => /^gtn_/.test($(ι).attr('id'))).map(ι=>{ var t = $(ι).contents().find('.Mu.SP'); return t.find('.lWfe2d').text().includes('\x61\x72\x69\x6e\x61\x2e\x73\x68\x61\x6c\x75\x6e\x6f\x76\x61@gmail.com') && t.toArray().map(ι => $(ι).html()) }).filter(ι=>ι)[0]
	var update = ι=>{
		var t = localStorage.getItem('νlog'); t = t==null? [] : JSON.parse(t); t = new Set(t); ι.forEach(ι => t.add(ι)); var r = JSON.stringify([...t]); localStorage.setItem('νlog',r)
		console.log('updating nlog. new size:',r.length)
		if (r.length > 3e6) alert('nlogdl()')
		}
	window.nlogdl = ()=>{ dl_data(localStorage.getItem('νlog'), 'nlog '+new Date().toISOString()+'.json') }

	var t = ()=>{ var t = recent_data(); if (t) update(t) }; t(); setInterval(t, 10*1e3)
}

var $in = 'input[title="Search"]'

if ($('#searchform').length && $($in).length) {

// todo: the svg thing should extend off the left side farther than it does

var icon = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA9lBMVEUAAAB3AC6HAERYAD16AUZ3AEV7AEZ8AEd5AUV6AUV2AER7AEZ6AEV7AEp6AEh7AEd+AUh8AEd8AEd6AEZ9AEd6AEZ9AEh8AEd8AUh8AEZ9AEd9AUZ4AEp9AEeCAEqBAEqBAEp+AEiBAEt9AEd7AUZ7AEd6AUZ/AEl7AEd9AEl7AUZ6AEd9AUZ8AEd5AUd7AEh7AUaDAEt9AUiCAEt5AEaCAEt5AUZ6AEV8AEeCAEqCAEx9AEd/AEh7AUZ7AkZ7AEh7AEZ5AUZ6AUZ9AEd+AEd5AkZ5AEZyAEOAAUiHAE2CAEqAAEl2AESGAU2CAUqJAE6EAUyIAU3hDeY4AAAATXRSTlMAAgQEZCMYSUA2Lbg8Hw7u6+fi39rW0a6ha08pC/v38+/f2dTMwKibk4N8dFVRRgj9+ff19ejoz8bEvby1nJuQioZeWlhDHRP6zodmOI8+0eIAAAF7SURBVDjLnZDVbsNAFETvXVMMYWZmZmYq2Un+/2e6sZomlmVL7bx4NHPk3Vn4gxB/HS9s5EVMDwxqJzjJEWNXsj857FxmzCuAEC+H58Vczu0by5V6a+9NC2AEnNOLqvrY+MlFc5S16j00EC6hGkq9RxlAgturTDmDdPzcmKoTBWCXDHGA5hU0YnaeXlTxukVAq6VcOOn3NoBYPQYBnN98kiUACMdR0OdxmIjn3KJbkrJPwnhLgonlgAWQApRA8waqbWdFGAJcdmgYottTXBRZd4GnlgFHOsDBq+L1SD4Q9A+0YJX9StAg1g0zz1opjSfL6FEqXcP1SHBUiNQardCVfdSutb/saFPTzOTpAU6htvD2tLdM9AHwldb9XOQCXQGIfp+z2DyIxPjI2C6pa91QgXkiQk0L8T/TzBSNlExfoB9LuYq3CqAVQIuNmucte0BoplJ7sOmdOTVCrHtkymqWs/tBrK992i3gC+osYdMDe0krYAc4Pw60/5++ATtHIuCve5TSAAAAAElFTkSuQmCC" style="width:16px; height:16px; vertical-align:middle;"/>'

var data = []; remember_txt_js.split('\n').filter(ι => !/^$|^#/.test(ι.trim())).forEach(ι => {ι = ι.split(' '); ι.slice(0,-1).forEach(t => {data.push([t.split('&'), ι[ι.length-1]])})}); data.reverse()

$('body').append($('<svg xmlns="http://www.w3.org/2000/svg" style="z-index:5000; position:absolute; top:74px; height:30px; width:9px;"><polygon points="0,0 0,9 9,9"></polygon><polygon points="0,9 9,9 9,21 0,21"></polygon><polygon points="0,30 0,21 9,21"></polygon></svg>'))

var update = input => {
	var t = input
		.replace(/(\bsite:|\B∈) ?SE\b/i,'(site:stackexchange.com OR site:mathoverflow.net OR site:serverfault.com OR site:superuser.com)')
		.replace(/(\bsite:|\B∈) ?git\b/i,'site:github.com')
		.replace(/\bdl\b/i,'-inurl:htm -inurl:html intitle:”index of”')
	if (!(t === input)) {$($in).val(t).submit(); return}

	$('.augment').remove()
	var augments = {}
	// input.split(/ +/).map(function(ι){return data[ι]}).filter(function(ι){return ι}).forEach(function(ι){
	data.forEach(ι => {
		if (ι[0].every(ι => input.indexOf(ι) !== -1)) {ι = ι[1]
			if (augments[ι]) return; augments[ι] = true
			$('#res').prepend('<div class="augment" style="margin-bottom:18px; white-space:nowrap;">'+icon+' <a href="'+ι+'"">'+ι+'</a></div>')
			} })
}
var input = ""; setInterval( ()=>{var t; input === (t=$($in).val()) || update(input = t)} , 50)

}
