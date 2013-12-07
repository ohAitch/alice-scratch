//===--------------------------------------------===// greenspuns //===--------------------------------------------===//
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////  THE FOLLOWING MATERIAL IS DUPLICATED ELSEWHERE  /////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

function overload(){var fns = dict_by(m('length'),arguments); return function(){return fns[arguments.length].apply(this,arguments)}}
function bind(root,member){return root[member].bind(root)}
function argslice(args,i){return Array.prototype.slice.apply(args).slice(i)}
function m(m){var args = argslice(arguments,1); // m('member',args) → function(v){return v.member(args)}
	return args.length === 0? function(v){var r = v[m]; return r instanceof Function? r.call(v) : r}
	:      args.length === 1? function(v){var r = v[m]; return r instanceof Function? r.call(v,args[0]) : (v[m]=args[0])}
	:                        function(v){return v[m].apply(v,args)}}
Function.prototype.cmp = function(f){var t = this; return function(){return t.call(this,f.apply(this,arguments))}}
function not(v){return !v}
function is(a,b){return a === b}
var def = function(f){this[f.name] = f}.bind(this)
function dict_by(f,sq){var r = {}; for(var i=0;i<sq.length;i++) r[f(sq[i])] = sq[i]; return r}

function isa(clas){return function(v){return v instanceof clas}} // should probably just use cmp

var sub = overload(
	function(v,i){return v[i<0? i+v.length : i]},
	function(i){return function(v){return sub(v,i)}})

//===--------------------------------------------===// misc utils //===--------------------------------------------===//

var print = bind(console,'log')
var rand = Math.random
function sum(v){var r = 0; for (var i=0;i<v.length;i++) r += v[i]; return r}
function putE(a,b){for (v in b) a[v]=b[v]; return a} // would be 'put=' if it could be
function sign(v){return v? (v < 0? -1 : 1) : 0}

function any(vs){for (var i=0;i<vs.length;i++) if (vs[i]) return true; return false}

function rand_nth(vs){return vs.length === 0? undefined : vs[Math.floor(rand()*vs.length)]}
var rand_i_i = overload(function(a,b){return Math.floor(rand()*(b+1 - a)) + a}, function(ab){return rand_i_i(ab[0],ab[1])})
var rand_i   = overload(function(a,b){return Math.floor(rand()*(b   - a)) + a}, function(ab){return rand_i  (ab[0],ab[1])})
function rand_weighted(v){
	var total = sum(v.map(sub(0)))
	if (total === 0) return undefined
	var i = rand_i(0,total)
	for (var j=0;j<v.length;j++) {
		i -= v[j][0]
		if (i < 0) return v[j][1]
	}
	throw "wut"}


//===--------------------------------------------===// misc mathy utils //===--------------------------------------------===//

var min = Math.min
var max = Math.max
Math.TAU = Math.PI*2
function polar(r,t){return [r*Math.cos(t), r*Math.sin(t)]}

function coercing_arith_v(f){return function(v){
	if (v instanceof Array) {var r = []; for (var i=0;i<this.length;i++) r.push(f(this[i],v[i])); return r}
	else return this.map(function(w){return f(w,v)})}}
putE(Array.prototype,{
	add:coercing_arith_v(function(a,b){return a+b}),
	sub:coercing_arith_v(function(a,b){return a-b}),
	mul:coercing_arith_v(function(a,b){return a*b}),
	div:coercing_arith_v(function(a,b){return a/b}),
	mod:coercing_arith_v(function(a,b){return a%b}),
	min:coercing_arith_v(function(a,b){return min(a,b)}),
	max:coercing_arith_v(function(a,b){return max(a,b)}),
	abs:function(){return Math.sqrt(sum(this.mul(this)))},
	sum:function(){
		if (this.length === 0) return 0
		var r = this[0]
		if (r instanceof Array) for (var i=1;i<this.length;i++) r = r.add(this[i])
		else                    for (var i=1;i<this.length;i++) r += this[i]
		return r},
	sign:function(){return this.map(sign)},
	norm:function(){var t = this.abs(); return t === 0? this : this.div(t)},
	})

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////////////  END DUPLICATE SECTION  /////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//===--------------------------------------------===// main //===--------------------------------------------===//

