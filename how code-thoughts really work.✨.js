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
tagtime (web/windows/ubuntu/osx/android/ios/smartwatch or some subset of that) // ~
IAFF
// timer-tab.com
the matasano crypto challenges // ~
something like "constraint programming", incl genex(/-?\d/)
custom fuzzing http://danluu.com/everything-is-broken/
6.824

then i think we have a good model.

... what about logging? we`ve never interacted with logging, but it might be important.

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

	CLI is
		<root>
			within root:
			watch files ∈ (. - ./.history/):
				log (event, now, file) tabularly
				(event = 'unlink'? touch : copy file to) './.history/'+now+' '+(event = 'unlink'? '-' : '+')+' '+file.encode(/\//g)

	---

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
				let ts ←
					v is an array -> v * json.show * indent
					v is an object -> (k,v in pairs(v) if v!==undefined && typeof(v)!=='function') * indent(json.show(k)+': '+json.show(v))
				let a,b ← v is an array? '[]' : '{}'
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

	// maybe this?
	image-join
	[merge weather images @ hour 0, index 0 2 3     ] [ditto @ hour 48]
	[merge weather images @ hour 0, index 9 10 11 12] [ditto @ hour 48]
	and write to test.png

	--- aux ---



	weather_image(hour, index) =
	  GET "http://forecast.weather.gov/meteograms/Plotter.php?lat=37.872&lon=-122.265&wfo=MTR&zcode=CAZ508&gset=18&gdiff=3&unit=0&tinfo=PY8&ahour="+hour+"&pcmd="+code+"&lg=en&indu=1!1!1!&dd=&bw=&hrspan=48&pqpfhr=6&psnwhr=6"
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
			]. pairs. *cat ['<keyMap index="'+i+'">', (@_), '</keyMap>'] $ .join('\n')
				where _ = it. pairs. * '<key code="'+i+'" '+(it isa Array? 'action="'+it[0] : 'output="&#x'+(it as char to hex)+';')+'"/>'
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
			chords ~= boxes ** {keys:[0], out:[1]} ** (.keys= .label+.keys) / ~
		unmatched part should ≈ /\n+/

		/* build the output */ use only: keycodes, chords
		let KeyCode x = 'KeyCode::'+(x≈/\d/? 'KEY_'+x : x≈/[a-z]/? uppercase x : 'RawValue::0x'+keycodes[x])
		let kc_hex x = x * (it as char to hex * (KeyCode it)+',ModifierFlag::OPTION_L,'). flatten. as string.
		let shells ← []
		let gen_shell x = (shells ~= [[kc,x]]; kc) where kc ← 'KeyCode::VK_OPEN_URL_'+(random ∈ ≈/\w{8}/)
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

------------------------------------ tagtime -----------------------------------

"special_dependencies": {"atom_shell": "0.19.1"},
"main": "main.js"

⎋ ⌘w ⌘q should all do action Cancel

people who don`t use tagtime all the time want "only run during certain hours" and "don`t bother logging afk/canceled pings" modes

handle being pinged while you`re typing

i think it should be super explicit like "your computer seems to be bogged down". usually that will have been painfully obvious to you which is actually reassuring for tagtime to notice and warn you and tell you exactly why. and if it ever happens for no apparent reason then it would probably be good to get a bug report about that - how about "This ping is $x seconds late! If this doesn`t seem like your computer`s fault you can _submit a bug report_ [link]."

ooh, we maybe need to handle dropbox-style logfile syncing? that means killing ping windows if the log file updates with those pings - that is, always pinging just those pings which the log file is missing.

verify we`ve got a valid auth token for the user we`re trying to interact with (this especially handles the case in which the username is mistyped)

have read_graph cache its results

‽ implement "In the future this should show a cool pie chart that lets you click on the appropriate pie slice, making that slice grow slightly. And the slice boundaries could be fuzzy to indicate the confidence intervals! Ooh, and you can drag the slices around to change the order so similar things are next to each other and it remembers that order for next time! That`s gonna rock."
	so, when i took five minutes to consider "what would be a *good* interface for tagging?", i thought of "what about a field of 2-dimensional tag-cells, with size proportional to frequency, that can be persistently dragged around?"
	* Figure out the confidence intervals based on the samples (pie slices could have fuzzy boundaries to indicate confidence intervals).
	* Thoughts on visualization: http://stackoverflow.com/questions/3224494/data-visualization-bubble-charts-venn

