//X // this would be so fun to optimize
//X // ok, i grok this now, & i see how i'd need to do various things b4 it's optimizeable. let's do this! later. yay grokking parser combinators :)
//X // well, first i'd need a js parser

// __lazy ← ι=> P2({ type:'lazy', ι, _(stream,i){ ↩ @.ι._(stream,i) }, })
var __lazy = ι=> P2({
	type:'lazy',
	ι,
	_(stream,i){ var t = this.ι(); delete this.type; delete this.ι; delete this._; _(this).assign(t); return this._(stream,i) },
	})
var __match_string = ι=> P2({
	type:'match_string',
	ι,
	_(stream,i){ var head = stream.slice(i,i+this.ι.length); return head===this.ι? make_win(i+this.ι.length,head) : make_lose(i,this.ι) },
	})
var __match = (ι,group)=> P2({
	type:'match',
	re: RegExp(ι.source,ι.flags.replace(/[^imu]/g,'')+'y'),
	group,
	_(stream,i){ var t = this.re.exec_at(stream,i); return t && !(t[this.group]===null||t[this.group]===undefined)? make_win(i+t[0].length, t[this.group]) : make_lose(i,this.re+'') },
	})
var __seq = ps=> P2({
	type:'seq',
	ps,
	_(stream,i){var r;
		var accum = []
		for (var j=0;j<this.ps.length;j++){var p=this.ps[j];  r = merge_replies(p._(stream,i), r); if (!r.status) return r; accum.push(r.value); i = r.index  }
		return merge_replies(make_win(i,accum), r) },
	})
var __alt = ps=> P2({
	type:'alt',
	ps,
	_(stream,i){var r;
		for (var j=0;j<this.ps.length;j++){var p=this.ps[j];  r = merge_replies(p._(stream,i), r); if (r.status) return r  }
		return r },
	})
var __times = (p,min,max)=> P2({
	type:'times',
	p,
	min,
	max,
		_(stream,i){
		var accum = []
		var r;
		var prev_r;

		for (var times = 0; times < this.min; times += 1){
			r = this.p._(stream,i)
			prev_r = merge_replies(r,prev_r)
			if (r.status){ i = r.index; accum.push(r.value) }
			else return prev_r
			}
		for (; times < this.max; times += 1){
			r = this.p._(stream,i)
			prev_r = merge_replies(r,prev_r)
			if (r.status){ i = r.index; accum.push(r.value) }
			else break
			}
		return merge_replies(make_win(i,accum), prev_r)
		},
	})
var __map    = (p,f)=> P2({ type:'map', p, f, _(stream,i){ var r = this.p._(stream,i); if (r.status) r.value = this.f(r.value); return r }, })
var __map_js = (p,f)=> P2({ type:'map_js', p, f, _(stream,i){ var r = this.p._(stream,i); if (r.status) r.value = this.f(r.value,[i,r.index],stream); return r }, })
var __chain = (p,f)=> P2({ type:'chain', p, f, _(stream,i){ var r = this.p._(stream,i); return !r.status? r : merge_replies(this.f(r.value)._(stream,r.index), r) }, })
var __of = ι=> P2({ type:'of', ι, _(stream,i){return make_win(i,this.ι) }, })
var __fail = expected=> P2({ type:'fail', expected, _(stream,i){return make_lose(i,this.expected) }, })
var __eof = ()=> P2({ type:'eof', _(stream,i){return i < stream.length? make_lose(i,'EOF') : make_win(i,null) }, })
var __index = ()=> P2({ type:'index', _(stream,i){return make_win(i,make_line_col_index(stream,i)) }, })

// issue: makes parser not reentrant, as perf optimization
var G_opt = {fast:null}

var P = (ι,...ιs)=>0?0
	: ι instanceof Parser? ι
	: is_template([ι,...ιs])? (()=>{
		ι = easy_template(ι=>ι)(ι,...ιs)
		var i = ι.map((ι,i)=>[ι,i]).filter(([ι,i])=>Tarr(ι)).map(([ι,i])=>i)
		return P(ι.map(ι=> Tarr(ι)?ι[0]:ι)).map(ι=> i.length===1? ι[i[0]] : i.map(i=> ι[i]) )
		})()
	: Tfun(ι)? __lazy(ι)
	: Tstr(ι)? __match_string(ι)
	: Tarr(ι)? P.seq(...ι)
	: T.RegExp(ι)? __match(ι,ιs[0]||0)
	: !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}('cant make parser from',ι)
var P2 = ι=> new Parser(ι)
var Parser = function(a){ _(this).assign(a) }

// resolve ← p=>{
// 	t ← search_graph(p,ι=> ι instanceof Parser)
// 	↩ t.map(ι=> _(ι).omit('_','ps','p'))
// 	}

