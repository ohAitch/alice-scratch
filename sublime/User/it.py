# make use of the fact that urls can't contain newlines

# restructure link copying and manipulation (in sublime plugins, bashrc, ζ, possibly more (path finder? chrome url bar?)) to have a centralized normalization format and management for labelling text and usage of url formatters
# also to have a consistent way to interact with sublime and the pastebin

# maybe require('wav') and npm`wav@ should be links to http://npmjs.com/package/wav
# `agentyduck.blogspot.com` really ought to be a valid link (both in parsing and in producing)
# `~/code/scratch/sublime/build.ζ` really ought to be a valid link (both in parsing and in producing)

# oberon got this already
# ◍ To launch applications or execute commands, you first type them somewhere (anywhere, it doesn’t matter), and then middle-click them:
# this syntax-colors them and red-underlines them
# ◍ You need a program launcher? Create a new text file with the programs you need.

# the clickable search results are currently implemented in a horrifying way, because we are not properly associating data across multiple contexts that make it hard to share data. with the right builtins, this is easily resolveable.

# mix sbᵥ and js- with data flow, it is practical

#################################### prelude ###################################
import sublime,sublime_plugin
from sublime import Region
import os,subprocess,re,urllib,json,threading

t = (os.environ.get('PATH') or '').split(':')
if not '/usr/local/bin' in t: os.environ['PATH'] = ':'.join(t+['/usr/local/bin'])

def ζfresh_async(*a): return subprocess.Popen(['ζ','--fresh']+list(a))
def ζfresh(*a): return subprocess.check_output(['ζ','--fresh']+list(a)).decode('utf-8')
def ζa(*a): return subprocess.Popen(['ζλ']+list(a))
def ζ(*a): t = subprocess.check_output(['ζλ']+list(a)).decode('utf-8') ;return None if t == '' else json.loads(t)
def E(ι): return json.dumps(ι)
def serialize(ι):
	if isinstance(ι,sublime.View): return { "type":'sublime.View' ,"id":ι.id() }
	else: return 'error_ls1w8idny'

################################################################################
URL = r'\b(?:(https?|chrome|chrome-extension)://|(?:file|mailto):)(?:[^\s“”"<>]*\([^\s“”"<>]*\))?(?:[^\s“”"<>]*[^\s“”"<>)\]}⟩?!,.:;])?'
FIND_RESULT = r'^(?:code|consume|documents|history|notes|pix)/.{1,80}?:\d+:'

def merge_overlapping_regions(ι):
	for i in range(len(ι)-1):
		if ι[i].intersects(ι[i+1]):
			ι[i+1] = ι[i].cover(ι[i+1])
			ι[i] = None
	return [ι for ι in ι if ι!=None]
def expand_empty_region_to_line(view,ι): return view.line(ι) if ι.empty() else ι
def expand_empty_region_to_fullline(view,ι): return view.full_line(ι) if ι.empty() else ι
def expand_empty_region_to_url(view,ι,mouse_mode=False):
	if not ι.empty(): return ι
	l = expand_empty_region_to_line(view,ι)
	if l.size() > 1000000: return ι
	for REG in [URL,re.compile(FIND_RESULT,re.MULTILINE)]:
		for t in re.finditer(REG,view.substr(l)):
			s = l.a + t.start() ;e = l.a + t.end()
			if (s < ι.a < e if mouse_mode else s <= ι.a <= e):
				return Region(s,e)
	return ι
def left_trim_region(view,ι):
	t = len(re.match(r'^\s*',view.substr(ι)).group(0))
	if ι.a <= ι.b: ι.a += t
	else:          ι.b += t
	return ι
def expand_empty_regions_to_urls_or_lines(view,ι): return merge_overlapping_regions([expand_empty_region_to_line(view,expand_empty_region_to_url(view,ι)) for ι in ι])
def expand_empty_regions_to_lines(view,regions): return merge_overlapping_regions([expand_empty_region_to_line(view,ι) for ι in regions])
def expand_empty_regions_to_fulllines(view,regions): return merge_overlapping_regions([expand_empty_region_to_fullline(view,ι) for ι in regions])
def left_trim_regions(view,regions): return [left_trim_region(view,ι) for ι in regions]
def expand_empty_region_to_whole_buffer(view,regions): return [Region(0,view.size())] if len(regions) == 1 and regions[0].empty() else regions

