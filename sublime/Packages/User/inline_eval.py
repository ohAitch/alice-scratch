import sublime, sublime_plugin
import subprocess
import re
import json
import io

def expand_empty_regions_to_lines(view,regions):
	t = [view.line(v) if v.empty() else v for v in regions]
	for i in range(len(t)-1):
		if t[i].intersects(t[i+1]):
			t[i+1] = t[i].cover(t[i+1])
			t[i] = None
	t = [v for v in t if v]
	return t
def expand_empty_region_to_whole_buffer(view,regions):
	return [sublime.Region(0,view.size())] if len(view.sel()) == 1 and view.sel()[0].empty() else view.sel()

def echo_string_pipe_process__check_output(string,args):
	t = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
	t = t.communicate(bytes(string,'UTF-8'))
	# ignore stderr
	return t[0].decode('utf-8')

class InlineEvalZetaCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view; sel = view.sel()
		sel = expand_empty_regions_to_lines(view, sel)
		vs = json.dumps([view.substr(v) for v in sel])
		r = subprocess.check_output(['/usr/local/bin/node','--harmony','/usr/local/bin/ζ₂','--es',vs]).decode('utf-8')
		r = re.sub(r'\x1b\[.*?m','',r) #! hack
		r = r.split('DukKUhmtGonKdELGvFycnF0WTZXRGiJ2e1P1SBD5yg')
		for i in range(len(sel))[::-1]:
			view.replace(edit, sel[i], r[i])

class InlineCompileZetaJsCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view; sel = view.sel()
		sel = expand_empty_region_to_whole_buffer(view, sel)
		sel = expand_empty_regions_to_lines(view, sel)
		for i in range(len(sel))[::-1]:
			r = echo_string_pipe_process__check_output(view.substr(sel[i]), ['/usr/local/bin/node','--harmony','/usr/local/bin/ζ₂','--ζj'])
			view.replace(edit, sel[i], r)

class InlineCompileJsZetaCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view; sel = view.sel()
		sel = expand_empty_region_to_whole_buffer(view, sel)
		sel = expand_empty_regions_to_lines(view, sel)
		for i in range(len(sel))[::-1]:
			r = echo_string_pipe_process__check_output(view.substr(sel[i]), ['/usr/local/bin/node','--harmony','/usr/local/bin/ζ₂','--jζ'])
			view.replace(edit, sel[i], r)
