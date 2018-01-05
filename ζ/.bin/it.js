#!/usr/bin/env node
// hey, if you're gonna break this, keep a previous stable version ready this time. weve spent entirely too much time rescuing our configurations.

// odd synonym: k, name(, id)(, i?), 𐑯𐑱𐑥
// ι = it
// ‖ = size/length/shape

//################################### prelude ###################################
'use strict' ;require('module').wrapper[0] += `'use strict';` // enable strict mode everywhere
var _u = require('underscore') // lodash is better than underscore except for _()

//################################### ζ infra ###################################
var γ = global
var E_ = {}
var patched = new Set([E_,γ])
var E = new Proxy({},{ // exports
	set(           ˣ,id,ι){ [...patched].forEach(o=> o[id] = ι    ) ;return true },
	defineProperty(ˣ,id,ι){ [...patched].forEach(o=> def0(o,id,ι) ) ;return true },
	})

var def0 = Object.defineProperty
E.def = (o,name,ι)=>{
	γ.𐅰𐅯𐅭𐅨𐅝&&log('def',o,name[Symbol.toPrimitive](),ι)
	return def0(o,name,_u({configurable:true,enumerable:true}).assign(ι)) }
var slot0 = (get,set)=>{ var t = {} ;def(t,'ι',{get,set}) ;return t }
E.𐅯Set = (...ι)=> new Set(ι)

//################################### prelude ###################################
E._interrobang_ = (...a)=>{ throw a["‖"]===1 && T.Error(a[0])? a[0] : Error(a.map(ι=> Tstr(ι)? ι : ζ_inspect(ι)).join(' ')) }
E.catch_union = f=>{ try{ var r = f() ;var bad = T.Error(r) ;if( !bad) return r }catch(e){ var r = e ;T.Error(r) || _interrobang_() ;return r } ;bad && _interrobang_() }
E.catch_union2 = f=>{ try{return f() }catch(e){return e } }
E.catch_ι = f=>{ try{ var r = f() ;var bad = r===undefined ;if( !bad) return r }catch(e){} ;bad && _interrobang_() }
E.catch_ = f=> function(){ try{ return f.apply(this,arguments) }catch(e){ '__catchable' in e || _interrobang_(e) ;return e.__catchable } }
E.return_ = ι=>{ throw {__catchable:ι} }
E.new_ = ι=> Object.create( ι? ι.prototype || ι : null )

