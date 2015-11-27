import sublime, sublime_plugin
import os, re

data = {
	'ζ': 'Packages/JavaScript/JavaScript.tmLanguage',
	'python': 'Packages/Python/Python.tmLanguage',
	'bash': 'Packages/ShellScript/Shell-Unix-Generic.tmLanguage',
	}

def t(view):
	print('[fyi] syntax:',view.settings().get('syntax'))
	if not os.path.basename(view.file_name()).find('.'): return

	t = re.match(r"#!\s*(\S+)\s*(\S+)?", view.substr(view.full_line(1)))
	if not t: return
	a = t.group(1).split('/')[-1]
	ι = t.group(2) if a == 'env' else a

	if ι in data and view.settings().get('syntax') != data[ι]: view.set_syntax_file(data[ι])

class ShebangSyntaxListener(sublime_plugin.EventListener):
	def on_load(self, view): t(view)
	def on_post_save(self, view): t(view)