// Parser.prototype.resolve = λ(seen){ seen ||( seen = new Map() )
// 	if (seen.has(@)) ↩ seen.get(@); seen.set(@,@)
// 	switch( @.type ){
// 		default: ;
// 		break; case 'lazy': Tfun(@.ι) &&( @.ι = @.ι(), @.ι.resolve(seen) )
// 		break; case 'seq': case 'alt': @.ps.map(ι=> ι.resolve(seen))
// 		break; case 'times': case 'map': case 'map_js': case 'chain': @.p.resolve(seen)
// 		}
// 	↩ seen.get(@) }
// Parser.prototype.optimize = λ(seen){ seen ||( seen = new Map() )
// 	if (seen.has(@)) ↩ seen.get(@); seen.set(@,@)
// 	switch( @.type ){
// 		default:;
// 		break; case 'lazy': seen.set(@,@.ι); @.ι = @.ι.optimize(seen); seen.set(@,@.ι)
// 		break; case 'seq': case 'alt': @.ps = @.ps.map(ι=> ι.optimize(seen))
// 		break; case 'times': case 'map': case 'map_js': case 'chain': @.p = @.p.optimize(seen)
// 		}
// 	↩ seen.get(@) }

Parser.prototype.parse = function(stream){ Tstr(stream) || !function(){throw Error('‽')}()
	var p = this//.resolve()
	G_opt.fast = true; var r = p.skip(eof)._(stream,0)
	if (!r.status){ G_opt.fast = false; var r = p.skip(eof)._(stream,0); !!r.status && !function(){throw Error('‽')}(); !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(' '))}({ index:make_line_col_index(stream, r.furthest), expected:r.expected, stream:stream.slice(0,1e3), }) }
	return r.value }

// make_win ← (index,value)⇒ { status:true, index, value, }
var make_win = (index,value)=>0?0: { status:true, index, value, furthest:-1, expected:[], }
var make_lose = (index,expected)=>0?0: { status:false, index:-1, value:null, furthest:index, expected:[expected], }

P.seq = (...ps)=> __seq(ps.map(P.X))

var alt = P.alt = (...ps)=>{ ps = ps.map(P.X); ps.length || !function(){throw Error('‽')}(); return __alt(ps) }

Parser.prototype.many = function(){return this.times(0,Infinity) }
Parser.prototype.times = function(min,max){ if (arguments.length < 2) max = min; Tnum(min) || !function(){throw Error('‽')}(); Tnum(max) || !function(){throw Error('‽')}(); return __times(this,min,max) }

Parser.prototype.map    = function(f){ Tfun(f) || !function(){throw Error('‽')}(); return __map(this,f) }
Parser.prototype.map_js = function(f){ Tfun(f) || !function(){throw Error('‽')}(); return __map_js(this,f) }
Parser.prototype.skip = function(next){return P([this,next]).map(ι=> ι[0]) }

var eof = P.eof = __eof()

Parser.prototype.chain = function(f){return __chain(this,f) }

// -------------------------- extra (mostly unused) ------------------------- //

var merge_replies = (r,last)=>{
	if (G_opt.fast) return r
	if (!last) return r
	if (r.furthest > last.furthest) return r
	var expected = r.furthest===last.furthest? unsafe_union(r.expected, last.expected) : last.expected
	return { status:r.status, index:r.index, value:r.value, furthest:last.furthest, expected, } }

// Returns the sorted set union of two arrays of strings. Note that if both arrays are empty, it simply returns the first array, and if exactly one array is empty, it returns the other one unsorted. This is safe because expectation arrays always start as [] or [x], so as long as we merge with this function, we know they stay in sorted order.
var unsafe_union = (xs,ys)=>{
	var xL = xs.length
	var yL = ys.length
	if (xL===0) return ys; else if (yL===0) return xs
	var r = {}
	for (var i = 0; i < xL; i++) r[xs[i]] = true
	for (var i = 0; i < yL; i++) r[ys[i]] = true
	return _.keys(r).sort() }

P.format_error = (stream,error)=>{
	var t = error.expected; var ex = t.length===1? t[0] : 'one of '+t.join(', ')
	var index = error.index; var i = index.offset
	var prefix = (i > 0 ? "'..." : "'")
	var suffix = (stream.length - i > 12 ? "...'" : "'")
	if (i===stream.length) return ', got the end of the stream'
	return 'expected '+ex+' at line ' + index.line + ' column ' + index.column +  ', got ' + prefix + stream.slice(i,i+12) + suffix }

var seq_map = P.seq_map = (...a)=>{ var f = a[-1]; a = a.slice(0,-1); Tfun(f) || !function(){throw Error('‽')}(); return P(a).map(ι=> f(...ι)) }

//X // Allows to add custom primitive parsers
//X P.custom = f=> p_wrap(f(make_win,make_lose))

P.sep_by = (p,sep)=> P.sep_by1(p,sep).or(P.of([]))
P.sep_by1 = (p,sep)=>{ p = P(p); sep = P(sep)
	var pairs = sep.then(p).many()
	return p.chain(r=> pairs.map(rs=> [r].concat(rs) ) ) }

Parser.prototype.or = function(p){return alt(this,p) }
Parser.prototype.then = function(next){ next = P(next); return P([this,next]).map(ι=> ι[1]) }

