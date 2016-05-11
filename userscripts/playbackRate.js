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

// rate_el ← ()=>{
// 	vs ← $`video`; as ← $`audio`; bs ← […vs,…as]
// 	if bs ≈ []: warn('no (vi|au)dios')
// 	(vs≈[*]  |  vs≈[] & as≈[*]) | warn('too many (vi|au)dios: '+vs.L+', '+as.L)
// 	↩ bs[0].prop`playbackRate` }
// def(window,'rate') || def(window,'rate', ()=> rate_el().ι, ι isa 0 => rate_el().ι = ι)
