// @match       *://books.google.com/*

var my_encode = ι=> ι.replace(/[^A-Za-z0-9 ]/g,'_')
var pad0 = ι=> ('0000'+ι).slice(-4)
var catch_ = function(f){return function(...a){try {return f.apply(this,a)} catch (ι) {if ('__catchable' in ι) return ι.__catchable; else throw ι}}}
var _return = function(ι){throw {__catchable:ι}}
var dict_or = (ι,k)=> (k in ι? ι[k] : k)

var persist_o = name=> {
	localStorage.getItem(name) === null && localStorage.setItem(name,'{}')
	var o = JSON.parse(localStorage.getItem(name))
	return function(k,ι){return arguments.length === 1? o[k] : (o[k] = ι, localStorage.setItem(name, JSON.stringify(o)), ι)} }
var img_to_data = ι=> {
	var t = document.createElement('canvas')
	t.width = ι.width; t.height = ι.height
	t.getContext('2d').drawImage(ι,0,0)
	return t.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/,'') }
var dl_data = (ι,name)=> {
	var t = document.createElement('a')
	t.href = 'data:application/octet-stream,'+ι
	t.target = '_blank'
	t.download = name
	t.click()
	}

// localStorage.removeItem('book_dl__dl_cache')
var dl_cache = persist_o('book_dl__dl_cache')

setTimeout(()=>{

var title = $('.gb-volume-title').text().trim() || location.href
setInterval(catch_(()=>{
	$('.pageImageDisplay img').toArray().map(ι=> {
		ι.complete || _return()
		var h = $(ι).attr('src') || _return()
		h === '/googlebooks/restricted_logo.gif' && _return()
		var t = h.match(/pg=([A-Z]{2})(\d+)/);
		var pg = t? dict_or({'PA':'','PP':'.f','PR':'.p'},t[1])+pad0(t[2]) : my_encode(h)
		var t = my_encode(title)+' - '+pg+'.png.64'; dl_cache(t) || (dl_cache(t,1), dl_data(img_to_data(ι), t))
		})
	}), 0.05*1e3)

},1*1e3)

// --------------------------------- .bashrc -------------------------------- //
// dl_fix(){ f ~/Downloads; f ~/pg; ζ '
// 	fs ← require("fs")
// 	from ← process.env.HOME+"/Downloads"
// 	out ← process.env.HOME+"/pg"
// 	fix ← ι=> ι
// 		.replace(/^Impro_ Improvisation and the Theatre -/,"Impro -")
// 	fs.readdirSync(from).filter(ι=> /\.64$/.λ(ι)).map(λ(ι){fs.writeFileSync(out+"/"+fix(ι).replace(/\.64$/,""), Buffer(fs.readFileSync(from+"/"+ι)+"","base64")); fs.unlinkSync(from+"/"+ι)})
// 	;'; }
