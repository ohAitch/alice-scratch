#!/usr/bin/env node

// hey, if you're gonna break this, keep a previous stable version ready this time. weve spent entirely too much time rescuing our configurations.

// odd synonym: k, name(, id)(, i?)

//############################## as for a prelude ###############################
var _ = require('underscore')
_.mixin({
'<-':function(...a){return this .assign (...a) },
})
var meta_0 = o=> new Map( [...Object.getOwnPropertyNames(o),...Object.getOwnPropertySymbols(o)].map(ι=> [ι,Object.getOwnPropertyDescriptor(o,ι)] ) )
var define_properties_in = (o,names,ι)=>{ var t = o; for(var k of names.slice(0,-1)) t = (t[k] ||( t[k] = {} )); t[names[names.length-1]] = ι; return o }
function Descriptor(ι){ _(this) ['<-'] (ι) }
var assign_properties_in = (o,ι)=>{ [...meta_0(ι)].forEach(([k,{value:ι}])=> ι instanceof Descriptor? def(o,k,ι) : assign_properties_in(o[k] ||( o[k] = {} ),ι) ); return o }

//######################### local metaprogramming utils #########################
var properties_tree_formalify = ι=>
	_(_(ι).map((ι,names)=> genex_simple(names).map(k=> [k,ι]))).flatten(true)
		.reduce((r,[name,ι])=> define_properties_in(r,
			name.split('.').map(ι=>{var t; return (t=ι.match(/^@@(.*)/))? Symbol[t[1]] : ι }),
			new Descriptor( Tfun(ι)? { value:ι, enumerable:true } : ι )
			), {})

// mixin_forever ← (to,from)=>{}
// mixin_forever_informal ← (to,from)=>{}
var E_ = {}
var patched = new Set([E_,global])
var E = new Proxy({},{ // exports
	// get(           self,k){  },
	// getOwnPropertyDescriptor()
	set(           self,k,ι){ [...patched].forEach(o=> o[k] = ι ) },
  defineProperty(self,k,ι){ [...patched].forEach(o=> def(o,k,ι)); return true },
	})
var assign_properties_in_E_informal = ι=>{ ι = properties_tree_formalify(ι); [...patched].forEach(o=> assign_properties_in(o,ι)) }
module.exports = to=>{ patched.has(to) || ( cn.log('\x1b[34m[ζ]\x1b[0m patching'), cn.log(Error('<stack>').stack), patched.add(to), assign_properties_in(to,E_) ) }

//############################## as for a prelude ###############################
E.meta_0 = meta_0

E.def = (o,name,ι)=>{
	Tfun(ι) &&( ι = lazy(name,ι) )
	'configurable' in ι ||( ι.configurable = true )
	'value' in ι?
		'writable' in ι ||( ι.writable = true )
		: 'set' in ι ||( ι.set = function(ι){ def(this,name,{ value:ι, enumerable:true, }) } )
	return Object.defineProperty(o,name,ι) } // = ↩ o
var lazy = (name,ι)=>0?0: { get(){return this[name] = ι() } }

E.require_proto_assign = ()=>()=>{
	var done = new Set()
	var assign_me = []
	var r = (names,f)=>{ !done.size || !function(){throw Error('‽')}(); assign_me.push([ Tarr(names)? names : [names], f ]) }
	r.declare = ι=>{
		var name = ι.constructor.name || !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('declared object has no constructor name')
		var found = false
		done.has(name) ||( done.add(name), assign_me.forEach(([names,f])=>{ names.length===1 || !function(){throw Error('‽')}(); if (names[0]===name){ found = true; f(ι.constructor) } }) )
		found || !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('nothing added to prototype for '+name)
		}
	return r }
var proto_assign = require_proto_assign()()

E.catch_union = f=>{ try{ var r = f(); var bad = T.Error(r); if (!bad) return r }catch(e){ var r = e; T.Error(r) || !function(){throw Error('‽')}(); return r }; bad && !function(){throw Error('‽')}() }
E.catch_ι = f=>{ try{ var r = f(); var bad = r===undefined; if (!bad) return r }catch(e){}; bad && !function(){throw Error('‽')}() }
E.catch_ = f=> function(){ try{ return f.apply(this,arguments) }catch(e){ if ('__catchable' in e) return e.__catchable; else throw e } }
E.return_ = ι=>{ throw {__catchable:ι} }

E.T = function(ι){ 
	var ty = typeof ι; if (ty!=='object') return ty; if (ι===null) return 'null'
	var p = Object.getPrototypeOf(ι); if (p===Object.prototype || p===null) return 'object'
	for (var t of is_l) if (t[1](ι)) return t[0]
	return 'object' }
var b_util = catch_ι(()=> process.binding('util') )
var is_l = [
	['Array',Array.isArray],
	...['Error','String','Boolean','Number'].map(ty=> [ty,ι=> Object.prototype.toString.call(ι)==='[object '+ty+']']),
	...(!b_util? [] : ['ArrayBuffer','DataView','Date','Map','MapIterator','Promise','RegExp','Set','SetIterator','TypedArray'].map(ι=> [ι,b_util['is'+ι]]) ),
	]
_(T) ['<-'] (_(is_l).object(),{
	symbol: ι=> typeof ι === 'symbol',
	boolean: ι=> typeof ι === 'boolean',
	string: ι=> typeof ι === 'string',
	number: ι=> typeof ι === 'number',
	function: ι=> typeof ι === 'function',
	primitive: ι=>{ switch(typeof(ι)){case 'undefined': case 'boolean': case 'number': case 'string': case 'symbol': return true; case 'object': return ι===null; default: return false} },
	boxed: ι=>{ if (ι===null || typeof ι!=='object') return false; var t = Object.getPrototypeOf(ι); t = t.constructor&&t.constructor.name; return (t==='Boolean'||t==='String'||t==='Number') && /^\[object (Boolean|String|Number)\]$/.test(Object.prototype.toString.call(ι)) },
	ℤ: Number.isInteger,
	'-0': ι=> ι===0 && 1/ι < 0,
	NaN: Number.isNaN,
	})
_(E) ['<-'] ({ Tstr:T.string, Tnum:T.number, Tfun:T.function, Tarr:T.Array, Tprim:T.primitive, Tbox:T.boxed, })
T.primitive.ι = new Set(['undefined','boolean','number','string','symbol','null'])
T.boxed.ι = new Set(['Boolean','String','Number'])

//################################## requires ###################################
;[ ['child_process'],['events','EventEmitter'],['fs'],['http'],['https'],['module','Module'],['net'],['os'],['querystring'],['readline'],['repl'],['stream'],['util'],['vm'],['zlib'],['underscore','_'],
	].map(function([ι,n]){ def(E, n||ι, ()=> require(ι)) })
E._ = _
var path = require('path')
var fs = require('fs')
var moment = require('moment')
if (0){ require('util'); require('stream'); require('moment'); require('priorityqueuejs'); require('urijs') } // browserify
def(E,'robot',lazy('robot',()=> npm`robotjs@0.4.5` ))
def(E,'require_new',lazy('require_new',()=>{ var t = npm`require-uncached@1.0.3`; return ι=> t((ι+'').replace(/^\.(?=\/)/,φ.cwd)) }))

//################################### ζ infra ###################################
E.Property = function(o,name){ this.o = o; this.name = name; }
def(Property.prototype,'ι',{ get(){return this.o[this.name]}, set(ι){ this.o[this.name] = ι } })
// Property.prototype.descriptor = λ(ι){ if( arguments.length===0 ) ↩ Object.getOwnPropertyDescriptor(@.o,@.name); else Object.defineProperty(@.o,@.name,ι) }
Property.prototype.def = function(ι){ def(this.o,this.name,ι); return this }
// id like an interface more like def, but def doesnt have a getter so it is temporary
// this should probably supercede def, since <3 firstclassness?

