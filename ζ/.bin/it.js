#!/usr/bin/env node
// hey, if you're gonna break this, keep a previous stable version ready this time. weve spent entirely too much time rescuing our configurations.

// odd synonym: k, name(, id)(, i?), 𐑯𐑱𐑥
// ι = it
// ‖ = size/length/shape

//################################### prelude ###################################
'use strict' ;require('module').wrapper[0] += `'use strict';` // enable strict mode everywhere
var _u = require('underscore') // lodash is better than underscore except for _()

//################################### ζ infra ###################################
var E_ = {}
var patched = new Set([E_,global])
var E = new Proxy({},{ // exports
	set(           ˣ,id,ι){ [...patched].forEach(o=> o[id] = ι     ) ;return true },
	defineProperty(ˣ,id,ι){ [...patched].forEach(o=> def0(o,id,ι) ) ;return true },
	})

var def0 = Object.defineProperty
var def = (o,name,ι)=> def0(o,name,_u({configurable:true,enumerable:true}).assign(ι))
var slot0 = (get,set)=>{ var t = {} ;def(t,'ι',{get,set}) ;return t }

//################################### prelude ###################################
E.catch_union = f=>{ try{ var r = f() ;var bad = T.Error(r) ;if( !bad) return r }catch(e){ var r = e ;T.Error(r) || !function(...a){throw Error(__err_format(...a))}('‽') ;return r } ;bad && !function(...a){throw Error(__err_format(...a))}('‽') } // _l.attempt may be better
E.catch_ι = f=>{ try{ var r = f() ;var bad = r===undefined ;if( !bad) return r }catch(e){} ;bad && !function(...a){throw Error(__err_format(...a))}('‽') }
E.catch_ = f=> function(){ try{ return f.apply(this,arguments) }catch(e){ if( '__catchable' in e) return e.__catchable ;else throw e } }
E.return_ = ι=>{ throw {__catchable:ι} }

E.T = ι=>{var t;
	if( (t= typeof ι)!=='object' ) return t ;if( ι===null ) return 'null'
	if( Object.getPrototypeOf(ι)===Object.prototype ) return 'object'
	for( t of is_l ) if( t[1](ι) ) return t[0]
	return 'object' }
var b_util = catch_ι(()=> process.binding('util') )
var is_l = [
	['Array',Array.isArray]
	,['Buffer',Buffer.isBuffer]
	// , ['Error',ι=> Object.prototype.toString.call(ι)==='[object Error]' || ι instanceof Error]
	,... ['Error','String','Boolean','Number'].map(ty=> [ty,ι=> Object.prototype.toString.call(ι)==='[object '+ty+']'])
	,... !b_util? [] : ['AnyArrayBuffer','DataView','Date','Map','MapIterator','Promise','RegExp','Set','SetIterator','TypedArray'].map(ι=> [ι,eval(`ι=> b_util.is${ι}(ι)`)])
	]
// would like to be using ∈ instead
Object.assign(T,_u(is_l).object(),{
	symbol: ι=> typeof ι==='symbol'
	,boolean: ι=> typeof ι==='boolean'
	,string: ι=> typeof ι==='string'
	,number: ι=> typeof ι==='number'
	,function: ι=> typeof ι==='function'
	,primitive: ι=>{ switch(typeof ι){ case'undefined': case'boolean': case'number': case'string': case'symbol': return true ;case'object': return ι===null ;default: return false } }
	,boxed: ι=>{ if( ι===null || typeof ι!=='object' ) return false ;var t = Object.getPrototypeOf(ι) ;t = t.constructor&&t.constructor.name ;return ( t==='Boolean'||t==='String'||t==='Number' ) && /^\[object (Boolean|String|Number)\]$/.test(Object.prototype.toString.call(ι)) }
	,ℤ: Number.isInteger
	,'-0': ι=> ι===0 && 1/ι < 0
	,NaN: Number.isNaN
	})
Object.assign(E,{ Tstr:T.string ,Tnum:T.number ,Tfun:T.function ,Tarr:T.Array ,Tprim:T.primitive })
T.primitive.ι = new Set(['undefined','boolean','number','string','symbol','null'])
T.boxed.ι = new Set(['Boolean','String','Number'])

//################################### ζ infra ###################################
// prefix hook . does not require parens around the right side, but can only do side effects
E.𐅫𐅮𐅪𐅰𐅃 = (()=>{ var 𐅭𐅩𐅝𐅋𐅩 = def({ f:undefined },'ι',{ set(ι){ this.f(ι) } }) ;return f=>{ 𐅭𐅩𐅝𐅋𐅩.f = f ;return 𐅭𐅩𐅝𐅋𐅩 } })()

E.γ = global
// def(Function.prototype,'‘@',{ ,get(){↩ @.call.bind(@) } })
// def(Function.prototype,'flip_',{ ,get(){↩ (a,b)=> @(b,a) } })
var 𐅯𐅬𐅫𐅋𐅃 = [] ;var t = { [Symbol.iterator]:𐅯𐅬𐅫𐅋𐅃[Symbol.iterator].bind(𐅯𐅬𐅫𐅋𐅃) }
E.postfix = new Proxy(t,{set(ˣ,id,ι,self){var t; id+='' ;𐅯𐅬𐅫𐅋𐅃.push(id)
	var 𐅯𐅂𐅃𐅦𐅨= Symbol(id) ;(E[id] = ι)[Symbol.toPrimitive] = ()=>𐅯𐅂𐅃𐅦𐅨
	var wrap = ι=>0?0: { enumerable:false ,get:(ι=>()=>ι)(function(){return ι.call(undefined,this,...arguments) }) ,set(ι){ def(this,𐅯𐅂𐅃𐅦𐅨,wrap(ι)) } }
	def(Object.prototype,𐅯𐅂𐅃𐅦𐅨,wrap(ι))
	return true }})

postfix['|>'] = (ι,f)=> f(ι)
postfix['<|'] = (f,ι)=> f(ι)
postfix['!>'] = (ι,f)=>( f(ι) ,ι )
postfix['…←'] = Object.assign
// obj_hash ← ι=> [ ,[(a,b)=>a===b,[…protos(ι)][1]] ,[_l.isEqual,ps(ι)] ,…(Tfun(ι)? [[(a,b)=>a===b,Function.prototype.toString.call(ι)]] : []) ]
// postfix['#obj='] = (a,b)=> [a,b].map(obj_hash) |> (ι=> _u.zip(…ι)).every(([a,b])=> a[0](a[1],b[1]))

//######### Property ##########
// still v limited
E.Property = function(o,_id){ ;this.o = o ;this._id = _id }
def(Property.prototype,'ι',{ get(){return this.o[this._id] } ,set(ι){ this.o[this._id] = ι } })
def(Property.prototype,'∃',{ get(){return Object.prototype.hasOwnProperty.call(this.o,this._id) } ,set(ι){ !ι? delete this.o[this._id] : this["∃"] ||( this.ι = undefined ) } })
def(Property.prototype,'host',{ get(){return Object.getOwnPropertyDescriptor(this.o,this._id) } ,set(ι){ Object.defineProperty(this.o,this._id,ι) } }) // not a real setter. funky!
def(Property.prototype,'enumerable',{ get(){return this.host.enumerable } ,set(ι){ this["∃"] = true ;this.host = {enumerable:ι} } })
def(Property.prototype,'🔒',{ get(){return !this.host.configurable } ,set(ι){ this["∃"] = true ;this.host = {configurable:!ι} } })
def(Property.prototype,'value',{ get(){return this.host.value } ,set(ι){ this["∃"] = true ;this.host = {value:ι} } })
def(Property.prototype,'get',{
	set(ι){ this["∃"] = true ;this.host = {get:ι} }
	// ,get(){ h ← @.host ;↩ h && 'get' in h? h.get : => @.host.value }
	})
def(Property.prototype,'set',{
	set(ι){ this["∃"] = true ;this.host = {set:ι} }
	// ,get(){ h ← @.host ;↩ h && 'get' in h? h.set : (ι=> @.host = {value:ι}) }
	})
E.𐅯𐅭𐅝𐅨𐅮 = new Proxy({},{get(ˣ,id){return new Property(𐅋𐅨𐅦𐅨𐅭,id) }}) ;γ.𐅋𐅨𐅦𐅨𐅭 = undefined

Property.prototype["map!"] = function(f){ this.ι = f(this.ι,this._id,this.o) ;return this }
Property.prototype.Δ = function(f){
	var ι; this [γ['…←']] ({ get(){return ι } ,set(_ι){ f(_ι) ;ι = _ι } ,"🔒":true })
	return this }
def(Property.prototype,'fbind',{ get(){return this.ι.bind(this.o) } })
Property.prototype.bind = function(ι){ ι instanceof Property || !function(...a){throw Error(__err_format(...a))}('‽')
	this.host = { get(){return ι.get.call(this) } ,set(ι){return ι.set.call(this,ι) } ,enumerable:ι.enumerable }
	return this }
def(Property.prototype,'thunk',{
	set(ι){ var _id = this._id
		var get = Tfun(ι)? function(){return this[_id] = ι.call(this) } : T.Promise(ι)? ()=> ι.ι : !function(...a){throw Error(__err_format(...a))}('‽')
		this .host= { configurable:true ,get ,set(ι){ this[γ["|>"]] (o=>( 𐅋𐅨𐅦𐅨𐅭 = o ,𐅯𐅭𐅝𐅨𐅮 ))[_id] .host= { value:ι ,writable:true } } } } })

//################################## requires ###################################
;[ ['events','EventEmitter'],['fs'],['http'],['https'],['module','Module'],['net'],['os'],['querystring'],['readline'],['stream'],['util'],['vm'],['zlib'],['underscore','_u'],['lodash','_l'],['highland','_h']
	].map(([ι,n])=> E[γ["|>"]] (o=>( 𐅋𐅨𐅦𐅨𐅭 = o ,𐅯𐅭𐅝𐅨𐅮 ))[n||ι] .thunk=()=> require(ι) )
var path = require('path')
var fs = require('fs')
E._ = _u
_u.mixin({ isEqual:_l.isEqual })
E.require_new = ι=> (𐅋𐅦𐅪𐅪𐅂||(𐅋𐅦𐅪𐅪𐅂= npm`require-uncached@1.0.3` ))( (ι+'').replace(/^\.(?=\/)/,φ.cwd) ) ;var 𐅋𐅦𐅪𐅪𐅂;

//################################### ζ infra ###################################
var lazy_fn = f=>{var t; return function(){return (t||(t=f())).apply(this,arguments) } } // takes a thunk which returns a function. acts like said returned function, always.
// so Bad