Parser.prototype.result = function(ι){return this.map(()=> ι) }
Parser.prototype.at_most = function(n){return this.times(0,n) }
Parser.prototype.at_least = function(n){return seq_map(this.times(n), this.many(), (init,r)=> init.concat(r) ) }
Parser.prototype.mark = function(){return seq_map(index,this,index,(start,value,end)=>0?0: { start, value, end } ) }
//X Parser.prototype.desc = λ(expected){↩ p_wrap((stream,i)=>{ r ← @._(stream,i); if (!r.status) r.expected = [expected]; ↩ r }) }

P.of = __of
var fail = P.fail = __fail
//X P.any = p_wrap((stream,i)=> i >= stream.length? make_lose(i,'any character') : make_win(i+1, stream[i]) )
//X P.all = p_wrap((stream,i)=> make_win(stream.length, stream.slice(i)) )

//X test ← P.test = test=>( Tfun(test) || ‽,
//X   p_wrap((stream,i)=> i < stream.length && test(stream[i])? make_win(i+1,stream[i]) : make_lose(i,'a character matching '+test) )
//X   )
//X P.one_of = s=> test(ch=> s.indexOf(ch) >= 0 )
//X P.none_of = s=> test(ch=> s.indexOf(ch) < 0 )
//X P.take_while = test=>( Tfun(test) || ‽,
//X   p_wrap((stream,i)=>{ j ← i; while (j < stream.length && test(stream[j])) j++; ↩ make_win(j,stream.slice(i,j)) })
//X   )

var make_line_col_index = (stream,i)=>{ var lines = stream.slice(0,i).split('\n'); return { offset:i, line:lines.length, column:lines[-1].length+1, } }

var index = P.index = __index()

// ---------------------------------- final --------------------------------- //

var Pretty_Typed = function(T,ι){ this.T = T; this.ι = ι }; Pretty_Typed.prototype.inspect = function(d,opt){return this.T+':'+util.inspect(this.ι,opt) }
P.T = (T,ι)=> new Pretty_Typed(T,ι)
Parser.prototype.T = function(ss,...ιs){return this.map(ι=> P.T(ss[0],ι) ) }

typeof module !== 'undefined' && ( module.exports = P )

// ζ_parse ← (λ(){
// 	word_extra ← re`♈-♓🔅🔆`.source; word_extra_gu ← re`[…${word_extra}]`.g
// 	word ← re`A-Za-z0-9_$ʰ-ʸˡ-ˣΑ-ΡΣ-ωᴬ-ᵛᵢ-ᵥᶜᶠᶻ⁰ⁱⁿₐ-ₓₕ-ₜℂℕℚℝℤⱼⱽ…${word_extra}`.source
// 	ident ← P(re`(?![0-9])[…${word}]+|@`)
// 	comment ← re`(//.*|/\*[^]*?(\*/|$))+`
// 	simple_js ← P(()=> P.alt(
// 		P(comment).T`comment`,
// 		P.seq( P('{'), simple_js, P('}') ),
// 		P.seq( P.alt(
// 			P(/(['"])(((?!\1)[^\\]|\\.)*?\1)/).T`string`,
// 			ident,
// 			P.seq( P('`').T`template`, tmpl_ι.many(), P('`').T`template` ),
// 			P(/[)\]0-9]/)
// 			), P.alt( P(re`[ \t]*(?!…${comment.source})/`), P.of('') ) ),
// 		P(re`/((?:[^/\\\[]|(?:\\.)|\[(?:[^\\\]]|(?:\\.))*\])*)/([a-z]*)`).T`regex`,
// 		P(re`[^{}/'"…${'`'})@\]…${word}]+|[^}]`)
// 		).many() )
// 	tmpl_ι ← P.alt( P.seq( P('${').T`template`, simple_js, P('}').T`template` ), P(/\\[^]|(?!`|\$\{)[^]/).T`template` )
// 	js_file ← P.seq( P(/(#!.*\n)?/).T`shebang`, simple_js )
// 	global.js_file = js_file
// 	// js_file = js_file.resolve()
// 	// js_file = js_file.optimize()
// 	cn.log('parser:',js_file)
// 	↩ code=>{
// 		ι ← js_file.parse(code)._.flatten()
// 		r ← []; for(var t of ι) t.T? r.push(t) : r[-1]&&r[-1].T? r.push(t) : (r[-1]+=t)
// 		↩ r } })()
// test ← ()=>{
// 	cn.log('test parsimmon')
// 	test ← ()=> ζ_parse(in_); in_ ← φ`~/code/scratch/ζ/index.ζ`.text
// 	// pass ← JSON.stringify(test())===φ`/tmp/aaaa`.text
// 	// cn.log(pass?'pass ✓':'fail X')
// 	// cn.log('perf',bench(test,{TH:3}))
// 	cn.log('perf',bench(test,{TH:1}))
// 	}
// if (!module.parent) test()