class open_context(sublime_plugin.TextCommand):
	def run(self,edit,type,focus=True,mouse=False):
		view = self.view
		if type == "github":
			ζfresh_async('try{ go_to(github_url('+E(serialize(view))+'),{focus:'+E(focus)+'}) }catch(e){ e.human || ‽(e) ;hsᵥ`hs.alert(${e.human},4)` }')
		elif type == "terminal":
			ζ(""" here ← """+E(view.file_name())+""" ;go_to('path' ,here? φ(here).φ`..`+'' : process.env.HOME ,{focus:"""+E(focus)+""",in_app:'terminal'}) ;∅""")
		elif type == "link":
			if mouse: t = view.sel()[0] ;ι = [] if not t.empty() else [ι for ι in [expand_empty_region_to_url(view,view.sel()[0] ,True)] if not ι.empty()]
			else: ι = expand_empty_regions_to_urls_or_lines(view,view.sel())
			if mouse and len(ι): view.sel().clear() ;view.sel().add(Region(ι[0].end(),ι[0].end())) # workaround for a bug
			for ι in ι: t = view.substr(ι) ;ζ('go_to('+E('path' if re.match(FIND_RESULT,t) else None)+','+E(t)+',{focus:'+E(focus)+',sb_view_file_name:'+E(view.file_name() or '')+'}) ;∅')

