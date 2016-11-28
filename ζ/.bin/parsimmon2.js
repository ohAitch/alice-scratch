// this would be so fun to optimize
// ok, i grok this now, & i see how i'd need to do various things b4 it's optimizeable. let's do this! later. yay grokking parser combinators :)

// ---------------------------------- core ---------------------------------- //

// issue: makes parser not reentrant, as perf optimization
var G_opt = {fast:null}

var _lazy = f=> p_wrap(function(stream,i){return (this._ = f()._)(stream,i) })
var _string = ι=> p_wrap((stream,i)=>{ var head = stream.slice(i,i+ι.length); return head===ι? make_win(i+ι.length,head) : make_lose(i,ι) })
var _regex = (re,group=0)=>{ T.RegExp(re) || !function(){throw Error("‽")}(); Tnum(group) || !function(){throw Error("‽")}()
  re = RegExp(re.source,re.flags.replace(/[^imu]/g,'')+'y'); var re_s = re+''
  return p_wrap((stream,i)=>{ var t = re.exec_at(stream,i); return t && !(t[group]===null || t[group]===undefined)? make_win(i+t[0].length, t[group]) : make_lose(i,re_s) }) }

var P = (ι,...a)=> Tfun(ι)? _lazy(ι) : Tstr(ι)? _string(ι) : T.RegExp(ι)? _regex(ι,...a) : !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(" "))}('cant make parser from',ι)

var p_wrap = ι=> new Parser(ι)
var Parser = function(f){ this._ = f }
P.proto = Parser.prototype

P.proto.parse = function(stream){ Tstr(stream) || !function(){throw Error("‽")}()
  G_opt.fast = true; var r = this.skip(eof)._(stream,0)
  if (!r.status){ G_opt.fast = false; var r = this.skip(eof)._(stream,0); !!r.status && !function(){throw Error("‽")}(); !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(" "))}({ index:make_line_col_index(stream, r.furthest), expected:r.expected, }) }
  return r.value }

var make_win = (index,value)=>0?0: { status:true, index, value, }
var make_lose = (index,expected)=>0?0: { status:false, index:-1, value:null, furthest:index, expected:[expected], }

var seq = P.seq = (...ps)=>{ ps.map(ι=> ι instanceof Parser || !function(){throw Error("‽")}())
  var r = p_wrap((stream,i)=>{var r;
    var accum = []
    for (var j=0;j<ps.length;j++){var p=ps[j];  r = merge_replies(p._(stream,i), r); if (!r.status) return r; accum.push(r.value); i = r.index  }
    return merge_replies(make_win(i,accum), r) })
  return r}

var alt = P.alt = (...ps)=>{ ps.map(ι=> ι instanceof Parser || !function(){throw Error("‽")}())
  if (!ps.length) return fail('zero alternates')
  return p_wrap((stream,i)=>{var r;
    for (var j=0;j<ps.length;j++){var p=ps[j];  r = merge_replies(p._(stream,i), r); if (r.status) return r  }
    return r }) }

P.proto.many = function(){return this.times(0,Infinity) }
P.proto.times = function(min,max){
  if (arguments.length < 2) max = min
  Tnum(min) || !function(){throw Error("‽")}(); Tnum(max) || !function(){throw Error("‽")}()

  return p_wrap((stream,i)=>{
    var accum = []
    var r;
    var prev_r;

    for (var times = 0; times < min; times += 1){
      r = this._(stream,i)
      prev_r = merge_replies(r,prev_r)
      if (r.status){ i = r.index; accum.push(r.value) }
      else return prev_r
      }
    for (; times < max; times += 1){
      r = this._(stream,i)
      prev_r = merge_replies(r,prev_r)
      if (r.status){ i = r.index; accum.push(r.value) }
      else break
      }
    return merge_replies(make_win(i,accum), prev_r)
  })
}

P.proto.map = function(f){ Tfun(f) || !function(){throw Error("‽")}(); return p_wrap((stream,i)=>{ var r = this._(stream,i); if (r.status) r.value = f(r.value); return r }) }
P.proto.skip = function(next){return seq(this,next).map(ι=> ι[0]) }

var eof = P.eof = p_wrap((stream,i)=> i < stream.length? make_lose(i,'EOF') : make_win(i,null) )

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

  var index = error.index
  var i = index.offset

  if (i===stream.length) return ', got the end of the stream'

  var prefix = (i > 0 ? "'..." : "'")
  var suffix = (stream.length - i > 12 ? "...'" : "'")

  var got = ' at line ' + index.line + ' column ' + index.column +  ', got ' + prefix + stream.slice(i,i+12) + suffix

  return 'expected '+ex+got }

var seq_map = P.seq_map = (...a)=>{ var f = a[-1]; a = a.slice(0,-1); Tfun(f) || !function(){throw Error("‽")}(); return seq(...a).map(ι=> f(...ι)) }

// Allows to add custom primitive parsers
P.custom = f=> p_wrap(f(make_win,make_lose))