var uppercase = {'a':'ᵃ', 'b':'ᵇ', 'c':'ᶜ', 'd':'ᵈ', 'e':'ᵉ', 'f':'ᶠ', 'g':'ᵍ', 'h':'ʰ', 'i':'ⁱ', 'j':'ʲ', 'k':'ᵏ', 'l':'ˡ', 'm':'ᵐ', 'n':'ⁿ', 'o':'ᵒ', 'p':'ᵖ', 'q':'q', 'r':'ʳ', 's':'ˢ', 't':'ᵗ', 'u':'ᵘ', 'v':'ᵛ', 'w':'ʷ', 'x':'ˣ', 'y':'ʸ', 'z':'ᶻ', 'A':'ᴬ', 'B':'ᴮ', 'C':'ᶜ', 'D':'ᴰ', 'E':'ᴱ', 'F':'ᶠ', 'G':'ᴳ', 'H':'ᴴ', 'I':'ᴵ', 'J':'ᴶ', 'K':'ᴷ', 'L':'ᴸ', 'M':'ᴹ', 'N':'ᴺ', 'O':'ᴼ', 'P':'ᴾ', 'Q':'Q', 'R':'ᴿ', 'S':'ˢ', 'T':'ᵀ', 'U':'ᵁ', 'V':'ⱽ', 'W':'ᵂ', 'X':'ˣ', 'Y':'ʸ', 'Z':'ᶻ', '0':'⁰', '1':'¹', '2':'²', '3':'³', '4':'⁴', '5':'⁵', '6':'⁶', '7':'⁷', '8':'⁸', '9':'⁹', '+':'⁺', '-':'⁻', '=':'⁼', '(':'⁽', ')':'⁾', 'Α':'ᴬ', 'α':'ᵅ', 'Β':'ᴮ', 'β':'ᵝ', 'Γ':'ᵞ', 'γ':'ᵞ', 'Δ':'ᵟ', 'δ':'ᵟ', 'Ε':'ᴱ', 'ε':'ᵋ', 'Ζ':'ᶻ', 'ζ':'ᶻ', 'Η':'ᴴ', 'η':'ʰ', 'Θ':'ᶿ', 'θ':'ᶿ', 'Ι':'ᴵ', 'ι':'ᶥ', 'Κ':'ᴷ', 'κ':'ᵏ', 'Λ':'ᴸ', 'λ':'ˡ', 'Μ':'ᴹ', 'μ':'ᵐ', 'Ν':'ᴺ', 'ν':'ⁿ', 'Ξ':'ˣ', 'ξ':'ˣ', 'Ο':'ᴼ', 'ο':'ᵒ', 'Π':'ᴾ', 'π':'ᵖ', 'Ρ':'ᴿ', 'ρ':'ᴿ', 'Σ':'ˢ', 'σ':'ˢ', 'Τ':'ᵀ', 'τ':'ᵗ', 'Υ':'ᵁ', 'υ':'ᵘ', 'Φ':'ᶲ', 'φ':'ᶲ', 'Χ':'ᵡ', 'χ':'ᵡ', 'Ψ':'ᵠ', 'ψ':'ᵠ', 'Ω':'ᴼ', 'ω':'ᴼ'}
var lowercase = {'a':'ₐ', 'b':'ᵦ', 'e':'ₑ', 'h':'ₕ', 'i':'ᵢ', 'j':'ⱼ', 'k':'ₖ', 'l':'ₗ', 'm':'ₘ', 'n':'ₙ', 'o':'ₒ', 'p':'ₚ', 'r':'ᵣ', 's':'ₛ', 't':'ₜ', 'u':'ᵤ', 'v':'ᵥ', 'x':'ₓ', 'y':'ᵧ', 'A':'ₐ', 'B':'ᵦ', 'E':'ₑ', 'H':'ₕ', 'I':'ᵢ', 'J':'ⱼ', 'K':'ₖ', 'L':'ₗ', 'M':'ₘ', 'N':'ₙ', 'O':'ₒ', 'P':'ₚ', 'R':'ᵣ', 'S':'ₛ', 'T':'ₜ', 'U':'ᵤ', 'V':'ᵥ', 'X':'ₓ', 'Y':'ᵧ', '0':'₀', '1':'₁', '2':'₂', '3':'₃', '4':'₄', '5':'₅', '6':'₆', '7':'₇', '8':'₈', '9':'₉', '+':'₊', '-':'₋', '=':'₌', '(':'₍', ')':'₎', 'Α':'ₐ', 'α':'ₐ', 'Β':'ᵦ', 'β':'ᵦ', 'Γ':'ᵧ', 'γ':'ᵧ', 'Ε':'ₑ', 'ε':'ₑ', 'Η':'ₕ', 'η':'ₕ', 'Θ':'ₜ', 'θ':'ₜ', 'Ι':'ᵢ', 'ι':'ᵢ', 'Κ':'ₖ', 'κ':'ₖ', 'Λ':'ₗ', 'λ':'ₗ', 'Μ':'ₘ', 'μ':'ₘ', 'Ν':'ₙ', 'ν':'ₙ', 'Ξ':'ₓ', 'ξ':'ₓ', 'Ο':'ₒ', 'ο':'ₒ', 'Π':'ₚ', 'π':'ₚ', 'Ρ':'ᵨ', 'ρ':'ᵨ', 'Σ':'ₛ', 'σ':'ₛ', 'Τ':'ₜ', 'τ':'ₜ', 'Υ':'ᵤ', 'υ':'ᵤ', 'Χ':'ᵪ', 'χ':'ᵪ', 'Ψ':'ᵩ', 'ψ':'ᵩ', 'Ω':'ₒ', 'ω':'ₒ'}

// automatic copy ?

function zalgify_textarea() {document.f.zalgy.value = zalgify(document.f.original.value)}

function zalgify(v) {
	var upper = true
	return v.split(' ').map(function(v){var t = zalgify_word(v,upper); upper = !t[1]; return t[0]}).join(' ')}

function zalgify_word(v, upper) {
	return [v.split('').map(function(v){return (upper = !!(!upper && lowercase[v]))? lowercase[v] : uppercase[v] || v}).join(''), !upper]}