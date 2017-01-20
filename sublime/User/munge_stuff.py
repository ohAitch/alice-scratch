# make use of the fact that urls can't contain newlines

# restructure link copying and manipulation (in sublime plugins, bashrc, ζ, possibly more (path finder? chrome url bar?)) to have a centralized normalization format and management for labelling text and usage of url formatters
# also to have a consistent way to interact with sublime and the pastebin
# could do this in a way that routes everything through ζ (there are issues with being tied into ζ, but they're easily avoided)

# maybe require('wav') and npm('wav@ should be links to http://npmjs.com/package/wav
# `agentyduck.blogspot.com` really ought to be a valid link (both in parsing and in producing)
# `~/code/scratch/sublime/build.ζ` really ought to be a valid link (both in parsing and in producing)

# the clickable search results are currently implemented in a horrifying way, because we are not properly associating data across multiple contexts that make it hard to share data. with the right builtins, this is easily resolveable.

import sublime, sublime_plugin
from sublime import Region
import os, subprocess, re, urllib, json

t = (os.environ.get('PATH') or '').split(':')
if not '/usr/local/bin' in t: os.environ['PATH'] = ':'.join(t+['/usr/local/bin'])

def ζfresh(*a): return subprocess.check_output(['ζ','--fresh']+list(a)).decode('utf-8')
def ζ(*a): return subprocess.check_output(['ζλ']+list(a)).decode('utf-8')
def E(ι): return json.dumps(ι)

################################## munge_stuff #################################
URL = r'\b(?:https?://|(?:file|mailto):)(?:[^\s“”"<>]*\([^\s“”"<>]*\))?(?:[^\s“”"<>]*[^\s“”"<>)\]}⟩?!,.:;])?'
FIND_RESULT = r'^(?:code|consume|documents|history|notes|pix)/.{1,80}:\d+:'

def merge_overlapping_regions(ι):
	for i in range(len(ι)-1):
		if ι[i].intersects(ι[i+1]):
			ι[i+1] = ι[i].cover(ι[i+1])
			ι[i] = None
	return [ι for ι in ι if ι]
def expand_empty_region_to_line(view,ι): return view.line(ι) if ι.empty() else ι
def expand_empty_region_to_url(view,ι,mouse_mode=False):
	if not ι.empty(): return ι
	l = expand_empty_region_to_line(view,ι)
	if l.size() > 1000000: return ι
	for REG in [URL, re.compile(FIND_RESULT,re.MULTILINE)]:
		for t in re.finditer(REG,view.substr(l)):
			s = l.a + t.start(); e = l.a + t.end()
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
def left_trim_regions(view,regions): return [left_trim_region(view,ι) for ι in regions]
def expand_empty_region_to_whole_buffer(view,regions): return [Region(0,view.size())] if len(view.sel()) == 1 and view.sel()[0].empty() else view.sel()

class open_context(sublime_plugin.TextCommand):
	def run(self,edit,type,focus=True,mouse=False):
		view = self.view
		ts = view.sel()[0]; h = [view.rowcol(ι)[0] for ι in [ts.begin(), ts.end()]]
		if type == "github" or type == "terminal":
			ζ('type ← '+E(type)+'; view_file_name ← '+E(view.file_name())+'; view_sel_0_rows ← '+E(h)+'; focus ← '+E(focus)+"""
				if (type==='github'){
					//! should be something more like: go_to('github',view_file_name,{focus,view_sel_0_rows})
					github_remote_origin ← ι=>{
						ι ← φ(ι).root('/')
						root ← ι; while (root+'' !== '/' && !root.φ`.git`.BAD_exists()) root = root.φ`..`
						if (root+'' !== '/') {
							ι = (ι+'').slice((root+'/').length)
							t ← root.φ`.git/config`.ini['remote "origin"'].url.match(/github\.com[:/](.+)\/(.+)\.git/)
							↩ encodeURI('http://github.com/'+t[1]+'/'+t[2]+'/blob/'+root.φ`.git/HEAD`.text.match(/refs\/heads\/(.+)/)[1]+'/'+ι) } }
					t ← github_remote_origin(view_file_name||'')
					if (!t){ hsᵥ`hs.alert(${'did not find github remote origin for '+view_file_name},4)`; ↩ }
					h ← view_sel_0_rows; fm ← ι=> 'L'+(ι+1)
					to_url ← t+(h[0]===0 && h[1]===0? '' : '#'+(h[0]===h[1]? fm(h[0]) : fm(h[0])+'-'+fm(h[1])))
					go_to('url',to_url,{focus}) }
				else if (type==='terminal')
					go_to('path', view_file_name || process.env.HOME, {focus,in_app:'terminal'})
				""")
		elif type == "link":
			if mouse: t = view.sel()[0]; ι = [] if not t.empty() else [ι for ι in [expand_empty_region_to_url(view, view.sel()[0], True)] if not ι.empty()]
			else: ι = expand_empty_regions_to_urls_or_lines(view, view.sel())
			if mouse and len(ι): view.sel().clear(); view.sel().add(Region(ι[0].end(),ι[0].end())) # workaround for a bug
			for ι in ι: t = view.substr(ι); ζ('go_to('+E('path' if re.match(FIND_RESULT,t) else 'url')+','+E(t)+',{focus:'+E(focus)+',sb_view_file_name:'+E(view.file_name() or '')+'})')

