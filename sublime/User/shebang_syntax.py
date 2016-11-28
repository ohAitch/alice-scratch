import sublime, sublime_plugin
import os, re

data = {
	'ζ': 'Packages/JavaScript/JavaScript.tmLanguage',
	'python': 'Packages/Python/Python.sublime-syntax',
	'bash': 'Packages/ShellScript/Shell-Unix-Generic.sublime-syntax',
	'.txt': 'Packages/Text/Plain text.tmLanguage',
	'.blog': 'Packages/Text/Plain text.tmLanguage',
	}

def detect_syntax(view):
	ι = None
	t = re.match(r"#!\s*(\S+)\s*(\S+)?", view.substr(view.full_line(1)))
	if t: a = t.group(1).split('/')[-1]; ι = t.group(2) if a == 'env' else a
	else: ι = os.path.splitext(view.file_name())[1]
	return data[ι] if ι in data else view.settings().get('syntax')

def t(view): t = detect_syntax(view); t == view.settings().get('syntax') or view.set_syntax_file(t)
class _(sublime_plugin.EventListener):
	def on_load(self, view): t(view)
	def on_post_save(self, view): t(view)

class get_syntax(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		print('[fyi]','syntax:',view.settings().get('syntax'))