E.T = ι=>{var t;
	if( (t= typeof ι)!=='object' ) return t==='boolean'? '✓✗' : t ;if( ι===null ) return 'null'
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
	,truefalse: ι=> typeof ι==='boolean'
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
T.primitive.ι = 𐅯Set('undefined','boolean','number','string','symbol','null')
T.boxed.ι = 𐅯Set('Boolean','String','Number')

//################################### ζ infra ###################################
// prefix hook . does not require parens around the right side, but can only do side effects
E.𐅯𐅮𐅦𐅬𐅂 = f=>{ 𐅭𐅩𐅝𐅋𐅩.f = f ;return 𐅭𐅩𐅝𐅋𐅩 } ;var 𐅭𐅩𐅝𐅋𐅩 = def({ f:undefined },'ι',{ set(ι){ this.f(ι) } })

//############### postfix ###############
// def(Function.prototype,'‘@',{ ,get(){↩ @.call.bind(@) } })
// def(Function.prototype,'flip_',{ ,get(){↩ (a,b)=> @(b,a) } })
var 𐅯𐅬𐅫𐅋𐅃 = [] ;var t = { [Symbol.iterator]:𐅯𐅬𐅫𐅋𐅃[Symbol.iterator].bind(𐅯𐅬𐅫𐅋𐅃) }
E.postfix = new Proxy(t,{set(ˣ,id,ι,self){var t; id+='' ;𐅯𐅬𐅫𐅋𐅃.push(id)
	;(E[id] = ι)[Symbol.toPrimitive] = (ι=>()=>ι)(Symbol(id))
	var wrap = f=>0?0: { enumerable:false ,get:(ι=>()=>ι)( function(){return f.call(undefined,this,...arguments) } ) ,set(f){ def(this,ι,wrap(f)) } }
	def(Object.prototype,ι,wrap(ι))
	return true }})

postfix['|>'] = (ι,f)=> f(ι)
postfix['<|'] = (f,ι)=> f(ι)
postfix['!>'] = (ι,f)=>( f(ι) ,ι )
postfix['…←'] = Object.assign
postfix['∋'] = (a,b)=> Object.prototype.isPrototypeOf.call( a.prototype||a ,b )

var 𐅨𐅝𐅃𐅂𐅮 = ()=> function me(...a){ var l = me['≫'] ;var t = l[0].call(this,...a) ;for(var i=1;i<l["‖"];i++) t = l[i](t) ;return t }
// should be on Function.prototype instead of Object.prototype
postfix['≫'] = (...ι)=>{ ι=ι['map…'](ι=> ι['≫'] || [ι] ) ;return ι["‖"]<=1? ι : 𐅨𐅝𐅃𐅂𐅮() [γ['…←']]({'≫':ι}) }
postfix['≪'] = (...ι)=> γ['≫'](...ι.reverse())

// obj_hash ← ι=> [ ,[(a,b)=>a===b,[…protos(ι)][1]] ,[≈,ps(ι)] ,…(Tfun(ι)? [[(a,b)=>a===b,Function.prototype.toString.call(ι)]] : []) ]
// postfix['#obj='] = (a,b)=> [a,b].map(obj_hash) |> (ι=> _u.zip(…ι)).every(([a,b])=> a[0](a[1],b[1]))

//############## Property ###############
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
Property.prototype[γ["|>"]] (ι=> new Property(ι,"f")) .get= function(){return this.ι.bind(this.o) }
Property.prototype.bind = function(ι){ ι instanceof Property || _interrobang_()
	this .host= { get(){return ι.get.call(this) } ,set(ι){return ι.set.call(this,ι) } ,enumerable:ι.enumerable }
	return this }
var thunk_s = ff=> function(ι){ var _id = this._id
	var get = Tfun(ι)? ff(ι,_id) : T.Promise(ι)? ()=> ι.ι : _interrobang_()
	this .host= { configurable:true ,get ,set(ι){ this[γ["|>"]] (o=>( 𐅋𐅨𐅦𐅨𐅭 = o ,𐅯𐅭𐅝𐅨𐅮 ))[_id] .host= { value:ι ,writable:true } } } }
Property.prototype[γ["|>"]] (ι=> new Property(ι,"thunk")) .set= thunk_s((ι,_id)=> function(){return this[_id] = ι.call(this) })
Property.prototype[γ["|>"]] (ι=> new Property(ι,"f1ι")) .set= thunk_s((ι,_id)=> function(){ var r= ι.call(this) ;r!==undefined &&( this[_id] = r ) ;return r })

//################################## requires ###################################
;[ ['events','EventEmitter'],['fs'],['http'],['https'],['module','Module'],['net'],['os'],['querystring'],['readline'],['stream'],['util'],['vm'],['zlib'],['underscore','_u'],['lodash','_l'],['highland','_h']
	].map(([ι,n])=> E[γ["|>"]] (o=>( 𐅋𐅨𐅦𐅨𐅭 = o ,𐅯𐅭𐅝𐅨𐅮 ))[n||ι] .thunk=()=> require(ι) )
var path = require('path')
var fs = require('fs')
E._ = _u
E.require_new = ι=> (𐅃𐅜𐅞𐅰𐅯||(𐅃𐅜𐅞𐅰𐅯= npm`require-uncached@1.0.3` ))( (ι+'').replace(/^\.(?=\/)/,φ.cwd) ) ;var 𐅃𐅜𐅞𐅰𐅯;
E [γ['…←']] ({γ})

//################################### ζ infra ###################################
E.__name = name=>(𐅭𐅞)=>𐅭𐅞[γ["|>"]] (ι=> new Property(ι,"name")) [γ["!>"]]((𐅭𐅞)=>𐅭𐅞.enumerable= false) .value= name
E.alt_ws = ι=> 𐅯Set(... (ι+'').split(' ')._.sortBy(ι=> -ι["‖"]) )
E.lines = ι=>{ var t = ( ι.raw? ι.raw[0] : ι ).split('\n') ;return t.slice( t[0].trim()?0:1 ,t["‖"] - (t[-1].trim()?0:1) ) }
E[γ["|>"]] (ι=> new Property(ι,"ζ_compile")) .thunk=()=>{ var 𐅭𐅋𐅦𐅝𐅜;var 𐅨𐅋𐅦𐅜𐅦;var 𐅩𐅜𐅃𐅩𐅪;var 𐅂𐅂𐅃𐅝𐅦;var 𐅨𐅂𐅫𐅯𐅃;var 𐅋𐅝𐅞𐅬𐅰;var 𐅝𐅩𐅭𐅪𐅃;var 𐅮𐅰𐅰𐅝𐅭;var 𐅭𐅦𐅫𐅩𐅝;var 𐅦𐅞𐅃𐅝𐅪;var 𐅃𐅪𐅜𐅫𐅮;var 𐅪𐅯𐅯𐅯𐅦;
	var word_extra = re`(?:[♈-♓🔅🔆‡⧫◊§▣⋯‽‘≈≉]|𐅃op<|𐅃𐅭op<)`
	var word = re`(?:[A-Za-z0-9_$ʰ-ʸˡ-ˣΑ-ΡΣ-ωᴬ-ᵛᵢ-ᵥᶜᶠᶻ⁰ⁱⁿₐ-ₓₕ-ₜℂℕℚℝℤⱼⱽ⚓𐅂𐅃𐅋𐅜𐅝𐅞𐅦𐅨𐅩𐅪𐅫𐅬𐅭𐅮𐅯𐅰𐑐-𐑿∞ᛟ]|${word_extra})`
	var ζ_parse = E.ζ_parse = (()=>{
		var P = require('./parsimmon2.js')
		var ident = P(re`(?![0-9])${word}+|@`)
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
			,P(re`(?:(?!${word})[^{}/#'"…${'`'})@\[\]])+|[^}]`)
			).many() )
		var tmpl_ι = P.alt( P.seq( P('${').T`template` ,simple_js ,P('}').T`template` ) ,P(/(?:\\[^]|(?!`|\$\{)[^])+/).T`template` )
		var js_file = P.seq( P(/(#!.*\n)?/).T`shebang` ,simple_js )
		return code=>{
			var ι = js_file.parse(code)._.flatten()
			var r = [] ;for(var t of ι) t.T? r.push(t) : r[-1]&&r[-1].T? r.push(t) : (r[-1]+=t)
			return r } })()
	var id_c = alt_ws`filter! map… map! has… get… set… join? join2? ⁻¹uniq then⚓ ⁻¹ ∪! ∩! -! ?? *? +? ∪ ∩ ⊕ ‖ ⚓ -= += ? * + & | ∃ × ! -0 -1 -2 -3 -4 - 🔒 …`
	var id_num = alt_ws`0 1 2 3 4`
	var ζ_compile_nonliteral = ι=> ι
		.replace(/ifΔ!/g,'ifΔbang')
		.replace(/(=>|[=←:(,?]) *(?!\.\.\.)(‘?\.)/g,(ˣ,a,b)=> a+'(𐅭𐅞)=>𐅭𐅞'+b )
		.replace(𐅃𐅪𐅜𐅫𐅮||(𐅃𐅪𐅜𐅫𐅮= re`‘\.(${word}+)`.g ),(ˣ,ι)=> js`|> (ι=> new Property(ι,${ι}))` )
		.replace(/‘(?=\[)/g ,`|> (o=>( 𐅋𐅨𐅦𐅨𐅭 = o ,𐅯𐅭𐅝𐅨𐅮 ))` )
		.replace(𐅦𐅞𐅃𐅝𐅪||(𐅦𐅞𐅃𐅝𐅪= re`(\.)?(${𐅯Set(...postfix).map_(ι=> re`${ι}`)})(?=\s*([(:])?)`.g ),(ˣ,dot,id,right)=>0?0: { undefined:js`γ[${id}]` ,'(':js`[γ[${id}]]` ,':':js`${id}` }[dot?'(':right] )
		.replace(/✓/g,'true')
		.replace(/✗/g,'false')
		.replace(/∅/g,'undefined')
		.replace(𐅋𐅝𐅞𐅬𐅰||(𐅋𐅝𐅞𐅬𐅰= re`🏷(${word}+)(\s*)←`.g ),(ˣ,ι,s)=> js`…${ι+s}← 𐅯𐅮𐅦𐅬𐅂(__name(${ι})).ι=`) // an initial try ;probably .name inference needs another form
		.replace(/‘lexical_env/g,`𐅯𐅮𐅦𐅬𐅂(ι=> ι.eval_in_lexical_env= ι=>eval(ι) ).ι=`)
		.replace(/‽(?!\(|`| = \(…a\)=>)/g,'‽()')
		.replace(𐅨𐅋𐅦𐅜𐅦||(𐅨𐅋𐅦𐅜𐅦= re`(\[(?:${word}|[,…])+\]|\{(?:${word}|[,:…])+\}|${word}+)(\s*)←(?=[ \t]*(;|of\b|in\b)?)`.g ),(ˣ,name,ws,eq0)=> 'var '+name+ws+(eq0?'':'=') )
		.replace(/λ(?=\*?(?:[ \t][^\(=←]*)?\([^\)]*\)[ \t]*\{)/g,'function')
		.replace(𐅂𐅂𐅃𐅝𐅦||(𐅂𐅂𐅃𐅝𐅦= re`\.?@@(${word}+)`.g ),'[Symbol.$1]')
		.replace(𐅪𐅯𐅯𐅯𐅦||(𐅪𐅯𐅯𐅯𐅦= re`\.\.(${id_num})`.g ),(ˣ,ι)=> `[${ι}]`)
		.replace(𐅩𐅜𐅃𐅩𐅪||(𐅩𐅜𐅃𐅩𐅪= re`\.(${id_c})`.g ),(ˣ,ι)=> js`[${ι}]`)
		.replace(𐅝𐅩𐅭𐅪𐅃||(𐅝𐅩𐅭𐅪𐅃= re`(${id_c}):`.g ),(ˣ,ι)=> js`${ι}:`)
		.replace(/…/g,'...')
		.replace(/@/g,'this')
		// ! this is going to be really hard to take out
			.replace(/(['"])map\.\.\.\1/g,`'map…'`)
			.replace(/(['"])has\.\.\.\1/g,`'has…'`)
			.replace(/(['"])get\.\.\.\1/g,`'get…'`)
			.replace(/(['"])set\.\.\.\1/g,`'set…'`)
			.replace(/(['"])\.\.\.(←?)\1/g,`'…$2'`)
			// .replace(/\.‘this/g,'["‘@"]')
		.replace(/∞/g,'Infinity')
		.replace(/⇒(\s*([:{]))?/g,(ˣ,x,ι)=> '=>'+({ ':':'0?0' ,'{':'0?0:' }[ι]||_interrobang_())+x )
		.replace(𐅭𐅦𐅫𐅩𐅝||(𐅭𐅦𐅫𐅩𐅝= re`(^|(?!${word})[^\s\)]\s*)(=>(?:\s*=>)*)`.g ),(ˣ,t,ι)=> t+'()=>'["×"](ι.match(/=>/g)["‖"]))
		.replace(/↩ ?/g,'return ')
		.replace(/([^]|^)\^/g,(ˣ,ι)=> ι==='b'? '^' : ι+'**' )
		.replace(𐅨𐅂𐅫𐅯𐅃||(𐅨𐅂𐅫𐅯𐅃= re`#swap ((?:${word}|[.])+) ((?:${word}|[.])+)`.g ),(ˣ,a,b)=>{ var t = '_'+random_id.greek(9) ;return ζ_compile_nonliteral(`for(;;){ ${t} ← ${a} ;${a} = ${b} ;${b} = ${t} ;break}`) }) // why not just [a,b] = [b,a]?
		.replace(/\[#persist_here (.*?)\]/g,(ˣ,ι)=> '('+json2_read+js`)(${json2_show(φ(ι).buf)})`)
		.replace(𐅭𐅋𐅦𐅝𐅜||(𐅭𐅋𐅦𐅝𐅜= re`${word_extra}+`.g ) ,unicode_names.X)
		.replace(/([{([]\s*),/g,'$1')
		.replace(𐅮𐅰𐅰𐅝𐅭||(𐅮𐅰𐅰𐅝𐅭= re`return\s+var\s+(${word}+)`.g ),(ˣ,ι)=> `var ${ι} ;return ${ι}`)
		.replace(/(^|(?:^|(?:^|(?:^|(?!new ).).).)(?![.\w]|𐅯).)Set(?=\()/gm,(ˣ,a)=> a+'𐅯Set')
	var ζ_compile = memoize_tick(code=>{
		var t = code ;t = /^(\{|λ\s*\()/.test(t)? '0?0: '+t : t ;if( /^(\{|λ\s*\()/.test(t) ) t = '0?0: '+t // ! it is a clumsy hack to put this on all of these code paths
		return ζ_parse(t).map(ι=>0?0
			: ι.T==='comment'? ι.ι.replace(/^#/,'//')
			: ι.T? ι.ι
			: ζ_compile_nonliteral(ι)
			).join('') })
	ζ_compile["⁻¹"] = ι=> ι.replace(/\b(?:function|return|this)\b(?!['"])|\bvar \s*([\w_$Α-ΡΣ-Ωα-ω]+)(\s*)(=?)|\.\.\./g ,(ι,name,s,eq)=>0?0: {'function':'λ','return':'↩','this':'@','...':'…'}[ι] || (eq==='='? name+s+'←' : name+s+'←;') )
	return ζ_compile }

if( require.extensions && !require.extensions['.ζ'] )(()=>{
	require.extensions['.ζ'] = (module,ι)=> module._compile(ζ_compile(fs.readFileSync(ι,'utf8')),ι)
	var super_ = require.extensions['.js'] ;require.extensions['.js'] = (module,ι)=>{ (path.extname(ι)==='' && fs.readFileSync(ι,'utf8').re`#!/usr/bin/env ζ\s`? require.extensions['.ζ'] : super_)(module,ι) }
	})()

//################################### ζ infra ###################################
var Reflect_ownEntries = ι=> Reflect.ownKeys(ι).map(i=> [i,ι[i]]) // ??? those are non-reflected entries .but i think i can just deprecate this b4 i need to solve it
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
module.exports = to=> patched.has(to) || ( log('\x1b[34m[ζ]\x1b[0m patching') ,log(Error('<stack>')) ,patched.add(to) ,assign_properties_in(to,E_) )

//################################### prelude ###################################
E.protos = function*(ι){ for(;!( ι===null || ι===undefined ) ;ι = Object.getPrototypeOf(ι)) yield ι }

var 𐅞𐅪 = {} ;𐅞𐅪[γ["|>"]] (ι=> new Property(ι,"buf36")) .thunk=()=> npm`base-x@1.0.4`([.../[0-9a-z]/].join('')).encode

E.simple_flesh = ι=>{
	if( Tfun(ι) )return T(ι)+ι
	var t = [ ι,(i,ι)=>{ if( Tprim(ι)||Tarr(ι)) return ι ;else{ var r={} ;_l.keys(ι).sort().forEach(i=> r[i]=ι[i]) ;return r } } ]
	// try{
	return JSON.stringify(...t) }
	// }catch(e){ e.message==='Converting circular structure to JSON' || ‽(e) ;↩ npm`circular-json@0.4.0`.stringify(ι) } }
E.simple_hash = ι=> (𐅭𐅋𐅫𐅭𐅂||(𐅭𐅋𐅫𐅭𐅂= npm`xxhash@0.2.4`.hash64 ))(Buffer.from(simple_flesh(ι)),0x594083e1) [γ["|>"]] (ι=> ('0'["×"](12)+𐅞𐅪.buf36(ι)).slice(-12)) ;var 𐅭𐅋𐅫𐅭𐅂; // deprecated
E[γ["|>"]] (ι=> new Property(ι,"simple_hash2")) .thunk=()=>{
	var bigintstr_to_buf = ι=>{ ;var ι = npm`big-integer@1.6.26`(ι) ;var r = Buffer.alloc(8) ;r.writeUInt32BE( +ι.shiftLeft(-32) ,0 ) ;r.writeUInt32BE( +ι.and(2**32-1) ,4 ) ;return r }
	var buf36 = npm`base-x@1.0.4`([.../[0-9a-z]/].join('')).encode
	var farmhash_stable_64 = npm`farmhash@2.0.4`.fingerprint64 [γ["≫"]] (bigintstr_to_buf)
	return simple_flesh [γ["≫"]] (Buffer.from) [γ["≫"]] (farmhash_stable_64) [γ["≫"]] (buf36) [γ["≫"]] ((𐅭𐅞)=>𐅭𐅞.padStart(13,'0').slice(1)) }

var memo_frp = (names,within,f)=>{
	var dir = φ`~/file/.cache/memo_frp/${names}`
	if( within ){
		try{ var t = fs.readdirSync(dir+'') }catch(e){ e.code==='ENOENT' || _interrobang_(e) ;var t = [] }
		var now = Time().i ;t = t.sort().filter(ι=> Time(ι.re`^\S+`[0]).i >= now - within )[-1]
		if( t ) return dir.φ(t).json2.ι }
	var a = Time().iso ;var ι = f() ;var b = Time().iso
	dir.φ`${a} ${random_id(10)}`.json2 = { names ,date:[a,b] ,ι } ;return ι }
E.memoize_persist = f=>{
	// may race condition but is unlikely & relatively harmless
	// it would be lovely if this s could use data from their previous versions
	var store = φ`/tmp/ζpersist_${simple_hash(f)}` ;var store_ι = store.json||{}
	return (...a)=>{ var t = store_ι[γ["|>"]] (o=>( 𐅋𐅨𐅦𐅨𐅭 = o ,𐅯𐅭𐅝𐅨𐅮 ))[simple_hash(a)] ;return t["∃"]? t.ι : ( t.ι = f(...a) ,store.json = store_ι ,store_ι = store.json ,t.ι ) } }
E.memoize_proc = f=>{ var cache = new Map() ;return ((...ι)=> cache['has…'](...ι)? cache['get…'](...ι) : cache['set…'](...ι,f(...ι)) ) [γ['…←']] ({cache}) }
E.memoize_weak = f=>{ var cache = new WeakMap() ;return (ι=>{ if( cache.has(ι) ) return cache.get(ι) ;Tprim(ι) && _interrobang_() ;var r = f(ι) ;cache.set(ι,r) ;return r }) [γ['…←']] ({cache}) }
// resource management is a thing & i havent thought about it enough
// WeakMap doesn't fix memoization resource management when keys are Tprim or equality isn't ===
// this does
E.memoize_tick = f=>{ f = memoize_proc(f) ;var cache = f.cache ;return (ι=>{ var t = ι+'' ;process.nextTick(()=> cache.delete(t) ) ;return f(ι) }) [γ['…←']] ({cache}) }
// ? frp will remove the last use(s) of @device0
E.thisdevice0 = ι=> φ`~/Library/Caches/ζ.persist.0/${ι+''}`[γ["|>"]] (ι=> new Property(ι,"json"))
E.thisproc = ι=> 𐅜𐅩𐅭𐅦𐅰[γ["|>"]] (o=>( 𐅋𐅨𐅦𐅨𐅭 = o ,𐅯𐅭𐅝𐅨𐅮 ))[ι+''] ;var 𐅜𐅩𐅭𐅦𐅰 = {}

// ;[#p ersist_here ~/code/declare/npm]
var _npm = ι=>{var [ˣ,name,version,sub] = ι.re`^(.*?)(?:@(.*?))?(/.*)?$`
	// in theory, log whenever somebody uses an outdated lib
	var abs_name = ()=> name+'@'+version
	if(! version ){ sfx`ack` ;version = shᵥ`npm show ${ι} version`+'' ;return 'npm`'+abs_name()+'`' ;return }
	var cache = φ`~/.npm/${name}/${version}` ;var final = cache.φ`/node_modules/${name}`+(sub||'')
	try{ return require(final) }catch(e){ e.code==='MODULE_NOT_FOUND' || _interrobang_(e) }
	cache["∃"] || shᵥ`cd ~ ;npm cache add ${abs_name()}`
	var a;var b; (a=cache.φ`package.json`).ι = {description:'-',repository:1,license:'ISC'} ;(b=cache.φ`README`).ι = '' ;shᵥ`cd ${cache} && npm --cache-min=Infinity i ${abs_name()}` ;a.ι = b.ι = undefined
	return require(final) }
E.npm = ι=> ((ι+='').includes('@')? 𐅪𐅰 : _npm)(ι) ;var 𐅪𐅰 = memoize_proc(_npm) // such a hack. takes 300ns because of the template string +='' hack ;80ns without

E.unicode_names = ι=> [...ι].map(memoize_persist(ι=>
	(𐅩𐅩𐅩𐅝𐅋||(𐅩𐅩𐅩𐅝𐅋= (()=>{
		var unicode_data = 'Cc Cf Co Cs Ll Lm Lo Lt Lu Mc Me Mn Nd Nl No Pc Pd Pe Pf Pi Po Ps Sc Sk Sm So Zl Zp Zs'.split(' ')['map…'](ι=> _l.values(npm('unicode@0.6.1/category/'+ι)) )
		return unicode_data.filter(ι=> !/^</.test(ι.name)).map(ι=> [parseInt(ι.value,16) ,'_'+ι.name.replace(/[- ]/g,'_').toLowerCase()+'_'])._.object()
		})() ) )[ord(ι)]).X).join('') ;var 𐅩𐅩𐅩𐅝𐅋;

//########## parsers and such ###########
E[γ["|>"]] (ι=> new Property(ι,"regex_parse_0")) .thunk=()=>{var t; // soon to be deprecated
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
	return ι=>0?0: {ι:OR_or_SEQ.parse(ι.source) ,flags:ι.flags} }
E[γ["|>"]] (ι=> new Property(ι,"applescript")) .thunk=()=>0?0: {
	parse: (()=>{
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
	  return ι=> ι===''? undefined : ws(value).parse(ι) })()
	,print: ι=> Tnum(ι)? ι+'' : Tstr(ι)? '"'+ι.replace(/["\\]/g,'\\$&')+'"' : Tarr(ι)? '{'+ι.map(applescript.print.X).join(',')+'}' : _interrobang_()
	}

//#######################################
var cartesian_str =(𐅭𐅞)=>𐅭𐅞.reduce((a,b)=>{ var r = [] ;a.forEach(a=> b.forEach(b=> r.push(a+b))) ;return r } ,[''])
var genex_simple = ι=>{ var P = require('parsimmon')
	var unit = P.lazy(()=> P.alt( P.noneOf('()|') ,P.string('(').then(s_or).skip(P.string(')')).map(ι=>0?0:{T:'capture',ι}) ) )
	var s_or = P.sepBy(unit.many(),P.string('|')).map(ι=> ι.length > 1? {T:'or',ι:ι} : ι[0])
	var Λ = ι=> ι.T==='or'? ι.ι.map(Λ) : ι.T==='capture'? Λ(ι.ι) : Tarr(ι)? cartesian_str(ι.map(Λ)) : [ι]
	return Λ(P.alt( P.string('|') ,unit ).many().parse(ι).value) }
var genex = function Λ(ι){return 0,
	Tstr(ι)? [ι] :
	ι.flags!==undefined?( ι.flags.replace(/u/,'') && _interrobang_() ,Λ(ι.ι) ):
	ι.T==='capture'? Λ(ι.ι) :
	ι.T==='escape'? _interrobang_() :
	ι.T==='or'? ι.ι['map…'](Λ) :
	ι.T==='seq'? cartesian_str(ι.ι.map(Λ)) :
	// ι.T==='times'? # Λ(ι.ι).map…(x=> _l.range(ι.for[0],ι.for[1]+1).map(i=> x.×(i)) ) :
	// 	ιs ← Λ(ι.ι)
	ι.T==='set'? ι.ι['map…'](ι=>
		Tarr(ι)? _l.range(ord(ι[0]),ord(ι[1])+1).map(chr) :
		ι.T==='escape'? _interrobang_() :
			[ι] ):
		_interrobang_(ι) }

E [γ['…←']](_u(Math).pick('abs','ceil','exp','floor','log10','log2','max','min','round','sqrt','cos','sin','tan'),{ ln:Math.log ,π:Math.PI ,τ:Math.PI*2 ,e:Math.E ,'⍟':Math.log })
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
E.random = function(ι){return arguments.length===0? Math.random() : Tnum(ι)? random()*ι |0 : _l.sample(ι) }
E[γ["|>"]] (ι=> new Property(ι,"random_id")) .thunk=()=>{
	var t = αβ=> (L=> L.map(()=> random(αβ)).join('')) [γ['…←']] ({αβ})
	var random_id = t([.../[0-9a-z]/])
	random_id.braille = t([...re`[⠁-⣿]`]) // [⠀-⣿]
	random_id.greek = t([...'𐅂𐅃𐅋𐅜𐅝𐅞𐅦𐅨𐅩𐅪𐅫𐅬𐅭𐅮𐅯𐅰'])
	return random_id }

E.ord = (ι,i)=> Tnum(ι)? ι : ι.codePointAt(i)
E.chr = ι=> Tstr(ι)? ι : String.fromCodePoint(ι)
process.stdio = [ process.stdin,process.stdout,process.stderr ]
E._pisces__on_exits = f=> (𐅃𐅬𐅩𐅮𐅦||(𐅃𐅬𐅩𐅮𐅦= require('signal-exit') ))((i,sig)=>{
	if( i===null ) i = 128+{ SIGHUP:1,SIGINT:2,SIGQUIT:3,SIGTRAP:5,SIGABRT:6,SIGIOT:6,SIGSYS:12,SIGALRM:14,SIGTERM:15,SIGXCPU:24,SIGXFSZ:25,SIGVTALRM:26,SIGUSR2:31 }[sig]
	f(i,sig) }) ;var 𐅃𐅬𐅩𐅮𐅦;

var 𐅯𐅩𐅪𐅨𐅃 = function*(θ){ for(;θ.i<θ.l["‖"];) yield θ.l[θ.i++] }
E.seq = ι=>{
	var r = new_(seq)
	if( Tarr(ι) ){ ;r.ι = 𐅯𐅩𐅪𐅨𐅃(r) ;r.i = 0 ;r.l = ι }
	else if( !ι.next ) r.ι = ι[Symbol.iterator]()
	else r.ι = ι
	return r }
// seq.cartesian = (…ι)=>{ ... }
// E.cartesian = (…ι)=> […seq.cartesian(…ι)]
seq.prototype = {
	ι:undefined ,i:undefined ,l:undefined
	,map:function*(f){ for(var t of this.ι) yield f(t) }
	// ,'map…':λ(){} ,fold(){} ,×(){} ,filter(){} ,pin(){} ,find_(){} ,slice(){} ,'‖':λ(){} ,some(){} ,every(){}
	}
seq.prototype[γ["|>"]] (ι=> new Property(ι,"next_ι")) .get= function(){return this.ι.next().value }
seq.prototype[γ["|>"]] (ι=> new Property(ι,"next_ιι")) .get= function(){ var t = this.ι.next() ;if( t.done )return ;t = t.value ;t===undefined && _interrobang_() ;return t }
seq.prototype[γ["|>"]] (ι=> new Property(ι,"clone")) .get= function(){ var t= seq(this.l) ;t.i= this.i ;return t }
// (λ*(){ yield 5 })().next()
// Object.getOwnPropertyDescriptors([…protos(λ*(){}())][2])
// […protos(Set())].map(Object.getOwnPropertyDescriptors)
// […protos(Set().@@iterator())].map(Object.getOwnPropertyDescriptors)
// ok,,,, the cloneability property desired here is fundamentally impossible
// yay

E._midline_horizontal_ellipsis_ = ι=> _l.range(ι)
E._almost_equal_to_ = _l.isEqual
E._not_almost_equal_to_ = (a,b)=> ! _almost_equal_to_(a,b)
E.zip_min = (a,b)=> _l.zip( a["‖"]>b["‖"]? a.slice(0,b["‖"]) : a , a["‖"]<b["‖"]? b.slice(0,a["‖"]) : b )
assign_properties_in_E_informal({
'(Array|Set|Map).prototype._':{ get(){return _u(this)} }

,'(Array|Buffer|String|Function).prototype.‖':{ get(){return this.length } }
,'(Set|Map).prototype.‖':{ get(){return this.size } }

// goal: replace `map` with `≫` everywhere .implementation slowed in hope for clarity wrt lists in the future of See
// 'Array.prototype.map'
// ,'Buffer.prototype.map':λ(f){ r ← Buffer.alloc(@.‖) ;for(i←0;i<@.‖;i++) r.push(f(@[i])) ;↩ r } does not even work
,'Set.prototype.map':function(f){return [...this].map(f) }
,'Map.prototype.map':function(f){return [...this.entries()].map(([i,ι])=> f(ι,i,this)) }
,'Number.prototype.map':function(f){'use strict' ;var ι=+this ;var r = Array(ι) ;for(var i=0;i<ι;i++) r[i] = f(i,i,ι) ;return r }

,'Array.prototype.map_':Array.prototype.map
,'Set.prototype.map_':function(f){return new Set([...this].map(f)) }
,'Map.prototype.map_':function(f){return new Map([...this.entries()].map(f)) }

,'(Set|Map).prototype.some':function(f){return [...this].some(f) }
,'(Set|Map).prototype.every':function(f){return [...this].every(f) }

// ,'Array.prototype.map…':λ(f){ r ← [] ;for(i←0;i<@.‖;i++){ t ← f(@[i],i,@) ;for (j←0;j<t.‖;j++) r.push(t[j]) } ;↩ r }
,'Array.prototype.map…':function(f){ var r = [] ;for(var i=0;i<this["‖"];i++) r.push(...f(this[i],i,this)) ;return r }
// ,'Buffer.prototype.map…':λ(f){↩ Buffer.concat(@.map(f)) }
,'(Set|Map|Number).prototype.map…':function(f){return this.map(f)['…'] }

,'Set.prototype.filter':function(f){return 𐅯Set(...[...this].filter(f)) }

,'Array.prototype.edge_comple':function(f){ var 𐅃𐅝={}; var r = [] ;for(var ι of this){ var t = f(ι) ;t===𐅃𐅝 ||( 𐅃𐅝= t ,r.push([]) ) ;r[-1].push(ι) } ;return r }
,'Set.prototype.partition':function(f){return _u([...this]).partition(f).map(ι=> 𐅯Set(...ι)) }

,'Array.prototype.…':{ get(){return this['map…'](ι=>ι) } }

,'Array.prototype.fold':Array.prototype.reduce
,'Array.prototype.foldr':Array.prototype.reduceRight

,'Array.prototype.repeat':function(x){return x<=0? [] : x['map…'](()=> this) }
,'Buffer.prototype.repeat':function(x){return Buffer.concat(x<=0? [] : x.map(()=> this)) }

// ,'String.prototype.trim':λ(ι=/\s+/)){↩ @.replace(re`^${ι}|${ι}$`.g,'') }
,'Array.prototype.trim':function(ι){ var a = this[0]===ι ;var b = this[-1]===ι ;return !(a||b)? this : this.slice( a?1:0 ,b?"-1":this["‖"] )}

,'String.prototype.×':String.prototype.repeat
,'Array.prototype.×':function(x){return 0?0
	: Tnum(x)? x<=0? [] : x['map…'](()=> this)
	: Tarr(x)? this['map…'](a=> x.map(b=> [a,b] ))
	: _interrobang_() }
,'Buffer.prototype.×':function(x){return Buffer.concat(x<=0? [] : x.map(()=> this)) }

,'Set.prototype.join':function(ι){return [...this].join(ι) }

,'(Array|Buffer|String|Set).prototype.count':function(){ var r = new Map() ;for (var t of this) r.set(t ,(r.has(t)? r.get(t) : 0)+1 ) ;return r }
,'(Array|Buffer|String|Set).prototype.group':function(f){ f||(f = ι=>ι) ;var r = new Map() ;for (var t of this){ ;var t2 = f(t) ;var t3 = r.get(t2) ||( r.set(t2,t3=𐅯Set()) ,t3 ) ;t3.add(t) } ;return r }
,'(Array|Buffer|String|Set).prototype.group_uniq':function(f){ f||(f = ι=>ι) ;var r = new Map() ;for (var t of this) r.set(f(t),t) ;return r }

,'Map.prototype.zip':function(...a){ a.unshift(this) ;var r = new Map() ;a.forEach((ι,i)=> ι.forEach((ι,k)=>{ var t = r.get(k) || [undefined]["×"](a["‖"]) ;t[i] = ι ;r.set(k,t) })) ;return r }

,'(Array|Buffer|String).prototype.chunk':function(L){return _l.range(0,this["‖"],L).map(i=> this.slice(i,i+L)) }
,'(Array|Buffer|String).prototype.windows':function(L){return (this["‖"]-L+1).map(i=> this.slice(i,i+L)) }
,'(Array|Buffer|String).prototype.-1':{get(){return this["‖"]<1? undefined : this[this["‖"]-1] },set(ι){ this["‖"]<1 || (this[this["‖"]-1] = ι) }}
,'(Array|Buffer|String).prototype.-2':{get(){return this["‖"]<2? undefined : this[this["‖"]-2] },set(ι){ this["‖"]<2 || (this[this["‖"]-2] = ι) }}
,'(Array|Buffer|String).prototype.-3':{get(){return this["‖"]<3? undefined : this[this["‖"]-3] },set(ι){ this["‖"]<3 || (this[this["‖"]-3] = ι) }}
,'(Array|Buffer|String).prototype.-4':{get(){return this["‖"]<4? undefined : this[this["‖"]-4] },set(ι){ this["‖"]<4 || (this[this["‖"]-4] = ι) }}

,'(Array|Set).prototype.∪':function(...a){return new Set([this,...a]['map…'](ι=> [...ι])) } // why not .… ?
,'(Array|Set).prototype.∩':function(...a){ var r = new Set(this) ;for(var x of a){ x = T.Set(x)? x : new Set(x) ;for(var ι of r) x.has(ι) || r.delete(ι) } ;return r }
,'(Array|Set).prototype.-':function(...a){ var r = new Set(this) ;for(var t of a) for(var ι of t) r.delete(ι) ;return r }
,'(Array|Set).prototype.⊕':function(b){var a=this ;return a["-"](b)["∪"](b["-"](a)) }

,'Map.prototype.has…':function(...as){var ι=this ;as["‖"]>=1||_interrobang_() ;var _1 = as.pop() ;for(var a of as){ if(!ι.has(a))return ;ι = ι.get(a) } ;return ι.has(_1) }
,'Map.prototype.get…':function(...as){var ι=this ;for(var a of as){ if(!ι.has(a))return ;ι = ι.get(a) } ;return ι }
,'Map.prototype.set…':function(...as){var t;var ι=this ;as["‖"]>=2||_interrobang_() ;var v = as.pop() ;var _1 = as.pop() ;for(var a of as) ι = ι.has(a)? ι.get(a) : (ι.set(a,t=new Map()),t) ;ι.set(_1,v) ;return v }
// ,'Map.prototype.|':λ(f){↩ ((…ι)=> @.has…(…ι)? @.get…(…ι) : f(…ι)) …←([@,f]) …←({set…:(…ι)=>@.set…(…ι)}) }

,'(Set|Map).prototype.filter!':function(f){ this.forEach((ι,i)=> f(ι,i,this) || this.delete(i)) }
,'Set.prototype.pop':function(){ var t = this[0] ;this.delete(t) ;return t }
,'Set.prototype.0':{get(){return seq(this).next_ι }}
,'(Array|Set).prototype.-eq':function(...a){ var t = _u([...this]).groupBy(simple_flesh) ;a.forEach((𐅭𐅞)=>𐅭𐅞.forEach(ι=> delete t[simple_flesh(ι)])) ;return _l.values(t)['…'] }

,'Map.prototype.⁻¹uniq':{get(){return new Map([...this.entries()].map(([a,b])=>[b,a])) }}
,'Map.prototype.⁻¹':{get(){return [...this.keys()].group(ι=> this.get(ι)) }}

,'Array.prototype.find_':function(f){ var r; if( this.some(function(ι,i,o){var t; if( (t= f(ι,i,o))!==undefined ){ r = [i,ι,t] ;return true } })) return r }
,'Array.prototype.find_index_deep':function(f){
	for(var i=0;i<this["‖"];i++){ var ι = this[i]
		if( Tarr(ι)){ var t = ι.find_index_deep(f) ;if( t) return [i,...t] }
		else{ if( f(ι) )return [i] }
		} }
,'Array.prototype.find_last_index':function(f){ for(var i=this["‖"]-1;i>=0;i--) if( f(this[i],i,this) ) return i }
,'Array.prototype.join_':function(...s){ var r= [] ;var _0= true ;for(var t of this) _0?( _0= false ,r.push(t) ): r.push(...s,t) ;return r }

// ,'Set.prototype.@@iterator':Set.prototype.values
// ,'Map.prototype.@@iterator':Map.prototype.entries
,'RegExp.prototype.@@iterator':function*(){yield* genex(regex_parse_0(this)) }
,'RegExp.prototype.exec_at':function(ι,i){ this.lastIndex = i ;return this.exec(ι) }

,'stream.Readable.prototype.pin':function(){return Π(yes=>{ var t = [] ;this.resume() ;this.on('data',ι=> t.push(ι) ).on('end',()=> yes(Buffer.concat(t)) ) })}
,'Buffer.prototype.pipe':function(to,opt){ var t = new stream.Duplex() ;t.push(this) ;t.push(null) ;return t.pipe(to,opt) }
,'EventEmitter.prototype.P':function(id){id+='' ;return new_(𐅯𐅜𐅝𐅃𐅋) [γ['…←']] ({host:this,id}) }
,'EventEmitter.prototype.Π':function(id){return this.P(id).Π }
})
var 𐅯𐅜𐅝𐅃𐅋 = { emit(...a){return this.host.emit(this.id,...a) } ,on(f){ this.host.on(this.id,f) ;return this } }
𐅯𐅜𐅝𐅃𐅋[γ["|>"]] (ι=> new Property(ι,"Π")) [γ['…←']] ({ get(){return Π(yes=> this.host.once(this.id,yes)) } })
Promise.prototype[γ["|>"]] (ι=> new Property(ι,"status")) .f1ι= function(){var get;
	if(get= b_util&&b_util.getPromiseDetails ){ var [r,ι] = get(this) ;r = [undefined,true,false][r] ;if( r!==undefined ){ [this.status,this.ι] = [r,ι] ;return r } }
	else{ var t = r=> ι=>{ [this.status,this.ι] = [r,ι] ;return this.status } ;this.then(t(true),t(false)) ;t(undefined)(undefined) ;return this.status } }
Promise.prototype[γ["|>"]] (ι=> new Property(ι,"ι")) .f1ι= function(){ if( this.status!==undefined ) return this.ι }
// Promise.prototype[|>] = (ι,f)=> ι===Promise.prototype? f(ι) : ι.status? f(ι.ι) : ι.then(f) # breaks things

var TimerCons = function(a,b){this.a=a;this.b=b} ;TimerCons.prototype = { clear:function(){this.a.clear();this.b.clear()} ,ref:function(){this.a.ref();this.b.ref()} ,unref:function(){this.a.unref();this.b.unref()} }
assign_properties_in_E_informal({
'Function.prototype.!':{get(){return (...a)=> !this(...a) }}
,'Function.prototype.P':function(...a){return this.bind(undefined,...a) }
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
var t; Object.getPrototypeOf(( t=setImmediate(()=>{}) ,clearImmediate(t) ,t )) [γ['…←']] ({
	clear(){ clearImmediate(this) }
	,ref(){} ,unref(){}
	})
var t; Object.getPrototypeOf(( t=setTimeout(()=>{},0) ,clearTimeout(t) ,t )) [γ['…←']] ({
	clear(){ this._repeat? clearInterval(this) : clearTimeout(this) }
	})

E.walk = (ι,f,k,o)=>( Tprim(ι)||_u(ι).forEach((ι,k,o)=> walk(ι,f,k,o)) ,ι!==undefined && ι!==null && f(ι,k,o) ,ι )
E.walk_graph = (ι,f,seen=[])=> !( Tprim(ι) || seen.includes(ι) ) && ( seen.push(ι) ,_u(ι).forEach(ι=> walk_graph(ι,f,seen)) ,seen.pop() ,ι!==undefined && ι!==null && f(ι) ,ι )
E.walk_both_obj = (ι,fᵃ,fᵇ,fseen,seen=[])=> fseen && seen.includes(ι)? fseen(ι) : !( Tprim(ι) || Tfun(ι) || seen.includes(ι) ) && ( fᵃ(ι) ,seen.push(ι) ,_u(ι).forEach(ι=> walk_both_obj(ι,fᵃ,fᵇ,fseen,seen)) ,seen.pop() ,fᵇ(ι) ,ι )
E.walk_fold = (ι,f,k,o)=> Tprim(ι)? ι : Tarr(ι)? ( ι = ι.map((ι,k,o)=> walk_fold(ι,f,k,o)) ,f(ι,k,o) ) : ( ι = _u(ι).map((ι,k,o)=> [k,walk_fold(ι,f,k,o)])._.object() ,f(ι,k,o) )
E.walk_obj_edit = (ι,f)=> Tprim(ι) || Tfun(ι)? ι : Tarr(ι)? ι.map(ι=> walk_obj_edit(ι,f)) : (()=>{ for (var k in ι) if( Object.prototype.hasOwnProperty.call(ι,k)) ι[k] = walk_obj_edit(ι[k],f) ;return f(ι) })()
E.search_obj = (ι,f)=>{ var r=[] ;walk(ι,(ι,k,o)=> ι!==undefined && ι!==null && f(ι,k,o) && r.push(ι)) ;return r }
E.search_graph = (ι,f)=>{ var r=[] ;walk_graph(ι,ι=> ι!==undefined && ι!==null && f(ι) && r.push(ι)) ;return r }
// the right name for walk is going to be along the lines of
// f /@ x       x.map(f)
// f //@ x      postwalk(x,f) # MapAll
// it could be a data structure that you can fmap over

E.hrtime = function(ι){ var t = arguments.length===0? process.hrtime() : process.hrtime([ι|0,(ι-(ι|0))*1e9]) ;return t[0] + t[1]*1e-9 }
E.Time = function(ι){ var r = arguments.length===0? new Date() : ι instanceof Date? ι : new Date(Tnum(ι)? ι*1e3 : ι) ;r.toString = function(){return util.inspect(this) } ;return r }
assign_properties_in_E_informal({
'Date.prototype.local':{get(){return new Date(this) [γ['…←']] ({__local:true})}}
,'Date.prototype.i':{get(){return +this / 1e3}}
})

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
	var job_path = φ`~/Library/LaunchAgents/${job.Label}.plist` ;job_path["∃"] ||( job_path.ι = job ) ;_almost_equal_to_( job_path.plist ,job ) || _interrobang_()
	return { cmd ,job_path ,restart(){ var t = this.job_path ;shᵥ`launchctl unload ${t} &>/dev/null ;launchctl load ${t}` } } }
os_daemon[γ["|>"]] (ι=> new Property(ι,"this")) .thunk=()=> process.env.anon_tns7w && os_daemon(process.env.anon_tns7w)

module.__proto__.if_main_do = function(f){ !this.parent && f(...process.argv.slice(2)) }

E.robot_key_tap = ι=> require_new(φ`~/code/scratch/keyrc/it.ζ`).robot_key_tap(ι)
E.KEY_once = (...a)=> require_new(φ`~/code/scratch/keyrc/it.ζ`).KEY_once(...a)

var normalize_count = ι=>{ ι.forEach((ι,i,l)=> ι===0 && l.delete(i)) ;return ι }
var diff_Set = (a,b)=>{
	[a,b].every(T.Set) || _interrobang_()
	// [a,b] *.count zip **|0 *-
	return normalize_count(new Map(Map.prototype.zip.call(...[b,a].map((𐅭𐅞)=>𐅭𐅞.count())).map(([a,b],i)=>[i ,(a||0) - (b||0)])))
		[γ["!>"]]((𐅭𐅞)=>𐅭𐅞[γ["|>"]] (ι=> new Property(ι,"name")) [γ['…←']] ({ value:a.name ,enumerable:false }) ) }
E.Δ_Sets = (...a)=>{ var f = a.pop()
	var start = a.map(ι=> T.Set(ι)? new Set(ι) : _interrobang_())
	f()
	return _l.zip(start,a).map(a=> diff_Set(...a)).filter((𐅭𐅞)=>𐅭𐅞["‖"]).map(ι=>0?0: { Δ:ι }) }

E.falsy = ι=> ι===undefined||ι===null||ι===false
E.orundefined = (a,b)=> a!==undefined? a : b

//##### metaprogramming → runtime macros built on top of template literals ######
// to design this correctly ,(ss,…ιs) => (s,…a) or maybe (`s${a}`) lol no
// existing semistandard usage is in
// 	im_autowhite
// 	scratch.txt
// 	ζ/it.ζ
// s is interned ,so use it as a memoization key for things
E.is_template0 = (ss,ιs)=> ss && Tarr(ss.raw) && ss.raw["‖"]-1 === ιs["‖"]
E.is_template = ([ss,...ιs])=> is_template0(ss,ιs)
var tmpl_flatten = (raw2,ιs2)=> _l.zip(raw2,ιs2)['…'].slice(0,-1).filter(ι=> ι!=='')
E.simple_template = (ss,ιs,filter)=>{ is_template0(ss,ιs) || _interrobang_()
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

E.clipboard = slot0( ()=> shᵥ`pbpaste`+'' ,ι=> shₐ`${ζ_inspect(ι)} |`` pbcopy` )
E.sb = function self(){return self.𐅰𐅂𐅫𐅯𐅯() } // let user use sb as callable
sb[γ["|>"]] (ι=> new Property(ι,"tab")) .get=()=>{
	var r = sbᵥ`[serialize(ι) for ι in (ι.view() for ι in sublime.windows() for ι in ι.sheets()) if ι]`
	r.active = sbᵥ`serialize(sublime.active_window().active_sheet().view())`
	;[...r,r.active].filter(ι=>ι).map((𐅭𐅞)=>𐅭𐅞[γ["|>"]] (ι=> new Property(ι,"ι")) .host={ enumerable:false,
		get(){return sbᵥ` view = deserialize(${this}) ;view.substr(Region(0,view.size())) ` },
		set(ι){ sb_editᵥ(this)` view.replace(edit,Region(0,view.size()),${ι}) ` },
		} )
	r[γ["|>"]] (ι=> new Property(ι,"push")) [γ["!>"]]((𐅭𐅞)=>𐅭𐅞.enumerable= false ) .ι = function(ι){ shₐ`${ζ_inspect(ι)} |`` open -a 'Sublime Text.app' -f` ;this.length = 0 ;(()=> this [γ['…←']] (sb.tab) ).in(0.02) } // ! wtf async/sync mix
	return r }

var fs_ipc_emit = (port,ι)=>{ φ`/tmp/fs_ipc_${port}`.ι = ι ;return shᵥ`curl -s -X PUT localhost:${port}`+'' } // net.Socket

E.sbᵥ = (ss,...ιs)=>{
	var ENC = JSON.stringify ;var ι = simple_template(ss,ιs).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('')
	var t = JSON.parse(fs_ipc_emit(34289,ι)) ;t===null &&( t = undefined ) ;return t }
E.sb_editᵥ = view=>(ss,...ιs)=>{ sbᵥ`edit(${view},${py(ss,...ιs)})` }

// sublime/sb
// 	tab
// 	view

// would like to embed regex in [] and have that be ok ;ie re`[${/[a-z]/}]` = /[a-z]/
E.re = (ι,...ιs)=>(
	is_template0(ι,ιs)
		? simple_template(ι,ιs,[(...a)=>re(...a).source,'']).map(ι=> !Tstr(ι)? 𐅋𐅨𐅨𐅜𐅦(ι.raw) : ι).join('')
		: 𐅋𐅨𐅨𐅜𐅦(ι)
	) [γ["|>"]](ι=> RegExp(ι,'u'))
var 𐅋𐅨𐅨𐅜𐅦 = ι=>0?0
	: T.RegExp(ι)? ( ι.flags.replace(/[gy]/g,'')==='u' || _interrobang_() ,ι.source )
	: Tarr(ι)? ι.map(𐅋𐅨𐅨𐅜𐅦).join('')
	: T.Set(ι)? `(?:${ι.map(𐅋𐅨𐅨𐅜𐅦).join('|')})`
	: (ι+'').replace(/([.*+?^${}()\[\]|\\])/g ,String.raw`\$1`)
assign_properties_in_E_informal({
'String.prototype.re':function(...a){return this.match(re(...a)) }
,'RegExp.prototype.g':{get(){return RegExp(this.source,this.flags.replace(/g/,'')+'g') }}
,'RegExp.prototype.i':{get(){return RegExp(this.source,this.flags.replace(/i/,'')+'i') }}
,'RegExp.prototype.m':{get(){return RegExp(this.source,this.flags.replace(/m/,'')+'m') }}
,'RegExp.prototype.u':{get(){return RegExp(this.source,this.flags.replace(/u/,'')+'u') }}
,'RegExp.prototype.y':{get(){return RegExp(this.source,this.flags.replace(/y/,'')+'y') }}
})

E.js = E.py = (ss,...ιs)=>{ var ENC = JSON.stringify ;return simple_template(ss,ιs).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι ).join('') }
E.ζjs = (ss,...ιs)=>{ var ENC = JSON.stringify ;return simple_template(ss,ιs).map(ι=> !Tstr(ι)? ENC(ι.raw) : ζ_compile(ι) ).join('') }
E.ζ = (ss,...ιs)=>{ var ENC = ι=> ι===undefined? '∅' : JSON.stringify(ι) ;return simple_template(ss,ιs).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('') }

E.sh = (ss,...ιs)=>{ var ENC = ι=> "'"+(ι+'').replace(/'/g,"'\\''")+"'" ;return simple_template(ss,ιs,[sh,' ']).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('') }
sh.clear = "/usr/bin/clear && printf %s $'\\e[3J'"
var ellipsify = ι=> util_inspect_autodepth(ι.slice(0,100))+(ι.slice(100)["‖"]?'…':'')

var if_sh_err = (name,code,ι)=>{ if( ι.status ) throw Error(name+'`'+code+'` → status:'+ι.status+' ,stderr:'+ellipsify(ι.stderr+'')) [γ['…←']] (_u(ι).pick('status','stdout','stderr')) }
E.shᵥ = (ss,...ιs)=>{ var code = sh(ss,...ιs)
	// ι ← process_spawn('/bin/sh',{ ,args:['-c',code] ,⚓:1 })
	var ι = require('child_process').spawnSync(code,{shell:true})
	if_sh_err('shᵥ',code,ι)
	return ι.stdout [γ['…←']] ({ toString(...a){ var ι = Buffer.prototype.toString.call(this,...a) ;return a["‖"]? ι : ι.replace(/\n$/,'') } }) }
var _shₐ = (ss,ιs,opt={})=>{
	if( ss["‖"]===2 && ss[0]==='' && ss[1].re`^ *\|$`){ opt.stdio && _interrobang_() ;opt.stdio = [φ.fd.from(ιs[0]),'pipe','pipe',] ;return shₐ2(opt) }
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
	if( Tstr(ι[0]) && (t=ι[0].re`^(?!tell )([\w ]+):`)){ ι[0] = ι[0].slice(t[0]["‖"]) ;ι = [osa`tell app ${t[1]};` ,...ι ,' ;end tell'] }
	if( !Tstr(ι[0]) && Tstr(ι[0].raw) && ι[0].raw.re`^[\w ]+$` && Tstr(ι[1]) && (t=ι[1].re`^ *:`)){ ι[1] = ι[1].slice(t[0]["‖"]) ;ι = [osa`tell app ${ι.shift().raw};` ,...ι ,' ;end tell'] }
	return ι.map(ι=> !Tstr(ι)? applescript.print(ι.raw) : ι.replace(/;/g,'\n') ).join('') }
E.osaᵥ = (ss,...ιs)=>{ var ι = osa(ss,...ιs) ;return applescript.parse(shᵥ`osascript -ss -e ${ι}`+'') }
E.osaₐ = (ss,...ιs)=>{ var ι = osa(ss,...ιs) ;shₐ`osascript -ss -e ${ι}` }

E.terminal_do_script = (a,b)=>{ φ`/tmp/__·`.ι = a ;osaᵥ`terminal: do script "·" …${b}` } // ~/.bashrc.ζ :: E['·']

// such hack
var json2_read = ι=>{ var r = JSON.parse(ι) ;(function Λ(ι,k,o){if( ι.type==='Buffer' ){
	var t = 'data' in ι || 'utf8' in ι? Buffer.from(ι.data||ι.utf8) : 'base64' in ι? Buffer.from(ι.base64,'base64') : _interrobang_()
	if( o===undefined ) r = t ;else o[k] = t
	} else if(! Tprim(ι) ) _u(ι).forEach(Λ)})(r) ;return r }
var json2_show = ι=> JSON_pretty(ι,ι=>{var t;
	if( Buffer.isBuffer(ι)) return ι.equals(Buffer.from(t=ι+''))? {type:'Buffer' ,utf8:t} : {type:'Buffer' ,base64:ι.toString('base64')}
	return ι})
E[γ["|>"]] (ι=> new Property(ι,"φ")) .thunk=()=>{
	// https://www.npmjs.com/package/glob-to-regexp
	var ENC = ι=> ι.re`/`? ι.replace(/[\/%]/g ,encodeURIComponent.X) : ι
	φ["⁻¹"] = ι=> /%2F/i.test(ι)? ι.replace(/%2[F5]/gi ,decodeURIComponent.X) : ι
	φ.fd = {} ;φ.fd.from = ι=> fs.createReadStream(undefined,{ fd:fs.openSync(φ`/tmp/${random_id(20)}` [γ['…←']] ({ι}) +'','r') })

	var existsSync = ι=> !T.Error(catch_union(()=> fs.accessSync(ι)))
	var mkdir_p = function Λ(ι){ try{ fs.mkdirSync(ι) }catch(e){ if( e.code==='EEXIST'||e.code==='EISDIR') return ;var t = path.dirname(ι) ;if( e.code!=='ENOENT' || ι===t) throw e ;Λ(t) ;fs.mkdirSync(ι) } }
	// walk ← λ*(root,files){root += '/'
	// 	walk_ ← λ*(ι){try {l ← fs.readdirSync(root+ι) ;for (i←0;i<l.‖;i++){t ← ι+l[i] ;try{ fs.statSync(root+t).isDirectory()? (yield root+t ,yield* walk_(t+'/')) : (files && (yield root+t)) }catch(e){} }} catch(e){} }
	// 	yield* walk_('') }
	var read_file = function(ι){ try{return fs.readFileSync(ι) }catch(e){ if( !(e.code==='ENOENT')) throw e } }
	var ensure_exists = function(ι,ifdne){ existsSync(ι) || ( mkdir_p(path.resolve(path.dirname(ι))) ,fs.writeFileSync(ι,ifdne) ) }
	var write_file = function(ι,data){ try{ fs.writeFileSync(ι,data) }catch(e){ if( !(e.code==='ENOENT')) throw e ;ensure_exists(ι,data) } }
	var open = function(ι,ifdne,f){
		ensure_exists(ι,ifdne) ;var Lc = new Φ(ι)["‖"]
		var fd = fs.openSync(ι,'r+') ;f({
			get L(){return Lc},
			read(i,L){var t = Buffer.allocUnsafe(L) ;fs.readSync(fd,t,0,L,i) === L || _interrobang_() ;return t},
			write(ι,i){var L = fs.writeSync(fd,ι,i) ;Lc = max(Lc ,L+i)},
			truncate(L){fs.ftruncateSync(fd,L) ;Lc = min(Lc,L)},
			indexOf_skipping(from,to,step,find,skip){var fl=this
				if( from<0) from += fl.L ;if( to<0) to += fl.L ;from = min(max(0 ,from ),fl.L-1) ;to = min(max(-1 ,to ),fl.L)
				if( !(step===-1 && from>to)) _interrobang_('TODO')
				var d = fl.read(to+1,from-to)
				for(var i=from;i>to;i+=step) {if( d[i-(to+1)]===find) return i ;else if( chr(d[i-(to+1)]).match(skip)) ;else return undefined}
				},
			}) ;fs.closeSync(fd)}
	var globmatch = (glob,ι)=> ι.re`^…${[...glob].map(ι=> ι==='*'? '.*' : re`${ι}`.source).join('')}$`
	φ[γ["|>"]] (ι=> new Property(ι,"cwd")) .host= { get:()=> new Φ(process.cwd()) ,set:ι=> φ(ι+'')._ι [γ["!>"]](mkdir_p) [γ["!>"]](process.chdir) }
	var normHs = function(ι){ if( _almost_equal_to_( ι,['~'] ) ) return [process.env.HOME] ;Tstr(ι[0]) && (ι[0] = ι[0].replace(/^~(?=\/)/,process.env.HOME)) ;return ι }
	function Φ(ι){this._ι = ι} ;Φ.prototype = {
		φ,
		toString(){return this._ι },
		toJSON(){return {type:'φ' ,ι:this._ι} },
		inspect(ˣ,opts){return opts.stylize('φ','special')+opts.stylize(util_inspect_autodepth(this._ι.replace(re`^${process.env.HOME}(?=/|$)`,'~')).replace(/^'|'$/g,'`'),'string') },
		get nlink(){return fs.statSync(this._ι).nlink },
		get mtime(){return fs.statSync(this._ι).mtime },
		get birthtime(){return fs.statSync(this._ι).birthtime },
		get url(){return encodeURI('file:'+this.root('/')) }, // ! should this be part of root
		get is_dir(){return !!catch_ι(()=> fs.statSync(this._ι).isDirectory()) },
		get name(){return path.basename(this._ι) },
		TMP_children(){return this._ι [γ["|>"]] (function Λ(ι){return φ(ι).is_dir? fs.readdirSync(ι).map(t=> ι+'/'+t)['map…'](Λ) : [ι] }) },
		TMP_parents(){ var r = [this.root('/')] ;while(r[-1].φ`..`+'' !== r[-1]+'') r.push(r[-1].φ`..`) ;return r.slice(1) },
		root(x){switch(arguments.length){default: _interrobang_()
			case 0: return this._ι[0]==='/'? '/' : '.'
			case 1: return new Φ( x==='/'? path.resolve(this._ι) : x==='.'? path.relative(x,this._ι) : _interrobang_('not yet implemented: nonstandard roots') )
			}},
		ensure_dir(){ this.φ`..`["∃"] || mkdir_p(this.φ`..`+'') ;return this },

		// get ι(){↩},
		set ι(ι){
			if( this.is_dir) _interrobang_('TODO')
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
			else _interrobang_('TODO')
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
			if( ιs["‖"]) _interrobang_('TODO')
			var d = JSON.parse((read_file(_ι)||'[]')+'')
			return {
			push(...a){a.map(function(ι){
				d.push(ι)
				open(_ι,'[]',function(fl){
					var i = fl.indexOf_skipping(-1,-1e4,-1,ord(']'),/[ \n\t]/) || _interrobang_('bad file')
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
	Φ.prototype[γ["|>"]] (o=>( 𐅋𐅨𐅦𐅨𐅭 = o ,𐅯𐅭𐅝𐅨𐅮 ))['∃'] [γ['…←']]({ get(){return existsSync(this._ι) } ,set(ι){ ι===this["∃"] ||( this.ι = ι?'':undefined ) } })
	function Φs(ι){this._ι = ι} ;Φs.prototype = {
		inspect(ˣ,opts){return opts.stylize('φ','special')+util.inspect(this._ι,opts)},
		get name_TMP(){return this._ι.map(ι=> new Φ(ι).name)}, // fs.readdirSync
		get φs(){return this._ι.map(ι=> new Φ(ι))}, // [φ]
		}
	function φ(ss,...ιs){
		var head = this instanceof Φ && this._ι
		if( this instanceof Φs) _interrobang_('not yet implemented')
		var tmpl = is_template0(ss,ιs)
		if( tmpl){var ι = simple_template(ss,ιs,[φ,'/']) ;if( ι.filter(Tstr).join('').re`\*|\{[^}]*?,`) {
			ι["‖"] <= 1 || _interrobang_('not yet implemented * ** ${}',ι)
			ι = normHs(ι)
			ι = ι[0]
			ι.includes('**') && _interrobang_('not yet implemented ** ${}',ι)
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
		else {var ι = ss ;if( ιs["‖"] || Tarr(ι)) _interrobang_('not yet implemented') ;if( ι instanceof Φs) _interrobang_('not yet implemented')}
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

//######################## ζ.user (scratch/it.ζ) (user.) ########################
// deprecated section but valid code

process.env.PATH = ['./node_modules/.bin','/usr/local/bin',...(process.env.PATH||'').split(':'),'.']["∪"]([]).join(':')

process.on('unhandledRejection',(e,p)=> log(Time(),'process.unhandledRejection',p) )

sb.𐅰𐅂𐅫𐅯𐅯 = ()=> sb.tab.active.ι
E[γ["|>"]] (ι=> new Property(ι,"anon")) .get=()=> random_id.greek(5)
E[γ["|>"]] (ι=> new Property(ι,"now")) .get=()=>{ var t = Time() ;return [t.ymdhm,t.ymdhms,t.ymdhmss] }
E[γ["|>"]] (ι=> new Property(ι,"day")) .get=()=> Time().local.ymd

//##################################### see #####################################
;(γ['…←'])(util.inspect.styles,{ null:'grey' ,quote:'bold' })
;[process,module].map((𐅭𐅞)=>𐅭𐅞.inspect = function(){return '{'+Object.getOwnPropertyNames(this).map(ι=> ι+':').join(', ')+'}' }) // ‡ hack, like the [1] * 5 thing in ζ_repl_start. clean up by: can we override builtin inspects without problems? then: defining solid inspect functions for more things. otherwise: figure out something else.
;['γ','Object'].map(ι=>{
γ[ι].inspect = function(d,opt){return opt.stylize(ι,'quote') }
})
// Number_toFixed ← λ(θ,ι){ θ = round(θ / 10**-ι) * 10**-ι ;↩ ι>0? θ.toFixed(ι) : θ+'' }
// E.pretty_time_num = ι=> new Number(ι) …← ({inspect:λ(ˣ,opt){ P ← 20 ;ι←@ ;[ι,u] ← (ι >= P/1e3? [ι,'s'] : [ι*1e6,'μs']) ;↩ opt.stylize(Number_toFixed(ι,-max(-3,floor(log10(ι/P))))+u,'number') }})
// E.pretty_time_num = ι=> Unit(ι,'s')

var fmt = function(a,b){ var t = this.__local? npm`moment@2.18.1`(this).format('YYYY-MM-DD[T]HH:mm:ss.SSS') : this.toISOString() ;t = t.slice(a,b) ;if( !this.__local && b > 10) t += 'Z' ;return t }
assign_properties_in_E_informal({
'Date.prototype.ym':      {get(){return fmt.call(this,0,'YYYY-MM'["‖"])}}
,'Date.prototype.ymd':     {get(){return fmt.call(this,0,'YYYY-MM-DD'["‖"])}}
,'Date.prototype.ymdh':    {get(){return fmt.call(this,0,'YYYY-MM-DDTHH'["‖"])}}
,'Date.prototype.ymdhm':   {get(){return fmt.call(this,0,'YYYY-MM-DDTHH:mm'["‖"])}}
,'Date.prototype.ymdhms':  {get(){return fmt.call(this,0,'YYYY-MM-DDTHH:mm:ss'["‖"])}}
,'Date.prototype.ymdhmss': {get(){return fmt.call(this,0,'YYYY-MM-DDTHH:mm:ss.SSS'["‖"])}}
,'Date.prototype.iso':     {get(){return fmt.call(this,0,'YYYY-MM-DDTHH:mm:ss.SSS'["‖"])}}
,'Date.prototype.hms':     {get(){return fmt.call(this,'YYYY-MM-DDT'["‖"],'YYYY-MM-DDTHH:mm:ss'["‖"])}}
})

var Unit = (ι,u)=>0?0: {ι,u}
	[γ["!>"]]((𐅭𐅞)=>𐅭𐅞[γ["|>"]] (ι=> new Property(ι,"valueOf")) [γ["!>"]]((𐅭𐅞)=>𐅭𐅞.enumerable= false) .ι=function(){return this.ι } )
	[γ["!>"]]((𐅭𐅞)=>𐅭𐅞[γ["|>"]] (ι=> new Property(ι,"inspect")) [γ["!>"]]((𐅭𐅞)=>𐅭𐅞.enumerable= false) .ι=function(ˣ,opt){return util.inspect(this.ι,opt)+' '+opt.stylize(this.u,'number') } )
assign_properties_in_E_informal({
'Number.prototype.inspect':function(d,opt){'use strict' ;var ι = this ;if(! Tprim(ι) ) return ι ;return ζ_inspect(ι,opt) }
,'Boolean.prototype.inspect':function(d,opt){'use strict' ;var ι = this ;if(! Tprim(ι) ) return ι ;return ζ_inspect(ι,opt) }
,'Date.prototype.inspect':function(d,opt){return opt.stylize(isNaN(+this)? 'Invalid Date' : this.getUTCSeconds()!==0? this.ymdhms : this.getUTCMinutes()!==0? this.ymdhm : this.getUTCHours()!==0? this.ymdh : this.ymd, 'date')}
// ,'Function.prototype.inspect':λ(rec,ctx){t ← ζ_compile.⁻¹(@+'').replace(/^λ \(/,'λ(').match(/^.*?\)/) ;↩ ctx.stylize('['+(t?t[0]:'λ ?(?)')+']', 'special')}
// ,'Buffer.prototype.inspect':λ Λ(){↩ Λ.super.call(@).replace(/(^<\w+)/,'$1['+@.‖+']')}
// ,inspect(ˣ,opt){↩ opt.stylize('φ','special')+opt.stylize(util.inspect(@._ι.replace(re`^${process.env.HOME}(?=/|$)`,'~')).replace(/^'|'$/g,'`'),'string') }
,'Array.prototype.line':{get(){ this.toString = this.inspect = function(){return this.join('\n') } ;return this }}
})
E.util_inspect_autodepth = (ι,opt={})=>{ γ.𐅦𐅦𐅝𐅨𐅫 = opt; opt.L || (opt.L = 1e7) ;var last; for(var i=1;;i++){ var r = util.inspect(ι,{ maxArrayLength:opt.L/3 |0 ,depth:i } [γ['…←']] (opt)) ;if( r===last || r["‖"] > opt.L) return last===undefined? '<too large>' : last ;last = r } }
var 𐅯𐅦 = (ι,opt={})=> util_inspect_autodepth(ι,_u(opt).pick('colors','L'))
var promise_watch = ι=>{ if(! ι.id ){
	ι.id = (𐅩𐅞𐅋𐅦𐅩++).toString(36)
	var hr = hrtime() ;ι.then(x=>{ var x = ζ_inspect(x) ;hrtime(hr) < 5 && x["‖"] && hsᵥ`hs.alert(${`Promise #${ι.id} = ${x.slice(0,200)}`},12)` }) } ;return ι.id } ;var 𐅩𐅞𐅋𐅦𐅩=0
var stylize = ({colors})=>{ util.inspect({inspect(d,opt){ r = opt.stylize }},{colors}) ;var r ;return r }
E.ζ_inspect = (ι,opt={})=>0?0
	: ι===undefined? ''
	: T.truefalse(ι)? stylize(opt)(ι?'✓':'✗','boolean' )
	: Tstr(ι)? ι
	: Tnum(ι)? stylize(opt)(Object.is(ι,-0)? '-0' : ι===Infinity? '∞' : ι===-Infinity? '-∞'
		: Number.isSafeInteger(ι)? ''+ι
		: ι.toExponential().replace('+','').replace(/(\.\d\d)\d+/,'$1').replace('e0','')
		,'number')
	: T.Promise(ι)? 0?0
		: ι.status? 'Π '+𐅯𐅦(ι.ι,opt)
		: ι.status===undefined? `Π #${promise_watch(ι)} #pending`
		: 𐅯𐅦(ι,opt)
	: Tarr(ι) && ι["‖"] > 1 && ι.every(t=> t===ι[0]) && _midline_horizontal_ellipsis_(ι["‖"]).every(t=> t in ι)
		? 𐅯𐅦([ι[0]],opt)+' × '+𐅯𐅦(ι["‖"],opt)
	: 𐅯𐅦(ι,opt)
// EventEmitter.prototype.inspect
var sh_inspect = ι=>{var t;
	var Π = ι=> Promise.resolve(ι) // COPY
	return Π( 0?0
	: T.Promise(ι)? ι.then(sh_inspect)
	: ι===undefined? {}
	: Tstr(ι)? {out:ι}
	: T.truefalse(ι)? {code:ι?0:1}
	: (t=catch_union(()=> JSON.stringify(ι)) ,!T.Error(t))? {out:t}
	: {out:ι+''} )}

E.log = (...ι)=>{ ι = ι["‖"]===1? ι[0] : ι ;log.ι(ι) ;return ι }
log.ι = ι=> process.stdout.write(ζ_inspect(ι,{ colors:process.stdout.isTTY })+'\n')

E.JSON_pretty = (ι,replacer)=>{
	var seen = []
	var tab = '  '
	var wrap_width = 140
	var indent_show = ι=> show(ι).replace(/\n/g,'\n'+tab)
	var show = ι=>{var t;
		if( ι===undefined||ι===null ) return 'null'
		replacer && (ι = replacer(ι))
		while( ι.toJSON ) ι = ι.toJSON()
		switch( typeof(ι)==='object'? Object.prototype.toString.call(ι) : typeof(ι) ){
			case 'string': case '[object String]': return JSON.stringify(ι)
			case 'boolean': case '[object Boolean]': case 'number': case '[object Number]': return ι+''
			case 'function': return 'null'
			default:
				!seen.includes(ι) || _interrobang_(TypeError('Converting circular structure to JSON'))
				seen.push(ι)
				if( Tarr(ι)) { var [a,b] = '[]' ;ι = ι.map(indent_show) ;for (var i=0;i<ι["‖"];i++) ι[i]===undefined && (ι[i] = 'null') }
				else { var [a,b] = '{}' ;ι = _l.toPairs(ι).filter(ι=> !(ι[1]===undefined || Tfun(ι[1]))).map(ι=> show(ι[0])+': '+indent_show(ι[1])) }
				seen.pop()
				return (t=a+ι.join(', ')+b)["‖"] <= wrap_width? t : a+'\n'+tab+ι.join(',\n'+tab)+'\n'+b
				} }
	return show(ι) }

//################ repl #################
var ζ_repl_start = ()=>{
	// i know how to make the good repl for ct. i want to, but im tired
	var diesis_compile = ι=>{var t;
		var lock = 0?0
			: ['ct','chrome_tabs','ps2','d','bookmarks']["∪"]([]).has(ι)? 'require_new(φ`~/.bashrc.ζ`).'+ι+'()'
			: (t= ι.re`^f(?: (.+))?$` )? js`go_to('path',${t[1]||'.'})`
			: ι
		lock===ι || log('⛓  '+lock)
		return lock }
	// @2018-01-04 current priority is to work on seeing first; merging w ζ_repl_start
	// '\x1b[30m\x1b[42mζ\x1b[0m '
	return (f=> f.call( require('repl').start({ useGlobal:true ,prompt:'\x1b[30m\x1b[100m‡\x1b[0m ' }) ))(function(){
	this.In = [] ;this.Out = []
	var super_ = this.completer ;this.completer = function(line,cb){ line.trim()===''? cb(undefined,[]) : super_.call(this,line,cb) }
	this.removeAllListeners('line').on('line',function(line){
		this.context.rl = this
		this.context.E = this.context
		if( this.bufferedCommand ){ var ι = this.history ;ι.reverse() ;var t = ι.pop() ;ι[-1] += '\n'+t ;ι.reverse() }
		var code = this.bufferedCommand+line
		code = diesis_compile(code)
		if( ζ_verify_syntax(code) ){ this.bufferedCommand = code+'\n' ;this.outputStream.write('    ') ;return }
		try{ var ι = (0,eval)(ζ_compile(code)) }catch(e){ var error = e }
		this.bufferedCommand = ''
		if( code ){
			φ`~/.archive_ζ`.text = φ`~/.archive_ζ`.text + JSON.stringify({ time:Time() ,code }) + '\n'
			this.In.push(code) ;this.Out.push(error || ι)
			}
		if( error ) this._domain.emit('error' ,error.err || error)
		else{
			if( T.Promise(ι) ) this.context[γ["|>"]] (ι=> new Property(ι,"__")) .f1ι= ι
			else if( ι!==undefined ) this.context.__ = ι
			try{ var t = ζ_inspect(ι,{ colors:this.outputStream.isTTY }) }catch(e){ var t = '<repl inspect failed>:\n'+(e&&e.stack) }
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
	}) }

//################################## new tools ##################################
E.simple_as_file = ι=> φ`/tmp/asf_${simple_hash(ι)}` [γ['…←']]({ι}) +''

//################################### prelude ###################################
φ`~/code/declare/module.ζ`["∃"] && require(φ`~/code/declare/module.ζ`+'').patch(E)

//#################################### main #####################################
E.ζ_builtins = { require ,module:{ exports:{} ,if_main_do:module.__proto__.if_main_do } ,i:0 }
E.ζ_main = ({a})=>{var ι;
	a[0]==='--fresh' && a.shift()
	if( !a["‖"] ) ζ_repl_start()
	else if( ι=a[0] ,φ(ι)["∃"] || ι.re`^\.?/` ){ process.argv = [process.argv[0],...a] ;var t = φ(ι).root('/')+'' ;var o=Module._cache;var m=Module._resolveFilename(t,undefined,true);var oι=o[m] ;o[m] = undefined ;Module._load(t,undefined,true) ;o[m] = oι }
	else {
		γ [γ['…←']](ζ_builtins) ;γ.a = a ;var code = a.shift() ;[γ.a0,γ.a1] = a ;γ.ι = a[0]
		sh_inspect( ζ_eval(returnfix_compile(do_end_undefined_thing(code))) )
			.then(ι=>{ ι.out && process.stdout.write(ι.out) ;ι.code &&( process.exitCode = ι.code ) })
		}
	}
module.if_main_do((...a)=>ζ_main({a}))
// inject as .bashrc
// 	sh` ζ(){ if [[ $# = 0 || $1 =~ ^\.?/ || $1 = --fresh ]] ;then /usr/local/bin/ζ "$@" ;else ζλ "$@" ;fi ;} `