// E.js_tokenize = code=>{
// 	tok ← npm`babylon@6.14.1`.parse(code,{allowReturnOutsideFunction:✓}).tokens
// 	↩ _u.zip( tok.map(ι=> code.slice(ι.start,ι.end)) ,tok.windows(2).map(([a,b])=> code.slice(a.end,b.start) ) )._.flatten(✓).filter(ι=>ι) }
// E.uses_this = f=> (f+'').match(/\bthis\b/) && js_tokenize('('+f+')').includes('this')? 'maybe' : ✗
E.ζ_compile = lazy_fn(()=>{ var 𐅭𐅋𐅦𐅝𐅜; var 𐅨𐅋𐅦𐅜𐅦; var 𐅜𐅦𐅩𐅝𐅃; var 𐅂𐅂𐅃𐅝𐅦; var 𐅨𐅂𐅫𐅯𐅃; var 𐅜𐅯𐅩𐅪𐅃; var 𐅝𐅩𐅭𐅪𐅃; var 𐅭𐅭𐅃𐅪𐅃; var 𐅭𐅦𐅫𐅩𐅝; var 𐅦𐅞𐅃𐅝𐅪; var 𐅦𐅪𐅭𐅯𐅭; var 𐅪𐅯𐅯𐅯𐅦;
	var word_extra = re`♈-♓🔅🔆‡⧫§▣⋯`
	var word = re`A-Za-z0-9_$ʰ-ʸˡ-ˣΑ-ΡΣ-ωᴬ-ᵛᵢ-ᵥᶜᶠᶻ⁰ⁱⁿₐ-ₓₕ-ₜℂℕℚℝℤⱼⱽ⚓𐅂𐅃𐅋𐅜𐅝𐅞𐅦𐅨𐅩𐅪𐅫𐅬𐅭𐅮𐅯𐅰𐑐-𐑿${word_extra}∞`
	var ζ_parse = E.ζ_parse = (()=>{
		var P = require('./parsimmon2.js')
		var ident = P(re`(?![0-9])[${word}]+|@`)
		var comment = re`(//.*|/\*[^]*?(\*/|$)|#[\s#].*)+`
		var simple_js = P(()=> P.alt(
			P(comment).T`comment`
			,P.seq( P('{') ,simple_js ,P('}') )
			,P.seq( P.alt(
				P(/(['"])(((?!\1)[^\\]|\\.)*?\1)/).T`string`
				,ident
				,P.seq( P('`').T`template` ,tmpl_ι.many() ,P('`').T`template` )
				,P(/[)\]0-9]/)
				) ,P.alt( P(re`[ \t]*(?!${comment})/`) ,P.of('') ) )
			,P(/\[#persist_here .*?\]/)
			,P(re`/((?:[^/\\\[]|(?:\\.)|\[(?:[^\\\]]|(?:\\.))*\])*)/([a-z]*)`).T`regex`
			,P(re`[^{}/#'"…${'`'})@\[\]${word}]+|[^}]`)
			).many() )
		var tmpl_ι = P.alt( P.seq( P('${').T`template` ,simple_js ,P('}').T`template` ) ,P(/(?:\\[^]|(?!`|\$\{)[^])+/).T`template` )
		var js_file = P.seq( P(/(#!.*\n)?/).T`shebang` ,simple_js )
		return code=>{
			var ι = js_file.parse(code)._.flatten()
			var r = [] ;for(var t of ι) t.T? r.push(t) : r[-1]&&r[-1].T? r.push(t) : (r[-1]+=t)
			return r } })()
	var s_or = ι=> re`(?:…${ι.split(' ').map(ι=> re`${ι}`.source).join('|')})`
	var id_c = 'filter! map… map! ⁻¹declare_uniq then⚓ ⁻¹ ∪! ∩! -! ?? *? +? ∪ ∩ ⊕ ≈ ‖ ⚓ -= += ? * + & | ∃ ∋ × ! -0 -1 -2 -3 -4 - 🔒'
	var id_num = '0 1 2 3 4'
	var ζ_compile_nonliteral = ι=> ι
		.replace(/ifΔ!/g,'ifΔbang')
		.replace(/(=>|[=←:(,]) *(?!\.\.\.)(‘?\.)/g,(ˣ,a,b)=> a+'(𐅭𐅞)=>𐅭𐅞'+b )
		.replace(𐅦𐅪𐅭𐅯𐅭||(𐅦𐅪𐅭𐅯𐅭= re`‘\.([${word}]+)`.g ),(ˣ,ι)=> js`|> (ι=> new Property(ι,${ι}))` )
		.replace(/‘(?=\[)/g ,`|> (o=>( 𐅋𐅨𐅦𐅨𐅭 = o ,𐅯𐅭𐅝𐅨𐅮 ))` )
		.replace(𐅦𐅞𐅃𐅝𐅪||(𐅦𐅞𐅃𐅝𐅪= re`(?:…${[...postfix].map(ι=> re`${ι}`.source).join('|')})(?=\s*([(:])?)`.g ),(id,right)=>0?0: { undefined:js`γ[${id}]` ,'(':js`[γ[${id}]]` ,':':js`${id}` }[right] )
		.replace(/✓/g,'true')
		.replace(/✗/g,'false')
		.replace(/∅/g,'undefined')
		.replace(𐅜𐅯𐅩𐅪𐅃||(𐅜𐅯𐅩𐅪𐅃= re`🏷([${word}]+)(\s*)←`.g ),(ˣ,ι,s)=> js`…${ι+s}← 𐅫𐅮𐅪𐅰𐅃(__name(${ι})).ι=`) // an initial try ;probably .name inference needs another form
		.replace(/‘lexical_env/g,`𐅫𐅮𐅪𐅰𐅃(ι=> ι.eval_in_lexical_env= ι=>eval(ι) ).ι=`)
		.replace(/‽(?=(\(|`)?)/g,(ˣ,callp)=> `!λ(…a){throw Error(__err_format(…a))}${callp? `` : `('‽')`}` ) // these days i would do it with a symbol nameifying and a global?
		.replace(𐅨𐅋𐅦𐅜𐅦||(𐅨𐅋𐅦𐅜𐅦= re`(\[[${word},…]+\]|\{[${word},:…]+\}|[${word}]+)(\s*)←(?=[ \t]*(;|of\b|in\b)?)`.g ),(ˣ,name,ws,eq0)=> 'var '+name+ws+(eq0?'':'=') )
		.replace(/λ(?=\*?(?:[ \t][^\(=←]*)?\([^\)]*\)[ \t]*\{)/g,'function')
		.replace(𐅂𐅂𐅃𐅝𐅦||(𐅂𐅂𐅃𐅝𐅦= re`\.?@@([${word}]+)`.g ),'[Symbol.$1]')
		.replace(𐅪𐅯𐅯𐅯𐅦||(𐅪𐅯𐅯𐅯𐅦= re`\.\.(${s_or(id_num)})`.g ),(ˣ,ι)=> `[${ι}]`)
		.replace(𐅜𐅦𐅩𐅝𐅃||(𐅜𐅦𐅩𐅝𐅃= re`\.(${s_or(id_c)})`.g ),(ˣ,ι)=> js`[${ι}]`)
		.replace(𐅝𐅩𐅭𐅪𐅃||(𐅝𐅩𐅭𐅪𐅃= re`(${s_or(id_c)}):`.g ),(ˣ,ι)=> js`${ι}:`)
		.replace(/…/g,'...')
		.replace(/(['"])map\.\.\.\1/g,`'map…'`) // ! this is going to be really hard to take out
		.replace(/(['"])\.\.\.←\1/g,`'…←'`) // ! this is going to be really hard to take out
		.replace(/@/g,'this')
		.replace(/\.‘this/g,'["‘@"]')
		.replace(/∞/g,'Infinity')
		.replace(/⇒(\s*([:{]))?/g,(ˣ,x,ι)=> '=>'+({ ':':'0?0' ,'{':'0?0:' }[ι]||!function(...a){throw Error(__err_format(...a))}('‽'))+x )
		.replace(𐅭𐅦𐅫𐅩𐅝||(𐅭𐅦𐅫𐅩𐅝= re`(^|[^\s\)${word}]\s*)(=>(?:\s*=>)*)`.g ),(ˣ,t,ι)=> t+'()=>'["×"](ι.match(/=>/g)["‖"]))
		.replace(/↩ ?/g,'return ')
		.replace(/(^|[^])\^/g, (ˣ,ι)=> ι+(ι==='b'? '^' : '**') )
		.replace(𐅨𐅂𐅫𐅯𐅃||(𐅨𐅂𐅫𐅯𐅃= re`#swap ([${word}.]+) ([${word}.]+)`.g ),(ˣ,a,b)=>{ var t = '_'+random_id.greek(9) ;return ζ_compile_nonliteral(`for(;;){ ${t} ← ${a} ;${a} = ${b} ;${b} = ${t} ;break}`) }) // why not just [a,b] = [b,a]?
		.replace(/\[#persist_here (.*?)\]/g,(ˣ,ι)=> '('+json2_read+js`)(${json2_show(φ(ι).buf)})`)
		.replace(𐅭𐅋𐅦𐅝𐅜||(𐅭𐅋𐅦𐅝𐅜= re`[${word_extra}]+`.g ), unicode_names.X) // ! eventually, remove the thing with two underscores next to each other __
		.replace(/([{([]\s*),/g,'$1')
		.replace(𐅭𐅭𐅃𐅪𐅃||(𐅭𐅭𐅃𐅪𐅃= re`return\s+var\s+([${word}]+)`.g ), (ˣ,ι)=> `var ${ι} ;return ${ι}`)
	return memoize_tick(code=>{
		var t = code ;t = /^(\{|λ\s*\()/.test(t)? '0?0: '+t : t ;if( /^(\{|λ\s*\()/.test(t) ) t = '0?0: '+t // ! it is a clumsy hack to put this on all of these code paths
		return ζ_parse(t).map(ι=>0?0
			: ι.T==='comment'? ι.ι.replace(/^#/,'//')
			: ι.T? ι.ι
			: ζ_compile_nonliteral(ι)
			).join('') }) })
ζ_compile["⁻¹"] = ι=> ι.replace(/\b(?:function|return|this)\b(?!['"])|\bvar \s*([\w_$Α-ΡΣ-Ωα-ω]+)(\s*)(=?)|\.\.\./g, (ι,name,s,eq)=>0?0: {'function':'λ','return':'↩','this':'@','...':'…'}[ι] || (eq==='='? name+s+'←' : name+s+'←;') )
E.__name = name=>(𐅭𐅞)=>𐅭𐅞[γ["|>"]] (ι=> new Property(ι,"name")) [γ["!>"]]((𐅭𐅞)=>𐅭𐅞.enumerable= false) .value= name
E.__err_format = (...a)=> Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))

if( require.extensions && !require.extensions['.ζ'] )(()=>{
	require.extensions['.ζ'] = (module,ι)=> module._compile(ζ_compile(fs.readFileSync(ι,'utf8')),ι)
	var super_ = require.extensions['.js'] ;require.extensions['.js'] = (module,ι)=>{ (path.extname(ι)==='' && fs.readFileSync(ι,'utf8').re`#!/usr/bin/env ζ\s`? require.extensions['.ζ'] : super_)(module,ι) }
	})()

//################################### ζ infra ###################################
var Reflect_ownEntries = ι=> Reflect.ownKeys(ι).map(i=> [i,ι[i]])
var define_properties_in = (o,names,ι)=>{ var t = o ;for(var i of names.slice(0,-1)) t = (t[i] ||( t[i] = {} )) ;t[names[names.length-1]] = ι ;return o }
var assign_properties_in = (o,ι)=> Reflect_ownEntries(ι).forEach(([i,ι])=> Tfun(ι)? ι(o,i) : assign_properties_in(o[i] ||( o[i] = {} ),ι) )
var sym_eval = ι=>{var t; return (t= ι.match(/^@@(.*)/))? Symbol[t[1]] : ι }

// mixin_forever ← (to,from)=>{}
// mixin_forever_informal ← (to,from)=>{}
var properties_tree_formalify = ι=>
	_u(_u(ι).map((ι,names)=> genex_simple(names).map(i=> [i,ι]))).flatten(true)
		.reduce((r,[name,ι])=> define_properties_in( r
			,name.split('.').map(sym_eval)
			,(o,i)=> Tfun(ι)? o[i] = ι : def0(o,i,ι)
			) ,{})
var assign_properties_in_E_informal = ι=>{ ι = properties_tree_formalify(ι) ;[...patched].forEach(o=> assign_properties_in(o,ι)) }
module.exports = to=> patched.has(to) || ( cn.log('\x1b[34m[ζ]\x1b[0m patching') ,cn.log(Error('<stack>').stack) ,patched.add(to) ,assign_properties_in(to,E_) )

//################################### prelude ###################################
E.protos = function*(ι){ for(;!( ι===null || ι===undefined ) ;ι = Object.getPrototypeOf(ι)) yield ι }
var buf36 = lazy_fn(()=> npm`base-x@1.0.4`([.../[0-9a-z]/].join('')).encode)
E.simple_flesh = ι=>{
	if( Tfun(ι) )return T(ι)+ι
	var t = [ ι,(i,ι)=>{ if( Tprim(ι)||Tarr(ι)) return ι ;else{ var r={} ;_u.keys(ι).sort().forEach(i=> r[i]=ι[i]) ;return r } } ]
	// try{
	return JSON.stringify(...t) }
	// }catch(e){ if( e.message==='Converting circular structure to JSON' )↩ npm`circular-json@0.4.0`.stringify(ι) ;throw e } }
E.simple_hash = ι=> (𐅜𐅪𐅫𐅪𐅃||(𐅜𐅪𐅫𐅪𐅃= npm`xxhash@0.2.4`.hash64 ))(Buffer.from(simple_flesh(ι)),0x594083e1) [γ["|>"]] (ι=> ('0'["×"](12)+buf36(ι)).slice(-12)) ;var 𐅜𐅪𐅫𐅪𐅃; // best hash is murmurhash.v3.128

var memo_frp = (names,within,f)=>{
	var dir = φ`~/file/.cache/memo_frp/${names}`
	if( within ){
		try{ var t = fs.readdirSync(dir+'') }catch(e){ if( !(e.code==='ENOENT')) throw e ;var t = [] }
		var now = Time().i ;t = t.sort().filter(ι=> Time(ι.re`^\S+`[0]).i >= now - within )[-1]
		if( t ) return dir.φ(t).json2.ι }
	var a = Time().iso ;var ι = f() ;var b = Time().iso
	dir.φ`${a} ${random_id(10)}`.json2 = { names ,date:[a,b] ,ι } ;return ι }
E.memoize_persist = f=>{
	// may race condition but is unlikely & relatively harmless
	var store = φ`/tmp/ζpersist_${simple_hash(f)}` ;var store_ι = store.json||{}
	return (...a)=>{ var t = store_ι[γ["|>"]] (o=>( 𐅋𐅨𐅦𐅨𐅭 = o ,𐅯𐅭𐅝𐅨𐅮 ))[simple_hash(a)] ;return t["∃"]? t.ι : ( t.ι = f(...a) ,store.json = store_ι ,store_ι = store.json ,t.ι ) } }
E.memoize_proc = f=>{ var cache = Object.create(null) ;return (ι=>{ var t = ι+'' ;return t in cache? cache[t] :( cache[t] = f(ι) ) }) [γ['…←']] ({cache}) }
E.memoize_weak = f=>{ var cache = new WeakMap() ;return (ι=>{ if( cache.has(ι) ) return cache.get(ι) ;Tprim(ι) && !function(...a){throw Error(__err_format(...a))}('‽') ;var r = f(ι) ;cache.set(ι,r) ;return r }) [γ['…←']] ({cache}) }
// resource management is a thing & i havent thought about it enough
// WeakMap doesn't fix memoization resource management when keys are Tprim or equality isn't ===
// this does
E.memoize_tick = f=>{ f = memoize_proc(f) ;var cache = f.cache ;return (ι=>{ var t = ι+'' ;process.nextTick(()=> delete cache[t]) ;return f(ι) }) [γ['…←']] ({cache}) }
// ? frp will remove the last use(s) of @device
E.thisdevice = ι=> φ`~/Library/Caches/ζ.persist.0/${ι+''}`[γ["|>"]] (ι=> new Property(ι,"json"))
E.thisproc = ι=> 𐅜𐅩𐅭𐅦𐅰[γ["|>"]] (o=>( 𐅋𐅨𐅦𐅨𐅭 = o ,𐅯𐅭𐅝𐅨𐅮 ))[ι+''] ;var 𐅜𐅩𐅭𐅦𐅰 = {}
E.slot_persist = thisdevice

// ;[#p ersist_here ~/code/declare/npm]
var _npm = ι=>{var [ˣ,name,version,sub] = ι.re`^(.*?)(?:@(.*?))?(/.*)?$`
	// in theory, log whenever somebody uses an outdated lib
	var abs_name = ()=> name+'@'+version
	if(! version ){ sfx`ack` ;version = shᵥ`npm show ${ι} version`+'' ;return 'npm`'+abs_name()+'`' ;return }
	var cache = φ`~/.npm/${name}/${version}` ;var final = cache.φ`/node_modules/${name}`+(sub||'')
	try{ return require(final) }catch(e){ if( !(e.code==="MODULE_NOT_FOUND")) throw e }
	cache.BAD_exists() || shᵥ`cd ~ ;npm cache add ${abs_name()}`
	var a;var b; (a=cache.φ`package.json`).ι = {description:'-',repository:1,license:'ISC'} ;(b=cache.φ`README`).ι = '' ;shᵥ`cd ${cache} && npm --cache-min=Infinity i ${abs_name()}` ;a.ι = b.ι = undefined
	return require(final) }
E.npm = ι=> ((ι+='').includes('@')? 𐅪𐅰 : _npm)(ι) ;var 𐅪𐅰 = memoize_proc(_npm) // such a hack. takes 300ns because of the template string +='' hack ;80ns without

E.unicode_names = ι=> [...ι].map(memoize_persist(ι=>
	(𐅩𐅩𐅩𐅝𐅋||(𐅩𐅩𐅩𐅝𐅋= (()=>{
		var unicode_data = 'Cc Cf Co Cs Ll Lm Lo Lt Lu Mc Me Mn Nd Nl No Pc Pd Pe Pf Pi Po Ps Sc Sk Sm So Zl Zp Zs'.split(' ')['map…'](ι=> _u.values(npm('unicode@0.6.1/category/'+ι)) )
		return unicode_data.filter(ι=> !/^</.test(ι.name)).map(ι=> [parseInt(ι.value,16) ,'_'+ι.name.replace(/[- ]/g,'_').toLowerCase()+'_'])._.object()
		})() ) )[ord(ι)]).X).join('') ;var 𐅩𐅩𐅩𐅝𐅋;

E.regex_parse_0 = lazy_fn(()=>{var t; // status: output format unrefined
	var P = require('./parsimmon2.js')
	var dehex = ι=> chr(parseInt(ι,16))
	var ESCAPE = P('\\').then(P.alt( P(/x([0-9a-fA-F]{2})/,1).map(dehex) ,P(/u\{([0-9a-fA-F]+)\}/,1).map(dehex) ,P(/u([0-9a-fA-F]{4})/,1).map(dehex) ,P(/./).map(ι=> '.[|^$()*+?{}\\/'.includes(ι)? ι : P.T('escape',ι) ) ))
	var s1 = P.alt(
		P(/[^.()[\]^$|\\]/)
		,ESCAPE
		,P`.`.T`any`
		,P`(?:${()=>OR_or_SEQ})`
		,P`(?=${()=>OR_or_SEQ})`.T`lookahead`
		,P`(?!${()=>OR_or_SEQ})`.T`nlookahead`
		,P`(${()=>OR_or_SEQ})`.T`capture`
		,P`[${[ /\^?/ ,( t= ESCAPE.or(/[^\]]/) ,P([ t.skip('-') ,t ]).or(t) ).many() ]}]`.map(ι=> P.T(ι[0]? 'nset' : 'set' ,ι[1]))
		)
	var TIMES = P([ s1 ,P.alt('*','+','?',/\{([0-9]+)(?:(,)([0-9]*))?\}/,P.of())
		.map(ι=> ι = !ι? ι : ι==='*'? [0,Infinity] : ι==='+'? [1,Infinity] : ι==='?'? [0,1] : (()=>{ var [ˣ,a,two,b] = ι.match(/\{([0-9]+)(?:(,)([0-9]*))?\}/) ;return [a|0,b? b|0 : two? Infinity : a|0] })() )
		]).map(([ι,for_])=> !for_? ι : {T:'times' ,ι ,for:for_} )
	var s2 = P.alt( P('^').T`begin` ,P('$').T`end` ,TIMES )
	var OR_or_SEQ = P.sep_by(s2.many().T`seq` ,'|').map(ι=> ι["‖"] > 1? P.T('or',ι) : ι[0])
	// t1 ← regex_parse_0(/^(foo)(?:bep){2,7}\baz(?:\\b.ar|[a-c-e()}][^\s]|b|baz(?=gremlin)(?!groblem)|)*/i)
	return ι=>0?0: {ι:OR_or_SEQ.parse(ι.source) ,flags:ι.flags} })
E.applescript = {
	parse: lazy_fn(()=>{
	  var P = require('./parsimmon2.js')
	  var ws = ι=> ws_.then(ι).skip(ws_) ;var ws_ = P(/[ \t\n\r]*/)
	  var value = P(()=> P.alt(false_,true_,number,object,array,string,raw) )
	  var false_ = P('false').map(()=> false)
	  var true_ = P('true').map(()=> true)
	  var number = P(/-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][-+]?[0-9]+)?/).map(ι=> +ι)
	  var _member = P.seq(P(/[ a-z0-9-]+/i).skip(ws(P(':'))) ,value)
	  var object = ws(P('{')).then(P.sep_by(_member,ws(P(',')))).skip(ws(P('}'))).map(ι=> ι["‖"]? _u.object(ι) : [])
	  var array = ws(P('{')).then(P.sep_by(value,ws(P(',')))).skip(ws(P('}')))
	  var _char = P(/[\n\t\x20-\x21\x23-\x5B\x5D-\u{10FFFF}]|\\(["\\\/bfnrt]|u[0-9a-fA-F]{4})/u).map(ι=> ι[0]!=='\\'? ι : {'"':'"','\\':'\\','/':'/',b:'\b',f:'\f',n:'\n',r:'\r',t:'\t'}[ι[1]] || chr(parseInt(ι.slice(2),16)) )
	  var string = P('"').then( _char.many().map((𐅭𐅞)=>𐅭𐅞.join('')) ).skip(P('"'))
	  var raw = P(/[^,}"]+/).or(string.map_js((ι,[i0,i1],l)=> l.slice(i0,i1))).many().map(ι=>{ ι=ι.join('') ;return ι==='missing value'? undefined : {T:'raw',ι} })
	  return ι=> ι===''? undefined : ws(value).parse(ι) }),
	print: ι=> Tnum(ι)? ι+'' : Tstr(ι)? '"'+ι.replace(/["\\]/g,'\\$&')+'"' : Tarr(ι)? '{'+ι.map(applescript.print.X).join(',')+'}' : !function(...a){throw Error(__err_format(...a))}('‽'),
	}
// E.lenient_json_parse = (=>{
// 	P ← require('./parsimmon2.js')

// 	whitespace ← P(/\s*/m)
// 	escapes ← { ,b:'\b' ,f:'\f' ,n:'\n' ,r:'\r' ,t:'\t' }
// 	un_escape ← (str)=> str.replace(/\\(u[0-9a-fA-F]{4}|[^u])/, (ˣ,escape)=> escape[0]==='u'? chr(parseInt(escape.slice(1),16)) : escapes[escape[0]] || escape[0] )
// 	comma_sep ← (parser)=> P.sepBy(parser ,token(P(',')))
// 	token ← p=> p.skip(whitespace)

// 	l_null ← token(P('null')).map(=> null)
// 	l_t ← token(P('true')).map(=> ✓)
// 	l_f ← token(P('false')).map(=> ✗)
// 	l_str ← token(P(/"((?:\\.|.)*?)"/, 1)).map(un_escape).desc('string')
// 	l_num ← token(P(/-?(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/)).map(Number).desc('number')

// 	json ← P.lazy(=> whitespace.then(P.alt( object ,array ,l_str ,l_num ,l_null ,l_t ,l_f )) )
// 	array ← token(P('[')).then(comma_sep(json)).skip(token(P(']')))
// 	pair ← P.seq(l_str.skip(token(P(':'))), json)
// 	object ← token(P('{')).then(comma_sep(pair)).skip(token(P('}'))).map(ι=> _u.object(ι))
// 	↩ ι=> json.parse(ι).value })()
E.JSON_pretty = (ι,replacer)=>{
	var seen = []
	var T = '  ' // tab
	var wrap_width = 140
	var indent_show = ι=> show(ι).replace(/\n/g,'\n'+T)
	var show = ι=>{var t;
		if( ι===undefined||ι===null) return 'null'
		replacer && (ι = replacer(ι))
		while (ι.toJSON) ι = ι.toJSON()
		switch (typeof(ι)==='object'? Object.prototype.toString.call(ι) : typeof(ι)) {
			case 'string': case '[object String]': return JSON.stringify(ι)
			case 'boolean': case '[object Boolean]': case 'number': case '[object Number]': return ι+''
			case 'function': return 'null'
			default:
				if( seen.indexOf(ι) !== -1) throw TypeError('Converting circular structure to JSON')
				seen.push(ι)
				if( Tarr(ι)) { var [a,b] = '[]' ;ι = ι.map(indent_show) ;for (var i=0;i<ι["‖"];i++) ι[i]===undefined && (ι[i] = 'null') }
				else { var [a,b] = '{}' ;ι = _u.pairs(ι).filter(ι=> !(ι[1]===undefined || Tfun(ι[1]))).map(ι=> show(ι[0])+': '+indent_show(ι[1])) }
				seen.pop()
				return (t=a+ι.join(', ')+b)["‖"] <= wrap_width? t : a+'\n'+T+ι.join(',\n'+T)+'\n'+b
				} }
	return show(ι) }
var cartesian_str =(𐅭𐅞)=>𐅭𐅞.reduce((a,b)=>{ var r = [] ;a.forEach(a=> b.forEach(b=> r.push(a+b))) ;return r } ,[''])
var genex_simple = ι=>{ var P = require('parsimmon')
	var unit = P.lazy(()=> P.alt( P.noneOf('()|') ,P.string('(').then(s_or).skip(P.string(')')).map(ι=>0?0:{T:'capture',ι}) ) )
	var s_or = P.sepBy(unit.many(),P.string('|')).map(ι=> ι.length > 1? {T:'or',ι:ι} : ι[0])
	var Λ = ι=> ι.T==='or'? ι.ι.map(Λ) : ι.T==='capture'? Λ(ι.ι) : Tarr(ι)? cartesian_str(ι.map(Λ)) : [ι]
	return Λ(P.alt( P.string('|') ,unit ).many().parse(ι).value) }
var genex = function Λ(ι){return 0,
	Tstr(ι)? [ι] :
	ι.flags!==undefined?( ι.flags.replace(/u/,'') && !function(...a){throw Error(__err_format(...a))}('‽') ,Λ(ι.ι) ):
	ι.T==='capture'? Λ(ι.ι) :
	ι.T==='escape'? !function(...a){throw Error(__err_format(...a))}('‽') :
	ι.T==='or'? ι.ι['map…'](Λ) :
	ι.T==='seq'? cartesian_str(ι.ι.map(Λ)) :
	// ι.T==='times'? # Λ(ι.ι).map…(x=> _u.range(ι.for[0],ι.for[1]+1).map(i=> x.×(i)) ) :
	// 	ιs ← Λ(ι.ι)
	ι.T==='set'? ι.ι['map…'](ι=>
		Tarr(ι)? _u.range(ord(ι[0]),ord(ι[1])+1).map(chr) :
		ι.T==='escape'? !function(...a){throw Error(__err_format(...a))}('‽') :
			[ι] ):
		!function(...a){throw Error(__err_format(...a))}(ι) }

E [γ['…←']] (_u(Math).pick('abs','ceil','exp','floor','log10','log2','max','min','round','sqrt','cos','sin','tan'),{ ln:Math.log ,π:Math.PI ,τ:Math.PI*2 ,e:Math.E ,'⍟':Math.log })
E.bench = (f,opt={})=>{ var {TH=0.4} = opt
	// ! really should include a confidence interval or smth
	var r=0 ;var I=1 ;var hr=hrtime() ;var R = ()=> Unit(hrtime(hr) / r,'s')
	var t=f() ;r++
	if( T.Promise(t) ) return Π(yes=>{ t.then(function Λ(){ if( hrtime(hr) < TH ){ r++ ;f().then(Λ) }else yes(R()) }) })
	else{ for(;hrtime(hr) < TH;){ for(var i=0;i<I;i++) f() ;r += I ;I = ceil(I*1.5) } ;return R() } }
E.bench1 = f=>{ var hr = hrtime() ;f() ;return Unit(hrtime(hr),'s') }
E.GET_L = (ι,within)=> memo_frp(['GET -L' ,ι+''] ,within ,()=> shᵥ`curl -sL ${ι}`)
// ! some requests have short responses ;will need more intelligent caching for those 'cause the filesystem can't take too much
// ! curl error code 6 means can't resolve & is crashing things maybe
E.random = function(ι){return arguments.length===0? Math.random() : Tnum(ι)? random()*ι |0 : _u.sample(ι) }
E.random_id = L=> L.map(()=> random(𐅭𐅞𐅯𐅩𐅪||(𐅭𐅞𐅯𐅩𐅪= [.../[0-9a-z]/]))).join('') ;var 𐅭𐅞𐅯𐅩𐅪;
random_id.braille = L=> L.map(()=> random(𐅩𐅞𐅂𐅜𐅯||(𐅩𐅞𐅂𐅜𐅯= [...re`[⠁-⣿]`] ))).join('') ;var 𐅩𐅞𐅂𐅜𐅯; // [⠀-⣿]
random_id.greek = L=> L.map(()=> random(𐅋𐅃𐅃𐅰𐅰||(𐅋𐅃𐅃𐅰𐅰= [...'𐅂𐅃𐅋𐅜𐅝𐅞𐅦𐅨𐅩𐅪𐅫𐅬𐅭𐅮𐅯𐅰'] ))).join('') ;var 𐅋𐅃𐅃𐅰𐅰;

E.ord = (ι,i)=> Tnum(ι)? ι : ι.codePointAt(i)
E.chr = ι=> Tstr(ι)? ι : String.fromCodePoint(ι)
process.stdio = [ process.stdin,process.stdout,process.stderr ]
E._pisces__on_exits = f=> (𐅰𐅞𐅜𐅯𐅨||(𐅰𐅞𐅜𐅯𐅨= require('signal-exit') ))((i,sig)=>{
	if( i===null ) i = 128+{ SIGHUP:1,SIGINT:2,SIGQUIT:3,SIGTRAP:5,SIGABRT:6,SIGIOT:6,SIGSYS:12,SIGALRM:14,SIGTERM:15,SIGXCPU:24,SIGXFSZ:25,SIGVTALRM:26,SIGUSR2:31 }[sig]
	f(i,sig) }) ;var 𐅰𐅞𐅜𐅯𐅨;
E.pad_r = (ι,s)=> [ι,s.slice(ι["‖"])].fold(Tstr(ι)? (a,b)=> a+b : Tarr(ι)? (a,b)=> [...a,...b] : !function(...a){throw Error(__err_format(...a))}('‽'))

var 𐅯𐅩𐅪𐅨𐅃 = function*(θ){ for(;θ.i<θ.l["‖"];) yield θ.l[θ.i++] }
E.seq = ι=>{
	var r = Object.create(seq.prototype)
	if( Tarr(ι) ){ ;r.ι = 𐅯𐅩𐅪𐅨𐅃(r) ;r.i = 0 ;r.l = ι }
	else if( !ι.next ) r.ι = ι[Symbol.iterator]()
	else r.ι = ι
	return r }
seq.prototype = {
	ι:undefined ,i:undefined ,l:undefined
	,map:function*(f){ for(var t of this.ι) yield f(t) }
	// ,'map…':λ(){} ,fold(){} ,×(){} ,filter(){} ,pin(){} ,find_(){} ,slice(){} ,'‖':λ(){} ,some(){} ,every(){}
	}
seq.prototype[γ["|>"]] (ι=> new Property(ι,"next_ι")) .get= function(){return this.ι.next().value }
seq.prototype[γ["|>"]] (ι=> new Property(ι,"next_ιι")) .get= function(){ var t = this.ι.next() ;if( t.done )return ;t = t.value ;t===undefined && !function(...a){throw Error(__err_format(...a))}('‽') ;return t }
seq.prototype[γ["|>"]] (ι=> new Property(ι,"clone")) .get= function(){ var t= seq(this.l) ;t.i= this.i ;return t }
// (λ*(){ yield 5 })().next()
// Object.getOwnPropertyDescriptors([…protos(λ*(){}())][2])
// […protos(new Set())].map(Object.getOwnPropertyDescriptors)
// […protos(new Set().@@iterator())].map(Object.getOwnPropertyDescriptors)
// ok,,,, the cloneability property desired here is fundamentally impossible
// yay

E._midline_horizontal_ellipsis_ = ι=> _u.range(ι)
assign_properties_in_E_informal({
'(Array|Set|Map).prototype._':{ get(){return _u(this)} }

,'(Array|Buffer|String|Function).prototype.‖':{ get(){return this.length } }
,'(Set|Map).prototype.‖':{ get(){return this.size } }

// 'Array.prototype.map'
// ,'Buffer.prototype.map':λ(f){ r ← Buffer.alloc(@.‖) ;for(i←0;i<@.‖;i++) r.push(f(@[i])) ;↩ r } does not even work
,'Set.prototype.map':function(f){return [...this].map(f) }
,'Map.prototype.map':function(f){return [...this.entries()].map(([i,ι])=> f(ι,i,this)) }
,'Number.prototype.map':function(f){'use strict' ;var ι=+this ;var r = Array(ι) ;for(var i=0;i<ι;i++) r[i] = f(i,i,ι) ;return r }

,'Array.prototype.map…':function(f){ var r = [] ;for(var i=0;i<this["‖"];i++){ var t = f(this[i],i,this) ;for (var j=0;j<t["‖"];j++) r.push(t[j]) } ;return r }
// ,'Buffer.prototype.map…':λ(f){↩ Buffer.concat(@.map(f)) }
,'(Set|Map|Number).prototype.map…':function(f){return this.map(f)._.flatten(true) }

,'Array.prototype.fold':Array.prototype.reduce

,'Array.prototype.repeat':function(x){return x<=0? [] : x['map…'](()=> this) }
,'Buffer.prototype.repeat':function(x){return Buffer.concat(x<=0? [] : x.map(()=> this)) }

,'String.prototype.×':String.prototype.repeat
,'Array.prototype.×':function(x){return x<=0? [] : x['map…'](()=> this) }
,'Buffer.prototype.×':function(x){return Buffer.concat(x<=0? [] : x.map(()=> this)) }

,'Set.prototype.join':function(ι){return [...this].join(ι) }

,'(Array|Buffer|String|Set).prototype.count':function(){ var r = new Map() ;for (var t of this) r.set(t, (r.has(t)? r.get(t) : 0)+1 ) ;return r }
,'(Array|Buffer|String|Set).prototype.group':function(f){ f||(f = ι=>ι) ;var r = new Map() ;for (var t of this){ var t2 = f(t) ;r.set(t2, (r.get(t2)||new Set())["∪"]([t])) } ;return r }

,'Map.prototype.zip':function(...a){ a.unshift(this) ;var r = new Map() ;a.forEach((ι,i)=> ι.forEach((ι,k)=>{ var t = r.get(k) || [undefined]["×"](a["‖"]) ;t[i] = ι ;r.set(k,t) })) ;return r }

,'(Array|Buffer|String).prototype.chunk':function(L){return _u.range(0,this["‖"],L).map(i=> this.slice(i,i+L)) }
,'(Array|Buffer|String).prototype.windows':function(L){return (this["‖"]-L+1).map(i=> this.slice(i,i+L)) }
,'(Array|Buffer|String).prototype.-1':{get(){return this["‖"]<1? undefined : this[this["‖"]-1] },set(ι){ this["‖"]<1 || (this[this["‖"]-1] = ι) }}
,'(Array|Buffer|String).prototype.-2':{get(){return this["‖"]<2? undefined : this[this["‖"]-2] },set(ι){ this["‖"]<2 || (this[this["‖"]-2] = ι) }}
,'(Array|Buffer|String).prototype.-3':{get(){return this["‖"]<3? undefined : this[this["‖"]-3] },set(ι){ this["‖"]<3 || (this[this["‖"]-3] = ι) }}
,'(Array|Buffer|String).prototype.-4':{get(){return this["‖"]<4? undefined : this[this["‖"]-4] },set(ι){ this["‖"]<4 || (this[this["‖"]-4] = ι) }}

,'(Array|Set).prototype.∪':function(...a){return new Set([this,...a]['map…'](ι=> [...ι])) }
,'(Array|Set).prototype.∩':function(...a){ var r = new Set(this) ;for(var x of a){ x = T.Set(x)? x : new Set(x) ;for(var ι of r) x.has(ι) || r.delete(ι) } ;return r }
,'(Array|Set).prototype.-':function(...a){ var r = new Set(this) ;for(var t of a) for(var ι of t) r.delete(ι) ;return r }
,'(Array|Set).prototype.⊕':function(b){var a=this ;return a["-"](b)["∪"](b["-"](a)) }

,'(Set|Map).prototype.filter!':function(f){ this.forEach((ι,i)=> f(ι,i,this) || this.delete(i)) }
,'Set.prototype.pop':function(){ var t = this[0] ;this.delete(t) ;return t }
,'Set.prototype.0':{get(){return seq(this).next_ι }}
,'(Array|Set).prototype.-eq':function(...a){ var t = _u([...this]).groupBy(simple_flesh) ;a.forEach((𐅭𐅞)=>𐅭𐅞.forEach(ι=> delete t[simple_flesh(ι)])) ;return _u.values(t)._.flatten(true) }

,'Map.prototype.⁻¹declare_uniq':{get(){return new Map([...this.entries()].map(ι=>[ι[1],ι[0]])) }}
,'Map.prototype.⁻¹':{get(){return [...this.keys()].group(ι=> this.get(ι)) }}

,'Array.prototype.find_':function(f){ var r; if( this.some(function(ι,i,o){var t; if( (t= f(ι,i,o))!==undefined ){ r = [i,ι,t] ;return true } })) return r }
,'Array.prototype.find_index_deep':function(f){
	for(var i=0;i<this["‖"];i++){ var ι = this[i]
		if( Tarr(ι)){ var t = ι.find_index_deep(f) ;if( t) return [i,...t] }
		else{ if( f(ι) )return [i] }
		} }
,'Array.prototype.find_last_index':function(f){ for(var i=this["‖"]-1;i>=0;i--) if( f(this[i],i,this) ) return i }
,'Array.prototype.join2':function(ι){ var r = [] ;for(var t of this) r.push(t,ι) ;r.pop() ;return r }
// ,'Set.prototype.@@iterator':Set.prototype.values
// ,'Map.prototype.@@iterator':Map.prototype.entries
,'RegExp.prototype.@@iterator':function*(){yield* genex(regex_parse_0(this)) }
,'RegExp.prototype.exec_at':function(ι,i){ this.lastIndex = i ;return this.exec(ι) }

,'stream.Readable.prototype.pin':function(){return Π(yes=>{ var t = [] ;this.resume() ;this.on('data',ι=> t.push(ι) ).on('end',()=> yes(Buffer.concat(t)) ) })}
,'Buffer.prototype.pipe':function(to,opt){ var t = new stream.Duplex() ;t.push(this) ;t.push(null) ;return t.pipe(to,opt) }
,'EventEmitter.prototype.P':function(id){id+='' ;return Object.create(𐅯𐅜𐅝𐅃𐅋) [γ['…←']] ({host:this,id}) }
,'EventEmitter.prototype.Π':function(id){return this.P(id).Π }
})
var 𐅯𐅜𐅝𐅃𐅋 = { emit(...a){return this.host.emit(this.id,...a) } ,on(f){ this.host.on(this.id,f) ;return this } }
𐅯𐅜𐅝𐅃𐅋[γ["|>"]] (ι=> new Property(ι,"Π")) [γ['…←']] ({ get(){return Π(yes=> this.host.once(this.id,yes)) } })
Promise.prototype[γ["|>"]] = (ι,f)=> ι===Promise.prototype? f(ι) : ι.status? f(ι.ι) : ι.then(f)
Promise.prototype[γ["|>"]] (ι=> new Property(ι,"status")) .thunk= function(){var get;
	if(get= b_util&&b_util.getPromiseDetails ){ var [r,ι] = get(this) ;r = [undefined,true,false][r] ;if( r!==undefined ){ [this.status,this.ι] = [r,ι] ;return r } }
	else{ var t = r=> ι=>{ [this.status,this.ι] = [r,ι] ;return this.status } ;this.then(t(true),t(false)) ;t(undefined)(undefined) ;return this.status } }
Promise.prototype[γ["|>"]] (ι=> new Property(ι,"ι")) .thunk= function(){ if( this.status!==undefined ) return this.ι }

var TimerCons = function(a,b){this.a=a;this.b=b} ;TimerCons.prototype = {clear:function(){this.a.clear();this.b.clear()}, ref:function(){this.a.ref();this.b.ref()}, unref:function(){this.a.unref();this.b.unref()}}
assign_properties_in_E_informal({
'Function.prototype.P':function(...a){return this.bind(undefined,...a) }
,'Function.prototype.X':{get(){return ι=> this(ι) }}
,'Function.prototype.XX':{get(){return (a,b)=> this(a,b) }}
,'Function.prototype.defer':function(){return setImmediate(this) }
,'Function.prototype.in':function(time){return setTimeout(this,max(0,time||0)*1e3) }
,'Function.prototype.in_Π':function(time){return Π((yes,no)=> setTimeout(()=> Π(this()).then(yes,no),(time||0)*1e3)) }
,'Function.prototype.every':function(time,opt){opt||(opt={}) ;var r = setInterval(this,max(0,time)*1e3) ;return !opt.leading? r : new TimerCons(this.in(0),r) }
// ,'Function.prototype.Π':λ(){ ... }
})

;[Set,Map].map(Seq=>
	Object.getPrototypeOf( new Seq().entries() ) [γ['…←']] ({
		map(f){return [...this].map(f) }
		}) )
var t; Object.getPrototypeOf(( t=setImmediate(()=>{}), clearImmediate(t), t )) [γ['…←']] ({
	clear(){ clearImmediate(this) }
	,ref(){} ,unref(){}
	})
var t; Object.getPrototypeOf(( t=setTimeout(()=>{},0), clearTimeout(t), t )) [γ['…←']] ({
	clear(){ this._repeat? clearInterval(this) : clearTimeout(this) }
	})

E.walk = (ι,f,k,o)=>( Tprim(ι)||_u(ι).forEach((ι,k,o)=> walk(ι,f,k,o)), ι!==undefined && ι!==null && f(ι,k,o), ι )
E.walk_graph = (ι,f,seen=[])=> !( Tprim(ι) || seen.includes(ι) ) && ( seen.push(ι), _u(ι).forEach(ι=> walk_graph(ι,f,seen)), seen.pop(), ι!==undefined && ι!==null && f(ι), ι )
E.walk_both_obj = (ι,fᵃ,fᵇ,fseen,seen=[])=> fseen && seen.includes(ι)? fseen(ι) : !( Tprim(ι) || Tfun(ι) || seen.includes(ι) ) && ( fᵃ(ι), seen.push(ι), _u(ι).forEach(ι=> walk_both_obj(ι,fᵃ,fᵇ,fseen,seen)), seen.pop(), fᵇ(ι), ι )
E.walk_fold = (ι,f,k,o)=> Tprim(ι)? ι : Tarr(ι)? ( ι = ι.map((ι,k,o)=> walk_fold(ι,f,k,o)), f(ι,k,o) ) : ( ι = _u(ι).map((ι,k,o)=> [k,walk_fold(ι,f,k,o)])._.object(), f(ι,k,o) )
E.walk_obj_edit = (ι,f)=> Tprim(ι) || Tfun(ι)? ι : Tarr(ι)? ι.map(ι=> walk_obj_edit(ι,f)) : (()=>{ for (var k in ι) if( Object.prototype.hasOwnProperty.call(ι,k)) ι[k] = walk_obj_edit(ι[k],f) ;return f(ι) })()
E.search_obj = (ι,f)=>{ var r=[] ;walk(ι,(ι,k,o)=> ι!==undefined && ι!==null && f(ι,k,o) && r.push(ι)) ;return r }
E.search_graph = (ι,f)=>{ var r=[] ;walk_graph(ι,ι=> ι!==undefined && ι!==null && f(ι) && r.push(ι)) ;return r }
// the right name for walk is going to be along the lines of
// f /@ x       x.map(f)
// f //@ x      postwalk(x,f) # MapAll
// it could be a data structure that you can fmap over

E.hrtime = function(ι){ var t = arguments.length===0? process.hrtime() : process.hrtime([ι|0,(ι-(ι|0))*1e9]) ;return t[0] + t[1]*1e-9 }
E.Time = function(ι){ var r = arguments.length===0? new Date() : ι instanceof Date? ι : new Date(Tnum(ι)? ι*1e3 : ι) ;r.toString = function(){return util.inspect(this) } ;return r }
var fmt = function(a,b){ var t = this.__local? npm`moment@2.18.1`(this).format('YYYY-MM-DD[T]HH:mm:ss.SSS') : this.toISOString() ;t = t.slice(a,b) ;if( !this.__local && b > 10) t += 'Z' ;return t }
assign_properties_in_E_informal({
'Date.prototype.local':{get(){return new Date(this) [γ['…←']] ({__local:true})}}
,'Date.prototype.i':{get(){return +this / 1e3}}
,'Date.prototype.ym':      {get(){return fmt.call(this,0,'YYYY-MM'["‖"])}}
,'Date.prototype.ymd':     {get(){return fmt.call(this,0,'YYYY-MM-DD'["‖"])}}
,'Date.prototype.ymdh':    {get(){return fmt.call(this,0,'YYYY-MM-DDTHH'["‖"])}}
,'Date.prototype.ymdhm':   {get(){return fmt.call(this,0,'YYYY-MM-DDTHH:mm'["‖"])}}
,'Date.prototype.ymdhms':  {get(){return fmt.call(this,0,'YYYY-MM-DDTHH:mm:ss'["‖"])}}
,'Date.prototype.ymdhmss': {get(){return fmt.call(this,0,'YYYY-MM-DDTHH:mm:ss.SSS'["‖"])}}
,'Date.prototype.iso':     {get(){return fmt.call(this,0,'YYYY-MM-DDTHH:mm:ss.SSS'["‖"])}}
,'Date.prototype.hms':     {get(){return fmt.call(this,'YYYY-MM-DDT'["‖"],'YYYY-MM-DDTHH:mm:ss'["‖"])}}
})

E.schema = (()=>{
	var sc_merge = function(a,b){ var ak = _u.keys(a) ;var bk = _u.keys(b) ;bk["-"](ak).forEach(k=> a[k] = b[k]) ;ak["∩"](bk).forEach(k=> a[k] = !Tprim(a[k])? sc_merge(a[k],b[k]) : !Tprim(b[k])? 'error' : a[k]) ;return a }
	return ι=> T.boolean(ι)? true : Tstr(ι)? '' : Tnum(ι)? 0 : Tarr(ι)? !ι["‖"]? [] : [ι.map(schema).fold(sc_merge)] : _u.pairs(ι).map(ι=> [ι[0],schema(ι[1])])._.object()
	})()

E.cmd_log_loc = cmd=>{
	var id = φ(cmd).name+'.'+simple_hash(cmd) ;return { id
		,out:φ`~/Library/Caches/ζ.logic/${id}.out`.ensure_dir()+''
		,err:φ`~/Library/Caches/ζ.logic/${id}.err`.ensure_dir()+''
		} }
E.os_daemon = (cmd,opt)=>{ cmd+='' ;var {once} = opt||{}
	var t = cmd_log_loc(cmd)
	var job = {
		[once?'RunAtLoad':'KeepAlive']:true
		,Label:`Z.${t.id}`
		,ProgramArguments:['sh','-c',sh`export anon_tns7w=${cmd} ;PATH="/usr/local/bin:$PATH" ;${cmd}`]
		,StandardOutPath  :t.out
		,StandardErrorPath:t.err
		}
	var job_path = φ`~/Library/LaunchAgents/${job.Label}.plist` ;job_path.BAD_exists() ||( job_path.ι = job ) ;_l.isEqual( job_path.plist, job ) || !function(...a){throw Error(__err_format(...a))}('‽')
	return { cmd ,job_path ,restart(){ var t = this.job_path ;shᵥ`launchctl unload ${t} &>/dev/null ;launchctl load ${t}` } } }
os_daemon[γ["|>"]] (ι=> new Property(ι,"this")) .thunk=()=> process.env.anon_tns7w && os_daemon(process.env.anon_tns7w)

module.__proto__.if_main_do = function(f){ !this.parent && f(...process.argv.slice(2)) }

E.robot_key_tap = ι=> require_new(φ`~/code/scratch/keyrc/it.ζ`).robot_key_tap(ι)
E.KEY_once = (...a)=> require_new(φ`~/code/scratch/keyrc/it.ζ`).KEY_once(...a)

E.normal_PDF = x=>{ var μ = 0 ;var σ = 1 ;var v = σ**2 ;return 1/sqrt(v*τ)*exp(-((x-μ)**2)/(2*v)) }
E.normal_CDF = x=>{ var μ = 0 ;var σ = 1 ;return (1 + npm`math-erf@1.0.0`( (x-μ) / (σ*sqrt(2)) ))/2 }
E.invert_specific = f=> fι=>{ var ι = 0 ;while( f(ι) > fι ) ι += 0.01 ;return ι }

var normalize_count = ι=>{ ι.forEach((ι,i,l)=> ι===0 && l.delete(i)) ;return ι }
var diff_Set = (a,b)=>{
	[a,b].every(T.Set) || !function(...a){throw Error(__err_format(...a))}('‽')
	// [a,b] *.count zip **|0 *-
	return normalize_count(new Map(Map.prototype.zip.call(...[b,a].map((𐅭𐅞)=>𐅭𐅞.count())).map(([a,b],i)=>[i ,(a||0) - (b||0)])))
		[γ["!>"]]((𐅭𐅞)=>𐅭𐅞[γ["|>"]] (ι=> new Property(ι,"name")) [γ['…←']] ({ value:a.name ,enumerable:false }) ) }
E.Δ_Sets = (...a)=>{ var f = a.pop()
	var start = a.map(ι=> T.Set(ι)? new Set(ι) : !function(...a){throw Error(__err_format(...a))}('‽'))
	f()
	return _u.zip(start,a).map(a=> diff_Set(...a)).filter((𐅭𐅞)=>𐅭𐅞["‖"]).map(ι=>0?0: { Δ:ι }) }

E.falsy = ι=> ι===undefined||ι===null||ι===false
E.orundefined = (a,b)=> a!==undefined? a : b

//#################################### .ζrc #####################################
process.env.PATH = ['./node_modules/.bin','/usr/local/bin',...(process.env.PATH||'').split(':'),'.']["∪"]([]).join(':')

E.sfx = (ss,...ιs)=>{ var ι = ss[0]
	shₐ`afplay ~/code/scratch/dotfiles/${ι}.wav`
	if( ι==='done' && osaᵥ`get volume settings`['output muted'] ){ var br = npm`brightness@3.0.0` ;br.get()[γ["|>"]](t=>{ br.set(0) ;(()=> br.set(t)).in(0.2) }) }
	}
// E‘.anon .get==>{t←; ↩ [t=random_id.greek(5),t+'←;'] }
E[γ["|>"]] (ι=> new Property(ι,"anon")) .get=()=> random_id.greek(5)
E[γ["|>"]] (ι=> new Property(ι,"now")) .get=()=>{ var t = Time() ;return [t.ymdhm,t.ymdhms,t.ymdhmss] }
E[γ["|>"]] (ι=> new Property(ι,"day")) .get=()=> Time().local.ymd

E.github_url = ι=>{
	var github_remote_origin = file=>{
		var ι = φ(file).root('/')
		var root = ι ;while( root+''!=='/' && !root.φ`.git`.BAD_exists() ) root = root.φ`..`
		if( root+''==='/' ) throw Error() [γ['…←']] ({ human:'did not find github remote origin for '+(file||'<anon>') })
		ι = (ι+'').slice((root+'/')["‖"])
		var name = root.φ`.git/config`.ini['remote "origin"'].url.match(/github\.com[:/](.+)\/(.+)\.git/).slice(1).join('/')
		var commit = /*jet[*/ catch_ι(()=> root.φ`.git/HEAD`.text.trim()==='ref: refs/heads/master' && root.φ`.git/refs/heads/master`.text.trim() ) /*]*/ || shᵥ`cd ${root} ;git rev-parse HEAD`+''
		return encodeURI('http://github.com/'+name+'/blob/'+commit+'/'+ι) }
	var [file,h] = sbᵥ`view = deserialize(${ι}) ;s = view.sel() ;[ view.file_name() ,[view.rowcol(ι) for ι in [s[0].begin() ,s[-1].end()]] ]`
	var fm = ι=> 'L'+(ι+1)
	return github_remote_origin(file||'')+( _l.isEqual(h[0],h[1])? '' : '#'+(h[0][0]===h[1][0]? fm(h[0][0]) : fm(h[0][0])+'-'+fm(h[1][0])) ) }
E.go_to = (...a)=>{ // synonyms? ,go_to ,open ,search
	var opt = !Tprim(a[-1])? a.pop() : {}
	var type = a["‖"]===1? undefined : a.shift()
	var ι = a[0]
	var {new:new_,focus,in_app,sb_view_file_name} = { new:false ,focus:true ,in_app:undefined ,sb_view_file_name:undefined } [γ['…←']] (opt)

	var is_url =(𐅭𐅞)=>𐅭𐅞.re`^((https?|chrome-extension)://|file:|mailto:)`
	var searchify = ι=> 'https://www.google.com/search?q='+encodeURIComponent(ι)

	in_app && (in_app = in_app.toLowerCase())

	focus || sfx`ack`

	// windows_in_current_space_in_app ← app=> hsᵥ`json(hs.fnutils.imap( hs.window.filter.new(false):setAppFilter(${app},{visible=true,currentSpace=true}):getWindows() ,function(x) return x:id() end))`
	// apps_with_windows_in_current_space ← => hsᵥ`json(hs.fnutils.imap( hs.window.filter.new(false):setAppFilter('default',{visible=true,currentSpace=true}):getWindows() ,function(x) return x:application():name() end))`

	//########################### go to specific chrome ###########################
	// this contained some "is_chromeapp_active" code which we don't need because Signal transitioned to electron
	// 	# System Events got an error: osascript is not allowed assistive access
	// 	# compile_mapping(M('c','; '+js`terminal_do_script(${sh`ζ --fresh ${js`(…${osa_activate_thingᵥ+''})('chrome')`} ;exit`})`)).ι,
	//  
	// 	t ← [2,1] ;chrome_simple_js_ᵥ(`alert('foo')`,{window:t[0],tab:t[1]})

	if( !type){ !new_ || !function(...a){throw Error(__err_format(...a))}('‽')
		if( !is_url(ι)) ι = searchify(ι)
		if( !in_app && ι.re`^file:`){
			var file = decodeURI(ι).replace(re`^file:(//)?`,'')
			if( file[0]!=='/') file = require('path').normalize(require('path').join( φ(sb_view_file_name||!function(...a){throw Error(__err_format(...a))}('‽')).φ`..`+'' ,file ))
			if( φ(file).is_dir) in_app = 'path finder'
			else if( ['.pdf','.m4a','.epub','.mobi'].includes(require('path').extname(file)));
			else if( ['.png','.jpg'].includes(require('path').extname(file))) in_app = '#ql'
			else in_app = 'sublime text'
			var [ˣ,p,r] = decodeURI(ι).re`^(.*?:)([^]*)` ;var ι = p+r.replace(/[^\/]+/g,encodeURIComponent.X)
			}
		if( in_app==='#ql') shₐ`( &>/dev/null qlmanage -p ${file} &)`
		else{
			in_app ||( in_app = 'chrome' )
			if( in_app==='chrome'){
				var t = osaᵥ`chrome: URL of tabs of windows`.find_index_deep(t=> t===ι) ;if( t)
					{ var [window_,tab] = t ;osaₐ`chrome: set active tab index of window ${window_+1} to ${tab+1}` ;osaₐ`chrome: activate` ;return } }
			if( ι.re`^chrome-extension://`) shᵥ`duti -s com.google.Chrome chrome-extension` // bug workaround
			shᵥ`open …${in_app && sh`-b ${in_app [γ["|>"]] (memoize_persist(ι=> catch_ι(()=> osaᵥ`id of app ${ι}`) ))}`} ${!focus && '-g'} ${ι}`
			}
		if( focus && in_app==='path finder') osaₐ`${in_app}: activate`
		}
	else if( type==='app'){ ( !new_ && focus && !in_app )||!function(...a){throw Error(__err_format(...a))}('‽') ;var app = ι
		// ! should gather most of this information periodically async & record it. should use FRP.
		var hint_screen = {'sublime text':2 ,'path finder':3 ,'github desktop':4}
		var isnt_standalone = {ibooks:1 ,preview:1}
		if( app==='chrome' && (shᵥ`ps -x -o comm`+'').includes('/Chrome Apps.localized/') ){ ['⌘␣',...'chrome↩'].map(robot_key_tap) ;return }
		hint_screen[app] && robot_key_tap('^'+hint_screen[app])
		isnt_standalone[app]? osaᵥ`${app}: if it is running then ;activate ;end if` : osaᵥ`${app}: activate`
		}
	else if( type==='screen'){ ( !new_ && focus && !in_app && /^[1-9]$/.test(ι+'') )||!function(...a){throw Error(__err_format(...a))}('‽') ;robot_key_tap('^'+ι) }
	else if( type==='path'){ ( !new_ && focus )||!function(...a){throw Error(__err_format(...a))}('‽')
		// ! i think this might be a pretty badly designed type
		new_ = true
		if( ι.re`^(?:code|consume|documents|history|notes|pix)/.{1,80}:\d+:`){ !in_app || !function(...a){throw Error(__err_format(...a))}('‽') // ! duplication with sublime/User/it.py:FIND_RESULT
			// in_app = 'sublime text'
			var [ˣ,ι,line] = ι.re`^(.+):(\d+):$`
			ι = φ('~/file/'+ι)
			shᵥ`'/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl' ${ι}:${line}` ;return }
		if( in_app==='terminal'){
			var here = hsᵥ`json(hs.fnutils.imap( hs.window.filter.new(false):setAppFilter('Terminal',{visible=true,currentSpace=true}):getWindows() ,function(x) return x:id() end))` // ... the behavior changed. fuck
			var unbusy = ()=> osaᵥ`terminal: id of windows where busy = false`
			var available = new Set([here])["∩"](unbusy())[0]
			terminal_do_script( sh`cd ${ι} ;…${!available && sh.clear}` ,osa`…${!!available && osa`in (window 1 whose id = ${available})`} ;…${focus && 'activate'}` ) ;return }
		else go_to(encodeURI('file:'+φ(ι).root('/')),{in_app,focus,sb_view_file_name})
		}
	else !function(...a){throw Error(__err_format(...a))}('‽') }

//##### metaprogramming → runtime macros built on top of template literals ######
// to design this correctly ,(ss,…ιs) => (s,…a) or maybe (`s${a}`) lol no
// existing semistandard usage is in
// 	im_autowhite
// 	scratch.txt
// 	ζ/it.ζ
// s is interned ,so use it as a memoization key for things
E.is_template = ([ss,...ιs])=> ss && Tarr(ss.raw) && ss.raw["‖"]-1 === ιs["‖"]
var tmpl_flatten = (raw2,ιs2)=> _u.zip(raw2,ιs2)._.flatten(true).slice(0,-1).filter(ι=> ι!=='')
E.simple_template = (ss,ιs,filter)=>{ is_template([ss,...ιs]) || !function(...a){throw Error(__err_format(...a))}('‽')
	if( Tarr(filter) ){ var [root,join] = filter ;filter = ι=> Tarr(ι)? ι.map(ι=> root`${ι}`).join(join) : falsy(ι)? '' : undefined }
	var filter_special = ι=> falsy(ι)? '' : ι+''
	var ι = tmpl_flatten( ss.raw.map((𐅭𐅞)=>𐅭𐅞.replace(/\\(?=\$\{|`)/g,'')) ,ιs.map(ι=>0?0:{raw:ι}) )
	for(var i=0;i<ι["‖"]-1;i++) if( Tstr(ι[i]) && !Tstr(ι[i+1])) ι[i] = ι[i].replace(/…$/,()=>{ ι[i+1] = filter_special(ι[i+1].raw) ;i++ ;return '' })
	filter &&( ι = ι.map(ι=> Tstr(ι)? ι : orundefined(filter(ι.raw),ι) ) )
	return ι }
E.easy_template = (()=>{
	var read = (ss,ιs)=> tmpl_flatten(ss.raw,ιs.map(ι=>[ι]))
	var show = ι=>{ var raw = [''] ;var ιs = [] ;ι.forEach(ι=> Tstr(ι)? raw[-1]+=ι : (ιs.push(ι) ,raw.push('')) ) ;return [{raw},...ιs] }
	return f=> function(ss,...ιs){return f.call(this,read(ss,ιs),show) }
	})()

E.clipboard = slot0( ()=> shᵥ`pbpaste`+'' ,ι=> shₐ`${sb.encode(ι)} |`` pbcopy` )
E.sb = function self(){return self._call() } // let ζ.user use sb as callable
sb[γ["|>"]] (ι=> new Property(ι,"tab")) .get=()=>{
	var r = sbᵥ`[serialize(ι) for ι in (ι.view() for ι in sublime.windows() for ι in ι.sheets()) if ι]`
	r.active = sbᵥ`serialize(sublime.active_window().active_sheet().view())`
	;[...r,r.active].filter(ι=>ι).map((𐅭𐅞)=>𐅭𐅞[γ["|>"]] (ι=> new Property(ι,"ι")) .host={ enumerable:false,
		get(){return sbᵥ` view = deserialize(${this}) ;view.substr(Region(0,view.size())) ` },
		set(ι){ sb_editᵥ(this)` view.replace(edit,Region(0,view.size()),${ι}) ` },
		} )
	r[γ["|>"]] (ι=> new Property(ι,"push")) [γ["!>"]]((𐅭𐅞)=>𐅭𐅞.enumerable= false ) .ι = function(ι){ shₐ`${sb.encode(ι)} |`` open -a 'Sublime Text.app' -f` ;this.length = 0 ;(()=> this [γ['…←']] (sb.tab) ).in(0.02) } // ! wtf async/sync mix
	return r }

var fs_ipc_emit = (port,ι)=>{ φ`/tmp/fs_ipc_${port}`.ι = ι ;return shᵥ`curl -s -X PUT localhost:${port}`+'' } // net.Socket

E.sbᵥ = (ss,...ιs)=>{
	var ENC = JSON.stringify ;var ι = simple_template(ss,ιs).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('')
	var t = JSON.parse(fs_ipc_emit(34289,ι)) ;t===null &&( t = undefined ) ;return t }
E.sb_editᵥ = view=>(ss,...ιs)=>{ sbᵥ`edit(${view},${py(ss,...ιs)})` }

// sublime/sb
// 	tab
// 	view

E.re = (ss,...ιs)=>{
	// would like to embed regex in [] and have that be ok ;ie re`[${/[a-z]/}]` = /[a-z]/
	var ι = simple_template(ss,ιs,[(...a)=>re(...a).source,''])
	var ENC = ι=> T.RegExp(ι)? ( ι.flags.replace(/[gy]/g,'')==='u' || !function(...a){throw Error(__err_format(...a))}('‽'), ι.source ) : (ι+'').replace(/([.*+?^${}()\[\]|\\])/g, '\\$1')
	return RegExp( ι.map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join(''), 'u' ) }
assign_properties_in_E_informal({
'RegExp.prototype.λ':function(ι){return ι===undefined || ι===null? null : ι.match(this) },
'RegExp.prototype.g':{get(){return RegExp(this.source,this.flags.replace(/g/,'')+'g') }},
'RegExp.prototype.i':{get(){return RegExp(this.source,this.flags.replace(/i/,'')+'i') }},
'RegExp.prototype.m':{get(){return RegExp(this.source,this.flags.replace(/m/,'')+'m') }},
'RegExp.prototype.u':{get(){return RegExp(this.source,this.flags.replace(/u/,'')+'u') }},
'RegExp.prototype.y':{get(){return RegExp(this.source,this.flags.replace(/y/,'')+'y') }},
'String.prototype.re':{get(){return (ss,...ιs)=> this.match(re(ss,...ιs))}},
})

E.js = E.py = (ss,...ιs)=>{ var ENC = JSON.stringify ;return simple_template(ss,ιs).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('') }

E.sh = (ss,...ιs)=>{ var ENC = ι=> "'"+(ι+'').replace(/'/g,"'\\''")+"'" ;return simple_template(ss,ιs,[sh,' ']).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('') }
sh.clear = "/usr/bin/clear && printf %s $'\\e[3J'"
var ellipsify = ι=> util_inspect_autodepth(ι.slice(0,100))+(ι.slice(100)["‖"]?'…':'')

var if_sh_err = (name,code,ι)=>{ if( ι.status ) throw Error(name+'`'+code+'` → status:'+ι.status+', stderr:'+ellipsify(ι.stderr+'')) [γ['…←']] (_u(ι).pick('status','stdout','stderr')) }
E.shᵥ = (ss,...ιs)=>{ var code = sh(ss,...ιs)
	// ι ← process_spawn('/bin/sh',{ ,args:['-c',code] ,⚓:1 })
	var ι = require('child_process').spawnSync(code,{shell:true})
	if_sh_err('shᵥ',code,ι)
	return ι.stdout [γ['…←']] ({ toString(...a){ var ι = Buffer.prototype.toString.call(this,...a) ;return a["‖"]? ι : ι.replace(/\n$/,'') } }) }
var _shₐ = (ss,ιs,opt={})=>{
	if( ss["‖"]===2 && ss[0]==='' && ss[1].re`^ *\|$`){ opt.stdio && !function(...a){throw Error(__err_format(...a))}('‽') ;opt.stdio = [φ.fd.from(ιs[0]),'pipe','pipe',] ;return shₐ2(opt) }
	else{ var code = sh(ss,...ιs)
		// ι ← process_spawn('/bin/sh',{ ,args:['-c',code] } …← (opt))
		// ι.exit.then(exit=>{ if_sh_err('shₐ',code,ι …← ({exit})) })
		var ι = require('child_process').spawn(code,{shell:true} [γ['…←']] (_u(opt).pick('stdio','detached')))
			.on('exit',status=>{ if_sh_err('shₐ',code,{status} [γ['…←']] (ι)) })
		return ι } }
E.shₐ = (ss,...ιs)=> _shₐ(ss,ιs)
E.shₐ2 = opt=>(ss,...ιs)=> _shₐ(ss,ιs,opt)

E.osa = (ss,...ιs)=>{var t;
	var ι = simple_template(ss,ιs)
	// ! this is such a mess
	if( Tstr(ι[0]) && (t=ι[0].re`^(?!tell )([\w ]+):`)){ ι[0] = ι[0].slice(t[0]["‖"]) ;ι = [osa`tell app ${t[1]};`, ...ι, ' ;end tell'] }
	if( !Tstr(ι[0]) && Tstr(ι[0].raw) && ι[0].raw.re`^[\w ]+$` && Tstr(ι[1]) && (t=ι[1].re`^ *:`)){ ι[1] = ι[1].slice(t[0]["‖"]) ;ι = [osa`tell app ${ι.shift().raw};`, ...ι, ' ;end tell'] }
	return ι.map(ι=> !Tstr(ι)? applescript.print(ι.raw) : ι.replace(/;/g,'\n') ).join('') }
E.osaᵥ = (ss,...ιs)=>{ var ι = osa(ss,...ιs) ;return applescript.parse(shᵥ`osascript -ss -e ${ι}`+'') }
E.osaₐ = (ss,...ιs)=>{ var ι = osa(ss,...ιs) ;shₐ`osascript -ss -e ${ι}` }

E.terminal_do_script = (a,b)=>{ φ`/tmp/__·`.ι = a ;osaᵥ`terminal: do script "·" …${b}` } // ~/.bashrc.ζ :: E['·']
E.chrome_simple_osaᵥ = (ι,{tab,window=0})=> osaᵥ`chrome: execute window …${window+1}'s tab …${tab+1} javascript ${ζ_compile(ι)}`
E.chrome_simple_js_ᵥ = (ι,{tab,window=0})=> osaᵥ`chrome: tell window …${window+1}'s tab …${tab+1} to set URL to ${'javascript:'+ζ_compile(ι)}`
// E.chromeᵥ = ‡ not actually used ‡ wait, nope, is actually used, but mostly in one-off scripts
	// λ(ι,tab){tab = tab!==∅? 'tab '+(tab+1) : 'active tab'
	// 	# E.chrome_$ᵥ = λ(ι,tab){r←; $null ← '__$null_'+random_id(10) ;fst ← 1 ;while ((r=chromeᵥ("if( window.jQuery){"+ι+"} else {"+(fst? (fst=0, "t ← document.createElement('script') ;t.src = 'https://code.jquery.com/jquery-3.1.1.min.js' ;document.getElementsByTagName('head')[0].appendChild(t)") : "")+"; '"+$null+"'}",tab))===$null) ;↩ r}
	// # probably add a random_id(10) call to '#applescript_hack'
	// 	t ← "t ← document.querySelectorAll('#applescript_hack')[0] ;t && t.parentNode.removeChild(t) ;ι ← (0,eval)("+JSON.stringify(ζ_compile(ι))+") ;t ← document.createElement('div') ;t.id = 'applescript_hack' ;t.style = 'display:none;' ;t.textContent = JSON.stringify(ι) ;t2 ← document.querySelectorAll('head')[0] ;t2.insertBefore(t,t2.firstChild) ;∅"
	// 	chrome_simple_js_ᵥ(t,tab)
	// 	t ← "document.querySelectorAll('#applescript_hack')[0].textContent"
	// 	↩ JSON.parse(chrome_simple_osaᵥ(t,tab) || '""') }

E.which = memoize_proc((...a)=> !is_template(a)? which`${a[0]}` : catch_ι(()=> shᵥ`which …${sh(...a)}`+'')) // ! should use FRP to background-recompute hash values after certain amounts of time and discard hash values after certain amounts of time

// such hack
var json2_read = ι=>{ var r = JSON.parse(ι) ;(function Λ(ι,k,o){if( ι.type==='Buffer' ){
	var t = 'data' in ι || 'utf8' in ι? Buffer.from(ι.data||ι.utf8) : 'base64' in ι? Buffer.from(ι.base64,'base64') : !function(...a){throw Error(__err_format(...a))}('‽')
	if( o===undefined ) r = t ;else o[k] = t
	} else if(! Tprim(ι) ) _u(ι).forEach(Λ)})(r) ;return r }
var json2_show = ι=> JSON_pretty(ι,ι=>{var t;
	if( Buffer.isBuffer(ι)) return ι.equals(Buffer.from(t=ι+''))? {type:'Buffer' ,utf8:t} : {type:'Buffer' ,base64:ι.toString('base64')}
	return ι})
E[γ["|>"]] (ι=> new Property(ι,"φ")) .thunk=()=>{
	// https://www.npmjs.com/package/glob-to-regexp
	var ENC = ι=> ι.re`/`? ι.replace(/[\/%]/g, encodeURIComponent.X) : ι
	φ["⁻¹"] = ι=> /%2F/i.test(ι)? ι.replace(/%2[F5]/gi, decodeURIComponent.X) : ι
	φ.fd = {} ;φ.fd.from = ι=> fs.createReadStream(undefined,{ fd:fs.openSync(φ`/tmp/${random_id(20)}` [γ['…←']] ({ι}) +'','r') })

	var existsSync = ι=> !T.Error(catch_union(()=> fs.accessSync(ι)))
	var mkdir_p = function Λ(ι){ try{ fs.mkdirSync(ι) }catch(e){ if( e.code==='EEXIST'||e.code==='EISDIR') return ;var t = path.dirname(ι) ;if( e.code!=='ENOENT' || ι===t) throw e ;Λ(t) ;fs.mkdirSync(ι) } }
	// walk ← λ*(root,files){root += '/'
	// 	walk_ ← λ*(ι){try {l ← fs.readdirSync(root+ι) ;for (i←0;i<l.‖;i++){t ← ι+l[i] ;try{ fs.statSync(root+t).isDirectory()? (yield root+t, yield* walk_(t+'/')) : (files && (yield root+t)) }catch(e){} }} catch(e){} }
	// 	yield* walk_('') }
	var read_file = function(ι){ try{return fs.readFileSync(ι) }catch(e){ if( !(e.code==='ENOENT')) throw e } }
	var ensure_exists = function(ι,ifdne){ existsSync(ι) || ( mkdir_p(path.resolve(path.dirname(ι))), fs.writeFileSync(ι,ifdne) ) }
	var write_file = function(ι,data){ try{ fs.writeFileSync(ι,data) }catch(e){ if( !(e.code==='ENOENT')) throw e ;ensure_exists(ι,data) } }
	var open = function(ι,ifdne,f){
		ensure_exists(ι,ifdne) ;var Lc = new Φ(ι)["‖"]
		var fd = fs.openSync(ι,'r+') ;f({
			get L(){return Lc},
			read(i,L){var t = Buffer.allocUnsafe(L) ;fs.readSync(fd,t,0,L,i) === L || !function(...a){throw Error(__err_format(...a))}('‽') ;return t},
			write(ι,i){var L = fs.writeSync(fd,ι,i) ;Lc = max(Lc, L+i)},
			truncate(L){fs.ftruncateSync(fd,L) ;Lc = min(Lc,L)},
			indexOf_skipping(from,to,step,find,skip){var fl=this
				if( from<0) from += fl.L ;if( to<0) to += fl.L ;from = min(max(0, from ),fl.L-1) ;to = min(max(-1, to ),fl.L)
				if( !(step===-1 && from>to)) !function(...a){throw Error(__err_format(...a))}('TODO')
				var d = fl.read(to+1,from-to)
				for(var i=from;i>to;i+=step) {if( d[i-(to+1)]===find) return i ;else if( chr(d[i-(to+1)]).match(skip)) ;else return undefined}
				},
			}) ;fs.closeSync(fd)}
	var globmatch = (glob,ι)=> ι.re`^…${[...glob].map(ι=> ι==='*'? '.*' : re`${ι}`.source).join('')}$`
	φ[γ["|>"]] (ι=> new Property(ι,"cwd")) .host= { get:()=> new Φ(process.cwd()) ,set:ι=> φ(ι+'')._ι [γ["!>"]](mkdir_p) [γ["!>"]](process.chdir) }
	var normHs = function(ι){ if( _l.isEqual( ι,['~'] ) ) return [process.env.HOME] ;Tstr(ι[0]) && (ι[0] = ι[0].replace(/^~(?=\/)/,process.env.HOME)) ;return ι }
	function Φ(ι){this._ι = ι} ;Φ.prototype = {
		φ,
		toString(){return this._ι },
		toJSON(){return {type:'φ', ι:this._ι} },
		inspect(ˣ,opts){return opts.stylize('φ','special')+opts.stylize(util_inspect_autodepth(this._ι.replace(re`^${process.env.HOME}(?=/|$)`,'~')).replace(/^'|'$/g,'`'),'string') },
		get nlink(){return fs.statSync(this._ι).nlink },
		get mtime(){return fs.statSync(this._ι).mtime },
		get birthtime(){return fs.statSync(this._ι).birthtime },
		get url(){return encodeURI('file:'+this.root('/')) }, // ! should this be part of root
		get is_dir(){return !!catch_ι(()=> fs.statSync(this._ι).isDirectory()) },
		get name(){return path.basename(this._ι) },
		BAD_exists(){return existsSync(this._ι) },
		TMP_children(){return this._ι [γ["|>"]] (function Λ(ι){return φ(ι).is_dir? fs.readdirSync(ι).map(t=> ι+'/'+t)['map…'](Λ) : [ι] }) },
		TMP_parents(){ var r = [this.root('/')] ;while(r[-1].φ`..`+'' !== r[-1]+'') r.push(r[-1].φ`..`) ;return r.slice(1) },
		root(x){switch(arguments.length){default: !function(...a){throw Error(__err_format(...a))}('‽')
			case 0: return this._ι[0]==='/'? '/' : '.'
			case 1: return new Φ( x==='/'? path.resolve(this._ι) : x==='.'? path.relative(x,this._ι) : !function(...a){throw Error(__err_format(...a))}('not yet implemented: nonstandard roots') )
			}},
		ensure_dir(){ this.φ`..`.BAD_exists() || mkdir_p(this.φ`..`+'') ;return this },

		// get ι(){↩},
		set ι(ι){
			if( this.is_dir) !function(...a){throw Error(__err_format(...a))}('TODO')
			if( ι===undefined||ι===null){ catch_union(()=> fs.unlinkSync(this._ι) ) ;return }
			var e = path.extname(this._ι)
			if( e==='.csv'){ this.csv = ι ;return }
			if( e==='.xml'){ this.xml = ι ;return }
			if( e==='.plist'){ this.plist = ι ;return }
			ι = e==='.json'? JSON_pretty(ι) :
				Tstr(ι)? ι :
				ι instanceof Buffer? ι :
				JSON_pretty(ι)
			write_file(this._ι,ι) },
		get buf(){return read_file(this._ι) || Buffer.alloc(0) },
		set buf(ι){ write_file(this._ι,ι) },
		get base64(){return Buffer.from(this.text,'base64') },
		// set base64(ι){},
		get text(){return (read_file(this._ι) || '')+'' },
		set text(ι){ write_file(this._ι,ι) },
		get lines(){return function(...ιs){
			var d = ((read_file(this._ι)||'\n')+'').replace(/\n$/,'').split('\n')
			if( ιs["‖"] > 1) return ιs.map(ι=> Tnum(ι)? d[ι] : d.slice(ι.re`^(\d+):$`[1]|0).join('\n')+'\n')
			else if( ιs["‖"] === 0){
				return {
					map(...a){return d.map(...a)},
					} }
			else !function(...a){throw Error(__err_format(...a))}('TODO')
			}},
		set lines(ι){ write_file(this._ι, ι.join('\n')+'\n') },
		get json(){return JSON.parse(read_file(this._ι) || 'null') },
		set json(ι){ write_file(this._ι, JSON_pretty(ι)) },
		get json2(){return json2_read(this.text) },
		set json2(ι){ this.text = json2_show(ι) },
		get ini(){return npm`ini@1.3.4`.parse(this.text) },
		// set ini(ι){},
		// get csv(){↩},
		set csv(ι){ var t = φ`/tmp/csv_${random_id(25)}` ;t.json = ι ;shᵥ`ζ ${'npm`csv@0.4.6`.stringify('+js`φ(${t+''}).json,λ(e,ι){ φ(${this.root('/')+''}).buf = ι })`}` },
		// get xml(){↩ JSON.parse(shᵥ`ζ ${js`npm`xml2js@0.4.17`.parseString(φ(${@+''}).text,λ(e,ι){ process.stdout.write(JSON.stringify(ι)) })`}`+'') },
		set xml(ι){ this.text = npm`xmlbuilder@8.2.2`.create(ι,{allowSurrogateChars:true}).end({pretty:true}) },
		get plist(){var t; var buf = this.buf ;return 0?0
			// in case bplist-parser has bugs, this is available:
			// : which('plutil')? npm`plist@2.1.0`.parse(shᵥ`plutil -convert xml1 -o - ${@.root('/')+''}`+'')
			: buf.slice(0,6)+''==='bplist'? ( t= φ`/tmp/plist_${random_id(25)}`, shᵥ`ζ ${'npm`bplist-parser@0.1.1`.parseFile('+js`${this.root('/')+''},λ(e,ι){ φ(${t+''}).plist = ι })`}`, t.plist )
			: npm`plist@2.1.0`.parse(this.text)
			},
		set plist(ι){ this.text = npm`plist@2.1.0`.build(ι) },
		get json_array__synchronized(){return function(...ιs){var _ι=this._ι
			if( ιs["‖"]) !function(...a){throw Error(__err_format(...a))}('TODO')
			var d = JSON.parse((read_file(_ι)||'[]')+'')
			return {
			push(...a){a.map(function(ι){
				d.push(ι)
				open(_ι,'[]',function(fl){
					var i = fl.indexOf_skipping(-1,-1e4,-1,ord(']'),/[ \n\t]/) || !function(...a){throw Error(__err_format(...a))}('bad file')
					var is_0 = fl.indexOf_skipping(i-1,-1e4,-1,ord('['),/[ \n\t]/)!==undefined
					fl.write((is_0?'':',')+JSON.stringify(ι,undefined,'  ')+']',i)
					})
				})},
			filter(f){return d.filter(f)},
			get length(){return d["‖"]},
			get ['‖'](){return d["‖"]},
			} }},

		get size(){return fs.statSync(this._ι).size },
		get ['‖'](){return fs.statSync(this._ι).size },
		}
	function Φs(ι){this._ι = ι} ;Φs.prototype = {
		inspect(ˣ,opts){return opts.stylize('φ','special')+util.inspect(this._ι,opts)},
		get name_TMP(){return this._ι.map(ι=> new Φ(ι).name)}, // fs.readdirSync
		get φs(){return this._ι.map(ι=> new Φ(ι))}, // [φ]
		}
	function φ(ss,...ιs){
		var head = this instanceof Φ && this._ι
		if( this instanceof Φs) !function(...a){throw Error(__err_format(...a))}('not yet implemented')
		var tmpl = is_template([ss,...ιs])
		if( tmpl){var ι = simple_template(ss,ιs,[φ,'/']) ;if( ι.filter(Tstr).join('').re`\*|\{[^}]*?,`) {
			ι["‖"] <= 1 || !function(...a){throw Error(__err_format(...a))}('not yet implemented * ** ${}',ι)
			ι = normHs(ι)
			ι = ι[0]
			ι.includes('**') && !function(...a){throw Error(__err_format(...a))}('not yet implemented ** ${}',ι)
			var r = ['.']
			if( ι[0]==='/') r = ['/']
			ι.split('/').forEach(ι=>{
				if( ι==='')return ;
				r = r['map…'](r=>{
					if( ι === '.') return [r]
					if( ι === '..') return [r==='.'? '..' : r.split('/').every(ι=>ι==='..')? r+'/..' : path.dirname(r)]
					return fs.readdirSync(r).filter(b=> globmatch(ι,b)).map(b=> r+'/'+b)
					})
				})
			return new Φs(r) } }
		else {var ι = ss ;if( ιs["‖"] || Tarr(ι)) !function(...a){throw Error(__err_format(...a))}('not yet implemented') ;if( ι instanceof Φs) !function(...a){throw Error(__err_format(...a))}('not yet implemented')}
		if( tmpl){ι = normHs(ι).map(ι=> !Tstr(ι)? ENC(ι.raw+'') : ι).join('')}
		else if( ι instanceof Φ){return head && ι._ι[0]!=='/'? new Φ(head+'/'+ι._ι) : ι}
		else {ι = (ι+'').replace(/^~(?=\/|$)/,process.env.HOME)}
		return new Φ(path.normalize(head? head+'/'+ι : ι).replace(/(?!^)\/$/,'')) }
	return φ }

//############################# api interpretation ##############################
var comp2 = ι=> `'use strict';undefined;\n`+ζ_compile(ι)
var mem_sc = memoize_tick(ι=> new vm.Script(ι) )
var ζ_verify_syntax = ι=>{ ι = comp2(ι) ;try{ mem_sc(ι) }catch(e){ if( e instanceof SyntaxError ) return e } }
E.ζ_eval = ι=>{ ι = comp2(ι) ;return mem_sc.cache[ι]? mem_sc(ι).runInThisContext() : (0,eval)(ι) }

E.returnfix_compile = (()=>{return ι=>{var t; return bad(ι) && !bad(t='(=>{'+ι+'})()')? t : ι }
	function bad(ι){var t; return (t= ζ_verify_syntax(ι)) && t.message==='Illegal return statement' }
	})()
E.do_end_undefined_thing =(𐅭𐅞)=>𐅭𐅞.replace(/;\s*$/,';∅')

// i cut this out temporarily:
// e && Tstr(e.stack) &&( e.stack = e.stack.replace(/^([^]*)at repl:(.*)[^]*?$/,'$1at <repl:$2>') )
// e && Tstr(e.stack) &&( e.stack = e.stack.replace(/    at 𐅩𐅝𐅋𐅬𐅪[^]*/,'    at <eval>') )

//################################### ζ.user ####################################
sb._call = ()=> sb.tab.active.ι
E.p = function(ι){ var t = clipboard ;return arguments.length===0? t.ι :( t.ι = ι ) }
E.ps = Object.getOwnPropertyDescriptors

E[γ["|>"]] (ι=> new Property(ι,"require_see")) .get= ()=> require_new(φ`~/code/declare/see.ζ`+"")

//################################### ζ infra ###################################
;(γ['…←'])(util.inspect.styles,{ null:'grey' ,quote:'bold' })
;[process,module].map((𐅭𐅞)=>𐅭𐅞.inspect = function(){return '{'+Object.getOwnPropertyNames(this).map(ι=> ι+':').join(', ')+'}' }) // ‡ hack, like the [1] * 5 thing in ζ_repl_start. clean up by: can we override builtin inspects without problems? then: defining solid inspect functions for more things. otherwise: figure out something else.
;['global','Object'].map(ι=>{
global[ι].inspect = function(d,opt){return opt.stylize(ι,'quote') }
})
// Number_toFixed ← λ(θ,ι){ θ = round(θ / 10**-ι) * 10**-ι ;↩ ι>0? θ.toFixed(ι) : θ+'' }
// E.pretty_time_num = ι=> new Number(ι) …← ({inspect:λ(ˣ,opt){ P ← 20 ;ι←@ ;[ι,u] ← (ι >= P/1e3? [ι,'s'] : [ι*1e6,'μs']) ;↩ opt.stylize(Number_toFixed(ι,-max(-3,floor(log10(ι/P))))+u,'number') }})
// E.pretty_time_num = ι=> Unit(ι,'s')

var Unit = (ι,u)=>0?0: {ι,u}
	[γ["!>"]]((𐅭𐅞)=>𐅭𐅞[γ["|>"]] (ι=> new Property(ι,"valueOf")) [γ["!>"]]((𐅭𐅞)=>𐅭𐅞.enumerable= false) .ι=function(){return this.ι } )
	[γ["!>"]]((𐅭𐅞)=>𐅭𐅞[γ["|>"]] (ι=> new Property(ι,"inspect")) [γ["!>"]]((𐅭𐅞)=>𐅭𐅞.enumerable= false) .ι=function(ˣ,opt){return util.inspect(this.ι,opt)+' '+opt.stylize(this.u,'number') } )
assign_properties_in_E_informal({
'Number.prototype.inspect':function(d,opt){'use strict' ;var ι = this ;if(! Tprim(ι) ) return ι ;return opt.stylize( Object.is(ι,-0)? '-0' : ι===Infinity? '∞' : ι===-Infinity? '-∞'
	: Number.isSafeInteger(ι)? ''+ι
	: ι.toExponential().replace('+','').replace(/(\.\d\d)\d+/,'$1').replace('e0','')
	,'number') }
,'Boolean.prototype.inspect':function(d,opt){'use strict' ;return opt.stylize( this?'✓':'✗','boolean' ) }
,'Date.prototype.inspect':function(d,opt){return opt.stylize(isNaN(+this)? 'Invalid Date' : this.getUTCSeconds()!==0? this.ymdhms : this.getUTCMinutes()!==0? this.ymdhm : this.getUTCHours()!==0? this.ymdh : this.ymd, 'date')}
// ,'Function.prototype.inspect':λ(rec,ctx){t ← ζ_compile.⁻¹(@+'').replace(/^λ \(/,'λ(').match(/^.*?\)/) ;↩ ctx.stylize('['+(t?t[0]:'λ ?(?)')+']', 'special')}
// ,'Buffer.prototype.inspect':λ Λ(){↩ Λ.super.call(@).replace(/(^<\w+)/,'$1['+@.‖+']')}
// ,inspect(ˣ,opt){↩ opt.stylize('φ','special')+opt.stylize(util.inspect(@._ι.replace(re`^${process.env.HOME}(?=/|$)`,'~')).replace(/^'|'$/g,'`'),'string') }
})
sb.encode = (()=>{
	var line = ι=>0?0
		: Tstr(ι)? ι
		// : util.inspect(ι,{ depth:∅, maxArrayLength:∅, })
		: util_inspect_autodepth(ι)
	return ι=>0?0
		: ι===undefined? ''
		: Tarr(ι)? ι.map(line).join('\n')
		: line(ι) })()
// EventEmitter.prototype.inspect

E.cn = { log:(...a)=> console.log(
	is_template(a)?
		easy_template(ι=>ι)(...a).map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι[0],{colors:true})).join('') :
		a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι,{colors:true})).join(' ')
		) }
E.util_inspect_autodepth = function(ι,opt={}){ opt.L || (opt.L = 1e6) ;var last; for(var i=1;;i++){ var r = util.inspect(ι, {maxArrayLength:opt.L/3 |0, depth:i} [γ['…←']] (opt)) ;if( r===last || r["‖"] > opt.L) return last===undefined? '<too large>' : last ;last = r } }

E._double_dagger__repl_start = ()=> ζ_repl_start({
	// i know how to make the good repl for ct. i want to, but im tired
	prompt:'\x1b[30m\x1b[100m‡\x1b[0m ',
	compile:ι=>{var t;
		var lock = 0?0
			: ['ct','chrome_tabs','ps2','d','bookmarks']["∪"]([]).has(ι)? 'require_new(φ`~/.bashrc.ζ`).'+ι+'()'
			: (t= ι.re`^f(?: (.+))?$` )? js`go_to('path',${t[1]||'.'})`
			: ι
		lock===ι || cn.log('⛓  '+lock)
		return lock }, })
E.ζ_repl_start = opt=>{ opt = { compile:ι=>ι ,prompt:'\x1b[30m\x1b[42mζ\x1b[0m ' } [γ['…←']] (opt)
	var 𐅯𐅦 = (ι,opt={})=> util_inspect_autodepth(ι,_u(opt).pick('colors'))
	var promise_watch = ι=>{ if(! ι.id ){
		ι.id = ((𐅩𐅞𐅋𐅦𐅩||(𐅩𐅞𐅋𐅦𐅩= [0] ))[γ["|>"]] (ι=> new Property(ι,"0"))++).toString(36)
		var hr = hrtime() ;ι.then(x=>{ var x = my_inspect(x) ;hrtime(hr) < 5 && x["‖"] && hsᵥ`hs.alert(${`Promise #${ι.id} = ${x.slice(0,200)}`},12)` }) } }
	var my_inspect = (ι,opt={})=>0?0
		: ι===undefined? ''
		: T.Promise(ι)? 0?0
			: ι.status? 'Π '+𐅯𐅦(ι.ι,opt)
			: ι.status===undefined?( promise_watch(ι), `Π #${ι.id} #pending` )
			: 𐅯𐅦(ι,opt)
		: Tarr(ι) && ι["‖"] > 1 && ι.every(t=> t===ι[0]) && _midline_horizontal_ellipsis_(ι["‖"]).every(t=> t in ι)
			? 𐅯𐅦([ι[0]],opt)+' × '+𐅯𐅦(ι["‖"],opt)
		: 𐅯𐅦(ι,opt)
	return (f=> f.call( require('repl').start({useGlobal:true} [γ['…←']] (_u(opt).pick('prompt'))) ))(function(){
	this.In = [] ;this.Out = []
	var super_ = this.completer ;this.completer = function(line,cb){ line.trim()===''? cb(undefined,[]) : super_.call(this,line,cb) }
	this.removeAllListeners('line').on('line',function(line){
		this.context.rl = this
		this.context.E = this.context
		if( this.bufferedCommand ){ var ι = this.history ;ι.reverse() ;var t = ι.pop() ;ι[-1] += '\n'+t ;ι.reverse() }
		var code = this.bufferedCommand+line
		code = opt.compile(code) // ! hacks are fun
		if( ζ_verify_syntax(code) ){ this.bufferedCommand = code+'\n' ;this.outputStream.write('    ') ;return }
		try{ var ι = ζ_eval(code) }catch(e){ var error = e }
		this.bufferedCommand = ''
		if( code ){
			φ`~/.archive_ζ`.text = φ`~/.archive_ζ`.text + JSON.stringify({time:Time(), code}) + '\n'
			this.In.push(code) ;this.Out.push(error || ι)
			}
		if( error ) this._domain.emit('error', error.err || error)
		else{
			if( T.Promise(ι) ) this.context[γ["|>"]] (ι=> new Property(ι,"__")) .thunk= ι
			else if( ι!==undefined ) this.context.__ = ι
			try{ var t = my_inspect(ι,{colors:this.useColors}) }catch(e){ var t = '<repl inspect failed>:\n'+(e&&e.stack) }
			this.outputStream.write(t && t+'\n') }
		this.displayPrompt()
		})
	this.removeAllListeners('SIGINT').on('SIGINT',function(){
		var is_line = this.bufferedCommand+this.line
		this.clearLine()
		if( is_line ){ this.bufferedCommand = '' ;this.displayPrompt() } else this.close()
		})
	delete this.context._ ;this.context._ = _u
	return this
	}) } ;var 𐅩𐅞𐅋𐅦𐅩;

//################################## new tools ##################################
E.simple_as_file = ι=> φ`/tmp/asf_${simple_hash(ι)}` [γ['…←']]({ι}) +''

//################################### prelude ###################################
φ`~/code/declare/module.ζ`.BAD_exists() &&
	require(φ`~/code/declare/module.ζ`+'').patch(E)

//#################################### main #####################################
var sh_ify = ι=>{var t;
	var Π = ι=> Promise.resolve(ι) // COPY
	return Π( 0?0
	: T.Promise(ι)? ι.then(sh_ify.X)
	: ι===undefined? {}
	: Tstr(ι)? {out:ι}
	: T.boolean(ι)? {code:ι?0:1}
	: (t=catch_union(()=> JSON.stringify(ι)), !T.Error(t))? {out:t}
	: {out:ι+''} )}
E.ζ_main = ({a})=>{var ι;
	a[0]==='--fresh' && a.shift()
	if( !a["‖"] ) ζ_repl_start()
	else if( ι=a[0], φ(ι).BAD_exists() || ι.re`^\.?/` ){ process.argv = [process.argv[0],...a] ;var t = φ(ι).root('/')+'' ;var o=Module._cache;var m=Module._resolveFilename(t,undefined,true);var oι=o[m] ;o[m] = undefined ;Module._load(t,undefined,true) ;o[m] = oι }
	else {
		global.require = require ;global.code = a.shift() ;global.a = a ;[global.a0,global.a1] = a ;global.ι = a[0]
		sh_ify(ζ_eval(returnfix_compile(do_end_undefined_thing(code))))
			.then(ι=>{ ι.out && process.stdout.write(ι.out) ;ι.code &&( process.exitCode = ι.code ) })
		}
	}
module.if_main_do((...a)=>ζ_main({a}))
// inject as .bashrc
// 	sh` ζ(){ if [[ $# = 0 || $1 =~ ^\.?/ || $1 = --fresh ]] ;then /usr/local/bin/ζ "$@" ;else ζλ "$@" ;fi ;} `