class inline_eval_zeta(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		view.run_command("ensure_newline_at_eof")
		sel = expand_empty_regions_to_fulllines(view,view.sel())
		if any([ view.substr(ι).strip() for ι in view.sel() ]):
			ι = [ view.substr(ι) for ι in sel ]
			r = ζ("""
				JSON.parse(ι).map(ι=>{
					𐅦𐅯𐅦𐅞𐅜 ← [] ;𐅨𐅯𐅂𐅭𐅂 ← log.ι ;log.ι = single_if ≫ (ι=> 𐅦𐅯𐅦𐅞𐅜.push(ι))
					r ← catch_union2(=> ζ_eval(ι))
					r ← ι.re`;\\s*$`? '' : […𐅦𐅯𐅦𐅞𐅜,r].map(ζ_inspect.X).join('\\n') || '∅'
					log.ι = 𐅨𐅯𐅂𐅭𐅂 ;↩ r })
				|>(JSON.stringify) """,E(ι))
			for i in range(len(sel))[::-1]:
				view.replace(edit ,sel[i] ,r[i])
		else:
			ends = [ ι.end() for ι in sel ]
			r = ζ(""" [ends,code] ← JSON.parse(ι)
				ends.map(end=>{
					𐅦𐅯𐅦𐅞𐅜 ← [] ;𐅨𐅯𐅂𐅭𐅂 ← log.ι ;log.ι = single_if ≫ (ι=> 𐅦𐅯𐅦𐅞𐅜.push(ι))
					ι ← npm`string-slice@0.1.0`(code,0,end).replace(/^#!.*/,'')
					r ← catch_union2(=> ζ_eval(ι))
					r ← ι.re`;\\s*$`? '' : […𐅦𐅯𐅦𐅞𐅜,r].map(ζ_inspect.X).join('\\n') || '∅'
					log.ι = 𐅨𐅯𐅂𐅭𐅂 ;↩ r })
				|>(JSON.stringify) """,E([ ends ,view.substr(Region(0,ends[-1])) ]))
			for i in range(len(sel))[::-1]:
				ι = sel[i]
				if r[i] != '':
					view.insert(edit ,*
						[ ι.begin() ,r[i] ] if view.substr(ι).strip() == '' else
						[ ι.end() ,r[i]+'\n' ] )

class inline_compile_zeta_js(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		sel = expand_empty_region_to_whole_buffer(view,view.sel())
		sel = expand_empty_regions_to_lines(view,view.sel())
		for reg in list(sel)[::-1]:
			ι = view.substr(reg)
			r = ζfresh('ζ_compile(ι)',ι)
			if r == ι: r = ζfresh('ζ_compile.⁻¹(ι)',ι)
			view.replace(edit,reg,r)

class nice_url(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		sel = expand_empty_regions_to_urls_or_lines(view,view.sel())
		for reg in list(sel)[::-1]:
			ι = view.substr(reg)
			t = ζ('[nice_url(ι)]',ι)[0]
			if t is not ι: view.replace(edit,reg,t)

class _0(sublime_plugin.EventListener):
	def on_post_save(self,view): view.substr(Region(0,2)) == '#!' and ζ('shᵥ`chmod +x ${ι}` ;∅',view.file_name())

class goto_last_tab(sublime_plugin.WindowCommand):
	def run(self):
		window = self.window
		t = window.views() ;len(t) and window.focus_view(t[-1])
		# sbᵥ t← ;( t=window.views()[-1] )&& window.focus_view(t)

class run_project(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		view.run_command("save")
		ζfresh_async('run_project('+E(serialize(view))+')')

class toggle_comment_2(sublime_plugin.TextCommand):
	def run(self,edit,style):
		view = self.view
		for ι in merge_overlapping_regions([ ι for ι in view.sel() for ι in view.lines(ι) ])[::-1]:
			view.insert(edit,ι.begin(),style)

class zeta(sublime_plugin.WindowCommand):
	def run(self,x):
		ζ(x)
# class zeta_fresh_async(sublime_plugin.WindowCommand):
# 	def run(self,x):
# 		ζfresh_async(x)

class _2(sublime_plugin.EventListener):
	def on_query_completions(self,view,prefix,locations):
		t = ζ(""" 𐅜𐅝 ← {
			,anon:=> [anon]
			,now:=> Time() |>(ι=>[ ,ι.day_s3 ,ι.local.ymd ,ι.ymdhm ,ι.ymdhms ,ι.ymdhmss ])
			}; 𐅜𐅝[ι]? 𐅜𐅝[ι]().map(r=>[ι,r]) : ∅ """,prefix)
		if t is not None: return (t,sublime.INHIBIT_WORD_COMPLETIONS)

class make_divider(sublime_plugin.TextCommand):
	# i wanna styles of different boldness, like, ===== is bolder than -----, and i wanna switch between them iff i hit the divider key and the length doesn't change
	# and maybe if you hit the command again it should unmake the divider?
	# should probably handle indented dividers
	# if it's already an empty divider, know that, don't do the silly thing
	# maybe work by trimming divider-matchables on both sides first, instead of trying to match an entire possible-divider?
	def run(self,edit,length):
		e_table_ = {
			# 'Packages/Lisp/Lisp.sublime-syntax': ';',
			'Packages/Lua/Lua.sublime-syntax': '-',
			}
		s_table = {
			'#': [r'^#+.*#+$',r'^#+\s*(.+?)\s*#+$','#',''],
			'-': [r'^-+.*-+$',r'^-+\s*(.+?)\s*-+$','-',''],
			# ';': [r'^; ?-+.*-+ ?;$',r'^; ?-+;? *(.+?) *;?-+ ?;$','-','; ']
			}
		def data(): ι = view.settings().get('syntax') ;return s_table[e_table_[ι] if ι in e_table_ else '#']

		view = self.view
		test ,match ,fill ,ends = data()
		for region in [ι for ι in view.sel()][::-1]:
			line = view.line(region)
			s = view.substr(line)
			t = re.match(r'^(\t*)(.*)',s) ;tabs = t.group(1) ;s = t.group(2)
			if re.match(test,s):
				s = re.match(match,s).group(1)
			else:
				s = s.strip()
			def len_a(ι): return sum([len(ι) for ι in ι])
			if s.replace('#','') == '':
				r = [ends,'',ends[::-1]]
				len_ = length - len(tabs)*2 - len_a(r)
				r[1] = fill * len_
			else:
				r = [ends,'',' ',s,' ','',ends[::-1]]
				len_ = length - len(tabs)*2 - len_a(r)
				while len_ < 6: len_ += 10
				r[1] = fill * ((len_+1)//2)
				r[5] = fill * (len_//2)
			q = region == line and region.empty()
			if q: view.sel().subtract(region)
			view.replace(edit,line,tabs+''.join(r))
			if q: view.sel().add(sublime.Region(view.line(region).end()))

def detect_syntax(view):
	data = {'':''
		,'ζ':'Packages/JavaScript/JavaScript.sublime-syntax'
		,'python':'Packages/Python/Python.sublime-syntax'
		,'bash':'Packages/ShellScript/Shell-Unix-Generic.sublime-syntax'
		,'.txt':'Packages/Text/Plain text.sublime-syntax'
		}
	ι = None
	t = re.match(r"#!\s*(\S+)\s*(\S+)?" ,view.substr(view.full_line(1)))
	if t: a = t.group(1).split('/')[-1] ;ι = t.group(2) if a == 'env' else a
	else: ι = os.path.splitext(view.file_name())[1]
	return data[ι] if ι in data else view.settings().get('syntax')
def _3_t(view): t = detect_syntax(view) ;t == view.settings().get('syntax') or view.set_syntax_file(t)
class _3(sublime_plugin.EventListener):
	def on_load(self,view): _3_t(view)
	def on_post_save(self,view): _3_t(view)
class get_syntax(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		print('[fyi]','syntax:',view.settings().get('syntax'))

def _4(ι):
	ι = [ι for ι in ι if not( ι.is_dirty() or ι.file_name() is None )]
	if len(ι) == 0: ζa('say`✗`')
	else:
		r = [ι.file_name() for ι in ι]
		[ι.close() for ι in ι[::-1]]
		ζa('p('+E( r[0] if len(r) == 1 else r )+')')
class cut_(sublime_plugin.WindowCommand):
	def run(self):
		window = self.window
		ι = window.active_sheet().view()
		if ι is not None: _4([ ι ])
class cuts(sublime_plugin.WindowCommand):
	def run(self):
		window = self.window
		_4([ ι.view() for ι in window.sheets_in_group(window.active_group()) ])

################################## scrollpair ##################################
# def cache_xy(view):
# 	view.settings().set('𐅭𐅫𐅂𐅬𐅦',view.viewport_position())

# def plugin_loaded():
# 	global 𐅯𐅭𐅞𐅭𐅝
# 	𐅯𐅭𐅞𐅭𐅝 = None
# 	threading.Thread(target=synch_scroll, daemon=True).start()
# 	for window in sublime.windows():
# 		for view in window.views():
# 			cache_xy(view)
# should_close = False
# def plugin_unloaded():
# 	global should_close
# 	should_close = True

# def synch_scroll():
# 	global 𐅯𐅭𐅞𐅭𐅝
# 	v = 𐅯𐅭𐅞𐅭𐅝
# 	if v is None or v.is_loading():
# 		pass
# 	else:
# 		a_x, a_y = v.viewport_position()
# 		o_x, o_y = v.settings().get('𐅭𐅫𐅂𐅬𐅦')
# 		if a_x != o_x or a_y != o_y:
# 			for view in v.window().views():
# 				if view.id() != v.id():
# 					view.set_viewport_position((a_x,a_y+view.viewport_extent()[1]),True)
# 					cache_xy(view)
# 			cache_xy(v)
# 	if not should_close: sublime.set_timeout(synch_scroll,1)

# class set_scrollpair(sublime_plugin.TextCommand):
# 	def run(self,edit):
# 		global 𐅯𐅭𐅞𐅭𐅝
# 		cache_xy(self.view)
# 		𐅯𐅭𐅞𐅭𐅝 = self.view

# class _4(sublime_plugin.EventListener):
# 	def on_load(self,view):
# 		cache_xy(view)
# 	def on_text_command(self, v, command_name, args):
# 		if command_name == 'move_to' and args['to'] in ['bof', 'eof']:
# 			for view in v.window().views():
# 				if view.id() != v.id():
# 					view.run_command(command_name, args)
