import sublime, sublime_plugin
import os
import re

def bash_encode(ι): return re.escape(ι)
def osa_encode(ι): return '"'+re.sub(r'"','\\"',re.sub(r'\\','\\\\\\\\',ι))+'"'

class BuildDollarCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		view.run_command("save")
		# t = "clear; cd "+bash_encode(os.path.dirname(view.file_name()))+"; echo $green$(this)$reset ↩\\;x; ↩"
		t = "clear; cd "+bash_encode(os.path.dirname(view.file_name()))+"; echo $green~${PWD:${#HOME}}$reset ↩\\; x; ↩; x" # wat
		os.system("osascript -e "+bash_encode("tell application \"terminal\"")+" -e "+bash_encode("do script "+osa_encode(t))+" -e end\\ tell")
