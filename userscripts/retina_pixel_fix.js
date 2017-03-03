// @match       *://*/*

var css = ι=>{ var t = document.createElement('style'); t.innerHTML = ι; document.head.appendChild(t) }

when_at = ['scholtek.com','xkcd.com','egscomics.com','strongfemaleprotagonist.com','smbc-comics.com','kongregate.com']

host2 = location.host.split('.').slice(-2).join('.')
if( when_at.some(ι=> host2===ι) )
	css('* { image-rendering:pixelated; }')
