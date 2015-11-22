import sublime, sublime_plugin
import os
import re

def sh_encode(ι): return re.escape(ι)
def osa_encode(ι): return '"'+re.sub(r'"','\\"',re.sub(r'\\','\\\\\\\\',ι))+'"'

class BuildDollarCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		view.run_command("save")
		t = "clear; cd "+sh_encode(os.path.dirname(view.file_name()))+"; echo $green~${PWD:${#HOME}}$reset ↩\\; x; ↩; x"
		os.system("osascript -e "+sh_encode("tell application \"terminal\"")+" -e "+sh_encode("do script "+osa_encode(t))+" -e end\\ tell")
