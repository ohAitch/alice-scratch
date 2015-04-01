import sublime, sublime_plugin
import subprocess
import re

class JsEvalCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		#! oh no, what if our expand-to-line ends up overlapping the regions?
		view = self.view
		def js_eval(reg):
			v = view.substr(reg)
			if v is '':
				reg = view.line(reg)
				v = view.substr(reg)
			r = subprocess.check_output(['/usr/local/bin/node','--harmony','/usr/local/bin/ζ₂','-e',v]).decode('utf-8')
			r = re.sub(r'\x1b\[.*?m','',r)
			if not re.search("\n$",v):
				r = re.sub(r'\n$',"",r)
			return [reg, r]
		for reg, v in [js_eval(v) for v in view.sel()][::-1]:
			view.replace(edit, reg, v)