new Property(eval,'·').def({ enumerable:true, get(){ this(ζ_compile(φ`/tmp/__·`.text).replace(/^#!.*/,'')) }, })
var lazy_fn = f=>{var t; return function(){return (t||(t=f())).apply(this,arguments) } } // ! slotify and then detect and merge slots

;(ι=>{ var r = JSON.parse(ι); (function Λ(ι,k,o){if (ι.type==='Buffer') {
	var t = 'data' in ι || 'utf8' in ι? new Buffer(ι.data||ι.utf8) : 'base64' in ι? new Buffer(ι.base64,'base64') : !function(){throw Error('‽')}()
	if (o===undefined) r = t; else o[k] = t
	} else if (!Tprim(ι)) _(ι).forEach(Λ)})(r); return r })("{\n  \"type\": \"Buffer\",\n  \"utf8\": \"a better npm ontology?\\n\\ncode/scratch/ζ/index.ζ:153:\\t\\t\\tunicode_data ← 'Cc Cf Co Cs Ll Lm Lo Lt Lu Mc Me Mn Nd Nl No Pc Pd Pe Pf Pi Po Ps Sc Sk Sm So Zl Zp Zs'.split(' ').mapcat(ι=> _(npm('unicode@0.6.1/category/'+ι)).values() )\\n\\nE.npm = λ(ι){ Tarr(ι) && (ι = ι[0]); APP ← '\\\\x1b[34m[npm]\\\\x1b[0m'\\n\\t[,name,version,sub] ← ι.re`^(.*?)(?:@(.*?))?(/.*)?$`\\n\\tabs_name ← ()=> name+'@'+version\\n\\tif (version){\\n\\t\\tcache ← φ`~/.npm/${name}/${version}`; final ← cache.φ`/node_modules/${name}`+(sub||'')\\n\\t\\ttry{ ↩ require(final) }catch(e){ if (!(e.code===\\\"MODULE_NOT_FOUND\\\")) throw e }\\n\\t\\tcache.BAD_exists() || shᵥ`cd ~; npm cache add ${abs_name()}`\\n\\t\\ta←;b←; (a=cache.φ`package.json`).ι = {description:'-',repository:1,license:'ISC'}; (b=cache.φ`README`).ι = ''; shᵥ`cd ${cache} && npm --prefer-offline i ${abs_name()}`; a.ι = b.ι = null\\n\\t\\t↩ require(final) }\\n\\telse {\\n\\t\\tsfx`ack`\\n\\t\\tversion = shᵥ`npm show ${ι} version`+''\\n\\t\\tprocess.stderr.write(APP+' latest: '); process.stdout.write(ι.replace(/-/g,'_')+' ← npm`'+abs_name()+'`'); process.stderr.write('\\\\n')\\n\\t\\t} }\\n\\nhave npm`module` write to package.json?\\n\\nwhat is npm anyway\\nnpm has packages with names and semver-format versions\\n\\nnpm's database is \\nit's almost-but-not-quite monotonic; changes and deletions are rare but happen\\n\"\n}")
E.npm = function(ι){ Tarr(ι) && (ι = ι[0]); var APP = '\x1b[34m[npm]\x1b[0m'
	var [,name,version,sub] = ι.re`^(.*?)(?:@(.*?))?(/.*)?$`
	var abs_name = ()=> name+'@'+version
	if (version){
		var cache = φ`~/.npm/${name}/${version}`; var final = cache.φ`/node_modules/${name}`+(sub||'')
		try{ return require(final) }catch(e){ if (!(e.code==="MODULE_NOT_FOUND")) throw e }
		cache.BAD_exists() || shᵥ`cd ~; npm cache add ${abs_name()}`
		var a;var b; (a=cache.φ`package.json`).ι = {description:'-',repository:1,license:'ISC'}; (b=cache.φ`README`).ι = ''; shᵥ`cd ${cache} && npm --cache-min=Infinity i ${abs_name()}`; a.ι = b.ι = null
		return require(final) }
	else {
		sfx`ack`
		version = shᵥ`npm show ${ι} version`+''
		process.stderr.write(APP+' latest: '); process.stdout.write(ι.replace(/-/g,'_')+' ← npm`'+abs_name()+'`'); process.stderr.write('\n')
		} }
E.js_tokenize = code=>{
	var tok = npm`babylon@6.14.1`.parse(code,{allowReturnOutsideFunction:true}).tokens
	return _.zip( tok.map(ι=> code.slice(ι.start,ι.end)), tok.windows(2).map(([a,b])=> code.slice(a.end,b.start) ) )._.flatten(true).filter(ι=>ι) }
E.uses_this = f=> (f+'').match(/\bthis\b/) && js_tokenize('('+f+')').includes('this')? 'maybe' : false
E.ζ_compile = lazy_fn(function(){ var anon_pmcr3; var anon_x818h; var anon_t4nzb; var anon_oenor; var anon_7cy2u; var anon_8jlo1; var anon_cbbhj;
	var word_extra = re`♈-♓🔅🔆‡`
	var word = re`A-Za-z0-9_$ʰ-ʸˡ-ˣΑ-ΡΣ-ωᴬ-ᵛᵢ-ᵥᶜᶠᶻ⁰ⁱⁿₐ-ₓₕ-ₜℂℕℚℝℤⱼⱽ${word_extra}`
	var ζ_parse = (function(){
		var P = require('./parsimmon2.js')
		var ident = P(re`(?![0-9])[${word}]+|@`)
		var comment = re`(//.*|/\*[^]*?(\*/|$)|#[\s#].*)+`
		var simple_js = P(()=> P.alt(
			P(comment).T`comment`,
			P.seq( P('{'), simple_js, P('}') ),
			P.seq( P.alt(
				P(/(['"])(((?!\1)[^\\]|\\.)*?\1)/).T`string`,
				ident,
				P.seq( P('`').T`template`, tmpl_ι.many(), P('`').T`template` ),
				P(/[)\]0-9]/)
				), P.alt( P(re`[ \t]*(?!${comment})/`), P.of('') ) ),
			P(/\[#persist_here .*?\]/),
			P(re`/((?:[^/\\\[]|(?:\\.)|\[(?:[^\\\]]|(?:\\.))*\])*)/([a-z]*)`).T`regex`,
			P(re`[^{}/#'"…${'`'})@\[\]${word}]+|[^}]`)
			).many() )
		var tmpl_ι = P.alt( P.seq( P('${').T`template`, simple_js, P('}').T`template` ), P(/(?:\\[^]|(?!`|\$\{)[^])+/).T`template` )
		var js_file = P.seq( P(/(#!.*\n)?/).T`shebang`, simple_js )
		return code=>{
			var ι = js_file.parse(code)._.flatten()
			var r = []; for(var t of ι) t.T? r.push(t) : r[-1]&&r[-1].T? r.push(t) : (r[-1]+=t)
			return r } })()
	var anon_3lsx8;
	var unicode_names = memoize_persist(ι=> (
		anon_3lsx8||(anon_3lsx8= (function(){
			var unicode_data = 'Cc Cf Co Cs Ll Lm Lo Lt Lu Mc Me Mn Nd Nl No Pc Pd Pe Pf Pi Po Ps Sc Sk Sm So Zl Zp Zs'.split(' ').mapcat(ι=> _(npm('unicode@0.6.1/category/'+ι)).values() )
			return unicode_data.filter(ι=> !/^</.test(ι.name)).map(ι=> [parseInt(ι.value,16), '_'+ι.name.replace(/[- ]/g,'_').toLowerCase()+'_'])._.object()
			})() ) )[ord(ι)])
	var ζ_compile_nonliteral = ι=> ι
		.replace(anon_x818h||(anon_x818h= re`(\[[${word},…]+\]|\{[${word},:…]+\}|[${word}]+)(\s*)←(;?)`.g ),(ˣ,name,ws,end)=> 'var '+name+ws+(end?';':'=') )
		.replace(/λ(?=\*?(?:[ \t][^\(=←]*)?\([^\)]*\)[ \t]*\{)/g,'function')
		.replace(anon_oenor||(anon_oenor=re`\.@@([${word}]+)`.g),'[Symbol.$1]')
		.replace(/↩ ?/g,'return ')
		.replace(/…/g,'...')
		.replace(/@/g,'this')
		.replace(/∞/g,'Infinity')
		.replace(/‽(?=(\()?)/g,(ˣ,callp)=> callp? `!function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}` : `!function(){throw Error('‽')}()` )
		.replace(/⇒(\s*([:{]))?/g,(ˣ,x,ι)=> '=>'+({ ':':'0?0', '{':'0?0:', }[ι]||!function(){throw Error('‽')}())+x )
		.replace(anon_t4nzb||(anon_t4nzb= re`\.(…${'filter! -= += Π& Π| ⁻¹ -0 ∪! ∩! ∩s -! ?? *? +? ? * + ∪ ∩ - & | ≈'.split(' ').map(ι=> re`${ι}`.source).join('|')})`.g ),(ˣ,ι)=> '['+util_inspect_autodepth(ι)+']')
		.replace(anon_8jlo1||(anon_8jlo1= re`(…${'<-'.split(' ').map(ι=> re`${ι}`.source).join('|')})`.g ),(ˣ,ι)=> '['+util_inspect_autodepth(ι)+']')
		.replace(anon_7cy2u||(anon_7cy2u= re`#swap ([${word}]+) ([${word}]+)`.g ),(ˣ,a,b)=>{ var t = 't_'+random_id(9); return ζ_compile_nonliteral(`for(;;){ ${t} ← ${a}; ${a} = ${b}; ${b} = ${t} ;break}`) }) // why not just [a,b] = [b,a]?
		.replace(/\[#persist_here (.*?)\]/g,(ˣ,ι)=> '('+json2_read+js`)(${json2_show(φ(ι).buf)})`)
		.replace(/\[#Q/g,'new Property(') // Quote
		.replace(anon_cbbhj||(anon_cbbhj= re`\.(\s*)([${word}]+)(\s*)#Q\]`.g ), `,$1'$2'$3)`)
		.replace(anon_pmcr3||(anon_pmcr3= re`[${word_extra}]`.g ), unicode_names.X)
	// ζ_compile_nonliteral_tree ← ι=>{
	// 	ι = ι.mapcat(ι=> ι.T? [ι] : ι.split(/(?=[{([\])}])/g).mapcat(ι=> ι.match(/^([{([\])}]?)([^]*)$/).slice(1)).filter(ι=>ι.length) )
	// 	@ other_bracket ← i=>{ at ← {'[':0,'{':0,'(':0}; dir ← ι[i] in at? 1 : -1; for(;;){ for(var [a,b] of ['[]','()','{}']){ ι[i]===a && at[a]++; ι[i]===b && at[a]-- }; if( _(at).every(ι=>ι===0) ) break; i += dir; if (!(0<=i&&i<ι.length)) ↩; }; ↩ i }
	// 	↩ ι.map(ι=> ι.T? ι.ι : ι) }
	return code=> ζ_parse(code).map(ι=>0?0
		: ι.T==='comment'? ι.ι.replace(/^#/,'//')
		: ι.T? ι.ι
		: ζ_compile_nonliteral(ι)
		).join('') })
ζ_compile['⁻¹'] = ι=> ι.replace(/\b(?:function|return|this)\b(?!['"])|\bvar \s*([\w_$Α-ΡΣ-Ωα-ω]+)(\s*)(=?)|\.\.\./g, function(ι,name,s,eq){return {'function':'λ','return':'↩','this':'@','...':'…'}[ι] || (eq==='='? name+s+'←' : name+s+'←;')})

if( require.extensions && !require.extensions['.ζ'] )(()=>{
	require.extensions['.ζ'] = (module,ι)=>{ module._compile(ζ_compile(fs.readFileSync(ι,'utf8')),ι) }
	var super_ = require.extensions['.js']; require.extensions['.js'] = (module,ι)=>{ (path.extname(ι)==='' && fs.readFileSync(ι,'utf8').re`#!/usr/bin/env ζ\s`? require.extensions['.ζ'] : super_)(module,ι) }
	})()

//############################## as for a prelude ###############################
var simple_hash_str = ι=>0?0
	: Tfun(ι)? T(ι)+ι
	: JSON.stringify(ι, (k,ι)=>{ if (Tprim(ι)||Tarr(ι)) return ι; else{ var r={}; _(ι).keys().sort().forEach(k=> r[k]=ι[k]); return r } })
var b36 = ι=> npm`base-x@1.0.4`([.../[0-9a-z]/].join('')).encode(ι)
E.simple_hash = ι=> b36( require('crypto').createHash('sha256').update(simple_hash_str(ι)).digest() )
var memo_frp = function(names,within,f){
	var dir = φ`~/.memo_frp/${names}`
	if (within){
		try{ var t = fs.readdirSync(dir+'') }catch(e){ if (!(e.code==='ENOENT')) throw e; var t = [] }
		var now = Time().i; t = t.sort().filter(ι=> Time(ι.re`^\S+`[0]).i >= now - within)[-1]
		if (t) return dir.φ(t).json2.ι}
	var a = Time().iso; var ι = f(); var b = Time().iso
	dir.φ`${a} ${random_id(10)}`.json2 = {names, date:[a,b], ι}; return ι}
// ! these persist functions overlap
E.memoize_persist = f=>{
	var store = φ`/tmp/ζpersist_${simple_hash(f)}`; var store_ι = store.json||{}
	return function(...a){ var a_h = simple_hash(a); return store_ι[a_h] || ( store_ι[a_h] = f(...a), store.json = store_ι, store_ι = store.json, store_ι[a_h] ) } }
E.slot_persist = name=>{ var o = φ`/tmp/ζpersist_${name}`; return def({name},'ι',{get(){return o.json },set(ι){ o.json = ι }}) }

var regex_parse = lazy_fn(function(){ // status: output format unrefined
	var P = require('./parsimmon2.js')
	var dehex = ι=> chr(parseInt(ι,16))
	var ESCAPE = P('\\').then(P.alt( P(/x([0-9a-fA-F]{2})/,1).map(dehex), P(/u\{([0-9a-fA-F]+)\}/,1).map(dehex), P(/u([0-9a-fA-F]{4})/,1).map(dehex), P(/./).map(ι=> '.[|^$()*+?{}\\/'.includes(ι)? ι : P.T('escape',ι) ) ))
	var s1 = P.alt(
		P(/[^.()[\]^$|\\]/),
		ESCAPE,
		P`.`.T`any`,
		P`(?:${()=>OR_or_SEQ})`,
		P`(?=${()=>OR_or_SEQ})`.T`lookahead`,
		P`(?!${()=>OR_or_SEQ})`.T`nlookahead`,
		P`(${()=>OR_or_SEQ})`.T`capture`,
		P`[${[ /\^?/, (function(){ var t = ESCAPE.or(/[^\]]/); return P([ t.skip('-'), t ]).or(t) })().many() ]}]`.map(ι=> P.T(ι[0]? 'nset' : 'set', ι[1]))
		)
	var TIMES = P([ s1, P.alt('*','+','?',/\{([0-9]+)(?:(,)([0-9]*))?\}/,P.of())
		.map(ι=> ι = !ι? ι : ι==='*'? [0,Infinity] : ι==='+'? [1,Infinity] : ι==='?'? [0,1] : (function(){ var [ˣ,a,two,b] = ι.match(/\{([0-9]+)(?:(,)([0-9]*))?\}/); return [a|0,b? b|0 : two? Infinity : a|0] })() )
		]).map(([ι,for_])=> !for_? ι : {T:'times', ι, for:for_} )
	var s2 = P.alt( P('^').T`begin`, P('$').T`end`, TIMES )
	var OR_or_SEQ = P.sep_by(s2.many().T`seq`, '|').map(ι=> ι.length > 1? P.T('or',ι) : ι[0])
	// t1 ← regex_parse(/^(foo)(?:bep){2,7}\baz(?:\\b.ar|[a-c-e()}][^\s]|b|baz(?=gremlin)(?!groblem)|)*/i)
	return ι=>0?0: {ι:OR_or_SEQ.parse(ι.source), flags:ι.flags} })
E.applescript = {
	parse: lazy_fn(function(){
	  var P = require('./parsimmon2.js')
	  var ws = ι=> ws_.then(ι).skip(ws_); var ws_ = P(/[ \t\n\r]*/)
	  var value = P(()=> P.alt(false_,true_,number,object,array,string,raw) )
	  var false_ = P('false').map(()=> false)
	  var true_ = P('true').map(()=> true)
	  var number = P(/-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][-+]?[0-9]+)?/).map(ι=> +ι)
	  var _member = P.seq(P(/[ a-z0-9-]+/i).skip(ws(P(':'))), value)
	  var object = ws(P('{')).then(P.sep_by(_member,ws(P(',')))).skip(ws(P('}'))).map(ι=> ι.length? _.object(ι) : [])
	  var array = ws(P('{')).then(P.sep_by(value,ws(P(',')))).skip(ws(P('}')))
	  var _char = P(/[\n\t\x20-\x21\x23-\x5B\x5D-\u{10FFFF}]|\\(["\\\/bfnrt]|u[0-9a-fA-F]{4})/u).map(ι=> ι[0]!=='\\'? ι : {'"':'"','\\':'\\','/':'/',b:'\b',f:'\f',n:'\n',r:'\r',t:'\t'}[ι[1]] || chr(parseInt(ι.slice(2),16)) )
	  var string = P('"').then( _char.many().map(ι=> ι.join('')) ).skip(P('"'))
	  var raw = P(/[^,}"]+/).or(string.map_js((ι,[i0,i1],l)=> l.slice(i0,i1))).many().map(ι=>{ ι=ι.join(''); return ι==='missing value'? undefined : {T:'raw',ι} })
	  return ι=> ι===''? undefined : ws(value).parse(ι) }),
	print: ι=> Tnum(ι)? ι+'' : Tstr(ι)? '"'+ι.replace(/["\\]/g,'\\$&')+'"' : Tarr(ι)? '{'+ι.map(applescript.print.X).join(',')+'}' : !function(){throw Error('‽')}(),
	}
// E.lenient_json_parse = (λ(){
// 	P ← require('./parsimmon2.js')

// 	whitespace ← P(/\s*/m)
// 	escapes ← { b:'\b', f:'\f', n:'\n', r:'\r', t:'\t', }
// 	un_escape ← (str)=> str.replace(/\\(u[0-9a-fA-F]{4}|[^u])/, (ˣ,escape)=> escape[0]==='u'? chr(parseInt(escape.slice(1),16)) : escapes[escape[0]] || escape[0] )
// 	comma_sep ← (parser)=> P.sepBy(parser, token(P(',')))
// 	token ← p=> p.skip(whitespace)

// 	l_null ← token(P('null')).map(()=> null)
// 	l_t ← token(P('true')).map(()=> true)
// 	l_f ← token(P('false')).map(()=> false)
// 	l_str ← token(P(/"((?:\\.|.)*?)"/, 1)).map(un_escape).desc('string')
// 	l_num ← token(P(/-?(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/)).map(Number).desc('number')

// 	json ← P.lazy(()=> whitespace.then(P.alt( object, array, l_str, l_num, l_null, l_t, l_f )) )
// 	array ← token(P('[')).then(comma_sep(json)).skip(token(P(']')))
// 	pair ← P.seq(l_str.skip(token(P(':'))), json)
// 	object ← token(P('{')).then(comma_sep(pair)).skip(token(P('}'))).map(ι=> _.object(ι))
// 	↩ ι=> json.parse(ι).value })()
E.JSON_pretty = (ι,replacer)=>{
	var seen = []
	var T = '  ' // tab
	var wrap_width = 140
	var indent_show = ι=> show(ι).replace(/\n/g,'\n'+T)
	var show = ι=>{var t;
		if (ι===undefined||ι===null) return 'null'
		replacer && (ι = replacer(ι))
		while (ι.toJSON) ι = ι.toJSON()
		switch (typeof(ι)==='object'? Object.prototype.toString.call(ι) : typeof(ι)) {
			case 'string': case '[object String]': return JSON.stringify(ι)
			case 'boolean': case '[object Boolean]': case 'number': case '[object Number]': return ι+''
			case 'function': return 'null'
			default:
				if (seen.indexOf(ι) !== -1) throw TypeError('Converting circular structure to JSON')
				seen.push(ι)
				if (Tarr(ι)) { var [a,b] = '[]'; ι = ι.map(indent_show); for (var i=0;i<ι.length;i++) ι[i]===undefined && (ι[i] = 'null') }
				else { var [a,b] = '{}'; ι = _(ι).pairs().filter(ι=> !(ι[1]===undefined || Tfun(ι[1]))).map(ι=> show(ι[0])+': '+indent_show(ι[1])) }
				seen.pop()
				return (t=a+ι.join(', ')+b).length <= wrap_width? t : a+'\n'+T+ι.join(',\n'+T)+'\n'+b
				} }
	return show(ι) }
var genex_simple = ι=>{ var P = require('parsimmon')
	var unit = P.lazy(()=> P.alt( P.noneOf('()|'), P.string('(').then(s_or).skip(P.string(')')).map(ι=>0?0:{T:'capture',ι}) ) )
	var s_or = P.sepBy(unit.many(),P.string('|')).map(ι=> ι.length > 1? {T:'or',ι:ι} : ι[0])
	var Λ = ι=> ι.T==='or'? ι.ι.map(Λ) : ι.T==='capture'? Λ(ι.ι) : Tarr(ι)? cartesian_str(ι.map(Λ)) : [ι]
	return Λ(P.alt( P.string('|'), unit ).many().parse(ι).value) }
var genex = function Λ(ι){return 0,
	Tstr(ι)? [ι] :
	ι.flags!==undefined?( ι.flags.replace(/u/,'') && !function(){throw Error('‽')}(), Λ(ι.ι) ):
	ι.T==='capture'? Λ(ι.ι) :
	ι.T==='escape'? !function(){throw Error('‽')}() :
	ι.T==='or'? ι.ι.mapcat(Λ) :
	ι.T==='seq'? cartesian_str(ι.ι.map(Λ)) :
	// ι.T==='times'? # Λ(ι.ι).mapcat(x=> _.range(ι.for[0],ι.for[1]+1).map(i=> x.repeat(i)) ) :
	// 	ιs ← Λ(ι.ι)
	ι.T==='set'? ι.ι.mapcat(ι=>
		Tarr(ι)? _.range(ord(ι[0]),ord(ι[1])+1).map(chr) :
		ι.T==='escape'? !function(){throw Error('‽')}() :
			[ι] ):
		!function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}(ι) }

_(E) ['<-'] (_(Math).pick('abs','ceil','exp','floor','log10','log2','max','min','pow','round','sqrt','cos','sin','tan')); _(E) ['<-'] ({ln:Math.log, π:Math.PI, τ:Math.PI*2})
E.multiline = function(ι){ ι = (ι+'').split('\n').slice(1,-1); var t = ι.map(ι=> ι.re`^\t*`[0].length)._.min(); ι = ι.map(ι=> ι.slice(t)); return (ι[0]==='' && ι[-1]===''? ι.slice(1,-1) : ι).join('\n') }
E.sleep = ι=>{ var h; for(var hr=hrtime(); (h=hrtime(hr)) < ι; ι-h > 0.03 && (shᵥ`sleep ${ι-h-0.02}`,1)); }
E.bench = (f,opt={})=>{ var {TH=0.4} = opt
	// ! really should include a confidence interval or smth
	var r=0; var I=1; var hr=hrtime(); var R = ()=> pretty_time_num(hrtime(hr) / r)
	var t=f(); r++
	if( T.Promise(t) ) return Π(yes=>{ t.then(function Λ(){ if( hrtime(hr) < TH ){ r++; f().then(Λ) }else yes(R()) }) })
	else{ for(;hrtime(hr) < TH;){ for(var i=0;i<I;i++) f(); r += I; I = ceil(I*1.5) }; return R() } }
E.bench1 = f=>{ var hr = hrtime(); f(); return pretty_time_num(hrtime(hr)) }
E.GET_L = (ι,within)=> memo_frp(['GET -L', ι+''], within, ()=> shᵥ`curl -sL ${ι}`) // ! some requests have short responses; will need more intelligent caching for those 'cause the filesystem can't take too much
E.random = function(ι){return arguments.length===0? Math.random() : Tnum(ι)? random()*ι |0 : _.sample(ι) }
E.random_id = L=> L.map(()=> random(az09||(az09=[.../[0-9a-z]/]))).join(''); var az09; // §
E.ord = ι=> Tnum(ι)? ι : ι.codePointAt()
E.chr = ι=> Tstr(ι)? ι : String.fromCodePoint(ι)

var find_closest_ISU = (ιs,ι)=>{ for(var i=0;i<ιs.length;i++) if( ι <= ιs[i] ) return i===0? i : abs(ιs[i]-ι) < abs(ιs[i-1]-ι)? i : i-1; return ιs.length-1 }
var cartesian_str = ι=> ι.reduce((a,b)=>{ var r = []; a.forEach(a=> b.forEach(b=> r.push(a+b))); return r }, [''])
_.mixin({
difference_eq(ι,...a){ var t = ι._.groupBy(simple_hash_str); a.forEach(ι=> ι.forEach(ι=> delete t[simple_hash_str(ι)])); return _(t).values()._.flatten(true) },
})
E.copy_deep = ι=>0?0
	: Tprim(ι)? ι
	: T.Map(ι)? new Map(ι)
	: T.Set(ι)? new Set(ι)
	: (()=>{
		var r = new ι.constructor()
		for(var k in ι) if( Object.prototype.hasOwnProperty.call(ι,k) ) r[k] = copy_deep(ι[k])
		return r })()
assign_properties_in_E_informal({
'(Array|Set|Map).prototype._':{get(){return _(this)}},
'Object.prototype._':{get(){return _(this)}},

'RegExp.prototype.@@iterator':function*(){yield* genex(regex_parse(this)) },
'RegExp.prototype.exec_at':function(ι,i){ this.lastIndex = i; return this.exec(ι) },
'Number.prototype.map':function(f){'use strict'; var ι=+this; var r = Array(ι); for(var i=0;i<ι;i++) r[i] = f(i,i,ι); return r},
'Number.prototype.mapcat':function(f){return this.map(f)._.flatten(true)},
'Array.prototype.mapcat':function(f){var r = []; for(var i=0;i<this.length;i++) {var t = f(this[i],i,this); for (var j=0;j<t.length;j++) r.push(t[j])}; return r}, // λ(f){↩ @.map(f)._.flatten(true)}
'Array.prototype.repeat':function(x){return x<=0? [] : x.mapcat(()=> this)},
'Array.prototype.search':function(f){ var r; if (this.some(function(ι,i,l){ r = f(ι,i,l); if (r!==undefined) return true })) return r },
'(Array|Buffer|String).prototype.chunk':function(L){return _.range(0,this.length,L).map(i=> this.slice(i,i+L)) },
'(Array|Buffer|String).prototype.windows':function(L){return (this.length-L+1).map(i=> this.slice(i,i+L)) },
'Array.prototype.find_index_deep':function(f){
	for(var i=0;i<this.length;i++){ var ι = this[i]
		if (Tarr(ι)){ var t = ι.find_index_deep(f); if (t) return [i,...t] }
		else{ if (f(ι)) return [i] }
		} },
'Array.prototype.Π&':{get(){return Π['&'](this) }},
'Array.prototype.Π|':{get(){return Π['|'](this) }},
'Array.prototype.seq':{get(){ var θ = function*(){ for(;θ.i<θ.ι.length;) yield θ.ι[θ.i++] }(); _(θ) ['<-'] ({ ι:this, i:0, clone(){return _(this.ι.seq) ['<-'] (this) } }); return θ }},
'Array.prototype.find_last_index':function(f){ for(var i=this.length-1;i>=0;i--) if( f(this[i],i,this) ) return i },

'Set.prototype.filter!':function(f){ this.forEach(ι=> f(ι) || this.delete(ι)) },
'Set.prototype.pop':function(){ var t = this.values().next().value; this.delete(t); return t },
'Set.prototype.∪':function(...a){return new Set([this,...a].map(ι=> [...ι])._.flatten(true)) },
'Set.prototype.∩':function(...a){ var r = new Set(this); for(var x of a) for(var ι of r) x.has(ι) || r.delete(ι); return r },
'Set.prototype.-':function(...a){ var r = new Set(this); for(var t of a) for(var ι of t) r.delete(ι); return r },
'Set.prototype.map':function(f){return [...this].map(f) },

'(Array|Buffer|String|Set).prototype.count':function(){ var r = new Map(); for (var t of this) r.set(t, (r.has(t)? r.get(t) : 0)+1 ); return r },

'stream.Readable.prototype.read_all':function(){return Π(yes=>{ var t = []; this.resume().on('data',ι=> t.push(ι) ).on('end',()=> yes(Buffer.concat(t)) ) })},
'(Array|Buffer|String).prototype.-1':{get(){return this.length<1? undefined : this[this.length-1] },set(ι){ this.length<1 || (this[this.length-1] = ι) }},
'(Array|Buffer|String).prototype.-2':{get(){return this.length<2? undefined : this[this.length-2] },set(ι){ this.length<2 || (this[this.length-2] = ι) }},
'(Array|Buffer|String).prototype.-3':{get(){return this.length<3? undefined : this[this.length-3] },set(ι){ this.length<3 || (this[this.length-3] = ι) }},
'(Array|Buffer|String).prototype.-4':{get(){return this.length<4? undefined : this[this.length-4] },set(ι){ this.length<4 || (this[this.length-4] = ι) }},
})

var TimerCons = function(a,b){this.a=a;this.b=b}; TimerCons.prototype = {clear:function(){this.a.clear();this.b.clear()}, ref:function(){this.a.ref();this.b.ref()}, unref:function(){this.a.unref();this.b.unref()}}
E.Π = ι=>0?0
	: !Tfun(ι)?( T.Error(ι)? Promise.reject(ι) : Promise.resolve(ι) )
	: /^(yes|\(yes,no\))=>/.test(ι+'')? new Promise(ι)
	: (function(){ // type union of new.Promise(nodeback) and Promise.resolve(object)
		var type = '?'
		var r = (...a)=>{ type==='?' &&( type = 'nodeback' ); return type==='object'? ι(...a) : Π((yes,no)=> ι(...a,(e,ι)=>{ e? no(e) : yes(ι) })) }
		for(var name of ['then','catch'])
			r[name] = (...a)=>{ type==='?' &&( type = 'object', ι = Promise.resolve(ι) ); return ι[name](...a) }
		return r })()
Π['&'] = ι=> Promise.all(ι)
Π['|'] = ι=> Promise.race(ι)
assign_properties_in_E_informal({
// 'Function.prototype.Π':λ(){ ... },
'Function.prototype.P':function(...a1){ var ι=this; return function(...a2){return ι.apply(this, a1.concat(a2)) } },
'Function.prototype.X':{get(){ var ι=this; return function(a){return ι.call(this,a) } }},
'Function.prototype.defer':function(){return setImmediate(this) },
'Function.prototype.in':function(time){return setTimeout(this,max(0,time||0)*1e3) },
'Function.prototype.every':function(time,opt){ var r = setInterval(this,max(0,time)*1e3); return !(opt&&opt.leading)? r : new TimerCons(this.in(0),r) },
})
proto_assign('Immediate',Immediate=>{
	Immediate.prototype.clear = function(){ clearImmediate(this) }
	Immediate.prototype.ref = Immediate.prototype.unref = function(){}
	})
proto_assign('Timeout',Timeout=>{
	Timeout.prototype.clear = function(){ this._repeat? clearInterval(this) : clearTimeout(this) }
	})
proto_assign('Number',Number=>{})
var t; proto_assign.declare((t=setImmediate(function(){}), clearImmediate(t), t))
var t; proto_assign.declare((t=setTimeout(function(){},0), clearTimeout(t), t))

E.walk = (ι,f,k,o)=>( Tprim(ι)||_(ι).forEach((ι,k,o)=> walk(ι,f,k,o)), ι!==undefined && ι!==null && f(ι,k,o), ι )
E.walk_graph = (ι,f,seen=[])=> !( Tprim(ι) || seen.includes(ι) ) && ( seen.push(ι), _(ι).forEach(ι=> walk_graph(ι,f,seen)), seen.pop(), ι!==undefined && ι!==null && f(ι), ι )
E.walk_both_obj = (ι,fᵃ,fᵇ,fseen,seen=[])=> fseen && seen.includes(ι)? fseen(ι) : !( Tprim(ι) || Tfun(ι) || seen.includes(ι) ) && ( fᵃ(ι), seen.push(ι), _(ι).forEach(ι=> walk_both_obj(ι,fᵃ,fᵇ,fseen,seen)), seen.pop(), fᵇ(ι), ι )
E.walk_reduce = (ι,f,k,o)=> Tprim(ι)? ι : Tarr(ι)? ( ι = ι.map((ι,k,o)=> walk_reduce(ι,f,k,o)), f(ι,k,o) ) : ( ι = _(ι).map((ι,k,o)=> [k,walk_reduce(ι,f,k,o)])._.object(), f(ι,k,o) )
E.walk_obj_edit = (ι,f)=> Tprim(ι) || Tfun(ι)? ι : Tarr(ι)? ι.map(ι=> walk_obj_edit(ι,f)) : (function(){ for (var k in ι) if (Object.prototype.hasOwnProperty.call(ι,k)) ι[k] = walk_obj_edit(ι[k],f); return f(ι) })()
E.search_obj = (ι,f)=>{ var r=[]; walk(ι,(ι,k,o)=> ι!==undefined && ι!==null && f(ι,k,o) && r.push(ι)); return r }
E.search_graph = (ι,f)=>{ var r=[]; walk_graph(ι,ι=> ι!==undefined && ι!==null && f(ι) && r.push(ι)); return r }

E.hrtime = function(ι){ var t = arguments.length===0? process.hrtime() : process.hrtime([ι|0,(ι-(ι|0))*1e9]); return t[0] + t[1]*1e-9 }
E.Time = function(ι){ var r = arguments.length===0? new Date() : ι instanceof Date? ι : new Date(Tnum(ι)? ι*1e3 : ι); r.toString = function(){return util.inspect(this) }; return r }
var fmt = function(a,b){ var t = this.__local? moment(this).format('YYYY-MM-DD[T]HH:mm:ss.SSS') : this.toISOString(); t = t.slice(a,b); if (!this.__local && b > 10) t += 'Z'; return t }
assign_properties_in_E_informal({
'Date.prototype.inspect':function(d,opts){return opts.stylize(isNaN(+this)? 'Invalid Date' : this.getUTCSeconds()!==0? this.ymdhms : this.getUTCMinutes()!==0? this.ymdhm : this.getUTCHours()!==0? this.ymdh : this.ymd, 'date')},
'Date.prototype.local':{get(){return _(new Date(this)) ['<-'] ({__local:true})}},
'Date.prototype.i':{get(){return +this / 1e3}},
'Date.prototype.ym':      {get(){return fmt.call(this,0,'YYYY-MM'.length)}},
'Date.prototype.ymd':     {get(){return fmt.call(this,0,'YYYY-MM-DD'.length)}},
'Date.prototype.ymdh':    {get(){return fmt.call(this,0,'YYYY-MM-DDTHH'.length)}},
'Date.prototype.ymdhm':   {get(){return fmt.call(this,0,'YYYY-MM-DDTHH:mm'.length)}},
'Date.prototype.ymdhms':  {get(){return fmt.call(this,0,'YYYY-MM-DDTHH:mm:ss'.length)}},
'Date.prototype.ymdhmss': {get(){return fmt.call(this,0,'YYYY-MM-DDTHH:mm:ss.SSS'.length)}},
'Date.prototype.iso':     {get(){return fmt.call(this,0,'YYYY-MM-DDTHH:mm:ss.SSS'.length)}},
'Date.prototype.hms':     {get(){return fmt.call(this,'YYYY-MM-DDT'.length,'YYYY-MM-DDTHH:mm:ss'.length)}},
})

E.schema = (function(){
	var sc_merge = function(a,b){var ak = _.keys(a); var bk = _.keys(b); bk._.difference(ak).forEach(k=> a[k] = b[k]); _.intersection(ak,bk).forEach(k=> a[k] = !Tprim(a[k])? sc_merge(a[k],b[k]) : !Tprim(b[k])? 'error' : a[k]); return a }
	return ι=> T.boolean(ι)? true : Tstr(ι)? '' : Tnum(ι)? 0 : Tarr(ι)? ι.length===0? [] : [ι.map(schema).reduce(sc_merge)] : _.pairs(ι).map(ι=> [ι[0],schema(ι[1])])._.object()
	})()
new Property( E,'brightness' ).def(function(){
	var br = hsᵥ? {
		get(){return Π( hsᵥ`hs.brightness.get()`/100 )},
		set(ι){return Π( hsᵥ`hs.brightness.set(${ι*100|0})` )},
		} : npm`brightness@3.0.0`
	br.set_overlay = ι=> br.set(ι > 0.5? (ι===1? 1 : ι-1/64) : (ι===0? 0 : ι+1/64)).then(()=> robot_key_tap('⇧⌥FnF'+(ι > 0.5? 2 : 1)) )
	return br })
E.restart_and_keep_alive = prog=>{
	var Label = 'local.'+prog.replace(/\W/g,'_')
	var t = φ`~/Library/LaunchAgents/${Label}.plist`; t.ι = {Label, KeepAlive:true, ProgramArguments:['sh','-c',sh`PATH=${process.env.PATH}; ${prog}`]}
	shᵥ`launchctl unload ${t} &>/dev/null; launchctl load ${t}`
	}
E.if_main_do = f=>{ if( !module.parent ) f(...process.argv.slice(2)) }

E.robot_key_tap = ι=> require_new(φ`~/code/scratch/keyrc/index.ζ`).robot_key_tap(ι)
E.KEY_once = (...a)=> require_new(φ`~/code/scratch/keyrc/index.ζ`).KEY_once(...a)

//#################################### .ζrc #####################################
process.env.PATH = ['./node_modules/.bin','/usr/local/bin',...(process.env.PATH||'').split(':'),'.']._.uniq().join(':')
E.nice_url = function(ι){var t; var urijs = require('urijs'); var {sourcemap} = ι; ι=ι+''
	// very nice google maps urls
	// if url ≈ google.com/maps/
	// fetch short url:
	// 	wait-click $('#searchbox-hamburger')
	// 	wait-click $('[jsaction="settings.share"]')
	// 	wait-check $('#share-short-url')
	// 	t ← $('.widget-share-link-url').val() wait ι=> ι.re`^https?://goo.gl/maps/`
	// 	return t
	// 	$('.modal-container').click()
	// wait-check: if not $`${ι}:checked`; ι.click(); wait for $`${ι}:checked`
	// wait-click: wait for ι.length; ι.click()
	// decode: parse curl https://goo.gl/maps/7s6wKcW8zUC2

	if (t=ι.re`^"(.*)"$`) return '“'+t[1]+'”' // ! bad hack

	var apply_regexes = regs=> multiline(regs).split(/\n/g).map(function(t){ var [a,b] = t.split(/  +/g); ι = ι.replace(RegExp(a),b) })
	var URL = /\b(?:(?:https?|chrome):\/\/|(?:file|mailto):)(?:[^\s“”"<>]*\([^\s“”"<>]*\))?(?:[^\s“”"<>]*[^\s“”"<>)\]}⟩?!,.:;])?/g
	var parse_alicetext = ι=> _.zip(ι.split(URL).map(ι=>0?0: {type:'text', ι}), (ι.match(URL)||[]).map(ι=>0?0: {type:'url', ι}))._.flatten(true).filter(ι=> !(ι === undefined || (ι.type === 'text' && ι.ι === '')))

	// ι = parse_alicetext(ι).map(λ(ι){t←; ι.type==='url' && (t=urijs(ι.ι)).domain()+t.path()==='google.com/webhp' && t.path('/search') && (ι.ι = t+''); ↩ ι})._.map('ι').join('')

	if (sourcemap && sourcemap.title && sourcemap.url && (t=urijs(ι.slice(...sourcemap.url)),
		t.domain() in {'github.com':0} ||
		t.domain()+t.path()==='google.com/search'
		)) ι = ι.slice(...sourcemap.url)
	
	ι = ι.replace(/%CE%B6/g,'ζ')
	apply_regexes(function(){/*
	\bhttps://         http://
	\b(http://)www\.   $1
	\b(http://)(?:mail\.)?(google\.com/mail/)u/0/[?&]?#(?:(?:label|search)/[\w%+]+|\w+)/(\w+)        $1$2#all/$3
	 - Gmail( http://google\.com/mail/)                $1
	 - [\w.]+@gmail\.com( http://google\.com/mail/)    $1
	Fwd: (.* http://google\.com/mail/)                 $1
	\b(http://)en\.(?:m\.)?(wikipedia\.org/)           $1$2
	\b(http://)youtube\.com/watch[?&]v=([\w-_]+)       $1youtu.be/$2
	\b(http://youtu\.be/[\w-_]+)[?&]feature=youtu\.be  $1
	\b(http://youtu\.be/[\w-_]+)&(\S*)$                $1?$2
	 - YouTube( http://youtu\.be/)                     $1
	 \([oO]fficial [vV]ideo\)( http://youtu\.be/)      $1
	\b(http://)smile\.(amazon\.com/)                   $1$2
	\b(http://docs\.google\.com/document/d/[\w_-]+)/edit(?:[?&]ts=\w+)?$  $1
	\b(http://docs\.google\.com/spreadsheets/d/[\w_-]+)/edit(?:#gid=0)?$  $1
	 - Google Docs( http://docs\.google\.com/)         $1
	\b(http://dropbox\.com/\S*)[?&]dl=0$               $1
	\b(http://)facebook(\.com/)                        $1fb$2
	\b(http://fb\.com/)profile\.php\?id=               $1
	\(\d+\) (.* http://fb\.com/)                       $1
	 - Wikipedia, the free encyclopedia( http://wikipedia\.org/)  $1
	 - Album on Imgur( http://imgur\.com/)             $1
	 - Google Maps( http://google\.com/maps/)          $1
	*/})

	ι = parse_alicetext(ι).map(ι=>{var t;
		if (ι.type === 'url') {
			var uri = urijs(ι.ι)
			switch (uri.domain()) { default: return ι
				break; case 'amazon.com':
					uri.removeSearch(['sa-no-redirect','keywords','qid','ie','s','sr','tag','linkCode','camp','creative','creativeASIN'])
					uri.filename().re`^ref=[\w_]+$` && uri.filename('')
					if (t=uri.resource().re`^/(?:[\w-]+/)?(?:dp|gp)/(?:product/)?(\w+)/?$`) {ι.ι = 'http://amzn.com/'+t[1]; return ι}
				break; case 'fb.com': uri.removeSearch(['fref','hc_location','_rdr','pnref'])
				break; case 'google.com': if (uri.segment()._.isEqual(['search'])){ uri.removeSearch(['gws_rd','aqs','sourceid','es_sm','ie']); uri.hasSearch('q') && uri.removeSearch('oq') }
				}; ι.ι = uri+'' }
		return ι}).map(ι=>ι.ι).join('')

	apply_regexes(function(){/*
	: \d{5,}: Amazon(?:Smile)?: Books( http://amzn.com/)        $1
	*/})

	ι = parse_alicetext(ι).map(ι=>{var t;
		if (ι.type === 'url') {
			var uri = urijs(ι.ι)
			if( ι.ι.re`\)$` && uri.hash()==='' ) ι.ι += '#'
			}
		return ι}).map(ι=>ι.ι).join('')
//###############################################################################
	// http://smile.amazon.com/gp/product/0300078153
	// Seeing like a State http://amzn.com/0300078153

	// https://docs.google.com/spreadsheets/d/1wfFMPo8n_mpcoBCFdsIUUIt7oSm7d__Duex51yejbBQ/edit#gid=0
	// http://goo.gl/0nrUfP

	// generalize the “fix & to ?” to many different things

	// http://www.ribbonfarm.com/2010/07/26/a-big-little-idea-called-legibility/
	// A Big Little Idea Called Legibility http://ribbonfarm.com/2010/07/26/a-big-little-idea-called-legibility/
	// http://ribbonfarm.com/2010/07/26/a-big-little-idea-called-legibility
	// http://ribbonfarm.com/2010/07/26/a-big-little-idea-called-legibility (3K words)

	return ι}
E.sfx = function(ss,...ιs){ var ι = ss[0]
	shₐ`afplay ~/code/scratch/dotfiles/${ι}.wav`
	if (ι==='done' && osaᵥ`get volume settings`['output muted']){ var br = brightness; br.get().then(old=>{ br.set(0); (()=> br.set(old)).in(0.2) }) }
	}
var _low_brightness_symbol__high_brightness_symbol_ = go=>{ var ιs = [0,1,2.5,5.5,10,16].map(ι=>ι/16); return brightness.get().then(br=> brightness.set_overlay( ιs[min(max( 0, find_closest_ISU(ιs,br) + go ), ιs.length-1 )] )) }
E._low_brightness_symbol_ = ()=> _low_brightness_symbol__high_brightness_symbol_(-1)
E._high_brightness_symbol_ = ()=> _low_brightness_symbol__high_brightness_symbol_(1)
E.moon = ι=>{ ι||(ι=Time()); var moons = [...'🌑🌒🌓🌔🌕🌖🌗🌘']; return moons[floor((npm`suncalc@1.7.0`.getMoonIllumination(ι).phase * moons.length + 0.5) % moons.length)] }
E.github_url = ι=>{
	var github_remote_origin = file=>{
		var ι = φ(file).root('/')
		var root = ι; while( root+''!=='/' && !root.φ`.git`.BAD_exists() ) root = root.φ`..`
		if( root+''==='/' ) throw _(Error()) ['<-'] ({ human:'did not find github remote origin for '+(file||'<anon>') })
		ι = (ι+'').slice((root+'/').length)
		var t = root.φ`.git/config`.ini['remote "origin"'].url.match(/github\.com[:/](.+)\/(.+)\.git/)
		// when HEAD is master, maybe use the commit id instead?
		return encodeURI('http://github.com/'+t[1]+'/'+t[2]+'/blob/'+root.φ`.git/HEAD`.text.match(/refs\/heads\/(.+)/)[1]+'/'+ι) }
	var [file,h] = sbᵥ`view = deserialize(${ι}); s = view.sel(); [ view.file_name(), [view.rowcol(ι) for ι in [s[0].begin(), s[-1].end()]] ]`
	var fm = ι=> 'L'+(ι+1)
	return github_remote_origin(file||'')+( _.isEqual(h[0],h[1])? '' : '#'+(h[0][0]===h[1][0]? fm(h[0][0]) : fm(h[0][0])+'-'+fm(h[1][0])) ) }
E.go_to = (...a)=>{ // synonyms: go_to, open, search?
	var opt = !Tprim(a[-1])? a.pop() : {}
	var type = a.length===1? null : a.shift()
	var ι = a[0]
	var {new:new_,focus,in_app,sb_view_file_name} = _({new:false, focus:true, in_app:undefined, sb_view_file_name:undefined}) ['<-'] (opt)

	var is_url = ι=> ι.re`^((https?|chrome-extension)://|file:|mailto:)`
	var searchify = ι=> 'https://www.google.com/search?q='+encodeURIComponent(ι)

	in_app && (in_app = in_app.toLowerCase())

	if (!focus) sfx`ack`

	// windows_in_current_space_in_app ← app=> hsᵥ`hs.fnutils.imap( hs.window.filter.new(false):setAppFilter(${app},{visible=true,currentSpace=true}):getWindows(), function(x) return x:id() end)`
	// apps_with_windows_in_current_space ← ()=> hsᵥ`hs.fnutils.imap( hs.window.filter.new(false):setAppFilter('default',{visible=true,currentSpace=true}):getWindows(), function(x) return x:application():name() end)`

//############################ go to specific chrome ############################
	// 	wnd ← 1
	// 	is_chromeapp_active ← is_chromeapp_exist && osaᵥ`tell app "System Events"; get name of menu bar items of menu bar 1 of process (name of app ${app}); end tell`[1] !== 'Chrome'
	// 	# System Events got an error: osascript is not allowed assistive access
	// 	# compile_mapping(M('c','; '+js`terminal_do_script(${sh`ζ --fresh ${js`(…${osa_activate_thingᵥ+''})('chrome')`}; exit`})`)).ι,
	// 	if (is_chromeapp_active){ osaᵥ`tell app "System Events"; activate app "sublime text"; click menu item …${Tnum(wnd)? osa`(name of window ${wnd} of a)` : osa`${wnd}`} of menu 1 of menu bar item "Window" of menu bar 1 of process (name of app ${app}); end tell; activate app ${app}`; ↩ }
	//  
	// 	t ← [2,1]; chrome_simple_js_ᵥ(`alert('foo')`,{window:t[0],tab:t[1]})

	if (!type){ !new_ || !function(){throw Error('‽')}()
		if (!is_url(ι)) ι = searchify(ι)
		if (!in_app && ι.re`^file:`){
			var file = decodeURI(ι).replace(re`^file:(//)?`,'')
			if (file[0]!=='/') file = require('path').normalize(require('path').join( φ(sb_view_file_name||!function(){throw Error('‽')}()).φ`..`+'', file ))
			if (φ(file).is_dir) in_app = 'path finder'
			else if (['.pdf','.m4a','.epub','.mobi'].includes(require('path').extname(file)));
			else if (['.png','.jpg'].includes(require('path').extname(file))) in_app = '#ql'
			else in_app = 'sublime text'
			var [,p,r] = decodeURI(ι).re`^(.*?:)([^]*)`; var ι = p+r.replace(/[^\/]+/g,encodeURIComponent.X)
			}
		if (in_app==='#ql') shₐ`( &>/dev/null qlmanage -p ${file} &)`
		else{
			in_app ||( in_app = 'chrome' )
			if (in_app==='chrome'){
				var t = osaᵥ`chrome: URL of tabs of windows`.find_index_deep(t=> t===ι); if (t)
					{ var [window_,tab] = t; osaₐ`chrome: set active tab index of window ${window_+1} to ${tab+1}`; osaₐ`chrome: activate`; return } }
			if (ι.re`^chrome-extension://`) shᵥ`duti -s com.google.Chrome chrome-extension` // bug workaround
			shᵥ`open …${in_app && sh`-b ${memoize_persist(ι=> catch_ι(()=> osaᵥ`id of app ${ι}`) )(in_app)}`} ${!focus && '-g'} ${ι}`
			}
		if (focus && in_app==='path finder') osaₐ`${in_app}: activate`
		}
	else if (type==='app'){ ( !new_ && focus && !in_app )||!function(){throw Error('‽')}(); var app = ι
		// ! should gather most of this information periodically async & record it. should use FRP.
		var hint_screen = {'sublime text':2, 'path finder':3, 'github desktop':4}
		var isnt_standalone = {ibooks:1, preview:1}
		if( app==='chrome' && (shᵥ`ps -x -o comm`+'').includes('/Chrome Apps.localized/') ){ ['⌘␣',...'chrome↩'].map(robot_key_tap); return }
		hint_screen[app] && robot_key_tap('^'+hint_screen[app])
		isnt_standalone[app]? osaᵥ`${app}: if it is running then; activate; end if` : osaᵥ`${app}: activate`
		}
	else if (type==='screen'){ ( !new_ && focus && !in_app && /^[1-9]$/.test(ι+'') )||!function(){throw Error('‽')}(); robot_key_tap('^'+ι) }
	else if (type==='path'){ ( !new_ && focus )||!function(){throw Error('‽')}()
		// ! i think this might be a pretty badly designed type
		new_ = true
		if (ι.re`^(?:code|consume|documents|history|notes|pix)/.{1,80}:\d+:`){ !in_app || !function(){throw Error('‽')}() // ! duplication with munge_stuff.py:FIND_RESULT
			// in_app = 'sublime text'
			var [,ι,line] = ι.re`^(.+):(\d+):$`
			ι = φ('~/file/'+ι)
			shᵥ`'/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl' ${ι}:${line}`; return }
		if (in_app==='terminal'){
			var here = hsᵥ`hs.fnutils.imap( hs.window.filter.new(false):setAppFilter('Terminal',{visible=true,currentSpace=true}):getWindows(), function(x) return x:id() end)`
			var unbusy = ()=> osaᵥ`terminal: id of windows where busy = false`
			var available = here.length && _.intersection(here,unbusy())[0]
			terminal_do_script( sh`cd ${ι}; …${!available && sh.clear}`, osa`…${!!available && osa`in (window 1 whose id = ${available})`}; …${focus && 'activate'}` ); return }
		else go_to(encodeURI('file:'+φ(ι).root('/')),{in_app,focus,sb_view_file_name})
		}
	else !function(){throw Error('‽')}() }

//##### metaprogramming → runtime macros built on top of template literals ######
// to design this correctly, (ss,…ιs) => (s,…a) or maybe (`s${a}`) lol no
// existing semistandard usage is in
// 	im_autowhite
// 	scratch.txt
// 	ζ/index.ζ
// s is interned, so use it as a memoization key for things
E.is_template = ([ss,...ιs])=> ss && Tarr(ss.raw) && ss.raw.length-1 === ιs.length
var tmpl_flatten = (raw2,ιs2)=> _.zip(raw2,ιs2)._.flatten(true).slice(0,-1).filter(ι=> ι!=='')
var simple_template = function(ss,ιs,filter){ is_template([ss,...ιs]) || !function(){throw Error('‽')}()
	var falsy = ι=> ι===undefined||ι===null||ι===false
	if( filter && !Tfun(filter) ){ var [root,join] = filter; filter = ι=> Tarr(ι)? ι.map(ι=> root`${ι}`).join(join) : falsy(ι)? '' : undefined }
	var filter_special = ι=> falsy(ι)? '' : ι+''
	var ι = tmpl_flatten( ss.raw.map(ι=> ι.replace(/\\(?=\$\{|`)/g,'')), ιs.map(ι=>0?0:{raw:ι}) )
	for(var i=0;i<ι.length-1;i++) if (Tstr(ι[i]) && !Tstr(ι[i+1])) ι[i] = ι[i].replace(/…$/,function(){ ι[i+1] = filter_special(ι[i+1].raw); i++; return '' })
	filter && (ι = ι.map(function(ι){var t; return Tstr(ι)? ι : (t=filter(ι.raw), t===undefined? ι : t) }))
	return ι}
E.easy_template = (function(){
	var read = (ss,ιs)=> tmpl_flatten(ss.raw,ιs.map(ι=>[ι]))
	var show = function(ι){ var raw = ['']; var ιs = []; ι.forEach(ι=> Tstr(ι)? raw[-1]+=ι : (ιs.push(ι), raw.push('')) ); return [{raw},...ιs] }
	return f=> function(ss,...ιs){return f.call(this,read(ss,ιs),show) }
	})()

E.clipboard = def({},'ι',{ get(){return shᵥ`pbpaste`+'' }, set(ι){ shₐ`${sb.encode(ι)} |`` pbcopy` }, })
E.sb = function self(){return self.ι() } // let personal configuration use sb as callable
new Property( sb,'tab' ).def({
	get(){
		var r = sbᵥ`[serialize(ι) for ι in (ι.view() for ι in sublime.windows() for ι in ι.sheets()) if ι]`
		r.active = sbᵥ`serialize(sublime.active_window().active_sheet().view())`
		;[...r,r.active].map(ι=> ι && new Property( ι,'ι' ).def({ enumerable:false,
			get(){return sbᵥ` view = deserialize(${this}); view.substr(Region(0,view.size())) ` },
			set(ι){ sb_editᵥ(this)` view.replace(edit,Region(0,view.size()),${ι}) ` },
			}) )
		new Property( r,'push' ).def({ enumerable:false, value:
			function(ι){ shₐ`${sb.encode(ι)} |`` open -a 'Sublime Text.app' -f`; this.length = 0; (()=> _(this) ['<-'] (sb.tab) ).in(0.02) } // ! wtf async/sync mix
			})
		return r },
	})
sb.encode = (()=>{
	var line = ι=>0?0
		: Tstr(ι)? ι
		: util.inspect(ι,{ depth:null, maxArrayLength:null, })
	return ι=>0?0
		: ι===undefined? ''
		: Tarr(ι)? ι.map(line).join('\n')
		: line(ι) })()

E.re = function(ss,...ιs){
	// would like to embed regex in [] and have that be ok
	var ι = simple_template(ss,ιs,[(...a)=>re(...a).source,''])
	var ENC = ι=> T.RegExp(ι)? ( ι.flags.replace(/[gy]/g,'')==='u' || !function(){throw Error('‽')}(), ι.source ) : (ι+'').replace(/([.*+?^${}()\[\]|\\])/g, '\\$1')
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

E.js = E.py = function(ss,...ιs){ var ENC = JSON.stringify; return simple_template(ss,ιs).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('') }

E.sh = function(ss,...ιs){var ENC = ι=> "'"+(ι+'').replace(/'/g,"'\\''")+"'"; return simple_template(ss,ιs,[sh,' ']).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('')}
sh.clear = "/usr/bin/clear && printf %s $'\\e[3J'"
var ellipsify = ι=> util_inspect_autodepth(ι.slice(0,100))+(ι.length>100?'…':'')
var if_sh_err = (name,code,ι)=>{ if (ι.status!==0) throw _(Error(name+'`'+code+'` → status:'+ι.status+', stderr:'+ellipsify(ι.stderr+''))) ['<-'] (_(ι).pick('status','stdout','stderr')) }
E.shᵥ = function(ss,...ιs){ var code = sh(ss,...ιs)
	var ι = child_process.spawnSync(code,{shell:true})
	if_sh_err('shᵥ',code,ι)
	return _(ι.stdout) ['<-'] ({ toString(...a){var ι = Buffer.prototype.toString.call(this,...a); return a.length===0? ι.replace(/\n$/,'') : ι} }) }
var str_to_fd_stream = ι=>{ var t = φ`/tmp/${random_id(20)}`; t.text = ι; var fd = fs.openSync(t+'','r'); return fs.createReadStream(null,{fd}) }
var _shₐ = (ss,ιs,opt={})=>{
	if (ss.length===2 && ss[0]==='' && ss[1].re`^ *\|$`){ opt.stdio && !function(){throw Error('‽')}(); opt.stdio = [str_to_fd_stream(ιs[0]),,,]; return shₐ2(opt) }
	else return Π((yes,no)=>{
		var code = sh(ss,...ιs)
		var ι = child_process.spawn(code,_({shell:true}) ['<-'] (_(opt).pick('stdio')))
			.on('exit',function(status){ if_sh_err('shₐ',code,_({status}) ['<-'] (ι)); (status===0? yes : no)(ι) })
		}) }
E.shₐ = (ss,...ιs)=> _shₐ(ss,ιs)
E.shₐ2 = opt=>(ss,...ιs)=> _shₐ(ss,ιs,opt)

E.osa = function(ss,...ιs){var t;
	var ι = simple_template(ss,ιs)
	// ! this is such a mess
	if (Tstr(ι[0]) && (t=ι[0].re`^(?!tell )([\w ]+):`)){ ι[0] = ι[0].slice(t[0].length); ι = [osa`tell app ${t[1]};`, ...ι, '; end tell'] }
	if (!Tstr(ι[0]) && Tstr(ι[0].raw) && ι[0].raw.re`^[\w ]+$` && Tstr(ι[1]) && (t=ι[1].re`^ *:`)){ ι[1] = ι[1].slice(t[0].length); ι = [osa`tell app ${ι.shift().raw};`, ...ι, '; end tell'] }
	return ι.map(ι=> !Tstr(ι)? applescript.print(ι.raw) : ι.replace(/;/g,'\n')).join('') }
E.osaᵥ = function(ss,...ιs){ var ι = osa(ss,...ιs); return applescript.parse(shᵥ`osascript -ss -e ${ι}`+'') }
E.osaₐ = function(ss,...ιs){ var ι = osa(ss,...ιs); shₐ`osascript -ss -e ${ι}` }

E.terminal_do_script = function(a,b){ φ`/tmp/__·`.ι = a; osaᵥ`terminal: do script "·" …${b}` } // ~/.bashrc.ζ :: E['·']
E.chrome_simple_osaᵥ = (ι,{tab,window=0})=> osaᵥ`chrome: execute window …${window+1}'s tab …${tab+1} javascript ${ζ_compile(ι)}`
E.chrome_simple_js_ᵥ = (ι,{tab,window=0})=> osaᵥ`chrome: tell window …${window+1}'s tab …${tab+1} to set URL to ${'javascript:'+ζ_compile(ι)}`
// E.chromeᵥ = ‡ not actually used ‡ wait, nope, is actually used, but mostly in one-off scripts
	// λ(ι,tab){tab = tab!==undefined? 'tab '+(tab+1) : 'active tab'
	// 	# E.chrome_$ᵥ = λ(ι,tab){r←; $null ← '__$null_'+random_id(10); fst ← 1; while ((r=chromeᵥ("if (window.jQuery){"+ι+"} else {"+(fst? (fst=0, "t ← document.createElement('script'); t.src = 'https://code.jquery.com/jquery-3.1.1.min.js'; document.getElementsByTagName('head')[0].appendChild(t)") : "")+"; '"+$null+"'}",tab))===$null); ↩ r}
	// # probably add a random_id(10) call to '#applescript_hack'
	// 	t ← "t ← document.querySelectorAll('#applescript_hack')[0]; t && t.parentNode.removeChild(t); ι ← (0,eval)("+JSON.stringify(ζ_compile(ι))+"); t ← document.createElement('div'); t.id = 'applescript_hack'; t.style = 'display:none;'; t.textContent = JSON.stringify(ι); t2 ← document.querySelectorAll('head')[0]; t2.insertBefore(t,t2.firstChild); undefined"
	// 	chrome_simple_js_ᵥ(t,tab)
	// 	t ← "document.querySelectorAll('#applescript_hack')[0].textContent"
	// 	↩ JSON.parse(chrome_simple_osaᵥ(t,tab) || '""') }

var fs_ipc_emit = (port,ι)=>{ φ`/tmp/fs_ipc_${port}`.ι = ι; return shᵥ`curl -s -X PUT localhost:${port}`+'' }

E.sbᵥ = function(ss,...ιs){
	var ENC = JSON.stringify; var ι = simple_template(ss,ιs).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('')
	var t = JSON.parse(fs_ipc_emit(34289,ι)); t===null && (t = undefined); return t }
E.sb_editᵥ = view=>(ss,...ιs)=>{ sbᵥ`edit(${view},${py(ss,...ιs)})` }

var sh_hash = _.memoize(ι=> shᵥ`which ${ι}`+'') // ! should use FRP to background-recompute hash values after certain amounts of time and discard hash values after certain amounts of time

new Property( E,'hsᵥ' ).def(()=> !(shᵥ`which hs ;:`+'')? undefined : function(ss,...ιs){
	var ENC = ι=> Tstr(ι) || Tnum(ι)? JSON.stringify(ι) : !function(){throw Error('‽')}(); var ι = simple_template(ss,ιs).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('')
	// t ← shᵥ`hs -c ${ι}`
	var t = child_process.spawnSync(sh_hash('hs'),['-c',ι]).stdout
	var t = (t+'').split('\n')[-1]; try{return JSON.parse(t)[0] }catch(e){return t } } )

E.tsᵥ = function(ss,...ιs){
	var ENC = JSON.stringify; var ι = simple_template(ss,ιs).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('')
	ι = 'require "totalspaces2"; TS = TotalSpaces2; '+ι
	PORT = 34290
	var R = ()=> JSON.parse(fs_ipc_emit(PORT,ι))[0]
	var launch_serv = function(){
		(shᵥ`gem list`+'').re`(^|\n)totalspaces2 ` || !function(){throw Error('‽')}()
		var tmp = φ`/tmp/evalserv_${random_id(9)}.rb`; tmp.text = String.raw`#!/usr/bin/env ruby
			require "socket"; require "json"
			server = TCPServer.new("localhost",${PORT})
			loop do
			  t = server.accept
			  r = JSON.generate([eval(File.read("/tmp/fs_ipc_#{${PORT}}"))])
			  t.print "HTTP/1.1 200 OK\r\n"+"Content-Type: text/plain\r\n"+"Content-Length: #{r.bytesize}\r\n"+"Connection: close\r\n"+"\r\n"+r
			  t.close
			end`
		shᵥ`chmod +x ${tmp}`; child_process.spawn(tmp,{shell:true,detached:true,stdio:'ignore'}).unref() }
	try{ return R() }catch(e){ if (e.status===7) launch_serv(); sleep(0.1); return R() } }

// such hack
var json2_read = ι=>{ var r = JSON.parse(ι); (function Λ(ι,k,o){if (ι.type==='Buffer') {
	var t = 'data' in ι || 'utf8' in ι? new Buffer(ι.data||ι.utf8) : 'base64' in ι? new Buffer(ι.base64,'base64') : !function(){throw Error('‽')}()
	if (o===undefined) r = t; else o[k] = t
	} else if (!Tprim(ι)) _(ι).forEach(Λ)})(r); return r }
var json2_show = ι=> JSON_pretty(ι,function(ι){var t;
	if (Buffer.isBuffer(ι)) return ι.equals(new Buffer(t=ι+''))? {type:'Buffer', utf8:t} : {type:'Buffer', base64:ι.toString('base64')}
	return ι})

new Property( E,'φ' ).def(()=>{
	var ENC = ι=> ι.re`/`? ι.replace(/[\/%]/g, encodeURIComponent.X) : ι
	φ['⁻¹'] = ι=> /%2F/i.test(ι)? ι.replace(/%2[F5]/gi, decodeURIComponent.X) : ι

	var existsSync = ι=> !T.Error(catch_union(()=> fs.accessSync(ι)))
	var mkdir_p = function Λ(ι){ try{ fs.mkdirSync(ι) }catch(e){ if (e.code==='EEXIST'||e.code==='EISDIR') return ; var t = path.dirname(ι); if (e.code!=='ENOENT' || ι===t) throw e; Λ(t); fs.mkdirSync(ι) } }
	// walk ← λ*(root,files){root += '/'
	// 	walk_ ← λ*(ι){try {l ← fs.readdirSync(root+ι); for (i←0;i<l.length;i++){t ← ι+l[i]; try{ fs.statSync(root+t).isDirectory()? (yield root+t, yield* walk_(t+'/')) : (files && (yield root+t)) }catch(e){} }} catch(e){} }
	// 	yield* walk_('') }
	var read_file = function(ι){ try{return fs.readFileSync(ι) }catch(e){ if (!(e.code==='ENOENT')) throw e } }
	var ensure_exists = function(ι,ifdne){ existsSync(ι) || ( mkdir_p(path.resolve(path.dirname(ι))), fs.writeFileSync(ι,ifdne) ) }
	var write_file = function(ι,data){ try{ fs.writeFileSync(ι,data) }catch(e){ if (!(e.code==='ENOENT')) throw e; ensure_exists(ι,data) } }
	var open = function(ι,ifdne,f){
		ensure_exists(ι,ifdne); var Lc = new Φ(ι).size
		var fd = fs.openSync(ι,'r+'); f({
			get L(){return Lc},
			read(i,L){var t = new Buffer(L); fs.readSync(fd,t,0,L,i) === L || !function(){throw Error('‽')}(); return t},
			write(ι,i){var L = fs.writeSync(fd,ι,i); Lc = max(Lc, L+i)},
			truncate(L){fs.ftruncateSync(fd,L); Lc = min(Lc,L)},
			indexOf_skipping(from,to,step,find,skip){var fl=this
				if (from<0) from += fl.L; if (to<0) to += fl.L; from = min(max(0, from ),fl.L-1); to = min(max(-1, to ),fl.L)
				if (!(step===-1 && from>to)) !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('TODO')
				var d = fl.read(to+1,from-to)
				for(var i=from;i>to;i+=step) {if (d[i-(to+1)]===find) return i; else if (chr(d[i-(to+1)]).match(skip)); else return null}
				},
			}); fs.closeSync(fd)}
	var globmatch = (glob,ι)=> ι.re`^…${_(glob).map(ι=> ι==='*'? '.*' : re`${ι}`.source).join('')}$`
	new Property( φ,'cwd' ).def({get(){return new Φ(process.cwd()) }, set(ι){ var t = φ(ι+'')._ι; mkdir_p(t); process.chdir(t) }})

	var normHs = function(ι){if (ι._.isEqual(['~'])) return [process.env.HOME]; Tstr(ι[0]) && (ι[0] = ι[0].replace(/^~(?=\/)/,process.env.HOME)); return ι}
	function Φ(ι){this._ι = ι}; Φ.prototype = {
		φ,
		toString(){return this._ι },
		toJSON(){return {type:'φ', ι:this._ι} },
		inspect(ˣ,opts){return opts.stylize('φ','special')+opts.stylize(util_inspect_autodepth(this._ι.replace(re`^${process.env.HOME}(?=/|$)`,'~')).replace(/^'|'$/g,'`'),'string') },
		get size(){return fs.statSync(this._ι).size },
		get nlink(){return fs.statSync(this._ι).nlink },
		get mtime(){return fs.statSync(this._ι).mtime },
		get birthtime(){return fs.statSync(this._ι).birthtime },
		get url(){return encodeURI('file:'+this.root('/')) }, // ! should this be part of root
		get is_dir(){return !!catch_ι(()=> fs.statSync(this._ι).isDirectory()) },
		get name(){return path.basename(this._ι) },
		BAD_exists(){return existsSync(this._ι) },
		TMP_children(){return (function Λ(ι){return φ(ι).is_dir? fs.readdirSync(ι).map(t=> ι+'/'+t).mapcat(Λ) : [ι] })(this._ι) },
		TMP_parents(){ var r = [this.root('/')]; while(r[-1].φ`..`+'' !== r[-1]+'') r.push(r[-1].φ`..`); return r.slice(1) },
		root(x){switch(arguments.length){default: !function(){throw Error('‽')}()
			case 0: return this._ι[0]==='/'? '/' : '.'
			case 1: return new Φ( x==='/'? path.resolve(this._ι) : x==='.'? path.relative(x,this._ι) : !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('not yet implemented: nonstandard roots') )
			}},
		ensure_dir(){ this.φ`..`.BAD_exists() || mkdir_p(this.φ`..`+''); return this },

		// get ι(){↩},
		set ι(ι){
			if (this.is_dir) !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('TODO')
			if (ι == null){ catch_union(()=> fs.unlinkSync(this._ι) ); return }
			var e = path.extname(this._ι)
			if (e==='.csv'){ this.csv = ι; return }
			if (e==='.xml'){ this.xml = ι; return }
			if (e==='.plist'){ this.plist = ι; return }
			ι = e==='.json'? JSON_pretty(ι) :
				Tstr(ι)? ι :
				JSON_pretty(ι)
			write_file(this._ι,ι) },
		get buf(){return read_file(this._ι) || new Buffer(0) },
		set buf(ι){ write_file(this._ι,ι) },
		get base64(){return new Buffer(this.text,'base64') },
		// set base64(ι){},
		get text(){return (read_file(this._ι) || '')+'' },
		set text(ι){ write_file(this._ι,ι) },
		get lines(){return function(...ιs){
			var d = ((read_file(this._ι)||'\n')+'').replace(/\n$/,'').split('\n')
			if (ιs.length > 1) return ιs.map(ι=> Tnum(ι)? d[ι] : d.slice(ι.re`^(\d+):$`[1]|0).join('\n')+'\n')
			else if (ιs.length === 0){
				return {
					map(...a){return d.map(...a)},
					} }
			else !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('TODO')
			}},
		set lines(ι){ write_file(this._ι, ι.join('\n')+'\n') },
		get json(){return JSON.parse(read_file(this._ι) || 'null') },
		set json(ι){ write_file(this._ι, JSON_pretty(ι)) },
		get json2(){return json2_read(this.text) },
		set json2(ι){ this.text = json2_show(ι) },
		get ini(){return npm`ini@1.3.4`.parse(this.text) },
		// set ini(ι){},
		// get csv(){↩},
		set csv(ι){ var t = φ`/tmp/csv_${random_id(25)}`; t.json = ι; shᵥ`ζ ${'npm`csv@0.4.6`.stringify('+js`φ(${t+''}).json,λ(e,ι){ φ(${this.root('/')+''}).buf = ι })`}` },
		// get xml(){↩ JSON.parse(shᵥ`ζ ${js`npm`xml2js@0.4.17`.parseString(φ(${@+''}).text,λ(e,ι){ process.stdout.write(JSON.stringify(ι)) })`}`+'') },
		set xml(ι){ this.text = npm`xmlbuilder@8.2.2`.create(ι,{allowSurrogateChars:true}).end({pretty:true}) },
		get plist(){var t; var buf = this.buf; return 0?0
			// in case bplist-parser has bugs, this is available:
			// which ← memoize_persist(ι=>{ try{ shᵥ`which ${ι}`; ↩ true }catch(e){} })
			// : which('plutil')? npm`plist@2.1.0`.parse(shᵥ`plutil -convert xml1 -o - ${@.root('/')+''}`+'')
			: buf.slice(0,6)+''==='bplist'? ( t= φ`/tmp/plist_${random_id(25)}`, shᵥ`ζ ${'npm`bplist-parser@0.1.1`.parseFile('+js`${this.root('/')+''},λ(e,ι){ φ(${t+''}).plist = ι })`}`, t.plist )
			: npm`plist@2.1.0`.parse(this.text)
			},
		set plist(ι){ this.text = npm`plist@2.1.0`.build(ι) },
		get json_array__synchronized(){return function(...ιs){var _ι=this._ι
			if (ιs.length) !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('TODO')
			var d = JSON.parse((read_file(_ι)||'[]')+'')
			return {
			get length(){return d.length},
			push(...a){a.map(function(ι){
				d.push(ι)
				open(_ι,'[]',function(fl){
					var i = fl.indexOf_skipping(-1,-1e4,-1,ord(']'),/[ \n\t]/) || !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('bad file')
					var is_0 = fl.indexOf_skipping(i-1,-1e4,-1,ord('['),/[ \n\t]/)!==null
					fl.write((is_0?'':',')+JSON.stringify(ι,null,'  ')+']',i)
					})
				})},
			filter(f){return d._.filter(f)},
			} }},
		}
	function Φs(ι){this._ι = ι}; Φs.prototype = {
		inspect(ˣ,opts){return opts.stylize('φ','special')+util.inspect(this._ι,opts)},
		get name_TMP(){return this._ι.map(ι=> new Φ(ι).name)}, // fs.readdirSync
		get φs(){return this._ι.map(ι=> new Φ(ι))}, // [φ]
		}
	function φ(ss,...ιs){
		var head = this instanceof Φ && this._ι
		if (this instanceof Φs) !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('not yet implemented')
		var tmpl = is_template([ss,...ιs])
		if (tmpl){var ι = simple_template(ss,ιs,[φ,'/']); if (ι.filter(Tstr).join('').re`\*|\{[^}]*?,`) {
			if (ι.length > 1) !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('not yet implemented * ** ${}',ι)
			ι = normHs(ι)
			ι = ι[0]
			if (ι.includes('**')) !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('not yet implemented ** ${}',ι)
			var r = ['.']
			if (ι[0]==='/') r = ['/']
			ι.split('/').forEach(function(ι){
				if (ι==='')return ;
				r = r.mapcat(function(r){
					if (ι === '.') return [r]
					if (ι === '..') return [r==='.'? '..' : r.split('/').every(ι=>ι==='..')? r+'/..' : path.dirname(r)]
					return fs.readdirSync(r).filter(b=> globmatch(ι,b)).map(b=> r+'/'+b)
					})
				})
			return new Φs(r) } }
		else {var ι = ss; if (ιs.length || Tarr(ι)) !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('not yet implemented'); if (ι instanceof Φs) !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('not yet implemented')}
		if (tmpl){ι = normHs(ι).map(ι=> !Tstr(ι)? ENC(ι.raw+'') : ι).join('')}
		else if (ι instanceof Φ){return head && ι._ι[0]!=='/'? new Φ(head+'/'+ι._ι) : ι}
		else {ι = (ι+'').replace(/^~(?=\/|$)/,process.env.HOME)}
		return new Φ(path.normalize(head? head+'/'+ι : ι).replace(/(?!^)\/$/,'')) }
	return φ })

//########################### personal configuration ############################
sb.ι = ()=> sb.tab.active.ι
E.p = function(ι){ var t = clipboard; return arguments.length === 0? t.ι :( t.ι = ι ) }

//################################### ζ infra ###################################
;[process,module].map(ι=> ι.inspect = function(){return '{'+Object.getOwnPropertyNames(this).map(ι=> ι+':').join(', ')+'}' }) // ‡ hack, like the [1] * 5 thing in ζ_repl_start. clean up by: can we override builtin inspects without problems? then: defining solid inspect functions for more things. otherwise: figure out something else.
var Number_toFixed = function(θ,ι){ θ = round(θ/pow(10,-ι))*pow(10,-ι); return ι>0? θ.toFixed(ι) : θ+'' }
E.pretty_time_num = ι=> _(new Number(ι)) ['<-'] ({inspect:function(ˣ,opt){ var P = 20; var ι=this; var [ι,u] = (ι >= P/1e3? [ι,'s'] : [ι*1e6,'μs']); return opt.stylize(Number_toFixed(ι,-max(-3,floor(log10(ι/P))))+u,'number') }})
_(util.inspect.styles) ['<-'] ({null:'grey',quote:'bold'})
;['global','Object'].map(ι=>{
global[ι].inspect = function(d,opt){return opt.stylize(ι,'quote') }
})
assign_properties_in_E_informal({
'Number.prototype.inspect':function(d,opt){'use strict'; return opt.stylize(( Object.is(this,-0)? '-0' : this===Infinity? '∞' : this===-Infinity? '-∞' : this+'' ), 'number') },
})
E.cn = { log:(...a)=> console.log(
	is_template(a)?
		easy_template(ι=>ι)(...a).map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι[0],{colors:true})).join('') :
		a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι,{colors:true})).join(' ')
		) }
E.util_inspect_autodepth = function(ι,opt={}){ opt.L || (opt.L = 1e6); var last; for(var i=1;;i++){ var r = util.inspect(ι,_({maxArrayLength:opt.L/3 |0, depth:i}) ['<-'] (opt)); if (r===last || r.length > opt.L) return last===undefined? '<too large>' : last; last = r } }

E._double_dagger__repl_start = ()=> ζ_repl_start({
	// i know how to make the good repl for ct. i want to, but im tired
	prompt:'\x1b[30m\x1b[100m‡\x1b[0m ',
	compile:ι=>{var t;
		var lock = 0?0
			: ['ct','chrome_tabs','ps2','d','bookmarks']._.contains(ι)? 'require_new(φ`~/.bashrc.ζ`).'+ι+'()'
			: (t= ι.re`^f(?: (.+))?$` )? js`go_to('path',${t[1]||'.'})`
			: ι
		lock===ι || cn.log('⛓  '+lock)
		return ζ_compile(lock) }, })
E.ζ_repl_start = opt=>{ opt = _({compile:ζ_compile, prompt:'\x1b[30m\x1b[42mζ\x1b[0m '}) ['<-'] (opt)
	return (f=> f.call( repl.start(_({useGlobal:true}) ['<-'] (_(opt).pick('prompt'))) ))(function(){
	this.In = []; this.Out = []
	var super_ = this.completer; this.completer = function(line,cb){ line.trim()===''? cb(null,[]) : super_.call(this,line,cb) }
	var inspect = ι=> util_inspect_autodepth(ι,{colors:this.useColors})
	this.removeAllListeners('line').on('line',function(line){
		global.rl = this
		if (line==='') return ;
		if (this.bufferedCommand){ this.history[1] += '\n'+this.history[0]; this.history.shift() }
		var t = this.bufferedCommand + (line||''); var code = t
		if (/(^\{[^]*\}$)|(^λ\()/.test(t)) t = '('+t+')' // ! it is a clumsy hack to put this on all of these code paths
		t = opt.compile(t)
		try{ var sc = new vm.Script(t,{ filename:'repl', displayErrors:false }) }
		catch(e){ if( e.name==='SyntaxError' ){ this.bufferedCommand += line+'\n'; this.outputStream.write('    '); return }; e.stack = e.name+': '+e.message+'\n    at <repl>'; var err = e }
		if (sc)
		try{ var ret = sc.runInThisContext() }
		catch(e){ e && Tstr(e.stack) && (e.stack = e.stack.replace(/^([^]*)at repl:(.*)[^]*?$/,'$1at <repl:$2>')); var err = e }
		φ`~/.archive_ζ`.text = φ`~/.archive_ζ`.text + JSON.stringify({time:Time(), code}) + '\n'
		this.In.push(code); this.Out.push(err || ret)
		if (err) this._domain.emit('error', err.err || err)
		this.bufferedCommand = ''
		if (!err && ret !== undefined) {
			global.__ = ret
			try{
				if (Tarr(ret) && ret.length > 1 && ret.every(ι=> ι===ret[0]) && _.range(ret.length).every(ι=> ι in ret))
					var t = inspect([ret[0]])+' * '+inspect(ret.length)
				else
					var t = inspect(ret)
			}catch(e){ var t = '<repl inspect failed>:\n'+(e&&e.stack) }
			this.outputStream.write(t+'\n') }
		this.displayPrompt()
		})
	this.removeAllListeners('SIGINT').on('SIGINT',function(){
		if( this.bufferedCommand+this.line ){ this.clearLine(); this.lineParser.reset(); this.bufferedCommand = ''; this.lines.level = []; this.displayPrompt() }
		else{ this.clearLine(); this.close() }
		})
	delete this.context._; this.context._ = _
	return this
	}) }

//#################################### main #####################################
var sh_ify = ι=>{var t; return Π( 0?0
	: T.Promise(ι)? ι.then(sh_ify.X)
	: ι===undefined? {}
	: Tstr(ι)? {out:ι}
	: T.boolean(ι)? {code:ι?0:1}
	: (t=catch_union(()=> JSON.stringify(ι)), !T.Error(t))? {out:t}
	: {out:ι+''} )}
var eval_ = function __53gt7j(ι){
	try{
		try{ new vm.Script(ι); return (0,eval)(ι) }catch(e){ if(!( e.name==='SyntaxError' && e.message==='Illegal return statement' )) throw e; return (0,eval)('(()=>{'+ι+'})()') }
	}catch(e){ e!==undefined && e!==null && Tstr(e.stack) && (e.stack = e.stack.replace(/    at __53gt7j[^]*/,'    at <eval>')); throw e }
	}
E.ζ_main = opt=>{var ι; var {compile,a} = opt=_({ compile:ζ_compile }) ['<-'] (opt)
	a[0]==='--fresh' && a.shift()
	if( !a.length ) ζ_repl_start(opt)
	else if( ι=a[0], φ(ι).BAD_exists() || ι.re`^\.?/` ){ process.argv = [process.argv[0],...a]; var t = φ(ι).root('/')+''; var o=Module._cache;var m=Module._resolveFilename(t,null,true);var oι=o[m]; o[m] = undefined; Module._load(t,null,true); o[m] = oι }
	else {
		global.require = require; global.code = a.shift(); global.a = a; [global.a0,global.a1] = a; global.ι = a[0]
		code = code.replace(/;\s*$/,'; undefined')
		code = opt.compile(code)
		sh_ify(eval_(opt.compile(code)))
			.then(ι=>{ ι.out && process.stdout.write(ι.out); ι.code &&( process.exitCode = ι.code ) })
		}
	}
if_main_do((...a)=> ζ_main({a}) )
// inject as .bashrc
// 	sh` ζ(){ if [[ $# = 0 || $1 =~ ^\.?/ || $1 = --fresh ]]; then /usr/local/bin/ζ "$@"; else ζλ "$@"; fi; } `

//############################ remaining work for φ #############################
// https://www.npmjs.com/package/glob-to-regexp
/*
formats include
	image               
	pixels              
	png                 .png
	jpg                 .jpg
	plist               /^<\?xml / && /<\/plist>\s*$/           read: npm::plist.parse(it)     show: npm::plist.build(it)
	xml                 .xml || /^<\?xml /
	base64              .64
	pixels (grey)       
	stdin               fd:0
	FIFO                fd:0...
	:executable         ,/^#!/ | try{fs.accessSync(ι,fs.X_OK); ↩ true} catch(e){↩ false}
	directory relative
	directory absolute
formats are Really stream formats
the formats are complicated to interact with, because
* GET POST PUT have really tangly apis for all sorts of efficiency concerns
* DELETE especially, we want to make some distinctions to make sure we don’t fuck things up accidentally (although trash could help)

# paths can have extensions, which are often meaningful. (basename/filename, ext/suffix. path.basename,dirname,extname)

# we need to be careful with non-atomic transactions
# we need to think about how this interacts with concurrency
# we need to think about how this interacts with distributed machines (e.g. mixing file and http URLs)
# 	“like, it should be caching urls all the time.”

######################## things i need ** globbing to do #######################
scratch/scratch.txt:107:φ`**`.map(ι=> [ι+'',ι.get()])._.groupBy(1)._.values().map(ι=> ι._.map(0)).filter(ι=> ι.length > 1)
scratch/sublime/index.ζ:60:	φ(arg.in).φ`**`.filter(ι=> !ι.dir()).map(λ(ι){ι+=''; t←; ι = ι.slice(arg.in.length).replace(/^\//,'')
scratch/sublime/index.ζ:66:	out ← φ(arg.out).φ`**`.filter(λ(ι){ι+=''; ↩ roots.some(λ(r){↩ ι.indexOf(r) === 0})}).filter(ι=> !ι.dir()).map(ι=> ι+'')
*/

// i'd like that to be #!/usr/bin/env node --max_old_space_size=10000 
// Sequence.prototype.map = λ(f){ for (var ι of @) yield f(ι) }

//#################################### cruft ####################################
//################################ browser fixes ################################
// BROWSERp ← typeof window!=='undefined'
// if (BROWSERp) if (!module.parent) module.parent = '<browser>'
// if (BROWSERp) typeof Buffer!=='undefined' && (window.Buffer = require('buffer').Buffer)
// if (BROWSERp) E.cn = { log:λ(…a){ console.log(…a); window.__ = a[-1] } }

// 'Function.prototype.at':lazy('at',λ(){priorityqueuejs ← require('priorityqueuejs')
// 	# https://github.com/Automattic/kue
// 	# https://github.com/rschmukler/agenda
// 	# robust to setTimeout taking extra time
// 	# ! not robust to the process failing ! should use redis or something instead !
// 	# ! wth is up with the { hrtime() <-> time } comparison
// 	qu ← new priorityqueuejs((a,b)=> b.time-a.time)
// 	P←; ensure ← λ(){if (P) ↩; P = true; (λ Λ(){t←;
// 		qu.size() === 0? (P = false) : qu.peek().time < hrtime()? (t=qu.deq(), t.ι&&t.ι.in(), Λ()/*nxt*/) : Λ.in(0.1)/*poll*/
// 		})() }
// 	↩ λ(time){ t ← {time, ι:@}; ↩ time < hrtime()? (t.ι.in(), λ(){}) : (qu.enq(t), ensure(), λ(){t.ι = null}) } }),
// 'Function.prototype._1':{get(){↩ _.once(@) }},

// E._imgur = ι=> shᵥ`curl -sH 'Authorization: Client-ID 3e7a4deb7ac67da' -F image=@${ι} 'https://api.imgur.com/3/upload' | jq -r .data.link`+''
// E._sc_imgur = (…a)=>{ t ← φ`/tmp/sc_${random_id(9)}.png`; _sc(…a,t); _alert('uploading to imgur','...',1.5); ι ← _imgur(t); go_to(ι); p(googl(ι)+'#imgur'); shᵥ`rm ${t}` }

// del(){ for v in "$@"; do v="$(realpath "$v")"; ζ 'osaᵥ`finder: delete POSIX file ${ι}`;' "$v"; rm -f "$(dirname "$v")/.DS_STORE"; done; }
// im_pdf_to_png__bad() { for v in "$@"; do convert -verbose -density 150 -trim "$v" -quality 100 -sharpen 0x1.0 png:"${v%.*}.png"; done; }
// convert -verbose -density 150 -trim 'from.pdf' -quality 100 -flatten -sharpen 0x1.0 x.jpg
// ff_crop(){ ffmpeg -i file:"$1" -ss "$2" -t "$3" -async 1 file:"${1%.*} cut".mp4; }

// E.ζ_compile_S = ι=> ι
// 	.replace(/§.[^]*?§|…(?!\$[{\/]|\(\?|':'| "\)\))|(?:λ\*?(?: λ)?(?=(?:[ \t][^\(=←]*)?\([^\)]*\)[ \t]*\{)|↩(?![\]"]|\([.?]|\$\/| ':'r|  │) ?|([\w$ʰ-ʸˡ-ˣΑ-ΡΣ-ωᴬ-ᵛᵢ-ᵥᶜᶠᶻ⁰ⁱⁿₐ-ₓₕ-ₜℂℕℚℝℤⱼⱽ]+)(\s*)←(;?))(?!['"]| ↑)/g,
// 		(ι,name,s,semi)=> ι[0]==='§'? ι : {'λ':'function', 'λ λ':'function λ','λ*':'function*', 'λ* λ':'function* λ', '↩':'return ', '↩ ':'return ', '…':'...'}[ι] || (semi===';'? 'var '+name+s+';' : 'var '+name+s+'=') )
// 	.replace(/§.[^]*?§|(^|[^'"])@(?![-`'"\w\/\\/$]| #|\([?.])/g,(ι,a1)=> ι[0]==='§'? ι : a1+'this')
// 	.replace(/§.[^]*?§|(?!"‽"|'‽')(^|[^])‽(?!\(\?)(\(?)/g, (ˣ,a,ι)=> ˣ[0]==='§'? ˣ : a+(ι? '!function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι,{colors:true})).join(" "))}(' : '!function(){throw Error("‽")}()') )
// E.ζS_compile = ι=> require('/Users/home/code/scratch/§/ζ§.ζ').S_macro_transform(E.ζ_compile_S(ι))
	// t==='.ζ§' || (t==='' && d().re`#!/usr/bin/env ζ§\s`)? module._compile(E.ζS_compile(d()),ι) :

// NODEp ← typeof process!=='undefined' && Object.prototype.toString.call(process)==='[object process]'

// E.fs_ipc = {
// 	# on: λ(port,cbₐ){http.createServer(λ(ˣ,res){a←;
// 	# 	t ← (a=φ`/tmp/fs_ipc_${port}`).ι; a.ι = null; global.ι = (a=φ`/tmp/fs_ipc_${port}_stdin`).ι.replace(/\n$/,''); a.ι = null
// 	# 	end ← ι=> res.end(ι === undefined? '' : ι+''); r ← hook_stdouterr(); try {cbₐ(t); end(r().join('\n'))} catch(e){end(r().join('\n')+''+(e.stack||e)+"\n")}
// 	# 	}).listen(port)},
// 	}

// E.googl = ι=> JSON.parse(shᵥ`curl -s ${'https://www.googleapis.com/urlshortener/v1/url?key='+φ`~/.auth/googl`.text.trim()} -H 'Content-Type: application/json' -d ${JSON.stringify({longUrl:ι})}`+'').id

	// ζ_compile_nonliteral_tree ← ι=>{
	// 	ι = ι.mapcat(ι=> ι.T? [ι] : ι.split(/(?=[{([\])}])/g).mapcat(ι=> ι.match(/^([{([\])}]?)([^]*)$/).slice(1)).filter(ι=>ι.length) )
	// 	other_bracket ← i=>{ if( !'[](){}'.includes(ι[i]) ) ↩; at ← {'[':0,'{':0,'(':0}; dir ← ι[i] in at? 1 : -1; for(;;){ for(var [a,b] of ['[]','()','{}']){ ι[i]===a && at[a]++; ι[i]===b && at[a]-- }; if( _(at).every(ι=>ι===0) ) break; i += dir; if (!(0<=i&&i<ι.length)) ↩; }; ↩ i }
	// 	fₛ ← (l,iₛ,iₑ)=>{t←;
	// 		if( t=l[iₛ].re`^([^]*)<-\s*$` ){ l[iₛ] = t[1]+'["<-"]('; l.splice(iₑ,0,')') }
	// 		}
	// 	for(i←0;i<ι.length;i++){
	// 		if( ι[i].T ) continue
	// 		iₛ ← i; iₐ ← iₛ+1; iᵇ ← other_bracket(iₐ); iₑ ← iᵇ+1
	// 		if( !(iᵇ > iₐ) ) continue

	// 		if (iₒ > i+1)
	// 		if( iₒ > i+1 ) fₛ(ι,i,iₒ+1)
	// 		}
	// 	↩ ι.map(ι=> ι.T? ι.ι : ι) }
