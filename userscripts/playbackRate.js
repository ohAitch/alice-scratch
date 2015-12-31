// @match       *://*/*

var get_viaudeo = ()=>{
	var vs = document.getElementsByTagName('video'); var as = document.getElementsByTagName('audio')
	if (vs.length + as.length === 0) console.warn('no (vi|au)dios')
	if (!(vs.length === 1 || (vs.length === 0 && as.length === 1))) console.warn('too many (vi|au)dios: '+vs.length+', '+as.length)
	return vs[0] || as[0] }

Object.getOwnPropertyDescriptor(window,'rate') === undefined && Object.defineProperty(window,'rate',{configurable:true,
	get: () => get_viaudeo().playbackRate,
	set: ι => {get_viaudeo().playbackRate = ι},
	})
