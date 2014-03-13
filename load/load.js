#!/usr/bin/env node
//__literal__('#!/usr/bin/env node')

var fs = require('fs')
var _ = require('../lib/underscore-min')


var __sub__ = function λ(v,b,c){return v[b]}
var __slice__ = function λ(a,b){return b===undefined? v.slice(a) : (v.slice(a,b))}
var __sliceλ__ = function λ(a,b){return b===undefined? function λ(v,b,c){return v.slice(a)} : function λ(v,b,c){return v.slice(a,b)}}



var print = console.log.bind(console)
var memoize_o = function λ(o,f){return function λ(v){var r = own(o,v); return r === undefined? (o[v] = f(v)) : r}}
var merge_o = function λ(a,b){for (k in b) a[k] = b[k]; return a}
Object.map = function λ(v,f){var f = f || function λ(v,b,c){return [v,b]}; var r = {}; Object.keys(v).forEach(function λ(k){var t = f.call(v, k, v[k]); if (t) r[t[0]] = t[1]}); return r}
Object.mapv = function λ(v,f){var f = f || function λ(v,b,c){return [v,true]}; var r = {}; v.forEach(function λ(v){var t = f(v); if (t) r[t[0]] = t[1]}); return r}
var now = function λ(v,b,c){return Date.now() / 1000}
var run = {
in: function λ(s,f){return {id:setTimeout( f,s*1000), cancel:function λ(v,b,c){return cancelTimeout( this.id)}}},
every:function λ(s,f){return {id:setInterval(f,s*1000), cancel:function λ(v,b,c){return cancelInterval(this.id)}}},
tomorrow:function λ(f){
var start = new Date()
var cancel = false
var r = run.in(new Date(start).setHours(24,0,0,0)/1000 - start/1000,
function λ(){if (new Date().getDate() === start.getDate()) run.in(1,λ); else {if (!cancel) f()}})
return {cancel:function λ(){cancel = true; r.cancel()}}}}

var ord = function λ(v,b,c){return v.charCodeAt(0)}
var chr = function λ(v,b,c){return String.fromCharCode(v)}
var seq = function λ(v,b,c){return typeof v === 'string'? v.split('') : v}
var extend_function = function λ(f){var r = function λ(){var r = f(); r.__proto__ = λ.prototype; return r}; r.prototype.__proto__ = Function.prototype; return r}
var own = function λ(o,m){if (Object.prototype.hasOwnProperty.call(o,m)) return o[m]}
var delset = function λ(o,m,v){if (v === undefined) delete o[m]; else o[m] = v}
String.prototype.repeat = function λ(v,b,c){return new Array(v+1).join(this)}

var windows = function λ(n,l){var r = []; while (l.length >= n){r.push(l.slice(0,n)); l = l.slice(1)} return r}
var err = function λ(v){throw Error(v)}



var pad_left = function λ(v,s,l){while (v.length < l) v = s + v; return v}
var hex = function λ(v,l){return pad_left(v.toString(16),'0',l)}
var js_valid_symbol = new (function λ(){
var _short = {' ':'_', '!':'1', '#':'3', '%':'5', '&':'7', '(':'9', ')':'0', '*':'8', '+':'p', ',':'C', '-':'m', '.':'d', '/':'s', ':':'c', '=':'E', '?':'q', '@':'2', '[':'L', '\\':'b', '^':'6', '`':'k', '{':'B', '|':'o', '~':'t', '\u2026':'r', '\u2190':'w', '\u2192':'e', '\u00ac':'n', '\u2200':'A', '\u2260':'N', '\u01c2':'\u01c2', '<':'lt', '\u2264':'le', '>':'gt', '\u2265':'ge'}
var encode_short = Object.map(_short,function λ(v,b,c){return [v,'\u01c2'+b]})
var decode_short = Object.map(_short,function λ(v,b,c){return [b,v]})
var is_start = memoize_o(Object.mapv(seq(';\u01c2 \t\n\u000b\u000c\u000d'),function λ(v,b,c){return [v,false]}),function λ(v){try {eval('var '+v )} catch (e){return false} return true})
var is_part = memoize_o(Object.mapv(seq(';\u01c2 \t\n\u000b\u000c\u000d'),function λ(v,b,c){return [v,false]}),function λ(v){try {eval('var a'+v)} catch (e){return false} return true})
var encode_char = memoize_o(encode_short, function λ(v){return is_part(v)? v : '\u01c2u'+hex(ord(v),4)})

var keywords = ['break','do','instanceof','typeof','case','else','new','var','catch','finally','return','void','continue','for','switch','while','debugger','function','this','with','default','if','throw','delete','in','try','class','enum','extends','super','const','export','import','implements','let','private','public','yield','interface','package','protected','static']
var encode_keywords = merge_o(Object.mapv(keywords,function λ(v,b,c){return [v,'_'+v]}), Object.mapv(keywords,function λ(v,b,c){return ['_'+v,'\u01c2_'+v]}))
var decode_keywords = Object.map(encode_keywords,function λ(v,b,c){return [b,v]})

this.is_part = is_part
this.encode = memoize_o(encode_keywords,function λ(v){var r = seq(v).map(encode_char).join(''); return is_start(r[0])? r : '\u01c2'+r})
this.decode = memoize_o(decode_keywords,function λ(v){
var v = v[0]==='\u01c2'? v.slice(1) : v
var r = ''; var i=null; while ((i=v.indexOf('\u01c2')) !== -1){
r += v.slice(0,i); v = v.slice(i+1)
if (v[0]==='u'){r += chr(parseInt(v.slice(1,5),16)); v = v.slice(5)}
else if (v[0]==='l' || v[0]==='g'){r += decode_short[v.slice(0,2)]; v = v.slice(2)}
else {r += decode_short[v[0]]; v = v.slice(1)}}
return r+v})})


