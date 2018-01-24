############# flamegrapher #############
mkdir -p .bin
ζ ' φ`.bin/it.js`.text = ζ_compile(φ`parse_lang.ζ`.text) ;' &&
browserify .bin/it.js -o bundle.js &&
rm -r .bin

0x it.js

require('/usr/local/bin/ζ')

##### observe parser element freqs #####
node --stack-size=10000 /usr/local/bin/ζ parse_lang.ζ > foo.txt

a ← φ`~/code/scratch/fast-parse/foo.txt`.text.split('\n').count()
sb.tab.push( a.⁻¹ )
sb.tab.push( […[…a.values()].count()].map(([a,b])=>[a,a*b])._.sortBy(..0).reduce((r,a)=>( r.push([a,r[-1][1]+a[1]]) ,r ),[[null,0]]) )

# put in parser.ζ

P0 ← (tag,ι)=> new_(P) …← ({tag},ι) |>(record)

γ.𐅭𐅪𐅰𐅮𐅬 = Set()
log(𐅭𐅪𐅰𐅮𐅬.map(ι=> simple_hash(ι)+' '+ζ_inspect(ι).replace(/\n/g,' ') ).join('\n'))
_record ← (ι,in_,i)=> 𐅭𐅪𐅰𐅮𐅬.add(in_)

_record ← (ι,in_,i)=> γ.𐅬𐅜𐅝𐅃𐅋 && log([ simple_hash(𐅋𐅩𐅩𐅝𐅝(ι)),simple_hash(in_),i,ι.tag ].join(' ')) ;𐅋𐅩𐅩𐅝𐅝← npm`circular-json@0.4.0`.stringify
record ← ι=>{ t ← ι._ ;ι._ = λ(…a){ _record(@,…a) ;↩ t.call(@,…a) } ;↩ ι }
