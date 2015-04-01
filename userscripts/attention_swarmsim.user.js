// ==UserScript==
// @name        attention: swarmsim
// @namespace   comely-naiad
// @version     1.0.0
// @downloadURL https://github.com/alice0meta/scratch/raw/master/userscripts/attention_swarmsim.user.js
// @match       http*://swarmsim.github.io/*
// @grant       none
// ==/UserScript==

//! todo: hide the main area while we're grabbing stuff

var pad = function(v,s){v=v+''; return s.slice(v.length)+v}
var i = function(v){return parseInt(v)}
var p_i = function(v){v = Math.round(v); return v < 1000? v+'' : Math.floor(v/1000)+','+pad(v % 1000,'000')}

var activate;

var fns = [
['#/tab/energy/unit/energy',function(){
	var t = $('p.ng-binding:not(.ng-scope)').text().trim().replace(/,/g,'').match(/(\d+) \/ (\d+)/).slice(1).map(i); var amount = t[0]; var cap = t[1]
	var rate = $('span.ng-binding:not(.ng-scope):not(.small)').text().trim().replace(/,/g,'').match(/^\d+/).map(i)[0]
	var need = rate*24
	activate = amount < need
	if (activate) {
		$('body').prepend('<div id="top" style="padding:40px;"><p style="margin-bottom:0.5em;">too little energy! need '+p_i(need)+' energy.</p></div>')
		$('#top').append($('.progress').eq(0).parent())
	}
	}],
['#/tab/mutagen/unit/mutagen',function(){if (activate) {
	$('#top').append('respec cost: '+p_i(i($('.progress').eq(1).prev().text().replace(/,/g,'').match(/\d+/)[0]) * 0.3))
	$('#top').append($('.progress').eq(1))
	}}],
[null,function(){if (activate){
	$('#top').siblings().remove()
	}}],
]
;(function λ(){var t = fns.shift(); t[0] && (location.hash = t[0]); setTimeout(function(){t[1](); fns.length && λ()},200)})()