var super_sub_table = '\u20800\u2070 \u20811\u00b9 \u20822\u00b2 \u20833\u00b3 \u20844\u2074 \u20855\u2075 \u20866\u2076 \u20877\u2077 \u20888\u2078 \u20899\u2079 \u208a+\u207a \u208b-\u207b \u208c=\u207c \u208d(\u207d \u208e)\u207e ₐaᵃ -bᵇ -cᶜ -dᵈ ₑeᵉ -fᶠ -gᵍ ₕhʰ ᵢiⁱ ⱼjʲ ₖkᵏ ₗlˡ ₘmᵐ ₙnⁿ ₒoᵒ ₚpᵖ ᵣrʳ ₛsˢ ₜtᵗ ᵤuᵘ ᵥvᵛ -wʷ ₓxˣ -yʸ -zᶻ -Aᴬ -Bᴮ -Dᴰ -Eᴱ -Gᴳ -Hᴴ -Iᴵ -Jᴶ -Kᴷ -Lᴸ -Mᴹ -Nᴺ -Oᴼ -Pᴾ -Rᴿ -Tᵀ -Uᵁ -Vⱽ -Wᵂ'.split(' ')
var unicode = {
subscripts: super_sub_table.map(function λ(v,b,c){return v[0]}).filter(function λ(v,b,c){return v!=='-'}),
midscripts: super_sub_table.map(function λ(v,b,c){return v[1]}).filter(function λ(v,b,c){return v!=='-'}),
superscripts: super_sub_table.map(function λ(v,b,c){return v[2]}).filter(function λ(v,b,c){return v!=='-'}),
subscript: function λ(f){return function λ(v,b,c){return seq(v).map(function λ(v,b,c){return f[v]}).join('')}}(Object.mapv([].concat.apply([],super_sub_table.map(function λ(v,b,c){return [[v[1],v[0]],[v[2],v[0]]]})),function λ(v,b,c){return v})),
midscript: function λ(f){return function λ(v,b,c){return seq(v).map(function λ(v,b,c){return f[v]}).join('')}}(Object.mapv([].concat.apply([],super_sub_table.map(function λ(v,b,c){return [[v[0],v[1]],[v[2],v[1]]]})),function λ(v,b,c){return v})),
superscript: function λ(f){return function λ(v,b,c){return seq(v).map(function λ(v,b,c){return f[v]}).join('')}}(Object.mapv([].concat.apply([],super_sub_table.map(function λ(v,b,c){return [[v[0],v[2]],[v[1],v[2]]]})),function λ(v,b,c){return v}))}




var Symbol = function λ(v,line){this.v = v; if (line) this.line = line}
Symbol.prototype.space = function λ(v,b,c){return (this.space_before?'_':'')+'$'+(this.space_after?'_':'')}
Symbol.prototype.space_before = true
Symbol.prototype.space_after = true
Symbol.prototype.inspect = function λ(v,b,c){return '`'+this.v}
Symbol.prototype.with_v = function λ(v){var r = new Symbol(v,this.line); if (!this.space_before) r.space_before === false; if (!this.space_after) r.space_after === false; return r}
var S = function λ(v){var r = new Symbol(v.replace(/^ /,'').replace(/ $/,'')); if (v[0]!==' ') r.space_before = false; if (v.slice(-1)[0]!==' ') r.space_after = false; return r}
var SP = {}
var Call = function λ(){this.push.apply(this,arguments)}
Call.prototype = new Array()
var Ca = function λ(){var F = function λ(v,b,c){return Call.apply(this,v)}; F.prototype = Call.prototype; return function λ(v,b,c){return new F(v)}}()


