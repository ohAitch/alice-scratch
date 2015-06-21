// in a good programmer, code-thoughts are in a fuzzy sloppy half-wrong frame that`s pretty alien to the existing field
// what is that frame?
// well, what code-thoughts would we have if our computer understood them? and what programs would we write?
// ... i don`t know. that`s a really hard question.
// i think there would be absolute technical grace "sometimes things are sufficiently modular and well-written that modifying the behavior *really is* just a matter of changing a couple lines of code"
// http://baconjs.github.io/api.html might be really useful for the implementation of this
// http://worrydream.com/KillMath/ http://worrydream.com/LadderOfAbstraction/ is relevant to the implementation of this
// > i`m refactoring acorn.js. and - i - i want to just _pick up_ the damn graph and _splay it out all over the walls and floor and ceiling and_ MOVE the components DIRECTLY instead of this utter "text editor" bullshit

if we have a model of code-thoughts that allows for expressing
	// fb-sdk
	// perfect-history
	// sublime-transform
	// dance
	more attempts at generation of beautiful things, like terrain or cities
	// weather
	// lackey
	tagtime (web/windows/ubuntu/osx/android/ios or some subset of that) (6.824 is relevant to this)
	IAFF
	timer-tab.com
	the matasano crypto challenges
	something like "constraint programming", incl genex(/-?\d/)
	custom fuzzing http://danluu.com/everything-is-broken/
then i think we have a good model.

------------------------------------ fb-sdk ------------------------------------

node program. shebang.

library fb.api uses node-callback. and after a call, null, .error, .data.error -> error

on error, also: print 'ERROR' without a newline. CLI return 1.

read auth from ./arc/fb_auth.json or error

CLI commands are
	
	verify <token> <user_id>
		call library fb.api('/debug_token', {access_token: auth.id+'|'+auth.secret, input_token: argv.token})
		error if false: .data match {is_valid: true, app_id: auth.id, user_id: argv.user_id}

	get-name <token>
		call library fb.api('/me', {access_token: argv.token})
		print .name without a newline

-------------------------------- perfect-history -------------------------------

node program. shebang.

CLI is just
	<root>

