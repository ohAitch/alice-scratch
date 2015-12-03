import sublime, sublime_plugin
import os, re

data = {
	'ζ': 'Packages/JavaScript/JavaScript.tmLanguage',
	'python': 'Packages/Python/Python.tmLanguage',
	'bash': 'Packages/ShellScript/Shell-Unix-Generic.tmLanguage',
	'.txt': 'Packages/Text/Plain text.tmLanguage',
	'.blog': 'Packages/Text/Plain text.tmLanguage',
	}

def detect_syntax(view):
	ι = None
	if os.path.basename(view.file_name()).find('.'): #! wat
		t = re.match(r"#!\s*(\S+)\s*(\S+)?", view.substr(view.full_line(1)))
		if t: a = t.group(1).split('/')[-1]; ι = t.group(2) if a == 'env' else a
		else: ι = os.path.splitext(view.file_name())[1]
	return data[ι] if ι in data else view.settings().get('syntax')

def t(view):
	ι = detect_syntax(view)
	if view.settings().get('syntax') != ι: view.set_syntax_file(ι)
	print('[fyi] syntax:',ι)

class _(sublime_plugin.EventListener):
	def on_load(self, view): t(view)
	def on_post_save(self, view): t(view)
