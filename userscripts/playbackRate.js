// @match       *://*.youtube.com/*
// @match       *://*.vimeo.com/*

var get_video = function(){
	var t = document.getElementsByTagName('video')
	if (t.length === 0) console.error('no videos')
	if (t.length > 1) console.warn('too many videos: '+t.length)
	return t[0] }

Object.defineProperty(window,'rate',{
	get: function(){return get_video().playbackRate},
	set: function(ι){get_video().playbackRate = ι},
	})