// call library chokidar.watch(root, {persistent:true, ignoreInitial:true}).on('all', cb)
// 	with cb(event,file) filtered by (/add|change|unlink/, ¬/.*\/\.history\/.*/)
call library chokidar.watch(root, {persistent:true, ignoreInitial:true})
	subscribe to 'all'. filter by (event: /add|change|unlink/, file: !/.*\/\.history\/.*/). map by
		within root:
		print (event, current time, file) tabularly
		(if event = 'unlink', copy file to, else touch) '.history/'+current_time+' '+(event = 'unlink'? '-' : '+')+' '+file.replace(/\//g,'::')

------------------------------- sublime-transform ------------------------------

node program. shebang.

CLI commands are

	from <in>
		call library plist.parse on the contents of argv.in.
		pretty-print this and write to argv.in+'.json'.

	to <in> <out>
		optimize file operations and relax in-order-ness.
		for children in argv.in, replace argv.in with argv.out and rmrf, except any contents containing 'Package Control.'
		for files in argv.in, replace argv.in with argv.out and [write to self, unless]
			match /\.json$/ -> write plist.build(@file) to file without extension
			match /\.snippet-magic$/ -> call λ on file, write all results to '.sublime-snippet' files with arbitrary names
			// match /\.snippet-magic$/ -> λ(file) * write to file with extension changed to (index+'.sublime-snippet')
				with λ = split on '\n\n', * '<snippet><content><![CDATA['+(all lines after first)+'\n]]></content><tabTrigger>'+(first line sans newline)+'</tabTrigger></snippet>'

------- auxiliary: how to pretty print json ------

// this is my first attempt at stringifying json nicely. i do not think it will be my last.
let json.show = λ(v){
	let wrap_width = 150
	let TAB = '  '
	let indent = .replace(/\n/g,'\n'+TAB)

	if v is in the callstack of this recursive function:
		throw TypeError('Converting circular structure to JSON')

	case type of v:
		'null', 'undefined', 'function' -> 'null'
		'boolean', 'number' -> v+''
		'string' -> JSON.stringify(v)
		else,
			if v is an array, ensure all indexes of v have elements
			let ts =
				v is an array -> v * json.show * indent
				v is an object -> (k,v in pairs(v) if v!==undefined && typeof(v)!=='function') * indent(json.show(k)+': '+json.show(v))
			let a,b = v is an array? '[]' : '{}'
			a+ts.join(', ')+b, unless its .length > wrap_width, then a+'\n'+TAB+ts.join(',\n'+TAB)+'\n'+b
	}

------------------------------------- dance ------------------------------------
// "sure" is a 183-line toy I made in late 2013. This is a sequel, not a direct translation. I expect writing this in the style of the original would take rather more than 183 lines.

let`s define a 2d grid-world with a physics of sequential ticks
it`s got a rectangular grid of cells with adjacency north/east/west/south that are slots for agents, and connect each of those to a cell that`s a well of "soul points"

soul wells regenerate at a fixed rate - say, 0.01/tick. and they fill up at 100 soul points.

an agent, if one is present, may choose an action to attempt for each tick
	send X soul or fire to adjacent cell
	send X soul from well to self
	send new agent with X soul and code φ to adjacent non-well cell
it`s told the contents of it`s cell and all adjacent cells, and for empty adjacent cells it`s told the contents of their wells

an agent _is_ a container of soul and a piece of code that is executed to attempt the actions
	if it chooses an action it doesn`t have enough soul to do, it spends all of its soul and does as much of the action as possible

all actions happen simultaneously: first, they move to their destination, then each destination cell resolves its actions 

fire is negative soul.
soul and soul the same cell immediately combine. if the soul is not directed towards a particular agent, it combines with all agents in the cell in proportion to their existing amounts of soul

any agent with zero soul immediately dies

fire in an empty cell sends itself for free to the cell`s well

agents in the same cell fight. they`re told about the other agents in the fight and given an opportunity to send fire to each of them.
	if nobody sends fire, the agent with the most soul wins and gets the soul of everyone else
	otherwise, all agents that send no fire proportionally send all of their soul to the cell
	this iterates until there are no longer multiple agents in the same cell

sending X fire costs ⌈ X*1.1 ⌉ soul, + 0.05 iff it`s not within a cell
sending X soul costs X soul, + 0.05 iff it`s not within a cell
send new agent with X soul and code φ costs X + 0.1 soul
sending X soul from well to self costs 0.1 soul

a well at its cap will spend all its soul on the action of sending an agent with random code φ to it`s cell

the piece of code is just a javascript function, taking the local region of the grid as input and outputting an action object

can i have a grid and controls for running the ticks? as a static javascript app, in a browser tab. i want the grid to be the biggest size that fits in the given window with the given display method.
and can you display the grid squares as 12×12px squares
when empty, a solid square of its well`s soul-color
when full, the empty version plus a centered 9×9px square of the agent`s soul-color, plus a pair of ascii chars to represent the agent`s code
and when i mouseover a grid square i want it to display all of the contents in a sort of tooltip

------------------------------------ weather -----------------------------------
// this program really needs to be laid out graphically/nonlinearly.

> vertical join [merge weather images @ index 0 2 3] and [merge weather images @ index 9 10 11 12]
do that at hours 0 48. horizontal join these. write this to test.png.

--- aux ---

weather_image(hour, index) =
  fetch "http://forecast.weather.gov/meteograms/Plotter.php?lat=37.872&lon=-122.265&wfo=MTR&zcode=CAZ508&gset=18&gdiff=3&unit=0&tinfo=PY8&ahour="+hour+"&pcmd="+code+"&lg=en&indu=1!1!1!&dd=&bw=&hrspan=48&pqpfhr=6&psnwhr=6"
	where code = ("000000000000000000000000000000000000000000000000000000000" [index]= "1")

the merge a set of weather images is
  average(the set with the grey pixels masked black) +
  average(the set with the non-grey pixels masked black)

------------------------------------ lackey ------------------------------------

node module exposing a CLI and no exports.
require({"xmlbuilder": "*"})

the CLI is () and does:
	cp lackey.icns ~/Library/Keyboard\ Layouts/
	make_keylayout >¹ ~/Library/Keyboard\ Layouts/lackey.keylayout
	make_karabiner > ~/Library/Application\ Support/Karabiner/private.xml
	using /Applications/Karabiner.app/Contents/Library/bin/ :
		karabiner reloadxml; karabiner enable lackey

make_keylayout:
	using lackey.keylayout.template
	id ← -18674
	keymapset ← [
		['a','s','d','f','h','g','z','x','c','v',167,'b','q','w','e','r','y','t','1','2','3','4','6','5','=','9','7','-','8','0',']','o','u','[','i','p',13,'l','j','\'','k',';','\\',',','/','n','m','.',9,' ','`',8,3,27,0,0,0,0,0,0,0,0,0,0,0,'.',29,'*',0,'+',28,27,31,0,0,'/',3,30,'-',0,0,'=','0','1','2','3','4','5','6','7',0,'8','9',0,0,0,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,5,1,11,127,16,4,16,12,16,28,29,31,30,0],
		['A','S','D','F','H','G','Z','X','C','V',177,'B','Q','W','E','R','Y','T','!','@','#','$','^','%','+','(','&','_','*',')','}','O','U','{','I','P',13,'L','J','"','K',':','|','<','?','N','M','>',9,' ','~',8,3,27,0,0,0,0,0,0,0,0,0,0,0,'.','*','*',0,'+','+',27,'=',0,0,'/',3,'/','-',0,0,'=','0','1','2','3','4','5','6','7',0,'8','9',0,0,0,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,5,1,11,127,16,4,16,12,16,28,29,31,30,0],
		['A','S','D','F','H','G','Z','X','C','V',167,'B','Q','W','E','R','Y','T','1','2','3','4','6','5','=','9','7','-','8','0',']','O','U','[','I','P',13,'L','J','\'','K',';','\\',',','/','N','M','.',9,' ','`',8,3,27,0,0,0,0,0,0,0,0,0,0,0,'.',29,'*',0,'+',28,27,31,0,0,'/',3,30,'-',0,0,'=','0','1','2','3','4','5','6','7',0,'8','9',0,0,0,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,5,1,11,127,16,4,16,12,16,28,29,31,30,0],
		[[10],,[13],[15],,,,,[12],,,[11],,,[14],,,,[1],[2],[3],[4],[6],[5],,[9],[7],,[8],[0],,,,,,,,,,,,,,,,,,,,,,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[0],[1],[2],[3],[4],[5],[6],[7],,[8],[9],,,,,,,,,,,,,,,,,,,,,,5,1,11,127,16,4,16,12,16,28,29,31,30,],
		[1,19,4,6,8,7,26,24,3,22,'0',2,17,23,5,18,25,20,'1','2','3','4','6','5','=','9','7',31,'8','0',29,15,21,27,9,16,13,12,10,'\'',11,';',28,',','/',14,13,'.',9,' ','`',8,3,27,0,0,0,0,0,0,0,0,0,0,0,'.',29,'*',0,'+',28,27,31,0,0,'/',3,30,'-',0,0,'=','0','1','2','3','4','5','6','7',0,'8','9',0,0,0,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,5,1,11,127,16,4,16,12,16,28,29,31,30,0],
		]. pairs. mapcat ['<keyMap index="'+i+'">', (@_), '</keyMap>'] $ .join('\n')
			where _ = v. pairs. * '<key code="'+i+'" '+(v isa Array? 'action="'+v[0] : 'output="&#x'+(it as char as buf to hex)+';')+'"/>'
	↩ filled out template