maybe prepare the gui beforehand so that we can make it come up on exactly the right instant?

tagtime should definitely have an interface that lives in the system tray

people want this: annoying person https://mail.google.com/mail/u/0/#all/1475525cc89fff4f happy malo https://mail.google.com/mail/u/0/#all/1486610d171b5c4b sms would make money https://mail.google.com/mail/u/0/#all/14b1dcb399f77201 query about commissioning a TagTime iOS app https://mail.google.com/mail/u/0/#all/149c0690dc6ce24c misc https://www.facebook.com/mqrius/posts/10152823173381168

instead of ignoring non-parsed beeminder graph pings, zero them and annotate the comment - like, 28 1 "foo" → 28 0 "foo (was 1; zeroed by tagtime syncing)"

add an interface to export an existing graph as a pingfile and/or to your existing pingfile

expand the datapoint comment so the (subset which is being tracked of) the pingfile can be fully recovered from the beeminder graphs

* We can of course reimplement rescuetime. We can also poll for other kinds of data, like specific-computer, is-network-connected, wifi-SSID, external devices interacting, microphone loud-quiet, camera bright-dark, typing, gps, computer sleeping and waking up

window 'prompt' should mirror actual ping_file, even if it changes from outside this program

// ------------------------ //

require app

--- main module ---

require ping_file, ping_seq from aux
require sync

@rc || @rc ← {period:45, ping_sound:'loud-ding.wav', auth:{}}

show app in dock iff there are >0 windows open. use icon = resources/tagtime.png.
show a tray menu. icon: resources/tray.png, tooltip: 'TagTime', menu:
	'Preferences' -> open_window('preferences')
	'Edit Pings' -> open_window('prompt')
	'Quit' -> app.quit()

open_window name ← open html window with file './'+name+'.html'

