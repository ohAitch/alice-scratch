#!/bin/sh
// 2>/dev/null; node --harmony "$0" "$@"; exit

// -------------------------------- compile ζ ------------------------------- //
var ζ_compile = ι => ι
	.replace(/…(?!\$[{\/]|\(\?|':'| "\)\))|(?:λ\*?(?: λ)?(?=(?:[ \t][^\(=←]*)?\([^\)]*\)[ \t]*\{)|↩(?![\]"]|\([.?]|\$\/| ':'r) ?|([\w$ʰ-ʸˡ-ˣΑ-ΡΣ-ωᴬ-ᵛᵢ-ᵥᶜᶠᶻ⁰ⁱⁿₐ-ₓₕ-ₜℂℕℚℝℤⱼⱽ♈-♓]+)(\s*)←(;?))(?!['"])/g,
		(ι,name,s,semi) => ({'λ':'function', 'λ λ':'function λ','λ*':'function*', 'λ* λ':'function* λ', '↩':'return ', '↩ ':'return ', '…':'...'}[ι] || (semi===';'? 'var '+name+s+';' : 'var '+name+s+'=')) )
	.replace(/(^|[^'"])@(?![-'"\w\/\\]| #|\([?.])/g,'$1this')
	.replace(/(?!"‽"|'‽')(^|[^])‽(?!\(\?)(\(?)/g, (ˣ,a,ι) => a+(ι? '!function(ι){throw Error(ι)}(' : '!function(){throw Error("‽")}()') )
	.replace(/(?!"."|'.')(^|[^])(?!.[-♈♋♎♐♓]*\](?:\*|\+|\)\/g))([♈♋♎♐♓])/g, (ˣ,a,ι) => a+{'♈':'__aries','♋':'__cancer','♎':'__libra','♐':'__sagittarius','♓':'__pisces'}[ι] )

var fs = require('fs')
var t = (fs.readFileSync('index.ζ')+'').split('\n'); t[2] = 'var ζ_compile = '+(ζ_compile+'').replace(/\n/g,' ')+';'+t[2]; t = t.join('\n')
fs.writeFileSync('index.js', ζ_compile(t)); fs.chmodSync('index.js',0o755)

// ------------------------ add __dirname to index.sh ----------------------- //
var sh_ENC = ι => "'"+(ι+'').replace(/'/g,"'\\''")+"'"
fs.writeFileSync('index.sh', (fs.readFileSync('index.sh')+'').replace('__dirname','__dirname='+sh_ENC(__dirname)))
