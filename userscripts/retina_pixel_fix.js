// @match       *://*/*

var css = ι=>{ var t = document.createElement('style'); t.innerHTML = ι; document.head.appendChild(t) }

css('* { image-rendering:pixelated; }')
