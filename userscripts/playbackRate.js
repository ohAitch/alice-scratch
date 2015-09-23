// @match       http*://www.youtube.com/*

Object.defineProperty(window,'rate',{
	get: function(){return document.getElementsByClassName('html5-main-video')[0].playbackRate},
	set: function(x){document.getElementsByClassName('html5-main-video')[0].playbackRate = x},
	})
