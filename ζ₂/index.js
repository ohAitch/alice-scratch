#!/usr/bin/env node --harmony

// todo:
// let's turn everything into continuation passing style!
// requireζ2 is maybe actually quite bad since it doesn't handle changes to the source ??

var ζ2_compile = function(v){
	return v.replace(/(?:λ\*?(?: λ)?(?=(?:[ \t][^\(=←]*)?\([^\)]*\)[ \t]*\{)|↩(?!\]) ?|([\w$ʰ-ʸˡ-ˣΑ-ΡΣ-ωᴬ-ᵛᵢ-ᵥᶜᶠᶻ⁰ⁱⁿₐ-ₓₕ-ₜℂℕℚℝℤⱼⱽ]+)(\s*)←(;?))(?!['"])/g,
		function(v,name,s,semi){switch(v){
			case 'λ': return 'function'; case 'λ λ': return 'function λ'
			case 'λ*': return 'function*'; case 'λ* λ': return 'function* λ'
			case '↩': case '↩ ': return 'return '
			// case '@': return 'this'
			default: return semi===';'? 'var '+name+s+';' : 'var '+name+s+'='
			}})
		.replace(/([^'"])@(?![-'"\w])/g,'$1this')}

var requireζ2 = function(name,path){
	try {return require(name)} catch (e) {if (!(e.code === "MODULE_NOT_FOUND")) throw e
		var fs = require('fs'); fs.writeFileSync(path+'.js',ζ2_compile(fs.readFileSync(path+'.ζ₂')+''))
		return require(name) } }

var exports = module.exports = requireζ2('./builtins',__dirname+'/builtins')
exports.ζ2_compile = ζ2_compile

if (!module.parent) requireζ2('./indexζ',__dirname+'/indexζ')
