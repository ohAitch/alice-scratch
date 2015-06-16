// in a good programmer, code-thoughts are in a fuzzy sloppy half-wrong frame that`s pretty alien to the existing field
// what is that frame?
// well, what code-thoughts would we have if our computer understood them? and what programs would we write?
// ... i don`t know. that`s a really hard question.
// http://baconjs.github.io/api.html might be really useful for the implementation of this
// http://worrydream.com/KillMath/ http://worrydream.com/LadderOfAbstraction/ is relevant to the implementation of this

if we have a model of code-thoughts that allows for expressing
	fb-sdk
	perfect-history
	sublime-transform
	sure
	more attempts at generation of beautiful things, like terrain or cities
	lackey
	tagtime (web/windows/ubuntu/osx/android/ios or some subset of that) (6.824 is relevant to this)
	IAFF
	timer-tab.com
	the matasano crypto challenges (http://cryptopals.com/)
	something like "constraint programming", incl genex(/-?\d/)
	custom fuzzing http://danluu.com/everything-is-broken/
	> i`m refactoring acorn.js. and - i - i want to just _pick up_ the damn graph and _splay it out all over the walls and floor and ceiling and_ MOVE the components DIRECTLY instead of this utter "text editor" bullshit
	? absolute technical grace ? "sometimes things are sufficiently modular and well-written that modifying the behavior *really is* just a matter of changing a couple lines of code"
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
