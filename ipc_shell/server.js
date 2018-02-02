#!/usr/bin/env node
var fs = require('fs')
var simple_as_file = ι=> (fs.writeFileSync('/tmp/𐅫𐅮𐅮𐅂',ι),'/tmp/𐅫𐅮𐅮𐅂')

var catch_ = f=> function(){ try{ return f.apply(this,arguments) }catch(e){ '__catchable' in e || _interrobang_(e) ;return e.__catchable } }
var return_ = ι=>{ throw {__catchable:ι} }

var ord = (ι,i)=> ι.codePointAt(i)
var chr = ι=> String.fromCodePoint(ι)

var _interrobang_ = (...a)=>{ throw a.length===1 && a[0] instanceof Error? a[0] : Error(a.map(ι=> typeof(ι)==='string'? ι : util.inspect(ι)).join(' ')) }

var on_off = ()=>{ var ι = [] ;return { on(...a){ var [ee,m,f]=a ;ee.on(m,f) ;ι.push(a) } ,off(){ ι.map(([ee,m,f])=> ee.removeListener(m,f)) ;ι = [] } } }

var eval_in_new_worker = code=>{ code = `require('${__dirname}');`+code ;return require('child_process').spawn(process.execPath,[...process.execArgv,simple_as_file(code)],{ stdio:['pipe','pipe','pipe','ipc'] }) }

var eval_in_worker = (()=>{
	var busy = new Set() ;var free = new Set()
	var make = ()=> eval_in_new_worker('('+(()=>{ var pr = process
		var pr_once_eval = f=> pr.once('message',ι=>{ ι.map(ι=>{ ι[0]==='eval' || _interrobang_() ;f(ι[1]) }) })
		var wait = ()=> pr_once_eval(ι=>{ (0,eval)(ι) })
		wait()
		pr.on('beforeExit',i=>{ pr.send([['exit_',i],['unbusy']]) ;pr.exitCode = 0 ;wait() })
		pr_on_exits(i=>{ pr.send([['exit_',i]]) })
		})+')()')
		.on('message',function(ι){ ι.map(ι=> this.emit(...ι) ) })
		.on('unbusy',function(){ busy.delete(this) ;free.add(this) })
	return code=>{
		free.length || free.add(make())
		var pr = free.pop() ;busy.add(pr) ;pr.send([['eval',code]]) ;return pr }
	})()
var procify = (a,code)=> 'var a = '+JSON.stringify(a)+' ;var on_off = '+on_off+' ;('+((()=>{ var pr = process
	var err = e=>( pr.stderr.write((e.stack||e)+'\n') ,pr.exitCode ||( pr.exitCode = 1 ) )
	var {on,off} = on_off() ;on(pr,'uncaughtException',e=>{ err(e) ;pr.exit() }) ;on(pr,'beforeExit',off)
	pr.argv = [pr.argv[0],...a.argv] ;φ.cwd = a.cwd ;pr.env = a.env ;_u.zip([pr.stdin,pr.stdout,pr.stderr],a.isTTY).map(([fd,t])=> fd.isTTY = t)
	try{ 𐅮𐅪𐅮𐅯𐅰 }catch(e){ err(e) }
	})+'').replace('𐅮𐅪𐅮𐅯𐅰',code)+')()'

//###############################################################################

var H = new require('net').Server().listen(2114,'localhost')
H.on('listening',()=>H.on('connection',(𐑕𐑩𐑒𐑧𐑑)=>{var t;
	var worker ;var ended;
	var c_send = (type,ι)=>{ if (ended) return ;var a = Buffer(4) ;var b = Buffer(type) ;var c = Buffer(ι||'') ;a.writeInt32BE(c.length,0) ;𐑕𐑩𐑒𐑧𐑑.write(Buffer.concat([a,b,c])) }
	𐑕𐑩𐑒𐑧𐑑.on('end',t=_u.once(()=>{ !ended && worker && worker.kill('SIGKILL') ;ended = true })).on('error',t)
	𐑕𐑩𐑒𐑧𐑑.on('data',catch_(ι=>{
		if (buf){ ι = Buffer.concat([buf,ι]) ;buf = undefined }
		var i=0 ;var get = n=> i+n <= ι.length ||( buf = ι.slice(i) ,return_() )
		while(i<ι.length){ get(5) ;var L = ι.readInt32BE(i) ;var type = chr(ι[i+4]) ;get(5+L) ;on_msg({type ,ι:ι.slice(i+=5,i+=L)})}
		})) ;var buf;
	var a = { argv:[] ,cwd:'' ,env:{} ,isTTY:[,,,] }
	var on_msg = ι=>{switch(ι.type){default: _interrobang_()
		break ;case 'A': a.argv.push(ι.ι+'')
		break ;case 'E': var [ˣ,k,v] = (ι.ι+'').re`^([^=]*)=(.*)` ;k.re`^NAILGUN_TTY_\d$`?( a.isTTY[k[-1]] = v!=='0' ):( a.env[k] = v )
		break ;case 'D': a.cwd = ι.ι+''
		break ;case 'R':
			if( a.argv[1]==='TEST' ){ c_send('X',5+'') ;ended = true ;return }
			worker = eval_in_worker(procify(a,` (0,eval)(a[0]) `))
			var {on,off} = on_off()
			;[1,2].map(fd=> on(worker.stdio[fd],'data',ι=> c_send(fd+'',ι)) )
			on(worker,'exit_',i=>{ c_send('X',i+'') ;ended = true ;off() })
			// c_send('S')
		break ;case 'H': // not sure what this is for
		break ;case '0': // c_send('S') ;worker.stdio[0].write(ι.ι)
		break ;case '.': // worker.stdio[0].end()
		}}
	}))
