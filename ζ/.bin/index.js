#!/usr/bin/env node

// hey, if you're gonna break this, keep a previous stable version ready this time. weve spent entirely too much time rescuing our configurations.

// odd synonym: k, name(, id)(, i?)

//################################### prelude ###################################
var _ = require('underscore') // lodash is better than underscore except for _()
_.mixin({ '<-':function(...a){return this .assign (...a) } })
var Reflect_ownEntries = ι=> Reflect.ownKeys(ι).map(k=> [k,ι[k]])

function Descriptor(ι){ _(this) ['<-'] (ι) }
var define_properties_in = (o,names,ι)=>{ var t = o; for(var k of names.slice(0,-1)) t = (t[k] ||( t[k] = {} )); t[names[names.length-1]] = ι; return o }
var assign_properties_in = (o,ι)=>{ Reflect_ownEntries(Object.getOwnPropertyDescriptors(ι)).forEach(([k,{value:ι}])=> ι instanceof Descriptor? def(o,k,ι) : assign_properties_in(o[k] ||( o[k] = {} ),ι) ); return o }
// ! does that need Object.getOwnPropertyDescriptors at all?

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

//################################### prelude ###################################
E.O1 = _(function(){}) ['<-'] ({ prototype:Object.freeze(Object.create(null)) })

E.catch_union = f=>{ try{ var r = f(); var bad = T.Error(r); if (!bad) return r }catch(e){ var r = e; T.Error(r) || !function(){throw Error('‽')}(); return r }; bad && !function(){throw Error('‽')}() }
E.catch_ι = f=>{ try{ var r = f(); var bad = r===undefined; if (!bad) return r }catch(e){}; bad && !function(){throw Error('‽')}() }
E.catch_ = f=> function(){ try{ return f.apply(this,arguments) }catch(e){ if ('__catchable' in e) return e.__catchable; else throw e } }
E.return_ = ι=>{ throw {__catchable:ι} }

E.T = ι=>{ 
	var ty = typeof ι; if (ty!=='object') return ty; if (ι===null) return 'null'
	var p = Object.getPrototypeOf(ι); if (p===Object.prototype || p===null) return 'object'
	for (var t of is_l) if (t[1](ι)) return t[0]
	return 'object' }
var b_util = catch_ι(()=> process.binding('util') )
var is_l = [
	 ['Array',Array.isArray]
	// , ['Error',ι=> Object.prototype.toString.call(ι)==='[object Error]' || ι instanceof Error]
	,... ['Error','String','Boolean','Number'].map(ty=> [ty,ι=> Object.prototype.toString.call(ι)==='[object '+ty+']'])
	,... (!b_util? [] : ['ArrayBuffer','DataView','Date','Map','MapIterator','Promise','RegExp','Set','SetIterator','TypedArray'].map(ι=> [ι,x=> b_util['is'+ι](x)]) )
	]
// would like to be using ∈ instead
_(T) ['<-'] (_(is_l).object(),{
	symbol: ι=> typeof ι === 'symbol'
	,boolean: ι=> typeof ι === 'boolean'
	,string: ι=> typeof ι === 'string'
	,number: ι=> typeof ι === 'number'
	,function: ι=> typeof ι === 'function'
	,primitive: ι=>{ switch(typeof(ι)){case 'undefined': case 'boolean': case 'number': case 'string': case 'symbol': return true; case 'object': return ι===null; default: return false} }
	,boxed: ι=>{ if (ι===null || typeof ι!=='object') return false; var t = Object.getPrototypeOf(ι); t = t.constructor&&t.constructor.name; return (t==='Boolean'||t==='String'||t==='Number') && /^\[object (Boolean|String|Number)\]$/.test(Object.prototype.toString.call(ι)) }
	,ℤ: Number.isInteger
	,'-0': ι=> ι===0 && 1/ι < 0
	,NaN: Number.isNaN
	})
_(E) ['<-'] ({ Tstr:T.string, Tnum:T.number, Tfun:T.function, Tarr:T.Array, Tprim:T.primitive, Tbox:T.boxed, })
T.primitive.ι = new Set(['undefined','boolean','number','string','symbol','null'])
T.boxed.ι = new Set(['Boolean','String','Number'])

E.def = (o,name,ι)=>{
	Tfun(ι) &&( ι = lazy(name,ι) )
	'configurable' in ι ||( ι.configurable = true )
	if( !ι.configurable ){ if( 'value' in ι ) ι.writable = false }
	else{
		if( 'value' in ι ) 'writable' in ι ||( ι.writable = true )
		else if( ι.writable ){ delete ι.writable; ι.set && !function(){throw Error('‽')}(); ι.set = function(ι){ def(this,name,{ value:ι, enumerable:true, }) } }
		}
	return Object.defineProperty(o,name,ι) } // = ↩ o
var lazy = (name,ι)=>0?0: { writable:true, get(){return this[name] = ι() } }

//################################## requires ###################################
;[ ['events','EventEmitter'],['fs'],['http'],['https'],['module','Module'],['net'],['os'],['querystring'],['readline'],['stream'],['util'],['vm'],['zlib'],['underscore','_'],['lodash','lo'],['highland','h']
	].map(([ι,n])=> def(E, n||ι, ()=> require(ι)) )
E._ = _
var path = require('path')
var fs = require('fs')
def(E,'robot',lazy('robot',()=> npm`robotjs@0.4.5` ))
def(E,'require_new',lazy('require_new',()=>{ var t = npm`require-uncached@1.0.3`; return ι=> t((ι+'').replace(/^\.(?=\/)/,φ.cwd)) }))
_.mixin({ isEqual:lo.isEqual })

//################################### ζ infra ###################################
E.Property = function(o,name){ ;this.o = o ;this.name = name }
def(Property.prototype,'ι',{ get(){return this.o[this.name] }, set(ι){ this.o[this.name] = ι } })
Property.prototype.def = function(ι){ def(this.o,this.name,ι); return this }
Property.prototype.delete = function(){ delete this.o[this.name]; return this }
Property.prototype["map!"] = function(f){ this.ι = f(this.ι,this.name,this.o); return this }
def(Property.prototype,'bind',{get(){return this.o[this.name].bind(this.o) }})
def(Property.prototype,'∃',{get(){return this.name in this.o }})
// Property.prototype‘.bind <- { ,get(){↩ @.o[@.name].bind(@.o) } }
// ‘. = Property

