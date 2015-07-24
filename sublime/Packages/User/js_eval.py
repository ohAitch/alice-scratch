import sublime, sublime_plugin
import subprocess
import re
import json

# "oh no, what if our expand-to-line ends up overlapping the regions?" -> fixed
def expand_empty_regions_to_line_safely(view,regions):
	t = [view.line(v) if v.empty() else v for v in regions]
	for i in range(len(t)-1):
		if t[i].intersects(t[i+1]):
			t[i+1] = t[i].cover(t[i+1])
			t[i] = None
	t = [v for v in t if v]
	return t

class JsEvalCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		t = expand_empty_regions_to_line_safely(view, view.sel())
		vs = json.dumps([view.substr(v) for v in t])
		r = subprocess.check_output(['/usr/local/bin/node','--harmony','/usr/local/bin/ζ₂','--es',vs]).decode('utf-8')
		r = re.sub(r'\x1b\[.*?m','',r)
		r = r.split('DukKUhmtGonKdELGvFycnF0WTZXRGiJ2e1P1SBD5yg')
		for i in range(len(t))[::-1]:
			view.replace(edit, t[i], r[i])