class inline_eval_zeta(sublime_plugin.TextCommand):
	def run(self,edit):
		# this is a perfect candidate for a state-saving program like a repl; you can load it with functions and then eval them
		view = self.view; sel = view.sel()
		sel = expand_empty_regions_to_lines(view, sel)
		sel = left_trim_regions(view, sel)
		ι = [view.substr(ι) for ι in sel]
		r = json.loads(ζ("""
			hook_stdouterr ← ()=>{
				r ← ['stdout','stderr'].map(stdio=>{
					o ← process[stdio].write; r ← []; process[stdio].write = λ(ι){r.push(ι)}; ↩ ()=>{ process[stdio].write = o; ↩ r.join('') }
					}); ↩ ()=> r.map(ι=> ι()) }
			global.i = 0
			JSON.parse(ι).map(ι=>{
				r ← hook_stdouterr()
				t←; e←; (λ __special_es__u7h7zxgvi__(){try {global.code = ι; global.require = require; t = (0,eval)(ζ_compile(ι+''))} catch (e_) {e = e_}})()
				r = r(); r = [(r[0]? r[0]+'\\n' : '')+r[1]]
				t !== undefined && r.push(t+'')
				e !== undefined && r.push(typeof(e.stack)==='string'? e.stack.replace(/(?:\\n    at eval.*)?\\n    at eval.*\\n    at evalζ.*\\n    at __special_es__u7h7zxgvi__[^]*/,'\\n    at <eval>') : '<error> '+e)
				↩ r.join('') }) """,E(ι)))
		for i in range(len(sel))[::-1]:
			view.replace(edit, sel[i], r[i])

class inline_compile_zeta_js(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view; sel = view.sel()
		sel = expand_empty_region_to_whole_buffer(view, sel)
		sel = expand_empty_regions_to_lines(view, sel)
		for reg in list(sel)[::-1]:
			ι = view.substr(reg)
			r = ζfresh('ζ_compile(ι)',ι)
			if r == ι: r = ζfresh('ζ_compile["⁻¹"](ι)',ι)
			view.replace(edit, reg, r)

class nice_url(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		sel = expand_empty_regions_to_urls_or_lines(view, view.sel())
		for reg in list(sel)[::-1]:
			ι = view.substr(reg)
			t = ζ('nice_url(ι)',ι)
			if t is not ι: view.replace(edit, reg, t)

class _(sublime_plugin.EventListener):
	def on_post_save(self,view): view.substr(Region(0,2)) == '#!' and ζ('shᵥ`chmod +x ${ι}`',view.file_name())

class goto_last_tab(sublime_plugin.WindowCommand):
	def run(self):
		window = self.window
		vs = window.views()
		len(vs) and window.focus_view(vs[-1])

class run_project(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		view.run_command("save")
		ζfresh('require_new(φ`~/.bashrc.ζ`).run_project('+E(view.file_name())+')')
