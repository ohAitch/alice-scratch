// ==UserScript==
// @name        playbackRate
// @namespace   comely-naiad
// @version     1.0.0
// @downloadURL https://github.com/alice0meta/scratch/raw/master/userscripts/playbackrate.user.js
// @match       http*://www.youtube.com/*
// @grant       none
// ==/UserScript==

Object.defineProperty(window,'rate',{
	get: function(){return document.getElementsByClassName('html5-main-video')[0].playbackRate},
	set: function(x){document.getElementsByClassName('html5-main-video')[0].playbackRate = x},
	})