P.sep_by = (p,sep)=> P.sep_by1(p,sep).or(P.of([]))
P.sep_by1 = (p,sep)=>{ p instanceof Parser || !function(){throw Error("‽")}(); sep instanceof Parser || !function(){throw Error("‽")}()
  var pairs = sep.then(p).many()
  return p.chain(r=> pairs.map(rs=> [r].concat(rs) ) ) }

P.proto.or = function(ι){return alt(this,ι) }
P.proto.then = function(next){ next instanceof Parser || !function(){throw Error("‽")}(); return seq(this,next).map(ι=> ι[1]) }

P.proto.result = function(ι){return this.map(()=> ι) }
P.proto.at_most = function(n){return this.times(0,n) }
P.proto.at_least = function(n){return seq_map(this.times(n), this.many(), (init,r)=> init.concat(r) ) }
P.proto.mark = function(){return seq_map(index,this,index,(start,value,end)=>0?0: { start, value, end } ) }
P.proto.desc = function(expected){return p_wrap((stream,i)=>{ var r = this._(stream,i); if (!r.status) r.expected = [expected]; return r }) }

P.of = (value)=> p_wrap((stream,i)=> make_win(i,value) )
var fail = P.fail = expected=> p_wrap((stream,i)=> make_lose(i,expected) )
P.any = p_wrap((stream,i)=> i >= stream.length? make_lose(i,'any character') : make_win(i+1, stream[i]) )
P.all = p_wrap((stream,i)=> make_win(stream.length, stream.slice(i)) )

var test = P.test = test=>( Tfun(test) || !function(){throw Error("‽")}(),
  p_wrap((stream,i)=> i < stream.length && test(stream[i])? make_win(i+1,stream[i]) : make_lose(i,'a character matching '+test) )
  )
P.one_of = s=> test(ch=> s.indexOf(ch) >= 0 )
P.none_of = s=> test(ch=> s.indexOf(ch) < 0 )
P.take_while = test=>( Tfun(test) || !function(){throw Error("‽")}(),
  p_wrap((stream,i)=>{ var j = i; while (j < stream.length && test(stream[j])) j++; return make_win(j,stream.slice(i,j)) })
  )

var make_line_col_index = (stream,i)=>{ var lines = stream.slice(0,i).split('\n'); return { offset:i, line:lines.length, column:lines[-1].length+1, } }

var index = P.index = p_wrap((stream,i)=> make_win(i,make_line_col_index(stream,i)) )

P.proto.chain = function(f){return p_wrap((stream,i)=>{ var r = this._(stream,i); return !r.status? r : merge_replies(f(r.value)._(stream,r.index), r) }) }

// ---------------------------------- final --------------------------------- //

var Pretty_Typed = function(T,ι){ this.T = T; this.ι = ι }; Pretty_Typed.prototype.inspect = function(d,opt){return (this.T==='ident'?'i':this.T)+util.inspect(this.ι,opt) }
P.proto.type = function(T){return this.map(ι=> new Pretty_Typed(T,ι) ) }

typeof module !== 'undefined' && ( module.exports = P )

// test ← ()=>{
//   ident ← P(/(?![0-9])[A-Za-z0-9_$ʰ-ʸˡ-ˣΑ-ΡΣ-ωᴬ-ᵛᵢ-ᵥᶜᶠᶻ⁰ⁱⁿₐ-ₓₕ-ₜℂℕℚℝℤⱼⱽ]+|@/)
//   comment ← /(\/\/.*|\/\*[^]*?(\*\/|$))+/
//   simple_js ← P(()=> P.alt(
//     P.seq( P.alt( ident, P(')'), P(']'), P(/[0-9]/) ), P(RegExp('[ \t]*(?!'+comment.source+')/')) ),
//     P.seq( P('`').type('template'), tmpl_ι.many(), P('`').type('template') ),
//     P(/(['"])(\1|((.*?[^\\])?(\\\\)*)\1)/).type('string'),
//     P(comment).type('comment'),
//     P(/\/((?:[^\/\\\[]|(?:\\.)|\[(?:[^\\\]]|(?:\\.))*\])*)\/([a-z]*)/).type('regex'),
//     P.seq( P('{'), simple_js, P('}') ),
//     ident,
//     P(/[^{}/'"`)@\]A-Za-z0-9_$ʰ-ʸˡ-ˣΑ-ΡΣ-ωᴬ-ᵛᵢ-ᵥᶜᶠᶻ⁰ⁱⁿₐ-ₓₕ-ₜℂℕℚℝℤⱼⱽ]+|[^}]/)
//     ).many() )
//   tmpl_ι ← P.alt( P.seq( P('${').type('template'), simple_js, P('}').type('template') ), P(/\\[^]|(?!`|\$\{)[^]/).type('template') )
//   js_file ← P.seq( P(/(#!.*\n)?/).type('shebang'), simple_js )
//   cn.log('test parsimmon')
//   test ← ()=> js_file.parse(in_); in_ ← φ`~/code/scratch/ζ/index.ζ`.text
//   pass ← JSON.stringify(test())===φ`/tmp/aaaa`.text
//   cn.log(pass?'pass ✓':'fail X')
//   cn.log('perf',bench(test,{TH:3}))
//   }
// typeof @_ !== 'undefined' && test()