[1] read the file first and only write if it`s different. and if so, then first
	id += 1
	print('!! writing new layout !!')
	print('you may need to manually set the new layout in System Preferences → Keyboard → Input Sources and then reboot your computer')
	print('new id:',id)

make_karabiner:
	//! right command is maybe problematic
	//! need to enable multi-modifier chords. maybe do this by changing the keylayout so that the hex codes are hidden away?

	/* parse .lackey */
	read default.lackey
	remove lines ≈ /#.*/
	collect lines ≈ /(\S+) : (\S+)/ as chords
	match interrupted (labeled) ascii boxes.
		they should have 4 or 6 lines.
		discard boxes '','⇧'
		for each line: s/^\||\|$//g. ≈/\S\S?/g.
		interpret boxes with 4 lines as a [1:-1] view of (box 'homoiconic' with all atoms = '_'), and de-view. flatten all boxes.
		prepend-zip boxes with box 'homoiconic'. discard pairs ≈ [,'_']. discard box 'homoiconic'.
		let keycodes ← boxes pop 'keycode' as dict
		chords ~= boxes ** {keys:[0], out:[1]} ** (.keys= .label+.keys) *cat
	unmatched part should ≈ /\n+/

	/* build the output */ use only: keycodes, chords
	let KeyCode x ← 'KeyCode::'+(x≈/\d/? 'KEY_'+x : x≈/[a-z]/? uppercase x : 'RawValue::0x'+keycodes[x])
	let kc_hex x ← x * (it as char as buf to hex * (KeyCode it)+',ModifierFlag::OPTION_L,'). flatten. as string.
	let shells ← []
	let gen_shell x ← (shells ~= [[kc,x]]; kc) where kc ← 'KeyCode::VK_OPEN_URL_'+(random ∈ ≈/\w{8}/)
	gen_shell 'echo dummy'
	let autogens ←
		['__KeyToKey__ KeyCode::PC_APPLICATION, VK_CONTROL, KeyCode::TAB,ModifierFlag::CONTROL_L|ModifierFlag::SHIFT_L'] ~
		['__KeyToKey__ KeyCode::PC_APPLICATION, ModifierFlag::NONE, KeyCode::RawValue::0x82'] ~
		(chords -= .keys.length ≠ 2);
		chords *
			.keys[0] = '⌥'? '__KeyToKey__ '+(KeyCode .keys[1])+', VK_OPTION|ModifierFlag::NONE,' :
				'__SimultaneousKeyPresses__ '+(KeyCode .keys[0])+', '+(KeyCode .keys[1])+','
			//.keys[0] = 'R⌘'? '__KeyToKey__ '+KeyCode(.keys[1])+', ModifierFlag::COMMAND_R,' :
			+
			out isa string? kc_hex out : (gen_shell out[0])+','
	↩ xmlbuilder.create({root: {
		'#list': shells * {vkopenurldef: {name:it[0], url:{'@type':'shell', '#cdata':it[1]}}}
		item: {name:'lackey', identifier:'lackey', '#list':autogens * {autogen:it}}
		}}).end({pretty:true})
