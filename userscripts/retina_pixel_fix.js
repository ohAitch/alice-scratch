// @match       *://*/*

var css = ι=>{ var t = document.createElement('style'); t.innerHTML = ι; document.head.appendChild(t) }

if( location.host==='scholtek.com' )
	css('* { image-rendering:pixelated; }')
if( location.host==='xkcd.com' )
	css('* { image-rendering:pixelated; }')
// if( location.host==='nitrome.com' )
// 	css('* { image-rendering:pixelated; }')
