import sublime, sublime_plugin
import re

# i wanna styles of different boldness, like, ===== is bolder than -----, and i wanna switch between them iff i hit the divider key and the length doesn't change
# and maybe if you hit the command again it should unmake the divider?

class MakeDividerCommand(sublime_plugin.TextCommand):
	def run(self,edit,length):
		view = self.view
		e_table_ = {'rb':'#', 'py':'#', 'sh':'#', 'js':'/', 'ζ₂':'/', 'bashrc':'#'}
		def e_table(v): return e_table_[v] if v in e_table_ else '-'
		s_table = {
			'#': [r'^#+.*#+$',r'^#+\s*(.+?)\s*#+$','#',''],
			'-': [r'^-+.*-+$',r'^-+\s*(.+?)\s*-+$','-',''],
			'/': [r'^// ?-+.*-+ ?//$',r'^// ?-+(?://)? *(.+?) *(?://)?-+ ?//$','-','// ']
			}
		ext = '' if view.file_name() is None else re.match(r'^.*?(?:\.([^.]*))?$',view.file_name()).group(1) or ''
		test, match, fill, ends = s_table[e_table(ext)]
		for region in [v for v in view.sel()][::-1]:
			line = view.line(region)
			s = view.substr(line)
			if re.match(test,s):
				s = re.match(match,s).group(1)
			else:
				s = s.strip()
			def len_a(v): return sum([len(v) for v in v])
			if s == '':
				r = [ends,'',ends[::-1]]
				len_ = length - len_a(r)
				r[1] = fill * len_
			else:
				r = [ends,'',' ',s,' ','',ends[::-1]]
				len_ = length - len_a(r)
				while len_ < 6: len_ += 10
				r[1] = fill * ((len_+1)//2)
				r[5] = fill * (len_//2)
			view.replace(edit,line,''.join(r))
