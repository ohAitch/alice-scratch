import sublime, sublime_plugin
import os, re

data = {
	'python': 'Packages/Python/Python.tmLanguage',
	'bash': 'Packages/ShellScript/Shell-Unix-Generic.tmLanguage',
}

class ShebangSyntaxListener(sublime_plugin.EventListener):
	def on_load(self, view):
		print('[fyi] syntax:',view.settings().get('syntax'))
		view.run_command('shebang_syntax')

	def on_post_save(self, view):
		print('[fyi] syntax:',view.settings().get('syntax'))
		view.run_command('shebang_syntax')

class ShebangSyntaxCommand(sublime_plugin.TextCommand):
	def run(self, edit):
		view = self.view

		if not os.path.basename(view.file_name()).find('.'): return

		t = re.match(r"#!\s*(\S+)\s*(\S+)?", view.substr(view.full_line(1)))
		if not t: return
		a = t.group(1).split('/')[-1]
		ι = t.group(2) if a == 'env' else a

		if not ι in data: return

		if view.settings().get('syntax') != data[ι]: view.set_syntax_file(data[ι])