var js_valid_symbol_encode = function λ(v,b,c){return own({'=':'===','\u2190!':'=','\u2190':'=','\u2260':'!==','\u2264':'<=','\u2265':'>=','\u00ac':'!','\u208b\u2081':'.slice(-1)[0]','\u2080':'[0]','\u2081':'[1]','\u2082':'[2]','\u2083':'[3]','ᵥ':'[v]','ᵢ':'[i]','ₖ':'[k]','ₘ':'[m]','isa':'instanceof'},v) || (own(Object.mapv('< > , . : ; + - * / % || && ? += ++ if else for return in new typeof delete try catch while this instanceof switch case throw break continue'.split(' ')),v)?v:null) || (v.match(/^\d/)?v:null) || js_valid_symbol.encode(v)}
var split_symbol = function λ(l,s){var r = [[]]; l.map(function λ(v){if (v instanceof Symbol && v.v === s) r.push([]); else r.slice(-1)[0].push(v)}); return r}
var has_sym = function λ(v,s){return v.some(function λ(v,b,c){return v instanceof Symbol && v.v===s})}
var split_slice = function λ(l){var r = split_symbol(l,':'); var r = [(r[0].length === 0? [S('0')] : r[0])].concat(r.slice(1)); return r[1].length === 0? r.slice(0,1) : r}
var ran_as = process.argv[1].match(/[^\\]*\\[^\\]*$/)[0]
var pr = function λ(){if (ran_as === 'bin\\load.js') print.apply(this,['##'].concat(Array.prototype.slice.apply(arguments))); return arguments[0]}
Array.prototype.map2 = function λ(f){var r = []; if (this.length===0) return r; for (var i=0;i<this.length-1;i++) r.push(f(this[i],this[i+1])); r.push(f(this.slice(-1)[0],null)); return r}

var printable = function λ(v,b,c){return (0x20<=ord(v) && ord(v)<0x7f) || js_valid_symbol.is_part(v)}