new Property(eval,'·').def({ enumerable:true, get(){ this(ζ_compile(φ`/tmp/__·`.text).replace(/^#!.*/,'')) }, })
var lazy_fn = f=>{var t; return function(){return (t||(t=f())).apply(this,arguments) } } // ! slotify and then detect and merge slots

;(ι=>{ var r = JSON.parse(ι); (function Λ(ι,k,o){if( ι.type==='Buffer' ){
	var t = 'data' in ι || 'utf8' in ι? Buffer.from(ι.data||ι.utf8) : 'base64' in ι? Buffer.from(ι.base64,'base64') : !function(){throw Error('‽')}()
	if( o===undefined ) r = t; else o[k] = t
	} else if(! Tprim(ι) ) _(ι).forEach(Λ)})(r); return r })("{\n  \"type\": \"Buffer\",\n  \"utf8\": \"a better npm ontology?\\n\\ncode/scratch/ζ/index.ζ:153:\\t\\t\\tunicode_data ← 'Cc Cf Co Cs Ll Lm Lo Lt Lu Mc Me Mn Nd Nl No Pc Pd Pe Pf Pi Po Ps Sc Sk Sm So Zl Zp Zs'.split(' ').mapcat(ι=> _(npm('unicode@0.6.1/category/'+ι)).values() )\\n\\nE.npm = λ(ι){ Tarr(ι) && (ι = ι[0]); APP ← '\\\\x1b[34m[npm]\\\\x1b[0m'\\n\\t[ˣ,name,version,sub] ← ι.re`^(.*?)(?:@(.*?))?(/.*)?$`\\n\\tabs_name ← => name+'@'+version\\n\\tif (version){\\n\\t\\tcache ← φ`~/.npm/${name}/${version}`; final ← cache.φ`/node_modules/${name}`+(sub||'')\\n\\t\\ttry{ ↩ require(final) }catch(e){ if (!(e.code===\\\"MODULE_NOT_FOUND\\\")) throw e }\\n\\t\\tcache.BAD_exists() || shᵥ`cd ~; npm cache add ${abs_name()}`\\n\\t\\ta←;b←; (a=cache.φ`package.json`).ι = {description:'-',repository:1,license:'ISC'}; (b=cache.φ`README`).ι = ''; shᵥ`cd ${cache} && npm --cache-min=Infinity i ${abs_name()}`; a.ι = b.ι = ∅\\n\\t\\t↩ require(final) }\\n\\telse {\\n\\t\\tsfx`ack`\\n\\t\\tversion = shᵥ`npm show ${ι} version`+''\\n\\t\\tprocess.stderr.write(APP+' latest: '); process.stdout.write(ι.replace(/-/g,'_')+' ← npm`'+abs_name()+'`'); process.stderr.write('\\\\n')\\n\\t\\t} }\\n\\nhave npm`module` write to package.json?\\n\\nwhat is npm anyway\\nnpm has packages with names and semver-format versions\\n\\nnpm's database is \\nit's almost-but-not-quite monotonic; changes and deletions are rare but happen\\n\\npackages are supposed to be installed in node_modules\\nthis is fine for projects but dreadful for non-projects\\ni prefer to simply install each version of each package once on a system level, and intervene manually if it needs multiple copies\\n\\n\\nsingle_install\\n\\nnpm`builtin-modules@1.1.1` is a list of builtin modules\\n\\n\\n\\n\\n\\nwe have these on disk:\\nasync@2.1.4\\nbase-x@1.0.4\\nchokidar@1.7.0\\nicc@1.0.0\\nini@1.3.4\\nplist@2.1.0\\nrequire-new@1.1.0\\nrequire-uncached@1.0.3\\nrobotjs@0.4.5\\nspotify-web-api-node@2.3.2\\nsuncalc@1.7.0\\nunicode@0.6.1\\nxmlbuilder@8.2.2\\n\\nwe require these:\\nrequire('async')\\nrequire('body-parser')\\nrequire('buffer')\\nrequire('child_process')\\nrequire('color')\\nrequire('cookie-parser')\\nrequire('crypto')\\nrequire('easyimage')\\nrequire('express')\\nrequire('ffi')\\nrequire('fs')\\nrequire('jquery')\\nrequire('lame')\\nrequire('moment')\\nrequire('node-spotify')\\nrequire('numeric')\\nrequire('parsimmon')\\nrequire('path')\\nrequire('priorityqueuejs')\\nrequire('ref')\\nrequire('ref-struct')\\nrequire('set-input-source')\\nrequire('socket.io')\\nrequire('socket.io-client')\\nrequire('stream')\\nrequire('through2')\\nrequire('underscore')\\nrequire('urijs')\\nrequire('util')\\nrequire('wav')\\nrequire('zeta-lang')\\n\\n\\n\\n\\n\\ncode/declare/system maintenance:16:\\t(sh`brew leaves` sh`brew cask list` sh`npm -g ls --depth=0`) Q -> package/*\\ncode/projection/README:12:$ cd ~; git clone git@github.com:alice0meta/projection.git; cd ~/projection; npm i\\ncode/projection/run.sh:9:\\t[ -d node_modules ] || npm --cache-min=Infinity i\\ncode/projection/run.sh:15:\\tnpm update # zeta-lang\\ncode/projection/tech todos.txt:39:\\tnpm shrinkwrap\\ncode/scratch/daily.sh:22:{ echo '# brew leaves'; brew leaves; echo $'\\\\n# brew cask list'; brew cask list; echo $'\\\\n# npm -g ls'; npm -g ls --depth=0; } > \\\"ls/$(ζ 'Time().ymdhms') package manager ls\\\"\\ncode/scratch/keyrc/README.md:5:  npm -g i zeta-lang\\ncode/scratch/keyrc/README.md:8:  npm -g i keyrc && keyrc start\\n\\nnpm --cache-min=Infinity -g install .\\nnpm install --prefer-offline -g .\\n\\nnpm -g install .\\nnpm install -g .\\n\\nnpm install\\nnpm install .\\nnpm --cache-min=Infinity install --ignore-scripts\\n\\nnpm -g install 0x\\n\\nnpm -g uninstall zeta-lang\\n\\nnpm -v\\n\\nnpm -g ls\\nnpm -g ls --depth=0\\nnpm ls -g --depth=0\\n\\nnpm prefix\\nnpm prefix -g\\nnpm config get prefix\\nnpm root\\nnpm root -g\\n\\nnpm publish\\n\\nnpm install npm@latest\\nnpm upgrade npm\\n\\nnpm doctor\\n\\tneeds: net\\n\\n\\n\\n\\n\\n\\n```\\ndependencies:\\n\\tbrew cask install totalspaces; brew install ruby; gem install totalspaces2\\n  brew cask install hammerspoon\\n  npm -g i zeta-lang\\n  https://github.com/tekezo/Karabiner-Elements/\\ninstall:\\n  npm -g i keyrc && keyrc start\\n```\\n\\n* will overwrite hammerspoon settings and karabiner private.xml\\n\\n\\\\#todo clean up dependencies\\n\\n\\n\\n\\n\\n\\n\\n\\nnpm cache add <tarball file>\\nnpm cache add <folder>\\nnpm cache add <tarball url>\\nnpm cache add <name>@<version>\\n\\nnpm cache clean [<path>]\\naliases: npm cache clear, npm cache rm\\n\\n\\nsh`npm config get cache` = ~/.npm (takes way too long to execute, cache)\\n\\ncaching_thing = ι=> this_kind_of_cache\\nname = φ`~/.cache`\\nφ`…${name}_${simple_hash(caching_thing).slice(0,4)}`.φ`.meta`.json2 = {key:caching_thing,name}\\n\\ndict in fs by hash\\ntie hash to ... appropriate secret? what?\\nwhy\\ndatabase ... uniqueness ... separation ... uh\\n\\n\\n\\nget npm registry info\\nnpm view [<@scope>/]<name>[@<version>]\\n\\n\\n\\nhttps://docs.npmjs.com/files/package-locks\\n\\n\\nfriends\\n\\tfriend meat\\n\\tlocked machine interpretation\\ncode\\n\\tcode\\n\\tmetadata\\n\\t\\tmanifest\\n\\nreplace [init update install] with sync\\ninit: [code] -> [manifest]\\nadd: [code] -> [manifest]\\nrm: [code] -> [manifest]\\nupdate: [manifest] -> [locked machine interpretation]\\ninstall: [locked machine interpretation] -> [friend meat]\\n\\ndeveloper friends\\nfriends' feature flags\\n\"\n}")
E.npm = ι=>{ Tarr(ι) && (ι = ι[0]); var APP = '\x1b[34m[npm]\x1b[0m'
	var [ˣ,name,version,sub] = ι.re`^(.*?)(?:@(.*?))?(/.*)?$`
	var abs_name = ()=> name+'@'+version
	if (version){
		var cache = φ`~/.npm/${name}/${version}`; var final = cache.φ`/node_modules/${name}`+(sub||'')
		try{ return require(final) }catch(e){ if (!(e.code==="MODULE_NOT_FOUND")) throw e }
		cache.BAD_exists() || shᵥ`cd ~; npm cache add ${abs_name()}`
		var a;var b; (a=cache.φ`package.json`).ι = {description:'-',repository:1,license:'ISC'}; (b=cache.φ`README`).ι = ''; shᵥ`cd ${cache} && npm --cache-min=Infinity i ${abs_name()}`; a.ι = b.ι = undefined
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
E.ζ_compile = lazy_fn(()=>{ var anon_pmcr3; var anon_x818h; var anon_t4nzb; var anon_oenor; var anon_7cy2u; var anon_8jlo1; var anon_cbbhj; var anon_wg4h5; var anon_pxt5h; var anon_xq7qg; var anon_xzihh; var anon_q3sot; var anon_52y2m;
	var word_extra = re`♈-♓🔅🔆🔒‡⧫`
	var word = re`A-Za-z0-9_$ʰ-ʸˡ-ˣΑ-ΡΣ-ωᴬ-ᵛᵢ-ᵥᶜᶠᶻ⁰ⁱⁿₐ-ₓₕ-ₜℂℕℚℝℤⱼⱽ⚓${word_extra}`
	var ζ_parse = E.ζ_parse = (()=>{
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
	var s_or = ι=> re`(?:…${ι.split(' ').map(ι=> re`${ι}`.source).join('|')})`
	var id_g = '|> §'
	var id_c ='filter! map… map! ⁻¹declare_uniq then⚓ ⁻¹ ∪! ∩! -! ?? *? +? ∪ ∩ ⊕ ≈ ‖ ⚓ -= += Π& Π| ? * + - & | ∃'
	var id_d = [ '-0',id_g,id_c ].join(' ')
	var ζ_compile_nonliteral = ι=> ι
		.replace(/✓/g,'true')
		.replace(/✗/g,'false')
		.replace(/∅/g,'undefined')
		.replace(anon_wg4h5||(anon_wg4h5= re`🏷([${word}]+)(\s*)←`.g ),(ˣ,ι,s)=> js`…${ι+s}← __name(${ι}).ι=`) // an initial try; probably .name inference needs another form
		.replace(/‽(?=(\()?)/g,(ˣ,callp)=> callp? `!λ(…a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}` : `!λ(){throw Error('‽')}()` )
		.replace(anon_x818h||(anon_x818h= re`(\[[${word},…]+\]|\{[${word},:…]+\}|[${word}]+)(\s*)←(;?)`.g ),(ˣ,name,ws,end)=> 'var '+name+ws+(end?';':'=') )
		.replace(/λ(?=\*?(?:[ \t][^\(=←]*)?\([^\)]*\)[ \t]*\{)/g,'function')
		.replace(anon_oenor||(anon_oenor= re`\.?@@([${word}]+)`.g ),'[Symbol.$1]')
		.replace(anon_t4nzb||(anon_t4nzb= re`\.(${s_or(id_d)})`.g ),(ˣ,ι)=> js`[${ι}]`)
		.replace(anon_xzihh||(anon_xzihh= re`(${s_or(id_g)}(?!["']))`.g ),(ˣ,ι)=> js`global[${ι}]`)
		.replace(anon_xq7qg||(anon_xq7qg= re`(${s_or(id_c)}):`.g ),(ˣ,ι)=> js`${ι}:`)
		.replace(/↩ ?/g,'return ')
		.replace(/…/g,'...')
		.replace(/\[(['"])map\.\.\.\1\]/g,'["map…"]') // ! this is going to be really hard to take out
		.replace(/@/g,'this')
		.replace(/∞/g,'Infinity')
		.replace(/⇒(\s*([:{]))?/g,(ˣ,x,ι)=> '=>'+({ ':':'0?0', '{':'0?0:', }[ι]||!function(){throw Error('‽')}())+x )
		.replace(anon_52y2m||(anon_52y2m= re`(^|[^\s\)${word}]\s*)=>`.g ),(ˣ,t)=> t+'()=>' )
		.replace(anon_8jlo1||(anon_8jlo1= re`(…${'<-'.split(' ').map(ι=> re`${ι}`.source).join('|')})`.g ),(ˣ,ι)=> '['+util_inspect_autodepth(ι)+']')
		.replace(anon_7cy2u||(anon_7cy2u= re`#swap ([${word}]+) ([${word}]+)`.g ),(ˣ,a,b)=>{ var t = 't_'+random_id(9); return ζ_compile_nonliteral(`for(;;){ ${t} ← ${a}; ${a} = ${b}; ${b} = ${t} ;break}`) }) // why not just [a,b] = [b,a]?
		.replace(/\[#persist_here (.*?)\]/g,(ˣ,ι)=> '('+json2_read+js`)(${json2_show(φ(ι).buf)})`)
		.replace(/\[#Q/g,'new Property(') // Quote
		.replace(anon_cbbhj||(anon_cbbhj= re`\.(\s*)([${word}]+)(\s*)#Q\]`.g ), `,$1'$2'$3)`)
		.replace(anon_pmcr3||(anon_pmcr3= re`[${word_extra}]+`.g ), unicode_names.X)
		.replace(/\{,\}/g,'new O1()')
		.replace(/([{([]\s*),/g,'$1')
		.replace(anon_q3sot||(anon_q3sot= re`return\s+var\s+([${word}]+)`.g ), (ˣ,ι)=> `var ${ι}; return ${ι}`)
	// ζ_compile_nonliteral_tree ← ι=>{
	// 	ι = ι.map…(ι=> ι.T? [ι] : ι.split(/(?=[{([\])}])/g).map…(ι=> ι.match(/^([{([\])}]?)([^]*)$/).slice(1)).filter(ι=>ι.‖) )
	// 	@ other_bracket ← i=>{ at ← {'[':0,'{':0,'(':0}; dir ← ι[i] in at? 1 : -1; for(;;){ for(var [a,b] of ['[]','()','{}']){ ι[i]===a && at[a]++; ι[i]===b && at[a]-- }; if( _(at).every(ι=>ι===0) ) break; i += dir; if (!(0<=i&&i<ι.‖)) ↩; }; ↩ i }
	// 	↩ ι.map(ι=> ι.T? ι.ι : ι) }
	return code=>{
		var t = code; t = /^(\{|λ\s*\()/.test(t)? '0?0: '+t : t; if( /^(\{|λ\s*\()/.test(t) ) t = '0?0: '+t // ! it is a clumsy hack to put this on all of these code paths
		return ζ_parse(t).map(ι=>0?0
			: ι.T==='comment'? ι.ι.replace(/^#/,'//')
			: ι.T? ι.ι
			: ζ_compile_nonliteral(ι)
			).join('') } })
ζ_compile["⁻¹"] = ι=> ι.replace(/\b(?:function|return|this)\b(?!['"])|\bvar \s*([\w_$Α-ΡΣ-Ωα-ω]+)(\s*)(=?)|\.\.\./g, (ι,name,s,eq)=>0?0: {'function':'λ','return':'↩','this':'@','...':'…'}[ι] || (eq==='='? name+s+'←' : name+s+'←;') )
E.__name = name=> _(Object.create((anon_u5393 ||( anon_u5393 = def(new O1(),'ι',{ set(ι){ def(ι,'name',{ value:this.name }) } }) )))) ['<-'] ({name}); var anon_u5393;

if( require.extensions && !require.extensions['.ζ'] )(()=>{
	require.extensions['.ζ'] = (module,ι)=>{ module._compile(ζ_compile(fs.readFileSync(ι,'utf8')),ι) }
	var super_ = require.extensions['.js']; require.extensions['.js'] = (module,ι)=>{ (path.extname(ι)==='' && fs.readFileSync(ι,'utf8').re`#!/usr/bin/env ζ\s`? require.extensions['.ζ'] : super_)(module,ι) }
	})()

//################################### prelude ###################################
E.protos = function*(ι){ for(;!( ι===null || ι===undefined ); ι = Object.getPrototypeOf(ι)) yield ι }
E["|>"] = ι=> (...f)=> f.reduce((ι,f)=> f(ι),ι)
E.simple_hash_str = ι=>0?0
	: Tfun(ι)? T(ι)+ι
	: JSON.stringify(ι, (k,ι)=>{ if (Tprim(ι)||Tarr(ι)) return ι; else{ var r=new O1(); _(ι).keys().sort().forEach(k=> r[k]=ι[k]); return r } })
E.fromUInt32BE = ι=>{ var t = Buffer.alloc(4); t.writeUIntBE(ι,0,4); return t }
E.b36 = ι=> npm`base-x@1.0.4`([.../[0-9a-z]/].join('')).encode(ι).replace(/^0+(?!$)/,'')
E.simple_hash = ι=> b36( require('crypto').createHash('sha256').update(simple_hash_str(ι)).digest() )
var memo_frp = (names,within,f)=>{
	var dir = φ`~/.memo_frp/${names}`
	if( within ){
		try{ var t = fs.readdirSync(dir+'') }catch(e){ if (!(e.code==='ENOENT')) throw e; var t = [] }
		var now = Time().i; t = t.sort().filter(ι=> Time(ι.re`^\S+`[0]).i >= now - within )[-1]
		if( t ) return dir.φ(t).json2.ι }
	var a = Time().iso; var ι = f(); var b = Time().iso
	dir.φ`${a} ${random_id(10)}`.json2 = { names ,date:[a,b] ,ι }; return ι }
E.memoize_persist = f=>{
	var store = φ`/tmp/ζpersist_${simple_hash(f)}`; var store_ι = store.json||new O1()
	return (...a)=>{ var t = new Property(store_ι,simple_hash(a)); return t["∃"]? t.ι : ( t.ι = f(...a), store.json = store_ι, store_ι = store.json, t.ι ) } }
// frp will remove the last use(s) of slot_persist
E.slot_persist = name=>{ var o = φ`/tmp/ζpersist_${name}`; return def({name},'ι',{get(){return o.json },set(ι){ o.json = ι }}) }
// E.memoize = f=>{ cache ← new WeakMap(); ↩ _(ι=>{ if( cache.has(ι) ) ↩ cache.get(ι); Tprim(ι) && ‽; r ← f(ι); cache.set(ι,r); ↩ r }) <- ({cache}) }

E.unicode_names = ι=> [...ι].map(memoize_persist(ι=>
	(anon_3lsx8||(anon_3lsx8= (()=>{
		var unicode_data = 'Cc Cf Co Cs Ll Lm Lo Lt Lu Mc Me Mn Nd Nl No Pc Pd Pe Pf Pi Po Ps Sc Sk Sm So Zl Zp Zs'.split(' ')["map…"](ι=> _(npm('unicode@0.6.1/category/'+ι)).values() )
		return unicode_data.filter(ι=> !/^</.test(ι.name)).map(ι=> [parseInt(ι.value,16), '_'+ι.name.replace(/[- ]/g,'_').toLowerCase()+'_'])._.object()
		})() ) )[ord(ι)]).X).join(''); var anon_3lsx8;

var regex_parse = lazy_fn(()=>{var t; // status: output format unrefined
	var P = require('./parsimmon2.js')
	var dehex = ι=> chr(parseInt(ι,16))
	var ESCAPE = P('\\').then(P.alt( P(/x([0-9a-fA-F]{2})/,1).map(dehex), P(/u\{([0-9a-fA-F]+)\}/,1).map(dehex), P(/u([0-9a-fA-F]{4})/,1).map(dehex), P(/./).map(ι=> '.[|^$()*+?{}\\/'.includes(ι)? ι : P.T('escape',ι) ) ))
	var s1 = P.alt(
		 P(/[^.()[\]^$|\\]/)
		, ESCAPE
		, P`.`.T`any`
		, P`(?:${()=>OR_or_SEQ})`
		, P`(?=${()=>OR_or_SEQ})`.T`lookahead`
		, P`(?!${()=>OR_or_SEQ})`.T`nlookahead`
		, P`(${()=>OR_or_SEQ})`.T`capture`
		, P`[${[ /\^?/, ( t= ESCAPE.or(/[^\]]/), P([ t.skip('-'), t ]).or(t) ).many() ]}]`.map(ι=> P.T(ι[0]? 'nset' : 'set', ι[1]))
		)
	var TIMES = P([ s1, P.alt('*','+','?',/\{([0-9]+)(?:(,)([0-9]*))?\}/,P.of())
		.map(ι=> ι = !ι? ι : ι==='*'? [0,Infinity] : ι==='+'? [1,Infinity] : ι==='?'? [0,1] : (()=>{ var [ˣ,a,two,b] = ι.match(/\{([0-9]+)(?:(,)([0-9]*))?\}/); return [a|0,b? b|0 : two? Infinity : a|0] })() )
		]).map(([ι,for_])=> !for_? ι : {T:'times', ι, for:for_} )
	var s2 = P.alt( P('^').T`begin`, P('$').T`end`, TIMES )
	var OR_or_SEQ = P.sep_by(s2.many().T`seq`, '|').map(ι=> ι["‖"] > 1? P.T('or',ι) : ι[0])
	// t1 ← regex_parse(/^(foo)(?:bep){2,7}\baz(?:\\b.ar|[a-c-e()}][^\s]|b|baz(?=gremlin)(?!groblem)|)*/i)
	return ι=>0?0: {ι:OR_or_SEQ.parse(ι.source), flags:ι.flags} })
E.applescript = {
	parse: lazy_fn(()=>{
	  var P = require('./parsimmon2.js')
	  var ws = ι=> ws_.then(ι).skip(ws_); var ws_ = P(/[ \t\n\r]*/)
	  var value = P(()=> P.alt(false_,true_,number,object,array,string,raw) )
	  var false_ = P('false').map(()=> false)
	  var true_ = P('true').map(()=> true)
	  var number = P(/-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][-+]?[0-9]+)?/).map(ι=> +ι)
	  var _member = P.seq(P(/[ a-z0-9-]+/i).skip(ws(P(':'))), value)
	  var object = ws(P('{')).then(P.sep_by(_member,ws(P(',')))).skip(ws(P('}'))).map(ι=> ι["‖"]? _.object(ι) : [])
	  var array = ws(P('{')).then(P.sep_by(value,ws(P(',')))).skip(ws(P('}')))
	  var _char = P(/[\n\t\x20-\x21\x23-\x5B\x5D-\u{10FFFF}]|\\(["\\\/bfnrt]|u[0-9a-fA-F]{4})/u).map(ι=> ι[0]!=='\\'? ι : {'"':'"','\\':'\\','/':'/',b:'\b',f:'\f',n:'\n',r:'\r',t:'\t'}[ι[1]] || chr(parseInt(ι.slice(2),16)) )
	  var string = P('"').then( _char.many().map(ι=> ι.join('')) ).skip(P('"'))
	  var raw = P(/[^,}"]+/).or(string.map_js((ι,[i0,i1],l)=> l.slice(i0,i1))).many().map(ι=>{ ι=ι.join(''); return ι==='missing value'? undefined : {T:'raw',ι} })
	  return ι=> ι===''? undefined : ws(value).parse(ι) }),
	print: ι=> Tnum(ι)? ι+'' : Tstr(ι)? '"'+ι.replace(/["\\]/g,'\\$&')+'"' : Tarr(ι)? '{'+ι.map(applescript.print.X).join(',')+'}' : !function(){throw Error('‽')}(),
	}
// E.lenient_json_parse = (=>{
// 	P ← require('./parsimmon2.js')

// 	whitespace ← P(/\s*/m)
// 	escapes ← { b:'\b', f:'\f', n:'\n', r:'\r', t:'\t', }
// 	un_escape ← (str)=> str.replace(/\\(u[0-9a-fA-F]{4}|[^u])/, (ˣ,escape)=> escape[0]==='u'? chr(parseInt(escape.slice(1),16)) : escapes[escape[0]] || escape[0] )
// 	comma_sep ← (parser)=> P.sepBy(parser, token(P(',')))
// 	token ← p=> p.skip(whitespace)

// 	l_null ← token(P('null')).map(=> null)
// 	l_t ← token(P('true')).map(=> ✓)
// 	l_f ← token(P('false')).map(=> ✗)
// 	l_str ← token(P(/"((?:\\.|.)*?)"/, 1)).map(un_escape).desc('string')
// 	l_num ← token(P(/-?(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/)).map(Number).desc('number')

// 	json ← P.lazy(=> whitespace.then(P.alt( object, array, l_str, l_num, l_null, l_t, l_f )) )
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
				if (Tarr(ι)) { var [a,b] = '[]'; ι = ι.map(indent_show); for (var i=0;i<ι["‖"];i++) ι[i]===undefined && (ι[i] = 'null') }
				else { var [a,b] = '{}'; ι = _(ι).pairs().filter(ι=> !(ι[1]===undefined || Tfun(ι[1]))).map(ι=> show(ι[0])+': '+indent_show(ι[1])) }
				seen.pop()
				return (t=a+ι.join(', ')+b)["‖"] <= wrap_width? t : a+'\n'+T+ι.join(',\n'+T)+'\n'+b
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
	ι.T==='or'? ι.ι["map…"](Λ) :
	ι.T==='seq'? cartesian_str(ι.ι.map(Λ)) :
	// ι.T==='times'? # Λ(ι.ι).map…(x=> _.range(ι.for[0],ι.for[1]+1).map(i=> x.repeat(i)) ) :
	// 	ιs ← Λ(ι.ι)
	ι.T==='set'? ι.ι["map…"](ι=>
		Tarr(ι)? _.range(ord(ι[0]),ord(ι[1])+1).map(chr) :
		ι.T==='escape'? !function(){throw Error('‽')}() :
			[ι] ):
		!function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}(ι) }

_(E) ['<-'] (_(Math).pick('abs','ceil','exp','floor','log10','log2','max','min','round','sqrt','cos','sin','tan')); _(E) ['<-'] ({ln:Math.log, π:Math.PI, τ:Math.PI*2, e:Math.E, '⍟':Math.log, })
E.multiline = function(ι){ ι = (ι+'').split('\n').slice(1,-1); var t = ι.map(ι=> ι.re`^\t*`[0]["‖"])._.min(); ι = ι.map(ι=> ι.slice(t)); return (ι[0]==='' && ι[-1]===''? ι.slice(1,-1) : ι).join('\n') }
E.sleep = ι=>{ var h; for(var hr=hrtime(); (h=hrtime(hr)) < ι; ι-h > 0.03 && (shᵥ`sleep ${ι-h-0.02}`,1)); }
E.bench = (f,opt=new O1())=>{ var {TH=0.4} = opt
	// ! really should include a confidence interval or smth
	var r=0; var I=1; var hr=hrtime(); var R = ()=> Unit(hrtime(hr) / r,'s')
	var t=f(); r++
	if( T.Promise(t) ) return Π(yes=>{ t.then(function Λ(){ if( hrtime(hr) < TH ){ r++; f().then(Λ) }else yes(R()) }) })
	else{ for(;hrtime(hr) < TH;){ for(var i=0;i<I;i++) f(); r += I; I = ceil(I*1.5) }; return R() } }
E.bench1 = f=>{ var hr = hrtime(); f(); return Unit(hrtime(hr),'s') }
E.GET_L = (ι,within)=> memo_frp(['GET -L', ι+''], within, ()=> shᵥ`curl -sL ${ι}`) // ! some requests have short responses; will need more intelligent caching for those 'cause the filesystem can't take too much
E.random = function(ι){return arguments.length===0? Math.random() : Tnum(ι)? random()*ι |0 : _.sample(ι) }
E.random_id = L=> L.map(()=> random(anon_clqkb||(anon_clqkb=[.../[0-9a-z]/]))).join(''); var anon_clqkb;
random_id.braille = L=> L.map(()=> random(anon_8zw5b||(anon_8zw5b= [...re`[⠀-⣿]`] ))).join(''); var anon_8zw5b;

E.ord = ι=> Tnum(ι)? ι : ι.codePointAt()
E.chr = ι=> Tstr(ι)? ι : String.fromCodePoint(ι)
process.stdio = [ process.stdin,process.stdout,process.stderr ]
E._pisces__on_exits = f=> (anon_gjyfd||(anon_gjyfd= require('signal-exit') ))((i,sig)=>{
	if( i===null ) i = 128+{ SIGHUP:1,SIGINT:2,SIGQUIT:3,SIGTRAP:5,SIGABRT:6,SIGIOT:6,SIGSYS:12,SIGALRM:14,SIGTERM:15,SIGXCPU:24,SIGXFSZ:25,SIGVTALRM:26,SIGUSR2:31 }[sig]
	f(i,sig) }); var anon_gjyfd;
E.pad_r = (ι,s)=> [ι,s.slice(ι["‖"])].fold(Tstr(ι)? (a,b)=> a+b : Tarr(ι)? (a,b)=> [...a,...b] : !function(){throw Error('‽')}())

var find_closest_ISU = (ιs,ι)=>{ for(var i=0;i<ιs["‖"];i++) if( ι <= ιs[i] ) return i===0? i : abs(ιs[i]-ι) < abs(ιs[i-1]-ι)? i : i-1; return ιs["‖"]-1 }
var cartesian_str = ι=> ι.reduce((a,b)=>{ var r = []; a.forEach(a=> b.forEach(b=> r.push(a+b))); return r }, [''])
E.copy_deep = ι=>0?0
	: Tprim(ι)? ι
	: T.Map(ι)? new Map(ι)
	: T.Set(ι)? new Set(ι)
	: (()=>{
		var r = new ι.constructor()
		for(var k in ι) if( Object.prototype.hasOwnProperty.call(ι,k) ) r[k] = copy_deep(ι[k])
		return r })()
E.seq = ι=>{ var t= Object.create(seq.prototype); t.ι = ι; return t }
seq.prototype = {
	next_ι:function(){return this.ι.next().value }
	// ,map(){}
	// ,'map…':λ(){}
	// ,fold(){}
	// ,repeat(){}
	// ,filter(){}
	// ,clone(){}
	// ,pin(){}
	// ,find_(){}
	// ,slice(){}
	// ,'‖':λ(){}
	// ,some(){}
	// ,every(){}
	}
assign_properties_in_E_informal({
'Object.prototype._':{ writable:true, get(){return _(this)}, } // ! remove this
,'(Array|Set|Map).prototype._':{ get(){return _(this)} }

,'(Array|Buffer|String|Function).prototype.‖':{ get(){return this.length } }
,'(Set|Map).prototype.‖':{ get(){return this.size } }

// 'Array.prototype.map'
// ,'Buffer.prototype.map':λ(f){ r ← Buffer.alloc(@.‖); for(i←0;i<@.‖;i++) r.push(f(@[i])); ↩ r } does not even work
,'Set.prototype.map':function(f){return [...this].map(f) }
,'Map.prototype.map':function(f){return [...this.entries()].map(([i,v])=> f(v,i,this)) }
,'Number.prototype.map':function(f){'use strict'; var ι=+this; var r = Array(ι); for(var i=0;i<ι;i++) r[i] = f(i,i,ι); return r }

,'Array.prototype.map…':function(f){ var r = []; for(var i=0;i<this["‖"];i++){ var t = f(this[i],i,this); for (var j=0;j<t["‖"];j++) r.push(t[j]) }; return r }
// ,'Buffer.prototype.map…':λ(f){↩ Buffer.concat(@.map(f)) }
,'(Set|Map|Number).prototype.map…':function(f){return this.map(f)._.flatten(true) }

,'Array.prototype.fold':Array.prototype.reduce

,'Array.prototype.repeat':function(x){return x<=0? [] : x["map…"](()=> this) }
,'Buffer.prototype.repeat':function(x){return Buffer.concat(x<=0? [] : x.map(()=> this)) }

,'Set.prototype.join':function(ι){return [...this].join(ι) }

,'(Array|Buffer|String|Set).prototype.count':function(){ var r = new Map(); for (var t of this) r.set(t, (r.has(t)? r.get(t) : 0)+1 ); return r }
,'(Array|Buffer|String|Set).prototype.group':function(f){ f||(f = ι=>ι); var r = new Map(); for (var t of this){ var t2 = f(t); r.set(t2, (r.get(t2)||new Set())["∪"]([t])) }; return r }

,'Map.prototype.zip':function(...a){ a.unshift(this); var r = new Map(); a.forEach((ι,i)=> ι.forEach((ι,k)=>{ var t = r.get(k) || [undefined].repeat(a["‖"]); t[i] = ι; r.set(k,t) })); return r }

,'(Array|Buffer|String).prototype.chunk':function(L){return _.range(0,this["‖"],L).map(i=> this.slice(i,i+L)) }
,'(Array|Buffer|String).prototype.windows':function(L){return (this["‖"]-L+1).map(i=> this.slice(i,i+L)) }
,'(Array|Buffer|String).prototype.-1':{get(){return this["‖"]<1? undefined : this[this["‖"]-1] },set(ι){ this["‖"]<1 || (this[this["‖"]-1] = ι) }}
,'(Array|Buffer|String).prototype.-2':{get(){return this["‖"]<2? undefined : this[this["‖"]-2] },set(ι){ this["‖"]<2 || (this[this["‖"]-2] = ι) }}
,'(Array|Buffer|String).prototype.-3':{get(){return this["‖"]<3? undefined : this[this["‖"]-3] },set(ι){ this["‖"]<3 || (this[this["‖"]-3] = ι) }}
,'(Array|Buffer|String).prototype.-4':{get(){return this["‖"]<4? undefined : this[this["‖"]-4] },set(ι){ this["‖"]<4 || (this[this["‖"]-4] = ι) }}

,'(Array|Set).prototype.∪':function(...a){return new Set([this,...a]["map…"](ι=> [...ι])) }
,'(Array|Set).prototype.∩':function(...a){ var r = new Set(this); for(var x of a){ x = T.Set(x)? x : new Set(x); for(var ι of r) x.has(ι) || r.delete(ι) }; return r }
,'(Array|Set).prototype.-':function(...a){ var r = new Set(this); for(var t of a) for(var ι of t) r.delete(ι); return r }
,'(Array|Set).prototype.⊕':function(b){var a=this; return a["-"](b)["∪"](b["-"](a)) }

,'(Set|Map).prototype.filter!':function(f){ this.forEach((ι,i)=> f(ι,i,this) || this.delete(i)) }
,'Set.prototype.pop':function(){ var t = this[0]; this.delete(t); return t }
,'Set.prototype.0':{get(){return this.values().next().value }}
,'(Array|Set).prototype.-eq':function(...a){ var t = _([...this]).groupBy(simple_hash_str); a.forEach(ι=> ι.forEach(ι=> delete t[simple_hash_str(ι)])); return _(t).values()._.flatten(true) }

,'Map.prototype.⁻¹declare_uniq':{get(){return new Map([...this.entries()].map(ι=>[ι[1],ι[0]])) }}
,'Map.prototype.⁻¹':{get(){return [...this.keys()].group(ι=> this.get(ι)) }}

,'Array.prototype.find_':function(f){ var r; if (this.some(function(ι,i,o){var t; if( (t= f(ι,i,o))!==undefined ){ r = [i,ι,t]; return true } })) return r }
,'Array.prototype.find_index_deep':function(f){
	for(var i=0;i<this["‖"];i++){ var ι = this[i]
		if (Tarr(ι)){ var t = ι.find_index_deep(f); if (t) return [i,...t] }
		else{ if (f(ι)) return [i] }
		} }
,'Array.prototype.Π&':{get(){return Π["&"](this) }}
,'Array.prototype.Π|':{get(){return Π["|"](this) }}
,'Array.prototype.seq':{get(){ var θ = function*(){ for(;θ.i<θ.ι["‖"];) yield θ.ι[θ.i++] }(); _(θ) ['<-'] ({ ι:this, i:0, clone(){return _(this.ι.seq) ['<-'] (this) } }); return θ }}
,'Array.prototype.find_last_index':function(f){ for(var i=this["‖"]-1;i>=0;i--) if( f(this[i],i,this) ) return i }

// ,'Set.prototype.@@iterator':Set.prototype.values
// ,'Map.prototype.@@iterator':Map.prototype.entries
,'RegExp.prototype.@@iterator':function*(){yield* genex(regex_parse(this)) }
,'RegExp.prototype.exec_at':function(ι,i){ this.lastIndex = i; return this.exec(ι) }

,'Promise.prototype.status':{writable:true, get(){ var [s,v] = b_util.getPromiseDetails(this); var r = [undefined,true,false][s]; if( r!==undefined ){ [this.status,this.ι] = [r,v]; return r } }}
,'Promise.prototype.ι':{writable:true, get(){ if( this.status!==undefined ) return this.ι }}

,'stream.Readable.prototype.pin':function(){return Π(yes=>{ var t = []; this.resume(); this.on('data',ι=> t.push(ι) ).on('end',()=> yes(Buffer.concat(t)) ) })}
,'Buffer.prototype.pipe':function(to,opt){ var t = new stream.Duplex(); t.push(this); t.push(null); return t.pipe(to,opt) }
})

var TimerCons = function(a,b){this.a=a;this.b=b}; TimerCons.prototype = {clear:function(){this.a.clear();this.b.clear()}, ref:function(){this.a.ref();this.b.ref()}, unref:function(){this.a.unref();this.b.unref()}}
E.Π = ι=>0?0
	: !Tfun(ι)?( T.Error(ι)? Promise.reject(ι) : Promise.resolve(ι) )
	: /^(yes|\(yes,no\))=>/.test(ι+'')? new Promise(ι)
	: (()=>{ // type union of new.Promise(nodeback) and Promise.resolve(object)
		var type = '?'
		var r = (...a)=>{ type==='?' &&( type = 'nodeback' ); return type==='object'? ι(...a) : Π((yes,no)=> ι(...a,(e,ι)=>{ e? no(e) : yes(ι) })) }
		for(var name of ['then','catch'])
			r[name] = (...a)=>{ type==='?' &&( type = 'object', ι = Promise.resolve(ι) ); return ι[name](...a) }
		return r })()
Π["&"] = ι=> Promise.all(ι)
Π["|"] = ι=> Promise.race(ι)
assign_properties_in_E_informal({
'Function.prototype.P':function(...a1){ var ι=this; return function(...a2){return ι.apply(this, a1.concat(a2)) } }
,'Function.prototype.X':{get(){ var ι=this; return function(a){return ι.call(this,a) } }}
,'Function.prototype.defer':function(){return setImmediate(this) }
,'Function.prototype.in':function(time){return setTimeout(this,max(0,time||0)*1e3) }
,'Function.prototype.every':function(time,opt){ var r = setInterval(this,max(0,time)*1e3); return !(opt&&opt.leading)? r : new TimerCons(this.in(0),r) }
// ,'Function.prototype.Π':λ(){ ... }
})

;[Set,Map].map(Seq=>
	_(Object.getPrototypeOf( new Seq().entries() )) ['<-'] ({
		map(f){return [...this].map(f) }
		}) )
var t; _(Object.getPrototypeOf( (t=setImmediate(()=>{}), clearImmediate(t), t) )) ['<-'] ({
	clear(){ clearImmediate(this) }
	,ref(){} ,unref(){}
	})
var t; _(Object.getPrototypeOf( (t=setTimeout(()=>{},0), clearTimeout(t), t) )) ['<-'] ({
	clear(){ this._repeat? clearInterval(this) : clearTimeout(this) }
	})

E.walk = (ι,f,k,o)=>( Tprim(ι)||_(ι).forEach((ι,k,o)=> walk(ι,f,k,o)), ι!==undefined && ι!==null && f(ι,k,o), ι )
E.walk_graph = (ι,f,seen=[])=> !( Tprim(ι) || seen.includes(ι) ) && ( seen.push(ι), _(ι).forEach(ι=> walk_graph(ι,f,seen)), seen.pop(), ι!==undefined && ι!==null && f(ι), ι )
E.walk_both_obj = (ι,fᵃ,fᵇ,fseen,seen=[])=> fseen && seen.includes(ι)? fseen(ι) : !( Tprim(ι) || Tfun(ι) || seen.includes(ι) ) && ( fᵃ(ι), seen.push(ι), _(ι).forEach(ι=> walk_both_obj(ι,fᵃ,fᵇ,fseen,seen)), seen.pop(), fᵇ(ι), ι )
E.walk_fold = (ι,f,k,o)=> Tprim(ι)? ι : Tarr(ι)? ( ι = ι.map((ι,k,o)=> walk_fold(ι,f,k,o)), f(ι,k,o) ) : ( ι = _(ι).map((ι,k,o)=> [k,walk_fold(ι,f,k,o)])._.object(), f(ι,k,o) )
E.walk_obj_edit = (ι,f)=> Tprim(ι) || Tfun(ι)? ι : Tarr(ι)? ι.map(ι=> walk_obj_edit(ι,f)) : (()=>{ for (var k in ι) if (Object.prototype.hasOwnProperty.call(ι,k)) ι[k] = walk_obj_edit(ι[k],f); return f(ι) })()
E.search_obj = (ι,f)=>{ var r=[]; walk(ι,(ι,k,o)=> ι!==undefined && ι!==null && f(ι,k,o) && r.push(ι)); return r }
E.search_graph = (ι,f)=>{ var r=[]; walk_graph(ι,ι=> ι!==undefined && ι!==null && f(ι) && r.push(ι)); return r }
// the right name for walk is going to be along the lines of
// f /@ x       x.map(f)
// f //@ x      postwalk(x,f) # MapAll
// it could be a data structure that you can fmap over

E.hrtime = function(ι){ var t = arguments.length===0? process.hrtime() : process.hrtime([ι|0,(ι-(ι|0))*1e9]); return t[0] + t[1]*1e-9 }
E.Time = function(ι){ var r = arguments.length===0? new Date() : ι instanceof Date? ι : new Date(Tnum(ι)? ι*1e3 : ι); r.toString = function(){return util.inspect(this) }; return r }
var fmt = function(a,b){ var t = this.__local? npm`moment@2.18.1`(this).format('YYYY-MM-DD[T]HH:mm:ss.SSS') : this.toISOString(); t = t.slice(a,b); if (!this.__local && b > 10) t += 'Z'; return t }
assign_properties_in_E_informal({
'Date.prototype.local':{get(){return _(new Date(this)) ['<-'] ({__local:true})}}
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
	var sc_merge = function(a,b){var ak = _.keys(a); var bk = _.keys(b); bk["-"](ak).forEach(k=> a[k] = b[k]); ak["∩"](bk).forEach(k=> a[k] = !Tprim(a[k])? sc_merge(a[k],b[k]) : !Tprim(b[k])? 'error' : a[k]); return a }
	return ι=> T.boolean(ι)? true : Tstr(ι)? '' : Tnum(ι)? 0 : Tarr(ι)? !ι["‖"]? [] : [ι.map(schema).fold(sc_merge)] : _.pairs(ι).map(ι=> [ι[0],schema(ι[1])])._.object()
	})()

new Property( E,'brightness' ).def(()=>{
	var br = hsᵥ? {
		get(){return Π( hsᵥ`hs.brightness.get()`/100 )},
		set(ι){return Π( hsᵥ`hs.brightness.set(${ι*100|0})` )},
		} : npm`brightness@3.0.0`
	br.set_overlay = ι=> br.set(ι > 0.5? (ι===1? 1 : ι-1/64) : (ι===0? 0 : ι+1/64)).then(()=> robot_key_tap('⇧⌥FnF'+(ι > 0.5? 2 : 1)) )
	return br })

E.os_daemon = (cmd,opt)=>{ cmd+=''; var {once} = opt||new O1()
	var job = {
		[once?'RunAtLoad':'KeepAlive']:true
		,Label:`ζ.${φ(cmd).name}.${simple_hash(cmd).slice(0,8)}`
		,ProgramArguments:['sh','-c',sh`export anon_tns7w=${cmd}; PATH="/usr/local/bin:$PATH"; ${cmd}`]
		,StandardOutPath  :φ`~/Library/Caches/ζ.logic/${simple_hash(cmd)}.out`.ensure_dir()+''
		,StandardErrorPath:φ`~/Library/Caches/ζ.logic/${simple_hash(cmd)}.err`.ensure_dir()+''
		}
	var job_path = φ`~/Library/LaunchAgents/${job.Label}.plist`; job_path.BAD_exists() ||( job_path.ι = job ); _.isEqual( job_path.plist, job ) || !function(){throw Error('‽')}()
	return { cmd ,job_path ,restart(){ var t = this.job_path; shᵥ`launchctl unload ${t} &>/dev/null; launchctl load ${t}` } } }
new Property( os_daemon,'this' ).def(()=> process.env.anon_tns7w && os_daemon(process.env.anon_tns7w) )

E.if_main_do = f=>{ if( !module.parent ) f(...process.argv.slice(2)) }

E.robot_key_tap = ι=> require_new(φ`~/code/scratch/keyrc/index.ζ`).robot_key_tap(ι)
E.KEY_once = (...a)=> require_new(φ`~/code/scratch/keyrc/index.ζ`).KEY_once(...a)

var json_socket = socket=>{ var anon_ffkit; var anon_dsm09; return {
	to(ι){ var t; (anon_ffkit||(anon_ffkit=( t= npm`ndjson@1.5.0`.stringify(), t.pipe(socket), t ) )).write(ι) }
	,on(f){ (anon_dsm09||(anon_dsm09= socket.pipe(npm`ndjson@1.5.0`.parse()) )).on('data',f) }
	} }
var ipc_wait = f=>{var H; (H= new net.Server()).listen(0,'localhost').on('connection',socket=> json_socket(socket).on(_.once(ι=>{ socket.destroy(); H.close(); f(ι) })) ); return Π(yes=> H.on('listening',yes.P(H)) ) }
E.notify = ι=>{ Tstr(ι) &&( ι = ι.re`\n`? ι.re`^(.*?)\n([^]*)`.slice(1) : ι.re` `? ι.re`^(.*?) ([^]*)`.slice(1) : [ι] )
	return Π(yes=> ipc_wait(yes).then(H=>
		hsᵥ`hs.notify.new(
			function(x) x:withdraw(); hs.socket.new():connect('localhost',${H.address().port}):write(hs.json.encode({ at=x:actualDeliveryDate() })..'\n') end
			,{ title=${ι[0]}, informativeText=${ι[1]||''}, otherButtonTitle='\u{2063}', actionButtonTitle='\u{2063}', }
			):send()`
		) ) }

//#################################### .ζrc #####################################
process.env.PATH = ['./node_modules/.bin','/usr/local/bin',...(process.env.PATH||'').split(':'),'.']["∪"]([]).join(':')
E.nice_url = function(ι){var t; var Uri = npm`urijs@1.18.12`; var {sourcemap} = ι; ι=ι+''
	// very nice google maps urls
	// if url ≈ google.com/maps/
	// fetch short url:
	// 	# @2016-08-18 wait-click $('#searchbox-hamburger')
	// 	wait-click $('[guidedhelpid="searchbox_hamburger"]')
	// 	wait-click $('[jsaction="settings.share"]')
	// 	wait-check $('#share-short-url')
	// 	t ← $('.widget-share-link-url').val() wait ι=> ι.re`^https?://goo.gl/maps/`
	// 	return t
	// 	$('.modal-container').click()
	// wait-check: if not $`${ι}:checked`; ι.click(); wait for $`${ι}:checked`
	// wait-click: wait for ι.‖; ι.click()
	// decode: parse curl https://goo.gl/maps/7s6wKcW8zUC2

	if (t=ι.re`^"(.*)"$`) return '“'+t[1]+'”' // ! bad hack

	var apply_regexes = regs=> multiline(regs).split(/\n/g).map(function(t){ var [a,b] = t.split(/  +/g); ι = ι.replace(RegExp(a),b) })
	var URL = /\b(?:(?:https?|chrome):\/\/|(?:file|mailto):)(?:[^\s“”"<>]*\([^\s“”"<>]*\))?(?:[^\s“”"<>]*[^\s“”"<>)\]}⟩?!,.:;])?/g
	var parse_alicetext = ι=> _.zip(ι.split(URL).map(ι=>0?0: {type:'text', ι}), (ι.match(URL)||[]).map(ι=>0?0: {type:'url', ι}))._.flatten(true).filter(ι=> !(ι === undefined || (ι.type === 'text' && ι.ι === '')))

	// ι = parse_alicetext(ι).map(λ(ι){t←; ι.type==='url' && (t=Uri(ι.ι)).domain()+t.path()==='google.com/webhp' && t.path('/search') && (ι.ι = t+''); ↩ ι})._.map('ι').join('')

	if (sourcemap && sourcemap.title && sourcemap.url && (t=Uri(ι.slice(...sourcemap.url)),
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
			var u = Uri(ι.ι)
			switch (u.domain()) { default: return ι
				break; case 'amazon.com':
					u.removeSearch(['sa-no-redirect','keywords','qid','ie','s','sr','tag','linkCode','camp','creative','creativeASIN'])
					u.filename().re`^ref=[\w_]+$` && u.filename('')
					if (t=u.resource().re`^/(?:[\w-]+/)?(?:dp|gp)/(?:product/)?(\w+)/?$`) {ι.ι = 'http://amzn.com/'+t[1]; return ι}
				break; case 'fb.com': u.removeSearch(['fref','hc_location','_rdr','pnref'])
				break; case 'google.com': if (u.segment()._.isEqual(['search'])){ u.removeSearch(['gws_rd','aqs','sourceid','es_sm','ie']); u.hasSearch('q') && u.removeSearch('oq') }
				}; ι.ι = u+'' }
		return ι}).map(ι=>ι.ι).join('')

	apply_regexes(function(){/*
	: \d{5,}: Amazon(?:Smile)?: Books( http://amzn.com/)        $1
	*/})

	ι = parse_alicetext(ι).map(ι=>{var t;
		if (ι.type === 'url') {
			var u = Uri(ι.ι)
			if( ι.ι.re`\)$` && u.hash()==='' ) ι.ι += '#'
			}
		return ι}).map(ι=>ι.ι).join('')

	//################################### todo ####################################
	// http://smile.amazon.com/gp/product/0300078153
	// Seeing like a State http://amzn.com/0300078153

	// https://docs.google.com/spreadsheets/d/1wfFMPo8n_mpcoBCFdsIUUIt7oSm7d__Duex51yejbBQ/edit#gid=0
	// http://goo.gl/0nrUfP

	// generalize the “fix & to ?” to many different things

	// http://www.ribbonfarm.com/2010/07/26/a-big-little-idea-called-legibility/
	// A Big Little Idea Called Legibility http://ribbonfarm.com/2010/07/26/a-big-little-idea-called-legibility/
	// http://ribbonfarm.com/2010/07/26/a-big-little-idea-called-legibility
	// http://ribbonfarm.com/2010/07/26/a-big-little-idea-called-legibility (3K words)

	// decodeURI('https://www.google.com/search?q=%28cos%28x%29-x%2F%2810*%CF%80%29%29%5E2%2C+cos%28x%29%5E2%2C+2*%28-x%2F%2810*%CF%80%29%29*cos%28x%29%2C+%28-x%2F%2810*%CF%80%29%29%5E2&oq=%28cos%28x%29-x%2F%2810*%CF%80%29%29%5E2%2C+cos%28x%29%5E2%2C+2*%28-x%2F%2810*%CF%80%29%29*cos%28x%29%2C+%28-x%2F%2810*%CF%80%29%29%5E2&gs_l=psy-ab.3...106740.118625.0.119014.18.18.0.0.0.0.163.1395.16j1.17.0....0...1.1.64.psy-ab..2.0.0.9dJSX0MrIe0')
	// https://www.google.com/search?q=(cos(x)-x%2F(10*π))^2%2C+cos(x)^2%2C+2*(-x%2F(10*π))*cos(x)%2C+(-x%2F(10*π))^2&oq=(cos(x)-x%2F(10*π))^2%2C+cos(x)^2%2C+2*(-x%2F(10*π))*cos(x)%2C+(-x%2F(10*π))^2&gs_l=psy-ab.3...106740.118625.0.119014.18.18.0.0.0.0.163.1395.16j1.17.0....0...1.1.64.psy-ab..2.0.0.9dJSX0MrIe0
	// https://www.google.com/search?q=(cos(x)-x%2F(10*π))^2%2C+cos(x)^2%2C+2*(-x%2F(10*π))*cos(x)%2C+(-x%2F(10*π))^2&oq=(cos(x)-x%2F(10*π))^2%2C+cos(x)^2%2C+2*(-x%2F(10*π))*cos(x)%2C+(-x%2F(10*π))^2
	// https://www.google.com/search?q=(cos(x)-x/(10*π))^2,+cos(x)^2,+2*(-x/(10*π))*cos(x),+(-x/(10*π))^2&oq=(cos(x)-x/(10*π))^2,+cos(x)^2,+2*(-x/(10*π))*cos(x),+(-x/(10*π))^2

	return ι}
E.sfx = function(ss,...ιs){ var ι = ss[0]
	shₐ`afplay ~/code/scratch/dotfiles/${ι}.wav`
	if (ι==='done' && osaᵥ`get volume settings`['output muted']){ var br = brightness; br.get().then(old=>{ br.set(0); (()=> br.set(old)).in(0.2) }) }
	}
var _low_brightness_symbol__high_brightness_symbol_ = go=>{ var ιs = [0,1,2.5,5.5,10,16].map(ι=>ι/16); return brightness.get().then(br=> brightness.set_overlay( ιs[min(max( 0, find_closest_ISU(ιs,br) + go ), ιs["‖"]-1 )] )) }
E._low_brightness_symbol_ = ()=> _low_brightness_symbol__high_brightness_symbol_(-1)
E._high_brightness_symbol_ = ()=> _low_brightness_symbol__high_brightness_symbol_(1)
E.moon = ι=>{ ι||(ι=Time()); var moons = [...'🌑🌒🌓🌔🌕🌖🌗🌘']; return moons[floor((npm`suncalc@1.7.0`.getMoonIllumination(ι).phase * moons["‖"] + 0.5) % moons["‖"])] }
E.github_url = ι=>{
	var github_remote_origin = file=>{
		var ι = φ(file).root('/')
		var root = ι; while( root+''!=='/' && !root.φ`.git`.BAD_exists() ) root = root.φ`..`
		if( root+''==='/' ) throw _(Error()) ['<-'] ({ human:'did not find github remote origin for '+(file||'<anon>') })
		ι = (ι+'').slice((root+'/')["‖"])
		var name = root.φ`.git/config`.ini['remote "origin"'].url.match(/github\.com[:/](.+)\/(.+)\.git/).slice(1).join('/')
		var commit = /*jet[*/ catch_ι(()=> root.φ`.git/HEAD`.text.trim()==='ref: refs/heads/master' && root.φ`.git/refs/heads/master`.text.trim() ) /*]*/ || shᵥ`cd ${root}; git rev-parse HEAD`+''
		return encodeURI('http://github.com/'+name+'/blob/'+commit+'/'+ι) }
	var [file,h] = sbᵥ`view = deserialize(${ι}); s = view.sel(); [ view.file_name(), [view.rowcol(ι) for ι in [s[0].begin(), s[-1].end()]] ]`
	var fm = ι=> 'L'+(ι+1)
	return github_remote_origin(file||'')+( _.isEqual(h[0],h[1])? '' : '#'+(h[0][0]===h[1][0]? fm(h[0][0]) : fm(h[0][0])+'-'+fm(h[1][0])) ) }
E.go_to = (...a)=>{ // synonyms: go_to, open, search?
	var opt = !Tprim(a[-1])? a.pop() : new O1()
	var type = a["‖"]===1? undefined : a.shift()
	var ι = a[0]
	var {new:new_,focus,in_app,sb_view_file_name} = _({new:false, focus:true, in_app:undefined, sb_view_file_name:undefined}) ['<-'] (opt)

	var is_url = ι=> ι.re`^((https?|chrome-extension)://|file:|mailto:)`
	var searchify = ι=> 'https://www.google.com/search?q='+encodeURIComponent(ι)

	in_app && (in_app = in_app.toLowerCase())

	if (!focus) sfx`ack`

	// windows_in_current_space_in_app ← app=> hsᵥ`hs.fnutils.imap( hs.window.filter.new(false):setAppFilter(${app},{visible=true,currentSpace=true}):getWindows(), function(x) return x:id() end)`
	// apps_with_windows_in_current_space ← => hsᵥ`hs.fnutils.imap( hs.window.filter.new(false):setAppFilter('default',{visible=true,currentSpace=true}):getWindows(), function(x) return x:application():name() end)`

	//########################### go to specific chrome ###########################
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
			var [ˣ,p,r] = decodeURI(ι).re`^(.*?:)([^]*)`; var ι = p+r.replace(/[^\/]+/g,encodeURIComponent.X)
			}
		if (in_app==='#ql') shₐ`( &>/dev/null qlmanage -p ${file} &)`
		else{
			in_app ||( in_app = 'chrome' )
			if (in_app==='chrome'){
				var t = osaᵥ`chrome: URL of tabs of windows`.find_index_deep(t=> t===ι); if (t)
					{ var [window_,tab] = t; osaₐ`chrome: set active tab index of window ${window_+1} to ${tab+1}`; osaₐ`chrome: activate`; return } }
			if (ι.re`^chrome-extension://`) shᵥ`duti -s com.google.Chrome chrome-extension` // bug workaround
			shᵥ`open …${in_app && sh`-b ${global["|>"](in_app)(memoize_persist(ι=> catch_ι(()=> osaᵥ`id of app ${ι}`) ))}`} ${!focus && '-g'} ${ι}`
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
			var [ˣ,ι,line] = ι.re`^(.+):(\d+):$`
			ι = φ('~/file/'+ι)
			shᵥ`'/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl' ${ι}:${line}`; return }
		if (in_app==='terminal'){
			var here = hsᵥ`hs.fnutils.imap( hs.window.filter.new(false):setAppFilter('Terminal',{visible=true,currentSpace=true}):getWindows(), function(x) return x:id() end)`
			var unbusy = ()=> osaᵥ`terminal: id of windows where busy = false`
			var available = here["∩"](unbusy())[0]
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
E.is_template = ([ss,...ιs])=> ss && Tarr(ss.raw) && ss.raw["‖"]-1 === ιs["‖"]
var tmpl_flatten = (raw2,ιs2)=> _.zip(raw2,ιs2)._.flatten(true).slice(0,-1).filter(ι=> ι!=='')
E.simple_template = function(ss,ιs,filter){ is_template([ss,...ιs]) || !function(){throw Error('‽')}()
	var falsy = ι=> ι===undefined||ι===null||ι===false
	if( filter && !Tfun(filter) ){ var [root,join] = filter; filter = ι=> Tarr(ι)? ι.map(ι=> root`${ι}`).join(join) : falsy(ι)? '' : undefined }
	var filter_special = ι=> falsy(ι)? '' : ι+''
	var ι = tmpl_flatten( ss.raw.map(ι=> ι.replace(/\\(?=\$\{|`)/g,'')), ιs.map(ι=>0?0:{raw:ι}) )
	for(var i=0;i<ι["‖"]-1;i++) if (Tstr(ι[i]) && !Tstr(ι[i+1])) ι[i] = ι[i].replace(/…$/,()=>{ ι[i+1] = filter_special(ι[i+1].raw); i++; return '' })
	filter && (ι = ι.map(function(ι){var t; return Tstr(ι)? ι : (t=filter(ι.raw), t===undefined? ι : t) }))
	return ι}
E.easy_template = (()=>{
	var read = (ss,ιs)=> tmpl_flatten(ss.raw,ιs.map(ι=>[ι]))
	var show = function(ι){ var raw = ['']; var ιs = []; ι.forEach(ι=> Tstr(ι)? raw[-1]+=ι : (ιs.push(ι), raw.push('')) ); return [{raw},...ιs] }
	return f=> function(ss,...ιs){return f.call(this,read(ss,ιs),show) }
	})()

E.clipboard = def(new O1(),'ι',{ get(){return shᵥ`pbpaste`+'' }, set(ι){ shₐ`${sb.encode(ι)} |`` pbcopy` }, })
E.sb = function self(){return self._call() } // let personal concepts use sb as callable
new Property( sb,'tab' ).def({
	get(){
		var r = sbᵥ`[serialize(ι) for ι in (ι.view() for ι in sublime.windows() for ι in ι.sheets()) if ι]`
		r.active = sbᵥ`serialize(sublime.active_window().active_sheet().view())`
		;[...r,r.active].map(ι=> ι && new Property( ι,'ι' ).def({ enumerable:false,
			get(){return sbᵥ` view = deserialize(${this}); view.substr(Region(0,view.size())) ` },
			set(ι){ sb_editᵥ(this)` view.replace(edit,Region(0,view.size()),${ι}) ` },
			}) )
		new Property( r,'push' ).def({ enumerable:false, value:
			function(ι){ shₐ`${sb.encode(ι)} |`` open -a 'Sublime Text.app' -f`; this["‖"] = 0; (()=> _(this) ['<-'] (sb.tab) ).in(0.02) } // ! wtf async/sync mix
			})
		return r },
	})

var fs_ipc_emit = (port,ι)=>{ φ`/tmp/fs_ipc_${port}`.ι = ι; return shᵥ`curl -s -X PUT localhost:${port}`+'' }

E.sbᵥ = function(ss,...ιs){
	var ENC = JSON.stringify; var ι = simple_template(ss,ιs).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('')
	var t = JSON.parse(fs_ipc_emit(34289,ι)); t===null &&( t = undefined ); return t }
E.sb_editᵥ = view=>(ss,...ιs)=>{ sbᵥ`edit(${view},${py(ss,...ιs)})` }

// sublime/sb
// 	tab
// 	view

E.re = function(ss,...ιs){
	// would like to embed regex in [] and have that be ok; ie re`[${/[a-z]/}]` = /[a-z]/
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

E.sh = function(ss,...ιs){ var ENC = ι=> "'"+(ι+'').replace(/'/g,"'\\''")+"'"; return simple_template(ss,ιs,[sh,' ']).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('') }
sh.clear = "/usr/bin/clear && printf %s $'\\e[3J'"
var ellipsify = ι=> util_inspect_autodepth(ι.slice(0,100))+(ι.slice(100)["‖"]?'…':'')

var if_sh_err = (name,code,ι)=>{ if (ι.status!==0) throw _(Error(name+'`'+code+'` → status:'+ι.status+', stderr:'+ellipsify(ι.stderr+''))) ['<-'] (_(ι).pick('status','stdout','stderr')) }
E.shᵥ = function(ss,...ιs){ var code = sh(ss,...ιs)
	// ι ← process_spawn('/bin/sh',{ ,args:['-c',code] ,⚓:1 })
	var ι = require('child_process').spawnSync(code,{shell:true})
	if_sh_err('shᵥ',code,ι)
	return _(ι.stdout) ['<-'] ({ toString(...a){ var ι = Buffer.prototype.toString.call(this,...a); return a["‖"]? ι : ι.replace(/\n$/,'') } }) }
var _shₐ = (ss,ιs,opt=new O1())=>{
	if (ss["‖"]===2 && ss[0]==='' && ss[1].re`^ *\|$`){ opt.stdio && !function(){throw Error('‽')}(); opt.stdio = [φ.fd.from(ιs[0]),'pipe','pipe',]; return shₐ2(opt) }
	else{ var code = sh(ss,...ιs)
		// ι ← process_spawn('/bin/sh',_({ ,args:['-c',code] }) <- (opt))
		// ι.exit.then(exit=>{ if_sh_err('shₐ',code,_(ι) <- ({exit})) })
		var ι = require('child_process').spawn(code,_({shell:true}) ['<-'] (_(opt).pick('stdio','detached')))
			.on('exit',function(status){ if_sh_err('shₐ',code,_({status}) ['<-'] (ι)) })
		return ι } }
E.shₐ = (ss,...ιs)=> _shₐ(ss,ιs)
E.shₐ2 = opt=>(ss,...ιs)=> _shₐ(ss,ιs,opt)

E.osa = function(ss,...ιs){var t;
	var ι = simple_template(ss,ιs)
	// ! this is such a mess
	if (Tstr(ι[0]) && (t=ι[0].re`^(?!tell )([\w ]+):`)){ ι[0] = ι[0].slice(t[0]["‖"]); ι = [osa`tell app ${t[1]};`, ...ι, '; end tell'] }
	if (!Tstr(ι[0]) && Tstr(ι[0].raw) && ι[0].raw.re`^[\w ]+$` && Tstr(ι[1]) && (t=ι[1].re`^ *:`)){ ι[1] = ι[1].slice(t[0]["‖"]); ι = [osa`tell app ${ι.shift().raw};`, ...ι, '; end tell'] }
	return ι.map(ι=> !Tstr(ι)? applescript.print(ι.raw) : ι.replace(/;/g,'\n') ).join('') }
E.osaᵥ = function(ss,...ιs){ var ι = osa(ss,...ιs); return applescript.parse(shᵥ`osascript -ss -e ${ι}`+'') }
E.osaₐ = function(ss,...ιs){ var ι = osa(ss,...ιs); shₐ`osascript -ss -e ${ι}` }

E.terminal_do_script = function(a,b){ φ`/tmp/__·`.ι = a; osaᵥ`terminal: do script "·" …${b}` } // ~/.bashrc.ζ :: E['·']
E.chrome_simple_osaᵥ = (ι,{tab,window=0})=> osaᵥ`chrome: execute window …${window+1}'s tab …${tab+1} javascript ${ζ_compile(ι)}`
E.chrome_simple_js_ᵥ = (ι,{tab,window=0})=> osaᵥ`chrome: tell window …${window+1}'s tab …${tab+1} to set URL to ${'javascript:'+ζ_compile(ι)}`
// E.chromeᵥ = ‡ not actually used ‡ wait, nope, is actually used, but mostly in one-off scripts
	// λ(ι,tab){tab = tab!==∅? 'tab '+(tab+1) : 'active tab'
	// 	# E.chrome_$ᵥ = λ(ι,tab){r←; $null ← '__$null_'+random_id(10); fst ← 1; while ((r=chromeᵥ("if (window.jQuery){"+ι+"} else {"+(fst? (fst=0, "t ← document.createElement('script'); t.src = 'https://code.jquery.com/jquery-3.1.1.min.js'; document.getElementsByTagName('head')[0].appendChild(t)") : "")+"; '"+$null+"'}",tab))===$null); ↩ r}
	// # probably add a random_id(10) call to '#applescript_hack'
	// 	t ← "t ← document.querySelectorAll('#applescript_hack')[0]; t && t.parentNode.removeChild(t); ι ← (0,eval)("+JSON.stringify(ζ_compile(ι))+"); t ← document.createElement('div'); t.id = 'applescript_hack'; t.style = 'display:none;'; t.textContent = JSON.stringify(ι); t2 ← document.querySelectorAll('head')[0]; t2.insertBefore(t,t2.firstChild); ∅"
	// 	chrome_simple_js_ᵥ(t,tab)
	// 	t ← "document.querySelectorAll('#applescript_hack')[0].textContent"
	// 	↩ JSON.parse(chrome_simple_osaᵥ(t,tab) || '""') }

E.which = _.memoize((...a)=> !is_template(a)? which`${a[0]}` : catch_ι(()=> shᵥ`which …${sh(...a)}`+'')) // ! should use FRP to background-recompute hash values after certain amounts of time and discard hash values after certain amounts of time

new Property( E,'hsᵥ' ).def(()=> which('hs') && function(ss,...ιs){
	var ENC = ι=> Tstr(ι) || Tnum(ι)? JSON.stringify(ι) : !function(){throw Error('‽')}(); var ι = simple_template(ss,ιs).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('')
	// t ← shᵥ`hs -c ${ι}`
	var t = shᵥ`/usr/local/bin/hs -c ${ι}`
	// t ← child_ process.spawnSync(which('hs'),['-c',ι]).stdout
	var t = (t+'').split('\n')[-1]; var r = catch_ι(()=> JSON.parse(t)[0]); return r!==undefined?r: t } )

E.tsᵥ = function(ss,...ιs){
	var ENC = JSON.stringify; var ι = simple_template(ss,ιs).map(ι=> !Tstr(ι)? ENC(ι.raw) : ι).join('')
	ι = 'require "totalspaces2"; TS = TotalSpaces2; '+ι
	PORT = 34290
	var R = ()=> JSON.parse(fs_ipc_emit(PORT,ι))[0]
	var launch_serv = ()=>{
		(shᵥ`gem list`+'').re`(^|\n)totalspaces2 ` || !function(){throw Error('‽')}()
		var t = φ`/tmp/evalserv_${random_id(9)}.rb`; t.text = String.raw`#!/usr/bin/env ruby
			require "socket"; require "json"
			server = TCPServer.new("localhost",${PORT})
			loop do
			  t = server.accept
			  r = JSON.generate([eval(File.read("/tmp/fs_ipc_#{${PORT}}"))])
			  t.print "HTTP/1.1 200 OK\r\n"+"Content-Type: text/plain\r\n"+"Content-Length: #{r.bytesize}\r\n"+"Connection: close\r\n"+"\r\n"+r
			  t.close
			end`
		shᵥ`chmod +x ${t}`
		require('child_process').spawn(t,{shell:true,detached:true,stdio:'ignore'}).unref()
		// process_spawn('/bin/sh',{ ,args:['-c',t+''] ,child:✗ })
		}
	try{ return R() }catch(e){ if( e.status===7 ) launch_serv(); sleep(0.1); return R() } }

// such hack
var json2_read = ι=>{ var r = JSON.parse(ι); (function Λ(ι,k,o){if( ι.type==='Buffer' ){
	var t = 'data' in ι || 'utf8' in ι? Buffer.from(ι.data||ι.utf8) : 'base64' in ι? Buffer.from(ι.base64,'base64') : !function(){throw Error('‽')}()
	if( o===undefined ) r = t; else o[k] = t
	} else if(! Tprim(ι) ) _(ι).forEach(Λ)})(r); return r }
var json2_show = ι=> JSON_pretty(ι,function(ι){var t;
	if (Buffer.isBuffer(ι)) return ι.equals(Buffer.from(t=ι+''))? {type:'Buffer', utf8:t} : {type:'Buffer', base64:ι.toString('base64')}
	return ι})

new Property( E,'φ' ).def(()=>{
	var ENC = ι=> ι.re`/`? ι.replace(/[\/%]/g, encodeURIComponent.X) : ι
	φ["⁻¹"] = ι=> /%2F/i.test(ι)? ι.replace(/%2[F5]/gi, decodeURIComponent.X) : ι
	φ.fd = new O1(); φ.fd.from = ι=> fs.createReadStream(undefined,{ fd:fs.openSync(_(φ`/tmp/${random_id(20)}`) ['<-'] ({ι}) +'','r') })

	var existsSync = ι=> !T.Error(catch_union(()=> fs.accessSync(ι)))
	var mkdir_p = function Λ(ι){ try{ fs.mkdirSync(ι) }catch(e){ if (e.code==='EEXIST'||e.code==='EISDIR') return ; var t = path.dirname(ι); if (e.code!=='ENOENT' || ι===t) throw e; Λ(t); fs.mkdirSync(ι) } }
	// walk ← λ*(root,files){root += '/'
	// 	walk_ ← λ*(ι){try {l ← fs.readdirSync(root+ι); for (i←0;i<l.‖;i++){t ← ι+l[i]; try{ fs.statSync(root+t).isDirectory()? (yield root+t, yield* walk_(t+'/')) : (files && (yield root+t)) }catch(e){} }} catch(e){} }
	// 	yield* walk_('') }
	var read_file = function(ι){ try{return fs.readFileSync(ι) }catch(e){ if (!(e.code==='ENOENT')) throw e } }
	var ensure_exists = function(ι,ifdne){ existsSync(ι) || ( mkdir_p(path.resolve(path.dirname(ι))), fs.writeFileSync(ι,ifdne) ) }
	var write_file = function(ι,data){ try{ fs.writeFileSync(ι,data) }catch(e){ if (!(e.code==='ENOENT')) throw e; ensure_exists(ι,data) } }
	var open = function(ι,ifdne,f){
		ensure_exists(ι,ifdne); var Lc = new Φ(ι)["‖"]
		var fd = fs.openSync(ι,'r+'); f({
			get L(){return Lc},
			read(i,L){var t = Buffer.allocUnsafe(L); fs.readSync(fd,t,0,L,i) === L || !function(){throw Error('‽')}(); return t},
			write(ι,i){var L = fs.writeSync(fd,ι,i); Lc = max(Lc, L+i)},
			truncate(L){fs.ftruncateSync(fd,L); Lc = min(Lc,L)},
			indexOf_skipping(from,to,step,find,skip){var fl=this
				if (from<0) from += fl.L; if (to<0) to += fl.L; from = min(max(0, from ),fl.L-1); to = min(max(-1, to ),fl.L)
				if (!(step===-1 && from>to)) !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('TODO')
				var d = fl.read(to+1,from-to)
				for(var i=from;i>to;i+=step) {if (d[i-(to+1)]===find) return i; else if (chr(d[i-(to+1)]).match(skip)); else return undefined}
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
		get nlink(){return fs.statSync(this._ι).nlink },
		get mtime(){return fs.statSync(this._ι).mtime },
		get birthtime(){return fs.statSync(this._ι).birthtime },
		get url(){return encodeURI('file:'+this.root('/')) }, // ! should this be part of root
		get is_dir(){return !!catch_ι(()=> fs.statSync(this._ι).isDirectory()) },
		get name(){return path.basename(this._ι) },
		BAD_exists(){return existsSync(this._ι) },
		TMP_children(){return global["|>"](this._ι)(function Λ(ι){return φ(ι).is_dir? fs.readdirSync(ι).map(t=> ι+'/'+t)["map…"](Λ) : [ι] }) },
		TMP_parents(){ var r = [this.root('/')]; while(r[-1].φ`..`+'' !== r[-1]+'') r.push(r[-1].φ`..`); return r.slice(1) },
		root(x){switch(arguments.length){default: !function(){throw Error('‽')}()
			case 0: return this._ι[0]==='/'? '/' : '.'
			case 1: return new Φ( x==='/'? path.resolve(this._ι) : x==='.'? path.relative(x,this._ι) : !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('not yet implemented: nonstandard roots') )
			}},
		ensure_dir(){ this.φ`..`.BAD_exists() || mkdir_p(this.φ`..`+''); return this },

		// get ι(){↩},
		set ι(ι){
			if (this.is_dir) !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('TODO')
			if (ι===undefined||ι===null){ catch_union(()=> fs.unlinkSync(this._ι) ); return }
			var e = path.extname(this._ι)
			if (e==='.csv'){ this.csv = ι; return }
			if (e==='.xml'){ this.xml = ι; return }
			if (e==='.plist'){ this.plist = ι; return }
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
			if (ιs["‖"] > 1) return ιs.map(ι=> Tnum(ι)? d[ι] : d.slice(ι.re`^(\d+):$`[1]|0).join('\n')+'\n')
			else if (ιs["‖"] === 0){
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
			// : which('plutil')? npm`plist@2.1.0`.parse(shᵥ`plutil -convert xml1 -o - ${@.root('/')+''}`+'')
			: buf.slice(0,6)+''==='bplist'? ( t= φ`/tmp/plist_${random_id(25)}`, shᵥ`ζ ${'npm`bplist-parser@0.1.1`.parseFile('+js`${this.root('/')+''},λ(e,ι){ φ(${t+''}).plist = ι })`}`, t.plist )
			: npm`plist@2.1.0`.parse(this.text)
			},
		set plist(ι){ this.text = npm`plist@2.1.0`.build(ι) },
		get json_array__synchronized(){return function(...ιs){var _ι=this._ι
			if (ιs["‖"]) !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('TODO')
			var d = JSON.parse((read_file(_ι)||'[]')+'')
			return {
			push(...a){a.map(function(ι){
				d.push(ι)
				open(_ι,'[]',function(fl){
					var i = fl.indexOf_skipping(-1,-1e4,-1,ord(']'),/[ \n\t]/) || !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('bad file')
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
			ι["‖"] <= 1 || !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('not yet implemented * ** ${}',ι)
			ι = normHs(ι)
			ι = ι[0]
			ι.includes('**') && !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('not yet implemented ** ${}',ι)
			var r = ['.']
			if (ι[0]==='/') r = ['/']
			ι.split('/').forEach(function(ι){
				if (ι==='')return ;
				r = r["map…"](r=>{
					if (ι === '.') return [r]
					if (ι === '..') return [r==='.'? '..' : r.split('/').every(ι=>ι==='..')? r+'/..' : path.dirname(r)]
					return fs.readdirSync(r).filter(b=> globmatch(ι,b)).map(b=> r+'/'+b)
					})
				})
			return new Φs(r) } }
		else {var ι = ss; if (ιs["‖"] || Tarr(ι)) !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('not yet implemented'); if (ι instanceof Φs) !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('not yet implemented')}
		if (tmpl){ι = normHs(ι).map(ι=> !Tstr(ι)? ENC(ι.raw+'') : ι).join('')}
		else if (ι instanceof Φ){return head && ι._ι[0]!=='/'? new Φ(head+'/'+ι._ι) : ι}
		else {ι = (ι+'').replace(/^~(?=\/|$)/,process.env.HOME)}
		return new Φ(path.normalize(head? head+'/'+ι : ι).replace(/(?!^)\/$/,'')) }
	return φ })

//############################## personal concepts ##############################
sb._call = ()=> sb.tab.active.ι
E.p = function(ι){ var t = clipboard; return arguments.length===0? t.ι :( t.ι = ι ) }

//################################### ζ infra ###################################
_(util.inspect.styles) ['<-'] ({null:'grey',quote:'bold'})
;[process,module].map(ι=> ι.inspect = function(){return '{'+Object.getOwnPropertyNames(this).map(ι=> ι+':').join(', ')+'}' }) // ‡ hack, like the [1] * 5 thing in ζ_repl_start. clean up by: can we override builtin inspects without problems? then: defining solid inspect functions for more things. otherwise: figure out something else.
;['global','Object'].map(ι=>{
global[ι].inspect = function(d,opt){return opt.stylize(ι,'quote') }
})
// Number_toFixed ← λ(θ,ι){ θ = round(θ / 10**-ι) * 10**-ι; ↩ ι>0? θ.toFixed(ι) : θ+'' }
// E.pretty_time_num = ι=> _(new Number(ι)) <- ({inspect:λ(ˣ,opt){ P ← 20; ι←@; [ι,u] ← (ι >= P/1e3? [ι,'s'] : [ι*1e6,'μs']); ↩ opt.stylize(Number_toFixed(ι,-max(-3,floor(log10(ι/P))))+u,'number') }})
// E.pretty_time_num = ι=> Unit(ι,'s')
var Unit = (ι,u)=>{ ;var r = {ι,u} ;new Property( r,'valueOf' ).def({ value(){return this.ι } }) ;new Property( r,'inspect' ).def({ value(ˣ,opt){return util.inspect(this.ι,opt)+opt.stylize(this.u,'number') } }) ;return r }
assign_properties_in_E_informal({
'Number.prototype.inspect':function(d,opt){'use strict'; var ι = this; if(! Tprim(ι) ) return ι; return opt.stylize( Object.is(ι,-0)? '-0' : ι===Infinity? '∞' : ι===-Infinity? '-∞'
	: Number.isSafeInteger(ι)? ''+ι
	: ι.toExponential().replace('+','').replace(/(\.\d\d)\d+/,'$1').replace('e0','')
	,'number') }
,'Boolean.prototype.inspect':function(d,opt){'use strict'; return opt.stylize( this?'✓':'✗','boolean' ) }
,'Date.prototype.inspect':function(d,opt){return opt.stylize(isNaN(+this)? 'Invalid Date' : this.getUTCSeconds()!==0? this.ymdhms : this.getUTCMinutes()!==0? this.ymdhm : this.getUTCHours()!==0? this.ymdh : this.ymd, 'date')}
// ,'Function.prototype.inspect':λ(rec,ctx){t ← ζ_compile.⁻¹(@+'').replace(/^λ \(/,'λ(').match(/^.*?\)/); ↩ ctx.stylize('['+(t?t[0]:'λ ?(?)')+']', 'special')}
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
E.util_inspect_autodepth = function(ι,opt=new O1()){ opt.L || (opt.L = 1e6); var last; for(var i=1;;i++){ var r = util.inspect(ι,_({maxArrayLength:opt.L/3 |0, depth:i}) ['<-'] (opt)); if (r===last || r["‖"] > opt.L) return last===undefined? '<too large>' : last; last = r } }

E._double_dagger__repl_start = ()=> ζ_repl_start({
	// i know how to make the good repl for ct. i want to, but im tired
	prompt:'\x1b[30m\x1b[100m‡\x1b[0m ',
	compile:ι=>{var t;
		var lock = 0?0
			: ['ct','chrome_tabs','ps2','d','bookmarks']["∪"]([]).has(ι)? 'require_new(φ`~/.bashrc.ζ`).'+ι+'()'
			: (t= ι.re`^f(?: (.+))?$` )? js`go_to('path',${t[1]||'.'})`
			: ι
		lock===ι || cn.log('⛓  '+lock)
		return ζ_compile(lock) }, })
var anon_b5s81; var anon_7268v;
E.ζ_repl_start = opt=>{ opt = _({compile:ζ_compile, prompt:'\x1b[30m\x1b[42mζ\x1b[0m '}) ['<-'] (opt)
	var my_eval = code=>{ // ! can be refactored further
		var t = opt.compile(code)
		try{ t = new vm.Script(t,{ filename:'repl', displayErrors:false }) }
		catch(e){ if( e.name==='SyntaxError' ) return {parse_error:e}; e.stack = e.name+': '+e.message+'\n    at <repl>'; return {error:e} }
		try{ return {v:t.runInThisContext()} }
		catch(e){ e && Tstr(e.stack) &&( e.stack = e.stack.replace(/^([^]*)at repl:(.*)[^]*?$/,'$1at <repl:$2>') ); return {error:e} }
		}
	var q = (ι,opt=new O1())=> util_inspect_autodepth(ι,_(opt).pick('colors'))
	var promise_watch = ι=>{ if(! ι.id ){
		ι.id = b36(fromUInt32BE(new Property( (anon_b5s81||( anon_b5s81 = [0] )),'0' ).ι++))
		var hr = hrtime(); ι.then(x=>{ var x = my_inspect(x); hrtime(hr) < 5 && x["‖"] && hsᵥ`hs.alert(${`Promise #${ι.id} = ${x.slice(0,200)}`},12)` }) } }
	var my_inspect = (ι,opt=new O1())=>0?0
		: ι===undefined? ''
		: T.Promise(ι)? 0?0
			: ι.status? 'Π '+q(ι.ι,opt)
			: ι.status===undefined?( promise_watch(ι), `Π #${ι.id} { <pending> }` )
			: q(ι,opt)
		: Tarr(ι) && ι["‖"] > 1 && ι.every(t=> t===ι[0]) && _.range(ι["‖"]).every(t=> t in ι)
			? q([ι[0]],opt)+' × '+q(ι["‖"],opt)
		: q(ι,opt)
	return (f=> f.call( require('repl').start(_({useGlobal:true}) ['<-'] (_(opt).pick('prompt'))) ))(function(){
	this.In = []; this.Out = []
	var super_ = this.completer; this.completer = function(line,cb){ line.trim()===''? cb(undefined,[]) : super_.call(this,line,cb) }
	this.removeAllListeners('line').on('line',function(line){
		this.context.rl = this
		this.context.E = this.context
		if( this.bufferedCommand ){ var ι = this.history; ι.reverse(); var t = ι.pop(); ι[-1] += '\n'+t; ι.reverse() }
		var code = this.bufferedCommand+line
		var {parse_error,error,v} = my_eval(code)
		if( parse_error ){ this.bufferedCommand = code+'\n'; this.outputStream.write('    '); return }
		this.bufferedCommand = ''
		if( code ){
			φ`~/.archive_ζ`.text = φ`~/.archive_ζ`.text + JSON.stringify({time:Time(), code}) + '\n'
			this.In.push(code); this.Out.push(error || v)
			}
		if( error ) this._domain.emit('error', error.err || error)
		else{
			if( T.Promise(v) ) new Property( this.context,'__' ).def({get(){return v.status? this.__ = v.ι : v }, writable:true})
			else if( v!==undefined ) this.context.__ = v
			try{ var t = my_inspect(v,{colors:this.useColors}) }catch(e){ var t = '<repl inspect failed>:\n'+(e&&e.stack) }
			this.outputStream.write(t && t+'\n') }
		this.displayPrompt()
		})
	this.removeAllListeners('SIGINT').on('SIGINT',function(){
		var is_line = this.bufferedCommand+this.line
		this.clearLine()
		if( is_line ){ this.bufferedCommand = ''; this.displayPrompt() } else this.close()
		})
	delete this.context._; this.context._ = _
	return this
	}) }

//#################################### main #####################################
var sh_ify = ι=>{var t; return Π( 0?0
	: T.Promise(ι)? ι.then(sh_ify.X)
	: ι===undefined? new O1()
	: Tstr(ι)? {out:ι}
	: T.boolean(ι)? {code:ι?0:1}
	: (t=catch_union(()=> JSON.stringify(ι)), !T.Error(t))? {out:t}
	: {out:ι+''} )}
var eval_ = function __53gt7j(ι){
	try{
		try{ new vm.Script(ι); return (0,eval)(ι) }catch(e){ if(!( e.name==='SyntaxError' && e.message==='Illegal return statement' )) throw e; return (0,eval)('(()=>{'+ι+'})()') }
	}catch(e){ e!==undefined && e!==null && Tstr(e.stack) && (e.stack = e.stack.replace(/    at __53gt7j[^]*/,'    at <eval>')); throw e }
	}
E.ζ_main = ({a})=>{var ι;
	a[0]==='--fresh' && a.shift()
	if( !a["‖"] ) ζ_repl_start()
	else if( ι=a[0], φ(ι).BAD_exists() || ι.re`^\.?/` ){ process.argv = [process.argv[0],...a]; var t = φ(ι).root('/')+''; var o=Module._cache;var m=Module._resolveFilename(t,undefined,true);var oι=o[m]; o[m] = undefined; Module._load(t,undefined,true); o[m] = oι }
	else {
		global.require = require; global.code = a.shift(); global.a = a; [global.a0,global.a1] = a; global.ι = a[0]
		code = code.replace(/;\s*$/,'; ∅')
		sh_ify(eval_(ζ_compile(code)))
			.then(ι=>{ ι.out && process.stdout.write(ι.out); ι.code &&( process.exitCode = ι.code ) })
		}
	}
if_main_do((...a)=>ζ_main({a}))
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
	:executable         ,/^#!/ | try{fs.accessSync(ι,fs.X_OK); ↩ ✓} catch(e){↩ ✗}
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
scratch/scratch.txt:107:φ`**`.map(ι=> [ι+'',ι.get()])._.groupBy(1)._.values().map(ι=> ι._.map(0)).filter(ι=> ι.‖ > 1)
scratch/sublime/index.ζ:60:	φ(arg.in).φ`**`.filter(ι=> !ι.dir()).map(λ(ι){ι+=''; t←; ι = ι.slice(arg.in.‖).replace(/^\//,'')
scratch/sublime/index.ζ:66:	out ← φ(arg.out).φ`**`.filter(λ(ι){ι+=''; ↩ roots.some(λ(r){↩ ι.indexOf(r) === 0})}).filter(ι=> !ι.dir()).map(ι=> ι+'')
*/

// i'd like that to be #!/usr/bin/env node --max_old_space_size=10000 