CLI commands are
	start
		log 'BEGIN','last ping was', t ← (ping_seq -! <=now) max .time, '(', now - t, 'ago )'
		log 'SORRY','update checks not implemented!'
		for(;;):
			let next ← (ping_seq -! >(ping_file[-1].time || now)) min
			at next.time:
			log 'PING','for',next.time
			ping_file ~= [next]
			open_window('prompt')
	prompt <time>? <last_tags>?
		open_window('prompt').show_mock([{time:time-2000, period:45, tags:last_tags}, {time:time, period:45}])
	repl -> start a repl
	pref -> open_window('preferences')
	sync -> sync() and don`t gui

--- sync module ---

require ping_file, beeminder from aux

module is just a function({dry:}):

log 'SYNC'
action_sets ←
	run in parallel×10: (@rc).beeminder *
		name, tagstr ← it
		beeminder GET "/users/"+(name ≈ '/'->'/goals/')+"/datapoints.json"
		↩ generate_actions(name,
			(@ping_file) -! tagdsl_eval(tagstr, .tags) .sort(.time),
			beeminder_pings(it) )
action_sets *cat .msgs * log
if !dry: run in parallel×10: action_sets *cat .cmds *
	⋈⋈ magical beeminder api call (it) ⋈⋈

pluralize ← λ(n,noun){↩ n+' '+noun+(n===1?'':'s')}

// // beeminder api datapoints → [{time: period: tags: id: group:}]
// beeminder api datapoints → [{time: period: tags: id:}]
beeminder_pings ← λ(datapoints){↩ datapoints.filter(λ(v){↩ v.value!==0 && v.comment.match(/pings?:/)}).map(λ(v){
	pings ← v.comment.match(/pings?:(.*)/)[1].trim().replace(/ \[..:..:..\]$/,'').split(', ')
	r ← pings.map(λ(t){↩ {time:v.timestamp, period:v.value*60/pings.length, tags:t, id:v.id}})
	// r.map(λ(v){v.group = r})
	↩ r})._.flatten(true)._.sortBy('time') }

tagdsl_eval ← λ(f,tags){t←;
	tags = tags.replace(/\(.*?\)/g,' ').trim().split(/ +/)
	check ← λ(v){↩ _.contains(tags,v)}
	↩ f isa Array? f.every(check) : f[0:2]=='! '? !check(f.slice(2)) : f.split(' ').some(check) }

generate_actions ← λ(name,f_pings,b_pings){t←;
	f_pings sort= .time
	b_pings sort= .time
	(f_pings ~ b_pings) * (.group_time = round .time to 86400*2/3 mod 86400)
	t ← (b_pings -! .group_time ≠ .time); if t ≠ []: throw 'so confused', t

	f_pings * (if it ≈ bv ∈ b_pings on [.group_time, .tags, .period, .matched]: it.matched = bv.matched = true) // should run in O(n)
	add_pings  ← f_pings - .matched; add_pings  * (.add = true)
	kill_pings ← b_pings - .matched; kill_pings * (.kill = true)

	actions ← (add_pings ~ b_pings) group([.group_time, .period]) * [1]
		- !.some(.add || .kill) // no change
		*cat
			.every(.add) -> // log and ¬bee: CREATE
				[['CREATE',{timestamp:it[0].group_time, value:it.length*it[0].period/60, comment:pluralize(it.length,'ping')+': '+(it * .tags join(', '))}]]
			.every(.kill) -> // ¬log and bee: DELETE
				it * ['DELETE',{timestamp:.time,id:.id}]
			else -> // log and bee: UPDATE?
				update ← t max(.length); kill ← (t - (=update)) / ~
					where t ← it - (.add || .kill) group(.id) * [1]
				it ~= kill * (.kill = true; clone(it) .add= true .id= null)
				set ← it - .kill; kill ← it -! .kill
				// aaaaaa.
				id ← update? update[0].id : kill[0].id
				[['UPDATE',id,{timestamp:set[0].group_time, value:set.length*set[0].period/60, comment:pluralize(set.length,'ping')+': '+set._.map('tags').join(', ')}, set.length - kill.length]] ~
					kill - (.id == id) * ['DELETE',{timestamp:.time, id:.id}]
	actions = actions._.groupBy(0)
	CREATE ← (actions.CREATE||[]) * [1]
	UPDATE ← (actions.UPDATE||[])
	DELETE ← (actions.DELETE||[]) * [1] uniq(.id)
	ymd ← λ(v){↩ moment(v.timestamp).utc().format('YYYY-MM-DD')}
	↩ {
		// it's super silly to separate messages and commands like this
		msgs:
			CREATE * 'BEE_SYNC + '+name+' '+ymd(it)+' '+it.comment ~
			UPDATE * 'BEE_SYNC = '+name+' '+ymd(it[2])+' '+it[2].comment ~
			DELETE * 'BEE_SYNC - '+name+' '+ymd(it)+' '+it.id ,
		cmds:
			CREATE.length? [λ(){ beeminder POST /users/$(name ≈ '/'->'/goals/')/datapoints/create_all.json {datapoints:JSON.stringify(CREATE)} }] : [] ~
			UPDATE sort([3]) * (λ(){ beeminder PUT /users/$(name ≈ '/'->'/goals/')/datapoints/$(it[1]).json it[2] }) ~
			DELETE * (λ(){ beeminder DELETE /users/$(name ≈ '/'->'/goals/')/datapoints/$(it[1]).json }) ,
		} }

--- aux module ---

export rc ← file app.getDataPath()+'/settings.json'

export ping_file ← file app.getDataPath()+'/pings.log'

ping_file is an array of {time :: unix time, period :: float, tags :: str}, parsed out of its lines:
	// 2014-03-26/19:51:56-07:00(p22.5)? a b c \(a: comment\)
	read:
		≈/^(\d+)([^\[]+)/ -> {time:it[1], period:(@rc).period, tags:it[2].trim()}
		≈/^(?=....-)([^\sp]+)⟨p(\S+)⟩? (.*)$/ -> {time:it[1], period:it[2] || 45, tags:it[3].trim() unless ='<unanswered>'}
	show: (.time as 'YYYY-MM-DD/HH:mm:ssZ')+('p'+.period unless .period=45)+' '+(.tags || '<unanswered>')

beeminder api:
	no library, just http requests (which uses node-callback)
	root is 'https://www.beeminder.com/api/v1/'
	append {auth_token: (@rc).auth.beeminder} to querystring
	after a call:
		it = .json
		.error -> throw .error
		.errors.length > 0 -> throw .errors

export ping_seq ←
	let epoch = {seed:666, time:1184083200} // the birth of timepie/tagtime!
	let next_s it = t ← seqs * .time; do ping_next it while ! keep it; while it.time ∈ t: it.time += 1; ↩ it
		where ping_next it = .seed *= 7^5 mod= 2^31-1; .time += max(1,round(-45*60*ln(.seed / 2^31-1))) // see p37 of Simulation by Ross & ran0 from Numerical Recipes
		where keep it = .seed as int31 as bits reverse as int31 / 2^31-1 <= .fraction
	let period = (@rc).period*60
	let time = seqs*.time *min
	let get = {time:←, period:←} .period/= 60
	let next = next_s(seqs *min .time)
	let ensure = cache period. if !seqs || period changed || x < time:
		set seqs ← 0..ceil(n) * (clone(epoch) .seed+= it) * next_s $ [-1].fraction= 1 - ceil(n)-n
			where n = 45*60 / period
	↩
	(this -! <=x) max -> ensure(); do next() until time > x; undo last next(); get // ping_seq.le
	(this -! >x) min  -> ensure(); do next() until time > x; get // ping_seq.gt

--------------------------------- timer-tab.com --------------------------------
	// this is a first-pass sketch of a clone of timer-tab.com. the intent is to experiment with it more *after* it's been first rendered.
	// major implementation requirement: auto-kerning or at least separation-of-concerns kerning
	// implentation: i expect the stripe cut out will be aligned to pixels

	i want a webapp, single page no scroll, offline it fully

	as the central element, a 900×150px box split into three similar controls
		* [h]:[m] [s] / [> start countdown]
		* [h]:[m] [s] / [> start alarm clock]
		*             / [> start stopwatch]

	start buttons change current control and begins action
		action has a value :: duration

	control action appears below control, with same width

	countdown action: count time down from control fields as .value / [|| pause]
	alarm action: count time down from (control fields - now) as .value / until (control fields as hh:mm)
		control fields represent the next datetime matching them
	stopwatch action: count time up from 0 as .value / [|| pause]

	if counting time down reaches 0, stop counting, and append to control action
		[# stop] button (removing any existing button) / embed http://youtu.be/PS5KAEgrtMA

	pause button pauses or resumes count and toggles self with [> resume]
	stop button stops a video embed and greys out self (if replacing a button) or removes self (if there was no button to start with)

	--- style ---

	plain white background is default. background images are centered and fill-sized.
	font is Lato

	button,field:
		color is #666 or #333 on hover
		bg #fff.7 or bg #fff.95 on hover
		ease-in-out these over 0.3s
	button text is 13px uppercase. '>' = play glyph, '||' = pause glyph, '#' = stop glyph
	buttons are 4px rounded

	glyphs are #ccc 32×32px. round visual corners 1.5px.
	play glyph: filled 1,1,1× triangle with one edge flush left
	pause glyph: filled with 0.19× centered vertical stripe cut out
	stop glyph: filled

	':' in fields adds nothing to layout size
	field font is 35px
	fields have space for /\d\d/
	's' fields are 0.7× size
	start buttons are kept same width

	counter font is 105px or reduced to keep width comfortable
	counter font is #444 and α=.3 when paused (ease-in-out over 0.3s)
	alarm "until" font is 15px

	two stripes project from the current control to edges of window, overlapping on the control
		stripes have bg #d0d0d0.58
		stripes move smoothly when they are moved

	action.value shows in page title w/ seconds truncated if hours>0
		and in page icon, similarly
