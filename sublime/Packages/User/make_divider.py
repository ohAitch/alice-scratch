import sublime, sublime_plugin
import re

# i wanna styles of different boldness, like, ===== is bolder than -----, and i wanna switch between them iff i hit the divider key and the length doesn't change
# and maybe if you hit the command again it should unmake the divider?

class MakeDividerCommand(sublime_plugin.TextCommand):
	def run(self,edit,length):
		e_table_ = {'rb':'#', 'py':'#', 'sh':'#', 'js':'/', 'ζ₂':'/', 'bashrc':'#'}
		def e_table(v): return e_table_[v] if v in e_table_ else '-'
		s_table = {
			'#': ["^#+.*#+$","^#+\s*(.+?)\s*#+$",['',''],'#'],
			'-': ["^-+.*-+$","^-+\s*(.+?)\s*-+$",['',''],'-'],
			'/': ["^//-+.*-+//$","^//-+//\s*(.+?)\s*//-+//$",['//','//'],'-']
			}
		ext = '' if self.view.file_name() is None else re.match("^.*?(?:\.([^.]*))?$",self.view.file_name()).group(1) or ''
		data = s_table[e_table(ext)]
		for region in [v for v in self.view.sel()][::-1]:
			len_ = length
			line = self.view.line(region)
			s = self.view.substr(line)
			if re.match(data[0],s):
				s = re.match(data[1],s).group(1)
			else:
				s = s.strip()
			if s == '':
				r = data[2][0] + (data[3]*(len_ - len(data[2][0])*2)) + data[2][0][::-1]
			else:
				t = len(data[2][0]) + len(data[2][1])
				s = ' '+s+' '
				while len_ - len(s) < 6 + t: len_ += 10
				r = \
					data[2][0]      +(data[3]*((len_-len(s)+1)//2 - t))+data[2][1]+ \
					s+ \
					data[2][1][::-1]+(data[3]*((len_-len(s)  )//2 - t))+data[2][0][::-1]
			self.view.replace(edit,line,r)