var repr_js = function λ(v,line,next){var mrj = function λ(v,b,c){return v.map2(function λ(v,b,c){return repr_js(v,line,b)}).join('')}
return v instanceof Symbol? (v.line && line? '\n'.repeat(function λ(v){line[0] += v; return v}(Math.max(0, v.line-line[0]))) : '') + (
v.space_before?' ':'') + (
next instanceof Symbol && next.v==='\u2190'? 'var ' : '') + ((
v.v==='λ' && (next instanceof Array && next[0].v==='('))? 'function λ' : (
v.v==='λ' && (next instanceof Array && next[0].v==='{'))? function λ(r){next.splice(1,0,S('return ')); return r}('function λ'+'(v,b,c)') :
js_valid_symbol_encode(v.v))
+ (
v.space_after && !(next instanceof Symbol && next.space_before)?' ':'') :
v instanceof Array?
v[0].v==='[' && !v[0].space_before && has_sym(v,':')? '.slice('
+split_slice(v.slice(1)).map(mrj).join(',')+')' :
v[0].v + mrj(v.slice(1)) + groups[v[0].v] :
typeof v === 'string'? (v.match(/'/g)||[]).length <= (v.match(/"/g)||[]).length? "'"
+seq(v).map(function λ(v,b,c){return {"'":"\\'",'\n':'\\n','\t':'\\t','\\':'\\\\'}[v] || (printable(v)? v : '\\u'+hex(ord(v),4))}).join('')+"'" : '"'
+seq(v).map(function λ(v,b,c){return {'"':'\\"','\n':'\\n','\t':'\\t','\\':'\\\\'}[v] || (printable(v)? v : '\\u'+hex(ord(v),4))}).join('')+'"' :
v instanceof RegExp? v+'' : '<what:'
+v+'>'}
var repr_js_file = function λ(forms){var mrj = function λ(v,b,c){return v.map2(function λ(v,b,c){return repr_js(v,line,b)}).join('')}
var line = [1]
return '#!/usr/bin/env node\n'+mrj(forms).replace(/^ /gm,'').replace(/^(.*)\n/,'//$1')}


var string_reader = function λ(start,s,line){
var r = ''
for (;;){
var c = s[0]; s = slice_eof(s,1)
if (c === start) return [r,s,line]
if (c === '\\'){
var c = s[0]; s = slice_eof(s,1)
switch (c){
case "'": case '"': case '\\': r += c; break
case 'n': r += '\n'; break
case 't': r += '\t'; break
case 'x': r += chr(parseInt(s.slice(0,2),16)); s = slice_eof(s,2); break
case 'u': r += chr(parseInt(s.slice(0,4),16)); s = slice_eof(s,4); break
_default: r += '\\'+c; break }}

else if (c === '\n'){line++; if (r !== '') r += '\n'}
else r += c }}

var slice_eof = function λ(s,l){if (s.length < l) err('EOF while reading string'); return s.slice(l)}
var regex_reader = function λ(start,s,line){
var t = s.match(/^((?:[^\/\\\[]|(?:\\.)|\[(?:[^\\\]]|(?:\\.))*\])*\/[a-z]*)/) || err('could not match regex: '+start+s.slice(0,10))
return [eval('/'+t[1]),s.slice(t[1].length),line]}

var reader_or = extend_function(function λ(v,b,c){return function λ(start,s,line){
return (λ[s[0]]? λ[s[0]](start+s[0],s.slice(1),line) : null) || (λ['']? λ[''](start,s,line) : null)}})
reader_or.prototype.get = function λ(s){return this[s[0]]? (this[s[0]] instanceof reader_or? this[s[0]].get(s.slice(1)) : this[s[0]]) : null}
reader_or.prototype.set = function λ(ss,r){
seq(ss).map(function λ(s){
var c = s===''? '' : s[0]; var s = s.slice(1)
if (s !== '')(this[c] instanceof reader_or? this[c] : this[c] = new reader_or().set([''],own(this,c))).set([s],r)
else delset(this,c,r)}
.bind(this)); return this}
var reader_macros = new reader_or()
var groups = {}
var anyfix_macros = {}; var anyfix_macros_set = function λ(ss,f){ss.map(function λ(s){
if (typeof s === 'string' && f === undefined) delete anyfix_macros[s]
else if (typeof s === 'string' && f !== undefined) anyfix_macros[s] = {'_$_':f,'$_':f,'_$':f,'$':f}
else if (typeof s !== 'string' && f === undefined) delete anyfix_macros[s.v][s.space()]
else if (typeof s !== 'string' && f !== undefined){if (!own(anyfix_macros,s.v)) anyfix_macros[s.v] = {}; anyfix_macros[s.v][s.space()] = f}})}

var lex = function λ(s){var r = []; var line = 1; while (s !== ''){var form = reader_macros('',s,line); r.push(form[0]); s = form[1]; line = form[2]} return r}
var group = function λ(g,l){
if (l === undefined){var r = group(S('{'),g.concat([S('}')])); if (r[1].length > 0) err(); return r[0].slice(1)}
else {
var e = groups[g.v]
var r = [g]; for (;;){
if (l.length === 0) err('unfinished group'+repr_js(r))
if (l[0] instanceof Symbol && l[0].v === e) return [r,l.slice(1)]
while (l[0] instanceof Symbol && own(groups,l[0].v)){var t = group(l[0],l.slice(1)); r.push(t[0]); l = t[1]}
if (l[0] instanceof Symbol && l[0].v === e) return [r,l.slice(1)]
r.push(l[0]); l = l.slice(1)}}}

var anyfix_macro_eval = function λ(forms){var r = []; while (forms.length > 0){var t = anyfix_macro_eval_1(r,forms); r = t[0]; forms = t[1]} return r}
var anyfix_macro_eval_n = function λ(n,forms){var r = []; while (forms.length > 0 && r.length < n){var t = anyfix_macro_eval_1(r,forms); r = t[0]; forms = t[1]} return [r,forms]}
var anyfix_macro_eval_1 = function λ(r,forms){
var l = r.length
while (forms.length > 0 && r.length < l+1){
var v = forms[0]; forms = forms.slice(1)

if (v instanceof Array){
var t = anyfix_macros[v[0].v][v[0].space()](r.slice(-1)[0],v[0],[anyfix_macro_eval(v.slice(1))].concat(forms))
r = r.slice(0,-1).concat(t[0]); forms = t[1] }
else if (v instanceof Symbol && own(anyfix_macros,v.v)){
var t = anyfix_macros[v.v][v.space()](r.slice(-1)[0],v,forms)
r = r.slice(0,-1).concat(t[0]); forms = t[1] }
else r.push(v)}
return [r,forms]}

reader_macros.set([''], function λ(_,s,l){
var is = js_valid_symbol.is_part(s[0])
var r = ''; while (s !== '' && !reader_macros.get(s) && js_valid_symbol.is_part(s[0]) === is){r += s[0]; s = s.slice(1)}
return [new Symbol(r,l),s,l]})
reader_macros.set([].concat(seq('()[]{}\u2039\u203a.`~?:;,'),['~@'],unicode.subscripts,unicode.subscripts.map(function λ(v,b,c){return '\u208b'+v})), function λ(v,b,c){return [new Symbol(v,c),b,c]})
reader_macros.set(' \t\u000c\u000d', function λ(v,b,c){return [SP,b,c]})
reader_macros.set('\n', function λ(v,b,c){return [SP,b,c+1]})
reader_macros.set(['//'], function λ(v,b,c){return [SP,b.replace(/^.*/,''),c]})
reader_macros.set(['/*'], function λ(_,s,l){var t = s.match(/^[^]*?\*\//)[0]; return [SP,s.slice(t.length),l+t.match(/\n/g).length]})
reader_macros.set('\'"', string_reader)
reader_macros.set(['~/'], regex_reader)

;['()','[]','{}','\u2039\u203a'].map(function λ(v,b,c){return groups[v[0]] = v[1]})



;(function λ(){
var vector = function λ(v,sym,rest){return [(v===undefined?[]:[v]).concat([(has_sym(rest[0],':')? Ca([S('__sliceλ__')].concat(split_slice(rest[0]))) : rest[0])]),rest.slice(1)]}
var block = function λ(v,sym,rest){return [(v===undefined?[]:[v]).concat([Ca([S('__do__')].concat(rest[0]))]),rest.slice(1)]}
anyfix_macros_set(['['], vector)
anyfix_macros_set([S('['),S('[ ')], function λ(v,sym,rest){return v===undefined? vector(v,sym,rest) : [(
has_sym(rest[0],':')? [
Ca([S('__slice__'),v].concat(split_slice(rest[0])))] : [
Ca([S('__sub__'),v].concat(rest[0]))])
,rest.slice(1)]})
anyfix_macros_set(['('],block)
anyfix_macros_set([S('('),S('( ')], function λ(v,sym,rest){return v===undefined? block(v,sym,rest) : [[Ca([v].concat(rest[0]))],rest.slice(1)]})})()

anyfix_macros_set(['{'], function λ(v,sym,rest){
return [(v===undefined?[]:[v]).concat([(has_sym(rest[0],':')?
Object.mapv(windows(2,split_symbol(rest[0],':')),function λ(v,b,c){return [v[0].slice(-1)[0].v,v[1][0]]}) :
Ca([S('__do__')].concat(rest[0])))]),rest.slice(1)]})
anyfix_macros_set(['\u2039'], function λ(v,sym,rest){err('\u2039\u203a not implemented')})
anyfix_macros_set(['.'], function λ(v,sym,rest){return [[Ca([sym,v||(pr(v,rest), err('bad .')),rest[0]])],rest.slice(1)]})
anyfix_macros_set([';',','], function λ(v,sym,rest){var t = anyfix_macro_eval_n(1,rest); return [[v].concat(t[0]),t[1]]})
anyfix_macros_set(['?'], function λ(v,sym,rest){
var t = anyfix_macro_eval_n(3,rest)
pr(t)
if (t[0].length !== 3 || !(t[0][1] instanceof Symbol && t[0][1].v === ':')) err('bad ?:')
return [Ca([sym.with_v('__if__'),v,t[0][0],t[0][2]]),t[1]]})









anyfix_macros_set(unicode.subscripts.concat(unicode.subscripts.map(function λ(v,b,c){return '\u208b'+v})),
function λ(v,sym,rest){return [[Ca([S('__sub__'),v,sym.with_v(unicode.midscript(sym.v))])],rest]})




var read = function λ(s){
var r = [SP];
var t=null; if (t = s.match(/^#!.*/)){r.push(S('__literal__'),S('('),t[0],S(')')); s = s.slice(t[0].length)}
var r = r.concat(lex(s)); r.push(SP)
for (var i=1;i<r.length-1;i++) if (r[i] instanceof Symbol){
if (r[i-1] !== SP) r[i].space_before = false
if (r[i+1] !== SP) r[i].space_after = false }
var r = r.filter(function λ(v,b,c){return v !== SP})
var r = group(r)

return r}

var compile_f = function λ(ǂ_in,out){fs.writeFileSync(out,repr_js_file(read(fs.readFileSync(ǂ_in).toString())))}

compile_f(process.argv[2].replace('.a','.α'),process.argv[3])

print('--- ran as:',ran_as,'---')